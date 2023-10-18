const userProfileServices = require('../services/userprofile.services')

 async function userProfile(req,res){
    const data = req.userdata;
    // console.log(data.userName);
    const userProfile = await userProfileServices.userProfile({
        userName : data.userName
    })
    
    res.json({
        profile : userProfile
    })
 }
 module.exports = {
    userProfile,

 }