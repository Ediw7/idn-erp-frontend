import React, { useState, useEffect, useMemo } from 'react';
import { FilePlus, Trash2, Printer, Save, Plus } from 'lucide-react';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { notaReturPembelianApi, NotaReturPembelianData, NotaReturPembelianLine } from '../apiPembelian';
import { setupApi, SupplierData, MataUangData, ItemData, GudangData } from '../../setup/api';
import toast from 'react-hot-toast';

const NotaReturPembelian: React.FC = () => {
  const confirm = useConfirm();

  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [mataUangs, setMataUangs] = useState<MataUangData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [gudangs, setGudangs] = useState<GudangData[]>([]);

  const [form, setForm] = useState<Partial<NotaReturPembelianData>>({
    no_nota: '', tgl_nota: new Date().toISOString().split('T')[0], supplier_id: null,
    alamat_penjual: '', jenis_retur: 'Barang Kena Pajak', gudang_id: '',
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
      const [s, m, i, g] = await Promise.all([
        setupApi.getSupplier(),
        setupApi.getMataUang(),
        setupApi.getItem(),
        setupApi.getGudang().catch(() => [])
      ]);

      setSuppliers(s || []);
      setMataUangs(m || []);
      setItems(i || []);
      setGudangs(g || []);
      
      handleNew();
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Gagal memuat data master');
    }
  };

  const handleNew = async () => {
    try {
      const res = await notaReturPembelianApi.autoNo().catch(() => ({ no_nota: '' }));
      setForm({
        no_nota: res.no_nota || '', tgl_nota: new Date().toISOString().split('T')[0], supplier_id: null,
        alamat_penjual: '', jenis_retur: 'Barang Kena Pajak', gudang_id: '',
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
      toast.success('Data berhasil disimpan');
      setIsNew(false);
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
      toast.success('Data berhasil dihapus');
      handleNew();
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  const dpp = useMemo(() => {
    return (form.lines || []).reduce((acc, line) => acc + (line.harga_jual || 0), 0);
  }, [form.lines]);

  const ppnAmount = useMemo(() => {
    return dpp * (form.tarif_ppn || 11) / 100;
  }, [dpp, form.tarif_ppn]);

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
    if (newLines.length > 1) {
      newLines.splice(idx, 1);
      setForm({ ...form, lines: newLines });
    } else {
      setForm({ ...form, lines: [{ item_id: null, kode_barang: '', nama_barang: '', satuan: 'Pcs', kuantum: 1, harga_satuan: 0, harga_jual: 0 }] });
    }
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
    
    if (field === 'kuantum' || field === 'harga_satuan' || field === 'item_id') {
      line.harga_jual = line.kuantum * line.harga_satuan;
    }
    
    newLines[idx] = line;
    setForm({ ...form, lines: newLines });
  };

  const inputClass = "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm";
  const readOnlyClass = "w-full px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-300 focus:outline-none rounded-sm text-sm";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1 shrink-0 w-36";

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header with Action Buttons */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 shrink-0 flex justify-between items-center overflow-x-auto">
        <div className="flex items-center gap-6 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white">Nota Retur Pembelian</h2>
            <p className="text-xs text-slate-300 mt-1">Formulir PPN dan nota retur pembelian vendor.</p>
          </div>
          <div className="h-8 w-px bg-slate-600"></div>
          <div className="flex items-center gap-2 text-sm text-slate-200">
             <span className="bg-slate-700 border border-slate-600 px-3 py-1 rounded-sm shadow-sm font-mono text-white">{form.no_nota || 'New Retur'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button onClick={handleNew} className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-slate-800 shadow-sm whitespace-nowrap">
            <FilePlus size={14} /> TAMBAH BARU
          </button>
          <button onClick={handleSave} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 border border-blue-700 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white shadow-sm whitespace-nowrap">
            <Save size={14} /> SIMPAN
          </button>
          <button onClick={handleDelete} disabled={isNew} className="px-3 py-1.5 bg-white hover:bg-red-50 border border-slate-300 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-red-600 shadow-sm disabled:opacity-50 disabled:hover:bg-white whitespace-nowrap">
            <Trash2 size={14} /> HAPUS
          </button>
          <div className="w-px h-6 bg-slate-600 mx-1"></div>
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white shadow-sm whitespace-nowrap">
            <Printer size={14} /> LAPORAN
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Main Form Area (2 Columns) */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-4 mb-4 shrink-0">
          <div className="flex gap-12">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-2 max-w-lg">
              <div className="flex items-center">
                <label className={labelClass}>No. Nota Retur</label>
                <div className="flex gap-1 flex-1">
                  <input type="text" className={`${inputClass} font-semibold`} value={form.no_nota || ''} onChange={e => setForm({...form, no_nota: e.target.value})} />
                  <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 whitespace-nowrap">Auto No</button>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Tgl Nota Retur</label>
                <input type="date" className={`${inputClass} w-40`} value={form.tgl_nota || ''} onChange={e => setForm({...form, tgl_nota: e.target.value})} />
              </div>
              <div className="flex items-center mt-2">
                <label className={labelClass}>Nama Penjual</label>
                <select className={inputClass} value={form.supplier_id || ''} onChange={e => handleSupplierChange(Number(e.target.value))}>
                  <option value="">- Pilih Penjual -</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                </select>
              </div>
              <div className="flex items-start">
                <label className={labelClass}>Alamat Penjual</label>
                <textarea className={`${readOnlyClass} h-16 resize-none`} readOnly value={form.alamat_penjual || ''} />
              </div>
              <div className="flex items-center mt-2">
                <label className={labelClass}>Jenis Retur</label>
                <select className={`${inputClass} w-56`} value={form.jenis_retur || ''} onChange={e => setForm({...form, jenis_retur: e.target.value})}>
                  <option>Barang Kena Pajak</option>
                  <option>Non BKP</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Gudang</label>
                <select className={`${inputClass} w-48`} value={form.gudang_id || ''} onChange={e => setForm({...form, gudang_id: e.target.value})}>
                  <option value="">- Pilih Gudang -</option>
                  {gudangs.map(g => <option key={g.id} value={g.id}>{g.nama_gudang}</option>)}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-2 max-w-lg">
              <div className="flex items-center">
                <label className={labelClass}>Atas No. FP</label>
                <div className="flex gap-2 flex-1 items-center">
                  <input type="text" className={`${inputClass} flex-1`} value={form.atas_no_fp || ''} onChange={e => setForm({...form, atas_no_fp: e.target.value})} />
                  <span className="text-xs font-semibold text-slate-700">Tgl</span>
                  <input type="date" className={`${inputClass} w-36`} value={form.tgl_fp || ''} onChange={e => setForm({...form, tgl_fp: e.target.value})} />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <label className={labelClass}>Mata Uang</label>
                <select className={`${inputClass} w-32`} value={form.mata_uang_id || ''} onChange={e => setForm({...form, mata_uang_id: Number(e.target.value) || null})}>
                  <option value="">--</option>
                  {mataUangs.map(m => <option key={m.id} value={m.id}>{m.kode}</option>)}
                </select>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Kurs Pajak</label>
                <div className="flex gap-2 items-center">
                  <input type="number" className={`${inputClass} w-32 text-right`} value={form.kurs_pajak || 1} onChange={e => setForm({...form, kurs_pajak: Number(e.target.value)})} />
                  <span className="text-xs font-semibold text-slate-700">/ 1 RP</span>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Tarif PPN</label>
                <div className="flex gap-1 items-center">
                  <input type="number" className={`${inputClass} w-20 text-center`} value={form.tarif_ppn ?? 11} onChange={e => setForm({...form, tarif_ppn: Number(e.target.value)})} />
                  <span className="text-xs font-semibold text-slate-700">%</span>
                </div>
              </div>
              <div className="flex items-center mt-2">
                <label className={labelClass}>Jenis Transaksi</label>
                <select className={inputClass} value={form.jenis_transaksi || ''} onChange={e => setForm({...form, jenis_transaksi: e.target.value})}>
                  <option>Kepada Bukan Pemungut PPN (01)</option>
                  <option>Kepada Pemungut PPN (02)</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Status</label>
                <select className={`${inputClass} w-48`} value={form.status || ''} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value=""></option>
                  <option value="Selesai">Selesai</option>
                  <option value="Batal">Batal</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Rincian Barang (Tanpa HPP) */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 flex-1 flex flex-col min-h-[250px] overflow-hidden mb-4">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs whitespace-nowrap">
              <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="w-10 px-2 py-2 text-center border-r border-slate-300 font-semibold">No</th>
                  <th className="w-48 px-3 py-2 text-left border-r border-slate-300 font-semibold">Kode Barang</th>
                  <th className="px-3 py-2 text-left border-r border-slate-300 min-w-[250px] font-semibold">Nama Barang Kena Pajak / Barang Mewah Yang Dikembalikan</th>
                  <th className="w-20 px-3 py-2 text-center border-r border-slate-300 font-semibold">Satuan</th>
                  <th className="w-32 px-3 py-2 text-right border-r border-slate-300 font-semibold">Kuantum</th>
                  <th className="w-40 px-3 py-2 text-right border-r border-slate-300 font-semibold">Harga Satuan</th>
                  <th className="w-40 px-3 py-2 text-right border-r border-slate-300 font-semibold">Harga Jual</th>
                  <th className="w-16 px-3 py-2 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(form.lines || []).map((line, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-2 py-1 text-center border-r border-slate-200">{idx + 1}</td>
                    <td className="px-2 py-1 border-r border-slate-200">
                      <select 
                        className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs focus:outline-none bg-white focus:ring-1 focus:ring-slate-500" 
                        value={line.item_id || ''} 
                        onChange={e => updateLine(idx, 'item_id', Number(e.target.value) || null)}
                      >
                        <option value="">- Pilih -</option>
                        {items.map(i => <option key={i.id} value={i.id}>{i.kode}</option>)}
                      </select>
                    </td>
                    <td className="px-2 py-1 border-r border-slate-200">
                      <input type="text" className={`${readOnlyClass} !px-2 !py-1`} readOnly value={line.nama_barang || ''} />
                    </td>
                    <td className="px-2 py-1 border-r border-slate-200">
                      <input type="text" className={`${readOnlyClass} !px-2 !py-1 text-center`} readOnly value={line.satuan || ''} />
                    </td>
                    <td className="px-2 py-1 border-r border-slate-200 text-right">
                      <input type="number" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right bg-white focus:outline-none focus:ring-1 focus:ring-slate-500" value={line.kuantum || ''} onChange={e => updateLine(idx, 'kuantum', Number(e.target.value))} />
                    </td>
                    <td className="px-2 py-1 border-r border-slate-200 text-right">
                      <input type="number" className="w-full px-2 py-1 border border-slate-300 rounded-sm text-xs text-right bg-white focus:outline-none focus:ring-1 focus:ring-slate-500" value={line.harga_satuan || ''} onChange={e => updateLine(idx, 'harga_satuan', Number(e.target.value))} />
                    </td>
                    <td className="px-2 py-1 border-r border-slate-200 text-right">
                       <input type="text" className={`${readOnlyClass} !px-2 !py-1 text-right font-semibold`} readOnly value={(line.harga_jual || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} />
                    </td>
                    <td className="px-2 py-1 text-center">
                      <button onClick={() => removeLine(idx)} className="text-red-500 hover:text-red-700 p-1 rounded transition-colors hover:bg-red-50" title="Hapus">
                        <Trash2 size={14}/>
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-slate-200">
                  <td className="px-2 py-1 text-center border-r border-slate-200 text-slate-400 font-bold">*</td>
                  <td colSpan={7} className="px-2 py-1">
                    <button onClick={addLine} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                      <Plus size={14} /> Tambah Baris
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer: Informasi TTD & Kalkulasi Pajak */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-4 shrink-0 grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Kiri: Informasi TTD */}
          <div className="flex flex-col gap-2 max-w-md pt-2">
            <div className="flex items-center">
              <label className={labelClass}>Tanda Tangan</label>
              <input type="text" className={`${inputClass} flex-1`} value={form.tanda_tangan || ''} onChange={e => setForm({...form, tanda_tangan: e.target.value})} />
            </div>
            <div className="flex items-center">
              <label className={labelClass}>Jabatan</label>
              <input type="text" className={`${inputClass} flex-1`} value={form.jabatan || ''} onChange={e => setForm({...form, jabatan: e.target.value})} />
            </div>
          </div>

          {/* Kanan: Kalkulasi Pajak (bg-gray-50) */}
          <div className="flex flex-col gap-2 justify-end">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Jumlah Harga Jual Yang Dikembalikan</span>
              <div className="flex items-center gap-1 w-64">
                 <input type="text" className={`${readOnlyClass} w-16 text-center font-bold`} value="IDR" readOnly />
                 <input type="text" className={`${readOnlyClass} flex-1 text-right font-bold`} value={dpp.toLocaleString('en-US', { minimumFractionDigits: 2 })} readOnly />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Dikurangi Potongan Harga</span>
              <div className="flex items-center gap-1 w-64">
                 <input type="text" className={`${readOnlyClass} w-16 text-center font-bold`} value="IDR" readOnly />
                 <input type="text" className={`${inputClass} flex-1 text-right font-semibold`} value="0.00" />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Dasar Pengenaan Pajak Valas</span>
              <div className="flex items-center gap-1 w-64">
                 <input type="text" className={`${readOnlyClass} w-16 text-center font-bold`} value="IDR" readOnly />
                 <input type="text" className={`${readOnlyClass} flex-1 text-right font-bold`} value={dpp.toLocaleString('en-US', { minimumFractionDigits: 2 })} readOnly />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700">Dasar Pengenaan Pajak</span>
              <div className="flex items-center gap-1 w-64">
                 <input type="text" className={`${readOnlyClass} w-16 text-center font-bold`} value="IDR" readOnly />
                 <input type="text" className={`${readOnlyClass} flex-1 text-right font-bold text-blue-700`} value={dpp.toLocaleString('en-US', { minimumFractionDigits: 2 })} readOnly />
              </div>
            </div>
            
            <div className="mt-2 text-sm font-bold text-slate-800 border-t border-slate-200 pt-2">Jumlah Pajak Yang Dikurangkan</div>
            <div className="flex justify-between items-center text-sm pl-4">
              <span className="font-semibold text-slate-700">a. Pajak Pertambahan Nilai</span>
              <div className="flex items-center gap-1 w-64">
                 <input type="text" className={`${readOnlyClass} w-16 text-center font-bold`} value="IDR" readOnly />
                 <input type="text" className={`${readOnlyClass} flex-1 text-right font-bold text-blue-700`} value={ppnAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} readOnly />
              </div>
            </div>
            <div className="flex justify-between items-center text-sm pl-4">
              <span className="font-semibold text-slate-700">b. Pajak Penjualan Atas Barang Mewah</span>
              <div className="flex items-center gap-1 w-64">
                 <input type="text" className={`${readOnlyClass} w-16 text-center font-bold`} value="IDR" readOnly />
                 <input type="text" className={`${inputClass} flex-1 text-right font-semibold`} value="0.00" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotaReturPembelian;
