import React, { useState, useEffect } from 'react';
import { FilePlus, Trash2, Printer, Save, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Lock, Copy } from 'lucide-react';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { sptMasaApi, SptMasa1111Data } from '../api';
import toast from 'react-hot-toast';

const SptMasa1111: React.FC = () => {
  const confirm = useConfirm();

  const [dataList, setDataList] = useState<SptMasa1111Data[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [form, setForm] = useState<Partial<SptMasa1111Data>>({
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
    membangun_dpp: 0, membangun_ppn: 0
  });

  const [isNew, setIsNew] = useState(false);

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
      membangun_dpp: 0, membangun_ppn: 0
    });
    setIsNew(true);
  };

  const handleSave = async () => {
    try {
      await sptMasaApi.save(form as SptMasa1111Data);
      const resData = await sptMasaApi.getAll();
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
      toast.error('Gagal menyimpan SPT Masa 1111');
    }
  };

  const handleDelete = async () => {
    if (isNew || !form.id) return;
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus SPT ini?');
    if (!isConfirmed) return;
    try {
      await sptMasaApi.delete(form.id);
      const resData = await sptMasaApi.getAll();
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

  // Calculations
  const sumA_DPP = (form.dpp_ekspor||0) + (form.dpp_dipungut_sendiri||0) + (form.dpp_dipungut_pemungut||0) + (form.dpp_tidak_dipungut||0) + (form.dpp_dibebaskan||0);
  const sumA_PPN = (form.ppn_ekspor||0) + (form.ppn_dipungut_sendiri||0) + (form.ppn_dipungut_pemungut||0) + (form.ppn_tidak_dipungut||0) + (form.ppn_dibebaskan||0);
  
  const totalPenyerahan_DPP = sumA_DPP + (form.dpp_tidak_terutang||0);

  const pajakKeluaran = form.ppn_dipungut_sendiri || 0;
  const kurangLebihBayar_D = pajakKeluaran - (form.ppn_disetor_dimuka||0) - (form.pajak_masukan_diperhitungkan||0);
  const kurangLebihBayar_F = kurangLebihBayar_D - (form.ppn_spt_dibetulkan||0);

  const inputClass = "w-full px-2 py-0.5 border border-slate-300 bg-white text-xs text-right font-mono focus:outline-none focus:border-slate-500 focus:bg-slate-50 shadow-sm";
  const numProps = (field: keyof SptMasa1111Data) => ({
    type: "number",
    className: inputClass,
    value: (form[field] as string | number) || '',
    onChange: (e: any) => setForm({ ...form, [field]: Number(e.target.value) })
  });

  const bulanOptions = [
    {v:'01', l:'Januari'}, {v:'02', l:'Februari'}, {v:'03', l:'Maret'}, {v:'04', l:'April'},
    {v:'05', l:'Mei'}, {v:'06', l:'Juni'}, {v:'07', l:'Juli'}, {v:'08', l:'Agustus'},
    {v:'09', l:'September'}, {v:'10', l:'Oktober'}, {v:'11', l:'November'}, {v:'12', l:'Desember'}
  ];

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)] text-xs text-slate-800">

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-200/50 flex flex-col relative pb-8">
        
        {/* Top Header Bar inside content */}
        <div className="bg-slate-800 text-white px-4 py-2 border-b-2 border-slate-500 flex items-center justify-between sticky top-0 z-20">
          <h2 className="font-bold tracking-wider">Formulir 1111 Masa {form.masa_awal} s/d {form.masa_akhir} {form.tahun} Pembetulan Ke {form.pembetulan_ke}</h2>
        </div>

        {/* Action Header */}
        <div className="bg-slate-200 border-b border-slate-400 px-2 py-1.5 flex gap-1 sticky top-9 z-20 shadow-sm">
          <button onClick={handleNew} className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold flex items-center gap-1"><FilePlus size={14}/> TAMBAH BARU </button>
          <button onClick={handleDelete} className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold flex items-center gap-1"><Trash2 size={14}/> HAPUS </button>
          <button className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold"> TUTUP </button>
          <button className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold font-mono">AB</button>
          <button className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold flex items-center gap-1"><Copy size={14}/> Copy Data</button>
          <button className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold">Auto BUAT BARU SSP</button>
          <button className="px-3 py-1 bg-white border border-slate-400 hover:bg-slate-100 shadow-sm font-bold flex items-center gap-1"><Printer size={14}/> LAPORAN </button>
          <button className="px-3 py-1 bg-slate-300 border border-slate-400 hover:bg-slate-400 shadow-sm font-bold flex items-center gap-1"><Lock size={14}/> Lock SPT</button>
        </div>

        {/* Header Form */}
        <div className="bg-slate-50 border-b border-slate-400 p-2 flex flex-wrap items-center gap-4 text-xs font-semibold shrink-0">
          <div className="flex items-center gap-2">
            <span>Tahun:</span>
            <input type="text" className="w-16 px-2 py-0.5 border border-slate-400 bg-white" value={form.tahun||''} onChange={e=>setForm({...form, tahun:e.target.value})} />
            <button className="px-1 border border-slate-400 bg-slate-200">🔍</button>
          </div>
          <div className="flex items-center gap-2">
            <span>Masa:</span>
            <select className="border border-slate-400 bg-white py-0.5 px-1 w-24" value={form.masa_awal} onChange={e=>setForm({...form, masa_awal:e.target.value})}>
              {bulanOptions.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
            </select>
            <span>s/d</span>
            <select className="border border-slate-400 bg-white py-0.5 px-1 w-24" value={form.masa_akhir} onChange={e=>setForm({...form, masa_akhir:e.target.value})}>
              {bulanOptions.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>Pembetulan Ke:</span>
            <input type="number" className="w-12 px-2 py-0.5 border border-slate-400 bg-white text-center font-mono" value={form.pembetulan_ke} onChange={e=>setForm({...form, pembetulan_ke:Number(e.target.value)})} />
          </div>
          <div className="flex items-center gap-2 ml-4">
            <span>Tanggal SPT :</span>
            <input type="date" className="w-32 px-2 py-0.5 border border-slate-400 bg-white" value={form.tanggal_spt||''} onChange={e=>setForm({...form, tanggal_spt:e.target.value})} />
          </div>
          <div className="flex items-center gap-1 ml-4">
            <span>Locked</span>
            <input type="checkbox" checked={form.is_locked||false} onChange={e=>setForm({...form, is_locked:e.target.checked})} className="w-3 h-3" />
          </div>
        </div>

        {/* Section I */}
        <div className="border-b border-slate-400 p-2">
          <div className="font-bold mb-1">I. PENYERAHAN BARANG DAN JASA</div>
          <div className="pl-4 flex gap-4">
            <div className="flex-1 max-w-2xl">
              <div className="grid grid-cols-[1fr_120px_120px] gap-2 font-bold text-center mb-1">
                <div></div><div className="border-b border-slate-400 pb-1">DPP</div><div className="border-b border-slate-400 pb-1">PPN</div>
              </div>
              <div className="font-bold mb-1">A. Terutang PPN</div>
              <div className="pl-4 flex flex-col gap-1">
                <div className="grid grid-cols-[1fr_120px_120px] gap-2 items-center">
                  <span>1. Ekspor</span><input {...numProps('dpp_ekspor')} /><input {...numProps('ppn_ekspor')} className={`${inputClass} bg-slate-100`} readOnly value="0" />
                </div>
                <div className="grid grid-cols-[1fr_120px_120px] gap-2 items-center">
                  <span>2. Penyerahan yang PPN-nya harus dipungut sendiri</span><input {...numProps('dpp_dipungut_sendiri')} /><input {...numProps('ppn_dipungut_sendiri')} />
                </div>
                <div className="grid grid-cols-[1fr_120px_120px] gap-2 items-center">
                  <span>3. Penyerahan yang PPN-nya dipungut oleh Pemungut PPN</span><input {...numProps('dpp_dipungut_pemungut')} /><input {...numProps('ppn_dipungut_pemungut')} />
                </div>
                <div className="grid grid-cols-[1fr_120px_120px] gap-2 items-center">
                  <span>4. Penyerahan yang PPN-nya tidak dipungut</span><input {...numProps('dpp_tidak_dipungut')} /><input {...numProps('ppn_tidak_dipungut')} />
                </div>
                <div className="grid grid-cols-[1fr_120px_120px] gap-2 items-center">
                  <span>5. Penyerahan yang dibebaskan dari pengenaan PPN</span><input {...numProps('dpp_dibebaskan')} /><input {...numProps('ppn_dibebaskan')} />
                </div>
                <div className="grid grid-cols-[1fr_120px_120px] gap-2 items-center mt-1">
                  <span className="font-bold">Jumlah (I.A.1+I.A.2+I.A.3+I.A.4+I.A.5)</span>
                  <input className={`${inputClass} bg-slate-100 font-bold`} readOnly value={sumA_DPP} />
                  <input className={`${inputClass} bg-slate-100 font-bold`} readOnly value={sumA_PPN} />
                </div>
              </div>
              
              <div className="grid grid-cols-[1fr_120px_120px] gap-2 items-center mt-2 font-bold">
                <span>B. Tidak Terutang PPN</span><input {...numProps('dpp_tidak_terutang')} /><div></div>
              </div>
              <div className="grid grid-cols-[1fr_120px_120px] gap-2 items-center mt-1 font-bold">
                <span>C. Jumlah Seluruh Penyerahan (I.A + I.B)</span>
                <input className={`${inputClass} bg-slate-100 font-bold`} readOnly value={totalPenyerahan_DPP} />
                <div></div>
              </div>
            </div>

            {/* Akumulasi Box */}
            <div className="w-80 border border-slate-500 bg-white">
              <div className="bg-slate-700 text-white text-center font-bold py-0.5 border-b border-slate-500">Akumulasi</div>
              <div className="grid grid-cols-2 bg-slate-700 text-white text-center font-bold pb-1 text-[10px]">
                <div>DPP</div><div>PPN</div>
              </div>
              <div className="p-1 flex flex-col gap-1">
                <div className="grid grid-cols-2 gap-1"><input className={`${inputClass} bg-slate-100`} value="0" readOnly/><input className={`${inputClass} bg-slate-100`} value="0" readOnly/></div>
                <div className="grid grid-cols-2 gap-1 mt-[5px]"><input className={`${inputClass} bg-slate-100`} value={form.dpp_dipungut_sendiri||0} readOnly/><input className={`${inputClass} bg-slate-100`} value={form.ppn_dipungut_sendiri||0} readOnly/></div>
                <div className="grid grid-cols-2 gap-1 mt-[5px]"><input className={`${inputClass} bg-slate-100`} value={form.dpp_dipungut_pemungut||0} readOnly/><input className={`${inputClass} bg-slate-100`} value={form.ppn_dipungut_pemungut||0} readOnly/></div>
                <div className="grid grid-cols-2 gap-1 mt-[5px]"><input className={`${inputClass} bg-slate-100`} value={form.dpp_tidak_dipungut||0} readOnly/><input className={`${inputClass} bg-slate-100`} value={form.ppn_tidak_dipungut||0} readOnly/></div>
                <div className="grid grid-cols-2 gap-1 mt-[5px]"><input className={`${inputClass} bg-slate-100`} value={form.dpp_dibebaskan||0} readOnly/><input className={`${inputClass} bg-slate-100`} value={form.ppn_dibebaskan||0} readOnly/></div>
                <div className="grid grid-cols-2 gap-1 mt-[9px]"><input className={`${inputClass} bg-slate-100 font-bold`} value={sumA_DPP} readOnly/><input className={`${inputClass} bg-slate-100 font-bold`} value={sumA_PPN} readOnly/></div>
                <div className="grid grid-cols-2 gap-1 mt-[8px]"><input className={`${inputClass} bg-slate-100`} value={form.dpp_tidak_terutang||0} readOnly/><div></div></div>
                <div className="grid grid-cols-2 gap-1 mt-[5px]"><input className={`${inputClass} bg-slate-100 font-bold`} value={totalPenyerahan_DPP} readOnly/><div></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section II */}
        <div className="border-b border-slate-400 p-2">
          <div className="font-bold mb-1">II. PENGHITUNGAN PPN KURANG BAYAR/LEBIH BAYAR</div>
          <div className="pl-4 flex flex-col gap-1 max-w-[800px]">
            <div className="grid grid-cols-[1fr_120px_100px] gap-2 items-center">
              <span>A. Pajak Keluaran yang harus dipungut sendiri (Jumlah PPN pada I.A.2)</span>
              <input className={`${inputClass} bg-slate-100 font-bold`} readOnly value={pajakKeluaran} />
            </div>
            <div className="grid grid-cols-[1fr_120px_100px] gap-2 items-center">
              <span>B. PPN Disetor Dimuka Dalam Masa Pajak Yang Sama</span>
              <input {...numProps('ppn_disetor_dimuka')} />
            </div>
            <div className="grid grid-cols-[1fr_120px_120px_120px] gap-2 items-center">
              <span>C. Pajak Masukan yang dapat diperhitungkan</span>
              <input {...numProps('pajak_masukan_diperhitungkan')} />
              <div></div>
              <input className={`${inputClass} bg-slate-100`} readOnly value={form.pajak_masukan_diperhitungkan||0} />
            </div>
            <div className="grid grid-cols-[1fr_120px_100px] gap-2 items-center mt-1">
              <span>D. PPN yang kurang atau (lebih) bayar (II.A - II.B - II.C)</span>
              <input className={`${inputClass} bg-slate-100 font-bold`} readOnly value={kurangLebihBayar_D} />
            </div>
            <div className="grid grid-cols-[1fr_120px_60px] gap-2 items-center">
              <span>E. PPN yang kurang atau (lebih) bayar pada SPT yang dibetulkan</span>
              <input {...numProps('ppn_spt_dibetulkan')} />
              <button className="bg-slate-200 border border-slate-400 text-[10px] py-0.5">Calc</button>
            </div>
            <div className="grid grid-cols-[1fr_120px_100px] gap-2 items-center mt-1">
              <span>F. PPN yang kurang atau (lebih) bayar karena pembetulan (II.D - II.E)</span>
              <input className={`${inputClass} bg-slate-100 font-bold`} readOnly value={kurangLebihBayar_F} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-80">G. PPN yang kurang dibayar dilunasi tanggal</span>
              <input type="date" className="w-32 px-2 py-0.5 border border-slate-400 bg-white" value={form.tgl_lunas_kurang_bayar||''} onChange={e=>setForm({...form, tgl_lunas_kurang_bayar:e.target.value})} />
              <span className="ml-4">NTPN</span>
              <input type="text" className="w-48 px-2 py-0.5 border border-slate-400 bg-white uppercase font-mono" value={form.ntpn_kurang_bayar||''} onChange={e=>setForm({...form, ntpn_kurang_bayar:e.target.value})} />
            </div>

            {/* Bagian H */}
            <div className="mt-2 font-bold">H. PPN Lebih Dibayar pada:</div>
            <div className="pl-4 flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="h_lebih" checked={form.lebih_bayar_pada==='1.1'} onChange={()=>setForm({...form, lebih_bayar_pada:'1.1'})}/> 1.1 Butir II.D (Diisi dalam hal SPT Bukan Pembetulan)</label>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="h_lebih" checked={form.lebih_bayar_pada==='1.2'} onChange={()=>setForm({...form, lebih_bayar_pada:'1.2'})}/> 1.2 Butir II.D atau Butir II.F (Diisi dalam hal SPT Pembetulan)</label>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <span className="w-24">Oleh :</span>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="h_oleh" checked={form.lebih_bayar_oleh==='2.1'} onChange={()=>setForm({...form, lebih_bayar_oleh:'2.1'})}/> 2.1 PKP Pasal 9 ayat (4b) PPN</label>
                <span className="ml-8">atau</span>
                <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="h_oleh" checked={form.lebih_bayar_oleh==='2.2'} onChange={()=>setForm({...form, lebih_bayar_oleh:'2.2'})}/> 2.2 Selain PKP Pasal 9 ayat (4b) PPN</label>
              </div>
              <div className="flex items-start gap-4 mt-1">
                <span className="w-24 pt-1">Diminta untuk :</span>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1 cursor-pointer"><input type="radio" name="h_diminta" checked={form.lebih_bayar_diminta_untuk==='3.1_next'} onChange={()=>setForm({...form, lebih_bayar_diminta_untuk:'3.1_next'})}/> 3.1 Dikompensasikan ke Masa Pajak berikutnya</label>
                    <span className="ml-12">atau</span>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input type="radio" name="h_diminta" checked={form.lebih_bayar_diminta_untuk==='3.1_other'} onChange={()=>setForm({...form, lebih_bayar_diminta_untuk:'3.1_other'})}/> Dikompensasikan ke Masa Pajak
                    </label>
                    <select className="border border-slate-400 bg-white py-0.5 px-1 w-24 ml-1" value={form.kompensasi_masa||''} onChange={e=>setForm({...form, kompensasi_masa:e.target.value})}>
                      <option value=""></option>
                      {bulanOptions.map(b => <option key={b.v} value={b.v}>{b.l}</option>)}
                    </select>
                    <span>Tahun:</span>
                    <input type="text" className="w-16 px-1 py-0.5 border border-slate-400 bg-white" value={form.kompensasi_tahun||''} onChange={e=>setForm({...form, kompensasi_tahun:e.target.value})}/>
                  </div>
                  
                  <label className="flex items-center gap-1 cursor-pointer mt-1"><input type="radio" name="h_diminta" checked={form.lebih_bayar_diminta_untuk==='3.2'} onChange={()=>setForm({...form, lebih_bayar_diminta_untuk:'3.2'})}/> 3.2 Dikembalikan (Restitusi)</label>
                  <div className="pl-6 flex flex-col gap-1">
                    <span>Khusus Restitusi untuk PKP:</span>
                    <div className="flex items-center gap-2">
                      <span className="w-48">atau <span className="font-bold">Pasal 17C KUP</span> dilakukan dengan :</span>
                      <label className="flex items-center gap-1"><input type="radio" name="r_17c" checked={form.restitusi_pasal_17c==='biasa'} onChange={()=>setForm({...form, restitusi_pasal_17c:'biasa'})}/> Prosedur biasa</label>
                      <span className="mx-2">atau</span>
                      <label className="flex items-center gap-1"><input type="radio" name="r_17c" checked={form.restitusi_pasal_17c==='pendahuluan'} onChange={()=>setForm({...form, restitusi_pasal_17c:'pendahuluan'})}/> Pengembalian Pendahuluan</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-48">atau <span className="font-bold">Pasal 17D KUP</span> dilakukan dengan :</span>
                      <label className="flex items-center gap-1"><input type="radio" name="r_17d" checked={form.restitusi_pasal_17d==='biasa'} onChange={()=>setForm({...form, restitusi_pasal_17d:'biasa'})}/> Prosedur biasa</label>
                      <span className="mx-2">atau</span>
                      <label className="flex items-center gap-1"><input type="radio" name="r_17d" checked={form.restitusi_pasal_17d==='pendahuluan'} onChange={()=>setForm({...form, restitusi_pasal_17d:'pendahuluan'})}/> Pengembalian Pendahuluan</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-auto">atau <span className="font-bold">Pasal 9 ayat (4c) PPN</span> dilakukan dengan Pengembalian Pendahuluan</span>
                      <input type="checkbox" className="ml-2" checked={form.restitusi_pasal_9_4c||false} onChange={e=>setForm({...form, restitusi_pasal_9_4c:e.target.checked})}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section III */}
        <div className="p-2">
          <div className="font-bold mb-1">III. PPN TERUTANG ATAS KEGIATAN MEMBANGUN SENDIRI</div>
          <div className="pl-4 flex flex-col gap-1 max-w-[350px]">
            <div className="grid grid-cols-[1fr_120px] gap-2 items-center">
              <span>A. Jumlah Dasar Pengenaan Pajak</span><input {...numProps('membangun_dpp')} />
            </div>
            <div className="grid grid-cols-[1fr_120px] gap-2 items-center">
              <span>B. PPN Terutang</span><input {...numProps('membangun_ppn')} />
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL FOOTER: Record Navigation & SIMPAN Button */}
      <div className="bg-slate-200 border-t-2 border-slate-400 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center">
          <span className="font-bold text-slate-700 mr-3">Record:</span>
          <div className="flex items-center gap-1">
            <button onClick={() => loadRecord(0)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white shadow-sm"><ChevronsLeft size={14} /></button>
            <button onClick={() => loadRecord(currentIndex - 1)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white shadow-sm"><ChevronLeft size={14} /></button>
            <div className="px-4 py-0.5 border border-slate-400 bg-white text-center w-16 font-mono mx-1 shadow-inner">{isNew ? '*' : currentIndex + 1}</div>
            <button onClick={() => loadRecord(currentIndex + 1)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white shadow-sm"><ChevronRight size={14} /></button>
            <button onClick={() => loadRecord(dataList.length - 1)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white shadow-sm"><ChevronsRight size={14} /></button>
          </div>
          <span className="font-bold text-slate-700 ml-3">of {dataList.length}</span>
          <span className="text-slate-500 ml-6 font-mono bg-slate-100 px-2 py-0.5 border border-slate-300">{isNew ? 'New Form' : 'Form View'}</span>
        </div>

        <button onClick={handleSave} className="flex items-center gap-1.5 px-6 py-1.5 bg-blue-700 border border-blue-800 hover:bg-blue-800 text-white font-bold shadow-sm">
          <Save size={14} /> SIMPAN DATA
        </button>
      </div>

    </div>
  );
};

export default SptMasa1111;
