import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { setupApi } from '../../setup/api';

export const emptyForm = {
  no_bukti: '',
  tanggal: new Date().toISOString().split('T')[0],
  pelanggan_id: '',
  alamat: '',
  metode_pembayaran: 'Transfer',
  no_cek_giro: '',
  tanggal_cair: '',
  perkiraan_kas_bank: '',
  mata_uang: 'IDR',
  jumlah_penerimaan: 0,
  kurs_pembayaran: 1,
  keterangan: '',
  lines: [],
  create_date: '',
  create_uid_name: '',
  write_date: '',
  write_uid_name: ''
};

export const usePembayaranLogic = () => {
  const { user } = useAuth();
  const confirm = useConfirm();

  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [dataList, setDataList] = useState<any[]>(() => {
    const saved = localStorage.getItem('edi_pembayaran');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [form, setForm] = useState<any>(emptyForm);

  const [showLineModal, setShowLineModal] = useState(false);
  const [editLineIndex, setEditLineIndex] = useState<number | null>(null);
  const [lineForm, setLineForm] = useState<any>({
    no_invoice: '', no_faktur_pajak: '', tgl_jt: '', ccy: 'IDR', saldo_piutang: 0, pembayaran: 0, potongan: 0, keterangan: ''
  });

  const [pelanggans, setPelanggans] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = async () => {
    setLoadingData(true);
    try {
        const pelRes = await setupApi.getPelanggan().catch(() => []);
        setPelanggans(pelRes);
        
        const savedInvoices = localStorage.getItem('edi_invoices');
        setInvoices(savedInvoices ? JSON.parse(savedInvoices) : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingData(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePembeliChange = (id: number | '') => {
    const p = pelanggans.find(x => x.id === id);
    setForm({
      ...form,
      pelanggan_id: id,
      alamat: p?.alamat_wp || p?.alamat || '',
      lines: [] // Reset lines when customer changes
    });
  };

  const handleOpenAddLine = () => {
    if (!form.pelanggan_id) {
      toast.error('Pilih Nama Pembeli terlebih dahulu!');
      return;
    }
    setEditLineIndex(null);
    setLineForm({ no_invoice: '', no_faktur_pajak: '', tgl_jt: '', ccy: 'IDR', saldo_piutang: 0, pembayaran: 0, potongan: 0, keterangan: '' });
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

  const handleSaveAll = () => {
    if (!form.no_bukti) {
      toast.error('Harap isi No. Bukti terlebih dahulu!');
      return;
    }
    if (!form.pelanggan_id) {
      toast.error('Nama Pembeli harus dipilih!');
      return;
    }
    if (!form.perkiraan_kas_bank) {
      toast.error('Perkiraan Kas/Bank harus dipilih!');
      return;
    }
    
    const totalPembayaran = (form.lines || []).reduce((acc: number, line: any) => acc + (Number(line.pembayaran) || 0), 0);
    const totalJumlahPenerimaan = Number(form.jumlah_penerimaan) || 0;
    
    // Auto sync penerimaan if 0, otherwise check if they match (optional, but good practice)
    const updatedForm = {
      ...form,
      jumlah_penerimaan: totalJumlahPenerimaan === 0 ? totalPembayaran : totalJumlahPenerimaan,
      write_date: new Date().toISOString(),
      write_uid_name: user?.name || 'Unknown'
    };

    if (!updatedForm.id) {
      updatedForm.id = Date.now();
      updatedForm.create_date = new Date().toISOString();
      updatedForm.create_uid_name = user?.name || 'Unknown';
    }

    setForm(updatedForm);
    
    let newDataList;
    if (updatedForm.id && dataList.some(d => d.id === updatedForm.id)) {
      newDataList = dataList.map(item => item.id === updatedForm.id ? updatedForm : item);
    } else {
      newDataList = [updatedForm, ...dataList];
    }
    setDataList(newDataList);
    localStorage.setItem('edi_pembayaran', JSON.stringify(newDataList));
    
    toast.success('Bukti Pembayaran berhasil disimpan');
    setViewMode('list');
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus Bukti Pembayaran ini?');
    if (!isConfirmed) return;
    
    const newDataList = dataList.filter(item => item.id !== id);
    setDataList(newDataList);
    localStorage.setItem('edi_pembayaran', JSON.stringify(newDataList));
    toast.success('Data berhasil dihapus');
  };

  const availableInvoices = invoices.filter(inv => inv.pembeli_id === form.pelanggan_id && !inv.is_paid);

  return {
    form, setForm,
    viewMode, setViewMode,
    dataList, setDataList,
    showLineModal, setShowLineModal,
    editLineIndex, lineForm, setLineForm,
    pelanggans, invoices, availableInvoices,
    loadingData,
    handlePembeliChange, handleOpenAddLine, handleOpenEditLine, handleSaveLine, removeLine,
    handleSaveAll, handleDelete,
    user, confirm
  };
};
