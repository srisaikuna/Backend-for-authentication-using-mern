const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')

const Profile = require('../models/profile')
const User = require('../models/user')

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne( { user: req.user.id }).populate('user', ['name'])

        if( !profile) {
            return res.status(400).json({ msg: 'no profile found on this user name' })
        }

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server connection error')

        
    }

})

router.post('/', [ auth,[ 
    check('Gender', 'Gender required') 
        .not()
        .isEmpty(),
    check('Location', 'Location required').not().isEmpty()    
] ], 
   async (req, res ) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {
        Gender,
        Location,
        youtube,
        facebook,
        instagram
    } = req.body
    //profile objects
    const profileFields = {};
    profileFields.user = req.user.id
    if(Gender) profileFields.Gender = Gender;
    if(Location) profileFields.Location = Location;

    //social objects
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (facebook) profileFields.social.facebook = facebook
    if (instagram) profileFields.social.instagram = instagram

    try {
        let profile = await Profile.findOne( { user: req.user.id })
        if(profile) {
            //for updating
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true} 
            );
            return res.json(profile)
            
        }
        //create
        profile = new Profile(profileFields)


        await profile.save()
        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
        
    }

   

})

//get profile when in public 
//router.get('/', async (req, res) => {
    //try {
        //const profiles = await Profile.find().populate('user', ['name'])
      //  res.json(profiles)
    //} catch (err) {
    //    console.error(err.message)
  //      res.status(500).send('server connection error')
        
   // }
//})



//get profile by user id
router.get('/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne( { user: req.params.user_id }).populate('user', ['name'])

        if( !profile) return res.status(400).json({ msg: 'no profile found'})
        res.json(profile)
        
    } catch (err) {
        console.error(err.message)
        if(err.kind == 'ObjectId') {
            return res.status(400).json( { msg: 'there is no profile for this user'})
        }

        res.status(500).send('server connection error')
        
    }
})

//Deleting the profile, user and posts

router.delete('/', auth, async (req, res) => {
    try{

        await Profile.findOneAndRemove( { user: req.user.id }) //Remove Profile
        await User.findByIdAndRemove( { _id: req.user.id}) //Removes user
        res.json({ msg: 'User deleted'})
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }
})


module.exports = router
