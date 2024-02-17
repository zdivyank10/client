const blog = require('../models/blog-model')

const blogs = async(req,res)=>{
    try {
        const response = await blog.find().populate('author_id','username');;

        if (!response) {
            
            res.status(404).json({message : 'No data Found'})
        }
        res.status(200).json({message : response})

        
    } catch (error) {
        res.status(500).json({message : 'Message Not Displaying Successfully '})
    }
}
const blogform = async (req, res) => {
    try {
        // Extract data from request body
        const { title, author_id, content, tags,cover_img} = req.body;
     
        // const cover_img_path = '/uploads/' + req.cover_img.filename;

        // Create new blog post instance with tags included
        const newBlog = await blog.create({
            title,
            author_id,
            content,
            tags, // Include tags array
            cover_img,
        });

        // console.log("req of img",req.file.filename)
        // console.log("path of img",cover_img_path)
        console.log('Blog posted successfully:', newBlog);
        res.status(200).json({ message: 'Blog posted successfully', blog: newBlog });
    }  catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ message: 'Failed to create blog post' });
    }
}


const approvedBlogs = async (req, res) => {
    try {
   
    //   const approvedBlog = await blog.find({ permission: true });
    const approvedBlog = await blog.find({ permission: true })
    .populate('author_id', 'username');
  
      res.json(approvedBlog);
    } catch (error) {
      console.error('Error getting blog permission:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const getfullblog = async (req, res) => {
    try {
      const { id } = req.params; // Ensure that id is correctly received from the frontend
      console.log('Received id:', id);
      // Fetch the blog post using the id parameter
      const blogPost = await blog.findById(id).populate('author_id','username');
      if (!blogPost) {
        console.log('Blog post not found for id:', id);
        return res.status(404).json({ message: 'Blog post not found' });
      }
      res.json(blogPost);
    } catch (error) {
      console.error('Error fetching full blog post:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

module.exports = {blogs,blogform,approvedBlogs,getfullblog}