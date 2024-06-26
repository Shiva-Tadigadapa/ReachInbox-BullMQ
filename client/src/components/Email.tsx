import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Base64 } from "js-base64";
// import './EmailDetail.css'; // Import the custom CSS file

interface Email {
  id: string;
  snippet: string;
  payload: {
    parts?: any[];
    headers: { name: string; value: string }[];
    body?: { data: string };
  };
}

const EmailDetail: React.FC = () => {
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
          `http://localhost:3000/api/emails/${emailId}`,
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

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (!email) {
    return <div>Loading...</div>;
  }

  const subject =
    email.payload.headers.find((header) => header.name === "Subject")?.value ||
    "No Subject";

  const htmlParts = email.payload.parts?.filter(
    (part) =>
      part.mimeType === "text/html" ||
      part.mimeType === "multipart/alternative" ||
      part.mimeType === "multipart/mixed" ||
      part.mimeType === "multipart/related"
  );

  const convertDate = (date: string | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleString();
  };

  return (
    <div className=" border rounded-xl px-4 py-10 sticky top-0">
      <h2 className="text-2xl font-bold mb-4">Email Details</h2>
      <h3 className="text-lg font-semibold mb-2">{subject}</h3>
      <div className=" flex justify-between px-4">
        <div>
          <div>
            <strong>From:</strong>{" "}
            {
              email.payload.headers.find((header) => header.name === "From")
                ?.value
            }
          </div>
          <div>
            <strong>To:</strong>{" "}
            {
              email.payload.headers.find((header) => header.name === "To")
                ?.value
            }
          </div>
        </div>
        <div>
          <strong>Date:</strong>{" "}
          {convertDate(
            email.payload.headers.find((header) => header.name === "Date")
              ?.value
          )}
        </div>
      </div>
      <div className="bg-[#f3f2f0]   border">
        {htmlParts?.map((part, index) => (
          <div key={index} className="">
            {part.body?.data ? (
              <div
                className=" rounded-lg mt-5"
                dangerouslySetInnerHTML={{
                  __html: Base64.decode(part.body.data),
                }}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{
                  __html: part.parts
                    ? Base64.decode(part.parts[1].body.data)
                    : "",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailDetail;
