import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConfirm } from '../../../../contexts/ConfirmContext';
import { useAuth } from '../../../auth/contexts/AuthContext';
import { fakturPajakApi, FakturPajakData, FakturPajakLine } from '../api';
import { setupApi, PelangganData, ItemData } from '../../../setup/api';
import { useSignatureAutoFill } from '../../../../hooks/useSignatureAutoFill';
import { getInvoices } from '../../../transactionsApi';
import toast from 'react-hot-toast';

export const useFakturPajakLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const confirm = useConfirm();
  const { user } = useAuth();

  const [dataList, setDataList] = useState<FakturPajakData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [fakturPajakSetups, setFakturPajakSetups] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Filters for ListView
  const [filterTglMulai, setFilterTglMulai] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
  const [filterTglAkhir, setFilterTglAkhir] = useState(new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]);
  const [filterNoFaktur, setFilterNoFaktur] = useState('');
  const [filterMataUang, setFilterMataUang] = useState('');
  const [filterNamaPembeli, setFilterNamaPembeli] = useState('');
  const [filterNoInvoice, setFilterNoInvoice] = useState('');

  const emptyForm: FakturPajakData = {
    penomoran: '',
    no_fp: '',
    tgl_fp: new Date().toISOString().split('T')[0],
    pembeli_id: null,
    alamat: '',
    npwp: '',
    fp_diganti: '',
    tgl_fp_diganti: '',
    jenis_transaksi: '01 - Kepada Bukan Pemungut PPN',
    jenis_status: 'Normal',
    no_invoice: '',
    tarif_ppn: 11,
    mata_uang: 'IDR',
    kurs_pajak: 1,
    penandatangan: 'Admin',
    jabatan: 'Finance',
    ket_tambahan: '',
    lines: [],
    potongan: 0,
    uang_muka: 0
  };

  const [form, setForm] = useState<FakturPajakData>(emptyForm);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modals
  const [showPenggantiModal, setShowPenggantiModal] = useState(false);
  const [showEFakturModal, setShowEFakturModal] = useState(false);
  const [showNsfpModal, setShowNsfpModal] = useState(false);
  const [showPelangganModal, setShowPelangganModal] = useState(false);

  const { signatureData } = useSignatureAutoFill('Faktur Pajak');

  useEffect(() => {
    if (signatureData && isNew) {
      setForm(prev => ({
        ...prev,
        penandatangan: signatureData.nama || prev.penandatangan,
        jabatan: signatureData.jabatan || prev.jabatan
      }));
    }
  }, [signatureData, isNew]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (location.state && location.state.action === 'new') {
      handleNewClick();
    }
  }, [location.state]);

  const fetchInitialData = async () => {
    setLoadingData(true);
    try {
      const [p, fpSetups, i, fData, invs] = await Promise.all([
        setupApi.getPelanggan().catch(() => []),
        setupApi.getFakturPajak().catch(() => []),
        setupApi.getItem().catch(() => []),
        fakturPajakApi.getAll().catch(() => []),
        getInvoices().catch(() => [])
      ]);
      setPelanggans(p);
      setFakturPajakSetups(fpSetups);
      setItems(i);
      setInvoices(invs);
      
      // Simulate mapping names since backend API might not join
      const mappedData = fData.map((d: any) => {
        const pel = p.find((x: any) => x.id === d.pembeli_id);
        return {
          ...d,
          pembeli_nama: pel?.nama || d.pembeli_nama,
          pembeli_npwp: pel?.npwp || d.pembeli_npwp
        };
      });
      setDataList(mappedData);

      if (mappedData.length > 0) {
        setForm(mappedData[0]);
        setCurrentIndex(0);
        setIsNew(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleFilter = async () => {
     // In real app, send filter params to backend API.
     // For now, we rely on the initial fetch and will filter in the UI side in ListView.
     toast.success('Pencarian diterapkan (Simulasi)');
  };

  const handleShowAll = () => {
     setFilterNoFaktur('');
     setFilterMataUang('');
     setFilterTglMulai(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
     setFilterTglAkhir(new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]);
     setFilterNamaPembeli('');
     setFilterNoInvoice('');
     // Refetch or reset filter
  };

  const handleNewClick = () => {
    setForm(emptyForm);
    setIsNew(true);
    setViewMode('form');
  };

  const handlePembeliChange = (id: number | '') => {
    const p = pelanggans.find(x => x.id === id);
    setForm({
      ...form,
      pembeli_id: id ? Number(id) : null,
      alamat: p?.alamat_wp || p?.alamat || '',
      npwp: p?.npwp || ''
    });
  };

  const handleInvoiceChange = (no_inv: string) => {
    const inv = invoices.find(x => x.no_invoice === no_inv);
    if (inv) {
      const pId = inv.pelanggan_id || form.pembeli_id;
      const p = pelanggans.find(x => x.id === pId);
      
      const newForm: FakturPajakData = {
        ...form,
        no_invoice: no_inv,
        pembeli_id: pId,
        alamat: p?.alamat_wp || p?.alamat || '',
        npwp: p?.npwp || '',
        mata_uang: inv.mata_uang || 'IDR',
        lines: (inv.lines || []).map((l: any) => ({
           item_id: l.item_id,
           kode_barang: l.kode_barang,
           nama_barang: l.nama_barang,
           satuan: l.satuan || 'Pcs',
           kuantum: l.qty || 1,
           harga_satuan: l.harga_satuan || 0,
           harga_jual: (l.qty || 1) * (l.harga_satuan || 0)
        }))
      };
      setForm(newForm);
    } else {
      setForm({ ...form, no_invoice: no_inv });
    }
  };

  const calculateTotal = () => {
    const totalHargaJual = (form.lines || []).reduce((sum: number, line: any) => sum + (Number(line.harga_jual) || 0), 0);
    const dppValas = totalHargaJual - (Number(form.potongan) || 0) - (Number(form.uang_muka) || 0);
    const dpp = dppValas; // Assuming IDR or simple 1:1 for now, otherwise multiply by kurs
    const ppn = Math.floor(dpp * (Number(form.tarif_ppn) / 100));
    return { totalHargaJual, dppValas, dpp, ppn };
  };

  const handleSave = async () => {
    if (!form.no_fp) {
      toast.error('No. Faktur Pajak harus diisi!');
      return;
    }
    setIsSaving(true);
    try {
      const { dpp, ppn } = calculateTotal();
      const payload = {
        ...form,
        dpp_rp: dpp,
        ppn_rp: ppn
      };
      
      const res = await fakturPajakApi.save(payload);
      toast.success('Faktur Pajak berhasil disimpan!');
      setIsNew(false);
      
      // Update local state to simulate backend save
      const newDataList = [...dataList];
      if (isNew) {
        payload.id = res.id;
        newDataList.push(payload);
        setCurrentIndex(newDataList.length - 1);
      } else {
        newDataList[currentIndex] = payload;
      }
      setDataList(newDataList);

    } catch (e) {
      toast.error('Gagal menyimpan Faktur Pajak');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (isNew || !form.id) return;
    const ok = await confirm('Yakin ingin menghapus Faktur Pajak ini?');
    if (!ok) return;
    try {
      await fakturPajakApi.delete(form.id);
      toast.success('Berhasil dihapus');
      const newList = dataList.filter(x => x.id !== form.id);
      setDataList(newList);
      if (newList.length > 0) {
        setForm(newList[0]);
        setCurrentIndex(0);
      } else {
        setForm(emptyForm);
        setViewMode('list');
      }
    } catch (e) {
      toast.error('Gagal menghapus');
    }
  };

  const handleDeleteById = async (id: number) => {
    try {
      await fakturPajakApi.delete(id);
      toast.success('Berhasil dihapus');
      const newList = dataList.filter(x => x.id !== id);
      setDataList(newList);
      if (form.id === id) {
        if (newList.length > 0) {
          setForm(newList[0]);
          setCurrentIndex(0);
        } else {
          setForm(emptyForm);
          setViewMode('list');
        }
      }
    } catch (e) {
      toast.error('Gagal menghapus');
    }
  };

  // Line item handlers
  const handleAddLine = () => {
    setForm({
      ...form,
      lines: [...(form.lines || []), { item_id: null, kode_barang: '', nama_barang: '', satuan: 'Pcs', kuantum: 1, harga_satuan: 0, harga_jual: 0 }]
    });
  };

  const handleRemoveLine = (idx: number) => {
    const newLines = [...(form.lines || [])];
    newLines.splice(idx, 1);
    setForm({ ...form, lines: newLines });
  };

  const handleUpdateLine = (idx: number, field: keyof FakturPajakLine, value: any) => {
    const newLines = [...(form.lines || [])];
    const line = { ...newLines[idx], [field]: value };
    
    if (field === 'item_id' && value) {
      const item = items.find(x => x.id === value);
      if (item) {
        line.kode_barang = item.kode;
        line.nama_barang = item.nama;
        line.satuan = item.satuan || 'Pcs';
        line.harga_satuan = item.harga_jual_1 || 0;
      }
    }
    
    if (field === 'kuantum' || field === 'harga_satuan' || field === 'item_id') {
      line.harga_jual = line.kuantum * line.harga_satuan;
    }
    
    newLines[idx] = line;
    setForm({ ...form, lines: newLines });
  };

  return {
    navigate,
    user,
    dataList,
    currentIndex,
    setCurrentIndex,
    pelanggans,
    items,
    fakturPajakSetups,
    invoices,
    loadingData,
    fetchInitialData,
    filterTglMulai, setFilterTglMulai,
    filterTglAkhir, setFilterTglAkhir,
    filterNoFaktur, setFilterNoFaktur,
    filterMataUang, setFilterMataUang,
    filterNamaPembeli, setFilterNamaPembeli,
    filterNoInvoice, setFilterNoInvoice,
    handleFilter,
    handleShowAll,
    form, setForm,
    viewMode, setViewMode,
    isNew, setIsNew,
    isSaving,
    showPenggantiModal, setShowPenggantiModal,
    showEFakturModal, setShowEFakturModal,
    showNsfpModal, setShowNsfpModal,
    showPelangganModal, setShowPelangganModal,
    signatureData,
    handleNewClick,
    handlePembeliChange,
    handleInvoiceChange,
    handleSave,
    handleDelete,
    handleDeleteById,
    calculateTotal,
    handleAddLine,
    handleRemoveLine,
    handleUpdateLine
  };
};
