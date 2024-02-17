const {z} = require('zod');

const loginSchema = z.object({
    email :  z
    .string({required_error:"Email is Required"})
    .trim()
    .email({message: "Invalid Email address"})
    .min(3,{message: "Email must be Upto 3 Letter"})
    .max(255,{message: "Email must not be more than 255 Letter"}),

    
    password :  z
    .string({required_error:"Password is Required"})
    .min(7,{message: "Password must be Upto 7 Letter"})
    .max(1024,{message: "Password must not be more than 1024 Letter"}),
})
// create a object Schema

const signupSchema = loginSchema.extend({

    username :  z
    .string({required_error:"Name is Required"})
    .trim()
    .min(3,{message: "Name must be Upto 3 Letter"})
    .max(255,{message: "Name must not be more than 255 Letter"}),


 
    phone :  z
    .string({required_error:"Phone Number is Required"})
    .trim()
    .min(10,{message: "Phone Number must be 10 Digits"})
    .max(20,{message: "Phone Number must not be more than 20 Letter"}),

})

module.exports = {signupSchema,loginSchema};