import React, { useEffect, useState } from 'react';
import { fetchUserLogs } from '../../api/usersApi';

function UserLastLogin({ userId }) {
  const [lastLogin, setLastLogin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchUserLogs(userId)
      .then(logs => {
        if (isMounted && logs && logs.length > 0) {
          setLastLogin(logs[0].created_at);
        }
      })
      .catch(() => {})
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [userId]);

  if (loading) return <span>...</span>;
  if (!lastLogin) return <span style={{color:'#888'}}>Jamais connecté</span>;
  const date = new Date(lastLogin);
  return <span>{date.toLocaleString()}</span>;
}

export default UserLastLogin;
