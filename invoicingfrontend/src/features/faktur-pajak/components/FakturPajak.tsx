import React, { useState, useEffect } from 'react';
import { FilePlus, Printer, Save, Search, RefreshCcw, FileBox, Trash2, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext';
import { setupApi, PelangganData } from '../../setup/api';
import { PenjatahanNSFPModal } from '../../setup/components/PenjatahanNSFPModal';
import { SetupPelangganModal } from '../../setup/components/SetupPelangganModal';
import { useSignatureAutoFill } from '../../../hooks/useSignatureAutoFill';

const FakturPajak: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const emptyForm = {
    penomoran: '',
    no_fp: '',
    tgl_fp: new Date().toISOString().split('T')[0],
    pembeli_id: '',
    alamat: '',
    npwp: '',
    fp_diganti: '',
    tgl_fp_diganti: '',
    jenis_transaksi: '01 - Kepada Bukan Pemungut PPN',
    jenis_status: 'Normal',
    no_invoice: '',
    tarif_ppn: 11,
    mata_uang: 'IDR',
    kurs_pajak: 1,
    penandatangan: 'Admin',
    jabatan: 'Finance',
    ket_tambahan: '',
    lines: [],
    potongan: 0,
    uang_muka: 0,
    create_date: '',
    create_uid_name: '',
    write_date: '',
    write_uid_name: ''
  };

  const [form, setForm] = useState<any>(emptyForm);
  const [showPenggantiModal, setShowPenggantiModal] = useState(false);
  const [showEFakturModal, setShowEFakturModal] = useState(false);
  
  const [eFakturForm, setEFakturForm] = useState({
    jenisPajak: 'Keluaran',
    tahun: new Date().getFullYear().toString(),
    bulan: (new Date().getMonth() + 1).toString(),
    noAwal: '',
    noAkhir: ''
  });
  
  const [showNsfpModal, setShowNsfpModal] = useState(false);
  const [showPelangganModal, setShowPelangganModal] = useState(false);

  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [fakturPajakSetups, setFakturPajakSetups] = useState<any[]>([]);
  const [oldFakturPajaks] = useState<any[]>([]); // Placeholder for old FPs
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [pelRes, fpRes] = await Promise.all([
        setupApi.getPelanggan().catch(() => []),
        setupApi.getFakturPajak().catch(() => [])
      ]);
      setPelanggans(pelRes);
      setFakturPajakSetups(fpRes);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (location.state) {
      const { action, no_invoice, pembeli_id, alamat, npwp, lines } = location.state;
      setForm((prev: any) => ({
        ...prev,
        jenis_status: action === 'pengganti' ? 'Pengganti' : 'Normal',
        no_invoice: no_invoice || '',
        pembeli_id: pembeli_id || '',
        alamat: alamat || '',
        npwp: npwp || '',
        lines: lines || [] }));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const { signatureData } = useSignatureAutoFill('Faktur Pajak');

  useEffect(() => {
    if (signatureData) {
      setForm((prev: any) => ({
        ...prev,
        penandatangan: signatureData.nama || prev.penandatangan,
        jabatan: signatureData.jabatan || prev.jabatan
      }));
    }
  }, [signatureData]);

  const handlePembeliChange = (id: number | '') => {
    const p = pelanggans.find(x => x.id === id);
    setForm({
      ...form,
      pembeli_id: id,
      alamat: p?.alamat_wp || p?.alamat || '',
      npwp: p?.npwp || ''
    });
  };

  const handleSave = () => {
    if (!form.no_fp) {
      toast.error('No. Faktur Pajak harus diisi!');
      return;
    }
    setForm({
      ...form,
      write_date: new Date().toISOString(),
      write_uid_name: user?.name || 'Unknown',
      create_date: form.create_date || new Date().toISOString(),
      create_uid_name: form.create_uid_name || user?.name || 'Unknown'
    });
    toast.success('Faktur Pajak berhasil disimpan!');
  };

  const calculateTotal = () => {
    const totalHargaJual = form.lines.reduce((sum: number, line: any) => sum + (Number(line.harga_jual) || 0), 0);
    const dpp = totalHargaJual - (Number(form.potongan) || 0) - (Number(form.uang_muka) || 0);
    const ppn = Math.floor(dpp * (Number(form.tarif_ppn) / 100));
    return { totalHargaJual, dpp, ppn };
  };

  const totals = calculateTotal();

  const inputClass = "w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-colors";
  const labelClass = "block text-xs font-semibold text-gray-700 mb-1";
  const handleDownloadEFaktur = () => {
    const { jenisPajak, tahun, bulan } = eFakturForm;
    const bulanPad = bulan.padStart(2, '0');
    const filename = `Pajak_${jenisPajak}_${tahun}${bulanPad}.csv`;
    
    // BUAT BARU dummy CSV content
    const csvContent = `"FK","KD_JENIS_TRANSAKSI","FG_PENGGANTI","NOMOR_FAKTUR","MASA_PAJAK","TAHUN_PAJAK","TANGGAL_FAKTUR","NPWP","NAMA","ALAMAT_LENGKAP","JUMLAH_DPP","JUMLAH_PPN","JUMLAH_PPNBM","ID_KETERANGAN_TAMBAHAN","FG_UANG_MUKA","UANG_MUKA_DPP","UANG_MUKA_PPN","UANG_MUKA_PPNBM","REFERENSI"\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`File e-Faktur ${filename} berhasil diunduh!`);
    setShowEFakturModal(false);
  };

  const btnClass = "px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2";

  return (
    <div className="bg-slate-50 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-5 border-b border-slate-700 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white mb-2">Faktur Pajak</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300 font-medium">Pilih Periode:</span>
              <select className="h-9 px-3 text-sm bg-slate-700 text-white border border-slate-600 rounded-md outline-none focus:border-slate-400 transition-colors">
                <option>Juni 2026</option>
                <option>Mei 2026</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className={`${btnClass} bg-white text-slate-800 border border-gray-300 hover:bg-slate-100`}>
             <FilePlus size={16} /> + TAMBAH FP
          </button>
          <button 
            onClick={() => navigate(form.no_fp ? `/laporan?fp_number=${encodeURIComponent(form.no_fp)}&reportName=${encodeURIComponent('Faktur Pajak Hal 1 & 2 (A4)')}` : '/laporan?reportName=Faktur Pajak Hal 1 & 2 (A4)')} 
            className={`${btnClass} bg-white text-slate-800 border border-gray-300 hover:bg-slate-100`}
          >
             <Printer size={16} /> CETAK
          </button>
          <button onClick={() => setShowPenggantiModal(true)} className={`${btnClass} bg-green-600 text-white hover:bg-green-700`}>
             <RefreshCcw size={16} /> BUAT FP PENGGANTI </button>
          <button onClick={() => setShowEFakturModal(true)} className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700`}>
             <FileBox size={16} /> E-FAKTUR
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Form Informasi Umum */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 shrink-0">
          <h3 className="text-lg font-bold text-slate-800 mb-6 pb-3 border-b border-gray-200">Informasi Umum</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Kolom Kiri */}
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Penomoran</label>
                <div className="flex items-center gap-2 w-full">
                  <select className={inputClass} value={form.penomoran || ''} onChange={e => setForm({...form, penomoran: e.target.value})}>
                    <option value="">{loadingData ? 'Loading...' : '-- Pilih Rentang Penomoran --'}</option>
                    {fakturPajakSetups.map(fp => <option key={fp.id} value={fp.id}>{fp.no_seri_awal} s/d {fp.no_seri_akhir}</option>)}
                  </select>
                  <button className="px-3 h-9 text-xs font-bold border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-600 transition-colors shrink-0 whitespace-nowrap shadow-sm" onClick={() => setShowNsfpModal(true)}>+ NSFP</button>
                </div>
              </div>
              <div>
                <label className={labelClass}>No. Faktur Pajak</label>
                <div className="flex gap-2 w-full">
                  <input type="text" className={`${inputClass} font-mono`} value={form.no_fp || ''} onChange={e => setForm({...form, no_fp: e.target.value})} />
                  <button className="px-3 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"><Search size={16} className="text-gray-600" /></button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Tgl Faktur Pajak</label>
                <input type="date" className={inputClass} value={form.tgl_fp || ''} onChange={e => setForm({...form, tgl_fp: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Nama Pembeli</label>
                <div className="flex gap-2 w-full">
                  <select className={inputClass} value={form.pembeli_id || ''} onChange={e => handlePembeliChange(e.target.value ? Number(e.target.value) : '')}>
                    <option value="">{loadingData ? 'Loading data...' : '-- Pilih Pembeli --'}</option>
                    {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama} - {p.alamat}</option>)}
                  </select>
                  <button className="px-3 font-bold border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" onClick={() => setShowPelangganModal(true)}>+</button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Alamat Pembeli</label>
                <textarea className={`${inputClass} h-20 resize-none bg-slate-50`} readOnly value={form.alamat || ''} />
              </div>
              <div>
                <label className={labelClass}>NPWP</label>
                <input type="text" className={`${inputClass} font-mono`} value={form.npwp || ''} onChange={e => setForm({...form, npwp: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>FP Yang Diganti</label>
                <div className="flex items-center gap-2 w-full">
                  <input type="text" className={`${inputClass} flex-1 ${form.jenis_status === 'Normal' ? 'bg-slate-100 cursor-not-allowed' : ''}`} disabled={form.jenis_status === 'Normal'} value={form.fp_diganti || ''} onChange={e => setForm({...form, fp_diganti: e.target.value})} placeholder="No. FP Lama" />
                  <input type="date" className={`${inputClass} w-40 ${form.jenis_status === 'Normal' ? 'bg-slate-100 cursor-not-allowed' : ''}`} disabled={form.jenis_status === 'Normal'} value={form.tgl_fp_diganti || ''} onChange={e => setForm({...form, tgl_fp_diganti: e.target.value})} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Jenis Transaksi</label>
                <select className={inputClass} value={form.jenis_transaksi || ''} onChange={e => setForm({...form, jenis_transaksi: e.target.value})}>
                  <option value="01 - Kepada Bukan Pemungut PPN">01 - Kepada Bukan Pemungut PPN</option>
                  <option value="02 - Kepada Pemungut Bendaharawan">02 - Kepada Pemungut Bendaharawan</option>
                  <option value="03 - Kepada Pemungut Selain Bendaharawan">03 - Kepada Pemungut Selain Bendaharawan</option>
                </select>
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Jenis Status</label>
                <select className={inputClass} value={form.jenis_status || ''} onChange={e => setForm({...form, jenis_status: e.target.value})}>
                  <option value="Normal">Normal</option>
                  <option value="Pengganti">Pengganti</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>No. Invoice Ref.</label>
                <input type="text" className={`${inputClass} bg-slate-50`} readOnly value={form.no_invoice || ''} />
              </div>
              <div>
                <label className={labelClass}>Tarif PPN (%)</label>
                <input type="number" className={`${inputClass} w-24 text-right`} value={form.tarif_ppn || 11} onChange={e => setForm({...form, tarif_ppn: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Kurs Pajak</label>
                <div className="flex items-center gap-2 w-full">
                  <select className={`${inputClass} w-24`} value={form.mata_uang || 'IDR'} onChange={e => setForm({...form, mata_uang: e.target.value})}>
                    <option value="IDR">IDR</option>
                    <option value="USD">USD</option>
                  </select>
                  <input type="number" className={`${inputClass} flex-1 text-right`} value={form.kurs_pajak || 1} onChange={e => setForm({...form, kurs_pajak: e.target.value})} />
                </div>
              </div>
              {signatureData && signatureData.ttd_image && (
                <div className="mb-2">
                  <img 
                    src={`data:image/png;base64,${signatureData.ttd_image}`} 
                    alt="Tanda Tangan" 
                    className="h-16 w-auto object-contain border-b border-gray-300 mb-2" 
                  />
                </div>
              )}
              <div>
                <label className={labelClass}>Tanda Tangan</label>
                <input type="text" className={inputClass} value={form.penandatangan || ''} onChange={e => setForm({...form, penandatangan: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Jabatan</label>
                <input type="text" className={inputClass} value={form.jabatan || ''} onChange={e => setForm({...form, jabatan: e.target.value})} />
              </div>
              <div>
                <label className={labelClass}>Ket Tambahan</label>
                <textarea className={`${inputClass} h-20 resize-none`} value={form.ket_tambahan || ''} onChange={e => setForm({...form, ket_tambahan: e.target.value})} />
              </div>
              
              <div className="flex flex-col gap-3 mt-auto pt-4">
                <div className="border border-gray-100 p-3 relative rounded-md bg-gray-50 shadow-sm">
                  <span className="absolute -top-2.5 left-3 bg-gray-50 px-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wide">Record Created</span>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-100 bg-white font-mono text-xs rounded-md" readOnly value={form.create_date ? new Date(form.create_date).toLocaleString('id-ID') : '-'} />
                    <input type="text" className="w-24 h-8 px-2 border border-gray-100 bg-white text-center text-xs rounded-md" readOnly value={form.create_uid_name || user?.name || '-'} />
                  </div>
                </div>
                <div className="border border-gray-100 p-3 relative rounded-md bg-gray-50 shadow-sm">
                  <span className="absolute -top-2.5 left-3 bg-gray-50 px-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wide">Record Modified</span>
                  <div className="flex items-center gap-2 mt-2">
                    <input type="text" className="w-full h-8 px-2 border border-gray-100 bg-white font-mono text-xs rounded-md" readOnly value={form.write_date ? new Date(form.write_date).toLocaleString('id-ID') : '-'} />
                    <input type="text" className="w-24 h-8 px-2 border border-gray-100 bg-white text-center text-xs rounded-md" readOnly value={form.write_uid_name || user?.name || '-'} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabel Detail Barang */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col shrink-0 overflow-hidden">
          <div className="bg-slate-100 px-6 py-3 border-b border-gray-300">
             <h4 className="text-sm font-bold text-slate-800">Detail Barang Kena Pajak</h4>
          </div>
          <div className="overflow-x-auto min-h-[200px] p-4">
            <table className="w-full text-sm whitespace-nowrap border border-gray-200 rounded-md overflow-hidden">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase border-b border-gray-300">
                  <th className="w-12 px-3 py-3 text-center border-r border-gray-200">No.</th>
                  <th className="w-48 px-3 py-3 text-left border-r border-gray-200">Kode Barang</th>
                  <th className="px-3 py-3 text-left border-r border-gray-200">Nama BKP/JKP</th>
                  <th className="w-24 px-3 py-3 text-center border-r border-gray-200">Satuan</th>
                  <th className="w-24 px-3 py-3 text-center border-r border-gray-200">Kuantum</th>
                  <th className="w-32 px-3 py-3 text-right border-r border-gray-200">Harga Satuan</th>
                  <th className="w-32 px-3 py-3 text-right border-r border-gray-200">Harga Jual</th>
                  <th className="w-12 px-3 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {form.lines.map((line: any, idx: number) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors group border-b border-gray-200">
                    <td className="px-3 py-2 text-center border-r border-gray-200 font-medium text-slate-600">{idx + 1}</td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      <input type="text" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500 bg-slate-50" readOnly value={line.kode || ''} />
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      <input type="text" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500 bg-slate-50" readOnly value={line.nama || ''} />
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      <input type="text" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm bg-slate-50 text-center focus:outline-none" readOnly value={line.satuan || ''} />
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      <input type="number" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm text-right focus:outline-none focus:border-blue-500 bg-slate-50" readOnly value={line.kuantum || ''} />
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      <input type="number" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm text-right focus:outline-none focus:border-blue-500 bg-slate-50" readOnly value={line.harga || ''} />
                    </td>
                    <td className="px-3 py-2 border-r border-gray-200">
                      <input type="text" className="w-full h-8 px-2 text-xs border border-gray-300 rounded-sm text-right bg-slate-100 font-semibold text-slate-800" readOnly value={line.harga_jual || ''} />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button className="text-red-500 hover:text-red-700 p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100 hover:bg-red-50" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {form.lines.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500 italic bg-slate-50">Belum ada barang kena pajak.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer & Kalkulasi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 shrink-0">
          
          {/* Kiri: Tabel Tarif */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-4">
             <h4 className="text-sm font-bold text-slate-800 border-b border-gray-200 pb-2">Tabel Tarif PPn BM</h4>
             <table className="w-full text-sm border border-gray-200 rounded-md overflow-hidden">
               <thead className="bg-slate-50 text-slate-600 text-xs font-semibold uppercase">
                 <tr>
                   <th className="px-3 py-2 border-r border-b border-gray-200">Tarif (%)</th>
                   <th className="px-3 py-2 border-r border-b border-gray-200">DPP</th>
                   <th className="px-3 py-2 border-b border-gray-200">PPn BM</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-200">
                 <tr className="border-b border-gray-200">
                   <td className="px-3 py-2 border-r border-gray-200">
                     <input type="number" className="w-full h-8 px-2 text-right border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500 text-xs" />
                   </td>
                   <td className="px-3 py-2 border-r border-gray-200">
                     <input type="number" className="w-full h-8 px-2 text-right border border-gray-300 rounded-sm focus:outline-none focus:border-blue-500 text-xs" />
                   </td>
                   <td className="px-3 py-2 border-gray-200">
                     <input type="number" className="w-full h-8 px-2 text-right border border-gray-300 rounded-sm bg-slate-50 text-xs font-semibold" readOnly />
                   </td>
                 </tr>
               </tbody>
             </table>
          </div>

          {/* Kanan: Summary Read-only Kalkulasi */}
          <div className="bg-slate-50 border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col gap-4">
            <h4 className="text-lg font-bold text-slate-800 border-b border-gray-200 pb-3 mb-2">Kalkulasi Pajak</h4>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Harga Jual / Penggantian / Uang Muka</span>
              <input type="text" className={`${inputClass} w-48 text-right bg-white font-semibold text-slate-800`} readOnly value={totals.totalHargaJual} />
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Dikurangi Potongan Harga</span>
              <input type="number" className={`${inputClass} w-48 text-right bg-white`} value={form.potongan || ''} onChange={e => setForm({...form, potongan: e.target.value})} />
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">Dikurangi Uang Muka yang telah diterima</span>
              <input type="number" className={`${inputClass} w-48 text-right bg-white`} value={form.uang_muka || ''} onChange={e => setForm({...form, uang_muka: e.target.value})} />
            </div>
            <div className="flex justify-between items-center mb-3 pt-4 border-t border-gray-300">
              <span className="text-sm font-bold text-slate-800">Dasar Pengenaan Pajak (DPP)</span>
              <input type="text" className={`${inputClass} w-48 text-right bg-blue-50 font-bold text-blue-800 border-blue-200`} readOnly value={totals.dpp} />
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-slate-800">PPN = {form.tarif_ppn}% x Dasar Pengenaan Pajak</span>
              <input type="text" className="w-48 h-12 px-4 border border-gray-400 rounded-md text-right bg-slate-800 text-white font-bold text-lg shadow-inner outline-none" readOnly value={totals.ppn} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 shrink-0 pb-6 mt-2">
          <button className={`${btnClass} bg-white text-slate-700 border border-gray-300 hover:bg-slate-50 px-8 py-3 text-sm`}>
             BATAL
          </button>
          <button onClick={handleSave} className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700 px-10 py-3 text-sm shadow-md`}>
            <Save size={18} /> SIMPAN FAKTUR PAJAK
          </button>
        </div>
      </div>

      {/* Modal BUAT FP PENGGANTI */}
      {showPenggantiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
              <h3 className="text-white font-bold text-lg">BUAT BARU Faktur Pajak Pengganti</h3>
              <button onClick={() => setShowPenggantiModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className={labelClass}>Nama Pembeli</label>
                <select className={inputClass}>
                  <option value="">{loadingData ? 'Loading data...' : '-- Pilih Pembeli --'}</option>
                  {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama} - {p.alamat}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>No. Faktur Pajak Yang Lama</label>
                <select className={inputClass}>
                  <option value="">{loadingData ? 'Loading...' : '-- Pilih FP Lama --'}</option>
                  {oldFakturPajaks.map((fp, idx) => <option key={idx} value={fp.no_fp}>{fp.no_fp}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Tanggal Faktur Pajak Pengganti</label>
                <input type="date" className={inputClass} />
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowPenggantiModal(false)} className={`${btnClass} bg-white text-slate-700 border border-gray-300 hover:bg-slate-50`}> BATAL </button>
              <button onClick={() => {
                setShowPenggantiModal(false);
                toast.success('Faktur Pajak Pengganti berhasil dibuat');
              }} className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700`}> BUAT BARU </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ekspor e-Faktur */}
      {showEFakturModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
              <h3 className="text-white font-bold text-lg">Ekspor Data ke Program e-Faktur</h3>
              <button onClick={() => setShowEFakturModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-semibold text-gray-700 text-right">Jenis Pajak</label>
                <select className={`${inputClass} w-2/3`} value={eFakturForm.jenisPajak} onChange={e => setEFakturForm({...eFakturForm, jenisPajak: e.target.value})}>
                  <option value="Keluaran">Pajak Keluaran</option>
                  <option value="Masukan">Pajak Masukan</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-semibold text-gray-700 text-right">Tahun</label>
                <input type="number" className={`${inputClass} w-2/3`} value={eFakturForm.tahun} onChange={e => setEFakturForm({...eFakturForm, tahun: e.target.value})} />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-semibold text-gray-700 text-right">Bulan</label>
                <select className={`${inputClass} w-2/3`} value={eFakturForm.bulan} onChange={e => setEFakturForm({...eFakturForm, bulan: e.target.value})}>
                  <option value="1">Januari</option>
                  <option value="2">Februari</option>
                  <option value="3">Maret</option>
                  <option value="4">April</option>
                  <option value="5">Mei</option>
                  <option value="6">Juni</option>
                  <option value="7">Juli</option>
                  <option value="8">Agustus</option>
                  <option value="9">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-semibold text-gray-700 text-right">Pembetulan</label>
                <input type="text" className={`${inputClass} w-2/3 bg-slate-100 cursor-not-allowed`} readOnly value="0" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-semibold text-gray-700 text-right">No FP Awal</label>
                <div className="w-2/3 flex items-center gap-2">
                  <input type="text" className={inputClass} value={eFakturForm.noAwal} onChange={e => setEFakturForm({...eFakturForm, noAwal: e.target.value})} />
                  <span className="text-xs text-gray-500 whitespace-nowrap">13 digit terakhir</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-semibold text-gray-700 text-right">No FP Akhir</label>
                <div className="w-2/3 flex items-center gap-2">
                  <input type="text" className={inputClass} value={eFakturForm.noAkhir} onChange={e => setEFakturForm({...eFakturForm, noAkhir: e.target.value})} />
                  <span className="text-xs text-gray-500 whitespace-nowrap">13 digit terakhir</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-semibold text-gray-700 text-right">Nama File</label>
                <div className="w-2/3 flex items-center gap-2">
                  <input type="text" className={`${inputClass} flex-1 bg-slate-100 font-mono text-blue-800`} readOnly value={`Pajak_${eFakturForm.jenisPajak}_${eFakturForm.tahun}${eFakturForm.bulan.padStart(2, '0')}.csv`} />
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowEFakturModal(false)} className={`${btnClass} bg-white text-slate-700 border border-gray-300 hover:bg-slate-50`}> BATAL </button>
              <button onClick={handleDownloadEFaktur} className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700`}> PROSES & UNDUH </button>
            </div>
          </div>
        </div>
      )}
      
      <PenjatahanNSFPModal 
        isOpen={showNsfpModal} 
        onClose={() => setShowNsfpModal(false)} 
        onSaved={fetchData} 
      />
      <SetupPelangganModal 
        isOpen={showPelangganModal} 
        onClose={() => setShowPelangganModal(false)} 
        onSaved={fetchData} 
      />
    </div>
  );
};

export default FakturPajak;
