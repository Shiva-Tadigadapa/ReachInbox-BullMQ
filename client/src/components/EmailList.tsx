import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
  const [emails, setEmails] = useState<Email[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('Access token not found');
        return;
      }

      try {
        const response = await axios.get<Email[]>('http://localhost:3000/api/emails', {
          params: { access_token: accessToken },
        });
        setEmails(response.data.slice(0, 10)); // Limit to first 10 emails
      } catch (error) {
        console.error('Error fetching emails:', error);
        setError('Failed to fetch emails');
      }
    };

    fetchEmails();
  }, []);

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Emails</h2>
      <ul>
        {emails.map((email) => (
          <li key={email.id} className="bg-blue-100 rounded-lg p-4 shadow-md mb-4">
            <Link to={`/emails/${email.id}`}>
              <h3 className="text-lg font-semibold mb-2">
                {email.payload.headers.find((header) => header.name === 'Subject')?.value || 'No Subject'}
              </h3>
            </Link>
            <p>{email.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailList;
