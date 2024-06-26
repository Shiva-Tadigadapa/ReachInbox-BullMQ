import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const OutLookList = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const localAccessToken = localStorage.getItem("accessToken");

  const handleAuthCallback = async () => {
    if (localAccessToken) {
      try {
        const response = await axios.get(
          `http://localhost:3000/outlook/emails?access_token=${localAccessToken}`
        );
        console.log(response.data);
        setdata(response.data);
      } catch (error) {
        console.error("Error handling OAuth callback:", error);
      }
    }
  };

  useEffect(() => {
    handleAuthCallback();
  }, []);

  return (
    <>
      <h1>Outlook Email List</h1>
      <button onClick={() => navigate("/")}>Back to Home</button>
      {data && (
        <ul>
          {data.map((email: any) => (
            <Link to={`/outlook/emails/${email.id}`}>
            <li key={email.id} className=" bg-blue-300 mt-4">
              <p>From: {email.bodyPreview}</p>
                <p>Subject: {email.subject}</p>
            </li>
            </Link>
          ))}
        </ul>
      )}
      {error && <p>Error: {error}</p>}
    </>
  );
};

export default OutLookList;
