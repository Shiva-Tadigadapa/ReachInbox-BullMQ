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
      <button onClick={() => window.history.back()}>Back to List</button>
      {email && (
        <div className=" ">
          <div className=" flex justify-between ">
            <div className=" flex flex-col">
            <h2 className=" text-blue-600 font-semibold">
              From: {email.from.emailAddress.name}
              {`  <${email.from.emailAddress.address}>`}
            </h2>
            <h2>
              To: {email.toRecipients[0].emailAddress.name}
              {`  <${email.toRecipients[0].emailAddress.address}>`}
            </h2>
            </div>
          <p className=" px-5">Date: {new Date(email.sentDateTime).toLocaleString()}</p>
          </div>
          <p dangerouslySetInnerHTML={{ __html: email.body.content }}></p>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </>
  );
};

export default OutlookDetail;
