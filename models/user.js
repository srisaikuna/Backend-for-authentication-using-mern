const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name "],
    },
     email: {
        type: String,
        required: [true, "please enter email"],
        
        unique: true
    },
     password: {
        type: String,
        
        required: [true, "please enter password"]
    },
   
    
    

})

module.exports = mongoose.model('Users', userSchema)