import React, { useState, useEffect } from 'react';
import { FilePlus, Trash2, X, Printer, Search, Save, RefreshCcw, Plus, Edit2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext';
import { setupApi } from '../../setup/api';
import { useSignatureAutoFill } from '../../../hooks/useSignatureAutoFill';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { SetupPelangganModal } from '../../setup/components/SetupPelangganModal';

const Invoice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const confirm = useConfirm();

  const [activeTab, setActiveTab] = useState('detail');
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [dataList, setDataList] = useState<any[]>(() => {
    const saved = localStorage.getItem('edi_invoices');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showFpModal, setShowFpModal] = useState(false);

  const emptyForm = {
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

  const [form, setForm] = useState<any>(emptyForm);
  const [modalForm, setModalForm] = useState<any>(emptyForm);

  const [pelanggans, setPelanggans] = useState<any[]>([]);
  const [proyeks, setProyeks] = useState<any[]>([]);
  const [mataUangs, setMataUangs] = useState<any[]>([]);
  const [pembayarans, setPembayarans] = useState<any[]>([]);
  const [salesmans, setSalesmans] = useState<any[]>([]);
  const [gudangs, setGudangs] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [salesOrders, setSalesOrders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showPelangganModal, setShowPelangganModal] = useState(false);

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
    
    // Attempt to fetch Sales Orders dynamically if the API is available
    import('../../sales-order/api').then(module => {
        module.salesOrderApi.getAll().then(res => setSalesOrders(res)).catch(() => {});
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
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
        pembeli_id: pelanggan || prev.pembeli_id
      }));
    }
  }, [location.search]);

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

  const handleItemChange = (idx: number, id: number | '') => {
    const item = items.find(x => x.id === id);
    const newLines = [...form.lines];
    if (item) {
      const p = pelanggans.find(x => x.id === form.pembeli_id);
      const discPersen = p?.diskon || 0;
      newLines[idx] = {
        ...newLines[idx],
        item_id: item.id,
        kode: item.kode,
        nama: item.nama,
        satuan: item.satuan,
        harga: item.harga_jual_1 || 0,
        harga_jual: item.harga_jual_1 || 0,
        kuantum: newLines[idx].kuantum || 1,
        disc_persen: discPersen,
        disc_harga: newLines[idx].disc_harga || 0
      };
    } else {
      newLines[idx] = {
        ...newLines[idx],
        item_id: '',
        kode: '',
        nama: '',
        satuan: '',
        harga: 0,
        harga_jual: 0
      };
    }
    setForm({ ...form, lines: newLines });
  };
  const handleAddLine = () => {
    setForm({
      ...form,
      lines: [...(form.lines || []), { item_id: '', kode: '', nama: '', satuan: '', kuantum: 1, harga_satuan: 0, disc_persen: 0, disc_harga: 0, keterangan: '' }]
    });
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
      lines: [{ item_id: '', kode: '', nama: '', satuan: '', kuantum: 1, harga: 0, disc_persen: 0, disc_harga: 0, harga_jual: 0 }],
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

  const handleCreateKwitansi = async () => {
    if (!form.no_invoice) {
      toast.error('Pilih atau buat Invoice terlebih dahulu!');
      return;
    }
    
    const isConfirmed = await confirm({
      title: 'Buat Kwitansi',
      message: `Apakah Anda ingin membuat Kwitansi untuk Invoice ${form.no_invoice}?`,
      confirmText: 'Ya, Lanjutkan',
      isDestructive: false
    });

    if (isConfirmed) {
      navigate('/kwitansi', { 
        state: { 
          no_invoice: form.no_invoice,
          pembeli_id: form.pembeli_id,
          alamat: form.alamat,
          // Placeholder for total since it's uncalculated locally, ideally passed from a real calculated total
          jumlah: 418000, 
          keterangan: `Pembayaran untuk Invoice No. ${form.no_invoice}`
        }
      });
    }
  };

  const handleUpdateFpClick = () => {
    if (!form.no_invoice) {
      toast.error('Pilih atau buat Invoice terlebih dahulu!');
      return;
    }
    setShowFpModal(true);
  };

  const handleRouteToFp = (action: 'PERBARUI' | 'pengganti') => {
    setShowFpModal(false);
    navigate('/faktur-pajak', {
      state: {
        action,
        no_invoice: form.no_invoice,
        pembeli_id: form.pembeli_id,
        alamat: form.alamat,
        npwp: form.npwp,
        lines: form.lines,
        jumlah: 418000 // Placeholder
      }
    });
  };

  const inputClass = "w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white disabled:bg-slate-100 disabled:text-slate-500";
  const labelClass = "text-sm font-semibold text-slate-700 w-28 shrink-0 pt-1";
  const btnClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors shadow-sm flex items-center justify-center gap-2";

  return (
    <>
      {viewMode === 'list' && (
        <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
          <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-white">Invoice</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-slate-300 font-medium">Pilih Periode:</span>
                <select className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400">
                  <option>Juni 2026</option>
                  <option>Mei 2026</option>
                </select>
              </div>
            </div>
            <button onClick={() => {
              setForm(emptyForm);
              setModalForm(emptyForm);
              setViewMode('form');
            }} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
               <FilePlus size={14} /> + BUKA FORM
            </button>
          </div>

          <div className="flex-1 p-6 overflow-hidden flex flex-col">
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1">
              <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-slate-700">No. Invoice</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">Jenis</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">Tgl</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">Nama Pembeli</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">No PO</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">No SO</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">Ccy</th>
                    <th className="px-3 py-2 font-semibold text-slate-700 text-right">PPN</th>
                    <th className="px-3 py-2 font-semibold text-slate-700 text-right">PPh 22</th>
                    <th className="px-3 py-2 font-semibold text-slate-700 text-right">Nilai Invoice</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">No. Faktur Pajak</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">Cara Bayar</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">Tanggal JT</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">Salesman</th>
                    <th className="px-3 py-2 font-semibold text-slate-700">Proyek</th>
                    <th className="px-3 py-2 font-semibold text-slate-700 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataList.length === 0 ? (
                    <tr>
                      <td colSpan={16} className="px-4 py-8 text-center text-slate-500 italic">Belum ada data Invoice.</td>
                    </tr>
                  ) : (
                    dataList.map((item, idx) => {
                      const pembeliNama = pelanggans.find(p => String(p.id) === String(item.pembeli_id))?.nama || item.pembeli_id;
                      const salesman = salesmans.find(s => String(s.id) === String(item.salesman_id))?.nama || '';
                      const ccy = mataUangs.find(m => String(m.id) === String(item.mata_uang))?.kode || item.mata_uang || 'IDR';
                      const proyekNama = proyeks.find(p => String(p.id) === String(item.proyek))?.nama || item.proyek || '';

                      const subtotal = (item.lines || []).reduce((acc: number, line: any) => {
                        const base = (line.kuantum || 0) * (line.harga || 0);
                        const disc = (base * (line.disc_persen || 0) / 100) + (line.disc_harga || 0);
                        return acc + (base - disc);
                      }, 0);
                      const ppnAmount = subtotal * 0.11;
                      const pphAmount = 0;
                      const total = subtotal + ppnAmount;

                      return (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2 font-mono text-slate-800 font-medium">{item.no_invoice}</td>
                          <td className="px-3 py-2 text-slate-600">VAT</td>
                          <td className="px-3 py-2 text-slate-600">{item.tgl_invoice}</td>
                          <td className="px-3 py-2 text-slate-800 truncate max-w-[150px]" title={pembeliNama}>{pembeliNama}</td>
                          <td className="px-3 py-2 text-slate-600">{item.no_po || '-'}</td>
                          <td className="px-3 py-2 text-slate-600">{item.no_so || '-'}</td>
                          <td className="px-3 py-2 text-slate-600 font-medium">{ccy}</td>
                          <td className="px-3 py-2 font-mono text-slate-800 text-right">{ppnAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                          <td className="px-3 py-2 font-mono text-slate-800 text-right">{pphAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                          <td className="px-3 py-2 font-mono text-slate-800 text-right font-semibold">{total.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                          <td className="px-3 py-2 text-slate-600">{item.no_faktur_pajak || '-'}</td>
                          <td className="px-3 py-2 text-slate-600">{item.cara_pembayaran || '-'}</td>
                          <td className="px-3 py-2 text-slate-600">{item.tgl_jt || '-'}</td>
                          <td className="px-3 py-2 text-slate-600">{salesman || '-'}</td>
                          <td className="px-3 py-2 text-slate-600">{proyekNama || '-'}</td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => {
                                  setForm(item);
                                  setViewMode('form');
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => item.id && handleDeleteInvoice(item.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                                title="Hapus"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'form' && (
        <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex flex-wrap gap-3 justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white">Invoice</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-slate-300 font-medium">Pilih Periode:</span>
              <select className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400">
                <option>Juni 2026</option>
                <option>Mei 2026</option>
              </select>
              <span className="text-xs text-slate-300 font-medium ml-2">Jenis Invoice:</span>
              <select className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400">
                <option>Dengan PPN</option>
                <option>Tanpa PPN</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setViewMode('list')} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-colors rounded-sm shadow-sm whitespace-nowrap">
               KEMBALI KE LIST
            </button>
            <button onClick={() => { setModalForm({...emptyForm, no_invoice: `INV/00${Math.floor(Math.random()*100)}/06/2026`}); setShowNewInvoiceModal(true); }} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm whitespace-nowrap">
               <FilePlus size={12} /> + TAMBAH INVOICE
            </button>
            <button onClick={() => navigate(form.no_invoice ? `/laporan?invoice_number=${encodeURIComponent(form.no_invoice)}&reportName=${encodeURIComponent('Invoice (A4 / Kwarto)')}` : '/laporan?reportName=Invoice (A4 / Kwarto)')} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm whitespace-nowrap">
               <Printer size={12} /> CETAK
            </button>
            <button onClick={handleUpdateFpClick} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-blue-600 border border-transparent hover:bg-blue-500 transition-colors rounded-sm shadow-sm whitespace-nowrap">
               PERBARUI FP
            </button>
            <button onClick={handleCreateKwitansi} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-indigo-600 border border-transparent hover:bg-indigo-500 transition-colors rounded-sm shadow-sm whitespace-nowrap">
               PERBARUI KWITANSI
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-100 flex flex-col">
          <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0 flex-1">
            <div className="px-3 pt-2 bg-slate-100 border-b border-slate-300 flex gap-1">
              <button className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === 'umum' ? 'bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm' : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors'}`} onClick={() => setActiveTab('umum')}>Informasi Umum</button>
              <button className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === 'detail' ? 'bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm' : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors'}`} onClick={() => setActiveTab('detail')}>Detail Barang/Jasa</button>
              <button className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === 'surat_jalan' ? 'bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm' : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors'}`} onClick={() => setActiveTab('surat_jalan')}>Surat Jalan</button>
              <button className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === 'history' ? 'bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm' : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors'}`} onClick={() => setActiveTab('history')}>History Pembayaran</button>
            </div>
            
            <div className="overflow-x-auto min-h-[350px]">
              {activeTab === 'umum' && (
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-5">
                    {/* Kolom Kiri */}
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex items-start">
                        <label className={labelClass}>No. Invoice</label>
                        <div className="flex gap-1 flex-1">
                          <input type="text" className={`${inputClass} font-mono w-48 bg-slate-50`} readOnly value={form.no_invoice || ''} />
                          <button className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm"><Search size={14} /></button>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>Tgl Invoice</label>
                        <input type="date" className={`${inputClass} w-48`} value={form.tgl_invoice || ''} onChange={e => setForm({...form, tgl_invoice: e.target.value})} />
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>Nama Pembeli</label>
                        <div className="flex gap-2 w-full">
                          <select className={inputClass} value={form.pembeli_id || ''} onChange={e => handlePembeliChange(e.target.value ? Number(e.target.value) : '')}>
                            <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
                            {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                          </select>
                          <button className="px-3 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm font-bold text-slate-600 transition-colors disabled:opacity-50" onClick={() => setShowPelangganModal(true)}>+</button>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>Alamat</label>
                        <textarea className={`${inputClass} h-24 resize-none`} value={form.alamat || ''} onChange={e => setForm({...form, alamat: e.target.value})} />
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>NPWP</label>
                        <input type="text" className={`${inputClass} w-full`} value={form.npwp || ''} onChange={e => setForm({...form, npwp: e.target.value})} />
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>Proyek</label>
                        <select className={`${inputClass} w-full`} value={form.proyek || ''} onChange={e => setForm({...form, proyek: e.target.value})}>
                          <option value="">{loadingData ? 'Loading...' : '-- Pilih Proyek --'}</option>
                          {proyeks.map(p => <option key={p.id} value={p.kode}>{p.nama}</option>)}
                        </select>
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>Mata Uang</label>
                        <select className={`${inputClass} w-48`} value={form.mata_uang || 'IDR'} onChange={e => setForm({...form, mata_uang: e.target.value})}>
                          <option value="IDR">IDR</option>
                          {mataUangs.map(m => m.kode !== 'IDR' && <option key={m.id} value={m.kode}>{m.kode}</option>)}
                        </select>
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>Kurs Jual</label>
                        <input type="number" className={`${inputClass} w-48 text-right`} value={form.kurs_jual || ''} onChange={e => setForm({...form, kurs_jual: e.target.value})} />
                      </div>
                    </div>

                    {/* Kolom Tengah */}
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex items-start">
                        <label className={labelClass}>No. SO</label>
                        <div className="flex gap-1 flex-1">
                          <select className={inputClass} value={form.no_so || ''} onChange={e => setForm({...form, no_so: e.target.value})}>
                            <option value="">{loadingData ? 'Loading...' : '-- Pilih SO --'}</option>
                            {salesOrders.map((so, idx) => <option key={idx} value={so.no_so}>{so.no_so}</option>)}
                          </select>
                          <button className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm"><Search size={14} /></button>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>No. PO</label>
                        <input type="text" className={`${inputClass} w-full`} value={form.no_po || ''} onChange={e => setForm({...form, no_po: e.target.value})} />
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>Tgl PO</label>
                        <input type="date" className={`${inputClass} w-48`} value={form.tgl_po || ''} onChange={e => setForm({...form, tgl_po: e.target.value})} />
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>Tgl JT</label>
                        <input type="date" className={`${inputClass} w-48`} value={form.tgl_jt || ''} onChange={e => setForm({...form, tgl_jt: e.target.value})} />
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>Cara Pembayaran</label>
                        <select className={`${inputClass} w-full`} value={form.cara_pembayaran || ''} onChange={e => setForm({...form, cara_pembayaran: e.target.value})}>
                          <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
                          {pembayarans.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
                        </select>
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>Salesman</label>
                        <select className={`${inputClass} w-full`} value={form.salesman_id || ''} onChange={e => setForm({...form, salesman_id: e.target.value ? Number(e.target.value) : ''})}>
                          <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
                          {salesmans.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                        </select>
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>Gudang</label>
                        <select className={`${inputClass} w-full`} value={form.gudang_id || ''} onChange={e => setForm({...form, gudang_id: e.target.value ? Number(e.target.value) : ''})}>
                          <option value="">{loadingData ? 'Loading...' : '-- Pilih --'}</option>
                          {gudangs.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                        </select>
                      </div>
                      <div className="flex items-start mt-2 border-t border-slate-200 pt-3">
                        <label className={labelClass}>No. Faktur Pajak</label>
                        <div className="flex gap-1 flex-1">
                          <input type="text" className={`${inputClass} w-full`} value={form.no_faktur_pajak || ''} onChange={e => setForm({...form, no_faktur_pajak: e.target.value})} />
                          <button className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm"><RefreshCcw size={14} /></button>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <label className={labelClass}>No. Kwitansi</label>
                        <div className="flex gap-1 flex-1">
                          <input type="text" className={`${inputClass} w-full`} value={form.no_kwitansi || ''} onChange={e => setForm({...form, no_kwitansi: e.target.value})} />
                          <button className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm"><RefreshCcw size={14} /></button>
                        </div>
                      </div>
                    </div>

                    {/* Kolom Kanan - Audit */}
                    <div className="w-[250px] flex flex-col gap-4">
                      <div className="flex gap-4 items-center bg-slate-50 p-3 border border-slate-200 rounded-sm">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                          <input type="checkbox" checked={form.is_jasa || false} onChange={e => setForm({...form, is_jasa: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Jasa ?
                        </label>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                          <input type="checkbox" checked={form.is_paid || false} onChange={e => setForm({...form, is_paid: e.target.checked})} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Paid ?
                        </label>
                      </div>

                      <div className="flex flex-col gap-2 mt-2">
                        <label className="text-sm font-semibold text-slate-700">Catatan Internal</label>
                        <textarea className={`${inputClass} h-24 resize-none`} value={form.catatan || ''} onChange={e => setForm({...form, catatan: e.target.value})} />
                      </div>

                      <div className="border border-slate-300 p-3 relative mt-4 rounded-sm bg-white shadow-sm">
                        <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Created</span>
                        <div className="flex gap-2 mt-2">
                          <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.create_date ? new Date(form.create_date).toLocaleString('id-ID') : '-'} />
                          <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.create_uid_name || user?.name || 'Unknown'} />
                        </div>
                      </div>
                      <div className="border border-slate-300 p-3 relative mt-3 rounded-sm bg-white shadow-sm">
                        <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Modified</span>
                        <div className="flex gap-2 mt-2">
                          <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.write_date ? new Date(form.write_date).toLocaleString('id-ID') : '-'} />
                          <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.write_uid_name || user?.name || 'Unknown'} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'detail' && (
                <div className="flex flex-col h-full">
                  <div className="p-3 bg-white border-b border-slate-200 shrink-0">
                    <button onClick={handleAddLine} className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors rounded-sm shadow-sm">
                      <Plus size={14} /> TAMBAH BARANG
                    </button>
                  </div>
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300">
                      <tr>
                        <th className="px-3 py-2 border-r border-slate-300 font-semibold w-12 text-center">No.</th>
                        <th className="px-3 py-2 border-r border-slate-300 font-semibold w-64">Kode / Nama Barang</th>
                        <th className="px-3 py-2 border-r border-slate-300 font-semibold w-24 text-center">Satuan</th>
                        <th className="px-3 py-2 border-r border-slate-300 font-semibold w-24 text-right">Kuantum</th>
                        <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">Harga Satuan</th>
                        <th className="px-3 py-2 border-r border-slate-300 font-semibold w-20 text-center">% Disc</th>
                        <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">Disc Harga</th>
                        <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">Harga Jual</th>
                        <th className="px-3 py-2 w-16 text-center font-semibold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(form.lines || []).map((line: any, idx: number) => {
                        const base = (line.kuantum || 0) * (line.harga_satuan || 0);
                        const disc = (base * (line.disc_persen || 0) / 100) + (line.disc_harga || 0);
                        const hJual = base - disc;
                        const itemInfo = items.find(i => i.id === line.item_id);
                        return (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-3 py-2 text-center border-r border-slate-200 font-bold text-slate-500">{idx + 1}</td>
                            <td className="px-3 py-2 border-r border-slate-200">
                               <div className="flex flex-col gap-1">
                                 <select className={`${inputClass} font-mono h-8 py-1`} value={line.item_id || ''} onChange={e => handleItemChange(idx, e.target.value ? Number(e.target.value) : '')}>
                                   <option value="">- Pilih Item -</option>
                                   {items.map(i => <option key={i.id} value={i.id}>{i.kode}</option>)}
                                 </select>
                                 <input type="text" className={`${inputClass} text-xs bg-slate-50 h-7 py-1`} readOnly value={itemInfo?.nama || ''} />
                               </div>
                            </td>
                            <td className="px-3 py-2 border-r border-slate-200">
                              <input type="text" className={`${inputClass} text-center bg-slate-50 h-8 py-1`} readOnly value={line.satuan || ''} />
                            </td>
                            <td className="px-3 py-2 border-r border-slate-200">
                              <input type="number" className={`${inputClass} text-right h-8 py-1`} value={line.kuantum || ''} onChange={e => {
                                const newLines = [...form.lines];
                                newLines[idx].kuantum = Number(e.target.value);
                                setForm({...form, lines: newLines});
                              }} />
                            </td>
                            <td className="px-3 py-2 border-r border-slate-200">
                              <input type="number" className={`${inputClass} text-right h-8 py-1`} value={line.harga_satuan || ''} onChange={e => {
                                const newLines = [...form.lines];
                                newLines[idx].harga_satuan = Number(e.target.value);
                                setForm({...form, lines: newLines});
                              }} />
                            </td>
                            <td className="px-3 py-2 border-r border-slate-200">
                              <input type="number" className={`${inputClass} text-center h-8 py-1`} value={line.disc_persen || ''} onChange={e => {
                                const newLines = [...form.lines];
                                newLines[idx].disc_persen = Number(e.target.value);
                                setForm({...form, lines: newLines});
                              }} />
                            </td>
                            <td className="px-3 py-2 border-r border-slate-200">
                              <input type="number" className={`${inputClass} text-right h-8 py-1`} value={line.disc_harga || ''} onChange={e => {
                                const newLines = [...form.lines];
                                newLines[idx].disc_harga = Number(e.target.value);
                                setForm({...form, lines: newLines});
                              }} />
                            </td>
                            <td className="px-3 py-2 border-r border-slate-200 font-mono text-right font-semibold text-slate-800">
                              {hJual.toLocaleString('en-US', {minimumFractionDigits: 2})}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <button onClick={() => {
                                const newLines = form.lines.filter((_: any, i: number) => i !== idx);
                                setForm({...form, lines: newLines});
                              }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-sm transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab !== 'umum' && activeTab !== 'detail' && (
                <div className="flex items-center justify-center h-64 text-slate-500 italic">
                  Modul {activeTab === 'surat_jalan' ? 'Surat Jalan' : 'History Pembayaran'} sedang dalam pengembangan...
                </div>
              )}
            </div>

            {/* Bottom Form (Footers) */}
            {(() => {
              const subtotal = (form.lines || []).reduce((acc: number, line: any) => {
                const base = (line.kuantum || 0) * (line.harga_satuan || 0);
                const disc = (base * (line.disc_persen || 0) / 100) + (line.disc_harga || 0);
                return acc + (base - disc);
              }, 0);
              
              const ppnPercent = 11;
              const ppnAmount = subtotal * (ppnPercent / 100);
              const totalAkhir = subtotal + ppnAmount;
              
              return (
                <div className="bg-slate-50 border-t border-slate-300 p-6 shrink-0 flex flex-col lg:flex-row gap-8 justify-between mt-auto">
                   {/* Kiri: Tanda Tangan */}
                   <div className="flex-1 max-w-lg flex flex-col gap-4">
                     <div className="flex gap-4 items-start">
                        <div className="w-24 shrink-0 flex flex-col gap-1">
                          <label className="text-sm font-semibold text-slate-700">Ttd / Cap</label>
                          {signatureData && signatureData.ttd_image ? (
                            <img src={`data:image/png;base64,${signatureData.ttd_image}`} alt="Tanda Tangan" className="h-16 object-contain border border-slate-200 bg-white p-1 rounded-sm shadow-sm" />
                          ) : (
                            <div className="h-16 border border-dashed border-slate-300 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 text-center p-2 rounded-sm leading-tight">Canvas / Kosong</div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                             <label className="text-xs font-semibold text-slate-600 w-12 shrink-0">Nama</label>
                             <input type="text" className={`${inputClass} flex-1 min-w-[120px]`} value={form.penandatangan || ''} onChange={e => setForm({...form, penandatangan: e.target.value})} />
                          </div>
                          <div className="flex items-center gap-2">
                             <label className="text-xs font-semibold text-slate-600 w-12 shrink-0">Jabatan</label>
                             <input type="text" className={`${inputClass} flex-1 min-w-[120px]`} value={form.jabatan || ''} onChange={e => setForm({...form, jabatan: e.target.value})} />
                          </div>
                        </div>
                     </div>
                     <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-slate-700">Keterangan</label>
                        <textarea className={`${inputClass} w-full h-16 resize-none`} value={form.keterangan || ''} onChange={e => setForm({...form, keterangan: e.target.value})} />
                     </div>
                   </div>

                   {/* Kanan: Dua Kolom Kalkulasi */}
                   <div className="flex flex-wrap lg:flex-nowrap gap-6 shrink-0">
                     {/* Kalkulasi Piutang */}
                     <div className="flex flex-col gap-2 w-[240px] shrink-0 lg:border-l border-slate-300 lg:pl-6">
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Nilai Invoice</span>
                          <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono text-slate-800" readOnly value={totalAkhir.toLocaleString('en-US', {minimumFractionDigits: 2})} />
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Pembayaran</span>
                          <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono text-slate-800" readOnly value="0.00" />
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Potongan</span>
                          <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono text-slate-800" readOnly value="0.00" />
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Nota Kredit</span>
                          <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono text-slate-800" readOnly value="0.00" />
                       </div>
                       <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-300">
                          <span className="text-sm font-bold text-slate-800">Sisa Piutang</span>
                          <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-white border border-slate-400 rounded-sm font-mono font-bold text-slate-900" readOnly value={totalAkhir.toLocaleString('en-US', {minimumFractionDigits: 2})} />
                       </div>
                     </div>

                     {/* Kalkulasi Akhir */}
                     <div className="flex flex-col gap-2 w-[260px] shrink-0 border-l border-slate-300 pl-6">
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Jlh Harga Jual</span>
                          <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono text-slate-800" readOnly value={subtotal.toLocaleString('en-US', {minimumFractionDigits: 2})} />
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Disc.</span>
                          <div className="flex gap-1.5 w-32 justify-end">
                            <input type="number" className="w-10 text-center px-1 py-1 text-sm border border-slate-300 rounded-sm" placeholder="%" />
                            <input type="text" className="w-[80px] text-right px-2 py-1 text-sm bg-white border border-slate-300 rounded-sm font-mono" value="0.00" readOnly />
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">Uang Muka</span>
                          <input type="text" className="w-32 text-right px-2 py-1 text-sm bg-white border border-slate-300 rounded-sm font-mono" readOnly value="0.00" />
                       </div>
                       <div className="flex items-center justify-between">
                          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 cursor-pointer">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300" /> Incl PPN
                          </label>
                          <div className="flex gap-1.5 items-center w-32 justify-end">
                            <span className="text-xs font-bold text-slate-500">PPN</span>
                            <input type="number" className="w-10 text-center px-1 py-1 text-sm border border-slate-300 rounded-sm" value={ppnPercent} readOnly />
                            <input type="text" className="w-[80px] text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono" readOnly value={ppnAmount.toLocaleString('en-US', {minimumFractionDigits: 2})} />
                          </div>
                       </div>
                       <div className="flex items-center justify-end">
                          <div className="flex gap-1.5 items-center w-32 justify-end">
                            <span className="text-xs font-bold text-slate-500">PPh 22</span>
                            <input type="number" className="w-10 text-center px-1 py-1 text-sm border border-slate-300 rounded-sm" defaultValue={0} />
                            <input type="text" className="w-[80px] text-right px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-sm font-mono" readOnly value="0.00" />
                          </div>
                       </div>
                       <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-300">
                          <span className="text-sm font-bold text-slate-800">Total</span>
                          <input type="text" className="w-32 text-right px-2 py-1 text-base bg-white border border-slate-400 rounded-sm font-mono font-bold text-slate-900 shadow-inner" readOnly value={totalAkhir.toLocaleString('en-US', {minimumFractionDigits: 2})} />
                       </div>
                     </div>
                   </div>
                </div>
              );
            })()}
          </div>
          
          <div className="flex justify-end gap-3 shrink-0 py-3 mt-3">
            <button className={`${btnClass} bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-6 py-2 text-sm`}>
               BATAL
            </button>
            <button onClick={handleSaveAll} className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700 px-8 py-2 text-sm shadow-sm`}>
              <Save size={16} /> SIMPAN INVOICE
            </button>
          </div>

        </div>
      </div>
      )}

      {/* Modal Tambah Invoice */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
              <h3 className="text-white font-bold text-lg">Buat Header Invoice Baru</h3>
              <button onClick={() => setShowNewInvoiceModal(false)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 flex flex-col gap-5">
              <div>
                <label className={labelClass}>No. Invoice</label>
                <div className="flex gap-3">
                  <input type="text" className={`${inputClass} font-mono flex-1 bg-slate-50`} value={modalForm.no_invoice || ''} onChange={e => setModalForm({...modalForm, no_invoice: e.target.value})} />
                  <button className="px-5 text-sm font-bold border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md shadow-sm transition-colors" onClick={() => setModalForm({...modalForm, no_invoice: `INV/00${Math.floor(Math.random()*100)}/06/2026`})}>
                    Auto No
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Tanggal Invoice</label>
                <input type="date" className={inputClass} value={modalForm.tgl_invoice || ''} onChange={e => setModalForm({...modalForm, tgl_invoice: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Nama Pembeli</label>
                <div className="flex gap-3">
                  <select className={`${inputClass} flex-1`} value={modalForm.pembeli_id || ''} onChange={e => handlePembeliChange(e.target.value ? Number(e.target.value) : '', true)}>
                    <option value="">{loadingData ? 'Loading data...' : '-- Pilih Pembeli --'}</option>
                    {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama} - {p.alamat}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-8 py-5 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowNewInvoiceModal(false)} className={`${btnClass} bg-white text-slate-700 border border-gray-300 hover:bg-slate-50`}> TUTUP </button>
              <button onClick={handleCreateInvoiceHeader} className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700 px-6`}> BUAT INVOICE </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal PERBARUI FP */}
      {showFpModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/20 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
              <h3 className="text-white font-bold text-lg">Konfirmasi Faktur Pajak</h3>
              <button onClick={() => setShowFpModal(false)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 flex flex-col gap-5 text-center">
              <p className="text-sm font-medium text-slate-700">
                Faktur Pajak untuk invoice ini telah ada. Apakah Anda ingin mengupdate datanya atau membuat Faktur Pajak Pengganti?
              </p>
            </div>
            <div className="bg-slate-50 px-8 py-5 border-t border-gray-200 flex flex-col gap-3">
              <button onClick={() => handleRouteToFp('PERBARUI')} className="w-full px-4 py-2.5 text-sm font-bold rounded-md bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors">
                PERBARUI DATA
              </button>
              <button onClick={() => handleRouteToFp('pengganti')} className="w-full px-4 py-2.5 text-sm font-bold rounded-md bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-colors">
                BUAT PENGGANTI
              </button>
              <button onClick={() => setShowFpModal(false)} className="w-full px-4 py-2.5 text-sm font-bold rounded-md bg-white text-slate-700 border border-gray-300 hover:bg-slate-50 shadow-sm transition-colors mt-2">
                BATAL
              </button>
            </div>
          </div>
        </div>
      )}
      <SetupPelangganModal 
        isOpen={showPelangganModal} 
        onClose={() => setShowPelangganModal(false)} 
        onSaved={fetchTtd} 
      />
    </>
  );
};

export default Invoice;
