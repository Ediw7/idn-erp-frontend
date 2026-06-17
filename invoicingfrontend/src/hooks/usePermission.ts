import { useAuth } from '../features/auth/contexts/AuthContext';

export const usePermission = () => {
  // 1. Ambil Data Sesi
  const { user } = useAuth();

  // (MOCK) Di sistem Anda saat ini userPermissions belum ter-load otomatis dari backend saat login.
  // Idealnya ini didapat dari context: const { user, userPermissions } = useAuth();
  // Untuk sementara, kita ambil dari localStorage sesuai SetupUserPermission.tsx.
  const getUserPermissions = () => {
    if (!user) return [];
    const saved = localStorage.getItem(`permissions_${user.id}`);
    return saved ? JSON.parse(saved) : [];
  };

  const checkAccess = (taskName: string, actionType: 'Open' | 'Insert' | 'Update' | 'Delete'): boolean => {
    // ATURAN 0: Jika belum login, otomatis tolak (Default Deny)
    if (!user) return false;

    // ATURAN 1 (Super Admin Bypass): 
    // Admin tidak terikat oleh aturan centang.
    if (user.is_admin === true) return true;

    // Ambil array permissions milik user
    const userPermissions = getUserPermissions();

    // ATURAN 2 (Default Deny): 
    // Cari taskName tersebut di dalam array userPermissions.
    const taskPermission = userPermissions.find((p: any) => p.task === taskName);

    // ATURAN 3 (Pengecekan Akses Ketat):
    // Jika modul tidak ditemukan di dalam array, kembalikan false.
    if (!taskPermission) return false;

    // Jika modul ditemukan, cek nilai actionType.
    // Kita gunakan .toLowerCase() karena field di database/state Anda berupa huruf kecil ('open', 'insert')
    const actionKey = actionType.toLowerCase();
    
    // Kembalikan boolean murni (!! memastikan undefined/null jadi false)
    return !!taskPermission[actionKey];
  };

  return { checkAccess };
};
