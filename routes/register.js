const router = require('express').Router()
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const User = require('../models/user')





router.post('/',
 [
    check('name', 'please provide this name').not().isEmpty(),
    check('email','please provide email').isEmail(),
    check('password', 'please provide password with min 6 character').isLength({min : 6})

 ], 
 async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    const {name, email, password} = req.body
    try {
        let user = await User.findOne({email})
        if(user){
            return res.status(400).json( {msg: 'user already exists'})
        }
        user = new User({
            name,
            email,
            password
        })
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)

        await user.save()
        const payload = {
            user: {
                id:user.id
            }
            
        }
        jwt.sign(payload, process.env.SECRET, {
            expiresIn:360000000
        }, (err, token) => {
            if(err) throw err 
            res.send({token})
        })


    } catch (err) {
       console.error(err.message)
       res.status(500).send('server error')    


    }
  })

module.exports = router