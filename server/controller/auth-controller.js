const user = require('../models/user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const home = async (req,res)=>{
    try
    {
        res.status(200).
        send("Hello i'm Homepage from auth");
    }
    catch(error)
    {
            res.status(400)
            .send("Oops Not Found");
            console.log(error);
     
    }
}

// *-----------------------------------------
// *-----------------------------------------

//  Register Logic 💯

// *-----------------------------------------
// *-----------------------------------------

const register= async (req,res)=>{
    try
    {
        const {username ,email,phone ,password} = req.body;
        //first email database mathi
        //second email uper thi☝️
        // const userExist = await user.findOne({email : email})
        
        const userExist = await user.findOne({email})
        if(userExist)
        {
            return res.status(400).json({msg :"Already Registerd.. :angry:"})
        }

        //bycrpt password...
        var salt = bcrypt.genSaltSync(10);
        var hash_Password = await bcrypt.hash(password, salt);
        // await user.create({username ,email,phone ,password})
        const newUser = await user.create({ username, email, phone, password:hash_Password });
        res.status(200)
        .json({
            // msg : newUser ,
            msg : "Registration Successful" ,
            token : await newUser.genrateToken(),
            userId : newUser._id.toString()
            })
        console.log(newUser);
    }
    catch(error)
    {
        res.status(500)
        .send("Oops Not Found");
        console.log(error);
    }
}


// *-----------------------------------------
// *-----------------------------------------

//  Login Logic 💯

// *-----------------------------------------
// *-----------------------------------------

const login = async(req,res) =>{
    
    try {
        const {email ,password} = req.body;
        const userExist = await user.findOne({email})
        
        if (!userExist)
        {
            return res.status(400).json({message:"invalid credentials "});
        }

        //compare password
        const passwordMatch = await userExist.comparePass(password);

        if (passwordMatch ) {
            res.status(200)
            .json({
                msg : "Login Succesful" ,
                token : await userExist.genrateToken(),
                userId : userExist._id.toString()
                })
        }
        else{
            res.status(401)
            .json({
                msg : "Invalid Email Or Password" ,
                })
        }

    } catch (error) {
        // res.status(500)
        // .json("Internal Error");
        // console.log(error);
        const status = 500;
        const msg = "Internal Error";
        const extraDetails =err.errors[0].message; 
        const err = {
         status,
         msg,
         extraDetails
        }
        next(err)
    }
}


// *-----------------------------------------
// *-----------------------------------------

//  User Logic 💯

// *-----------------------------------------
// *-----------------------------------------
//took users instead of user.....

const users = async(req,res) =>{

    try {
        const userData = req.users;
        console.log(userData);
        return res.status(200).json({ userData });
    } catch (error) {
        console.log(`error from user route${error}`);
    }

}

module.exports = {home,register,login,users}