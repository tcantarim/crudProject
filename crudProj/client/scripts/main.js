//Referencias do DOM(Inputs do formulário)
const clientId = document.querySelector('#userId')
const cliName  = document.querySelector('#name')
const cliEmail = document.querySelector('#email')
const cliUser  = document.querySelector('#username')
const cliPass  = document.querySelector('#password')
const cliAge   = document.querySelector('#age')
const cliCpf   = document.querySelector('#cpf')

//Referencia do DOM(Formulário)
const formCad  = document.querySelector("#formCad")

//Referencias do DOM(Tabela de usuários registrados)
const btnShowClients = document.querySelector("#btnShowClients")
const fieldUsers     = document.querySelector("#showUsers")
const tableUsers     = document.querySelector("#cadTable")

// --------------------------------- Actions --------------------------------- //

//Verifica se o nome de usuário ou cpf ja estão em uso
cliUser.addEventListener('focusout', async () => {
    if(cliUser.value){
        const client = await findUsername(cliUser.value)

        if(!client.error){
            changeBorder(cliUser)            
            swal("Atenção!", "Nome de usuário informado para o cadastro ja está sendo utilizado.", "warning")
        }
    }
})

cliCpf.addEventListener('focusout', async () => {
    if(cliCpf.value){
        if(!await cpfValidation(cliCpf.value)){
            changeBorder(cliCpf)
            clearField(cliCpf)
            swal("Atenção!", "CPF informado para o cadastro é inválido.", "warning");
            return
        }

        const client = await findCpf(cliCpf.value)

        if(!client.error){
            changeBorder(cliCpf)
            swal("CPF informado ja está cadastrado!", "", "warning");
            clearField(cliCpf)
        }
    }
})

cliAge.addEventListener('focusout', () => {

    if(cliAge.value < 1 || cliAge.value > 120){
        changeBorder(cliAge)
        return
    }

})

//Envio do formulário
formCad.addEventListener('submit', event => {
    event.preventDefault()

    if(!formCad.clientId.value){
        if(!vrfEmpty(cliName, cliEmail, cliUser, cliPass, cliAge, cliCpf)){
            swal("Erro!", "Preencha todos os campos corretamente para realizar o cadastro!", "error")
            return
        }
    }

    if(cliAge.value < 1 || cliAge.value > 120){
        changeBorder(cliAge)
        swal("Atenção!", "Idade informada para o cadastro é inválida.", "warning")
        clearField(cliAge)
        return
    }

    saveClient()
})

//Mostra todos os clientes cadastrados
btnShowClients.addEventListener('click', () => {
    showClients(1)
})


// --------------------------------- Functions --------------------------------- //

//Verifica se existem campos em branco
function vrfEmpty(){
    for(c in arguments){
        if(arguments[c].value == ""){
            changeBorder(arguments[c])
            arguments[c].focus()
            return false
        }
    }
    return true
}

//Salva um cliente no banco de dados
function saveClient() {
    let reqUrl
    let alertMessage

    const formData = {
        name:     formCad.name.value,
        email:    formCad.email.value,
        username: formCad.username.value,
        password: formCad.password.value,
        age:      Number(formCad.age.value),
        cpf:      formCad.cpf.value
    }

    let reqOptions = {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        }
    }

    //Verifica se o usuário está editando o registro ou criando um novo e define a rota e os parametros da requisição
    if(formCad.clientId.value){
        reqUrl = `http://localhost:3000/api/clients/update/${formCad.clientId.value}`
        alertMessage = "Cadastro alterado com sucesso!"        
        reqOptions.method = "PUT"
    } else {
        reqUrl = "http://localhost:3000/api/clients/register"
        alertMessage = "Cadastro efetuado com sucesso!"
    }

    fetch(reqUrl, reqOptions)
        .then(response => response.json())
        .then(resData => {
            if(!resData.error){
                formCad.reset()  

                swal("", alertMessage, "success") 

                if(fieldUsers.style.display === "block"){
                    showClients()
                }
            }
        })
    .catch(err => console.log({ error: err}))
}

async function showClients(byUserClick){
    const allClients = await findAllClients()

    if(allClients.length == undefined){
        fieldUsers.style.display = "none"
        if(byUserClick){            
            swal("", "Nenhum cliente cadastrado até o momento!", "info")
        }
        return
    }

    fieldUsers.style.display = "block"

    let clientTable = ""

    // <td><button class="btnRemove" onclick="removeClient('${allClients[c]._id}')">X</button></td>
    // <td><button class="btnModify" onclick="modifyClient('${allClients[c]._id}')">M</button></td>

    for (c in allClients){
        clientTable += `
        <tr id="${allClients[c]._id}">
            <td>${allClients[c].name}</td>
            <td>${allClients[c].email}</td>
            <td>${allClients[c].username}</td>
            <td>${allClients[c].age}</td>
            <td>${allClients[c].cpf}</td>
            <td><div class="btnModify" onclick="modifyClient('${allClients[c]._id}')"><i class="far fa-edit"></i></div></td>
            <td><div class="btnRemove" onclick="removeClient('${allClients[c]._id}')"><i class="far fa-trash-alt"></i></div></td>
        </tr>
        ` 
    }

    tableUsers.innerHTML = `
    <tr id='linha-0'> 
        <th>Nome</th>
        <th>E-mail</th>
        <th>Nome de usuário</th>
        <th>Idade</th>
        <th>CPF</th>
        <th>&nbsp</th>
        <th>&nbsp</th>
    </tr>
    ` + clientTable
}

