import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { useAuth } from '../../auth/contexts/AuthContext';
import { salesOrderApi, SalesOrderData, SalesOrderLine } from '../api';
import { setupApi, PelangganData, MataUangData, PembayaranData, SalesmanData, ItemData, GudangData } from '../../setup/api';
import toast from 'react-hot-toast';

export const useSalesOrderLogic = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { user } = useAuth();

  const [dataList, setDataList] = useState<SalesOrderData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [mataUangs, setMataUangs] = useState<MataUangData[]>([]);
  const [pembayarans, setPembayarans] = useState<PembayaranData[]>([]);
  const [salesmans, setSalesmans] = useState<SalesmanData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [gudangs, setGudangs] = useState<GudangData[]>([]);
  const [wajibPpnbm, setWajibPpnbm] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [periode, setPeriode] = useState('2026-06');
  const [activeTab, setActiveTab] = useState<'umum' | 'detail' | 'surat_jalan' | 'outstanding'>('umum');

  const [showSjModal, setShowSjModal] = useState(false);
  const [sjForm, setSjForm] = useState({
    pelanggan_id: '',
    alamat_kirim: '',
    no_so: '',
    gudang_id: '',
    tanggal: new Date().toISOString().split('T')[0]
  });

  const [showNewSoModal, setShowNewSoModal] = useState(false);
  const [showPelangganModal, setShowPelangganModal] = useState(false);
  const [newSoForm, setNewSoForm] = useState<Partial<SalesOrderData>>({});

  const [form, setForm] = useState<Partial<SalesOrderData>>({
    no_so: '', tgl_so: new Date().toISOString().split('T')[0], pelanggan_id: null, alamat_kirim: '',
    no_po: '', tgl_po: '', mata_uang_id: null, pembayaran_id: null, salesman_id: null,
    tgl_kirim: '', dipesan_oleh: '', is_closed: false, is_void: false, keterangan: '',
    potongan_harga: 0, ppn_persen: 10, ppnbm_persen: 0, ongkos_angkut: 0,
    lines: []
  });

  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [editLineIndex, setEditLineIndex] = useState<number | null>(null);
  const [lineForm, setLineForm] = useState<SalesOrderLine>({
    item_id: null, satuan: '', kuantum: 1, harga_satuan: 0, disc_persen: 0, disc_harga: 0, keterangan: ''
  });

  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const mergeSjToSo = (soList: SalesOrderData[]) => {
    const savedSj = localStorage.getItem('edi_surat_jalans');
    const sjList = savedSj ? JSON.parse(savedSj) : [];
    return soList.map(so => {
      const relatedSj = sjList.filter((sj: any) => sj.no_so === so.no_so);
      const updatedLines = (so.lines || []).map(line => {
        const totalKirim = relatedSj.reduce((sum: number, sj: any) => {
          const sjLine = sj.lines?.find((sl: any) => sl.item_id === line.item_id);
          return sum + (Number(sjLine?.kuantum) || 0);
        }, 0);
        return { ...line, qty_kirim: totalKirim };
      });
      return { ...so, lines: updatedLines, surat_jalans: relatedSj };
    });
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoadingData(true);
    try {
      const [resSo, p, m, py, s, i, g, company] = await Promise.all([
        salesOrderApi.getAll().catch(() => []),
        setupApi.getPelanggan().catch(() => []),
        setupApi.getMataUang().catch(() => []),
        setupApi.getPembayaran().catch(() => []),
        setupApi.getSalesman().catch(() => []),
        setupApi.getItem().catch(() => []),
        setupApi.getGudang().catch(() => []),
        setupApi.getPerusahaan().catch(() => null)
      ]);

      let soData = resSo || [];
      soData = mergeSjToSo(soData);

      setDataList(soData);
      setPelanggans(p || []); setMataUangs(m || []); setPembayarans(py || []);
      setSalesmans(s || []); setItems(i || []); setGudangs(g || []);
      if (company) setWajibPpnbm(!!company.wajib_ppnbm);

      if (soData.length > 0) {
        setForm(soData[0]);
        setCurrentIndex(0);
        setIsNew(false);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleNewClick = async () => {
    try {
      const res = await salesOrderApi.autoNo();
      setNewSoForm({
        no_so: res.no_so, tgl_so: new Date().toISOString().split('T')[0], pelanggan_id: null, alamat_kirim: '',
        no_po: '', tgl_po: '', mata_uang_id: null, pembayaran_id: null, salesman_id: null,
        tgl_kirim: '', dipesan_oleh: '', is_closed: false, is_void: false, keterangan: '',
        potongan_harga: 0, ppn_persen: 10, ppnbm_persen: 0, ongkos_angkut: 0,
        lines: []
      });
      setShowNewSoModal(true);
    } catch (e) {
      console.error(e);
      setNewSoForm({
        no_so: '', tgl_so: new Date().toISOString().split('T')[0], pelanggan_id: null, alamat_kirim: '',
        lines: []
      });
      setShowNewSoModal(true);
    }
  };

  const handleCreateNewSo = async () => {
    try {
      const savedRes = await salesOrderApi.save(newSoForm as SalesOrderData);
      const resSo = await salesOrderApi.getAll();
      const soData = mergeSjToSo(resSo || []);
      setDataList(soData);

      const newlyCreated = soData.find(so => so.id === savedRes.id) || soData[soData.length - 1];
      if (newlyCreated) {
        setForm({
          ...newlyCreated,
          lines: newlyCreated.lines || []
        });
        setCurrentIndex(soData.findIndex(so => so.id === newlyCreated.id));
      }
      setIsNew(false);
      setActiveTab('umum');
      setShowNewSoModal(false);
      toast.success('Header Sales Order berhasil dibuat. Silakan lengkapi Detail Barang!');
    } catch (error) {
      toast.error('Gagal membuat Sales Order');
    }
  };

  const handleCetak = () => {
    if (form.no_so) {
      navigate(`/laporan?reportName=${encodeURIComponent('Sales Order (A4 / Kwarto / 1/2 Kwarto)')}&so_number=${encodeURIComponent(form.no_so)}`);
    } else {
      navigate('/laporan');
    }
  };

  const handleVoid = () => {
    const hasSJ = (form as any).surat_jalans && (form as any).surat_jalans.length > 0;
    if (!form.is_void && hasSJ) {
      toast.error('Sales Order tidak bisa di-void karena sudah memiliki Surat Jalan terkait. Hapus Surat Jalan terlebih dahulu!');
      return;
    }
    setForm(prev => ({ ...prev, is_void: !prev.is_void }));
  };

  const handleBuatSJClick = () => {
    if (!form.no_so) {
      toast.error('Silakan simpan Sales Order terlebih dahulu (membutuhkan No SO).');
      return;
    }
    setSjForm({
      pelanggan_id: form.pelanggan_id ? String(form.pelanggan_id) : '',
      alamat_kirim: form.alamat_kirim || '',
      no_so: form.no_so || '',
      gudang_id: '',
      tanggal: new Date().toISOString().split('T')[0]
    });
    setShowSjModal(true);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await salesOrderApi.save(form as SalesOrderData);
      const resSo = await salesOrderApi.getAll();
      const soData = mergeSjToSo(resSo || []);
      setDataList(soData);

      if (isNew) {
        setCurrentIndex(soData.length - 1);
        setForm(soData[soData.length - 1]);
        setIsNew(false);
      } else {
        setForm(soData[currentIndex]);
      }
      toast.success('Data berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan Sales Order');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSO = async (id: number) => {
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus Sales Order ini?');
    if (!isConfirmed) return;
    try {
      await salesOrderApi.delete(id);
      const resSo = await salesOrderApi.getAll();
      const soData = mergeSjToSo(resSo || []);
      setDataList(soData);
      toast.success('Data berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  const handleDelete = async () => {
    if (isNew || !form.id) return;
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus Sales Order ini?');
    if (!isConfirmed) return;
    try {
      await salesOrderApi.delete(form.id);
      const resSo = await salesOrderApi.getAll();
      const soData = mergeSjToSo(resSo || []);
      setDataList(soData);

      if (soData.length > 0) {
        setCurrentIndex(0);
        setForm(soData[0]);
      } else {
        setForm({
          no_so: '', tgl_so: new Date().toISOString().split('T')[0], pelanggan_id: null, alamat_kirim: '',
          no_po: '', tgl_po: '', mata_uang_id: null, pembayaran_id: null, salesman_id: null,
          tgl_kirim: '', dipesan_oleh: '', is_closed: false, is_void: false, keterangan: '',
          potongan_harga: 0, ppn_persen: 10, ppnbm_persen: 0, ongkos_angkut: 0,
          lines: []
        });
      }
      setViewMode('list');
      toast.success('Data berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  const calculateSubtotal = () => {
    return (form.lines || []).reduce((acc: number, line: any) => {
      const base = (line.kuantum || 0) * (line.harga_satuan || 0);
      const disc = (base * (line.disc_persen || 0) / 100) + (line.disc_harga || 0);
      return acc + (base - disc);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const dpp = subtotal - (form.potongan_harga || 0);
  const ppnAmount = dpp * (form.ppn_persen || 0) / 100;
  const ppnbmAmount = wajibPpnbm ? dpp * (form.ppnbm_persen || 0) / 100 : 0;
  const total = dpp + ppnAmount + ppnbmAmount + (form.ongkos_angkut || 0);

  const handlePelangganChange = (id: number) => {
    const p = pelanggans.find(x => x.id === id);
    const discPersen = p?.diskon || 0;
    const newLines = (form.lines || []).map((line: any) => ({ ...line, disc_persen: discPersen }));
    setForm({ ...form, pelanggan_id: id, alamat_kirim: p?.alamat_kirim || p?.alamat || '', lines: newLines });
  };

  const handleOpenAddLine = () => {
    const p = pelanggans.find(x => x.id === form.pelanggan_id);
    const discPersen = p?.diskon || 0;
    setEditLineIndex(null);
    setLineForm({ item_id: null, satuan: '', kuantum: 1, harga_satuan: 0, disc_persen: discPersen, disc_harga: 0, keterangan: '' });
    setIsLineModalOpen(true);
  };

  const handleOpenEditLine = (idx: number) => {
    setEditLineIndex(idx);
    setLineForm({ ...form.lines![idx] });
    setIsLineModalOpen(true);
  };

  const handleSaveLine = () => {
    if (!lineForm.item_id) {
      toast.error('Item harus dipilih!');
      return;
    }
    const newLines = [...(form.lines || [])];
    if (editLineIndex !== null) {
      newLines[editLineIndex] = lineForm;
    } else {
      newLines.push(lineForm);
    }
    setForm({ ...form, lines: newLines });
    setIsLineModalOpen(false);
  };

  const removeLine = (idx: number) => {
    const newLines = [...(form.lines || [])];
    newLines.splice(idx, 1);
    setForm({ ...form, lines: newLines });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setForm(dataList[currentIndex - 1]);
      setIsNew(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < dataList.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setForm(dataList[currentIndex + 1]);
      setIsNew(false);
    }
  };

  // Auto closed logic based on Sisa Order
  useEffect(() => {
    if (form.lines && form.lines.length > 0) {
      const allLinesDelivered = form.lines.every(line => {
        const kirim = (line as any).qty_kirim || 0;
        return line.kuantum > 0 && line.kuantum - kirim <= 0;
      });
      // If all delivered and not closed yet, close it (only if not void)
      if (allLinesDelivered && !form.is_closed && !form.is_void) {
        setForm(prev => ({ ...prev, is_closed: true }));
      }
    }
  }, [form.lines]);

  return {
    navigate,
    user,
    dataList,
    currentIndex,
    setCurrentIndex,
    pelanggans,
    mataUangs,
    pembayarans,
    salesmans,
    items,
    gudangs,
    wajibPpnbm,
    loadingData,
    periode,
    setPeriode,
    activeTab,
    setActiveTab,
    showSjModal,
    setShowSjModal,
    sjForm,
    setSjForm,
    showNewSoModal,
    setShowNewSoModal,
    showPelangganModal,
    setShowPelangganModal,
    newSoForm,
    setNewSoForm,
    form,
    setForm,
    isLineModalOpen,
    setIsLineModalOpen,
    editLineIndex,
    lineForm,
    setLineForm,
    viewMode,
    setViewMode,
    isNew,
    setIsNew,
    fetchInitialData,
    handleNewClick,
    handleCreateNewSo,
    handleCetak,
    handleVoid,
    handleBuatSJClick,
    isSaving,
    handleSave,
    handleDeleteSO,
    handleDelete,
    calculateSubtotal,
    subtotal,
    dpp,
    ppnAmount,
    ppnbmAmount,
    total,
    handlePelangganChange,
    handleOpenAddLine,
    handleOpenEditLine,
    handleSaveLine,
    removeLine,
    handlePrevious,
    handleNext
  };
};
