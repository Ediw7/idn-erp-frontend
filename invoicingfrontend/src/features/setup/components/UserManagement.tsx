import React from "react";
import { authApi } from "../../auth/api";
import { Users, Shield, UserX, UserCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "../../../contexts/ConfirmContext";
import toast from "react-hot-toast";

const UserManagement: React.FC = () => {
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: authApi.getUsers,
  });

  const toggleMutation = useMutation({
    mutationFn: (userId: number) => authApi.toggleUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Gagal mengubah status pengguna");
    },
  });

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const isConfirmed = await confirm(
      `Apakah Anda yakin ingin ${currentStatus ? "menonaktifkan" : "mengaktifkan"} pengguna ini?`,
    );
    if (isConfirmed) {
      toggleMutation.mutate(userId);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Memuat data pengguna...
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-sm border border-red-200">
          <h3 className="font-bold mb-2">Akses Ditolak</h3>
          <p>
            {queryError instanceof Error ? queryError.message : "Akses Ditolak"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-800 p-2 rounded-sm text-white">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-slate-500">
            Kelola akses dan akun pengguna sistem
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Email / Login</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600">{user.login}</td>
                  <td className="px-6 py-4">
                    {user.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <UserCheck size={14} /> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <UserX size={14} /> Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {user.is_admin ? (
                      <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 px-2 py-1 rounded-sm border border-purple-200">
                        <Shield size={14} /> Administrator
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded-sm border border-slate-200">
                        <Users size={14} /> Standard User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {!user.is_admin && (
                      <button
                        onClick={() => handleToggle(user.id, user.is_active)}
                        className={`px-3 py-1 text-xs font-semibold rounded-sm text-white transition-colors ${
                          user.is_active
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {user.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Tidak ada data pengguna ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
