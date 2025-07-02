import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyFields, setEmptyFields] = useState({ username: false, email: false, password: false });
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (emptyFields.username) {
      setEmptyFields(prev => ({ ...prev, username: false }));
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emptyFields.email) {
      setEmptyFields(prev => ({ ...prev, email: false }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (emptyFields.password) {
      setEmptyFields(prev => ({ ...prev, password: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar campos vazios e marcar em vermelho
    const newEmptyFields = {
      username: !username.trim(),
      email: !email.trim(),
      password: !password.trim()
    };
    setEmptyFields(newEmptyFields);
    
    // Validação de campos vazios
    if (newEmptyFields.username || newEmptyFields.email || newEmptyFields.password) {
      setErrorMessage("Por favor, preencha todos os campos para continuar.");
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
      return;
    }
    
    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        email,
        password,
        });
      alert("Cadastro feito!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro no cadastro. Tente novamente.");
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      {/* Popup de Erro */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center animate-bounce-in shadow-2xl">
            <div className="mb-4">
              <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Erro de Validação</h3>
            <p className="text-gray-600">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 animate-slide-up flex items-center justify-center">
          Cadastro
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="transform hover:scale-105 transition duration-300 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <input 
              value={username} 
              onChange={handleUsernameChange} 
              placeholder="Username" 
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                emptyFields.username 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
              }`}
              required
            />
            {emptyFields.username && (
              <p className="text-red-500 text-sm mt-1 ml-2">Este campo é obrigatório</p>
            )}
          </div>
          <div className="transform hover:scale-105 transition duration-300 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <input 
              value={email} 
              onChange={handleEmailChange} 
              placeholder="Email" 
              type="email"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                emptyFields.email 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
              }`}
              required
            />
            {emptyFields.email && (
              <p className="text-red-500 text-sm mt-1 ml-2">Este campo é obrigatório</p>
            )}
          </div>
          <div className="transform hover:scale-105 transition duration-300 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <input 
              type="password" 
              value={password} 
              onChange={handlePasswordChange} 
              placeholder="Password" 
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                emptyFields.password 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
              }`}
              required
            />
            {emptyFields.password && (
              <p className="text-red-500 text-sm mt-1 ml-2">Este campo é obrigatório</p>
            )}
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 font-medium"
          >
            Registrar
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Já tem uma conta? 
          <Link to="/login" className="text-indigo-500 hover:text-indigo-600 font-medium ml-1">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
