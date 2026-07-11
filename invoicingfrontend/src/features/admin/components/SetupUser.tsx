import React, { useEffect, useState } from "react";
import axiosClient from "../../../lib/axiosClient";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Shield,
  X,
  Save,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../../../features/auth/api";
import { useConfirm } from "../../../contexts/ConfirmContext";

interface UserData {
  id: number;
  name: string;
  login: string;
  is_admin: boolean;
  is_active?: boolean;
}

const SetupUser: React.FC = () => {
  const confirm = useConfirm();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    company_name: "",
    email: "",
    password: "",
    role: "USER",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // 1. READ
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Fetching dari GET /api/auth/users
      const response = await axiosClient.get("/api/auth/users");
      // Menyesuaikan struktur balikan, biasanya response.data.data atau response.data
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        // Fallback jika /api/users belum ada dan kita pakai authApi sementara
        const authResponse = await axiosClient.get("/api/auth/users");
        setUsers(authResponse.data.data || []);
      }
    } catch (err: any) {
      // toast.error(err.message || 'Gagal memuat data pengguna');
      // Silently fallback if /api/users fails to /api/auth/users
      try {
        const authResponse = await axiosClient.get("/api/auth/users");
        setUsers(authResponse.data.data || []);
      } catch (fallbackErr) {
        toast.error("Gagal memuat data pengguna");
      }
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setFormData({
      username: "",
      company_name: "",
      email: "",
      password: "",
      role: "USER",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserData) => {
    setEditId(user.id);
    setFormData({
      username: user.name || "",
      company_name: "", // company_name not editable here for now
      email: user.login || "",
      password: "", // Kosongkan password saat edit (opsional)
      role: user.is_admin ? "ADMIN" : "USER",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      username: "",
      company_name: "",
      email: "",
      password: "",
      role: "USER",
    });
    setEditId(null);
  };

  // 3. CREATE & UPDATE
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: formData.username,
        login: formData.email,
        password: formData.password,
        is_admin: formData.role === "ADMIN",
      };

      if (editId) {
        // Update: POST /api/auth/users/update
        await axiosClient.post("/api/auth/users/update", {
          id: editId,
          ...payload,
        });
        toast.success("Data pengguna berhasil diperbarui!");
      } else {
        // Create User (and optionally Company if new)
        if (!formData.password) {
          toast.error("Password wajib diisi untuk pengguna baru");
          setIsSaving(false);
          return;
        }
        if (!formData.company_name) {
          toast.error("Nama Perusahaan wajib diisi");
          setIsSaving(false);
          return;
        }

        await axiosClient.post("/api/auth/users/create", {
          ...payload,
          company_name: formData.company_name,
        });

        toast.success("Pengguna baru berhasil ditambahkan!");
      }

      closeModal();
      fetchUsers();
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Gagal menyimpan data",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 4. DELETE
  const handleDelete = async (id: number) => {
    const isConfirmed = await confirm(
      "Apakah Anda yakin ingin menghapus pengguna ini?",
    );
    if (!isConfirmed) return;

    try {
      // Delete: POST /api/auth/users/delete
      await axiosClient.post("/api/auth/users/delete", { id });
      toast.success("Pengguna berhasil dihapus!");
      fetchUsers();
    } catch (err: any) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Gagal menghapus pengguna",
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white font-sans text-slate-800 relative">
      {/* Header Banner Gelap */}
      <div className="bg-slate-900 w-full rounded-none p-6 flex flex-row justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-3">
            Setup User
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Kelola data pengguna dan hak akses sistem
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-sm shadow-sm transition-colors text-sm"
        >
          <Plus size={18} /> TAMBAH USER
        </button>
      </div>

      {/* Body Konten (Tabel User Modern) */}
      <div className="bg-white w-full flex-1 overflow-x-auto p-6">
        <div className="border border-slate-200 rounded-sm overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-5 py-4 font-semibold w-16 text-center">No</th>
                <th className="px-5 py-4 font-semibold">Username</th>
                <th className="px-5 py-4 font-semibold">Email / Login</th>
                <th className="px-5 py-4 font-semibold">Role / Hak Akses</th>
                <th className="px-5 py-4 font-semibold w-32 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-gray-500 italic"
                  >
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-gray-500 italic"
                  >
                    Belum ada data pengguna.
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-5 py-3 text-center text-gray-500">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{user.login}</td>
                    <td className="px-5 py-3">
                      {user.is_admin ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                          <Shield size={14} /> ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          <Users size={14} /> USER
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-sm transition-colors"
                          title="Edit User"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-red-600 border border-red-200 bg-red-50 hover:bg-red-600 hover:text-white rounded-sm transition-colors"
                          title="Hapus User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Modal Form Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-sm shadow-xl w-[450px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-800 px-5 py-3 flex justify-between items-center border-b border-slate-700">
              <h2 className="text-white font-bold tracking-wide">
                {editId ? "Edit Data User" : "Tambah User Baru"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="flex flex-col">
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Nama Lengkap PIC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama pengguna"
                    required
                  />
                </div>

                {!editId && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Nama Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.company_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company_name: e.target.value,
                          })
                        }
                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Masukkan nama perusahaan"
                        required={!editId}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Email / Login <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="nama@email.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Password{" "}
                    {editId && (
                      <span className="text-gray-400 font-normal">
                        (Kosongkan jika tidak ingin diubah)
                      </span>
                    )}
                    {!editId && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Role / Hak Akses <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 rounded-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  {isSaving ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupUser;
