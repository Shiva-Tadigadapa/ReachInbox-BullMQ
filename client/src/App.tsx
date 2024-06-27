import React from "react";
// import axios from 'axios';
import AuthForm from "./components/AuthForm";
import { Route, Routes } from "react-router-dom";
import After from "./components/After";
import OutLookAfter from "./components/OutLookAfter";
import EmailList from "./components/EmailList";
import EmailDetail from "./components/Email";
import OutLookList from "./components/OutLookList";
import OutlookDetail from "./components/OutlookDetail";

const App: React.FC = () => {
  // const [authUrl, setAuthUrl] = useState('');

  // const getAuthUrl = async () => {
  //     const response = await axios.get('http://localhost:3000/auth/url');
  //     setAuthUrl(response.data.url);
  // };

  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/emails" element={<EmailList />} />
      <Route path="/outlook/list" element={<OutLookList />} />
      <Route path="/auth/google/callback" element={<After />} />
      <Route path="/outlook/emails" element={<OutLookAfter />} />
      <Route path="/emails/:emailId" element={<EmailList />} />
      <Route path="/outlook/emails/:emailId" element={<OutLookList />} />
    </Routes>
  );
};

export default App;
