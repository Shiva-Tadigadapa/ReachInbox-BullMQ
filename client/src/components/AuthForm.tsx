// import React from 'react';

// const CLIENT_ID = '199764480225-3vjtdq3urgb1idnbiu4s3e6msah9r4s5.apps.googleusercontent.com';
// const REDIRECT_URI = 'http://localhost:5173/api/auth/google/callback';
// const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.modify';

// const OAuthButton: React.FC = () => {
//   const generateAuthUrl = () => {
//     const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
//     const params = new URLSearchParams({
//       client_id: CLIENT_ID!,
//       redirect_uri: REDIRECT_URI,
//       response_type: 'code',
//       scope: SCOPES,
//       access_type: 'offline',
//     });

//     return `${baseUrl}?${params.toString()}`;
//   };

//   const handleGoogleAuth = () => {
//     const authUrl = generateAuthUrl();
//     window.location.href = authUrl;
//   };

//   return (
//     <div>
//       <button onClick={handleGoogleAuth}>Authorize Gmail</button>
//     </div>
//   );
// };

// export default OAuthButton;

import React from 'react'
import axios from 'axios';
import { useState } from 'react';


const AuthForm = () => {

  const [authUrl, setAuthUrl] = useState('');

  const getAuthUrl = async () => {
      const response = await axios.get('http://localhost:3000/auth/url');
      setAuthUrl(response.data.url);
  };
  return (
   <>
    <div>
            <button onClick={getAuthUrl}>Authenticate with Google</button>
            {authUrl && <a href={authUrl}>Login with Google</a>}
        </div>
   </>
  )
}

export default AuthForm