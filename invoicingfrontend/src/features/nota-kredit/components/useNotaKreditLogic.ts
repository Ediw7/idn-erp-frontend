import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getNotaKredit,
  getNotaKreditById,
  createNotaKredit,
  updateNotaKredit,
  deleteNotaKredit,
  getAutoNo,
} from "../api";
import { setupApi } from "../../setup/api";
import { getInvoices } from "../../transactionsApi"; // Reusing existing invoice api

export const useNotaKreditLogic = () => {
  const emptyForm = {
    id: null,
    no_nota_kredit: "",
    tgl_nota_kredit: new Date().toISOString().split("T")[0],
    periode: "",
    pelanggan_id: "",
    invoice_id: "",
    no_referensi: "",
    mata_uang_id: "",
    tanda_tangan: "",
    jabatan: "",
    lines: [],
  };

  const [dataList, setDataList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [modalForm, setModalForm] = useState<any>(emptyForm);

  const [pelanggans, setPelanggans] = useState<any[]>([]);
  const [mataUangs, setMataUangs] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [showNewModal, setShowNewModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    total: 0,
    last_page: 1,
  });

  const [periode, setPeriode] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchData = async (page = 1) => {
    setLoadingData(true);
    try {
      const res = await getNotaKredit({
        page,
        limit: pagination.limit,
        periode,
      });
      if (res.status === "success") {
        setDataList(res.data);
        if (res.meta?.pagination) {
          setPagination(res.meta.pagination);
        }
      } else {
        toast.error(res.message || "Gagal mengambil data nota kredit");
      }
    } catch (e: any) {
      toast.error(e.message || "Gagal mengambil data nota kredit");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [pelRes, muRes, invRes] = await Promise.all([
        setupApi
          .getPelanggan()
          .then((data) => ({ success: true, data }))
          .catch(() => ({ success: false, data: [] })),
        setupApi
          .getMataUang()
          .then((data) => ({ success: true, data }))
          .catch(() => ({ success: false, data: [] })),
        getInvoices(),
      ]);
      if (pelRes.success) setPelanggans(pelRes.data);
      if (muRes.success) setMataUangs(muRes.data);
      if (invRes.success) setInvoices(invRes.data);
    } catch (e: any) {
      console.error("Gagal load dependencies:", e);
    }
  };

  useEffect(() => {
    fetchData(1);
    fetchDependencies();
  }, [periode]);

  const loadForm = async (id: number) => {
    setLoadingData(true);
    try {
      const res = await getNotaKreditById(id);
      if (res.status === "success") {
        setForm(res.data);
        setViewMode("form");
      } else {
        toast.error(res.message || "Gagal memuat detail nota kredit");
      }
    } catch (e: any) {
      toast.error(e.message || "Terjadi kesalahan");
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus nota kredit ini?")) return;
    try {
      const res = await deleteNotaKredit(id);
      if (res.status === "success") {
        toast.success("Berhasil dihapus");
        fetchData(pagination.page);
        if (form.id === id) {
          setForm(emptyForm);
          setViewMode("list");
        }
      } else {
        toast.error(res.message || "Gagal menghapus");
      }
    } catch (e: any) {
      toast.error(e.message || "Gagal menghapus");
    }
  };

  const handleSaveAll = async () => {
    if (!form.no_nota_kredit || !form.pelanggan_id) {
      toast.error("Lengkapi data yang wajib diisi!");
      return;
    }
    setIsSaving(true);
    try {
      if (form.id) {
        const res = await updateNotaKredit(form.id, form);
        if (res.status === "success") {
          toast.success("Berhasil disimpan");
          fetchData(pagination.page);
        } else {
          toast.error(res.message || "Gagal update");
        }
      } else {
        const res = await createNotaKredit(form);
        if (res.status === "success") {
          toast.success("Berhasil dibuat");
          setForm({ ...form, id: res.data.id });
          fetchData(1);
        } else {
          toast.error(res.message || "Gagal membuat nota kredit");
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Terjadi kesalahan server");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenForm = async () => {
    try {
      const res = await getAutoNo(periode);
      setForm({
        ...emptyForm,
        periode,
        no_nota_kredit: res?.data?.auto_no || "",
      });
      setViewMode("form");
    } catch (e) {
      console.error(e);
      setForm({
        ...emptyForm,
        periode,
      });
      setViewMode("form");
    }
  };

  // Line operations
  const addLine = (line: any) => {
    setForm((prev: any) => ({
      ...prev,
      lines: [...(prev.lines || []), line],
    }));
  };

  const updateLine = (idx: number, line: any) => {
    setForm((prev: any) => {
      const newLines = [...(prev.lines || [])];
      newLines[idx] = line;
      return { ...prev, lines: newLines };
    });
  };

  const removeLine = (idx: number) => {
    setForm((prev: any) => {
      const newLines = [...(prev.lines || [])];
      newLines.splice(idx, 1);
      return { ...prev, lines: newLines };
    });
  };

  return {
    dataList,
    loadingData,
    form,
    setForm,
    emptyForm,
    modalForm,
    setModalForm,
    pelanggans,
    mataUangs,
    invoices,
    viewMode,
    setViewMode,
    showNewModal,
    setShowNewModal,
    isSaving,
    pagination,
    fetchData,
    periode,
    setPeriode,
    loadForm,
    handleDelete,
    handleSaveAll,
    handleOpenForm,
    addLine,
    updateLine,
    removeLine,
  };
};
