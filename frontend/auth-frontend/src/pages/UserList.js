import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function UserList() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    }, 1500);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <button 
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`fixed top-6 right-6 px-4 py-2 text-sm border-2 rounded-md font-medium transition duration-200 flex items-center ${
          isLoggingOut 
            ? 'border-gray-300 text-gray-500 bg-gray-100 cursor-not-allowed' 
            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400'
        }`}
      >
        {isLoggingOut ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border border-gray-400 border-t-transparent mr-2"></div>
            Saindo
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Sair
          </>
        )}
      </button>
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl animate-fade-in">
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-2 animate-slide-up">
              Bem-vindo ao Sistema!
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>Parabéns!</strong> Você está logado com sucesso. 
            </p>
            <p className="text-gray-600 mt-2">
              Esta é a área protegida do sistema onde você pode acessar funcionalidades exclusivas para usuários autenticados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
