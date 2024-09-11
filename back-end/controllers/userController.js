import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


//login user
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});
            if (!user) {
                return res.json({success: false, message: 'User not found'});
            }

        const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.json({success: false, message: 'Incorrect password'});
            }
      
         const token = createToken(user._id);
         res.json({success: true, token});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: 'Error'});          
    }
    
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

//register user
const registerUser = async (req, res) => {
      const {name, password, email} = req.body;
      try {
        //checking if user exists
        const exists = await userModel.findOne({email});
            if (exists) { 
                return res.json({success: false, message: 'Email already exists'});
            }
        
            //validating email format and strong password
            if (!validator.isEmail(email)) {
                return res.json({success: false, message: 'Invalid email format'});
            }

            //validating password
            if(password.length < 8) {
                return res.json({success: false, message: 'Password must be at least 8 characters long'});
            }

            //hashing user password from bcrypt
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt);

            //creating new user
            const newUser = new userModel({
                name:name,
                email:email,
                password: hashedPassword
            })

            //saving user to db
         const user =  await newUser.save();

            //creating and sending JWT token
        const token = createToken(user._id);
        res.json({success: true, token: token, message: 'User registered successfully'});
            
      } catch (error) {
        console.log(error);
        res.json({success: false, message: 'Error registering user'});
      }
}


export { loginUser, registerUser}