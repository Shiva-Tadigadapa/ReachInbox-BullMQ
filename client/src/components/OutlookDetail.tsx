import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Email {
  from: any;
  body: any;
  id: string;
  snippet: string;
  payload: {
    parts: any[];
    headers: { name: string; value: string }[];
    body?: { data: string };
  };
}

const OutlookDetail = () => {
  const { emailId } = useParams<{ emailId: string }>();
  const [email, setEmail] = useState<Email | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmail = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Access token not found");
        return;
      }

      try {
        const response = await axios.get<Email>(
          `http://localhost:3000/outlook/emails/${emailId}`,
          {
            params: { access_token: accessToken },
          }
        );
        setEmail(response.data);
      } catch (error) {
        console.error("Error fetching email:", error);
        setError("Failed to fetch email");
      }
    };

    fetchEmail();
  }, [emailId]);

  return (
    <>
      <h1>Outlook Email Detail</h1>
      <button onClick={() => window.history.back()}>Back to List</button>
      {email && (
        <div>
          <h2>
            From:{" "}
            {
                email.from.emailAddress.name
            }
          </h2>
          <p dangerouslySetInnerHTML={{ __html:email.body.content}} ></p>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </>
  );
};

export default OutlookDetail;
