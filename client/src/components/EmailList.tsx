import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EmailDetail from "./Email";
import { useParams } from "react-router-dom";

interface Email {
  id: string;
  snippet: string;
  payload: {
    parts: any[];
    headers: { name: string; value: string }[];
    body?: { data: string };
  };
}

const EmailList: React.FC = () => {
  const { emailId } = useParams<{ emailId: string }>();
  const [emails, setEmails] = useState<Email[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Access token not found");
        return;
      }

      try {
        const response = await axios.get<Email[]>(
          "http://localhost:3000/api/emails",
          {
            params: { access_token: accessToken },
          }
        );
        setEmails(response.data); // Limit to first 10 emails
      } catch (error) {
        console.error("Error fetching emails:", error);
        setError("Failed to fetch emails");
      }
    };

    fetchEmails();
  }, []);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  const extractFromName = (fromHeader: string) => {
    const match = fromHeader.match(/^(.*?)(<.*?>)?$/);
    return match ? match[1].trim() : fromHeader;
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold ">Emails</h2>
      <div className="flex">
        <div className="w-[40%] h-full   p-2 mt-10">
          <ul className=" flex flex-col gap-3">
            {emails.map((email) => (
              <li
                key={email.id}
                className=" rounded-xl hover:bg-gray-300 cursor-pointer  p-4 shadow-md border-gray-400   border"
                style={
                  emailId === email.id
                    ? { backgroundColor: "#89acf4" }
                    : { backgroundColor: "white" }
                }
              >
                <Link to={`/emails/${email.id}`}>
                  <h3 className="text-md font-semibold ">
                    {email.payload.headers.find(
                      (header) => header.name === "Subject"
                    )?.value || "No Subject"}
                  </h3>
                </Link>
                <p className="text-sm text-gray-700">
                  From:{" "}
                  {extractFromName(
                    email.payload.headers.find(
                      (header) => header.name === "From"
                    )?.value || ""
                  )}
                </p>
                <p>{email.snippet}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className=" overflow-hidden  sticky top-0  h-full   w-full">
          <EmailDetail />
        </div>
      </div>
    </div>
  );
};

export default EmailList;
