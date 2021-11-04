const Clients = require("../models/clientsModel.js")

module.exports = {
    async createClient(req, res) {
        //Verifica se algum dado da requisição está em branco
        if(!req.body.name){
            res.status(400).json({ error: "O campo 'name' não pode estar em branco!"})
        }
        if(!req.body.email){
            res.status(400).json({ error: "O campo 'email' não pode estar em branco!"})
        }
        if(!req.body.username){
            res.status(400).json({ error: "O campo 'username' não pode estar em branco!"})
        }
        if(!req.body.password){
            res.status(400).json({ error: "O campo 'password' não pode estar em branco!"})
        }
        if(!req.body.age){
            res.status(400).json({ error: "O campo 'age' não pode estar em branco!"})
        }
        if(!req.body.cpf){
            res.status(400).json({ error: "O campo 'cpf' não pode estar em branco!"})
        }

        //Verifica se algum dado ja foi cadastrado
        const { username, cpf } = req.body

        if(await Clients.findOne({ username })){
            return res.status(400).json({ error: "Nome de usuário ja cadastrado!"})
        }

        if(await Clients.findOne({ cpf })){
            return res.status(400).json({ error: "CPF ja cadastrado!"})
        }

        try {
            const client = await Clients.create(req.body)

            client.password = undefined

            res.json(client)            
        } catch(err) {
            res.status(400).json({ error: "Erro ao cadastrar novo cliente!", err})
        }
    },
    async findAllClients(req, res){
        const allClients = await Clients.find()
        if(allClients.length < 1){
            return res.json({ error: "Nenhum cliente cadastrado!"})
        }

        res.json(allClients)
    },
    async findClientById(req, res) {
        const client = await Clients.findById(req.params.id)

        if(!client){
            return res.json({ error: "ID do cliente não encontrado!"})
        }

        return res.json(client)
    },
    async findClientByUsername(req, res) {
        const { username } = req.params

        const client = await Clients.findOne({ username })

        if(!client){
            return res.json({ error: "Nome de usuário nao encontrado!"})
        }

        return res.json(client)
    },
    async findClientByCpf(req, res) {
        const { cpf } = req.params

        const client = await Clients.findOne({ cpf })

        if(!client){
            return res.json({ error: "CPF nao encontrado!"})
        }

        return res.json(client)
    },
    async findClientByIdAndUpdate(req, res){
        //Verifica se algum dado da requisição está em branco
        if(!req.body.name){
            res.status(400).json({ error: "O campo 'name' não pode estar em branco!"})
        }
        if(!req.body.email){
            res.status(400).json({ error: "O campo 'email' não pode estar em branco!"})
        }
        if(!req.body.username){
            res.status(400).json({ error: "O campo 'username' não pode estar em branco!"})
        }
        if(!req.body.age){
            res.status(400).json({ error: "O campo 'age' não pode estar em branco!"})
        }
        if(!req.body.cpf){
            res.status(400).json({ error: "O campo 'cpf' não pode estar em branco!"})
        }

        try {
            const client = await Clients.findOneAndUpdate(req.params.id, req.body, { new: true })

            res.json(client)
        } catch(err) {
            res.status(400).json({ error: "Falha ao atualizar registro selecionado.", err})
        }
    },
    async findClientByIdAndRemove(req, res) {
        try {
            const client = await Clients.findByIdAndRemove(req.params.id)

            res.json(client)
        } catch(err) {
            res.status(400).json({ error: "Falha ao remover registro selecionado.", err})
        }
    }
}