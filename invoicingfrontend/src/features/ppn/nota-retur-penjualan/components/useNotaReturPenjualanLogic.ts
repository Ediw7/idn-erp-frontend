import { useState, useEffect, useMemo } from "react";
import { useConfirm } from "../../../../contexts/ConfirmContext";
import { notaReturApi, NotaReturData, NotaReturLine } from "../api";
import {
  setupApi,
  PelangganData,
  MataUangData,
  ItemData,
  GudangData,
} from "../../../setup/api";
import { getInvoices } from "../../../transactionsApi";
import toast from "react-hot-toast";

export const useNotaReturPenjualanLogic = () => {
  const confirm = useConfirm();

  const [dataList, setDataList] = useState<NotaReturData[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [mataUangs, setMataUangs] = useState<MataUangData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [gudangs, setGudangs] = useState<GudangData[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  // Filters for list view
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const [periode, setPeriode] = useState(`${currentYear}-${currentMonth}`);

  const emptyForm: NotaReturData = {
    no_nota: "",
    tgl_nota: new Date().toISOString().split("T")[0],
    pelanggan_id: null,
    alamat_pembeli: "",
    jenis_transaksi: "Kepada Bukan Pemungut PPN (01)",
    gudang_id: "",
    jenis_retur: "Barang Kena Pajak",
    atas_no_fp: "",
    tgl_fp: "",
    atas_no_invoice: "",
    mata_uang_id: null,
    tarif_ppn: 11,
    kurs_pajak: 1,
    lines: [],
    lokasi_pelaporan: "",
    tanda_tangan: "",
    jabatan: "",
  };

  const [form, setForm] = useState<NotaReturData>(emptyForm);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoadingList(true);
    try {
      const [p, m, i, g, invRes, listRes] = await Promise.all([
        setupApi.getPelanggan().catch(() => []),
        setupApi.getMataUang().catch(() => []),
        setupApi.getItem().catch(() => []),
        setupApi.getGudang().catch(() => []),
        getInvoices().catch(() => []),
        notaReturApi.getAll().catch(() => []),
      ]);

      setPelanggans(p);
      setMataUangs(m);
      setItems(i);
      setGudangs(g);
      setInvoices(invRes);
      setDataList(listRes);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Gagal memuat data");
    } finally {
      setLoadingList(false);
    }
  };

  const handleNewClick = async () => {
    try {
      const res = await notaReturApi.autoNo().catch(() => ({ no_nota: "" }));
      setForm({ ...emptyForm, no_nota: res.no_nota || "" });
      setIsNew(true);
      setViewMode("form");
    } catch (e) {
      console.error(e);
      setForm(emptyForm);
      setIsNew(true);
      setViewMode("form");
    }
  };

  const handleEditClick = (item: NotaReturData) => {
    setForm(item);
    setIsNew(false);
    setViewMode("form");
  };

  const handleSave = async () => {
    try {
      if (!form.pelanggan_id) {
        toast.error("Pelanggan harus dipilih");
        return;
      }
      setIsSaving(true);
      const res = await notaReturApi.save(form);
      toast.success("Data berhasil disimpan");
      setIsNew(false);

      const newData = { ...form, id: form.id || res.id };
      if (isNew) {
        setDataList([newData, ...dataList]);
      } else {
        setDataList(dataList.map((x) => (x.id === form.id ? newData : x)));
      }
    } catch (error) {
      toast.error("Gagal menyimpan Nota Retur");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteById = async (id: number) => {
    const isConfirmed = await confirm(
      "Apakah Anda yakin ingin menghapus Nota Retur ini?",
    );
    if (!isConfirmed) return;
    try {
      await notaReturApi.delete(id);
      toast.success("Data berhasil dihapus");
      setDataList(dataList.filter((x) => x.id !== id));
      if (form.id === id) {
        setViewMode("list");
      }
    } catch (error) {
      toast.error("Gagal menghapus data");
    }
  };

  const dpp = useMemo(() => {
    return (form.lines || []).reduce(
      (acc, line) => acc + (line.harga_jual || 0),
      0,
    );
  }, [form.lines]);

  const ppnAmount = useMemo(() => {
    return (dpp * (form.tarif_ppn || 11)) / 100;
  }, [dpp, form.tarif_ppn]);

  const handlePelangganChange = (id: number | "") => {
    if (!id) {
      setForm({
        ...form,
        pelanggan_id: null,
        alamat_pembeli: "",
        atas_no_invoice: "",
      });
      return;
    }
    const p = pelanggans.find((x) => x.id === id);
    setForm({
      ...form,
      pelanggan_id: id as number,
      alamat_pembeli: p?.alamat_kirim || p?.alamat || "",
      atas_no_invoice: "",
    });
  };

  const addLine = () => {
    setForm({
      ...form,
      lines: [
        ...(form.lines || []),
        {
          item_id: null,
          kode_barang: "",
          nama_barang: "",
          satuan: "Pcs",
          kuantum: 1,
          harga_satuan: 0,
          harga_jual: 0,
          hpp: 0,
          total_hpp: 0,
        },
      ],
    });
  };

  const removeLine = (idx: number) => {
    const newLines = [...(form.lines || [])];
    newLines.splice(idx, 1);
    setForm({ ...form, lines: newLines });
  };

  const updateLine = (idx: number, field: keyof NotaReturLine, value: any) => {
    const newLines = [...(form.lines || [])];
    const line = { ...newLines[idx], [field]: value };

    if (field === "item_id" && value) {
      const item = items.find((x) => x.id === value);
      if (item) {
        line.kode_barang = item.kode;
        line.nama_barang = item.nama;
        line.satuan = item.satuan || "Pcs";
        line.harga_satuan = item.harga_jual_1 || 0;
      }
    }

    if (
      field === "kuantum" ||
      field === "harga_satuan" ||
      field === "item_id"
    ) {
      line.harga_jual = line.kuantum * line.harga_satuan;
    }

    if (field === "kuantum" || field === "hpp" || field === "item_id") {
      line.total_hpp = line.kuantum * line.hpp;
    }

    newLines[idx] = line;
    setForm({ ...form, lines: newLines });
  };

  return {
    dataList,
    loadingList,
    pelanggans,
    mataUangs,
    items,
    gudangs,
    invoices,
    periode,
    setPeriode,
    form,
    setForm,
    viewMode,
    setViewMode,
    isNew,
    isSaving,
    handleNewClick,
    handleEditClick,
    handleSave,
    handleDeleteById,
    dpp,
    ppnAmount,
    handlePelangganChange,
    addLine,
    removeLine,
    updateLine,
  };
};
