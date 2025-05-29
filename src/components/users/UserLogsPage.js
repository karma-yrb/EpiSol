import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserLogs } from '../../api/usersApi';
import { fetchUserInfo } from '../../api/usersApi';
import * as XLSX from 'xlsx';

function UserLogsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([
      fetchUserLogs(id),
      fetchUserInfo(id)
    ])
      .then(([logsData, userData]) => {
        setLogs(logsData);
        setUser(userData);
      })
      .catch(() => setError("Erreur lors du chargement des logs ou de l'utilisateur."))
      .finally(() => setLoading(false));
  }, [id]);

  const exportToXLS = () => {
    const ws = XLSX.utils.json_to_sheet(logs.map(log => ({
      'Date/heure': new Date(log.created_at).toLocaleString(),
      'IP': log.ip || '-',
      'User-Agent': log.user_agent || '-',
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Logs');
    XLSX.writeFile(wb, `logs_user_${id}.xlsx`);
  };

  return (
    <div className="page-centered-container">
      <h1>Logs de connexion de {user ? `${user.prenom} ${user.nom}` : `utilisateur #${id}`}</h1>
      <button onClick={() => navigate(-1)} style={{marginBottom:16}}>&larr; Retour</button>
      <button onClick={exportToXLS} style={{marginLeft:8, marginBottom:16}}>
        <i className="fa fa-file-excel-o" style={{color:'#217346',marginRight:6}}></i>Exporter en XLS
      </button>
      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className="achat-modal-error">{error}</div>
      ) : logs.length === 0 ? (
        <div style={{color:'#888'}}>Aucune connexion enregistrée.</div>
      ) : (
        <table className="produits-table" style={{marginTop:8}}>
          <thead>
            <tr><th>Date/heure</th><th>IP</th><th>User-Agent</th></tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleString()}</td>
                <td>{log.ip || '-'}</td>
                <td style={{maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{log.user_agent || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserLogsPage;
