// import user schema 
const User = require('../Model/User');
//hashing 
const bcrypt = require('bcryptjs');
require("dotenv").config();
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.jwt

//register user 
exports.register = async (req, res, next) => {
    const { username, password } = req.body
    // if password is less than 8 this message will be sent with error code of 400
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password doesn\'t meet criteria' })
    }
    try {
        bcrypt.hash(password,10).then(async (hash) => 
        await User.create({
            username,
            password: hash
        }))
        .then{(user => {
            const maxAge = 3 * 60 * 60
            const token = jwt.sign(
                {id,
                user_id,
                username,
                role:user.role},
                jwtSecret,
                {
                    expiresIn: maxAge
                }
        );
     res.cookies('jwt',token,{
        httpOnly:true,
        maxAge: maxAge * 1000,
     });
     res.status(201).json(
        {message:'Account Created',
        user: user_id,
        });
    })
    .catch((error) =>
        res.status(401).json({
            message: 'Account Creation Failed',
            error: error.message,
        })
    };
}
}

//check validation of existing users
exports.login = async (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({
            message: 'Input cannot be empty'
        })
    }
    try {
        const user = await User.findOne({ username})
        // if user isn't found in the database
        if (!user) {
            res.status(401).json({
                message: 'Login Unsuccessful',
                error: 'User not found',
            })
        } else {
            //if user is found in the database, checking for hashed password
            bcrypt.compare(password,user.password).then(function(result){
            result ? res.status(200).json({
                message: 'Login Successful',
                user,
            })
            : res.status(400).json({message:'Invalid Login'})
    })
}
    } catch {
        //generic error 
        res.status(400).json({
            message: 'Error Occurred',
            error: error.message,
        })
    }
}

// ability to update user role
exports.update = async (req, res, next) => {
    // will check for role and id in database
    const { role, id } = req.body
    if (role && id) {
        if (role === 'admin') {
            await User.findById(id)
                .then((user) => {
                    if (user.role !== 'admin') {
                        user.role = role
                        user.save((err) => {
                            if (err) {
                                res.send(400).json({
                                    message: 'Error has occurred',
                                    error: err.message
                                })
                                process.exit(1)
                            }
                            res.status('201').json({
                                message: 'Update sucessful',
                                user,
                            })
                        })
                    }else {
                        res.status('400').json({
                            message: 'This user is already an admin'
                        })
                    }
                })
            .catch((error) => {
                res.status(400).json({
                    message: 'An error has occured',
                    error: error.message
                })
            })
            //if role isn't admin then will recieve error message
        } else {
            res.send(400).json({
                message: 'Unauthorized'
            })
        }
        // otherwise this error will be sent  
    } else {
        res.status(400).json({
            message: 'Role or id is missing'
        })
    }
}

//delete user 
exports.deleteUser = async(req,res,next) => {
    const {id} = req.body
    await User.findById(id)
        .then(user => user.remove())
        .then(user => 
            res.status(201).json({
                message:'User successfully deleted',
                user
            })
        )
        .catch(error => 
            res.status(400)
            .json({
                message: 'An error has occurred',
                error: error.message
            })
        )
}