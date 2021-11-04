const router = require("express").Router()

const { 
    createClient, 
    findAllClients,
    findClientById,
    findClientByUsername,
    findClientByCpf,
    findClientByIdAndUpdate,
    findClientByIdAndRemove
} = require("../controllers/clientsController.js")


router.get("/all",                findAllClients)
router.get("/:id",                findClientById)
router.get("/username/:username", findClientByUsername)
router.get("/cpf/:cpf",           findClientByCpf)

router.post("/register",     createClient)

router.put("/update/:id",  findClientByIdAndUpdate)

router.delete("/remove/:id", findClientByIdAndRemove)

module.exports = app => app.use("/api/clients", router)

