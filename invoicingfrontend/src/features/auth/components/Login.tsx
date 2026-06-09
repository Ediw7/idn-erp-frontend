import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const [db] = useState('odoo_invoicing_idnerp');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authenticate } = useAuth();
  const message = location.state?.message;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login({ db, login, password });
      
      if (response.error) {
        setError(response.error);
      } else if (response.user) {
        authenticate(response.user);
        if (response.user.is_admin) {
          navigate('/admin'); // Redirect Admin to admin portal
        } else {
          navigate('/'); // Redirect to dashboard
        }
      } else {
        setError('Login failed: Invalid response from server');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Terjadi kesalahan saat login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full shadow-2xl rounded-sm overflow-hidden border border-slate-300">
        <div className="bg-slate-800 px-8 py-6 text-center border-b-4 border-slate-600">
          <h1 className="text-2xl font-bold text-white tracking-wider">IDN ERP</h1>
          <p className="text-slate-400 text-sm mt-2">Masuk ke sistem manajemen perusahaan</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8">
          {message && !error && (
            <div className="bg-green-50 text-green-700 p-3 rounded-sm text-sm mb-6 border border-green-200">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-sm text-sm mb-6 border border-red-200">
              {error}
            </div>
          )}

          {/* Hidden database field since it is hardcoded */}
          <input type="hidden" value={db} />

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username / Email</label>
            <input 
              type="text" 
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white text-sm"
              required
              autoFocus
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white text-sm"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn size={18} />
                Masuk ke Aplikasi
              </>
            )}
          </button>
          <div className="mt-4 text-center">
            <span className="text-sm text-slate-600">Belum punya akun? </span>
            <Link to="/register" className="text-sm text-blue-600 font-semibold hover:underline">
              Register di sini
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
