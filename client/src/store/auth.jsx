import React,{createContext, useContext, useState,useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>{
    // const [token,setToken]= useState(""); 
    const [token,setToken]= useState(localStorage.getItem("token"));
    const [user,setUser] = useState('');
    const [blog,setBlog] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [approvedblog,setApprovedblog] = useState([]);
    const [notapprovedblog,setNotApprovedblog] = useState([]);
    const [pendingblog,setPendingblog] = useState([]);
    const AuthorizationToken = `Bearer ${token}`;

 
    const API_BASE_URL = 'http://localhost:8000/';

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
        setUser("");
        return localStorage.removeItem("token");
    }

    //jwt authentication - currently logged in user

    const userAuthentication = async() =>{
        try {
            setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}api/auth/user`,
                {
                    method : "GET",
                    headers:{
                    Authorization : AuthorizationToken , 
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.userData);
                    console.log('hello',data);
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
            const blogdata = await fetch(`${API_BASE_URL}api/blog/blog`,
            {
                method: "GET",
             
            })
            if (blogdata.ok) {
                const data = await blogdata.json();
                console.log('blog data:',data.message);
                setBlog(data.message);
            }
            }
          catch (error) {
            console.error("Error Fetching Blog data")
        }
      

    }
    const getApprovedBlogs = async (req, res) => {
        try {
            const approvedblogdata = await fetch(`${API_BASE_URL}api/blog/approvedblog`, {
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
   

     const getNotApprovedBlogs = async(req, res) => {
        try {
            const notapprovedblogdata = await fetch(`${API_BASE_URL}api/blog/notapprovedblog`, {
                method: "GET",
                headers: {
                    'Authorization': AuthorizationToken
                }
            });
    
            if (notapprovedblogdata.ok) {
                const Notapproved_data = await notapprovedblogdata.json();
                console.log('all approved', Notapproved_data); 
                if (Array.isArray(Notapproved_data)) {
                    console.log('Approved blogs:', Notapproved_data);
                    setNotApprovedblog(Notapproved_data); 
                } else {
                    console.error('Invalid response: data is not an array');
                }
            } else {
                console.error('Failed to fetch approved blogs:', notapprovedblogdata.status);
            }
            
        } catch (error) {
            console.error("Error Fetching Blog data");
        }
    }
     const getPendingBlogs = async(req, res) => {
        try {
            const pendingblogdata = await fetch(`${API_BASE_URL}api/blog/pendingblog`, {
                method: "GET",
                headers: {
                    'Authorization': AuthorizationToken
                }
            });
    
            if (pendingblogdata.ok) {
                const pending_data = await pendingblogdata.json();
                console.log('all approved', pending_data); 
                if (Array.isArray(pending_data)) {
                    console.log('Approved blogs:', pending_data);
                    setPendingblog(pending_data); 
                } else {
                    console.error('Invalid response: data is not an array');
                }
            } else {
                console.error('Failed to fetch approved blogs:', pendingblogdata.status);
            }
            
        } catch (error) {
            console.error("Error Fetching Blog data");
        }
    }

  
    // useEffect(() => {
    //     getBlogs();
    //     // userAuthentication();
    //     getApprovedBlogs();
    // }, [])
    // // }, [blog])
    useEffect(() => {
        getBlogs();
        getApprovedBlogs();
        getNotApprovedBlogs();
        getPendingBlogs();
    }, []); 
    
    useEffect(() => {
        
        userAuthentication();
        // LogoutUser();
    }, [token])
    

    // token
    return(
     <AuthContext.Provider value={{isLoggedIn,storeTokenInLS,LogoutUser,user,blog,AuthorizationToken,approvedblog,isLoading,API_BASE_URL,notapprovedblog,pendingblog}}>
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