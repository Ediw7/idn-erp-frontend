import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface InvoiceSuratJalanProps {
  form: any;
  setForm: (form: any) => void;
  suratJalans: any[];
  salesOrders: any[];
}

export const InvoiceSuratJalan: React.FC<InvoiceSuratJalanProps> = ({ form, setForm, suratJalans, salesOrders }) => {
  const [selectedSj, setSelectedSj] = useState('');

  // Filter SJs that match the current form.no_so AND are not already invoiced AND not already in the form
  const availableSJs = suratJalans.filter(sj => {
    // Must match the current SO
    if (sj.no_so !== form.no_so) return false;
    // Must not be already invoiced by someone else
    if (sj.no_invoice && sj.no_invoice !== form.no_invoice) return false;
    // Must not be already in the current form list
    const alreadyInForm = (form.surat_jalans || []).find((s: any) => s.no_sj === sj.no_sj);
    if (alreadyInForm) return false;
    return true;
  });

  const handleAddSj = () => {
    if (!selectedSj) return;
    
    const targetSJ = suratJalans.find(x => x.no_sj === selectedSj);
    if (!targetSJ) return;

    // We also need to add the lines from this SJ into the invoice lines!
    const targetSO = salesOrders.find(x => x.no_so === form.no_so);
    
    let newLines = [...(form.lines || [])];
    
    targetSJ.lines.forEach((sjLine: any) => {
      // Find matching item in SO for prices
      let soLine = null;
      if (targetSO && targetSO.lines) {
        soLine = targetSO.lines.find((l: any) => l.item_id === sjLine.item_id);
      }
      
      // Cek apakah item sudah ada di invoice lines
      const existingLineIndex = newLines.findIndex((l: any) => l.item_id === sjLine.item_id);
      if (existingLineIndex >= 0) {
        // Tambahkan kuantum
        const line = newLines[existingLineIndex];
        line.kuantum += (sjLine.kuantum || 1);
        // Recalculate harga_jual
        const basePrice = line.kuantum * line.harga_satuan;
        const discount = (basePrice * (line.disc_persen / 100)) + line.disc_harga;
        line.harga_jual = basePrice - discount;
      } else {
        // Tambahkan baris baru
        const p = soLine ? (soLine.harga_satuan || 0) : 0;
        const dp = soLine ? (soLine.disc_persen || 0) : 0;
        const dh = soLine ? (soLine.disc_harga || 0) : 0;
        const q = sjLine.kuantum || 1;
        const base = q * p;
        const disc = (base * (dp / 100)) + dh;
        
        newLines.push({
          item_id: sjLine.item_id,
          kode: sjLine.kode || '',
          nama: sjLine.nama_barang || '',
          satuan: sjLine.satuan || '',
          kuantum: q,
          harga_satuan: p,
          disc_persen: dp,
          disc_harga: dh,
          harga_jual: base - disc
        });
      }
    });

    setForm((prev: any) => ({
      ...prev,
      lines: newLines,
      surat_jalans: [
        ...(prev.surat_jalans || []),
        { no_sj: targetSJ.no_sj, tanggal: targetSJ.tanggal, keterangan: targetSJ.keterangan || '' }
      ]
    }));
    
    setSelectedSj('');
    toast.success(`Surat Jalan ${targetSJ.no_sj} ditambahkan ke Invoice`);
  };

  const handleRemoveSj = (index: number) => {
    const sjToRemove = form.surat_jalans[index];
    
    // Kita harus mengurangi kuantum dari lines atau setidaknya memberitahu user
    toast.error('Menghapus SJ dari daftar tidak otomatis menghapus/mengurangi barang dari tab Detail. Harap sesuaikan kuantum barang secara manual di tab Detail jika diperlukan.');
    
    setForm((prev: any) => ({
      ...prev,
      surat_jalans: prev.surat_jalans.filter((_: any, i: number) => i !== index)
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col min-h-[300px] p-4">
      <div className="flex gap-2 mb-4 items-end">
        <div className="flex flex-col flex-1 max-w-sm gap-1">
          <label className="text-sm font-semibold text-slate-700">Pilih Surat Jalan</label>
          <select 
            className="w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 bg-white"
            value={selectedSj}
            onChange={(e) => setSelectedSj(e.target.value)}
            disabled={!form.no_so}
          >
            <option value="">{form.no_so ? '-- Pilih Surat Jalan --' : '-- Pilih SO di Umum dulu --'}</option>
            {availableSJs.map(sj => (
              <option key={sj.id} value={sj.no_sj}>{sj.no_sj} ({sj.tanggal})</option>
            ))}
          </select>
        </div>
        <button 
          onClick={handleAddSj}
          disabled={!selectedSj}
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2 h-[34px]"
        >
          <Plus size={16} /> Tambah
        </button>
      </div>

      <table className="w-full text-sm text-left whitespace-nowrap mt-2 border border-slate-200">
        <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
          <tr>
            <th className="px-4 py-2 border-r border-slate-300 font-semibold w-12 text-center">No.</th>
            <th className="px-4 py-2 border-r border-slate-300 font-semibold w-48 text-center">No. SJ</th>
            <th className="px-4 py-2 border-r border-slate-300 font-semibold w-32 text-center">Tgl SJ</th>
            <th className="px-4 py-2 font-semibold">Keterangan</th>
            <th className="px-4 py-2 font-semibold w-12 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {form.surat_jalans && form.surat_jalans.length > 0 ? form.surat_jalans.map((sj: any, idx: number) => (
            <tr key={idx} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-2 border-r border-slate-200 text-center">{idx + 1}</td>
              <td className="px-4 py-2 border-r border-slate-200 font-mono text-center">{sj.no_sj}</td>
              <td className="px-4 py-2 border-r border-slate-200 text-center">{sj.tanggal}</td>
              <td className="px-4 py-2 border-r border-slate-200">{sj.keterangan || '-'}</td>
              <td className="px-4 py-2 text-center">
                <button 
                  onClick={() => handleRemoveSj(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Hapus Surat Jalan"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} className="px-4 py-12 text-center text-slate-500 italic">Belum ada Surat Jalan terkait untuk Invoice ini.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
