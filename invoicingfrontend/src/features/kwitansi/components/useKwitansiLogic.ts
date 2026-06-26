import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setupApi, PelangganData } from '../../setup/api';
import { useSignatureAutoFill } from '../../../hooks/useSignatureAutoFill';
import { useConfirm } from '../../../contexts/ConfirmContext';

const angkaMenjadiTerbilang = (angka: number): string => {
  const huruf = [
    '', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'
  ];
  if (angka < 12) return huruf[angka];
  if (angka < 20) return angkaMenjadiTerbilang(angka - 10) + ' Belas';
  if (angka < 100) return angkaMenjadiTerbilang(Math.floor(angka / 10)) + ' Puluh ' + angkaMenjadiTerbilang(angka % 10);
  if (angka < 200) return 'Seratus ' + angkaMenjadiTerbilang(angka - 100);
  if (angka < 1000) return angkaMenjadiTerbilang(Math.floor(angka / 100)) + ' Ratus ' + angkaMenjadiTerbilang(angka % 100);
  if (angka < 2000) return 'Seribu ' + angkaMenjadiTerbilang(angka - 1000);
  if (angka < 1000000) return angkaMenjadiTerbilang(Math.floor(angka / 1000)) + ' Ribu ' + angkaMenjadiTerbilang(angka % 1000);
  if (angka < 1000000000) return angkaMenjadiTerbilang(Math.floor(angka / 1000000)) + ' Juta ' + angkaMenjadiTerbilang(angka % 1000000);
  if (angka < 1000000000000) return angkaMenjadiTerbilang(Math.floor(angka / 1000000000)) + ' Miliar ' + angkaMenjadiTerbilang(angka % 1000000000);
  if (angka < 1000000000000000) return angkaMenjadiTerbilang(Math.floor(angka / 1000000000000)) + ' Triliun ' + angkaMenjadiTerbilang(angka % 1000000000000);
  return '';
};

export const formatTerbilang = (angka: number) => {
  if (!angka) return '';
  let result = angkaMenjadiTerbilang(Math.abs(angka)).trim() + ' Rupiah';
  return result.replace(/\s+/g, ' ');
};

export const useKwitansiLogic = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const confirm = useConfirm();
  const { signatureData } = useSignatureAutoFill('Kwitansi');

  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [dataList, setDataList] = useState<any[]>(() => {
    const saved = localStorage.getItem('edi_kwitansis');
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState({
    periode: '2026-06',
    pelanggan_id: '',
    jenis: '',
    mata_uang: '',
    dari_no: '',
    sampai_no: '',
    dari_tgl: '',
    sampai_tgl: ''
  });

  const emptyForm = {
    no_kwitansi: '',
    tgl_kwitansi: new Date().toISOString().split('T')[0],
    no_invoice: '',
    pembeli_id: '',
    alamat: '',
    jenis: 'VAT',
    mata_uang: 'IDR',
    jumlah: 0,
    terbilang: '',
    untuk_pembayaran: '',
    keterangan_footer: 'BCA A/C 1234567890\nA/N PT. EDI Accounting',
    penandatangan: 'Admin',
    jabatan: 'Finance'
  };

  const [form, setForm] = useState<any>(emptyForm);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const pelRes = await setupApi.getPelanggan();
        setPelanggans(pelRes);
      } catch (err) {
        console.error("Failed to fetch pelanggan:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();

    if (location.state && location.state.no_invoice) {
      const { no_invoice, pembeli_id, alamat, jumlah, keterangan } = location.state;
      setForm((prev: any) => ({
        ...prev,
        no_kwitansi: `KT/00${Math.floor(Math.random()*100)}/06/2026`,
        no_invoice: no_invoice || '',
        pembeli_id: pembeli_id || '',
        alamat: alamat || '',
        jumlah: jumlah || 0,
        terbilang: formatTerbilang(jumlah || 0),
        untuk_pembayaran: keterangan || `Pembayaran Invoice No. ${no_invoice}`
      }));
      setViewMode('form');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (signatureData && viewMode === 'form' && !form.no_kwitansi) {
      setForm((prev: any) => ({
        ...prev,
        penandatangan: signatureData.nama || prev.penandatangan,
        jabatan: signatureData.jabatan || prev.jabatan
      }));
    }
  }, [signatureData, viewMode]);

  const handleJumlahChange = (val: string) => {
    const num = Number(val);
    setForm({
      ...form,
      jumlah: num,
      terbilang: formatTerbilang(num)
    });
  };

  const handlePembeliChange = (id: number | '') => {
    const p = pelanggans.find(x => x.id === id);
    setForm({
      ...form,
      pembeli_id: id,
      alamat: p?.alamat_wp || p?.alamat || ''
    });
  };

  const handleSave = () => {
    if (!form.no_kwitansi) {
      toast.error('No. Kwitansi harus diisi!');
      return;
    }
    if (!form.pembeli_id) {
      toast.error('Pelanggan harus dipilih!');
      return;
    }

    const existingIndex = dataList.findIndex(k => k.no_kwitansi === form.no_kwitansi);
    let newList = [...dataList];
    if (existingIndex >= 0) {
      newList[existingIndex] = form;
    } else {
      newList.push(form);
    }
    
    setDataList(newList);
    localStorage.setItem('edi_kwitansis', JSON.stringify(newList));
    toast.success('Kwitansi berhasil disimpan!');
    setViewMode('list');
  };

  const handleDelete = async (no_kwitansi: string) => {
    if (await confirm('Hapus Kwitansi ini?')) {
      const newList = dataList.filter(k => k.no_kwitansi !== no_kwitansi);
      setDataList(newList);
      localStorage.setItem('edi_kwitansis', JSON.stringify(newList));
      toast.success('Kwitansi dihapus');
      if (form.no_kwitansi === no_kwitansi) {
        setViewMode('list');
      }
    }
  };

  const filteredData = useMemo(() => {
    return dataList.filter(k => {
      if (filter.periode && !k.tgl_kwitansi?.startsWith(filter.periode)) return false;
      if (filter.pelanggan_id && String(k.pembeli_id) !== String(filter.pelanggan_id)) return false;
      if (filter.jenis && k.jenis !== filter.jenis) return false;
      if (filter.mata_uang && k.mata_uang !== filter.mata_uang) return false;
      if (filter.dari_no && k.no_kwitansi < filter.dari_no) return false;
      if (filter.sampai_no && k.no_kwitansi > filter.sampai_no) return false;
      if (filter.dari_tgl && k.tgl_kwitansi < filter.dari_tgl) return false;
      if (filter.sampai_tgl && k.tgl_kwitansi > filter.sampai_tgl) return false;
      return true;
    });
  }, [dataList, filter]);

  const handleResetFilter = () => {
    setFilter({
      periode: '2026-06',
      pelanggan_id: '',
      jenis: '',
      mata_uang: '',
      dari_no: '',
      sampai_no: '',
      dari_tgl: '',
      sampai_tgl: ''
    });
  };

  return {
    navigate, confirm,
    pelanggans, loadingData,
    viewMode, setViewMode,
    dataList, filteredData,
    filter, setFilter, handleResetFilter,
    emptyForm, form, setForm,
    showNewModal, setShowNewModal,
    signatureData,
    handleJumlahChange, handlePembeliChange, handleSave, handleDelete
  };
};
