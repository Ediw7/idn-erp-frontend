import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useConfirm } from "../contexts/ConfirmContext";

interface MasterDataCRUDProps<T> {
  fetchApi: () => Promise<T[]>;
  saveApi: (data: T) => Promise<any>;
  deleteApi: (id: number) => Promise<any>;
  initialForm: T;
  validate?: (form: T) => string | null;
}

export function useMasterDataCRUD<T extends { id?: number }>({
  fetchApi,
  saveApi,
  deleteApi,
  initialForm,
  validate,
}: MasterDataCRUDProps<T>) {
  const confirm = useConfirm();
  const [list, setList] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<T>(initialForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApi();
      setList(data || []);
    } catch (error) {
      toast.error("Gagal memuat data dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditForm({ ...initialForm });
    setIsModalOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditForm({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (validate) {
      const errorMsg = validate(editForm);
      if (errorMsg) {
        toast.error(errorMsg);
        return;
      }
    }

    try {
      await saveApi(editForm);
      toast.success(
        editForm.id ? "Data berhasil diubah!" : "Data berhasil ditambahkan!",
      );
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data.",
      );
    }
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirm(
      "Apakah Anda yakin ingin menghapus data ini?",
    );
    if (!isConfirmed) return;

    try {
      await deleteApi(id);
      toast.success("Data berhasil dihapus!");
      fetchData();
    } catch (error: any) {
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Terjadi kesalahan saat menghapus data.",
      );
    }
  };

  return {
    list,
    isLoading,
    setIsLoading,
    isModalOpen,
    setIsModalOpen,
    editForm,
    setEditForm,
    handleAddNew,
    handleEdit,
    handleSave,
    handleDelete,
    fetchData,
  };
}
