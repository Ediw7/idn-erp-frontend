import React, { useState, useEffect } from 'react';
import { FilePlus, Trash2, X, Printer, Search, Save, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext';
import { setupApi, PelangganData, GudangData, ItemData } from '../../setup/api';
import { salesOrderApi, SalesOrderData } from '../../sales-order/api';
import { useSignatureAutoFill } from '../../../hooks/useSignatureAutoFill';

const SuratJalan: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Master Data
  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [gudangs, setGudangs] = useState<GudangData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrderData[]>([]);

  const [periode, setPeriode] = useState('2026-06');

  const [showNewSjModal, setShowNewSjModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const emptyForm = {
    no_sj: '',
    tanggal: new Date().toISOString().split('T')[0],
    pelanggan_id: '',
    alamat_kirim: '',
    gudang_id: '',
    no_so: '',
    no_po: '',
    no_kendaraan: '',
    no_invoice: '',
    keterangan: '',
    penandatangan: 'Admin',
    jabatan: 'Logistik',
    lines: [],
    create_date: '',
    create_uid_name: '',
    write_date: '',
    write_uid_name: ''
  };

  const [form, setForm] = useState<any>(emptyForm);
  const [modalForm, setModalForm] = useState<any>(emptyForm);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const { signatureData } = useSignatureAutoFill('Surat Jalan');

  useEffect(() => {
    if (signatureData) {
      setForm((prev: any) => ({
        ...prev,
        penandatangan: signatureData.nama || prev.penandatangan,
        jabatan: signatureData.jabatan || prev.jabatan
      }));
    }
  }, [signatureData]);

  useEffect(() => {
    // Parse query params if navigating from Sales Order
    const params = new URLSearchParams(location.search);
    const so = params.get('so');
    const pelanggan = params.get('pelanggan');
    const gudang = params.get('gudang');
    const tgl = params.get('tgl');

    if (so) {
      setForm((prev: { tanggal: any; }) => ({
        ...prev,
        no_so: so,
        pelanggan_id: pelanggan || '',
        gudang_id: gudang || '',
        tanggal: tgl || prev.tanggal
      }));
    }
  }, [location.search]);

  const fetchInitialData = async () => {
    try {
      const [p, g, i, so] = await Promise.all([
        setupApi.getPelanggan(),
        setupApi.getGudang(),
        setupApi.getItem(),
        salesOrderApi.getAll()
      ]);
      setPelanggans(p || []);
      setGudangs(g || []);
      setItems(i || []);
      setSalesOrders(so || []);
    } catch (e) {
      toast.error('Gagal mengambil data referensi');
    }
  };

  const handlePelangganChange = (targetForm: any, setTargetForm: any, val: string) => {
    const p = pelanggans.find(x => String(x.id) === val);
    setTargetForm({ ...targetForm, pelanggan_id: val, alamat_kirim: p?.alamat_kirim || '' });
  };

  const handleSOChange = (targetForm: any, setTargetForm: any, val: string) => {
    const so = salesOrders.find(x => x.no_so === val);
    if (so) {
      setTargetForm({
        ...targetForm,
        no_so: val,
        pelanggan_id: String(so.pelanggan_id || ''),
        alamat_kirim: so.alamat_kirim || '',
        no_po: so.no_po || ''
      });
    } else {
      setTargetForm({ ...targetForm, no_so: val });
    }
  };

  const handleCreateSJ = () => {
    if (!modalForm.no_sj) {
      toast.error('No. Surat Jalan harus diisi!');
      return;
    }
    if (!modalForm.pelanggan_id) {
      toast.error('Pelanggan harus dipilih!');
      return;
    }

    // Move modal data to main form
    setForm({
      ...modalForm,
      lines: [{ item_id: '', kode: '', nama: '', satuan: '', kuantum: 1, keterangan: '' }],
      create_date: new Date().toISOString(),
      create_uid_name: user?.name || 'Unknown'
    });

    setShowNewSjModal(false);
    toast.success('Header Surat Jalan berhasil dibuat. Silakan isi detail barang.');
  };

  const handleSaveAll = () => {
    if (!form.no_sj) {
      toast.error('Harap isi header Surat Jalan terlebih dahulu!');
      return;
    }

    // Simulate SIMPAN to DB
    setForm({
      ...form,
      write_date: new Date().toISOString(),
      write_uid_name: user?.name || 'Unknown'
    });
    toast.success('Surat Jalan berhasil disimpan');
  };

  const calculateTotalQty = () => {
    return form.lines.reduce((acc: number, curr: any) => acc + (Number(curr.kuantum) || 0), 0);
  };

  const addLine = () => {
    setForm({
      ...form,
      lines: [...form.lines, { item_id: '', kode: '', nama: '', satuan: '', kuantum: 1, keterangan: '' }]
    });
  };

  const removeLine = (idx: number) => {
    const newLines = [...form.lines];
    newLines.splice(idx, 1);
    setForm({ ...form, lines: newLines });
  };

  const updateLine = (idx: number, field: string, value: any) => {
    const newLines = [...form.lines];
    const line = { ...newLines[idx], [field]: value };

    if (field === 'item_id' && value) {
      const item = items.find(x => String(x.id) === value);
      if (item) {
        line.kode = item.kode;
        line.nama = item.nama;
        line.satuan = item.satuan;
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
            <h2 className="text-lg font-semibold text-white">Surat Jalan</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-slate-300 font-medium">Pilih Periode:</span>
              <select
                value={periode}
                onChange={e => setPeriode(e.target.value)}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026-06">Juni 2026</option>
                <option value="2026-05">Mei 2026</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setModalForm({ ...emptyForm, no_sj: `SJ/00${Math.floor(Math.random() * 100)}/06/2026` });
                setShowNewSjModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
            >
              <FilePlus size={14} /> BUAT SJ OTOMATIS </button>
            <button
              onClick={() => {
                const reportName = 'Surat Jalan (A4 / Kwarto / 1/2 Kwarto) - Font 10';
                const url = form.no_sj
                  ? `/laporan?sj_number=${encodeURIComponent(form.no_sj)}&reportName=${encodeURIComponent(reportName)}`
                  : `/laporan?reportName=${encodeURIComponent(reportName)}`;
                navigate(url);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm"
            >
              <Printer size={14} /> CETAK
            </button>
            <button
              onClick={() => {
                if (!form.no_sj) {
                  toast.error('Harap buat atau pilih Surat Jalan terlebih dahulu! Data invoice akan ditarik otomatis dari Surat Jalan tersebut.');
                  return;
                }
                setShowInvoiceModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-green-600 border border-transparent hover:bg-green-500 transition-colors ml-2 rounded-sm shadow-sm"
            >
              <Send size={14} /> BUAT INVOICE </button>
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
                  <label className={labelClass}>No. Surat Jalan</label>
                  <div className="flex gap-1 flex-1">
                    <input type="text" className={`${inputClass} font-mono w-48 bg-slate-50`} readOnly value={form.no_sj || ''} />
                    <button className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm"><Search size={14} /></button>
                  </div>
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Tanggal</label>
                  <input type="date" className={`${inputClass} w-48`} value={form.tanggal || ''} onChange={e => setForm({ ...form, tanggal: e.target.value })} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Nama Pelanggan</label>
                  <div className="flex gap-1 flex-1">
                    <select className={inputClass} value={form.pelanggan_id || ''} onChange={e => handlePelangganChange(form, setForm, e.target.value)}>
                      <option value="">-- Pilih --</option>
                      {pelanggans.map(p => <option key={p.id} value={String(p.id)}>{p.nama}</option>)}
                    </select>
                    <button onClick={() => navigate('/setup/pelanggan')} className="px-3 py-1.5 font-bold border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm text-slate-600">+</button>
                  </div>
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Dikirim ke Alamat</label>
                  <textarea className={`${inputClass} h-20 resize-none bg-slate-50`} readOnly value={form.alamat_kirim || ''} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Gudang</label>
                  <select className={`${inputClass} w-64`} value={form.gudang_id || ''} onChange={e => setForm({ ...form, gudang_id: e.target.value })}>
                    <option value="">-- Pilih --</option>
                    {gudangs.map(g => <option key={g.id} value={String(g.id)}>{g.nama_gudang}</option>)}
                  </select>
                </div>
              </div>

              {/* Kolom Tengah */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-start">
                  <label className={labelClass}>No. Sales Order</label>
                  <div className="flex gap-1 flex-1">
                    <select className={`${inputClass} font-mono`} value={form.no_so || ''} onChange={e => handleSOChange(form, setForm, e.target.value)}>
                      <option value="">-- Pilih --</option>
                      {salesOrders.map(so => <option key={so.id} value={so.no_so}>{so.no_so}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>No. PO</label>
                  <input type="text" className={`${inputClass} w-full`} value={form.no_po || ''} onChange={e => setForm({ ...form, no_po: e.target.value })} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>No. Kendaraan</label>
                  <input type="text" className={`${inputClass} w-64`} value={form.no_kendaraan || ''} onChange={e => setForm({ ...form, no_kendaraan: e.target.value })} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>No. Invoice</label>
                  <input type="text" className={`${inputClass} w-64 bg-slate-50`} readOnly value={form.no_invoice || ''} placeholder="Terisi jika sudah di-invoice" />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Keterangan</label>
                  <textarea className={`${inputClass} h-20 resize-none`} value={form.keterangan || ''} onChange={e => setForm({ ...form, keterangan: e.target.value })} />
                </div>
              </div>

              {/* Kolom Kanan - Audit */}
              <div className="w-[280px] flex flex-col gap-4">
                <div className="border border-slate-300 p-3 relative mt-2 rounded-sm bg-white shadow-sm">
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

          {/* Tabel Detail Barang */}
          <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0">
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-700">Detail Barang Surat Jalan</h3>
            </div>

            <div className="overflow-x-auto min-h-[200px]">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-700 bg-slate-50 border-b border-slate-300">
                  <tr>
                    <th className="px-3 py-2 border-r border-slate-300 font-semibold w-12 text-center">No.</th>
                    <th className="px-3 py-2 border-r border-slate-300 font-semibold w-40">Kode Barang</th>
                    <th className="px-3 py-2 border-r border-slate-300 font-semibold min-w-[200px]">Nama Barang</th>
                    <th className="px-3 py-2 border-r border-slate-300 font-semibold w-24 text-center">Satuan</th>
                    <th className="px-3 py-2 border-r border-slate-300 font-semibold w-32 text-right">Kuantum</th>
                    <th className="px-3 py-2 border-r border-slate-300 font-semibold">Keterangan</th>
                    <th className="px-3 py-2 w-12 text-center font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {form.lines.map((line: any, idx: number) => (
                    <tr key={idx} className="hover:bg-blue-50 transition-colors border-b border-slate-200 group">
                      <td className="px-3 py-1.5 border-r border-slate-200 text-center font-medium">{idx + 1}</td>
                      <td className="px-3 py-1.5 border-r border-slate-200">
                        <select className="w-full px-2 py-1 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500 bg-white" value={line.item_id || ''} onChange={e => updateLine(idx, 'item_id', e.target.value)}>
                          <option value=""></option>
                          {items.map(i => <option key={i.id} value={String(i.id)}>{i.kode}</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-1.5 border-r border-slate-200">
                        <input type="text" className="w-full px-2 py-1 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500 bg-slate-50" readOnly value={line.nama || ''} />
                      </td>
                      <td className="px-3 py-1.5 border-r border-slate-200">
                        <input type="text" className="w-full px-2 py-1 text-sm text-center border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500 bg-slate-50" readOnly value={line.satuan || ''} />
                      </td>
                      <td className="px-3 py-1.5 border-r border-slate-200">
                        <input type="number" className="w-full px-2 py-1 text-sm text-right border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500" value={line.kuantum || ''} onChange={e => updateLine(idx, 'kuantum', Number(e.target.value))} />
                      </td>
                      <td className="px-3 py-1.5 border-r border-slate-200">
                        <input type="text" className="w-full px-2 py-1 text-sm border border-slate-300 rounded-sm focus:outline-none focus:border-slate-500" value={line.keterangan || ''} onChange={e => updateLine(idx, 'keterangan', e.target.value)} />
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        <button onClick={() => removeLine(idx)} className="text-red-500 hover:text-red-700 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 hover:bg-red-50" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-3 py-2 border-r border-slate-200 text-center">
                      <button onClick={addLine} className="w-6 h-6 mx-auto bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-sm flex items-center justify-center font-bold text-lg shadow-sm">+</button>
                    </td>
                    <td colSpan={6} className="px-4 py-2 text-sm text-slate-400 italic bg-slate-50">Klik tombol + untuk menambah baris barang pengiriman</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Totals Box (Right Aligned) */}
            <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col lg:flex-row gap-8 justify-between shrink-0">
              <div className="flex-1 max-w-xl">
                <div className="mt-2 flex flex-col gap-4">
                  {signatureData && signatureData.ttd_image && (
                    <div className="mb-2">
                      <img 
                        src={`data:image/png;base64,${signatureData.ttd_image}`} 
                        alt="Tanda Tangan" 
                        className="h-16 w-auto object-contain border-b border-gray-300 mb-2" 
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Tanda Tangan</label>
                      <input 
                        type="text" 
                        className="w-full h-10 px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 text-sm" 
                        value={form.penandatangan || ''} 
                        onChange={e => setForm({...form, penandatangan: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Jabatan</label>
                      <input 
                        type="text" 
                        className="w-full h-10 px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-blue-500 text-sm" 
                        value={form.jabatan || ''} 
                        onChange={e => setForm({...form, jabatan: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[420px] flex flex-col">
                <div className="flex justify-end gap-6 items-center mb-6 mt-4 lg:mt-0">
                  <div className="flex items-center gap-4 bg-white border border-slate-300 px-4 py-2 rounded-sm shadow-sm">
                    <span className="text-sm font-bold text-slate-700">Total Kuantum :</span>
                    <span className="text-lg font-mono font-bold text-blue-700">{calculateTotalQty()}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSaveAll} className="px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 rounded-sm shadow-md min-w-[250px]">
                    <Save size={16} /> SIMPAN SURAT JALAN
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah SJ (Header Only) */}
      {showNewSjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-md shadow-xl flex flex-col overflow-hidden border border-slate-700 my-8">
            {/* Modal Header */}
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-white font-semibold">Buat Surat Jalan Baru</h3>
                <p className="text-xs text-slate-300 mt-0.5">Isi detail dokumen header sebelum menambahkan pengiriman barang.</p>
              </div>
              <button onClick={() => setShowNewSjModal(false)} className="text-slate-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Kolom 1 */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">No. Surat Jalan</label>
                    <div className="flex gap-2">
                      <input type="text" className={`${inputClass} flex-1`} value={modalForm.no_sj || ''} onChange={e => setModalForm({ ...modalForm, no_sj: e.target.value })} />
                      <button
                        className="px-3 py-1.5 text-xs font-bold border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm shadow-sm"
                        onClick={() => {
                          setModalForm({ ...modalForm, no_sj: `SJ/00${Math.floor(Math.random() * 100)}/06/2026` });
                        }}
                      >
                        Auto No
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Tanggal Pengiriman</label>
                    <input type="date" className={inputClass} value={modalForm.tanggal || ''} onChange={e => setModalForm({ ...modalForm, tanggal: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Nama Pelanggan</label>
                    <select
                      className={inputClass}
                      value={modalForm.pelanggan_id || ''}
                      onChange={e => handlePelangganChange(modalForm, setModalForm, e.target.value)}
                    >
                      <option value="">-- Pilih --</option>
                      {pelanggans.map(p => <option key={p.id} value={String(p.id)}>{p.nama}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Dikirim ke Alamat</label>
                    <textarea
                      className={`${inputClass} h-20 resize-none bg-slate-50`}
                      readOnly
                      value={modalForm.alamat_kirim || ''}
                    />
                  </div>
                </div>
                {/* Kolom 2 */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Gudang</label>
                    <select className={inputClass} value={modalForm.gudang_id || ''} onChange={e => setModalForm({ ...modalForm, gudang_id: e.target.value })}>
                      <option value="">-- Pilih Gudang --</option>
                      {gudangs.map(g => <option key={g.id} value={String(g.id)}>{g.nama_gudang}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-700">No. Sales Order</label>
                      <select className={inputClass} value={modalForm.no_so || ''} onChange={e => handleSOChange(modalForm, setModalForm, e.target.value)}>
                        <option value="">-- Pilih SO --</option>
                        {salesOrders.map(so => <option key={so.id} value={so.no_so}>{so.no_so}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-700">No. PO Pelanggan</label>
                      <input type="text" className={inputClass} value={modalForm.no_po || ''} onChange={e => setModalForm({ ...modalForm, no_po: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">No. Kendaraan</label>
                    <input type="text" className={inputClass} value={modalForm.no_kendaraan || ''} onChange={e => setModalForm({ ...modalForm, no_kendaraan: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Keterangan</label>
                    <input type="text" className={inputClass} value={modalForm.keterangan || ''} onChange={e => setModalForm({ ...modalForm, keterangan: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowNewSjModal(false)}
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-sm shadow-sm hover:bg-slate-50 transition-colors"
              > TUTUP </button>
              <button
                onClick={handleCreateSJ}
                className="px-8 py-2.5 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-sm shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} /> BUAT BARU </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Buat Invoice */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-xl w-full max-w-lg flex flex-col overflow-hidden border border-slate-700">
            {/* Modal Header */}
            <div className="bg-slate-800 px-5 py-3 flex justify-between items-center text-white">
              <h2 className="text-sm font-bold">Generate Invoice</h2>
              <button onClick={() => setShowInvoiceModal(false)} className="hover:text-slate-300 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-4">
              <div className="bg-green-50 text-green-800 text-xs p-3 rounded-sm border border-green-200 font-medium mb-2">
                Proses ini akan mengonversi Surat Jalan saat ini menjadi Draft Invoice.
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Nama Pelanggan</label>
                <select className={`${inputClass} bg-slate-50`} disabled value={form.pelanggan_id || ''}>
                  <option value="">-- Pilih --</option>
                  {pelanggans.map(p => <option key={p.id} value={String(p.id)}>{p.nama}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Alamat Kirim</label>
                <textarea className={`${inputClass} bg-slate-50 h-16 resize-none`} readOnly value={form.alamat_kirim || ''} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">No. Surat Jalan</label>
                <select className={`${inputClass} bg-slate-50 font-mono`} disabled value={form.no_sj || ''}>
                  <option value={form.no_sj}>{form.no_sj}</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Gudang</label>
                <select className={inputClass} value={form.gudang_id || ''} onChange={() => { }}>
                  <option value="">-- Pilih --</option>
                  {gudangs.map(g => <option key={g.id} value={String(g.id)}>{g.nama_gudang}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Tanggal</label>
                <input type="date" className={inputClass} value={new Date().toISOString().split('T')[0]} readOnly />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Pilih Jenis Invoice</label>
                <select className={inputClass} >
                  <option>Dengan PPN 11%</option>
                  <option>Tanpa PPN (0%)</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-6 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-semibold rounded-sm hover:bg-slate-50 transition-colors"> TUTUP </button>
              <button
                onClick={() => {
                  toast.success('Draft Invoice berhasil digenerate!');
                  navigate('/invoice');
                }}
                className="px-8 py-2 bg-green-600 text-white text-sm font-bold rounded-sm hover:bg-green-500 shadow-sm transition-colors flex items-center gap-2">
                <Send size={16} /> BUAT BARU </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuratJalan;
