//require dependecies 
const Mongoose = require('mongoose');
// create user schema
const UserSchema = new Mongoose.Schema({
// create username that is a string, its unique and it's required
    username: {
        type: String,
        min: 8,
        max: 20,
        unique: true,
        required: true
    },
// create password with length of 8 characters and is required
    password: {
        type: String,
        min: 8,
        max: 15,
        required: true
    },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     validate: {
    //         validator: (value) => {
    //             const re =
    //               /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    //               return value.match(re);
    //         },
    //         message: 'Please, enter a valid email address',
    //     }
    
// create role for different users 
    role:{
        type: String,
        default: "Exhibitor", // for those who want to upload their art
        required: true
    },
});

//convert schema to a model
const User = Mongoose.model("user",UserSchema);


//export file 
module.exports = User

