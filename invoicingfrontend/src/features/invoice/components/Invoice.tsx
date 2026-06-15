import React, { useState, useEffect } from 'react';
import { FilePlus, Trash2, X, Printer, Search, Save, RefreshCcw, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext';
import { setupApi } from '../../setup/api';
import { useSignatureAutoFill } from '../../../hooks/useSignatureAutoFill';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { SetupPelangganModal } from '../../setup/components/SetupPelangganModal';

const Invoice: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const confirm = useConfirm();

  const [activeTab, setActiveTab] = useState('detail');
  
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
    if (isModal) {
      setModalForm({
        ...modalForm,
        pembeli_id: id,
        alamat: p?.alamat_wp || p?.alamat || '',
        npwp: p?.npwp || ''
      });
    } else {
      setForm({
        ...form,
        pembeli_id: id,
        alamat: p?.alamat_wp || p?.alamat || '',
        npwp: p?.npwp || ''
      });
    }
  };

  const handleItemChange = (idx: number, id: number | '') => {
    const item = items.find(x => x.id === id);
    const newLines = [...form.lines];
    if (item) {
      newLines[idx] = {
        ...newLines[idx],
        item_id: item.id,
        kode: item.kode,
        nama: item.nama,
        satuan: item.satuan,
        harga: item.harga_jual_1 || 0,
        harga_jual: item.harga_jual_1 || 0,
        kuantum: newLines[idx].kuantum || 1,
        disc_persen: newLines[idx].disc_persen || 0,
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
    
    setForm({
      ...form,
      write_date: new Date().toISOString(),
      write_uid_name: user?.name || 'Unknown'
    });
    toast.success('Invoice berhasil disimpan');
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

  const inputClass = "w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-colors";
  const labelClass = "block text-xs md:text-sm font-semibold text-gray-700 mb-1";
  const btnClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors shadow-sm flex items-center justify-center gap-2";

  return (
    <div className="bg-slate-50 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-5 border-b border-slate-700 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white mb-2">Invoice</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300 font-medium">Pilih Periode:</span>
              <select className="h-9 px-3 text-sm bg-slate-700 text-white border border-slate-600 rounded-md outline-none focus:border-slate-400 transition-colors">
                <option>Juni 2026</option>
                <option>Mei 2026</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300 font-medium">Jenis Invoice:</span>
              <select className="h-9 px-3 text-sm bg-slate-700 text-white border border-slate-600 rounded-md outline-none focus:border-slate-400 transition-colors">
                <option>Dengan PPN</option>
                <option>Tanpa PPN</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => {
              setModalForm({...emptyForm, no_invoice: `INV/00${Math.floor(Math.random()*100)}/06/2026`});
              setShowNewInvoiceModal(true);
            }} 
            className={`${btnClass} bg-white text-slate-800 hover:bg-slate-100`}
          >
             <FilePlus size={16} /> + TAMBAH INVOICE
          </button>
          <button 
            onClick={() => navigate(form.no_invoice ? `/laporan?invoice_number=${encodeURIComponent(form.no_invoice)}&reportName=${encodeURIComponent('Invoice (A4 / Kwarto)')}` : '/laporan?reportName=Invoice (A4 / Kwarto)')} 
            className={`${btnClass} bg-white text-slate-800 hover:bg-slate-100`}
          >
             <Printer size={16} /> CETAK
          </button>
          <button 
            onClick={handleUpdateFpClick}
            className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700`}
          >
             PERBARUI FP
          </button>
          <button 
            onClick={handleCreateKwitansi}
            className={`${btnClass} bg-indigo-600 text-white hover:bg-indigo-700`}
          >
             PERBARUI KWITANSI
          </button>
          <button 
            className={`${btnClass} bg-green-600 text-white hover:bg-green-700`}
          >
             <DollarSign size={16} /> BAYAR
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Form Informasi Umum */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 shrink-0">
          <h3 className="text-lg font-bold text-slate-800 mb-6 pb-3 border-b border-gray-200">Informasi Umum</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Kolom 1 */}
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>No. Invoice</label>
                <div className="flex gap-2 w-full">
                  <input type="text" className={`${inputClass} font-mono bg-slate-50`} readOnly value={form.no_invoice || ''} />
                  <button className="px-3 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"><Search size={16} className="text-gray-600" /></button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Tgl Invoice</label>
                <input type="date" className={inputClass} value={form.tgl_invoice || ''} onChange={e => setForm({...form, tgl_invoice: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Nama Pembeli</label>
                <div className="flex gap-2 w-full">
                  <select className={inputClass} value={form.pembeli_id || ''} onChange={e => handlePembeliChange(e.target.value ? Number(e.target.value) : '')}>
                    <option value="">{loadingData ? 'Loading data...' : '-- Pilih Pembeli --'}</option>
                    {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama} - {p.alamat}</option>)}
                  </select>
                  <button onClick={() => setShowPelangganModal(true)} className="px-3 font-bold border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-600 transition-colors">+</button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Alamat</label>
                <textarea className={`${inputClass} h-20 resize-none`} value={form.alamat || ''} onChange={e => setForm({...form, alamat: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>NPWP</label>
                <input type="text" className={`${inputClass} bg-blue-50/50`} value={form.npwp || ''} onChange={e => setForm({...form, npwp: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Proyek</label>
                <select className={inputClass} value={form.proyek || ''} onChange={e => setForm({...form, proyek: e.target.value})}>
                  <option value="">{loadingData ? 'Loading data...' : '-- Pilih Proyek --'}</option>
                  {proyeks.map(p => <option key={p.id} value={p.kode}>{p.nama}</option>)}
                </select>
              </div>
            </div>

            {/* Kolom 2 */}
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Mata Uang</label>
                <select className={inputClass} value={form.mata_uang || 'IDR'} onChange={e => setForm({...form, mata_uang: e.target.value})}>
                  <option value="IDR">IDR</option>
                  {mataUangs.map(m => m.kode !== 'IDR' && <option key={m.id} value={m.kode}>{m.kode}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>No. SO</label>
                <div className="flex gap-2 w-full">
                  <select className={inputClass} value={form.no_so || ''} onChange={e => setForm({...form, no_so: e.target.value})}>
                    <option value="">{loadingData ? 'Loading...' : '-- Pilih SO --'}</option>
                    {salesOrders.map((so, idx) => <option key={idx} value={so.no_so}>{so.no_so}</option>)}
                  </select>
                  <button className="px-3 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"><Search size={16} className="text-gray-600" /></button>
                </div>
              </div>
              <div>
                <label className={labelClass}>No. PO</label>
                <input type="text" className={inputClass} value={form.no_po || ''} onChange={e => setForm({...form, no_po: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Cara Pembayaran</label>
                <select className={inputClass} value={form.cara_pembayaran || ''} onChange={e => setForm({...form, cara_pembayaran: e.target.value})}>
                  <option value="">{loadingData ? 'Loading data...' : '-- Pilih --'}</option>
                  {pembayarans.map(p => <option key={p.id} value={p.nama}>{p.nama}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Salesman</label>
                <select className={inputClass} value={form.salesman_id || ''} onChange={e => setForm({...form, salesman_id: e.target.value ? Number(e.target.value) : ''})}>
                  <option value="">{loadingData ? 'Loading data...' : '-- Pilih Salesman --'}</option>
                  {salesmans.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>No. Faktur Pajak</label>
                <div className="flex gap-2 w-full">
                  <input type="text" className={`${inputClass} bg-blue-50/50`} value={form.no_faktur_pajak || ''} onChange={e => setForm({...form, no_faktur_pajak: e.target.value})} />
                  <button className="px-3 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"><RefreshCcw size={16} className="text-gray-600" /></button>
                </div>
              </div>
              <div>
                <label className={labelClass}>No. Kwitansi</label>
                <div className="flex gap-2 w-full">
                  <input type="text" className={`${inputClass} bg-blue-50/50`} value={form.no_kwitansi || ''} onChange={e => setForm({...form, no_kwitansi: e.target.value})} />
                  <button className="px-3 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"><RefreshCcw size={16} className="text-gray-600" /></button>
                </div>
              </div>
            </div>

            {/* Kolom 3 */}
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Kurs Jual</label>
                <input type="number" className={`${inputClass} text-right`} value={form.kurs_jual || ''} onChange={e => setForm({...form, kurs_jual: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Tgl JT</label>
                <input type="date" className={inputClass} value={form.tgl_jt || ''} onChange={e => setForm({...form, tgl_jt: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Tgl PO</label>
                <input type="date" className={inputClass} value={form.tgl_po || ''} onChange={e => setForm({...form, tgl_po: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Gudang</label>
                <select className={inputClass} value={form.gudang_id || ''} onChange={e => setForm({...form, gudang_id: e.target.value ? Number(e.target.value) : ''})}>
                  <option value="">{loadingData ? 'Loading data...' : '-- Pilih Gudang --'}</option>
                  {gudangs.map(g => <option key={g.id} value={g.id}>{g.nama_gudang}</option>)}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" checked={form.is_jasa || false} onChange={e => setForm({...form, is_jasa: e.target.checked})} />
                  <label className="text-sm font-semibold text-gray-700">Jasa?</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" checked={form.is_paid || false} onChange={e => setForm({...form, is_paid: e.target.checked})} />
                  <label className="text-sm font-semibold text-gray-700">Paid?</label>
                </div>
              </div>
            </div>

            {/* Kolom 4 */}
            <div className="flex flex-col gap-4 h-full">
              <div className="flex-1 flex flex-col">
                <label className={labelClass}>Catatan Internal</label>
                <textarea className={`${inputClass} flex-1 resize-none h-full min-h-[120px]`} value={form.catatan || ''} onChange={e => setForm({...form, catatan: e.target.value})} />
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <div className="border border-gray-200 p-3 relative rounded-md bg-gray-50 shadow-sm">
                  <span className="absolute -top-2.5 left-3 bg-gray-50 px-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wide">Record Created</span>
                  <div className="flex gap-2 mt-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 bg-white font-mono text-xs rounded-md" readOnly value={form.create_date ? new Date(form.create_date).toLocaleString('id-ID') : '-'} />
                    <input type="text" className="w-24 h-8 px-2 border border-gray-200 bg-white text-center text-xs rounded-md" readOnly value={form.create_uid_name || user?.name || 'Unknown'} />
                  </div>
                </div>
                <div className="border border-gray-200 p-3 relative rounded-md bg-gray-50 shadow-sm">
                  <span className="absolute -top-2.5 left-3 bg-gray-50 px-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wide">Record Modified</span>
                  <div className="flex gap-2 mt-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-200 bg-white font-mono text-xs rounded-md" readOnly value={form.write_date ? new Date(form.write_date).toLocaleString('id-ID') : '-'} />
                    <input type="text" className="w-24 h-8 px-2 border border-gray-200 bg-white text-center text-xs rounded-md" readOnly value={form.write_uid_name || user?.name || 'Unknown'} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs Tabel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col shrink-0 overflow-hidden">
          <div className="flex border-b border-gray-200 bg-slate-50">
            <button 
              onClick={() => setActiveTab('detail')}
              className={`px-8 py-3 text-sm font-bold transition-colors ${activeTab === 'detail' ? 'bg-white text-blue-700 border-t-2 border-t-blue-600 border-r border-gray-200' : 'text-slate-600 hover:bg-slate-100 border-t-2 border-t-transparent border-r border-transparent'}`}>
              Detail Barang/Jasa
            </button>
            <button 
              onClick={() => setActiveTab('surat-jalan')}
              className={`px-8 py-3 text-sm font-bold transition-colors ${activeTab === 'surat-jalan' ? 'bg-white text-blue-700 border-t-2 border-t-blue-600 border-x border-gray-200' : 'text-slate-600 hover:bg-slate-100 border-t-2 border-t-transparent border-x border-transparent'}`}>
              Surat Jalan
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-8 py-3 text-sm font-bold transition-colors ${activeTab === 'history' ? 'bg-white text-blue-700 border-t-2 border-t-blue-600 border-x border-gray-200' : 'text-slate-600 hover:bg-slate-100 border-t-2 border-t-transparent border-x border-transparent'}`}>
              History Pembayaran
            </button>
          </div>
          
          <div className="overflow-x-auto min-h-[250px] p-4">
            {activeTab === 'detail' && (
              <table className="w-full text-sm whitespace-nowrap border border-gray-200 rounded-md overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-gray-300">
                    <th className="w-12 px-3 py-3 text-center border-r border-gray-200 font-semibold">No.</th>
                    <th className="w-48 px-3 py-3 text-left border-r border-gray-200 font-semibold">Kode Barang</th>
                    <th className="px-3 py-3 text-left border-r border-gray-200 font-semibold">Nama Barang</th>
                    <th className="w-24 px-3 py-3 text-center border-r border-gray-200 font-semibold">Satuan</th>
                    <th className="w-24 px-3 py-3 text-center border-r border-gray-200 font-semibold">Kuantum</th>
                    <th className="w-32 px-3 py-3 text-right border-r border-gray-200 font-semibold">Harga @</th>
                    <th className="w-20 px-3 py-3 text-center border-r border-gray-200 font-semibold">% Disc</th>
                    <th className="w-32 px-3 py-3 text-right border-r border-gray-200 font-semibold">Discount Harga</th>
                    <th className="w-32 px-3 py-3 text-right border-r border-gray-200 font-semibold">Harga Jual</th>
                    <th className="w-12 px-3 py-3 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {form.lines.map((line: any, idx: number) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-3 py-2 text-center border-r border-gray-200 font-medium text-slate-600">{idx + 1}</td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <select className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500" value={line.item_id || ''} onChange={(e) => handleItemChange(idx, e.target.value ? Number(e.target.value) : '')}>
                          <option value="">{loadingData ? 'Loading...' : '-- Pilih Kode Barang --'}</option>
                          {items.map(i => <option key={i.id} value={i.id}>{i.kode}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <input type="text" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm bg-slate-50 focus:outline-none" readOnly value={line.nama || ''} />
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <input type="text" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm bg-slate-50 text-center focus:outline-none" readOnly value={line.satuan || ''} />
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <input type="number" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm text-right focus:outline-none focus:border-blue-500" value={line.kuantum || ''} />
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <input type="number" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm text-right focus:outline-none focus:border-blue-500" value={line.harga || ''} />
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <input type="number" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm text-center focus:outline-none focus:border-blue-500" value={line.disc_persen || ''} />
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <input type="number" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm text-right focus:outline-none focus:border-blue-500" value={line.disc_harga || ''} />
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <input type="text" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm text-right bg-slate-100 font-semibold text-slate-800" disabled value={line.harga_jual || ''} />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button className="text-red-500 hover:text-red-700 p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100 hover:bg-red-50" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-3 py-3 border-r border-gray-200 text-center">
                      <button className="w-7 h-7 mx-auto bg-slate-100 hover:bg-slate-200 text-slate-700 border border-gray-300 rounded-md flex items-center justify-center font-bold shadow-sm transition-colors" onClick={() => {
                        setForm({...form, lines: [...form.lines, { item_id: '', kode: '', nama: '', satuan: '', kuantum: 1, harga: 0, disc_persen: 0, disc_harga: 0, harga_jual: 0 }]});
                      }}>+</button>
                    </td>
                    <td colSpan={9} className="px-4 py-3 text-sm text-slate-500 italic bg-slate-50">Klik tombol + untuk menambah baris barang/jasa</td>
                  </tr>
                </tbody>
              </table>
            )}
            {activeTab !== 'detail' && (
              <div className="p-12 text-center text-slate-500 font-medium">
                Belum ada data riwayat.
              </div>
            )}
          </div>
        </div>

        {/* Footer: Tanda Tangan & Kalkulasi */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 shrink-0">
          
          {/* Blok 1: Tanda Tangan */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-4">
            {signatureData && signatureData.ttd_image && (
              <div className="mt-2 mb-2">
                <img 
                  src={`data:image/png;base64,${signatureData.ttd_image}`} 
                  alt="Tanda Tangan" 
                  className="h-16 w-auto object-contain border-b border-gray-300 mb-2 self-center mx-auto" 
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tanda Tangan (Nama)</label>
                <input 
                  type="text" 
                  className={inputClass} 
                  value={form.penandatangan || ''} 
                  onChange={e => setForm({...form, penandatangan: e.target.value})} 
                />
              </div>
              <div>
                <label className={labelClass}>Jabatan</label>
                <input 
                  type="text" 
                  className={inputClass} 
                  value={form.jabatan || ''} 
                  onChange={e => setForm({...form, jabatan: e.target.value})} 
                />
              </div>
            </div>
            <div className="mt-auto">
              <label className={labelClass}>Keterangan Tambahan</label>
              <textarea className={`${inputClass} h-20 resize-none`} value={form.keterangan || ''} onChange={e => setForm({...form, keterangan: e.target.value})} />
            </div>
          </div>

          {/* Blok 2: Summary Read-Only */}
          <div className="bg-slate-50 border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-4">
            <h4 className="text-lg font-bold text-slate-800 border-b border-gray-200 pb-3 mb-2">Summary Piutang</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Nilai Invoice</span>
              <input type="text" className={`${inputClass} w-48 text-right bg-gray-200/50 font-semibold text-slate-800`} readOnly value="0" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Total Pembayaran</span>
              <input type="text" className={`${inputClass} w-48 text-right bg-gray-200/50 text-slate-800`} readOnly value="0" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Total Potongan</span>
              <input type="text" className={`${inputClass} w-48 text-right bg-gray-200/50 text-slate-800`} readOnly value="0" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600">Nilai Nota Kredit</span>
              <input type="text" className={`${inputClass} w-48 text-right bg-gray-200/50 text-slate-800`} readOnly value="0" />
            </div>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-300">
              <span className="text-base font-bold text-slate-800">Sisa Piutang</span>
              <input type="text" className={`${inputClass} w-48 text-right bg-blue-50 font-bold text-blue-800 border-blue-200 text-lg`} readOnly value="0" />
            </div>
          </div>

          {/* Blok 3: Kalkulasi Input */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Jlh Harga Jual</span>
              <input type="text" className={`${inputClass} w-48 text-right bg-slate-50`} readOnly value="0" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Discount</span>
              <div className="flex items-center gap-3 w-48">
                <input type="number" className={`${inputClass} w-16 text-center`} placeholder="%" />
                <input type="text" className={`${inputClass} flex-1 text-right`} placeholder="Rp" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Uang Muka</span>
              <input type="text" className={`${inputClass} w-48 text-right bg-slate-50`} readOnly value="0" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm font-semibold text-gray-700">Incl. PPN</span>
              </div>
              <div className="flex items-center gap-3 w-48">
                <input type="number" className={`${inputClass} w-16 text-center`} placeholder="%" />
                <input type="text" className={`${inputClass} flex-1 text-right bg-slate-50`} readOnly value="0" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">PPh 22</span>
              <div className="flex items-center gap-3 w-48">
                <input type="number" className={`${inputClass} w-16 text-center`} placeholder="%" />
                <input type="text" className={`${inputClass} flex-1 text-right bg-slate-50`} readOnly value="0" />
              </div>
            </div>
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-300">
              <span className="text-lg font-bold text-slate-800">Total Akhir</span>
              <input type="text" className="w-48 h-12 px-4 border border-gray-400 rounded-md text-right bg-slate-800 text-white font-bold text-xl shadow-inner outline-none" readOnly value="0" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 shrink-0 pb-6 mt-2">
          <button className={`${btnClass} bg-white text-slate-700 border border-gray-300 hover:bg-slate-50 px-8 py-3 text-sm`}>
             BATAL
          </button>
          <button onClick={handleSaveAll} className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700 px-10 py-3 text-sm shadow-md`}>
            <Save size={18} /> SIMPAN INVOICE
          </button>
        </div>
      </div>

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
    </div>
  );
};

export default Invoice;
