import React,{createContext, useContext, useState,useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>{
    // const [token,setToken]= useState(""); 
    const [token,setToken]= useState(localStorage.getItem("token"));
    const [user,setUser] = useState('');
    const [blog,setBlog] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [approvedblog,setApprovedblog] = useState([]);
    const AuthorizationToken = `Bearer ${token}`;


    const storeTokenInLS = (serverToken)=>{
        setToken(serverToken);
        return localStorage.setItem("token",serverToken);
    };

    let isLoggedIn  = !!token;
    console.log("isloogg",isLoggedIn);
// console.log(`user info${user}`);
    // tackling logout funcionality
    const LogoutUser = ()=>{
        setToken("");
        return localStorage.removeItem("token");
    }

    //jwt authentication - currently logged in user

    const userAuthentication = async() =>{
        try {
            setIsLoading(true);
                const response = await fetch('http://localhost:8000/api/auth/user',
                {
                    method : "GET",
                    headers:{
                    Authorization : AuthorizationToken , 
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.userData);
                    console.log(data.userData);
                    setIsLoading(false);
                }else
                {
                    console.log('error fetching userdata')
                    setIsLoading(false);
                }
              
                

            }
         catch (error) {
            console.error("Error Fetching user data")
        }
    }

    const  getBlogs= async(req,res)=>{

        try {
            const blogdata = await fetch('http://localhost:8000/api/blog/blog',
            {
                method: "GET"
             
            })
            if (blogdata.ok) {
                const data = await blogdata.json();
                console.log(data.message);
                setBlog(data.message);
            }
            }
          catch (error) {
            console.error("Error Fetching Blog data")
        }
      

    }
    const getApprovedBlogs = async (req, res) => {
        try {
            const approvedblogdata = await fetch('http://localhost:8000/api/blog/approvedblog', {
                method: "GET",
                headers: {
                    'Authorization': AuthorizationToken
                }
            });
    
            if (approvedblogdata.ok) {
                const approved_data = await approvedblogdata.json();
                console.log('all approved', approved_data); 
                if (Array.isArray(approved_data)) {
                    console.log('Approved blogs:', approved_data);
                    setApprovedblog(approved_data); 
                } else {
                    console.error('Invalid response: data is not an array');
                }
            } else {
                console.error('Failed to fetch approved blogs:', approvedblogdata.status);
            }
            
        } catch (error) {
            console.error("Error Fetching Blog data");
        }
    }
    

    useEffect(() => {
        getBlogs();
        userAuthentication();
        getApprovedBlogs();
    }, [])
    

    // token
    return(
     <AuthContext.Provider value={{isLoggedIn,storeTokenInLS,LogoutUser,user,blog,AuthorizationToken,approvedblog,isLoading}}>
    {children}
    </AuthContext.Provider>
    )
}
export const useAuth = ()=>{
    const AuthContextValue =  useContext(AuthContext);
    if(!AuthContextValue)
    {
     throw new Error("useAuth used Outside of the provider");
    }
    return AuthContextValue;
} 