import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Base64 } from 'js-base64';

interface Email {
  id: string;
  snippet: string;
  payload: {
    parts: any[];
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
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setError('Access token not found');
        return;
      }

      try {
        const response = await axios.get<Email>(`http://localhost:3000/api/emails/${emailId}`, {
          params: { access_token: accessToken },
        });
        setEmail(response.data);
      } catch (error) {
        console.error('Error fetching email:', error);
        setError('Failed to fetch email');
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Email Details</h2>
      <h3 className="text-lg font-semibold mb-2">
        {email.payload.headers.find((header) => header.name === 'Subject')?.value || 'No Subject'}
      </h3>
      <div>
        {email.payload.parts.map((part, index) => (
          <div key={index}>
            {part.body?.data ? (
              <pre dangerouslySetInnerHTML={{ __html: Base64.decode(part.body.data) }} />
            ) : (
              <p>No content available</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailDetail;
