import React, { useState, useEffect } from 'react';
import { FilePlus, Printer, Trash2, Save, X, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setupApi, PelangganData } from '../../setup/api';

// Fungsi merubah angka menjadi teks terbilang (Bahasa Indonesia)
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

const formatTerbilang = (angka: number) => {
  if (!angka) return '';
  let result = angkaMenjadiTerbilang(Math.abs(angka)).trim() + ' Rupiah';
  return result.replace(/\s+/g, ' ');
};

const Kwitansi: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const emptyForm = {
    no_kwitansi: '',
    tgl_kwitansi: TAMBAH BARU Date().toISOString().split('T')[0],
    no_invoice: '',
    pembeli_id: '',
    alamat: '',
    mata_uang: 'IDR',
    jumlah: 0,
    terbilang: '',
    untuk_pembayaran: '',
    keterangan_footer: 'BCA A/C 1234567890\nA/N PT. EDI Accounting',
    penandatangan: 'Admin',
    jabatan: 'Finance',
  };

  const [form, setForm] = useState<any>(emptyForm);
  const [showNewModal, setShowNewModal] = useState(false);
  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]); // Placeholder for fetched invoices
  const [loadingData, setLoadingData] = useState(true);

  // Tangkap data dari navigasi (misalnya dari halaman Invoice)
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

    if (location.state) {
      const { no_invoice, pembeli_id, alamat, jumlah, keterangan } = location.state;
      setForm((prev: any) => ({
        ...prev,
        no_invoice: no_invoice || '',
        pembeli_id: pembeli_id || '',
        alamat: alamat || '',
        jumlah: jumlah || 0,
        terbilang: formatTerbilang(jumlah || 0),
        untuk_pembayaran: keterangan || '',
      }));
      // Optional: membersihkan state dari location agar tidak me-reset jika refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);

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
    toast.success('Kwitansi berhasil disimpan!');
  };

  const inputClass = "w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-colors";
  const labelClass = "block text-xs md:text-sm font-semibold text-gray-700 mb-1";
  const btnClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors shadow-sm flex items-center justify-center gap-2";

  return (
    <div className="bg-slate-50 flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-5 border-b border-slate-700 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 shrink-0">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white mb-2">Kwitansi (Official Receipt)</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300 font-medium">Pilih Periode:</span>
              <select className="h-9 px-3 text-sm bg-slate-700 text-white border border-slate-600 rounded-md outline-none focus:border-slate-400 transition-colors">
                <option>Juni 2026</option>
                <option>Mei 2026</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300 font-medium">Jenis Kwitansi:</span>
              <select className="h-9 px-3 text-sm bg-slate-700 text-white border border-slate-600 rounded-md outline-none focus:border-slate-400 transition-colors">
                <option>VAT</option>
                <option>Non-VAT</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowNewModal(true)} 
            className={`${btnClass} bg-white text-slate-800 hover:bg-slate-100`}
          >
             <FilePlus size={16} /> + TAMBAH KWITANSI
          </button>
          <button 
            onClick={() => navigate(form.no_kwitansi ? `/laporan?kwitansi_number=${encodeURIComponent(form.no_kwitansi)}&reportName=${encodeURIComponent('Kwitansi (1/2 Kwarto)')}` : '/laporan?reportName=Kwitansi (1/2 Kwarto)')} 
            className={`${btnClass} bg-white text-slate-800 hover:bg-slate-100`}
          >
             <Printer size={16} /> CETAK
          </button>
          <button 
            onClick={() => {
              if (window.confirm('Hapus Kwitansi ini?')) {
                setForm(emptyForm);
                toast.success('Kwitansi dihapus');
              }
            }}
            className={`${btnClass} border border-red-500 text-red-600 hover:bg-red-50 bg-white shadow-none`}
          >
             <Trash2 size={16} /> HAPUS
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow-sm p-8">
          
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h3 className="text-2xl font-bold text-slate-800 text-center uppercase tracking-wider">Kwitansi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Baris 1: No Kwitansi & Tgl */}
            <div>
              <label className={labelClass}>No. Kwitansi</label>
              <div className="flex gap-2 w-full">
                <input type="text" className={`${inputClass} font-mono bg-blue-50/50`} value={form.no_kwitansi || ''} onChange={e => setForm({...form, no_kwitansi: e.target.value})} />
                <button 
                  onClick={() => setForm({...form, no_kwitansi: `KT/00${Math.floor(Math.random()*100)}/06/2026`})}
                  className="px-4 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md font-bold text-sm transition-colors text-slate-700 whitespace-nowrap"
                >
                  Auto No
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Tgl Kwitansi</label>
              <input type="date" className={inputClass} value={form.tgl_kwitansi || ''} onChange={e => setForm({...form, tgl_kwitansi: e.target.value})} />
            </div>

            {/* Baris 2: No Invoice & Pelanggan */}
            <div>
              <label className={labelClass}>No. Invoice Ref.</label>
              <div className="flex gap-2 w-full">
                <select className={inputClass} value={form.no_invoice || ''} onChange={e => setForm({...form, no_invoice: e.target.value})}>
                  <option value="">{loadingData ? 'Loading...' : '-- Pilih Invoice --'}</option>
                  {invoices.map((inv, idx) => <option key={idx} value={inv.no_invoice}>{inv.no_invoice}</option>)}
                </select>
                <button className="px-3 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"><Search size={16} className="text-gray-600" /></button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Sudah Terima Dari</label>
              <div className="flex gap-2 w-full">
                <select className={inputClass} value={form.pembeli_id || ''} onChange={e => handlePembeliChange(e.target.value ? Number(e.target.value) : '')}>
                  <option value="">{loadingData ? 'Loading data...' : '-- Pilih Pelanggan --'}</option>
                  {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama} - {p.alamat}</option>)}
                </select>
                <button className="px-3 font-bold border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" onClick={() => navigate('/setup/pelanggan')}>+</button>
              </div>
            </div>

            {/* Baris 3: Alamat (Full Width) */}
            <div className="md:col-span-2">
              <label className={labelClass}>Alamat</label>
              <textarea 
                className={`${inputClass} h-20 resize-none bg-slate-50`} 
                readOnly 
                value={form.alamat || ''} 
                onChange={e => setForm({...form, alamat: e.target.value})} 
              />
            </div>

            {/* Baris 4: Jumlah & Terbilang */}
            <div className="md:col-span-2">
              <label className={labelClass}>Jumlah Uang</label>
              <div className="flex gap-3 w-full max-w-sm mb-3">
                <select className={`${inputClass} w-24`} value={form.mata_uang} onChange={e => setForm({...form, mata_uang: e.target.value})}>
                  <option value="IDR">IDR</option>
                  <option value="USD">USD</option>
                </select>
                <input 
                  type="number" 
                  className={`${inputClass} flex-1 text-right font-bold text-lg text-blue-900 bg-blue-50/30`} 
                  value={form.jumlah || ''} 
                  onChange={e => handleJumlahChange(e.target.value)} 
                />
              </div>
              
              <label className={labelClass}>Terbilang</label>
              <input 
                type="text" 
                className={`${inputClass} bg-slate-50 italic text-slate-600 font-semibold`} 
                value={form.terbilang || ''} 
                onChange={e => setForm({...form, terbilang: e.target.value})} 
              />
            </div>

            {/* Baris 5: Untuk Pembayaran */}
            <div className="md:col-span-2">
              <label className={labelClass}>Untuk Pembayaran</label>
              <textarea 
                className={`${inputClass} h-24 resize-none`} 
                value={form.untuk_pembayaran || ''} 
                onChange={e => setForm({...form, untuk_pembayaran: e.target.value})} 
              />
            </div>

            {/* Baris 6: Keterangan Footer & Tanda Tangan */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 pt-6 border-t border-gray-200">
              <div>
                <label className={labelClass}>Keterangan (Instruksi Transfer)</label>
                <textarea 
                  className={`${inputClass} h-32 resize-none text-xs`} 
                  value={form.keterangan_footer || ''} 
                  onChange={e => setForm({...form, keterangan_footer: e.target.value})} 
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex-1 bg-slate-50 border border-gray-200 rounded-md p-4 flex flex-col justify-end items-center min-h-[128px]">
                  <div className="w-full flex flex-col gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1 text-center">Nama Penandatangan</label>
                      <input 
                        type="text" 
                        className="w-full h-8 px-2 text-sm text-center border-b border-gray-400 bg-transparent focus:outline-none font-bold text-slate-800" 
                        value={form.penandatangan || ''} 
                        onChange={e => setForm({...form, penandatangan: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1 text-center">Jabatan</label>
                      <input 
                        type="text" 
                        className="w-full h-8 px-2 text-sm text-center border-b border-gray-300 bg-transparent focus:outline-none text-slate-600" 
                        value={form.jabatan || ''} 
                        onChange={e => setForm({...form, jabatan: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button 
              className={`${btnClass} bg-white text-slate-700 border border-gray-300 hover:bg-slate-50 px-8 py-3`}
            >
               BATAL
            </button>
            <button 
              onClick={handleSave} 
              className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700 px-10 py-3 shadow-md`}
            >
              <Save size={18} /> SIMPAN KWITANSI
            </button>
          </div>

        </div>
      </div>

      {/* Modal Tambah Kwitansi Header */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
              <h3 className="text-white font-bold text-lg">Buat Kwitansi Baru</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 flex flex-col gap-5">
              <div>
                <label className={labelClass}>No. Kwitansi</label>
                <div className="flex gap-3">
                  <input type="text" className={`${inputClass} font-mono flex-1 bg-slate-50`} value={form.no_kwitansi || ''} onChange={e => setForm({...form, no_kwitansi: e.target.value})} />
                  <button className="px-5 text-sm font-bold border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md shadow-sm transition-colors" onClick={() => setForm({...form, no_kwitansi: `KT/00${Math.floor(Math.random()*100)}/06/2026`})}>
                    Auto No
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Tanggal Kwitansi</label>
                <input type="date" className={inputClass} value={form.tgl_kwitansi || ''} onChange={e => setForm({...form, tgl_kwitansi: e.target.value})} />
              </div>
            </div>
            <div className="bg-slate-50 px-8 py-5 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowNewModal(false)} className={`${btnClass} bg-white text-slate-700 border border-gray-300 hover:bg-slate-50`}> TUTUP </button>
              <button onClick={() => {
                if(!form.no_kwitansi) { toast.error("Isi No Kwitansi"); return; }
                setShowNewModal(false);
                toast.success("Header Dibuat");
              }} className={`${btnClass} bg-blue-600 text-white hover:bg-blue-700 px-6`}>
                BUAT KWITANSI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kwitansi;
