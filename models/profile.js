const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    Gender: {
        type: String
    },
    Location: {
        type: String
    },
    social: {
        youtube: {
            type: String
        },
        facebook : {
            type: String
        },
        instagram: {
            type: String
        }
     
    },
    
    date: {
        type: Date,
        default: Date.now
    }
    


});

module.exports = Profile = mongoose.model('profile', ProfileSchema)