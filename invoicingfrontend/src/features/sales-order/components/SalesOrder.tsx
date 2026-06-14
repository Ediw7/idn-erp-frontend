import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, Trash2, Printer, Ban, Save, Search, Send, X } from 'lucide-react';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { salesOrderApi, SalesOrderData, SalesOrderLine } from '../api';
import { setupApi, PelangganData, MataUangData, PembayaranData, SalesmanData, ItemData, GudangData } from '../../setup/api';
import toast from 'react-hot-toast';

const SalesOrder: React.FC = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [dataList, setDataList] = useState<SalesOrderData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [mataUangs, setMataUangs] = useState<MataUangData[]>([]);
  const [pembayarans, setPembayarans] = useState<PembayaranData[]>([]);
  const [salesmans, setSalesmans] = useState<SalesmanData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [gudangs, setGudangs] = useState<GudangData[]>([]);

  const [periode, setPeriode] = useState('2026-06');
  const [activeTab, setActiveTab] = useState<'detail' | 'surat_jalan' | 'outstanding'>('detail');

  const [showSjModal, setShowSjModal] = useState(false);
  const [sjForm, setSjForm] = useState({
    pelanggan_id: '',
    alamat_kirim: '',
    no_so: '',
    gudang_id: '',
    tanggal: new Date().toISOString().split('T')[0]
  });

  const [showNewSoModal, setShowNewSoModal] = useState(false);
  const [newSoForm, setNewSoForm] = useState<Partial<SalesOrderData>>({});

  const [form, setForm] = useState<Partial<SalesOrderData>>({
    no_so: '', tgl_so: new Date().toISOString().split('T')[0], pelanggan_id: null, alamat_kirim: '',
    no_po: '', tgl_po: '', mata_uang_id: null, pembayaran_id: null, salesman_id: null,
    tgl_kirim: '', dipesan_oleh: '', is_closed: false, is_void: false, keterangan: '',
    potongan_harga: 0, ppn_persen: 10, ongkos_angkut: 0, 
    lines: [{ item_id: null, satuan: '', kuantum: 1, harga_satuan: 0, disc_persen: 0, disc_harga: 0, keterangan: '' }]
  });

  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [resSo, p, m, py, s, i, g] = await Promise.all([
        salesOrderApi.getAll(), setupApi.getPelanggan(), setupApi.getMataUang(),
        setupApi.getPembayaran(), setupApi.getSalesman(), setupApi.getItem(),
        setupApi.getGudang()
      ]);

      const soData = resSo || [];
      setDataList(soData);
      setPelanggans(p || []); setMataUangs(m || []); setPembayarans(py || []);
      setSalesmans(s || []); setItems(i || []); setGudangs(g || []);

      if (soData.length > 0) {
        setForm(soData[0]);
        setCurrentIndex(0);
        setIsNew(false);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const handleNewClick = async () => {
    try {
      const res = await salesOrderApi.autoNo();
      setNewSoForm({
        no_so: res.no_so, tgl_so: new Date().toISOString().split('T')[0], pelanggan_id: null, alamat_kirim: '',
        no_po: '', tgl_po: '', mata_uang_id: null, pembayaran_id: null, salesman_id: null,
        tgl_kirim: '', dipesan_oleh: '', is_closed: false, is_void: false, keterangan: '',
        potongan_harga: 0, ppn_persen: 10, ongkos_angkut: 0, 
        lines: [] // Empty lines for new header
      });
      setShowNewSoModal(true);
    } catch (e) {
      console.error(e);
      // Fallback
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
      const soData = resSo || [];
      setDataList(soData);
      
      const newlyCreated = soData.find(so => so.id === savedRes.id) || soData[soData.length - 1];
      if (newlyCreated) {
        setForm({
          ...newlyCreated,
          lines: [{ item_id: null, satuan: '', kuantum: 1, harga_satuan: 0, disc_persen: 0, disc_harga: 0, keterangan: '' }]
        });
        setCurrentIndex(soData.findIndex(so => so.id === newlyCreated.id));
      }
      setIsNew(false);
      setActiveTab('detail');
      setShowNewSoModal(false);
      toast.success('Header Sales Order berhasil dibuat. Silakan lengkapi Detail Barang!');
    } catch (error) {
      toast.error('Gagal membuat Sales Order');
    }
  };

  const handleCetak = () => {
    if (form.no_so) {
      navigate(`/laporan?so_number=${encodeURIComponent(form.no_so)}`);
    } else {
      navigate('/laporan');
    }
  };

  const handleVoid = () => {
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
    try {
      await salesOrderApi.save(form as SalesOrderData);
      const resSo = await salesOrderApi.getAll();
      const soData = resSo || [];
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
    }
  };

  const handleDelete = async () => {
    if (isNew || !form.id) return;
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus Sales Order ini?');
    if (!isConfirmed) return;
    try {
      await salesOrderApi.delete(form.id);
      const resSo = await salesOrderApi.getAll();
      const soData = resSo || [];
      setDataList(soData);

      if (soData.length > 0) {
        setCurrentIndex(0);
        setForm(soData[0]);
      } else {
        setForm({
          no_so: '', tgl_so: new Date().toISOString().split('T')[0], pelanggan_id: null, alamat_kirim: '',
          no_po: '', tgl_po: '', mata_uang_id: null, pembayaran_id: null, salesman_id: null,
          tgl_kirim: '', dipesan_oleh: '', is_closed: false, is_void: false, keterangan: '',
          potongan_harga: 0, ppn_persen: 10, ongkos_angkut: 0, 
          lines: [{ item_id: null, satuan: '', kuantum: 1, harga_satuan: 0, disc_persen: 0, disc_harga: 0, keterangan: '' }]
        });
      }
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  const calculateSubtotal = () => {
    return (form.lines || []).reduce((acc, line) => {
      const base = (line.kuantum || 0) * (line.harga_satuan || 0);
      const disc = (base * (line.disc_persen || 0) / 100) + (line.disc_harga || 0);
      return acc + (base - disc);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const dpp = subtotal - (form.potongan_harga || 0);
  const ppnAmount = dpp * (form.ppn_persen || 0) / 100;
  const total = dpp + ppnAmount + (form.ongkos_angkut || 0);

  const handlePelangganChange = (id: number) => {
    const p = pelanggans.find(x => x.id === id);
    setForm({ ...form, pelanggan_id: id, alamat_kirim: p?.alamat_kirim || '' });
  };

  const addLine = () => {
    setForm({
      ...form,
      lines: [...(form.lines || []), { item_id: null, satuan: '', kuantum: 1, harga_satuan: 0, disc_persen: 0, disc_harga: 0, keterangan: '' }]
    });
  };

  const removeLine = (idx: number) => {
    const newLines = [...(form.lines || [])];
    newLines.splice(idx, 1);
    setForm({ ...form, lines: newLines });
  };

  const updateLine = (idx: number, field: keyof SalesOrderLine, value: any) => {
    const newLines = [...(form.lines || [])];
    const line = { ...newLines[idx], [field]: value };
    if (field === 'item_id' && value) {
      const item = items.find(x => x.id === value);
      if (item) {
        line.satuan = item.satuan;
        line.harga_satuan = item.harga_jual_1;
      }
    }
    newLines[idx] = line;
    setForm({ ...form, lines: newLines });
  };

  const inputClass = "w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white";
  const labelClass = "text-sm font-semibold text-slate-700 w-36 shrink-0 pt-1";

  return (
    <>
      <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white">Sales Order</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-slate-300 font-medium">Pilih Periode:</span>
              <select 
                value={periode} 
                onChange={e => setPeriode(e.target.value)}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026-06">Juni 2026</option>
                <option value="2026-05">Mei 2026</option>
                <option value="2026-04">April 2026</option>
                <option value="2026-03">Maret 2026</option>
                <option value="2026-02">Februari 2026</option>
                <option value="2026-01">Januari 2026</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleNewClick} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
               <FilePlus size={14} /> + TAMBAH SO
            </button>
            <button onClick={handleCetak} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm">
               <Printer size={14} /> CETAK
            </button>
            <button onClick={handleVoid} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm">
               <Ban size={14} /> VOID
            </button>
            <button onClick={handleBuatSJClick} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm">
               <Send size={14} /> BUAT SJ
            </button>
          </div>
        </div>

        {/* Main Content Area (Flowing) */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {/* Informasi Umum */}
          <div className="bg-white border border-slate-300 rounded-sm shadow-sm p-6 shrink-0">
            <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Informasi Umum</h3>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Kolom Kiri */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-start">
                  <label className={labelClass}>No. Sales Order</label>
                  <div className="flex gap-1 flex-1">
                    <input type="text" className={`${inputClass} font-mono w-48 bg-slate-50`} readOnly value={form.no_so || ''} />
                    <button className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm"><Search size={14} /></button>
                  </div>
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Tgl Sales Order</label>
                  <input type="date" className={`${inputClass} w-48`} value={form.tgl_so || ''} onChange={e => setForm({ ...form, tgl_so: e.target.value })} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Nama Pelanggan</label>
                  <select className={inputClass} value={form.pelanggan_id || ''} onChange={e => handlePelangganChange(Number(e.target.value))}>
                    <option value="">-- Pilih --</option>
                    {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                  </select>
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Dikirim ke Alamat</label>
                  <textarea className={`${inputClass} h-24 resize-none`} value={form.alamat_kirim || ''} onChange={e => setForm({ ...form, alamat_kirim: e.target.value })} />
                </div>
              </div>

              {/* Kolom Tengah */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-start">
                  <label className={labelClass}>No. PO Pelanggan</label>
                  <input type="text" className={`${inputClass} w-full`} value={form.no_po || ''} onChange={e => setForm({ ...form, no_po: e.target.value })} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Tgl PO</label>
                  <input type="date" className={`${inputClass} w-48`} value={form.tgl_po || ''} onChange={e => setForm({ ...form, tgl_po: e.target.value })} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Mata Uang</label>
                  <select className={`${inputClass} w-48`} value={form.mata_uang_id || ''} onChange={e => setForm({ ...form, mata_uang_id: Number(e.target.value) || null })}>
                    <option value="">-- Pilih --</option>
                    {mataUangs.map(m => <option key={m.id} value={m.id}>{m.kode}</option>)}
                  </select>
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Cara Pembayaran</label>
                  <select className={inputClass} value={form.pembayaran_id || ''} onChange={e => setForm({ ...form, pembayaran_id: Number(e.target.value) || null })}>
                    <option value="">-- Pilih --</option>
                    {pembayarans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                  </select>
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Salesman</label>
                  <select className={inputClass} value={form.salesman_id || ''} onChange={e => setForm({ ...form, salesman_id: Number(e.target.value) || null })}>
                    <option value="">-- Pilih --</option>
                    {salesmans.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                  </select>
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Tgl Kirim</label>
                  <input type="date" className={`${inputClass} w-48`} value={form.tgl_kirim || ''} onChange={e => setForm({ ...form, tgl_kirim: e.target.value })} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Dipesan Oleh</label>
                  <input type="text" className={`${inputClass} w-full`} value={form.dipesan_oleh || ''} onChange={e => setForm({ ...form, dipesan_oleh: e.target.value })} />
                </div>
              </div>

              {/* Kolom Kanan - Audit */}
              <div className="w-[280px] flex flex-col gap-4">
                <div className="flex gap-4 items-center bg-slate-50 p-3 border border-slate-200 rounded-sm">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.is_closed} onChange={e => setForm({ ...form, is_closed: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Closed
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.is_void} onChange={e => setForm({ ...form, is_void: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Void
                  </label>
                </div>

                <div className="border border-slate-300 p-3 relative mt-2 rounded-sm bg-white shadow-sm">
                  <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Created</span>
                  <div className="flex gap-2 mt-2">
                    <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.create_date ? new Date(form.create_date).toLocaleString('id-ID') : '-'} />
                    <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.create_uid_name || 'Admin'} />
                  </div>
                </div>
                <div className="border border-slate-300 p-3 relative mt-3 rounded-sm bg-white shadow-sm">
                  <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Modified</span>
                  <div className="flex gap-2 mt-2">
                    <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.write_date ? new Date(form.write_date).toLocaleString('id-ID') : '-'} />
                    <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.write_uid_name || 'Admin'} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Data (Sistem Tab) */}
          <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0">
            <div className="px-3 pt-2 bg-slate-100 border-b border-slate-300 flex gap-1">
              <button className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === 'detail' ? 'bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm' : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors'}`} onClick={() => setActiveTab('detail')}>Detail Barang/Jasa</button>
              <button className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === 'surat_jalan' ? 'bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm' : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors'}`} onClick={() => setActiveTab('surat_jalan')}>Surat Jalan</button>
              <button className={`px-5 py-2 text-sm font-bold rounded-t-sm border border-b-0 ${activeTab === 'outstanding' ? 'bg-white border-slate-300 text-blue-800 -mb-px pb-2.5 shadow-sm' : 'bg-slate-200 border-slate-300 text-slate-600 hover:bg-white transition-colors'}`} onClick={() => setActiveTab('outstanding')}>Outstanding</button>
            </div>
            
            <div className="overflow-x-auto min-h-[250px]">
              {activeTab === 'detail' && (
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
                      <th className="px-3 py-2 border-r border-slate-300 font-semibold">Keterangan</th>
                      <th className="px-3 py-2 w-12 text-center font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(form.lines || []).map((line, idx) => {
                      const base = (line.kuantum || 0) * (line.harga_satuan || 0);
                      const disc = (base * (line.disc_persen || 0) / 100) + (line.disc_harga || 0);
                      const hJual = base - disc;
                      return (
                        <tr key={idx} className="hover:bg-blue-50 transition-colors border-b border-slate-200">
                          <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">{idx + 1}</td>
                          <td className="px-3 py-1.5 border-r border-slate-200">
                            <select className="w-full px-2 py-1 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500 bg-white" value={line.item_id || ''} onChange={e => updateLine(idx, 'item_id', Number(e.target.value) || null)}>
                              <option value=""></option>
                              {items.map(i => <option key={i.id} value={i.id}>{i.kode} - {i.nama}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-200">
                            <input type="text" className="w-full px-2 py-1 text-sm text-center border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500" value={line.satuan || ''} onChange={e => updateLine(idx, 'satuan', e.target.value)} />
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-200">
                            <input type="number" className="w-full px-2 py-1 text-sm text-right border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500" value={line.kuantum || ''} onChange={e => updateLine(idx, 'kuantum', Number(e.target.value))} />
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-200">
                            <input type="number" className="w-full px-2 py-1 text-sm text-right border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500" value={line.harga_satuan || ''} onChange={e => updateLine(idx, 'harga_satuan', Number(e.target.value))} />
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-200">
                            <input type="number" className="w-full px-2 py-1 text-sm text-right border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500" value={line.disc_persen || ''} onChange={e => updateLine(idx, 'disc_persen', Number(e.target.value))} />
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-200">
                            <input type="number" className="w-full px-2 py-1 text-sm text-right border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500" value={line.disc_harga || ''} onChange={e => updateLine(idx, 'disc_harga', Number(e.target.value))} />
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-200 text-right font-semibold text-slate-800 bg-slate-50">
                            {hJual.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-3 py-1.5 border-r border-slate-200">
                            <input type="text" className="w-full px-2 py-1 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500" value={line.keterangan || ''} onChange={e => updateLine(idx, 'keterangan', e.target.value)} />
                          </td>
                          <td className="px-3 py-1.5 text-center">
                            <button onClick={() => removeLine(idx)} className="text-red-500 hover:text-red-700 p-1 rounded transition-colors hover:bg-red-50" title="Hapus">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    <tr>
                      <td className="px-3 py-2 border-r border-slate-200 text-center">
                        <button onClick={addLine} className="w-6 h-6 mx-auto bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-sm flex items-center justify-center font-bold text-lg shadow-sm">+</button>
                      </td>
                      <td colSpan={9} className="px-4 py-2 text-sm text-slate-400 italic bg-slate-50">Klik tombol + untuk menambah baris barang/jasa</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {activeTab === 'surat_jalan' && (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
                    <tr>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-12 text-center">No.</th>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-40">No. Surat Jalan</th>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32">Kode Gudang</th>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32">Tanggal</th>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-40">No. Kendaraan</th>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-slate-50">
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-500 italic">Belum ada riwayat pengiriman Surat Jalan untuk Sales Order ini.</td>
                    </tr>
                  </tbody>
                </table>
              )}

              {activeTab === 'outstanding' && (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
                    <tr>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-12 text-center">No.</th>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-40">Kode Barang</th>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-64">Nama Barang</th>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-24 text-center">Satuan</th>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32 text-right">Quantity Order</th>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32 text-right">Quantity Kirim</th>
                      <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32 text-right">Sisa Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(form.lines || []).map((line, idx) => {
                      const itemInfo = items.find(i => i.id === line.item_id);
                      if (!line.item_id) return null;
                      return (
                        <tr key={idx} className="hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-2 border-r border-slate-200 text-center font-medium">{idx + 1}</td>
                          <td className="px-4 py-2 border-r border-slate-200">{itemInfo?.kode || '-'}</td>
                          <td className="px-4 py-2 border-r border-slate-200">{itemInfo?.nama || '-'}</td>
                          <td className="px-4 py-2 border-r border-slate-200 text-center">{line.satuan}</td>
                          <td className="px-4 py-2 border-r border-slate-200 text-right font-mono text-blue-700">{line.kuantum}</td>
                          <td className="px-4 py-2 border-r border-slate-200 text-right font-mono text-green-700">0</td>
                          <td className="px-4 py-2 border-r border-slate-200 text-right font-mono font-bold">{line.kuantum}</td>
                        </tr>
                      );
                    })}
                    {(!form.lines || form.lines.filter(l => l.item_id).length === 0) && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500 italic bg-slate-50">Silakan isi Detail Barang terlebih dahulu.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer Totals Box (Right Aligned) */}
            <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col lg:flex-row gap-8 justify-between shrink-0">
              {/* Keterangan */}
              <div className="flex-1 max-w-xl">
                <label className="block text-sm font-semibold text-slate-800 mb-2">Keterangan Tambahan:</label>
                <textarea
                  className="w-full h-24 p-3 border border-slate-300 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-sm resize-none bg-white rounded-sm shadow-sm"
                  placeholder="Tuliskan keterangan untuk sales order ini..."
                  value={form.keterangan || ''}
                  onChange={e => setForm({ ...form, keterangan: e.target.value })}
                />
              </div>

              {/* Totals & Save Button */}
              <div className="w-full lg:w-[420px] flex flex-col">
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">Sub Total</span>
                    <input type="text" readOnly className="w-48 px-3 py-1.5 text-right bg-slate-100 border border-slate-300 font-mono text-sm font-bold rounded-sm" value={subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">Potongan Harga</span>
                    <input type="number" className="w-48 px-3 py-1.5 text-right bg-white border border-slate-300 focus:outline-none focus:border-blue-500 font-mono text-sm rounded-sm" value={form.potongan_harga || ''} onChange={e => setForm({ ...form, potongan_harga: Number(e.target.value) })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700">PPN (%)</span>
                      <input type="number" className="w-16 px-2 py-1.5 text-center bg-white border border-slate-300 focus:outline-none focus:border-blue-500 text-sm rounded-sm" value={form.ppn_persen || ''} onChange={e => setForm({ ...form, ppn_persen: Number(e.target.value) })} />
                    </div>
                    <input type="text" readOnly className="w-48 px-3 py-1.5 text-right bg-slate-100 border border-slate-300 font-mono text-sm rounded-sm" value={ppnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">Ongkos Angkut</span>
                    <input type="number" className="w-48 px-3 py-1.5 text-right bg-white border border-slate-300 focus:outline-none focus:border-blue-500 font-mono text-sm rounded-sm" value={form.ongkos_angkut || ''} onChange={e => setForm({ ...form, ongkos_angkut: Number(e.target.value) })} />
                  </div>
                  
                  {/* Total Akhir */}
                  <div className="flex justify-end mt-2">
                    <div className="flex items-center border border-slate-300 bg-white rounded-sm overflow-hidden shadow-sm w-full">
                      <span className="px-4 py-3 text-xs font-bold text-slate-700 bg-slate-100 border-r border-slate-300 uppercase tracking-wide flex-1">Total Akhir</span>
                      <span className="px-3 py-3 text-xs font-bold text-slate-600 bg-slate-50 border-r border-slate-300">IDR</span>
                      <span className="px-4 py-3 text-base font-bold text-slate-900 text-right min-w-[160px] font-mono">
                        {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button onClick={handleDelete} disabled={!form.id} className="px-6 py-3 text-sm font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm disabled:opacity-50">
                    <Trash2 size={16} /> HAPUS SO
                  </button>
                  <button onClick={handleSave} className="px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-md w-full">
                    <Save size={16} /> SIMPAN SALES ORDER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Auto Create Surat Jalan */}
      {showSjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-[500px] rounded-md shadow-xl flex flex-col overflow-hidden border border-slate-700">
            {/* Modal Header */}
            <div className="bg-slate-800 px-5 py-3 flex justify-between items-center">
              <h3 className="text-white font-semibold text-sm">Auto Create Surat Jalan</h3>
              <button onClick={() => setShowSjModal(false)} className="text-slate-300 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">Nama Pelanggan</label>
                <select 
                  className={inputClass} 
                  value={sjForm.pelanggan_id} 
                  onChange={e => {
                    const p = pelanggans.find(x => String(x.id) === e.target.value);
                    setSjForm({ ...sjForm, pelanggan_id: e.target.value, alamat_kirim: p?.alamat_kirim || '' });
                  }}
                >
                  <option value="">-- Pilih Pelanggan --</option>
                  {pelanggans.map(p => <option key={p.id} value={String(p.id)}>{p.nama}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">Alamat Kirim</label>
                <textarea 
                  className={`${inputClass} h-20 resize-none bg-slate-50`} 
                  readOnly 
                  value={sjForm.alamat_kirim}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">No. Sales Order</label>
                <select 
                  className={inputClass} 
                  value={sjForm.no_so} 
                  onChange={e => setSjForm({ ...sjForm, no_so: e.target.value })}
                >
                  <option value="">-- Pilih SO --</option>
                  {dataList.map(so => <option key={so.id} value={so.no_so}>{so.no_so}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">Gudang</label>
                <select 
                  className={inputClass} 
                  value={sjForm.gudang_id} 
                  onChange={e => setSjForm({ ...sjForm, gudang_id: e.target.value })}
                >
                  <option value="">-- Pilih Gudang --</option>
                  {gudangs.map(g => <option key={g.id} value={String(g.id)}>{g.nama_gudang}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-700">Tanggal Pengiriman</label>
                <input 
                  type="date" 
                  className={inputClass} 
                  value={sjForm.tanggal} 
                  onChange={e => setSjForm({ ...sjForm, tanggal: e.target.value })}
                />
              </div>
            </div>
            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => setShowSjModal(false)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-sm shadow-sm hover:bg-slate-50 transition-colors"
              >
                TUTUP / CLOSE
              </button>
              <button 
                onClick={() => {
                  navigate(`/surat-jalan?so=${sjForm.no_so}&pelanggan=${sjForm.pelanggan_id}&gudang=${sjForm.gudang_id}&tgl=${sjForm.tanggal}`);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-sm shadow-sm hover:bg-blue-700 transition-colors"
              >
                BUAT SURAT JALAN / CREATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah SO (Header Only) */}
      {showNewSoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-md shadow-xl flex flex-col overflow-hidden border border-slate-700 my-8">
            {/* Modal Header */}
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">Buat Sales Order Baru</h3>
                <p className="text-xs text-slate-300 mt-0.5">Isi detail dokumen header sebelum menambahkan rincian barang.</p>
              </div>
              <button onClick={() => setShowNewSoModal(false)} className="text-slate-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Kolom 1 */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">No. Sales Order</label>
                    <div className="flex gap-2">
                      <input type="text" className={`${inputClass} flex-1`} value={newSoForm.no_so || ''} onChange={e => setNewSoForm({...newSoForm, no_so: e.target.value})} />
                      <button 
                        className="px-3 py-1.5 text-xs font-bold border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm shadow-sm"
                        onClick={async () => {
                          const res = await salesOrderApi.autoNo();
                          setNewSoForm({...newSoForm, no_so: res.no_so});
                        }}
                      >
                        Auto No
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Tgl Sales Order</label>
                    <input type="date" className={inputClass} value={newSoForm.tgl_so || ''} onChange={e => setNewSoForm({...newSoForm, tgl_so: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Nama Pelanggan</label>
                    <select 
                      className={inputClass} 
                      value={newSoForm.pelanggan_id || ''} 
                      onChange={e => {
                        const pid = Number(e.target.value);
                        const p = pelanggans.find(x => x.id === pid);
                        setNewSoForm({...newSoForm, pelanggan_id: pid, alamat_kirim: p?.alamat_kirim || ''});
                      }}
                    >
                      <option value="">-- Pilih --</option>
                      {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Dikirim ke Alamat</label>
                    <textarea 
                      className={`${inputClass} h-20 resize-none`} 
                      value={newSoForm.alamat_kirim || ''} 
                      onChange={e => setNewSoForm({...newSoForm, alamat_kirim: e.target.value})}
                    />
                  </div>
                </div>
                {/* Kolom 2 */}
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-700">No. PO Pelanggan</label>
                      <input type="text" className={inputClass} value={newSoForm.no_po || ''} onChange={e => setNewSoForm({...newSoForm, no_po: e.target.value})} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-700">Tgl PO</label>
                      <input type="date" className={inputClass} value={newSoForm.tgl_po || ''} onChange={e => setNewSoForm({...newSoForm, tgl_po: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-700">Mata Uang</label>
                      <select className={inputClass} value={newSoForm.mata_uang_id || ''} onChange={e => setNewSoForm({...newSoForm, mata_uang_id: Number(e.target.value) || null})}>
                        <option value="">-- Pilih --</option>
                        {mataUangs.map(m => <option key={m.id} value={m.id}>{m.kode}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-700">Cara Pembayaran</label>
                      <select className={inputClass} value={newSoForm.pembayaran_id || ''} onChange={e => setNewSoForm({...newSoForm, pembayaran_id: Number(e.target.value) || null})}>
                        <option value="">-- Pilih --</option>
                        {pembayarans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Salesman</label>
                    <select className={inputClass} value={newSoForm.salesman_id || ''} onChange={e => setNewSoForm({...newSoForm, salesman_id: Number(e.target.value) || null})}>
                      <option value="">-- Pilih --</option>
                      {salesmans.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Tgl Kirim</label>
                    <input type="date" className={inputClass} value={newSoForm.tgl_kirim || ''} onChange={e => setNewSoForm({...newSoForm, tgl_kirim: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Dipesan Oleh</label>
                    <input type="text" className={inputClass} value={newSoForm.dipesan_oleh || ''} onChange={e => setNewSoForm({...newSoForm, dipesan_oleh: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => setShowNewSoModal(false)}
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-sm shadow-sm hover:bg-slate-50 transition-colors"
              >
                BATAL
              </button>
              <button 
                onClick={handleCreateNewSo}
                className="px-8 py-2.5 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-sm shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} /> BUAT SO
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SalesOrder;
