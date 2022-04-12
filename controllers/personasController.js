const conexion = require('../database/db')
const jwt = require('jsonwebtoken')

module.exports = {
    login: (req,res) => {
        const user = { correo: req.body.correo, password: req.body.password }
        conexion.query("SELECT * FROM personas WHERE correo = ?",[user.correo], (error, results) =>{
            if(error || results.length == 0){
                res.json({
                    "status": '404',
                    "message": "No se encontro el usuario"
                })
            } else {
                if(results[0].password == user.password){
                    jwt.sign({user}, process.env.JWT_SECRET, (err, token) =>{
                        res.json({
                            "status": '200',
                            "message": "Inicio de sesion correctamente",
                            "correo": user.correo,
                            token
                        })
                    })
                }
            }
        })
    },

    register: (req,res) => {
        const user =  {
            nombres: req.body.nombres,
            ape_paterno: req.body.ape_paterno,
            ape_materno: req.body.ape_materno,
            domicilio: req.body.domicilio,
            correo: req.body.correo,
            password: req.body.password
        }

        conexion.query('INSERT INTO personas SET ?', {nombres: user.nombres, ape_paterno: user.ape_paterno, ape_materno: user.ape_materno, domicilio: user.domicilio, correo: user.correo, password:user.password}, (error, results) =>{
            if(error) {return res.json(error)}

            jwt.sign({user}, process.env.JWT_SECRET, (err, token) =>{
                res.json({
                    "status": '200',
                    "message": "Se añadio correctamente",
                    "correo": user.correo,
                    token
                })
            })
            
        })
        
    },

    allPerson: (req,res) => {

        jwt.verify(req.token, process.env.JWT_SECRET, (err, userData) =>{
            if(err){
                res.json({"status": "403", "message": err.message })
            } else {
                conexion.query('SELECT * FROM personas', (error, results) =>{
                    if(error) return error
        
                    res.json({
                        "status": "200",
                        "personas": results
                    })
                })  
            }
        })
        

    },

    update: (req,res) => {
       
        const {id, nombres, ape_paterno, ape_materno, domicilio,correo} = req.body
        console.log(id);
        jwt.verify(req.token, process.env.JWT_SECRET, (err, userData) =>{
            if(err){
                res.json({"status": "403", "message": err.message })
            } else {
                let sql = `UPDATE personas SET nombres = '${nombres}', ape_paterno = '${ape_paterno}', ape_materno = '${ape_materno}', domicilio= '${domicilio}', correo = '${correo}' WHERE id = ${id};`
                conexion.query(sql, (error, results) => {
                    if(error) return error

                    res.json({
                        "status": "200",
                        "message": "Actualizacion correcta"
                    })
                })
            }
        })

    },

    delete: (req,res) => {
        const id = req.body.id

        jwt.verify(req.token, process.env.JWT_SECRET, (err, userData) =>{
            if(err){
                res.json({"status": "403", "message": err.message })
            } else {
                conexion.query('DELETE FROM personas WHERE id = ?',[id], (error, results) =>{
                    if(error) return error
        
                    res.json({ "status": "200", "message": "Eliminacion Correcta" })
                 
                })
            }
        })
        
    },
    //verificar el token
    verifiToken: (req, res, next) => {
        const token = req.headers['authorization']

        if(typeof token !== 'undefined'){
            const barerToken = token.split(" ")[1]
            req.token =barerToken
            next()
        } else{
            res.json({
                "status": "403",
                "message": "Acceso Denegado"
            })
        }
    }
}