import React, { useState, useEffect } from 'react';
import { FilePlus, Trash2, Printer, Save, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Search } from 'lucide-react';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { sspApi, SuratSetoranPajakData } from '../api';
import toast from 'react-hot-toast';

const SuratSetoranPajak: React.FC = () => {
  const confirm = useConfirm();

  const [dataList, setDataList] = useState<SuratSetoranPajakData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [form, setForm] = useState<Partial<SuratSetoranPajakData>>({
    kpp: '', nama_wp: '', npwp: '', alamat: '', kode_pos: '',
    tahun: TAMBAH BARU Date().getFullYear().toString(), bulan: '01',
    kode_jenis_pajak: '', kode_jenis_pajak_desc: '',
    kode_jenis_setoran: '', kode_jenis_setoran_desc: '',
    uraian_pembayaran: '', no_ketetapan: '', ntpp: '',
    jumlah: 0, tanggal: TAMBAH BARU Date().toISOString().split('T')[0],
    tanda_tangan: '', keterangan: '', ssp_pemungut: false
  });

  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const resData = await sspApi.getAll();
      const d = resData || [];
      setDataList(d);
      if (d.length > 0) {
        setForm(d[0]);
        setCurrentIndex(0);
        setIsNew(false);
      } else {
        handleNew();
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const loadRecord = (index: number) => {
    if (index >= 0 && index < dataList.length) {
      setForm(dataList[index]);
      setCurrentIndex(index);
      setIsNew(false);
    }
  };

  const handleNew = () => {
    setForm({
      kpp: '', nama_wp: '', npwp: '', alamat: '', kode_pos: '',
      tahun: TAMBAH BARU Date().getFullYear().toString(), bulan: '01',
      kode_jenis_pajak: '', kode_jenis_pajak_desc: '',
      kode_jenis_setoran: '', kode_jenis_setoran_desc: '',
      uraian_pembayaran: '', no_ketetapan: '', ntpp: '',
      jumlah: 0, tanggal: TAMBAH BARU Date().toISOString().split('T')[0],
      tanda_tangan: '', keterangan: '', ssp_pemungut: false
    });
    setIsNew(true);
  };

  const handleSave = async () => {
    try {
      await sspApi.SIMPAN(form as SuratSetoranPajakData);
      const resData = await sspApi.getAll();
      const d = resData || [];
      setDataList(d);
      if (isNew) {
        setCurrentIndex(d.length - 1);
        setForm(d[d.length - 1]);
        setIsNew(false);
      } else {
        setForm(d[currentIndex]);
      }
      toast.success('Data berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan Surat Setoran Pajak');
    }
  };

  const handleDelete = async () => {
    if (isNew || !form.id) return;
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus SSP ini?');
    if (!isConfirmed) return;
    try {
      await sspApi.HAPUS(form.id);
      const resData = await sspApi.getAll();
      const d = resData || [];
      setDataList(d);
      if (d.length > 0) {
        const newIdx = Math.min(currentIndex, d.length - 1);
        setCurrentIndex(newIdx);
        setForm(d[newIdx]);
      } else {
        handleNew();
      }
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  const inputClass = "w-full px-2 py-1 border border-slate-300 bg-white text-xs focus:outline-none focus:border-slate-500 focus:bg-slate-50 shadow-sm";
  const labelClass = "text-xs font-bold text-slate-700 w-32 shrink-0 pt-1.5";

  const bulanOptions = [
    {v:'01', l:'Januari'}, {v:'02', l:'Februari'}, {v:'03', l:'Maret'}, {v:'04', l:'April'},
    {v:'05', l:'Mei'}, {v:'06', l:'Juni'}, {v:'07', l:'Juli'}, {v:'08', l:'Agustus'},
    {v:'09', l:'September'}, {v:'10', l:'Oktober'}, {v:'11', l:'November'}, {v:'12', l:'Desember'}
  ];

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)] text-xs text-slate-800">

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col relative pb-8">
        
        {/* Top Header Bar inside content */}
        <div className="bg-slate-800 text-white px-4 py-2 border-b-2 border-slate-500 flex items-center justify-between sticky top-0 z-20">
          <h2 className="font-bold tracking-wider">Surat Setoran Pajak</h2>
        </div>

        {/* Action Header */}
        <div className="bg-slate-200 border-b border-slate-400 px-2 py-1.5 flex flex-wrap gap-1 sticky top-9 z-20 shadow-sm">
          <button onClick={handleNew} className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold flex items-center gap-1 text-xs"><FilePlus size={14}/> TAMBAH BARU </button>
          <button onClick={handleDelete} className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold flex items-center gap-1 text-xs"><Trash2 size={14}/> HAPUS </button>
          <button className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold text-xs"> TUTUP </button>
          <button className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold flex items-center gap-1 text-xs"><Eye size={14}/> Preview</button>
          <button className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold flex items-center gap-1 text-xs"><Printer size={14}/> CETAK </button>
          <button className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold text-xs">Preview Blanko</button>
          <button className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold text-xs">CETAK Blanko</button>
        </div>

        {/* Form Fields Area */}
        <div className="p-6 flex flex-col gap-2 max-w-3xl mx-auto w-full">
          
          <div className="flex items-start">
            <label className={labelClass}>KPP</label>
            <div className="flex gap-1 flex-1 items-center max-w-sm">
              <input type="text" className={`${inputClass} flex-1`} value={form.kpp||''} onChange={e=>setForm({...form, kpp:e.target.value})} />
              <button className="p-1 border border-slate-400 bg-slate-200 hover:bg-slate-300 shadow-sm"><Search size={14}/></button>
            </div>
          </div>
          
          <div className="flex items-start">
            <label className={labelClass}>Nama WP</label>
            <input type="text" className={`${inputClass} max-w-xl`} value={form.nama_wp||''} onChange={e=>setForm({...form, nama_wp:e.target.value})} />
          </div>

          <div className="flex items-start">
            <label className={labelClass}>NPWP</label>
            <input type="text" className={`${inputClass} max-w-xs font-mono tracking-wider`} value={form.npwp||''} onChange={e=>setForm({...form, npwp:e.target.value})} />
          </div>

          <div className="flex items-start">
            <label className={labelClass}>Alamat</label>
            <div className="flex flex-col gap-1 max-w-xl flex-1">
              <input type="text" className={`${inputClass}`} value={form.alamat||''} onChange={e=>setForm({...form, alamat:e.target.value})} />
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xs font-bold text-slate-700">Kode Pos:</span>
                <input type="text" className={`${inputClass} w-24`} value={form.kode_pos||''} onChange={e=>setForm({...form, kode_pos:e.target.value})} />
              </div>
            </div>
          </div>

          <div className="flex items-center mt-2">
            <label className={labelClass}>Tahun</label>
            <input type="text" className={`${inputClass} w-20 text-center`} value={form.tahun||''} onChange={e=>setForm({...form, tahun:e.target.value})} />
            <label className="text-xs font-bold text-slate-700 mx-4">Bulan:</label>
            <select className={`${inputClass} w-32`} value={form.bulan||'01'} onChange={e=>setForm({...form, bulan:e.target.value})}>
              {bulanOptions.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
            </select>
          </div>

          <div className="flex items-center mt-2">
            <label className={labelClass}>Kode Jenis Pajak/MAP</label>
            <select className={`${inputClass} w-24`} value={form.kode_jenis_pajak||''} onChange={e=>setForm({...form, kode_jenis_pajak:e.target.value})}>
              <option value=""></option>
              <option value="411211">411211</option>
              <option value="411212">411212</option>
            </select>
            <input type="text" className={`${inputClass} flex-1 ml-2 bg-slate-100 font-semibold text-slate-600`} value={form.kode_jenis_pajak_desc||''} onChange={e=>setForm({...form, kode_jenis_pajak_desc:e.target.value})} />
          </div>

          <div className="flex items-center">
            <label className={labelClass}>Kode Jenis Setoran</label>
            <select className={`${inputClass} w-24`} value={form.kode_jenis_setoran||''} onChange={e=>setForm({...form, kode_jenis_setoran:e.target.value})}>
              <option value=""></option>
              <option value="100">100</option>
              <option value="104">104</option>
            </select>
            <input type="text" className={`${inputClass} flex-1 ml-2 bg-slate-100 font-semibold text-slate-600`} value={form.kode_jenis_setoran_desc||''} onChange={e=>setForm({...form, kode_jenis_setoran_desc:e.target.value})} />
          </div>

          <div className="flex items-start mt-2">
            <label className={labelClass}>Uraian Pembayaran</label>
            <textarea className={`${inputClass} h-16 resize-none`} value={form.uraian_pembayaran||''} onChange={e=>setForm({...form, uraian_pembayaran:e.target.value})} />
          </div>

          <div className="flex items-center mt-2">
            <label className={labelClass}>No. Ketetapan</label>
            <input type="text" className={`${inputClass} w-48`} value={form.no_ketetapan||''} onChange={e=>setForm({...form, no_ketetapan:e.target.value})} />
            <label className="text-xs font-bold text-slate-700 mx-4">NTPP</label>
            <input type="text" className={`${inputClass} flex-1 font-mono uppercase`} value={form.ntpp||''} onChange={e=>setForm({...form, ntpp:e.target.value})} />
          </div>

          <div className="flex items-center">
            <label className={labelClass}>Jumlah</label>
            <input type="number" className={`${inputClass} w-48 text-right font-bold`} value={form.jumlah||''} onChange={e=>setForm({...form, jumlah:Number(e.target.value)})} />
          </div>

          <div className="flex items-center mt-2">
            <label className={labelClass}>Tanggal</label>
            <input type="date" className={`${inputClass} w-36`} value={form.tanggal||''} onChange={e=>setForm({...form, tanggal:e.target.value})} />
          </div>

          <div className="flex items-center">
            <label className={labelClass}>Tanda Tangan</label>
            <input type="text" className={`${inputClass} max-w-sm`} value={form.tanda_tangan||''} onChange={e=>setForm({...form, tanda_tangan:e.target.value})} />
          </div>

          <div className="flex items-center">
            <label className={labelClass}>Keterangan</label>
            <input type="text" className={`${inputClass} max-w-xl`} value={form.keterangan||''} onChange={e=>setForm({...form, keterangan:e.target.value})} />
          </div>

          <div className="flex items-center mt-1">
            <label className={labelClass}>SSP Pemungut</label>
            <input type="checkbox" className="w-4 h-4 ml-1" checked={form.ssp_pemungut||false} onChange={e=>setForm({...form, ssp_pemungut:e.target.checked})} />
          </div>

          <div className="flex gap-4 items-center bg-white p-2 border border-slate-300 rounded-sm mt-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Record</span>
            <div className="flex gap-2 text-[10px]">
              <span className="text-slate-600">Created: <b className="bg-slate-200 px-2 py-0.5 rounded-sm border border-slate-300">Admin</b></span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600">Modified: <b className="bg-slate-200 px-2 py-0.5 rounded-sm border border-slate-300">-</b></span>
            </div>
          </div>

        </div>
      </div>

      {/* Global Record Footer */}
      <div className="bg-slate-200 border-t-2 border-slate-400 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center">
          <span className="text-xs font-bold text-slate-700 mr-3">Record:</span>
          <div className="flex items-center gap-1">
            <button onClick={() => loadRecord(0)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white shadow-sm"><ChevronsLeft size={14} /></button>
            <button onClick={() => loadRecord(currentIndex - 1)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white shadow-sm"><ChevronLeft size={14} /></button>
            <div className="px-4 py-0.5 border border-slate-400 bg-white text-xs text-center w-16 font-mono mx-1 shadow-inner">{isNew ? '*' : currentIndex + 1}</div>
            <button onClick={() => loadRecord(currentIndex + 1)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white shadow-sm"><ChevronRight size={14} /></button>
            <button onClick={() => loadRecord(dataList.length - 1)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white shadow-sm"><ChevronsRight size={14} /></button>
          </div>
          <span className="text-xs font-bold text-slate-700 ml-3">of {dataList.length}</span>
          <span className="text-slate-500 ml-6 font-mono bg-slate-100 px-2 py-0.5 border border-slate-300 text-xs">{isNew ? 'TAMBAH BARU Form' : 'Form View'}</span>
        </div>

        <button onClick={handleSave} className="flex items-center gap-1.5 px-6 py-1.5 bg-blue-700 border border-blue-800 hover:bg-blue-800 text-white font-bold shadow-sm">
          <Save size={14} /> SIMPAN DATA
        </button>
      </div>

    </div>
  );
};

export default SuratSetoranPajak;
