import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import OutlookDetail from "./OutlookDetail";
import { useParams } from "react-router-dom";

const OutLookList = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { emailId } = useParams<{ emailId: string }>();

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
      <div className="flex flex-col">
        <h1 className=" text-xl  mb-4">Outlook Email List</h1>
        <div className="flex">
          <div className="w-[40%] h-full   px-2 ">
              {data && (
                <ul className="  ">
                  {data.map((email: any) => (
                    <Link to={`/outlook/emails/${email.id}`}>
                      <li key={email.id} className=" bg-blue-300 mt-2 rounded-xl hover:bg-gray cursor-pointer  p-4 shadow-md border-gray-400   border"
                       style={
                        emailId === email.id
                          ? { backgroundColor: "#89acf4" }
                          : { backgroundColor: "white" }
                      }
                      >
                        <p>Subject: {email.subject}</p>
                        <p>From: {email.sender.emailAddress.name}</p>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
              {error && <p>Error: {error}</p>}
          </div>
          <div className="  w-full   sticky top-0  h-full ">
            <OutlookDetail />
          </div>
        </div>
      </div>
    </>
  );
};

export default OutLookList;
