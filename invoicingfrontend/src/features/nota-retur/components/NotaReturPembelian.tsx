import React, { useState, useEffect } from 'react';
import { FilePlus, Trash2, Printer, Save, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, UserPlus } from 'lucide-react';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { notaReturPembelianApi, NotaReturPembelianData, NotaReturPembelianLine } from '../apiPembelian';
import { setupApi, SupplierData, MataUangData, ItemData } from '../../setup/api';
import toast from 'react-hot-toast';

const NotaReturPembelian: React.FC = () => {
  const confirm = useConfirm();

  const [dataList, setDataList] = useState<NotaReturPembelianData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [mataUangs, setMataUangs] = useState<MataUangData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);

  const [form, setForm] = useState<Partial<NotaReturPembelianData>>({
    no_nota: '', tgl_nota: new Date().toISOString().split('T')[0], supplier_id: null,
    alamat_penjual: '', jenis_retur: 'Barang Kena Pajak', gudang_id: 'Kapuk',
    atas_no_fp: '', tgl_fp: '', mata_uang_id: null, kurs_pajak: 1, tarif_ppn: 11,
    jenis_transaksi: 'Kepada Bukan Pemungut PPN (01)', status: '',
    lines: [{ item_id: null, kode_barang: '', nama_barang: '', satuan: 'Pcs', kuantum: 1, harga_satuan: 0, harga_jual: 0 }],
    tanda_tangan: '', jabatan: ''
  });

  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [resData, s, m, i] = await Promise.all([
        notaReturPembelianApi.getAll(), setupApi.getSupplier(), setupApi.getMataUang(), setupApi.getItem()
      ]);

      const nData = resData || [];
      setDataList(nData);
      setSuppliers(s || []); setMataUangs(m || []); setItems(i || []);

      if (nData.length > 0) {
        setForm(nData[0]);
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

  const handleNew = async () => {
    try {
      const res = await notaReturPembelianApi.autoNo();
      setForm({
        no_nota: res.no_nota, tgl_nota: new Date().toISOString().split('T')[0], supplier_id: null,
        alamat_penjual: '', jenis_retur: 'Barang Kena Pajak', gudang_id: 'Kapuk',
        atas_no_fp: '', tgl_fp: '', mata_uang_id: null, kurs_pajak: 1, tarif_ppn: 11,
        jenis_transaksi: 'Kepada Bukan Pemungut PPN (01)', status: '',
        lines: [{ item_id: null, kode_barang: '', nama_barang: '', satuan: 'Pcs', kuantum: 1, harga_satuan: 0, harga_jual: 0 }],
        tanda_tangan: '', jabatan: ''
      });
      setIsNew(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    try {
      if (!form.supplier_id) {
        toast.error('Supplier (Nama Penjual) harus dipilih');
        return;
      }
      
      await notaReturPembelianApi.save(form as NotaReturPembelianData);
      const resData = await notaReturPembelianApi.getAll();
      const nData = resData || [];
      setDataList(nData);

      if (isNew) {
        setCurrentIndex(nData.length - 1);
        setForm(nData[nData.length - 1]);
        setIsNew(false);
      } else {
        setForm(nData[currentIndex]);
      }
      toast.success('Data berhasil disimpan');
    } catch (error) {
      toast.error('Gagal menyimpan Nota Retur Pembelian');
    }
  };

  const handleDelete = async () => {
    if (isNew || !form.id) return;
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus Nota Retur Pembelian ini?');
    if (!isConfirmed) return;
    try {
      await notaReturPembelianApi.delete(form.id);
      const resData = await notaReturPembelianApi.getAll();
      const nData = resData || [];
      setDataList(nData);

      if (nData.length > 0) {
        const newIdx = Math.min(currentIndex, nData.length - 1);
        setCurrentIndex(newIdx);
        setForm(nData[newIdx]);
      } else {
        handleNew();
      }
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  const calculateSubtotal = () => {
    return (form.lines || []).reduce((acc, line) => acc + (line.harga_jual || 0), 0);
  };

  const dpp = calculateSubtotal();
  const ppnAmount = dpp * (form.tarif_ppn || 11) / 100;

  const handleSupplierChange = (id: number) => {
    const s = suppliers.find(x => x.id === id);
    setForm({ ...form, supplier_id: id, alamat_penjual: s?.alamat || '' });
  };

  const addLine = () => {
    setForm({
      ...form,
      lines: [...(form.lines || []), { item_id: null, kode_barang: '', nama_barang: '', satuan: 'Pcs', kuantum: 1, harga_satuan: 0, harga_jual: 0 }]
    });
  };

  const removeLine = (idx: number) => {
    const newLines = [...(form.lines || [])];
    newLines.splice(idx, 1);
    setForm({ ...form, lines: newLines });
  };

  const updateLine = (idx: number, field: keyof NotaReturPembelianLine, value: any) => {
    const newLines = [...(form.lines || [])];
    const line = { ...newLines[idx], [field]: value };
    if (field === 'item_id' && value) {
      const item = items.find(x => x.id === value);
      if (item) {
        line.kode_barang = item.kode;
        line.nama_barang = item.nama;
        line.satuan = item.satuan || 'Pcs';
        // @ts-ignore
        line.harga_satuan = item.harga_satuan || item.harga_jual_1 || 0;
      }
    }
    
    line.harga_jual = line.kuantum * line.harga_satuan;
    
    newLines[idx] = line;
    setForm({ ...form, lines: newLines });
  };

  const inputClass = "w-full px-2 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white";
  const labelClass = "text-xs font-semibold text-slate-700 w-32 shrink-0 pt-1.5";

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">

      {/* Top Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Nota Retur Pembelian</h2>
          <p className="text-xs text-slate-300 mt-1">Formulir PPN dan nota retur pembelian.</p>
        </div>
        <div className="text-sm font-semibold text-slate-600 flex items-center gap-2">
          <span className="bg-slate-700 text-white border border-slate-600 px-3 py-1 rounded-sm shadow-sm">{form.no_nota || 'New Retur'}</span>
          <span className="text-xs text-slate-300">{form.supplier_id ? suppliers.find(p => p.id === form.supplier_id)?.nama : 'Belum pilih penjual'}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-100 flex flex-col relative">
        <div className="p-4 bg-white border-b border-slate-300 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-3 shrink-0 px-6 shadow-sm z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-start">
              <label className={labelClass}>No. Nota Retur</label>
              <div className="flex gap-1 flex-1">
                <input type="text" className={`${inputClass} font-mono bg-slate-50`} readOnly value={form.no_nota || ''} />
                <button className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm text-xs font-bold text-slate-700">Auto No</button>
              </div>
            </div>
            <div className="flex items-start">
              <label className={labelClass}>Tgl Nota Retur</label>
              <input type="date" className={`${inputClass} w-40`} value={form.tgl_nota || ''} onChange={e => setForm({...form, tgl_nota: e.target.value})} />
            </div>
            <div className="flex items-start">
              <label className={labelClass}>Nama Penjual</label>
              <div className="flex gap-1 flex-1">
                <select className={inputClass} value={form.supplier_id || ''} onChange={e => handleSupplierChange(Number(e.target.value))}>
                  <option value="">-- Pilih --</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                </select>
                <button className="px-2 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm text-slate-700"><UserPlus size={14}/></button>
              </div>
            </div>
            <div className="flex items-start">
              <label className={labelClass}>Alamat Penjual</label>
              <textarea className={`${inputClass} h-16 resize-none bg-slate-50`} value={form.alamat_penjual || ''} readOnly />
            </div>
            <div className="flex items-start">
              <label className={labelClass}>Jenis Retur</label>
              <select className={`${inputClass} w-56`} value={form.jenis_retur || ''} onChange={e => setForm({...form, jenis_retur: e.target.value})}>
                <option>Barang Kena Pajak</option>
                <option>Non BKP</option>
              </select>
            </div>
            <div className="flex items-start">
              <label className={labelClass}>Gudang</label>
              <select className={`${inputClass} w-48`} value={form.gudang_id || ''} onChange={e => setForm({...form, gudang_id: e.target.value})}>
                <option>Kapuk</option>
                <option>Utama</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-start">
              <label className={labelClass}>Atas No. FP</label>
              <div className="flex gap-2 flex-1 items-center">
                <input type="text" className={`${inputClass} flex-1`} value={form.atas_no_fp || ''} onChange={e => setForm({...form, atas_no_fp: e.target.value})} />
                <span className="text-xs font-semibold text-slate-600 w-8">Tgl</span>
                <input type="date" className={`${inputClass} w-36`} value={form.tgl_fp || ''} onChange={e => setForm({...form, tgl_fp: e.target.value})} />
              </div>
            </div>
            <div className="flex items-start mt-1">
              <label className={labelClass}>Mata Uang</label>
              <div className="flex gap-2 flex-1 items-center">
                <select className={`${inputClass} w-24`} value={form.mata_uang_id || ''} onChange={e => setForm({...form, mata_uang_id: Number(e.target.value) || null})}>
                  <option value="">--</option>
                  {mataUangs.map(m => <option key={m.id} value={m.id}>{m.kode}</option>)}
                </select>
                <span className="text-xs font-semibold text-slate-600 w-16 ml-2">Kurs Pajak:</span>
                <input type="number" className={`${inputClass} w-32 text-right`} value={form.kurs_pajak || ''} onChange={e => setForm({...form, kurs_pajak: Number(e.target.value)})} />
              </div>
            </div>
            <div className="flex items-start">
              <label className={labelClass}>Tarif PPN</label>
              <div className="flex gap-1 items-center">
                <input type="number" className={`${inputClass} w-20 text-center`} value={form.tarif_ppn || ''} onChange={e => setForm({...form, tarif_ppn: Number(e.target.value)})} />
                <span className="text-xs font-semibold text-slate-700">%</span>
              </div>
            </div>
            <div className="flex items-start">
              <label className={labelClass}>Jenis Transaksi</label>
              <select className={inputClass} value={form.jenis_transaksi || ''} onChange={e => setForm({...form, jenis_transaksi: e.target.value})}>
                <option>Kepada Bukan Pemungut PPN (01)</option>
                <option>Kepada Pemungut PPN (02)</option>
              </select>
            </div>
            <div className="flex items-start">
              <label className={labelClass}>Status</label>
              <select className={`${inputClass} w-48`} value={form.status || ''} onChange={e => setForm({...form, status: e.target.value})}>
                <option value=""></option>
                <option value="Selesai">Selesai</option>
                <option value="Batal">Batal</option>
              </select>
            </div>
            <div className="flex gap-4 items-center bg-slate-50 p-2 border border-slate-200 rounded-sm mt-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Record</span>
              <div className="flex gap-2 text-[10px]">
                <span>Created: <b className="bg-slate-200 px-2 py-0.5 rounded-sm">12/14/2026 Admin</b></span>
                <span className="text-slate-300">|</span>
                <span>Modified: <b className="bg-slate-200 px-2 py-0.5 rounded-sm">-</b></span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Rincian Barang */}
        <div className="flex-1 overflow-x-auto bg-white min-h-[300px]">
          <table className="w-full text-xs whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 sticky top-0 shadow-sm z-0">
              <tr>
                <th className="px-2 py-2 border-r border-slate-300 w-10 text-center">No</th>
                <th className="px-2 py-2 border-r border-slate-300 w-48">Kode Barang</th>
                <th className="px-2 py-2 border-r border-slate-300 min-w-[250px]">Nama Barang Kena Pajak / Barang Mewah Yang Dikembalikan</th>
                <th className="px-2 py-2 border-r border-slate-300 w-20 text-center">Satuan</th>
                <th className="px-2 py-2 border-r border-slate-300 w-24 text-right">Kuantum</th>
                <th className="px-2 py-2 border-r border-slate-300 w-32 text-right">Harga Satuan</th>
                <th className="px-2 py-2 border-r border-slate-300 w-32 text-right bg-blue-50">Harga Jual</th>
                <th className="px-2 py-2 w-10 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(form.lines || []).map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-2 py-1.5 border-r border-slate-200 text-center font-medium">{idx + 1}</td>
                  <td className="px-2 py-1.5 border-r border-slate-200">
                    <select className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm focus:outline-none bg-white" value={line.item_id || ''} onChange={e => updateLine(idx, 'item_id', Number(e.target.value) || null)}>
                      <option value=""></option>
                      {items.map(i => <option key={i.id} value={i.id}>{i.kode}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1.5 border-r border-slate-200">
                    <input type="text" className="w-full px-2 py-1 text-xs border border-slate-300 rounded-sm focus:outline-none" value={line.nama_barang || ''} onChange={e => updateLine(idx, 'nama_barang', e.target.value)} />
                  </td>
                  <td className="px-2 py-1.5 border-r border-slate-200">
                    <input type="text" className="w-full px-2 py-1 text-xs text-center border border-slate-300 rounded-sm focus:outline-none bg-slate-50" readOnly value={line.satuan || ''} />
                  </td>
                  <td className="px-2 py-1.5 border-r border-slate-200">
                    <input type="number" className="w-full px-2 py-1 text-xs text-right border border-slate-300 rounded-sm focus:outline-none" value={line.kuantum || ''} onChange={e => updateLine(idx, 'kuantum', Number(e.target.value))} />
                  </td>
                  <td className="px-2 py-1.5 border-r border-slate-200">
                    <input type="number" className="w-full px-2 py-1 text-xs text-right border border-slate-300 rounded-sm focus:outline-none" value={line.harga_satuan || ''} onChange={e => updateLine(idx, 'harga_satuan', Number(e.target.value))} />
                  </td>
                  <td className="px-2 py-1.5 border-r border-slate-200 text-right font-semibold bg-blue-50/50">
                    {(line.harga_jual || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button onClick={() => removeLine(idx)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1 rounded-sm"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-2 py-2 border-r border-slate-200 text-center">
                  <button onClick={addLine} className="w-5 h-5 mx-auto bg-slate-200 hover:bg-slate-300 text-slate-700 rounded flex items-center justify-center font-bold text-sm">+</button>
                </td>
                <td colSpan={7} className="px-4 py-2 text-xs text-slate-400 italic">Klik tombol + untuk menambah baris barang yang diretur</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Totals area */}
        <div className="p-4 bg-white border-t-2 border-slate-300 shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-8 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">
          <div className="flex flex-col gap-2 max-w-sm pt-2">
            <div className="flex items-center">
              <label className="text-xs font-semibold text-slate-700 w-28">Tanda Tangan</label>
              <input type="text" className={`${inputClass} flex-1`} value={form.tanda_tangan || ''} onChange={e => setForm({...form, tanda_tangan: e.target.value})} />
            </div>
            <div className="flex items-center">
              <label className="text-xs font-semibold text-slate-700 w-28">Jabatan</label>
              <input type="text" className={`${inputClass} flex-1`} value={form.jabatan || ''} onChange={e => setForm({...form, jabatan: e.target.value})} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Jumlah Harga Jual Yang Dikembalikan</span>
              <div className="flex items-center gap-2">
                <input type="text" readOnly className="w-48 px-3 py-1.5 bg-slate-50 border border-slate-300 text-right font-mono font-bold shadow-sm rounded-sm" value={dpp.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Dikurangi Potongan Harga</span>
              <div className="flex items-center gap-2">
                <input type="text" className="w-48 px-3 py-1 bg-white border border-slate-300 text-right font-mono shadow-sm rounded-sm text-sm" value="0.00" readOnly />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Dasar Pengenaan Pajak Valas</span>
              <div className="flex items-center gap-2">
                <input type="text" className="w-48 px-3 py-1 bg-slate-50 border border-slate-300 text-right font-mono shadow-sm rounded-sm text-sm" value={dpp.toLocaleString('en-US', { minimumFractionDigits: 2 })} readOnly />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Dasar Pengenaan Pajak</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">IDR</span>
                <input type="text" className="w-48 px-3 py-1 bg-slate-50 border border-slate-300 text-right font-mono shadow-sm rounded-sm text-sm" value={dpp.toLocaleString('en-US', { minimumFractionDigits: 2 })} readOnly />
              </div>
            </div>
            
            <div className="mt-2 text-sm font-bold text-slate-800">Jumlah Pajak Yang Dikurangkan</div>
            <div className="flex justify-between items-center text-sm pl-4">
              <span className="font-semibold text-slate-700">a. Pajak Pertambahan Nilai</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">IDR</span>
                <input type="text" readOnly className="w-48 px-3 py-1.5 bg-slate-50 border border-slate-300 text-right font-mono font-bold shadow-sm rounded-sm" value={ppnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm pl-4">
              <span className="font-semibold text-slate-700">b. Pajak Penjualan Atas Barang Mewah</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">IDR</span>
                <input type="text" className="w-48 px-3 py-1 bg-white border border-slate-300 text-right font-mono shadow-sm rounded-sm text-sm" value="0.00" readOnly />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL FOOTER: Record Navigation & Action Buttons */}
      <div className="bg-slate-200 border-t-2 border-slate-400 px-6 py-3 flex items-center justify-between shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center">
          <span className="text-xs font-bold text-slate-700 mr-3">Record:</span>
          <div className="flex items-center gap-1">
            <button onClick={() => loadRecord(0)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white rounded-sm shadow-sm"><ChevronsLeft size={14} /></button>
            <button onClick={() => loadRecord(currentIndex - 1)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white rounded-sm shadow-sm"><ChevronLeft size={14} /></button>
            <div className="px-4 py-0.5 border border-slate-400 bg-white text-xs text-center w-16 font-mono mx-1 shadow-inner">{isNew ? '*' : currentIndex + 1}</div>
            <button onClick={() => loadRecord(currentIndex + 1)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white rounded-sm shadow-sm"><ChevronRight size={14} /></button>
            <button onClick={() => loadRecord(dataList.length - 1)} className="p-1 border border-slate-400 bg-slate-100 hover:bg-white rounded-sm shadow-sm"><ChevronsRight size={14} /></button>
          </div>
          <span className="text-xs font-bold text-slate-700 ml-3">of {dataList.length}</span>
          <span className="text-xs text-slate-500 ml-6 font-mono bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-300">{isNew ? 'New Form' : 'Form View'}</span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          <button onClick={handleNew} className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-400 hover:bg-slate-100 rounded-sm text-xs font-bold text-slate-800 shadow-sm"><FilePlus size={14} /> TAMBAH BARU </button>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 border border-blue-700 hover:bg-blue-700 rounded-sm text-xs font-bold text-white shadow-sm"><Save size={14} /> SIMPAN </button>
          <button onClick={handleDelete} disabled={isNew} className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-400 hover:bg-slate-100 rounded-sm text-xs font-bold text-slate-800 shadow-sm disabled:opacity-50 disabled:bg-slate-100"><Trash2 size={14} /> HAPUS </button>
          <div className="w-px h-6 bg-slate-400 mx-2"></div>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-400 hover:bg-slate-100 rounded-sm text-xs font-bold text-slate-800 shadow-sm"><Printer size={14} /> LAPORAN </button>
        </div>
      </div>

    </div>
  );
};

export default NotaReturPembelian;
