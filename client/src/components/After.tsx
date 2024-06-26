import React,{useEffect,useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const After = () => {
   const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAuthCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const scope = urlParams.get("scope");
    console.log("code:", code);
    console.log("scope:", scope);

    if (code) {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/callback?code=${code}&scope=${scope}`
        );
        const { access_token } = response.data;
        console.log(response.data.access_token);
        setAccessToken(access_token);
        localStorage.setItem("accessToken", access_token);
        navigate("/emails");
      } catch (error) {
        console.error("Error handling OAuth callback:", error);
      }
    }
  };

  useEffect(() => {
    handleAuthCallback();
  }, []);



  return (
    <div>After</div>
  )
}

export default After