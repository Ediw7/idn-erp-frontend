import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { setupApi } from '../../setup/api';
import { getPembayaran, savePembayaran, getOutstanding, deletePembayaran } from '../../transactionsApi';

export const emptyModalForm = {
  no_bukti: '',
  tanggal: new Date().toISOString().split('T')[0],
  pelanggan_id: ''
};

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
  const [dataList, setDataList] = useState<any[]>([]);
  
  const [form, setForm] = useState<any>(emptyForm);

  const [showNewModal, setShowNewModal] = useState(false);
  const [modalForm, setModalForm] = useState<any>(emptyModalForm);
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
        const [pelRes, outRes, pemRes] = await Promise.all([
          setupApi.getPelanggan().catch(() => []),
          getOutstanding().catch(() => []),
          getPembayaran().catch(() => [])
        ]);
        setPelanggans(pelRes);
        setInvoices(outRes);
        setDataList(pemRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingData(false);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePembeliChange = (id: number | '', isModal?: boolean) => {
    const p = pelanggans.find(x => x.id === id);
    if (isModal) {
      setModalForm({
        ...modalForm,
        pelanggan_id: id,
        alamat: p?.alamat_wp || p?.alamat || ''
      });
    } else {
      setForm({
        ...form,
        pelanggan_id: id,
        alamat: p?.alamat_wp || p?.alamat || '',
        alamat: p?.alamat_wp || p?.alamat || '',
        lines: []
      });
    }
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

  const handleCreateHeader = () => {
    if (!modalForm.no_bukti) {
      toast.error('Harap isi No. Bukti terlebih dahulu!');
      return;
    }
    if (!modalForm.pelanggan_id) {
      toast.error('Nama Pembeli harus dipilih!');
      return;
    }
    setForm({
      ...emptyForm,
      ...modalForm
    });
    setShowNewModal(false);
    setViewMode('form');
  };

  const handleSaveAll = async () => {
    if (!form.no_bukti) {
      toast.error('Harap isi No. Bukti terlebih dahulu!');
      return;
    }
    if (!form.pelanggan_id) {
      toast.error('Nama Pembeli harus dipilih!');
      return;
    }

    try {
      const payload = {
        ...form,
        tgl_pembayaran: form.tanggal,
        pelanggan_id: Number(form.pelanggan_id),
        perkiraan_kas_id: form.perkiraan_kas_bank ? Number(form.perkiraan_kas_bank) : null,
        lines: (form.lines || []).map((l: any) => {
          const inv = invoices.find(i => i.no_invoice === l.no_invoice);
          return {
    showNewModal, setShowNewModal,
    modalForm, setModalForm, handleCreateHeader,
            invoice_id: inv ? inv.id : null,
            pembayaran: Number(l.pembayaran),
            potongan: Number(l.potongan),
            keterangan: l.keterangan || ''
          };
        })
      };
      
      await savePembayaran(payload);
      
      // Refresh list
      const pemRes = await getPembayaran();
      setDataList(pemRes || []);
      
      toast.success('Bukti Pembayaran berhasil disimpan');
      setViewMode('list');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan Pembayaran');
    }
  };

  const handleDelete = async (id: number) => {
    if (await confirm('Yakin ingin menghapus data Pembayaran ini?')) {
      try {
        await deletePembayaran(id);
        const pemRes = await getPembayaran();
        setDataList(pemRes || []);
        toast.success('Pembayaran berhasil dihapus');
      } catch (e: any) {
        toast.error(e?.response?.data?.message || 'Gagal menghapus Pembayaran');
      }
    }
  };

  const availableInvoices = invoices.filter(inv => inv.pembeli_id === form.pelanggan_id && inv.saldo > 0);

  return {
    showNewModal, setShowNewModal,
    modalForm, setModalForm, handleCreateHeader,
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
