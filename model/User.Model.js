const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
     firstName:{
        type:String,
        required:true,
        unique:true
       
     },
     lastName:{
        type:String,
        required:true, 
      //   unique:true

     },
     email:{
        type:String,
        required:true,
      //   unique:true,
     },
     phone:{
        type:String,
        require:true,
      //   unique:true

     },
     time:{
        type:String,
        required:true,
      //   unique:true

     },
     date:{
        type:String,
        required:true,
      //   unique:true,
        
     }
})

 const UserModel = mongoose.model('user',userSchema)
 
 module.exports = UserModel