import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useEffect, useState } from 'react';



const OutLookAfter = () => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState<string | null>("");
    const [error, setError] = useState<string | null>(null);
  
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("access_token");
      console.log("code:", code);
      setAccessToken(code);
      if (code) {
        try {
          const response = await axios.get(
            `http://localhost:3000/outlook/emails?access_token=${code}`
          );
          localStorage.setItem("accessToken", code);
          console.log(response.data.access_token);
          navigate("/outlook/list");
        } catch (error) {
          console.error("Error handling OAuth callback:", error);
        }
      }
    };
  
    useEffect(() => {
      handleAuthCallback();
    }, []);
  
  
  
    return (
      <div>OutLook After</div>
    )
}

export default OutLookAfter