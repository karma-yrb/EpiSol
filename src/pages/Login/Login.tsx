import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your authentication logic with Axios here
    navigate('/achat');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Connexion</h1>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border rounded"
        />
        <button
          type="button"
          onClick={handleLogin}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}

export default Login;