async function modifyClient(clientId){
    const client = await findClientById(clientId)

    formCad.clientId.value = client._id
    formCad.name.value = client.name
    formCad.email.value = client.email
    formCad.username.value = client.username
    formCad.age.value = client.age
    formCad.cpf.value = client.cpf
}

//Remove cliente dos registros
async function removeClient(id){
    swal({
        title: "Atenção!",
        text: "Este cadastro nao poderá ser recuperado depois, deseja mesmo continuar?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then(async (willDelete) => {
        if (willDelete) {
            swal("Pronto!", "Cadastro removido com sucesso.", "success")
            try {
                const client = await findAndRemoveClient(id)
            
                showClients()
                formCad.reset()  
            } catch(err) {              
                swal("Erro!", "Não foi possível remover o cadastro selecionado.", "error")
                console.log(err)
            }
        }
    });
}

//Busca todos os clientes no baco de dados
async function findAllClients() {
    let url = `http://localhost:3000/api/clients/all`

    const options = {
        method: "GET",
        mode : "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }

    const allClients = fetch(url, options)
                        .then(response => response.json())
                        .then(resData => resData)
                    .catch(err => err)

    return allClients
}

async function findClientById(clientId){
    let url = `http://localhost:3000/api/clients/${clientId}`

    const options = {
        method: "GET",
        mode : "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }

    const client = fetch(url, options)
                        .then(response => response.json())
                        .then(resData => resData)
                    .catch(err => err)

    return client
}

//Busca um cliente no banco de dados pelo 'username'
async function findUsername(username) {
    let url = `http://localhost:3000/api/clients/username/${username}`

    const options = {
        method: "GET",
        mode : "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }

    const client = fetch(url, options)
                        .then(response => response.json())
                        .then(resData => resData)
                    .catch(err => err)

    return client
}

//Busca um cliente no banco de dados pelo 'CPF'
async function findCpf(cpf) {
    let url = `http://localhost:3000/api/clients/cpf/${cpf}`

    const options = {
        method: "GET",
        mode : "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }

    const client = fetch(url, options)
                        .then(response => response.json())
                        .then(resData => resData)
                    .catch(err => err)

    return client
}

//Busca e remove um registro de cliente
async function findAndRemoveClient(id){
    let url = `http://localhost:3000/api/clients/remove/${id}`

    const options = {
        method: "DELETE",
        mode : "cors",
        headers: {
            "Content-Type": "application/json"
        }
    }

    const client = fetch(url, options)
                        .then(response => response.json())
                        .then(resData => resData)
                    .catch(err => err)

    return client
}

//Verifica se um cpf informado é valido
async function cpfValidation(cpf) {
    if(cpf.length != 11) {
        return false
    }

    //Bloco 1 - Este bloco calcula o primeiro digito verificador    
    let acml = 0                //Acumulador
    let mult = 10               //multiplicador

    for(let c = 0; c < 9; c++){
        acml += cpf[c] * mult
        mult--     
    }
    let digitOne = (acml * 10) % 11 //calcula o resto da divisão
    if(digitOne >= 10){             //verifica se o resto da divisao é 10, caso seja considera 0
        digitOne = 0
    }
    
    //Bloco 2 - Este bloco calcula o segundo digito verificador
    acml = 0                    //zera o acumulador
    mult = 11                   //Define novo multiplicador

    for(let c = 0; c < 10; c++){
        acml += cpf[c] * mult
        mult--        
    }
    let digitTwo = (acml * 10) % 11 //calcula o resto da divisão
    if(digitTwo >= 10){             //verifica se o resto da divisao é 10, caso seja considera 0
        digitTwo = 0
    }

    //Bloco 3 - Este bloco verifica os digitos verificadores do cpf são validos
    if (digitOne == cpf[9] && digitTwo == cpf[10]){
        return true
    } else {
        return false
    }

}

//Limpa os campos
function clearField() {    
    for(let c = 0; c < arguments.length; c++){
        arguments[c].value = ""
    }
    arguments[0].focus()
}

//Altera a sombra do input
function changeBorder(field) {
    field.style.border = "1px solid red"
    field.style.boxShadow = "0px 0px 7px rgba(255, 0, 0, 0.5)"

    setTimeout(() => {
        field.style.border = "1px solid rgb(120, 120, 120)"
        field.style.boxShadow = "none"
    }, 5000)    
} 