import React, { useState, useEffect, useMemo, ReactNode } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import EmailDetail from "./Email";

interface Email {
  [x: string]: ReactNode;
  id: string;
  snippet: string;
  subject?: string;
  from?: string;
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

      const storedEmails = sessionStorage.getItem("emails");
      if (storedEmails) {
        setEmails(JSON.parse(storedEmails));
        return;
      }

      try {
        const response = await axios.get<Email[]>(
          "http://localhost:3000/api/emails",
          {
            params: { access_token: accessToken },
          }
        );
        const emailsWithAdditionalData = response.data.map((email) => ({
          ...email,
        }));
        setEmails(emailsWithAdditionalData);
        sessionStorage.setItem(
          "emails",
          JSON.stringify(emailsWithAdditionalData)
        );
      } catch (error) {
        console.error("Error fetching emails:", error);
        setError("Failed to fetch emails");
      }
    };

    fetchEmails();
  }, []);

  const memoizedEmails = useMemo(() => {
    return emails.map((email) => ({
      ...email,
    }));
  }, [emails]);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold">Emails</h2>
      <div className=" flex ">
        <div className="w-[40%] h-full p-2 mt-10">
          <ul className="flex flex-col gap-3 ">
            {memoizedEmails.map((email) => (
              <li
                key={email.id}
                className="rounded-xl hover:bg-gray-300 cursor-pointer p-4 shadow-md border-gray-400 border"
                style={
                  emailId === email.id
                    ? { backgroundColor: "#89acf4" }
                    : { backgroundColor: "white" }
                }
              >
                <Link to={`/emails/${email.id}`}>
                  <h3 className="text-md font-semibold w-80 truncate ">{email.subject}</h3>
                </Link>
                <p className="text-sm text-gray-700">From: {email.from}</p>
                <p className={`border w-full  flex  px-1 py-2 rounded-xl items-center  justify-center
                  ${
                    email.analyzedEmail == "Interested"
                      ? "bg-black"
                      : email.analyzedEmail == "Not Interested"
                      ? "bg-blue-500"
                      : email.analyzedEmail == "More Information"
                      ? "bg-blue-400"
                      : "bg-gray-300"
                  }
                `}
                > {email.analyzedEmail} </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden sticky top-0 h-full w-full">
          <EmailDetail />
        </div>
      </div>
    </div>
  );
};

export default EmailList;
