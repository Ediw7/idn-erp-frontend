import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { setupApi } from '../../setup/api';
import { useSignatureAutoFill } from '../../../hooks/useSignatureAutoFill';
import { getInvoices, saveInvoice, deleteInvoice, getInvoiceAutoNo, getSuratJalan } from '../../transactionsApi';

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
  potongan_harga: 0,
  ppn_persen: 0,
  pph_persen: 0,
  ongkos_angkut: 0,
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
  const [dataList, setDataList] = useState<any[]>([]);
  
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
  const [suratJalans, setSuratJalans] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchTtd = async () => {
    setLoadingData(true);
    try {
        const [pelRes, proRes, muRes, pemRes, salRes, gudRes, itmRes, invRes, sjRes] = await Promise.all([
          setupApi.getPelanggan().catch(() => []),
          setupApi.getProyek().catch(() => []),
          setupApi.getMataUang().catch(() => []),
          setupApi.getPembayaran().catch(() => []),
          setupApi.getSalesman().catch(() => []),
          setupApi.getGudang().catch(() => []),
          setupApi.getItem().catch(() => []),
          getInvoices().catch(() => []),
          getSuratJalan().catch(() => [])
        ]);

        setPelanggans(pelRes);
        setProyeks(proRes);
        setMataUangs(muRes);
        setPembayarans(pemRes);
        setSalesmans(salRes);
        setGudangs(gudRes);
        setItems(itmRes);
        setDataList(invRes);
        setSuratJalans(sjRes);
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
      const fetchAutoNo = async () => {
        const autoNo = await getInvoiceAutoNo();
        setForm((prev: any) => ({
          ...prev,
          no_invoice: prev.no_invoice || autoNo,
          no_so: so || prev.no_so,
          pembeli_id: pelanggan ? Number(pelanggan) : prev.pembeli_id
        }));
      };
      fetchAutoNo();
    }
  }, [locationSearch]);

  useEffect(() => {
    // Auto-fill alamat & npwp if pembeli_id is set (e.g. from URL params) but alamat is empty
    // and the pelanggans data has finally loaded from API.
    if (form.pembeli_id && !form.alamat && pelanggans.length > 0) {
      const p = pelanggans.find(x => x.id === form.pembeli_id);
      if (p) {
        setForm((prev: any) => ({
          ...prev,
          alamat: p.alamat_wp || p.alamat || '',
          npwp: p.npwp || ''
        }));
      }
    }
  }, [form.pembeli_id, form.alamat, pelanggans]);

  useEffect(() => {
    const params = new URLSearchParams(locationSearch);
    const so = params.get('so');
    const sj = params.get('sj');

    // Auto-fill lines correctly: Quantities from Surat Jalan, Prices from Sales Order
    if (sj && suratJalans.length > 0 && salesOrders.length > 0 && (!form.lines || form.lines.length === 0)) {
      const targetSJ = suratJalans.find(x => x.no_sj === sj);
      if (targetSJ) {
        // Cari SO terkait dari SJ ini
        const activeSoNo = so || targetSJ.no_so;
        const targetSO = salesOrders.find(x => x.no_so === activeSoNo);
        
        const mergedLines = targetSJ.lines.map((sjLine: any) => {
          // Cari harga dari targetSO
          let soLine = null;
          if (targetSO && targetSO.lines) {
            soLine = targetSO.lines.find((l: any) => l.item_id === sjLine.item_id);
          }
          const harga_satuan = soLine ? soLine.harga_satuan : 0;
          const disc_persen = soLine ? soLine.disc_persen : 0;
          const disc_harga = soLine ? soLine.disc_harga : 0;
          
          const basePrice = sjLine.kuantum * harga_satuan;
          const discount = (basePrice * (disc_persen / 100)) + disc_harga;
          
          return {
            ...sjLine,
            harga_satuan,
            disc_persen,
            disc_harga,
            harga_jual: basePrice - discount
          };
        });

        setForm((prev: any) => ({
          ...prev,
          lines: mergedLines,
          surat_jalans: [{ no_sj: targetSJ.no_sj, tanggal: targetSJ.tanggal, keterangan: targetSJ.keterangan || `Auto-generated from ${targetSJ.no_sj}` }],
          potongan_harga: targetSO ? (targetSO.potongan_harga || 0) : 0,
          ppn_persen: targetSO ? (targetSO.ppn_persen || 0) : 0,
          ppnbm_persen: targetSO ? (targetSO.ppnbm_persen || 0) : 0,
          ongkos_angkut: targetSO ? (targetSO.ongkos_angkut || 0) : 0,
          mata_uang: targetSO?.mata_uang_id ? String(targetSO.mata_uang_id) : prev.mata_uang,
          salesman_id: targetSO?.salesman_id ? String(targetSO.salesman_id) : prev.salesman_id,
          cara_pembayaran: targetSO?.pembayaran_id ? String(targetSO.pembayaran_id) : prev.cara_pembayaran,
          proyek: targetSO?.proyek ? String(targetSO.proyek) : prev.proyek,
          no_po: targetSO?.no_po || prev.no_po,
          tgl_po: targetSO?.tgl_po || prev.tgl_po,
          gudang_id: targetSJ.gudang_id || prev.gudang_id
        }));
      }
    } else if (so && (!sj) && salesOrders.length > 0 && (!form.lines || form.lines.length === 0)) {
      // Fallback: If only SO is provided without SJ, pull everything from SO
      const targetSO = salesOrders.find(x => x.no_so === so);
      if (targetSO) {
        setForm((prev: any) => ({
          ...prev,
          lines: targetSO.lines.map((l: any) => ({
             ...l,
             harga_satuan: l.harga_satuan || 0,
             disc_persen: l.disc_persen || 0,
             disc_harga: l.disc_harga || 0,
             harga_jual: l.harga_jual || (l.kuantum * (l.harga_satuan || 0)) - (l.disc_harga || 0)
          })),
          potongan_harga: targetSO.potongan_harga || 0,
          ppn_persen: targetSO.ppn_persen || 0,
          ppnbm_persen: targetSO.ppnbm_persen || 0,
          ongkos_angkut: targetSO.ongkos_angkut || 0,
          mata_uang: targetSO.mata_uang_id ? String(targetSO.mata_uang_id) : prev.mata_uang,
          salesman_id: targetSO.salesman_id ? String(targetSO.salesman_id) : prev.salesman_id,
          cara_pembayaran: targetSO.pembayaran_id ? String(targetSO.pembayaran_id) : prev.cara_pembayaran,
          proyek: targetSO.proyek ? String(targetSO.proyek) : prev.proyek,
          no_po: targetSO.no_po || prev.no_po,
          tgl_po: targetSO.tgl_po || prev.tgl_po
        }));
      }
    }
  }, [salesOrders, suratJalans, locationSearch, form.lines, form.surat_jalans]);

  // Watch for manual SO selection changes in UI
  useEffect(() => {
    if (form.no_so && salesOrders.length > 0) {
      const targetSO = salesOrders.find(x => x.no_so === form.no_so);
      if (targetSO) {
        setForm((prev: any) => ({
          ...prev,
          mata_uang: prev.mata_uang || (targetSO.mata_uang_id ? String(targetSO.mata_uang_id) : 'IDR'),
          salesman_id: prev.salesman_id || (targetSO.salesman_id ? String(targetSO.salesman_id) : ''),
          cara_pembayaran: prev.cara_pembayaran || (targetSO.pembayaran_id ? String(targetSO.pembayaran_id) : ''),
          proyek: prev.proyek || (targetSO.proyek ? String(targetSO.proyek) : ''),
          no_po: prev.no_po || targetSO.no_po || '',
          tgl_po: prev.tgl_po || targetSO.tgl_po || ''
        }));
      }
    }
  }, [form.no_so, salesOrders]);

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
      lines: [],
      create_date: new Date().toISOString(),
      create_uid_name: user?.name || 'Unknown'
    });
    
    setShowNewInvoiceModal(false);
    toast.success('Header Invoice berhasil dibuat. Silakan lengkapi detail barang.');
  };

  const handleSaveAll = async () => {
    if (!form.no_invoice) {
      toast.error('Harap isi header Invoice terlebih dahulu!');
      return;
    }
    
    try {
      let soId = null;
      if (form.no_so) {
          const so = salesOrders.find(s => s.no_so === form.no_so);
          if (so) soId = so.id;
      }
      
      const payload = {
        ...form,
        pelanggan_id: form.pembeli_id ? Number(form.pembeli_id) : null,
        sales_order_id: soId,
        lines: (form.lines || []).map((l: any) => ({
          item_id: Number(l.item_id),
          kuantum: Number(l.kuantum),
          harga_satuan: Number(l.harga_satuan),
          disc_persen: Number(l.disc_persen),
          disc_harga: Number(l.disc_harga)
        }))
      };
      
      await saveInvoice(payload);
      const latestData = await getInvoices();
      setDataList(latestData || []);
      
      toast.success('Invoice berhasil disimpan');
      setViewMode('list');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan Invoice');
    }
  };

  const handleDeleteInvoice = async (id: number) => {
    if (await confirm('Yakin ingin menghapus Invoice ini?')) {
      try {
        await deleteInvoice(id);
        const latestData = await getInvoices();
        setDataList(latestData || []);
        toast.success('Invoice berhasil dihapus');
      } catch (e: any) {
        toast.error(e?.response?.data?.message || 'Gagal menghapus Invoice');
      }
    }
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
    signatureData, user, confirm, suratJalans
  };
};
