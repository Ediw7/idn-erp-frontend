import React from 'react';

interface PembayaranFormUmumProps {
  form: any;
  setForm: (form: any) => void;
  pelanggans: any[];
  handlePembeliChange: (id: number | '') => void;
}

export const PembayaranFormUmum: React.FC<PembayaranFormUmumProps> = ({
  form, setForm, pelanggans, handlePembeliChange
}) => {
  const inputClass = "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm";
  const readOnlyClass = "w-full px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-300 focus:outline-none rounded-sm text-sm cursor-not-allowed";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1 shrink-0 w-40";

  return (
    <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
      <div className="flex gap-12">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center">
            <label className={labelClass}>No. Bukti</label>
            <div className="flex gap-1 flex-1">
              <input 
                type="text" 
                className={`${inputClass} font-semibold`} 
                value={form.no_bukti || ''}
                onChange={e => setForm({ ...form, no_bukti: e.target.value })}
              />
              <button 
                onClick={() => setForm({ ...form, no_bukti: `BM/00${Math.floor(Math.random()*100)}/${new Date().getMonth()+1}/${new Date().getFullYear()}` })}
                className="px-3 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 whitespace-nowrap transition-colors"
              >
                Auto No
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <label className={labelClass}>Tanggal</label>
            <input 
              type="date" 
              className={`${inputClass} w-40`} 
              value={form.tanggal || ''}
              onChange={e => setForm({ ...form, tanggal: e.target.value })}
            />
          </div>
          <div className="flex items-center mt-2">
            <label className={labelClass}>Nama Pembeli</label>
            <select 
              className={inputClass}
              value={form.pelanggan_id || ''}
              onChange={(e) => handlePembeliChange(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">- Pilih Pelanggan -</option>
              {pelanggans.map(p => (
                <option key={p.id} value={p.id}>{p.nama}</option>
              ))}
            </select>
          </div>
          <div className="flex items-start">
            <label className={labelClass}>Alamat</label>
            <textarea className={`${readOnlyClass} h-20 resize-none`} readOnly value={form.alamat || ''} />
          </div>
          
          <div className="flex items-center mt-2">
            <label className={labelClass}>Metode Pembayaran</label>
            <select 
              className={`${inputClass} w-40`}
              value={form.metode_pembayaran || 'Transfer'}
              onChange={e => setForm({ ...form, metode_pembayaran: e.target.value })}
            >
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
              <option value="Giro">Giro</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className={labelClass}>No. Cek/Giro</label>
            <input 
              type="text" 
              className={inputClass} 
              value={form.no_cek_giro || ''}
              onChange={e => setForm({ ...form, no_cek_giro: e.target.value })}
            />
          </div>
          <div className="flex items-center">
            <label className={labelClass}>Tanggal Cair</label>
            <input 
              type="date" 
              className={`${inputClass} w-40`} 
              value={form.tanggal_cair || ''}
              onChange={e => setForm({ ...form, tanggal_cair: e.target.value })}
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center">
            <label className={labelClass}>Perkiraan Kas/Bank</label>
            <select 
              className={inputClass}
              value={form.perkiraan_kas_bank || ''}
              onChange={e => setForm({ ...form, perkiraan_kas_bank: e.target.value })}
            >
              <option value="">- Pilih Perkiraan -</option>
              <option value="1101">1101 - Kas Besar</option>
              <option value="1102001">1102001 - Bank BCA</option>
              <option value="1102002">1102002 - Bank Mandiri</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className={labelClass}>Mata Uang</label>
            <select 
              className={`${inputClass} w-32`}
              value={form.mata_uang || 'IDR'}
              onChange={e => setForm({ ...form, mata_uang: e.target.value })}
            >
              <option value="IDR">IDR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="flex items-center mt-2">
            <label className={labelClass}>Jumlah Penerimaan</label>
            <input 
              type="number" 
              className={`${inputClass} w-48 text-right font-mono font-bold`} 
              value={form.jumlah_penerimaan || 0}
              onChange={e => setForm({ ...form, jumlah_penerimaan: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-center">
            <label className={labelClass}>Kurs Pembayaran</label>
            <input 
              type="number" 
              className={`${inputClass} w-32 text-right`} 
              value={form.kurs_pembayaran || 1}
              onChange={e => setForm({ ...form, kurs_pembayaran: parseFloat(e.target.value) || 1 })}
            />
          </div>
          <div className="flex items-start mt-2">
            <label className={labelClass}>Keterangan</label>
            <textarea 
              className={`${inputClass} h-32 resize-none`} 
              value={form.keterangan || ''}
              onChange={e => setForm({ ...form, keterangan: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
