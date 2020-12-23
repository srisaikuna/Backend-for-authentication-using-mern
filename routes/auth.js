const router = require('express').Router()
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

const User = require('../models/user')


router.get('/', auth, async (req, res) => {
try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
} catch (err) {
    console.error(err.message)
    res.status(500).send('server Error')
    
}    

})

router.post('/',
 [
   
    check('email','please provide email').isEmail(),
    check('password', 'please provide password with min 6 character').exists()

 ], 
 async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() })
    }
    const { email, password} = req.body
    try {
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json( {msg: ' Invalid '})
        }
      
        const match = await bcrypt.compare(password, user.password)
        if(!match) {
            return res.status(400).json({ msg: 'Invalid password'})

        }

        const payload = {
            user : {
                id: user.id
            }
        }
        jwt.sign(payload, process.env.SECRET ,{
            expiresIn:3600000000
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