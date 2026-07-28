import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getFakturPajak,
  getFakturPajakById,
  createFakturPajak,
  updateFakturPajak,
  deleteFakturPajak,
  autoNoFp,
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
  const [penjatahans, setPenjatahans] = useState<any[]>([]);
  const [tandaTangans, setTandaTangans] = useState<any[]>([]);

  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [isSaving, setIsSaving] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newForm, setNewForm] = useState<any>(emptyForm);
  const [showPenjatahanModal, setShowPenjatahanModal] = useState(false);
  const [showCariFpModal, setShowCariFpModal] = useState(false);

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
      const [pelRes, muRes, invRes, itemRes, fpRes, ttRes] = await Promise.all([
        setupApi
          .getPelanggan()
          .then((data) => ({ success: true, data }))
          .catch(() => ({ success: false, data: [] })),
        setupApi
          .getMataUang()
          .then((data) => ({ success: true, data }))
          .catch(() => ({ success: false, data: [] })),
        getInvoices()
          .then((res) => ({ success: true, data: res }))
          .catch(() => ({ success: false, data: [] })),
        setupApi
          .getItem()
          .then((data) => ({ success: true, data }))
          .catch(() => ({ success: false, data: [] })),
        setupApi
          .getFakturPajak()
          .then((data) => ({ success: true, data }))
          .catch(() => ({ success: false, data: [] })),
        setupApi
          .getTandaTangan()
          .then((data) => ({ success: true, data }))
          .catch(() => ({ success: false, data: [] })),
      ]);

      if (pelRes.success) setPelanggans(pelRes.data);
      if (muRes.success) setMataUangs(muRes.data);
      if (invRes.success) setInvoices(invRes.data);
      if (itemRes.success) setItems(itemRes.data);
      if (fpRes.success) setPenjatahans(fpRes.data);
      if (ttRes.success) setTandaTangans(ttRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData(1);
    fetchDependencies();
  }, [periode]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.no_invoice) {
      const { action, no_invoice, pembeli_id, lines } = location.state;

      const loadFromInvoice = async () => {
        setLoadingData(true);
        try {
          // Check if FP already exists for this invoice
          const res = await getFakturPajak({ no_invoice });
          if (res.status === "success" && res.data && res.data.length > 0) {
            const existingFp = res.data[0];

            if (action === "pengganti") {
              // Create pengganti from existing
              setForm({
                ...emptyForm,
                fp_diganti: existingFp.no_fp,
                tgl_fp_diganti: existingFp.tgl_fp,
                jenis_status: "Pengganti",
                no_invoice: existingFp.no_invoice,
                pembeli_id: existingFp.pembeli_id,
                lines: existingFp.lines || [],
              });
              setViewMode("form");
            } else {
              // Edit existing
              await loadForm(existingFp.id);
            }
          } else {
            // New FP for invoice
            setForm({
              ...emptyForm,
              no_invoice,
              pembeli_id,
              lines: lines || [],
            });
            setViewMode("form");
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingData(false);
          // Clear state so it doesn't trigger again on refresh
          window.history.replaceState({}, document.title);
        }
      };

      loadFromInvoice();
    }
  }, [location.state]);

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

    let totalHargaJual = 0;
    (form.lines || []).forEach((line: any) => {
      totalHargaJual +=
        (line.kuantum || 0) * (line.harga_satuan || 0) -
        (line.disc_footer || 0);
    });

    let dppSetelahPotongan =
      totalHargaJual - (form.potongan || 0) - (form.uang_muka || 0);
    if (form.is_dpp_valas) {
      dppSetelahPotongan = dppSetelahPotongan * (100 / 110);
    }
    const ppn = dppSetelahPotongan * ((form.tarif_ppn || 11) / 100);

    const payload = {
      ...form,
      harga_jual_total: totalHargaJual,
      dpp_rp: dppSetelahPotongan,
      ppn_rp: ppn,
    };

    try {
      if (payload.id) {
        const res = await updateFakturPajak(payload.id, payload);
        if (res.status === "success") {
          toast.success("Berhasil disimpan");
          fetchData(pagination.page);
        } else {
          toast.error(res.message || "Gagal update");
        }
      } else {
        const res = await createFakturPajak(payload);
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

  // Called from list view "BUAT BARU" - go directly to form
  const handleOpenForm = () => {
    setForm(emptyForm);
    setViewMode("form");
  };

  // Called from form view "+ TAMBAH FP" button - opens modal
  const handleNewClick = () => {
    setNewForm(emptyForm);
    setShowNewModal(true);
  };

  // Called from modal "BUAT FAKTUR PAJAK" - fills form with modal data
  const handleCreateNew = () => {
    setForm(newForm);
    setShowNewModal(false);
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

  // Penjatahan NSFP CRUD
  const handleSavePenjatahan = async (data: any) => {
    const res = await setupApi.saveFakturPajak(data);
    toast.success(res.message || "Berhasil disimpan");
  };

  const handleDeletePenjatahan = async (id: number) => {
    await setupApi.deleteFakturPajak(id);
    toast.success("Berhasil dihapus");
  };

  const refreshPenjatahans = async () => {
    try {
      const data = await setupApi.getFakturPajak();
      setPenjatahans(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Auto generate No. FP based on selected penomoran
  const handleAutoNoFp = async (
    penomoran: string,
    kode_transaksi?: string,
    kode_status?: string,
  ) => {
    if (!penomoran) return "";
    try {
      // Default to "01" and "0" if not provided
      const tx =
        kode_transaksi ||
        (form.jenis_transaksi ? form.jenis_transaksi.split(" ")[0] : "01");
      const st = kode_status || (form.jenis_status === "Pengganti" ? "1" : "0");

      const res = await autoNoFp(penomoran, tx, st);
      if (res.status === "success" && res.data?.no_fp) {
        return res.data.no_fp;
      } else {
        toast.error(res.message || "Gagal generate No. FP");
        return "";
      }
    } catch (e: any) {
      toast.error(e.message || "Gagal generate No. FP");
      return "";
    }
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
    penjatahans,
    tandaTangans,
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
    handleNewClick,
    handleCreateNew,
    showNewModal,
    setShowNewModal,
    newForm,
    setNewForm,
    addLine,
    updateLine,
    removeLine,
    showPenjatahanModal,
    setShowPenjatahanModal,
    handleSavePenjatahan,
    handleDeletePenjatahan,
    refreshPenjatahans,
    handleAutoNoFp,
    showCariFpModal,
    setShowCariFpModal,
  };
};
