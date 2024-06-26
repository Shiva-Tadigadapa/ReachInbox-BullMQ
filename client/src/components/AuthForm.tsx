import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = () => {
    const [googleAuthUrl, setGoogleAuthUrl] = useState('');
    const [outlookAuthUrl, setOutlookAuthUrl] = useState('');

    const getGoogleAuthUrl = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/google/url');
            setGoogleAuthUrl(response.data.url);
        } catch (error) {
            console.error('Error fetching Google auth URL:', error);
            // Handle error state or logging as needed
        }
    };

    const getOutlookAuthUrl = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/outlook/url');
            console.log('response:', response.data.url)
            setOutlookAuthUrl(response.data.url);
        } catch (error) {
            console.error('Error fetching Outlook auth URL:', error);
            // Handle error state or logging as needed
        }
    };

    return (
        <>
            <div>
                <button onClick={getGoogleAuthUrl}>Authenticate with Google</button>
                {googleAuthUrl && <a href={googleAuthUrl}>Login with Google</a>}
            </div>

            <div>
                <button onClick={getOutlookAuthUrl}>Authenticate with Outlook</button>
                {outlookAuthUrl && <a href={outlookAuthUrl}>Login with Outlook</a>}
            </div>
        </>
    );
};

export default AuthForm;
