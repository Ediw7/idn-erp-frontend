import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api";

import { UserPlus } from "lucide-react";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak sama.");
      return;
    }

    setLoading(true);

    try {
      await authApi.register({
        name,
        company_name: companyName,
        login,
        password,
      });
      navigate("/login", {
        state: { message: "Registrasi berhasil! Silakan login." },
      });
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Terjadi kesalahan saat registrasi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full shadow-2xl rounded-sm overflow-hidden border border-slate-300">
        <div className="bg-slate-800 px-8 py-6 text-center border-b-4 border-slate-600">
          <h1 className="text-2xl font-bold text-white tracking-wider">
            EDI Accounting
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Daftar akun baru ke sistem
          </p>
        </div>

        <form onSubmit={handleRegister} className="p-8">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-sm text-sm mb-6 border border-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white text-sm"
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nama Perusahaan
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white text-sm"
              required
              placeholder="PT Maju Mundur"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Username / Email
            </label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white text-sm"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Memproses...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Daftar Akun
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <span className="text-sm text-slate-600">Sudah punya akun? </span>
            <Link
              to="/login"
              className="text-sm text-blue-600 font-semibold hover:underline"
            >
              Kembali ke Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
