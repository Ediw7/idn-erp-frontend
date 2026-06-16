import React, { useState, useEffect } from 'react';
import { FilePlus, Trash2, Printer, Save, Lock, Copy, RefreshCw, Unlock } from 'lucide-react';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { sptMasaApi, SptMasa1111Data } from '../api';
import axiosClient from '../../../lib/axiosClient';
import toast from 'react-hot-toast';

const SptMasa1111: React.FC = () => {
  const confirm = useConfirm();

  const [dataList, setDataList] = useState<SptMasa1111Data[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState<Partial<SptMasa1111Data> & any>({
    tahun: new Date().getFullYear().toString(),
    masa_awal: '01', masa_akhir: '01', pembetulan_ke: 0,
    tanggal_spt: new Date().toISOString().split('T')[0], is_locked: false,
    dpp_ekspor: 0, ppn_ekspor: 0,
    dpp_dipungut_sendiri: 0, ppn_dipungut_sendiri: 0,
    dpp_dipungut_pemungut: 0, ppn_dipungut_pemungut: 0,
    dpp_tidak_dipungut: 0, ppn_tidak_dipungut: 0,
    dpp_dibebaskan: 0, ppn_dibebaskan: 0,
    dpp_tidak_terutang: 0,
    ppn_disetor_dimuka: 0, pajak_masukan_diperhitungkan: 0, ppn_spt_dibetulkan: 0,
    tgl_lunas_kurang_bayar: '', ntpn_kurang_bayar: '',
    lebih_bayar_pada: '', lebih_bayar_oleh: '', lebih_bayar_diminta_untuk: '',
    kompensasi_masa: '', kompensasi_tahun: '',
    restitusi_pasal_17c: '', restitusi_pasal_17d: '', restitusi_pasal_9_4c: false,
    membangun_dpp: 0, membangun_ppn: 0, membangun_ntpn: '',
    gagal_produksi_ppn: 0, gagal_produksi_ntpn: '',
    ppnbm_terutang: 0, ppnbm_disetor_dimuka: 0, ppnbm_spt_dibetulkan: 0, tgl_lunas_ppnbm: '', ppnbm_ntpn: '',
    lampiran_ae: false, lampiran_a1: false, lampiran_a2: false,
    lampiran_b1: false, lampiran_b2: false, lampiran_b3: false,
    ssp_ppn_lembar: 0, ssp_ppnbm_lembar: 0, surat_kuasa: false,
    ttd_nama: '', ttd_jabatan: '', lokasi_lapor: 'Jakarta', is_kuasa: false
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const resData = await sptMasaApi.getAll();
      const d = resData || [];
      setDataList(d);
      if (d.length > 0) {
        setForm(d[0]);
        setCurrentIndex(0);
      } else {
        handleNew();
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const handleNew = () => {
    setForm({
      tahun: new Date().getFullYear().toString(),
      masa_awal: '01', masa_akhir: '01', pembetulan_ke: 0,
      tanggal_spt: new Date().toISOString().split('T')[0], is_locked: false,
      dpp_ekspor: 0, ppn_ekspor: 0,
      dpp_dipungut_sendiri: 0, ppn_dipungut_sendiri: 0,
      dpp_dipungut_pemungut: 0, ppn_dipungut_pemungut: 0,
      dpp_tidak_dipungut: 0, ppn_tidak_dipungut: 0,
      dpp_dibebaskan: 0, ppn_dibebaskan: 0,
      dpp_tidak_terutang: 0,
      ppn_disetor_dimuka: 0, pajak_masukan_diperhitungkan: 0, ppn_spt_dibetulkan: 0,
      tgl_lunas_kurang_bayar: '', ntpn_kurang_bayar: '',
      lebih_bayar_pada: '', lebih_bayar_oleh: '', lebih_bayar_diminta_untuk: '',
      kompensasi_masa: '', kompensasi_tahun: '',
      restitusi_pasal_17c: '', restitusi_pasal_17d: '', restitusi_pasal_9_4c: false,
      membangun_dpp: 0, membangun_ppn: 0, membangun_ntpn: '',
      gagal_produksi_ppn: 0, gagal_produksi_ntpn: '',
      ppnbm_terutang: 0, ppnbm_disetor_dimuka: 0, ppnbm_spt_dibetulkan: 0, tgl_lunas_ppnbm: '', ppnbm_ntpn: '',
      lampiran_ae: false, lampiran_a1: false, lampiran_a2: false,
      lampiran_b1: false, lampiran_b2: false, lampiran_b3: false,
      ssp_ppn_lembar: 0, ssp_ppnbm_lembar: 0, surat_kuasa: false,
      ttd_nama: '', ttd_jabatan: '', lokasi_lapor: 'Jakarta', is_kuasa: false
    });
  };

  const handleAutoCalculate = async () => {
    if (form.is_locked) {
      toast.error('SPT sedang terkunci');
      return;
    }
    
    setIsLoading(true);
    try {
      // Tembak API riil ke Faktur Pajak Akumulasi
      const res = await axiosClient.get(`/api/faktur-pajak/akumulasi`, {
        params: { masa_awal: form.masa_awal, masa_akhir: form.masa_akhir, tahun: form.tahun }
      });
      
      const data = res.data?.data || {};
      
      // Inject hasil akumulasi ke form
      setForm((prev: any) => ({
        ...prev,
        dpp_dipungut_sendiri: data.dpp_keluaran || 0,
        ppn_dipungut_sendiri: data.ppn_keluaran || 0,
        pajak_masukan_diperhitungkan: data.ppn_masukan || 0
      }));
      
      toast.success('Data akumulasi berhasil ditarik');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menarik data akumulasi Faktur Pajak');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSPT = async () => {
    if (form.is_locked) {
      toast.error('Dokumen terkunci, tidak bisa disimpan');
      return;
    }
    
    setIsLoading(true);
    try {
      let response;
      if (form.id) {
        // Update existing record
        response = await axiosClient.put(`/api/spt-masa/${form.id}`, form);
      } else {
        // Create new record
        response = await axiosClient.post('/api/spt-masa', form);
      }
      
      toast.success('SPT Masa 1111 berhasil disimpan');
      
      if (!form.id && response.data?.data?.id) {
         setForm((prev: any) => ({ ...prev, id: response.data.data.id }));
      }
      
      // Refresh list
      fetchInitialData();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan dokumen SPT');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSPT = async () => {
    if (!form.id) {
      toast.error('Dokumen ini belum tersimpan di database');
      return;
    }
    if (form.is_locked) {
      toast.error('Dokumen terkunci, tidak bisa dihapus');
      return;
    }
    
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus permanen SPT ini?');
    if (!isConfirmed) return;
    
    setIsLoading(true);
    try {
      await axiosClient.delete(`/api/spt-masa/${form.id}`);
      toast.success('Dokumen SPT berhasil dihapus');
      handleNew();
      fetchInitialData();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus dokumen SPT');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLock = async () => {
    if (!form.id) {
      toast.error('Simpan dokumen SPT terlebih dahulu sebelum di-lock');
      return;
    }

    const newLockStatus = !form.is_locked;
    const actionText = newLockStatus ? 'Lock' : 'Unlock';
    
    const isConfirmed = await confirm(`Apakah Anda yakin ingin melakukan ${actionText} pada SPT ini?`);
    if (!isConfirmed) return;

    setIsLoading(true);
    try {
      await axiosClient.patch(`/api/spt-masa/${form.id}/lock`, { is_locked: newLockStatus });
      setForm((prev: any) => ({ ...prev, is_locked: newLockStatus }));
      toast.success(`SPT berhasil di-${actionText.toLowerCase()}`);
    } catch (error) {
      console.error(error);
      toast.error(`Gagal mengubah status Lock SPT`);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculations for Area I
  const sumA_DPP = (form.dpp_ekspor||0) + (form.dpp_dipungut_sendiri||0) + (form.dpp_dipungut_pemungut||0) + (form.dpp_tidak_dipungut||0) + (form.dpp_dibebaskan||0);
  const sumA_PPN = (form.ppn_ekspor||0) + (form.ppn_dipungut_sendiri||0) + (form.ppn_dipungut_pemungut||0) + (form.ppn_tidak_dipungut||0) + (form.ppn_dibebaskan||0);
  const totalPenyerahan_DPP = sumA_DPP + (form.dpp_tidak_terutang||0);

  // Calculations for Area II
  const pajakKeluaran = form.ppn_dipungut_sendiri || 0;
  const kurangLebihBayar_D = pajakKeluaran - (form.ppn_disetor_dimuka||0) - (form.pajak_masukan_diperhitungkan||0);
  const kurangLebihBayar_F = kurangLebihBayar_D - (form.ppn_spt_dibetulkan||0);

  // Calculations for Area V
  const ppnbm_D = (form.ppnbm_terutang||0) - (form.ppnbm_disetor_dimuka||0);
  const ppnbm_E = ppnbm_D - (form.ppnbm_spt_dibetulkan||0);

  const inputClass = "w-full px-2 py-0.5 border border-slate-300 bg-white text-xs text-right font-mono focus:outline-none focus:border-slate-500 rounded-sm disabled:opacity-50 disabled:bg-slate-100";
  const readOnlyClass = "w-full px-2 py-0.5 border border-slate-300 bg-slate-50 text-slate-500 text-xs text-right font-mono font-bold rounded-sm focus:outline-none disabled:opacity-50";
  const textInputClass = "px-2 py-0.5 border border-slate-300 bg-white text-xs focus:outline-none focus:border-slate-500 rounded-sm disabled:opacity-50 disabled:bg-slate-100";

  const numProps = (field: string) => ({
    type: "number",
    className: inputClass,
    value: (form[field] as string | number) || '',
    onChange: (e: any) => setForm({ ...form, [field]: Number(e.target.value) }),
    disabled: form.is_locked || isLoading
  });

  const checkProps = (field: string) => ({
    type: "checkbox",
    className: "w-4 h-4 accent-slate-800 disabled:opacity-50",
    checked: form[field] || false,
    onChange: (e: any) => setForm({ ...form, [field]: e.target.checked }),
    disabled: form.is_locked || isLoading
  });

  const radioProps = (field: string, value: any) => ({
    type: "radio",
    className: "w-4 h-4 accent-slate-800 disabled:opacity-50",
    checked: form[field] === value,
    onChange: () => setForm({ ...form, [field]: value }),
    disabled: form.is_locked || isLoading
  });

  const bulanOptions = [
    {v:'01', l:'Januari'}, {v:'02', l:'Februari'}, {v:'03', l:'Maret'}, {v:'04', l:'April'},
    {v:'05', l:'Mei'}, {v:'06', l:'Juni'}, {v:'07', l:'Juli'}, {v:'08', l:'Agustus'},
    {v:'09', l:'September'}, {v:'10', l:'Oktober'}, {v:'11', l:'November'}, {v:'12', l:'Desember'}
  ];

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)] text-xs text-slate-800">
      
      {/* Top Header - Dark Modern Style */}
      <div className="bg-slate-900 px-6 py-5 shrink-0 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6 shrink-0 w-full md:w-auto">
          <div>
            <h2 className="text-xl font-bold text-white">Formulir 1111 SPT Masa PPN</h2>
            <p className="text-sm text-slate-300 mt-1">Masa {form.masa_awal} s/d {form.masa_akhir} {form.tahun} — Pembetulan Ke {form.pembetulan_ke}</p>
          </div>
          <div className="h-10 w-px bg-slate-700 hidden md:block"></div>
          <div className="hidden md:flex items-center">
             <span className={`border px-3 py-1 rounded-sm shadow-sm font-mono text-sm font-semibold ${form.is_locked ? 'bg-red-900/50 text-red-200 border-red-800' : 'bg-slate-800 text-slate-200 border-slate-700'}`}>
                {form.is_locked ? 'LOCKED' : 'UNLOCKED'}
             </span>
          </div>
        </div>
        
        {/* Action Header - Wrapping naturally */}
        <div className="flex flex-wrap items-center justify-start md:justify-end gap-2 w-full md:w-auto">
          <button onClick={handleNew} disabled={isLoading} className="px-4 py-2 bg-white hover:bg-slate-100 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-slate-800 shadow-sm disabled:opacity-50">
            <FilePlus size={14} /> TAMBAH BARU
          </button>
          <button onClick={handleSaveSPT} disabled={isLoading || form.is_locked} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-white shadow-sm border border-blue-700 disabled:opacity-50 disabled:bg-blue-800">
            <Save size={14} /> SIMPAN DATA
          </button>
          <button onClick={handleDeleteSPT} disabled={isLoading || !form.id || form.is_locked} className="px-4 py-2 bg-white hover:bg-red-50 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-red-600 shadow-sm disabled:opacity-50">
            <Trash2 size={14} /> HAPUS
          </button>
          <div className="w-px h-6 bg-slate-700 mx-1 hidden md:block"></div>
          <button onClick={handleAutoCalculate} disabled={isLoading || form.is_locked} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-white shadow-sm disabled:opacity-50">
            <RefreshCw size={14} /> AB (Auto Hitung)
          </button>
          <button disabled={isLoading || form.is_locked} className="px-4 py-2 bg-white hover:bg-slate-100 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-slate-800 shadow-sm disabled:opacity-50">
            <Copy size={14} /> Copy Data
          </button>
          <button disabled={isLoading || form.is_locked} className="px-4 py-2 bg-white hover:bg-slate-100 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-slate-800 shadow-sm disabled:opacity-50">
            Auto BUAT SSP
          </button>
          <button className="px-4 py-2 bg-white hover:bg-slate-100 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors text-slate-800 shadow-sm disabled:opacity-50">
            <Printer size={14} /> LAPORAN
          </button>
          <button onClick={handleToggleLock} disabled={isLoading || !form.id} className={`px-4 py-2 border rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 ${form.is_locked ? 'bg-red-600 hover:bg-red-700 text-white border-red-700' : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'}`}>
            {form.is_locked ? <Unlock size={14} /> : <Lock size={14} />} 
            {form.is_locked ? 'Unlock SPT' : 'Lock SPT'}
          </button>
        </div>
      </div>

      {/* Header Parameters Form */}
      <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap items-center gap-6 text-xs font-semibold shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Tahun:</span>
          <input type="text" disabled={form.is_locked || isLoading} className="w-16 px-2 py-1 border border-slate-300 bg-white rounded-sm font-mono text-center focus:outline-none focus:border-slate-500 disabled:opacity-50 disabled:bg-slate-100" value={form.tahun||''} onChange={e=>setForm({...form, tahun:e.target.value})} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Masa:</span>
          <select disabled={form.is_locked || isLoading} className="border border-slate-300 bg-white py-1 px-2 w-28 rounded-sm focus:outline-none focus:border-slate-500 disabled:opacity-50 disabled:bg-slate-100" value={form.masa_awal} onChange={e=>setForm({...form, masa_awal:e.target.value})}>
            {bulanOptions.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
          </select>
          <span className="text-slate-400">s/d</span>
          <select disabled={form.is_locked || isLoading} className="border border-slate-300 bg-white py-1 px-2 w-28 rounded-sm focus:outline-none focus:border-slate-500 disabled:opacity-50 disabled:bg-slate-100" value={form.masa_akhir} onChange={e=>setForm({...form, masa_akhir:e.target.value})}>
            {bulanOptions.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Pembetulan Ke:</span>
          <input type="number" disabled={form.is_locked || isLoading} className="w-16 px-2 py-1 border border-slate-300 bg-white text-center font-mono rounded-sm focus:outline-none focus:border-slate-500 disabled:opacity-50 disabled:bg-slate-100" value={form.pembetulan_ke} onChange={e=>setForm({...form, pembetulan_ke:Number(e.target.value)})} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600">Tanggal SPT :</span>
          <input type="date" disabled={form.is_locked || isLoading} className="w-32 px-2 py-1 border border-slate-300 bg-white rounded-sm focus:outline-none focus:border-slate-500 disabled:opacity-50 disabled:bg-slate-100" value={form.tanggal_spt||''} onChange={e=>setForm({...form, tanggal_spt:e.target.value})} />
        </div>
      </div>

      {/* Main Form Scrollable Area */}
      <div className="flex-1 overflow-y-auto bg-white flex flex-col p-6 gap-8">
        
        {/* SECTION I */}
        <div>
          <div className="font-bold text-sm border-b border-slate-200 mb-3 pb-2 text-slate-800">I. PENYERAHAN BARANG DAN JASA</div>
          <div className="flex gap-6">
            <div className="flex-1 max-w-3xl">
              <div className="grid grid-cols-[1fr_120px_120px] gap-3 font-semibold text-center mb-2 text-slate-600">
                <div></div><div className="border-b border-slate-300 pb-1">DPP</div><div className="border-b border-slate-300 pb-1">PPN</div>
              </div>
              <div className="font-semibold mb-2 text-slate-700">A. Terutang PPN</div>
              <div className="pl-4 flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_120px_120px] gap-3 items-center">
                  <span className="text-slate-600">1. Ekspor</span><input {...numProps('dpp_ekspor')} /><input className={readOnlyClass} readOnly value="0" />
                </div>
                <div className="grid grid-cols-[1fr_120px_120px] gap-3 items-center">
                  <span className="text-slate-600">2. Penyerahan yang PPN-nya harus dipungut sendiri</span><input {...numProps('dpp_dipungut_sendiri')} /><input {...numProps('ppn_dipungut_sendiri')} />
                </div>
                <div className="grid grid-cols-[1fr_120px_120px] gap-3 items-center">
                  <span className="text-slate-600">3. Penyerahan yang PPN-nya dipungut oleh Pemungut PPN</span><input {...numProps('dpp_dipungut_pemungut')} /><input {...numProps('ppn_dipungut_pemungut')} />
                </div>
                <div className="grid grid-cols-[1fr_120px_120px] gap-3 items-center">
                  <span className="text-slate-600">4. Penyerahan yang PPN-nya tidak dipungut</span><input {...numProps('dpp_tidak_dipungut')} /><input {...numProps('ppn_tidak_dipungut')} />
                </div>
                <div className="grid grid-cols-[1fr_120px_120px] gap-3 items-center">
                  <span className="text-slate-600">5. Penyerahan yang dibebaskan dari pengenaan PPN</span><input {...numProps('dpp_dibebaskan')} /><input {...numProps('ppn_dibebaskan')} />
                </div>
                <div className="grid grid-cols-[1fr_120px_120px] gap-3 items-center mt-2">
                  <span className="font-semibold text-slate-800">Jumlah (I.A.1+I.A.2+I.A.3+I.A.4+I.A.5)</span>
                  <input className={readOnlyClass} readOnly value={sumA_DPP.toLocaleString()} />
                  <input className={readOnlyClass} readOnly value={sumA_PPN.toLocaleString()} />
                </div>
              </div>
              
              <div className="grid grid-cols-[1fr_120px_120px] gap-3 items-center mt-4 font-semibold">
                <span className="text-slate-700">B. Tidak Terutang PPN</span><input {...numProps('dpp_tidak_terutang')} /><div></div>
              </div>
              <div className="grid grid-cols-[1fr_120px_120px] gap-3 items-center mt-2 font-semibold">
                <span className="text-slate-800">C. Jumlah Seluruh Penyerahan (I.A + I.B)</span>
                <input className={readOnlyClass} readOnly value={totalPenyerahan_DPP.toLocaleString()} />
                <div></div>
              </div>
            </div>

            {/* Akumulasi Box */}
            <div className={`w-80 border rounded-sm h-fit shadow-sm transition-opacity ${form.is_locked ? 'opacity-70 border-slate-200' : 'border-slate-300'}`}>
              <div className="bg-slate-50 text-slate-700 text-center font-semibold py-2 border-b border-slate-200 text-xs">Akumulasi Seluruh Penyerahan</div>
              <div className="grid grid-cols-2 bg-slate-50 text-slate-600 text-center font-semibold py-1 border-b border-slate-200 text-[10px]">
                <div>DPP</div><div>PPN</div>
              </div>
              <div className="p-3 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-3"><input className={readOnlyClass} value="0" readOnly/><input className={readOnlyClass} value="0" readOnly/></div>
                <div className="grid grid-cols-2 gap-3 mt-1"><input className={readOnlyClass} value={(form.dpp_dipungut_sendiri||0).toLocaleString()} readOnly/><input className={readOnlyClass} value={(form.ppn_dipungut_sendiri||0).toLocaleString()} readOnly/></div>
                <div className="grid grid-cols-2 gap-3 mt-1"><input className={readOnlyClass} value={(form.dpp_dipungut_pemungut||0).toLocaleString()} readOnly/><input className={readOnlyClass} value={(form.ppn_dipungut_pemungut||0).toLocaleString()} readOnly/></div>
                <div className="grid grid-cols-2 gap-3 mt-1"><input className={readOnlyClass} value={(form.dpp_tidak_dipungut||0).toLocaleString()} readOnly/><input className={readOnlyClass} value={(form.ppn_tidak_dipungut||0).toLocaleString()} readOnly/></div>
                <div className="grid grid-cols-2 gap-3 mt-1"><input className={readOnlyClass} value={(form.dpp_dibebaskan||0).toLocaleString()} readOnly/><input className={readOnlyClass} value={(form.ppn_dibebaskan||0).toLocaleString()} readOnly/></div>
                <div className="grid grid-cols-2 gap-3 mt-2"><input className={readOnlyClass} value={sumA_DPP.toLocaleString()} readOnly/><input className={readOnlyClass} value={sumA_PPN.toLocaleString()} readOnly/></div>
                <div className="grid grid-cols-2 gap-3 mt-2"><input className={readOnlyClass} value={(form.dpp_tidak_terutang||0).toLocaleString()} readOnly/><div></div></div>
                <div className="grid grid-cols-2 gap-3 mt-1"><input className={readOnlyClass} value={totalPenyerahan_DPP.toLocaleString()} readOnly/><div></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION II */}
        <div>
          <div className="font-bold text-sm border-b border-slate-200 mb-3 pb-2 text-slate-800">II. PENGHITUNGAN PPN KURANG BAYAR / LEBIH BAYAR</div>
          <div className="pl-4 flex flex-col gap-2 max-w-[900px]">
            <div className="grid grid-cols-[1fr_120px_100px] gap-3 items-center">
              <span className="text-slate-600">A. Pajak Keluaran yang harus dipungut sendiri (Jumlah PPN pada I.A.2)</span>
              <input className={readOnlyClass} readOnly value={pajakKeluaran.toLocaleString()} />
            </div>
            <div className="grid grid-cols-[1fr_120px_100px] gap-3 items-center">
              <span className="text-slate-600">B. PPN Disetor Dimuka Dalam Masa Pajak Yang Sama</span>
              <input {...numProps('ppn_disetor_dimuka')} />
            </div>
            <div className="grid grid-cols-[1fr_120px_120px_120px] gap-3 items-center">
              <span className="text-slate-600">C. Pajak Masukan yang dapat diperhitungkan</span>
              <input {...numProps('pajak_masukan_diperhitungkan')} />
              <div></div>
              <input className={readOnlyClass} readOnly value={(form.pajak_masukan_diperhitungkan||0).toLocaleString()} />
            </div>
            <div className="grid grid-cols-[1fr_120px_100px] gap-3 items-center font-semibold">
              <span className="text-slate-800">D. PPN yang kurang atau (lebih) bayar (II.A - II.B - II.C)</span>
              <input className={readOnlyClass} readOnly value={kurangLebihBayar_D.toLocaleString()} />
            </div>
            <div className="grid grid-cols-[1fr_120px_100px] gap-3 items-center">
              <span className="text-slate-600">E. PPN yang kurang atau (lebih) bayar pada SPT yang dibetulkan</span>
              <input {...numProps('ppn_spt_dibetulkan')} />
            </div>
            <div className="grid grid-cols-[1fr_120px_100px] gap-3 items-center font-semibold">
              <span className="text-slate-800">F. PPN yang kurang atau (lebih) bayar karena pembetulan (II.D - II.E)</span>
              <input className={readOnlyClass} readOnly value={kurangLebihBayar_F.toLocaleString()} />
            </div>
            <div className="flex items-center gap-3 mt-2 pl-4 py-1 border-l border-slate-200 ml-4">
              <span className="w-72 text-slate-600">G. PPN yang kurang dibayar dilunasi tanggal</span>
              <input type="date" disabled={form.is_locked || isLoading} className={`${textInputClass} w-32`} value={form.tgl_lunas_kurang_bayar||''} onChange={e=>setForm({...form, tgl_lunas_kurang_bayar:e.target.value})} />
              <span className="ml-4 font-semibold text-slate-700">NTPN</span>
              <input type="text" disabled={form.is_locked || isLoading} className={`${textInputClass} w-48 uppercase font-mono`} value={form.ntpn_kurang_bayar||''} onChange={e=>setForm({...form, ntpn_kurang_bayar:e.target.value})} />
            </div>

            {/* Bagian H (Lebih Bayar) */}
            <div className={`mt-4 border border-slate-200 rounded-sm p-4 shadow-sm transition-colors ${form.is_locked ? 'bg-slate-50' : 'bg-white'}`}>
              <div className="font-semibold mb-3 text-slate-800">H. PPN Lebih Dibayar pada:</div>
              <div className="pl-4 flex flex-col gap-3">
                <div className="flex items-center gap-6">
                  <label className={`flex items-center gap-2 cursor-pointer text-slate-700 ${form.is_locked ? 'opacity-50' : ''}`}>
                    <input {...radioProps('lebih_bayar_pada', '1.1')}/> 1.1 Butir II.D (SPT Bukan Pembetulan)
                  </label>
                  <label className={`flex items-center gap-2 cursor-pointer text-slate-700 ${form.is_locked ? 'opacity-50' : ''}`}>
                    <input {...radioProps('lebih_bayar_pada', '1.2')}/> 1.2 Butir II.D atau Butir II.F (SPT Pembetulan)
                  </label>
                </div>
                <div className="flex items-center gap-6 mt-1">
                  <span className="w-24 font-semibold text-slate-700">Oleh :</span>
                  <label className={`flex items-center gap-2 cursor-pointer text-slate-700 ${form.is_locked ? 'opacity-50' : ''}`}>
                    <input {...radioProps('lebih_bayar_oleh', '2.1')}/> 2.1 PKP Pasal 9 ayat (4b) PPN
                  </label>
                  <span className="text-slate-400 italic text-[11px]">atau</span>
                  <label className={`flex items-center gap-2 cursor-pointer text-slate-700 ${form.is_locked ? 'opacity-50' : ''}`}>
                    <input {...radioProps('lebih_bayar_oleh', '2.2')}/> 2.2 Selain PKP Pasal 9 ayat (4b) PPN
                  </label>
                </div>
                <div className="flex items-start gap-6 mt-2">
                  <span className="w-24 font-semibold pt-1 text-slate-700">Diminta untuk :</span>
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-3">
                      <label className={`flex items-center gap-2 cursor-pointer text-slate-700 ${form.is_locked ? 'opacity-50' : ''}`}>
                        <input {...radioProps('lebih_bayar_diminta_untuk', '3.1_next')}/> 3.1 Kompensasi ke Masa Pajak berikutnya
                      </label>
                      <span className="text-slate-400 italic text-[11px]">atau</span>
                      <label className={`flex items-center gap-2 cursor-pointer text-slate-700 ${form.is_locked ? 'opacity-50' : ''}`}>
                        <input {...radioProps('lebih_bayar_diminta_untuk', '3.1_other')}/> Kompensasi ke Masa Pajak:
                      </label>
                      <select disabled={form.is_locked || isLoading} className={`${textInputClass} w-28`} value={form.kompensasi_masa||''} onChange={e=>setForm({...form, kompensasi_masa:e.target.value})}>
                        <option value="">-Bulan-</option>
                        {bulanOptions.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
                      </select>
                      <input disabled={form.is_locked || isLoading} type="text" placeholder="Tahun" className={`${textInputClass} w-16 text-center`} value={form.kompensasi_tahun||''} onChange={e=>setForm({...form, kompensasi_tahun:e.target.value})}/>
                    </div>
                    
                    <label className={`flex items-center gap-2 cursor-pointer mt-1 font-semibold text-slate-800 ${form.is_locked ? 'opacity-50' : ''}`}>
                      <input {...radioProps('lebih_bayar_diminta_untuk', '3.2')}/> 3.2 Dikembalikan (Restitusi)
                    </label>
                    <div className="pl-6 flex flex-col gap-2 border-l border-slate-200 ml-2 mt-1">
                      <span className="font-semibold text-slate-600 mb-1 border-b border-slate-100 pb-1 inline-block w-max">Khusus Restitusi untuk PKP:</span>
                      <div className="flex items-center gap-4 text-slate-700">
                        <span className="w-64">atau <span className="font-semibold text-slate-800">Pasal 17C KUP</span> dilakukan dengan :</span>
                        <label className={`flex items-center gap-2 cursor-pointer ${form.is_locked ? 'opacity-50' : ''}`}><input {...radioProps('restitusi_pasal_17c', 'biasa')} name="r_17c" /> Prosedur biasa</label>
                        <span className="text-slate-400 italic text-[11px]">atau</span>
                        <label className={`flex items-center gap-2 cursor-pointer ${form.is_locked ? 'opacity-50' : ''}`}><input {...radioProps('restitusi_pasal_17c', 'pendahuluan')} name="r_17c" /> Pengembalian Pendahuluan</label>
                      </div>
                      <div className="flex items-center gap-4 text-slate-700">
                        <span className="w-64">atau <span className="font-semibold text-slate-800">Pasal 17D KUP</span> dilakukan dengan :</span>
                        <label className={`flex items-center gap-2 cursor-pointer ${form.is_locked ? 'opacity-50' : ''}`}><input {...radioProps('restitusi_pasal_17d', 'biasa')} name="r_17d" /> Prosedur biasa</label>
                        <span className="text-slate-400 italic text-[11px]">atau</span>
                        <label className={`flex items-center gap-2 cursor-pointer ${form.is_locked ? 'opacity-50' : ''}`}><input {...radioProps('restitusi_pasal_17d', 'pendahuluan')} name="r_17d" /> Pengembalian Pendahuluan</label>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-slate-700">
                        <span>atau <span className="font-semibold text-slate-800">Pasal 9 ayat (4c) PPN</span> dilakukan dengan Pengembalian Pendahuluan</span>
                        <input {...checkProps('restitusi_pasal_9_4c')} className="w-4 h-4 accent-slate-800 ml-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION III */}
        <div>
          <div className="font-bold text-sm border-b border-slate-200 mb-3 pb-2 text-slate-800">III. PPN TERUTANG ATAS KEGIATAN MEMBANGUN SENDIRI</div>
          <div className="pl-4 flex flex-col gap-3 max-w-[600px]">
            <div className="grid grid-cols-[1fr_150px] gap-3 items-center">
              <span className="text-slate-600">A. Dasar Pengenaan Pajak</span><input {...numProps('membangun_dpp')} />
            </div>
            <div className="grid grid-cols-[1fr_150px] gap-3 items-center">
              <span className="text-slate-600">B. PPN Terutang</span><input {...numProps('membangun_ppn')} />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-slate-600">C. Dilunasi tanggal <input disabled={form.is_locked || isLoading} type="text" className={`${textInputClass} w-28 mx-2 text-center`} placeholder="DD/MM/YYYY"/></span>
              <span className="font-semibold text-slate-700 ml-2">NTPN</span>
              <input disabled={form.is_locked || isLoading} type="text" className={`${textInputClass} flex-1 uppercase font-mono`} value={form.membangun_ntpn||''} onChange={e=>setForm({...form, membangun_ntpn:e.target.value})} />
            </div>
          </div>
        </div>

        {/* SECTION IV */}
        <div>
          <div className="font-bold text-sm border-b border-slate-200 mb-3 pb-2 text-slate-800">IV. PEMBAYARAN KEMBALI PAJAK MASUKAN BAGI PKP GAGAL BERPRODUKSI</div>
          <div className="pl-4 flex flex-col gap-3 max-w-[600px]">
            <div className="grid grid-cols-[1fr_150px] gap-3 items-center">
              <span className="text-slate-600">A. PPN yang wajib dibayar kembali</span><input {...numProps('gagal_produksi_ppn')} />
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-slate-600">B. Dilunasi tanggal <input disabled={form.is_locked || isLoading} type="text" className={`${textInputClass} w-28 mx-2 text-center`} placeholder="DD/MM/YYYY"/></span>
              <span className="font-semibold text-slate-700 ml-2">NTPN</span>
              <input disabled={form.is_locked || isLoading} type="text" className={`${textInputClass} flex-1 uppercase font-mono`} value={form.gagal_produksi_ntpn||''} onChange={e=>setForm({...form, gagal_produksi_ntpn:e.target.value})} />
            </div>
          </div>
        </div>

        {/* SECTION V */}
        <div>
          <div className="font-bold text-sm border-b border-slate-200 mb-3 pb-2 text-slate-800">V. PAJAK PENJUALAN ATAS BARANG MEWAH</div>
          <div className="pl-4 flex flex-col gap-3 max-w-[600px]">
            <div className="grid grid-cols-[1fr_150px] gap-3 items-center">
              <span className="text-slate-600">A. PPnBM yang terutang</span><input {...numProps('ppnbm_terutang')} />
            </div>
            <div className="grid grid-cols-[1fr_150px] gap-3 items-center">
              <span className="text-slate-600">B. PPnBM disetor dimuka dalam Masa Pajak yang sama</span><input {...numProps('ppnbm_disetor_dimuka')} />
            </div>
            <div className="grid grid-cols-[1fr_150px] gap-3 items-center font-semibold">
              <span className="text-slate-700">C. PPnBM yang kurang atau (lebih) bayar (V.A - V.B)</span><input className={readOnlyClass} readOnly value={ppnbm_D.toLocaleString()} />
            </div>
            <div className="grid grid-cols-[1fr_150px] gap-3 items-center">
              <span className="text-slate-600">D. PPnBM yang kurang atau (lebih) bayar pada SPT yang dibetulkan</span><input {...numProps('ppnbm_spt_dibetulkan')} />
            </div>
            <div className="grid grid-cols-[1fr_150px] gap-3 items-center font-semibold">
              <span className="text-slate-700">E. PPnBM yang kurang atau (lebih) bayar karena pembetulan (V.C - V.D)</span><input className={readOnlyClass} readOnly value={ppnbm_E.toLocaleString()} />
            </div>
            <div className="flex items-center gap-3 mt-1 pl-4 border-l border-slate-200 ml-4 py-1">
              <span className="text-slate-600">F. PPnBM kurang dibayar dilunasi tanggal</span>
              <input disabled={form.is_locked || isLoading} type="date" className={`${textInputClass} w-32`} value={form.tgl_lunas_ppnbm||''} onChange={e=>setForm({...form, tgl_lunas_ppnbm:e.target.value})} />
              <span className="ml-4 font-semibold text-slate-700">NTPN</span>
              <input disabled={form.is_locked || isLoading} type="text" className={`${textInputClass} flex-1 uppercase font-mono`} value={form.ppnbm_ntpn||''} onChange={e=>setForm({...form, ppnbm_ntpn:e.target.value})} />
            </div>
          </div>
        </div>

        {/* SECTION VI - KELENGKAPAN SPT & FOOTER */}
        <div>
          <div className="font-bold text-sm border-b border-slate-200 mb-3 pb-2 text-slate-800">VI. KELENGKAPAN SPT</div>
          <div className="pl-4">
            <div className={`grid grid-cols-3 gap-y-4 gap-x-8 max-w-4xl border border-slate-200 p-5 rounded-sm shadow-sm text-slate-700 transition-colors ${form.is_locked ? 'bg-slate-50' : 'bg-white'}`}>
              <label className={`flex items-center gap-2 cursor-pointer font-medium ${form.is_locked ? 'opacity-50' : ''}`}><input {...checkProps('lampiran_ae')}/> Formulir 1111 AE</label>
              <label className={`flex items-center gap-2 cursor-pointer font-medium ${form.is_locked ? 'opacity-50' : ''}`}><input {...checkProps('lampiran_a1')}/> Formulir 1111 A1</label>
              <label className={`flex items-center gap-2 cursor-pointer font-medium ${form.is_locked ? 'opacity-50' : ''}`}><input {...checkProps('lampiran_a2')}/> Formulir 1111 A2</label>
              
              <label className={`flex items-center gap-2 cursor-pointer font-medium ${form.is_locked ? 'opacity-50' : ''}`}><input {...checkProps('lampiran_b1')}/> Formulir 1111 B1</label>
              <label className={`flex items-center gap-2 cursor-pointer font-medium ${form.is_locked ? 'opacity-50' : ''}`}><input {...checkProps('lampiran_b2')}/> Formulir 1111 B2</label>
              <label className={`flex items-center gap-2 cursor-pointer font-medium ${form.is_locked ? 'opacity-50' : ''}`}><input {...checkProps('lampiran_b3')}/> Formulir 1111 B3</label>
              
              <div className="col-span-3 border-t border-slate-100 mt-2 pt-4 flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-2">
                  <span className="font-medium">SSP PPN</span><input {...numProps('ssp_ppn_lembar')} className={`${textInputClass} w-16 text-center text-sm`} /><span>lembar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">SSP PPn BM</span><input {...numProps('ssp_ppnbm_lembar')} className={`${textInputClass} w-16 text-center text-sm`} /><span>lembar</span>
                </div>
                <label className={`flex items-center gap-2 cursor-pointer font-semibold ml-4 ${form.is_locked ? 'opacity-50' : ''}`}><input {...checkProps('surat_kuasa')}/> Surat Kuasa Khusus</label>
              </div>
            </div>

            {/* Footer Signature Box */}
            <div className={`mt-6 border border-slate-200 max-w-lg p-5 shadow-sm flex flex-col gap-4 transition-colors ${form.is_locked ? 'bg-slate-50' : 'bg-white'}`}>
              <div className="flex items-center gap-8 mb-1">
                <label className={`flex items-center gap-2 cursor-pointer font-bold text-slate-800 ${form.is_locked ? 'opacity-50' : ''}`}><input {...radioProps('is_kuasa', false)}/> PKP</label>
                <label className={`flex items-center gap-2 cursor-pointer font-bold text-slate-800 ${form.is_locked ? 'opacity-50' : ''}`}><input {...radioProps('is_kuasa', true)}/> Kuasa</label>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 font-semibold text-slate-600">Lokasi</span>
                <input disabled={form.is_locked || isLoading} type="text" className={`${textInputClass} flex-1 py-1 px-3 text-sm`} value={form.lokasi_lapor||''} onChange={e=>setForm({...form, lokasi_lapor:e.target.value})}/>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 font-semibold text-slate-600">Nama</span>
                <input disabled={form.is_locked || isLoading} type="text" className={`${textInputClass} flex-1 font-bold uppercase py-1 px-3 text-sm`} value={form.ttd_nama||''} onChange={e=>setForm({...form, ttd_nama:e.target.value})}/>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-16 font-semibold text-slate-600">Jabatan</span>
                <input disabled={form.is_locked || isLoading} type="text" className={`${textInputClass} flex-1 py-1 px-3 text-sm`} value={form.ttd_jabatan||''} onChange={e=>setForm({...form, ttd_jabatan:e.target.value})}/>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default SptMasa1111;
