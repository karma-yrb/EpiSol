import { Link } from 'react-router-dom';
import useAuthMiddleware from '../../middlewares/useAuthMiddleware';

function Home() {
  useAuthMiddleware();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-semibold mb-4">
          Bienvenue sur l&apos;application d&apos;achat !
        </h1>
        <Link to="/login" className="text-blue-500 hover:underline">
          Se connecter
        </Link>
        <div className="mt-4">
          <Link
            to="/achat"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Nouvel achat
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
