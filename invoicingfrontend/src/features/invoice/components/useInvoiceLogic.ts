import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { setupApi } from '../../setup/api';
import { useSignatureAutoFill } from '../../../hooks/useSignatureAutoFill';

export const emptyForm = {
  no_invoice: '',
  tgl_invoice: new Date().toISOString().split('T')[0],
  pembeli_id: '',
  alamat: '',
  npwp: '',
  proyek: '',
  mata_uang: 'IDR',
  no_so: '',
  no_po: '',
  cara_pembayaran: '',
  salesman_id: '',
  no_faktur_pajak: '',
  no_kwitansi: '',
  kurs_jual: 1,
  tgl_jt: '',
  tgl_po: '',
  gudang_id: '',
  is_jasa: false,
  is_paid: false,
  catatan: '',
  keterangan: '',
  penandatangan: 'Admin',
  jabatan: 'Finance',
  lines: [],
  create_date: '',
  create_uid_name: '',
  write_date: '',
  write_uid_name: ''
};

export const useInvoiceLogic = (locationSearch: string) => {
  const { user } = useAuth();
  const confirm = useConfirm();

  const [activeTab, setActiveTab] = useState('umum');
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [dataList, setDataList] = useState<any[]>(() => {
    const saved = localStorage.getItem('edi_invoices');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showFpModal, setShowFpModal] = useState(false);
  const [showPelangganModal, setShowPelangganModal] = useState(false);

  const [form, setForm] = useState<any>(emptyForm);
  const [modalForm, setModalForm] = useState<any>(emptyForm);

  const [showLineModal, setShowLineModal] = useState(false);
  const [editLineIndex, setEditLineIndex] = useState<number | null>(null);
  const [lineForm, setLineForm] = useState<any>({
    item_id: '', kode: '', nama: '', satuan: '', kuantum: 1, harga_satuan: 0, disc_persen: 0, disc_harga: 0, keterangan: ''
  });

  const [pelanggans, setPelanggans] = useState<any[]>([]);
  const [proyeks, setProyeks] = useState<any[]>([]);
  const [mataUangs, setMataUangs] = useState<any[]>([]);
  const [pembayarans, setPembayarans] = useState<any[]>([]);
  const [salesmans, setSalesmans] = useState<any[]>([]);
  const [gudangs, setGudangs] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [salesOrders, setSalesOrders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchTtd = async () => {
    setLoadingData(true);
    try {
        const [pelRes, proRes, muRes, pemRes, salRes, gudRes, itmRes] = await Promise.all([
          setupApi.getPelanggan().catch(() => []),
          setupApi.getProyek().catch(() => []),
          setupApi.getMataUang().catch(() => []),
          setupApi.getPembayaran().catch(() => []),
          setupApi.getSalesman().catch(() => []),
          setupApi.getGudang().catch(() => []),
          setupApi.getItem().catch(() => [])
        ]);

        setPelanggans(pelRes);
        setProyeks(proRes);
        setMataUangs(muRes);
        setPembayarans(pemRes);
        setSalesmans(salRes);
        setGudangs(gudRes);
        setItems(itmRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingData(false);
      }
  };

  useEffect(() => {
    fetchTtd();
    import('../../sales-order/api').then(module => {
        module.salesOrderApi.getAll().then(res => setSalesOrders(res)).catch(() => {});
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(locationSearch);
    const sj = params.get('sj');
    const so = params.get('so');
    const pelanggan = params.get('pelanggan');

    if (sj || so) {
      setViewMode('form');
    }

    if (sj || so) {
      setForm((prev: any) => ({
        ...prev,
        no_invoice: prev.no_invoice || `INV/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000)}`,
        no_so: so || prev.no_so,
        pembeli_id: pelanggan ? Number(pelanggan) : prev.pembeli_id
      }));
    }
  }, [locationSearch]);

  const { signatureData } = useSignatureAutoFill('Invoice');

  useEffect(() => {
    if (signatureData) {
      setForm((prev: any) => ({
        ...prev,
        penandatangan: signatureData.nama || prev.penandatangan,
        jabatan: signatureData.jabatan || prev.jabatan
      }));
    }
  }, [signatureData]);

  const handlePembeliChange = (id: number | '', isModal: boolean = false) => {
    const p = pelanggans.find(x => x.id === id);
    const discPersen = p?.diskon || 0;
    if (isModal) {
      setModalForm({
        ...modalForm,
        pembeli_id: id,
        alamat: p?.alamat_wp || p?.alamat || '',
        npwp: p?.npwp || ''
      });
    } else {
      const newLines = (form.lines || []).map((line: any) => ({ ...line, disc_persen: discPersen }));
      setForm({
        ...form,
        pembeli_id: id,
        alamat: p?.alamat_wp || p?.alamat || '',
        npwp: p?.npwp || '',
        lines: newLines
      });
    }
  };

  const handleOpenAddLine = () => {
    setEditLineIndex(null);
    const p = pelanggans.find(x => x.id === form.pembeli_id);
    const discPersen = p?.diskon || 0;
    setLineForm({ item_id: '', kode: '', nama: '', satuan: '', kuantum: 1, harga_satuan: 0, disc_persen: discPersen, disc_harga: 0, keterangan: '' });
    setShowLineModal(true);
  };

  const handleOpenEditLine = (idx: number) => {
    setEditLineIndex(idx);
    setLineForm({ ...form.lines[idx] });
    setShowLineModal(true);
  };

  const handleSaveLine = () => {
    const newLines = [...(form.lines || [])];
    if (editLineIndex !== null) {
      newLines[editLineIndex] = lineForm;
    } else {
      newLines.push(lineForm);
    }
    setForm({ ...form, lines: newLines });
    setShowLineModal(false);
  };

  const removeLine = (idx: number) => {
    const newLines = form.lines.filter((_: any, i: number) => i !== idx);
    setForm({ ...form, lines: newLines });
  };

  const handleCreateInvoiceHeader = () => {
    if (!modalForm.no_invoice) {
      toast.error('No. Invoice harus diisi!');
      return;
    }
    if (!modalForm.pembeli_id) {
      toast.error('Nama Pembeli harus dipilih!');
      return;
    }
    
    setForm({
      ...modalForm,
      lines: [{ item_id: '', kode: '', nama: '', satuan: '', kuantum: 1, harga_satuan: 0, disc_persen: 0, disc_harga: 0, harga_jual: 0 }],
      create_date: new Date().toISOString(),
      create_uid_name: user?.name || 'Unknown'
    });
    
    setShowNewInvoiceModal(false);
    toast.success('Header Invoice berhasil dibuat. Silakan lengkapi detail barang.');
  };

  const handleSaveAll = () => {
    if (!form.no_invoice) {
      toast.error('Harap isi header Invoice terlebih dahulu!');
      return;
    }
    
    const updatedForm = {
      ...form,
      write_date: new Date().toISOString(),
      write_uid_name: user?.name || 'Unknown'
    };
    setForm(updatedForm);
    
    let newDataList;
    if (updatedForm.id) {
      newDataList = dataList.map(item => item.id === updatedForm.id ? updatedForm : item);
    } else {
      updatedForm.id = Date.now();
      newDataList = [updatedForm, ...dataList];
    }
    setDataList(newDataList);
    localStorage.setItem('edi_invoices', JSON.stringify(newDataList));
    
    toast.success('Invoice berhasil disimpan');
  };

  const handleDeleteInvoice = async (id: number) => {
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus Invoice ini?');
    if (!isConfirmed) return;
    
    const newDataList = dataList.filter(item => item.id !== id);
    setDataList(newDataList);
    localStorage.setItem('edi_invoices', JSON.stringify(newDataList));
    toast.success('Data berhasil dihapus');
  };

  return {
    form, setForm,
    modalForm, setModalForm,
    activeTab, setActiveTab,
    viewMode, setViewMode,
    dataList, setDataList,
    showNewInvoiceModal, setShowNewInvoiceModal,
    showFpModal, setShowFpModal,
    showPelangganModal, setShowPelangganModal,
    showLineModal, setShowLineModal,
    editLineIndex, lineForm, setLineForm,
    pelanggans, proyeks, mataUangs, pembayarans, salesmans, gudangs, items, salesOrders,
    loadingData, fetchTtd,
    handlePembeliChange, handleOpenAddLine, handleOpenEditLine, handleSaveLine, removeLine,
    handleCreateInvoiceHeader, handleSaveAll, handleDeleteInvoice,
    signatureData, user, confirm
  };
};
