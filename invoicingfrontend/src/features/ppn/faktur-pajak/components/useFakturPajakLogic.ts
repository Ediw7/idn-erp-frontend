import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getFakturPajak,
  getFakturPajakById,
  createFakturPajak,
  updateFakturPajak,
  deleteFakturPajak,
} from "../api";
import { setupApi } from "../../../setup/api";
import { getInvoices } from "../../../transactionsApi";

export const useFakturPajakLogic = () => {
  const emptyForm = {
    id: null,
    penomoran: "",
    no_fp: "",
    tgl_fp: new Date().toISOString().split("T")[0],
    pembeli_id: "",
    fp_diganti: "",
    tgl_fp_diganti: "",
    jenis_transaksi: "01 - Kepada Bukan Pemungut PPN",
    jenis_status: "Normal",
    no_invoice: "",
    tarif_ppn: 11,
    mata_uang: "IDR",
    kurs_pajak: 1,
    penandatangan: "",
    jabatan: "",
    ket_tambahan: "",
    potongan: 0,
    uang_muka: 0,
    dpp_rp: 0,
    ppn_rp: 0,
    lines: [],
  };

  const [dataList, setDataList] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [pelanggans, setPelanggans] = useState<any[]>([]);
  const [mataUangs, setMataUangs] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  const [viewMode, setViewMode] = useState<"list" | "form">("list");
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
      const res = await getFakturPajak({
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
        toast.error(res.message || "Gagal mengambil data Faktur Pajak");
      }
    } catch (e: any) {
      toast.error(e.message || "Gagal mengambil data Faktur Pajak");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [pelRes, muRes, invRes, itemRes] = await Promise.all([
        setupApi
          .getPelanggan()
          .then((data) => ({ success: true, data }))
          .catch(() => ({ success: false, data: [] })),
        setupApi
          .getMataUang()
          .then((data) => ({ success: true, data }))
          .catch(() => ({ success: false, data: [] })),
        getInvoices()
          .then((res) => ({ success: true, data: res.data }))
          .catch(() => ({ success: false, data: [] })),
        setupApi
          .getItem()
          .then((data) => ({ success: true, data }))
          .catch(() => ({ success: false, data: [] })),
      ]);

      if (pelRes.success) setPelanggans(pelRes.data);
      if (muRes.success) setMataUangs(muRes.data);
      if (invRes.success) setInvoices(invRes.data);
      if (itemRes.success) setItems(itemRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData(1);
    fetchDependencies();
  }, [periode]);

  const loadForm = async (id: number) => {
    setLoadingData(true);
    try {
      const res = await getFakturPajakById(id);
      if (res.status === "success") {
        setForm(res.data);
        setViewMode("form");
      } else {
        toast.error(res.message || "Gagal memuat detail Faktur Pajak");
      }
    } catch (e: any) {
      toast.error(e.message || "Terjadi kesalahan");
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus Faktur Pajak ini?")) return;
    try {
      const res = await deleteFakturPajak(id);
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
    if (!form.no_fp) {
      toast.error("No. Faktur Pajak wajib diisi!");
      return;
    }
    setIsSaving(true);
    try {
      if (form.id) {
        const res = await updateFakturPajak(form.id, form);
        if (res.status === "success") {
          toast.success("Berhasil disimpan");
          fetchData(pagination.page);
        } else {
          toast.error(res.message || "Gagal update");
        }
      } else {
        const res = await createFakturPajak(form);
        if (res.status === "success") {
          toast.success("Berhasil dibuat");
          fetchData(pagination.page);

          // Stay on form view with updated ID
          setForm({ ...form, id: res.data.id });
        } else {
          toast.error(res.message || "Gagal membuat");
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Gagal simpan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenForm = () => {
    setForm(emptyForm);
    setViewMode("form");
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
    pelanggans,
    mataUangs,
    invoices,
    items,
    viewMode,
    setViewMode,
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
