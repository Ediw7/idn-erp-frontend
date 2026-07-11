import { useState, useEffect, useMemo } from "react";
import { useConfirm } from "../../../../contexts/ConfirmContext";
import {
  notaReturPembelianApi,
  NotaReturPembelianData,
  NotaReturPembelianLine,
} from "../api";
import {
  setupApi,
  SupplierData,
  MataUangData,
  ItemData,
  GudangData,
} from "../../../setup/api";
import toast from "react-hot-toast";

export const useNotaReturPembelianLogic = () => {
  const confirm = useConfirm();

  const [dataList, setDataList] = useState<NotaReturPembelianData[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [mataUangs, setMataUangs] = useState<MataUangData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [gudangs, setGudangs] = useState<GudangData[]>([]);

  // Filters for list view
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
  const [periode, setPeriode] = useState(`${currentYear}-${currentMonth}`);

  const emptyForm: NotaReturPembelianData = {
    no_nota: "",
    tgl_nota: new Date().toISOString().split("T")[0],
    supplier_id: null,
    alamat_penjual: "",
    jenis_transaksi: "Kepada Bukan Pemungut PPN (01)",
    gudang_id: "",
    jenis_retur: "Barang Kena Pajak",
    atas_no_fp: "",
    tgl_fp: "",
    mata_uang_id: null,
    tarif_ppn: 11,
    kurs_pajak: 1,
    status: "",
    lines: [],
    tanda_tangan: "",
    jabatan: "",
  };

  const [form, setForm] = useState<NotaReturPembelianData>(emptyForm);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoadingList(true);
    try {
      const [s, m, i, g, listRes] = await Promise.all([
        setupApi.getSupplier().catch(() => []),
        setupApi.getMataUang().catch(() => []),
        setupApi.getItem().catch(() => []),
        setupApi.getGudang().catch(() => []),
        notaReturPembelianApi.getAll().catch(() => []),
      ]);

      setSuppliers(s);
      setMataUangs(m);
      setItems(i);
      setGudangs(g);
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
      const res = await notaReturPembelianApi
        .autoNo()
        .catch(() => ({ no_nota: "" }));
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

  const handleEditClick = (item: NotaReturPembelianData) => {
    setForm(item);
    setIsNew(false);
    setViewMode("form");
  };

  const handleSave = async () => {
    try {
      if (!form.supplier_id) {
        toast.error("Supplier harus dipilih");
        return;
      }
      setIsSaving(true);
      const res = await notaReturPembelianApi.save(form);
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
      "Apakah Anda yakin ingin menghapus Nota Retur Pembelian ini?",
    );
    if (!isConfirmed) return;
    try {
      await notaReturPembelianApi.delete(id);
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

  const handleSupplierChange = (id: number | "") => {
    if (!id) {
      setForm({ ...form, supplier_id: null, alamat_penjual: "" });
      return;
    }
    const s = suppliers.find((x) => x.id === id);
    setForm({
      ...form,
      supplier_id: id as number,
      alamat_penjual: s?.alamat || "",
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
        },
      ],
    });
  };

  const removeLine = (idx: number) => {
    const newLines = [...(form.lines || [])];
    newLines.splice(idx, 1);
    setForm({ ...form, lines: newLines });
  };

  const updateLine = (
    idx: number,
    field: keyof NotaReturPembelianLine,
    value: any,
  ) => {
    const newLines = [...(form.lines || [])];
    const line = { ...newLines[idx], [field]: value };

    if (field === "item_id" && value) {
      const item = items.find((x) => x.id === value);
      if (item) {
        line.kode_barang = item.kode;
        line.nama_barang = item.nama;
        line.satuan = item.satuan || "Pcs";
        line.harga_satuan = item.harga_jual_1 || 0; // Using harga_jual_1 for pembelian
      }
    }

    if (
      field === "kuantum" ||
      field === "harga_satuan" ||
      field === "item_id"
    ) {
      line.harga_jual = line.kuantum * line.harga_satuan;
    }

    newLines[idx] = line;
    setForm({ ...form, lines: newLines });
  };

  return {
    dataList,
    loadingList,
    suppliers,
    mataUangs,
    items,
    gudangs,
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
    handleSupplierChange,
    addLine,
    removeLine,
    updateLine,
  };
};
