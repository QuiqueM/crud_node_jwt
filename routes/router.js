const express = require('express');
const router = express.Router()

const personasController = require('../controllers/personasController')

//obtner tood los usuarios
router.get('/', personasController.verifiToken, personasController.allPerson)

//hacer login 
router.post('/login', personasController.login)

//registrar un nuevo usuario
router.post('/register', personasController.register)

//actualizar un usuario
router.post('/update',personasController.verifiToken, personasController.update)

//eliminar un usuario
router.post('/delete', personasController.verifiToken, personasController.delete)


module.exports =router