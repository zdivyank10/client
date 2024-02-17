const Contact = require("../models/contact-model");
const User = require("../models/user-model")
const Blog = require("../models/blog-model")
// ----------------------------------
// ----------------------------------
// ***********all Users ***********
// ----------------------------------
// ----------------------------------
const getAllUsers = async(req,res) =>{

    try {
        const users = await User.find({},{password:0});
        console.log(users);
        if (!users || users.length === 0 ) {
           return res.status(400).json({message : 'No user found'});
        }
       return res.status(200).json(users)
    } catch (error) {
        // next(error);
        console.log('error from admin Controller',error);
    }
}


// ----------------------------------
// ----------------------------------
// ***********all contact ***********
// ----------------------------------
// ----------------------------------

const getAllContacts = async(req,res) =>{
try {
    const contacts = await Contact.find();
    console.log(contacts);
    if (!contacts || contacts.length === 0 ) {
        return res.status(400).json({message : 'No contacts found'});
     }
    return res.status(200).json(contacts);
} catch (error) {
    console.log('error from admin Controller',error);
}
}

// ----------------------------------
// ----------------------------------
// ***********Delete User***********
// ----------------------------------
// ----------------------------------

const deleteUserById = async(req,res)=>{
    
    try {
        const id = req.params.id;
        // upper id == /:id vala id
        await User.deleteOne({_id : id});
        // schema wala id
        return res.status(200).json({message:'User Deleted Successfully...'});
    } catch (error) {
        console.log('error from delete user',error);
        // next(error)
    }
}

// ----------------------------------
// ----------------------------------
// ***********Get userbyid User***********
// ----------------------------------
// ----------------------------------

const getUserById = async(req,res) =>{

    try {
        const id = req.params.id;
        // upper id == /:id vala id
        const data = await User.findOne({_id : id},{password : 0});
        // schema wala id
        return res.status(200).json(data);
        
    } catch (error) {
        console.log(error)
    }
}


const updateBlogPermission = async (req, res) => {
    try {
      const { blogId } = req.params;
      const { permission } = req.body;

      if (!['true', 'false', 'pending'].includes(permission)) {
        return res.status(400).json({ error: 'Invalid permission state' });
      }
      
      // Find the blog document by ID and update the permission field
      const updatedBlog = await Blog.findByIdAndUpdate(blogId, { permission }, { new: true });
  
      res.json(updatedBlog);
    } catch (error) {
      console.error('Error updating blog permission:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };



module.exports = {getAllUsers,getAllContacts,deleteUserById,getUserById,updateBlogPermission}