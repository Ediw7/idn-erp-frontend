import React, { useState, useEffect } from 'react';
import { FilePlus, Trash2, Printer, Save, Eye, Search } from 'lucide-react';
import { useConfirm } from '../../../../contexts/ConfirmContext';
import { sspApi, SuratSetoranPajakData } from '../api';
import axiosClient from '../../../../lib/axiosClient';
import toast from 'react-hot-toast';

const SuratSetoranPajak: React.FC = () => {
  const confirm = useConfirm();

  const [isLoading, setIsLoading] = useState(false);
  const [dataList, setDataList] = useState<SuratSetoranPajakData[]>([]);
  const [mapOptions, setMapOptions] = useState<{kode: string, deskripsi: string}[]>([]);
  const [setoranOptions, setSetoranOptions] = useState<{kode: string, deskripsi: string}[]>([]);

  const [form, setForm] = useState<Partial<SuratSetoranPajakData> & any>({
    kpp: '', nama_wp: '', npwp: '', alamat: '', kode_pos: '',
    tahun: new Date().getFullYear().toString(), bulan: '01',
    kode_jenis_pajak: '', kode_jenis_pajak_desc: '',
    kode_jenis_setoran: '', kode_jenis_setoran_desc: '',
    uraian_pembayaran: '', no_ketetapan: '', ntpp: '',
    jumlah: 0, tanggal: new Date().toISOString().split('T')[0],
    tanda_tangan: '', keterangan: '', ssp_pemungut: false
  });

  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchInitialData();
    fetchCompanyProfile();
    fetchMap();
  }, []);

  const fetchInitialData = async () => {
    try {
      const resData = await sspApi.getAll();
      const d = resData || [];
      setDataList(d);
      if (d.length > 0) {
        setForm(d[0]);
        setIsNew(false);
        if (d[0].kode_jenis_pajak) {
          fetchSetoran(d[0].kode_jenis_pajak);
        }
      } else {
        handleNew();
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const fetchCompanyProfile = async () => {
    try {
      // Menarik data perusahaan aktif dari backend
      const res = await axiosClient.get('/api/company-profile/active').catch(() => null);
      if (res?.data?.data) {
        const wp = res.data.data;
        setForm((prev: any) => ({
          ...prev,
          nama_wp: wp.name || wp.nama_wp || '',
          npwp: wp.vat || wp.npwp || '',
          alamat: wp.street || wp.alamat || '',
          kode_pos: wp.zip || wp.kode_pos || '',
          kpp: wp.kpp || ''
        }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMap = async () => {
    try {
      const res = await axiosClient.get('/api/setup-pajak/map').catch(() => null);
      if (res?.data?.data) {
        setMapOptions(res.data.data);
      } else {
        // Fallback options if API fails
        setMapOptions([
          { kode: '411122', deskripsi: 'PPh Pasal 22' },
          { kode: '411124', deskripsi: 'PPh Pasal 23' },
          { kode: '411211', deskripsi: 'PPN Dalam Negeri' },
          { kode: '411212', deskripsi: 'PPN Impor' }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSetoran = async (kode_map: string) => {
    if (!kode_map) return;
    try {
      const res = await axiosClient.get(`/api/setup-pajak/setoran?map=${kode_map}`).catch(() => null);
      if (res?.data?.data) {
        setSetoranOptions(res.data.data);
      } else {
         // Fallback dependent options
        if (kode_map === '411211') {
          setSetoranOptions([{ kode: '100', deskripsi: 'Setoran Masa PPN Dalam Negeri' }, { kode: '104', deskripsi: 'Setoran Pendahuluan skp PPN Dalam Negeri' }]);
        } else {
          setSetoranOptions([{ kode: '100', deskripsi: 'Setoran Masa' }]);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMapChange = (kode: string) => {
    const selected = mapOptions.find(m => m.kode === kode);
    setForm({ 
      ...form, 
      kode_jenis_pajak: kode, 
      kode_jenis_pajak_desc: selected?.deskripsi || '',
      kode_jenis_setoran: '',
      kode_jenis_setoran_desc: ''
    });
    fetchSetoran(kode);
  };

  const handleSetoranChange = (kode: string) => {
    const selected = setoranOptions.find(s => s.kode === kode);
    setForm({ 
      ...form, 
      kode_jenis_setoran: kode, 
      kode_jenis_setoran_desc: selected?.deskripsi || ''
    });
  };

  const handleNew = () => {
    setForm((prev: any) => ({
      ...prev,
      tahun: new Date().getFullYear().toString(), bulan: '01',
      kode_jenis_pajak: '', kode_jenis_pajak_desc: '',
      kode_jenis_setoran: '', kode_jenis_setoran_desc: '',
      uraian_pembayaran: '', no_ketetapan: '', ntpp: '',
      jumlah: 0, tanggal: new Date().toISOString().split('T')[0],
      tanda_tangan: '', keterangan: '', ssp_pemungut: false,
      id: null
    }));
    setIsNew(true);
    fetchCompanyProfile(); // Re-fetch active WP on new
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let response;
      if (form.id) {
        response = await sspApi.save(form as SuratSetoranPajakData);
      } else {
        response = await sspApi.save(form as SuratSetoranPajakData);
      }
      toast.success('Surat Setoran Pajak berhasil disimpan');
      setIsNew(false);
      fetchInitialData();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan Surat Setoran Pajak');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isNew || !form.id) return;
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus SSP ini?');
    if (!isConfirmed) return;
    setIsLoading(true);
    try {
      await sspApi.delete(form.id);
      toast.success('Dokumen SSP berhasil dihapus');
      handleNew();
    } catch (error) {
      toast.error('Gagal menghapus data SSP');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-1.5 border border-slate-300 bg-white rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-slate-500 shadow-sm transition-all";
  const readOnlyClass = "w-full px-3 py-1.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-sm text-sm font-semibold focus:outline-none cursor-not-allowed";
  const labelClass = "text-sm font-semibold text-slate-700 w-44 shrink-0 pt-2";

  const bulanOptions = [
    {v:'01', l:'Januari'}, {v:'02', l:'Februari'}, {v:'03', l:'Maret'}, {v:'04', l:'April'},
    {v:'05', l:'Mei'}, {v:'06', l:'Juni'}, {v:'07', l:'Juli'}, {v:'08', l:'Agustus'},
    {v:'09', l:'September'}, {v:'10', l:'Oktober'}, {v:'11', l:'November'}, {v:'12', l:'Desember'}
  ];

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">

      {/* Top Header - Dark Modern Style */}
      <div className="bg-slate-900 px-6 py-5 shrink-0 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md z-10">
        <div className="flex items-center gap-6 shrink-0 w-full md:w-auto">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Surat Setoran Pajak (SSP)</h2>
            <p className="text-sm text-slate-300 mt-1">Formulir Perekaman Setoran Pajak Negara</p>
          </div>
          <div className="h-10 w-px bg-slate-700 hidden md:block"></div>
        </div>
        
        {/* Action Header incorporated directly next to title */}
        <div className="flex flex-wrap items-center justify-start md:justify-end gap-2 shrink-0 w-full md:w-auto">
          <button onClick={handleNew} disabled={isLoading} className="px-4 py-2 bg-white hover:bg-slate-100 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-slate-800 shadow-sm disabled:opacity-50">
            <FilePlus size={14} /> TAMBAH BARU
          </button>
          <button onClick={handleSave} disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-white shadow-sm border border-blue-700 disabled:opacity-50 disabled:bg-blue-800">
            <Save size={14} /> SIMPAN DATA
          </button>
          <button onClick={handleDelete} disabled={isLoading || isNew} className="px-4 py-2 bg-white hover:bg-red-50 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-red-600 shadow-sm disabled:opacity-50">
            <Trash2 size={14} /> HAPUS
          </button>
          <div className="w-px h-6 bg-slate-700 mx-1 hidden md:block"></div>
          <button className="px-4 py-2 bg-white hover:bg-slate-100 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-slate-800 shadow-sm">
            <Eye size={14} /> PREVIEW
          </button>
          <button className="px-4 py-2 bg-white hover:bg-slate-100 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-slate-800 shadow-sm">
            <Printer size={14} /> CETAK
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white flex flex-col relative">
        <div className="p-8 flex flex-col gap-5 max-w-4xl mx-auto w-full">
          
          <div className="flex items-start">
            <label className={labelClass}>KPP</label>
            <div className="flex gap-2 flex-1 items-center max-w-sm">
              <input type="text" readOnly className={`${readOnlyClass} flex-1`} value={form.kpp||''} placeholder="Otomatis terisi" />
              <button disabled className="p-1.5 border border-slate-300 rounded-sm bg-slate-100 text-slate-400 cursor-not-allowed"><Search size={16}/></button>
            </div>
          </div>
          
          <div className="flex items-start">
            <label className={labelClass}>Nama WP</label>
            <input type="text" readOnly className={`${readOnlyClass} max-w-xl`} value={form.nama_wp||''} />
          </div>

          <div className="flex items-start">
            <label className={labelClass}>NPWP</label>
            <input type="text" readOnly className={`${readOnlyClass} max-w-xs font-mono tracking-wider`} value={form.npwp||''} />
          </div>

          <div className="flex items-start">
            <label className={labelClass}>Alamat</label>
            <div className="flex flex-col gap-2 max-w-xl flex-1">
              <input type="text" readOnly className={`${readOnlyClass}`} value={form.alamat||''} />
              <div className="flex items-center gap-3 justify-end mt-1">
                <span className="text-sm font-semibold text-slate-700">Kode Pos:</span>
                <input type="text" readOnly className={`${readOnlyClass} w-24 text-center`} value={form.kode_pos||''} />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-200 my-2"></div>

          <div className="flex items-center">
            <label className={labelClass}>Tahun</label>
            <input type="text" className={`${inputClass} w-24 text-center font-mono`} value={form.tahun||''} onChange={e=>setForm({...form, tahun:e.target.value})} />
            <label className="text-sm font-semibold text-slate-700 mx-6">Bulan:</label>
            <select className={`${inputClass} w-40`} value={form.bulan||'01'} onChange={e=>setForm({...form, bulan:e.target.value})}>
              {bulanOptions.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
            </select>
          </div>

          <div className="flex items-center mt-2">
            <label className={labelClass}>Kode Jenis Pajak/MAP</label>
            <div className="flex gap-2 flex-1 max-w-xl">
              <select className={`${inputClass} w-32 font-mono`} value={form.kode_jenis_pajak||''} onChange={e=>handleMapChange(e.target.value)}>
                <option value="">-- Pilih MAP --</option>
                {mapOptions.map(m => <option key={m.kode} value={m.kode}>{m.kode}</option>)}
              </select>
              <input type="text" readOnly className={`${readOnlyClass} flex-1`} value={form.kode_jenis_pajak_desc||''} placeholder="Deskripsi MAP" />
            </div>
          </div>

          <div className="flex items-center">
            <label className={labelClass}>Kode Jenis Setoran</label>
            <div className="flex gap-2 flex-1 max-w-xl">
              <select className={`${inputClass} w-32 font-mono`} value={form.kode_jenis_setoran||''} onChange={e=>handleSetoranChange(e.target.value)} disabled={!form.kode_jenis_pajak}>
                <option value="">-- Setoran --</option>
                {setoranOptions.map(s => <option key={s.kode} value={s.kode}>{s.kode}</option>)}
              </select>
              <input type="text" readOnly className={`${readOnlyClass} flex-1`} value={form.kode_jenis_setoran_desc||''} placeholder="Deskripsi Jenis Setoran" />
            </div>
          </div>

          <div className="flex items-start mt-2">
            <label className={labelClass}>Uraian Pembayaran</label>
            <textarea className={`${inputClass} max-w-xl h-24 resize-none leading-relaxed`} value={form.uraian_pembayaran||''} onChange={e=>setForm({...form, uraian_pembayaran:e.target.value})} placeholder="Masukkan uraian pembayaran SSP..." />
          </div>

          <div className="flex items-center mt-2">
            <label className={labelClass}>No. Ketetapan</label>
            <input type="text" className={`${inputClass} w-56 font-mono`} value={form.no_ketetapan||''} onChange={e=>setForm({...form, no_ketetapan:e.target.value})} placeholder="Nomor ketetapan (jika ada)" />
            <label className="text-sm font-semibold text-slate-700 mx-6">NTPP</label>
            <input type="text" className={`${inputClass} w-64 font-mono uppercase tracking-wider`} value={form.ntpp||''} onChange={e=>setForm({...form, ntpp:e.target.value})} placeholder="Nomor Tanda Penerimaan Negara" />
          </div>

          <div className="flex items-center mt-2">
            <label className={labelClass}>Jumlah</label>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-sm">Rp</span>
              <input type="number" className={`${inputClass} w-full pl-10 text-right font-bold text-base text-blue-800`} value={form.jumlah||''} onChange={e=>setForm({...form, jumlah:Number(e.target.value)})} />
            </div>
          </div>

          <div className="flex items-center mt-2">
            <label className={labelClass}>Tanggal Setor</label>
            <input type="date" className={`${inputClass} w-40`} value={form.tanggal||''} onChange={e=>setForm({...form, tanggal:e.target.value})} />
          </div>

          <div className="flex items-center mt-2">
            <label className={labelClass}>Tanda Tangan</label>
            <input type="text" className={`${inputClass} max-w-sm`} value={form.tanda_tangan||''} onChange={e=>setForm({...form, tanda_tangan:e.target.value})} placeholder="Nama penandatangan" />
          </div>

          <div className="flex items-center">
            <label className={labelClass}>Keterangan</label>
            <input type="text" className={`${inputClass} max-w-xl`} value={form.keterangan||''} onChange={e=>setForm({...form, keterangan:e.target.value})} placeholder="Keterangan tambahan" />
          </div>

          <div className="flex items-center mt-2 pl-44">
            <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50 border border-slate-200 rounded-sm hover:bg-slate-100 transition-colors">
              <input type="checkbox" className="w-4 h-4 accent-slate-800" checked={form.ssp_pemungut||false} onChange={e=>setForm({...form, ssp_pemungut:e.target.checked})} />
              <span className="text-sm font-bold text-slate-700">Tandai sebagai SSP Pemungut</span>
            </label>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SuratSetoranPajak;
