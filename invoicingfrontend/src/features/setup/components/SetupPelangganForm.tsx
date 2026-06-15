import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { setupApi, PelangganData, PembayaranData, PerkiraanData } from '../api';
import toast from 'react-hot-toast';

const JENIS_TRANSAKSI = [
  { value: '01', label: 'Kepada Bukan Pemungut PPN (01)' },
  { value: '02', label: 'Kepada Pemungut Bendaharawan (02)' },
  { value: '03', label: 'Kepada Pemungut Selain Bendaharawan (03)' },
  { value: '04', label: 'DPP Nilai Lain (04)' },
  { value: '06', label: 'Penyerahan Lainnya (06)' },
  { value: '07', label: 'Penyerahan yang Tidak Dipungut PPN (07)' },
  { value: '08', label: 'Penyerahan yang Dibebaskan dari Pengenaan PPN (08)' },
  { value: '09', label: 'Penyerahan Aktiva (09)' }
];

interface SetupPelangganFormProps {
  onClose: () => BATALKAN;
  onSuccess: () => BATALKAN;
}

const SetupPelangganForm: React.FC<SetupPelangganFormProps> = ({ onClose, onSuccess }) => {
  const [pembayarans, setPembayarans] = useState<PembayaranData[]>([]);
  const [perkiraans, setPerkiraans] = useState<PerkiraanData[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const [editForm, setEditForm] = useState<PelangganData>({
    kode: '',
    nama: '',
    alamat: '',
    telepon: '',
    fax: '',
    alamat_kirim: '',
    telepon_kirim: '',
    fax_kirim: '',
    nama_wp: '',
    npwp: '',
    nik: '',
    alamat_wp: '',
    jenis_transaksi: '01',
    email: '',
    contact_person: '',
    no_hp: '',
    jabatan: '',
    pembayaran_id: null,
    tingkat_harga: '1',
    diskon: 0,
    perk_piutang_id: null,
    keterangan: ''
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [pembayaransData, perkiransData] = await Promise.all([
          setupApi.getPembayaran(),
          setupApi.getPerkiraan()
        ]);
        setPembayarans(pembayaransData || []);
        setPerkiraans(perkiransData || []);
      } catch (error) {
        console.error('Failed to load options', error);
      }
    };
    fetchOptions();
  }, []);

  const handleSave = async () => {
    if (!editForm.kode || !editForm.nama) {
      toast.error('Kode dan Nama Pelanggan harus diisi!');
      return;
    }
    setIsSaving(true);
    try {
      await setupApi.savePelanggan(editForm);
      onSuccess();
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan data pelanggan.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full px-2 py-1 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 text-xs transition-colors rounded-sm";

  return (
    <div className="flex flex-col h-full bg-slate-50 min-h-0">
      <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-sm min-h-0">
        <div className="flex gap-8">
          {/* Kolom Kiri */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Kode Pelanggan</label>
              <input type="text" value={editForm.kode} onChange={e => setEditForm({...editForm, kode: e.target.value.toUpperCase()})} className={`${inputClass} w-32`} autoFocus/>
            </div>
            <div className="flex items-center">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Nama Pelanggan</label>
              <input type="text" value={editForm.nama} onChange={e => setEditForm({...editForm, nama: e.target.value})} className={inputClass} />
            </div>
            <div className="flex items-start">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0 pt-1.5">Alamat Pelanggan</label>
              <textarea value={editForm.alamat || ''} onChange={e => setEditForm({...editForm, alamat: e.target.value})} className={`${inputClass} h-16 resize-none`} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center">
                <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">No. Telepon</label>
                <input type="text" value={editForm.telepon || ''} onChange={e => setEditForm({...editForm, telepon: e.target.value})} className={inputClass} />
              </div>
              <div className="flex-1 flex items-center">
                <label className="w-20 text-xs font-semibold text-slate-700 shrink-0 text-right pr-3">No. Fax</label>
                <input type="text" value={editForm.fax || ''} onChange={e => setEditForm({...editForm, fax: e.target.value})} className={inputClass} />
              </div>
            </div>

            <div className="h-4 border-b border-slate-200"></div>

            <div className="flex items-start mt-2">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0 pt-1.5">Alamat Pengiriman</label>
              <textarea value={editForm.alamat_kirim || ''} onChange={e => setEditForm({...editForm, alamat_kirim: e.target.value})} className={`${inputClass} h-16 resize-none`} />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center">
                <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">No. Tlp Kirim</label>
                <input type="text" value={editForm.telepon_kirim || ''} onChange={e => setEditForm({...editForm, telepon_kirim: e.target.value})} className={inputClass} />
              </div>
              <div className="flex-1 flex items-center">
                <label className="w-20 text-xs font-semibold text-slate-700 shrink-0 text-right pr-3">Fax Kirim</label>
                <input type="text" value={editForm.fax_kirim || ''} onChange={e => setEditForm({...editForm, fax_kirim: e.target.value})} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Nama Wajib Pajak</label>
              <input type="text" value={editForm.nama_wp || ''} onChange={e => setEditForm({...editForm, nama_wp: e.target.value})} className={inputClass} />
            </div>
            <div className="flex items-center">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">NPWP</label>
              <input type="text" value={editForm.npwp || ''} onChange={e => setEditForm({...editForm, npwp: e.target.value})} className={inputClass} placeholder="00.000.000.0-000.000" />
            </div>
            <div className="flex items-center">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">No KTP</label>
              <input type="text" value={editForm.nik || ''} onChange={e => setEditForm({...editForm, nik: e.target.value})} className={inputClass} />
            </div>
            <div className="flex items-start">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0 pt-1.5">Alamat Wajib Pajak</label>
              <textarea value={editForm.alamat_wp || ''} onChange={e => setEditForm({...editForm, alamat_wp: e.target.value})} className={`${inputClass} h-16 resize-none`} />
            </div>
            
            <div className="h-4 border-b border-slate-200"></div>
            
            <div className="flex items-center mt-2">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Jenis Transaksi</label>
              <select value={editForm.jenis_transaksi || '01'} onChange={e => setEditForm({...editForm, jenis_transaksi: e.target.value})} className={inputClass}>
                {JENIS_TRANSAKSI.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center">
                <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Contact Person</label>
                <input type="text" value={editForm.contact_person || ''} onChange={e => setEditForm({...editForm, contact_person: e.target.value})} className={inputClass} />
              </div>
              <div className="flex-1 flex items-center">
                <label className="w-16 text-xs font-semibold text-slate-700 shrink-0 text-right pr-3">No HP</label>
                <input type="text" value={editForm.no_hp || ''} onChange={e => setEditForm({...editForm, no_hp: e.target.value})} className={inputClass} />
              </div>
            </div>
            <div className="flex items-center">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Email</label>
              <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Bottom Configs */}
        <div className="mt-2 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Cara Pembayaran</label>
              <select value={editForm.pembayaran_id || ''} onChange={e => setEditForm({...editForm, pembayaran_id: e.target.value ? Number(e.target.value) : null})} className={inputClass}>
                <option value=""></option>
                {pembayarans.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
              </select>
            </div>
            <div className="flex items-center">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Tingkatan Harga Jual</label>
              <select value={editForm.tingkat_harga || '1'} onChange={e => setEditForm({...editForm, tingkat_harga: e.target.value})} className={`${inputClass} w-40`}>
                <option value="1">Harga Jual 1</option>
                <option value="2">Harga Jual 2</option>
                <option value="3">Harga Jual 3</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">Discount Harga Jual</label>
              <div className="flex items-center w-32">
                <input type="number" value={editForm.diskon || 0} onChange={e => setEditForm({...editForm, diskon: Number(e.target.value)})} className={`${inputClass} text-right`} />
                <span className="text-xs font-semibold text-slate-700 ml-2">%</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0">No Perkiraan Piutang</label>
              <select value={editForm.perk_piutang_id || ''} onChange={e => setEditForm({...editForm, perk_piutang_id: e.target.value ? Number(e.target.value) : null})} className={inputClass}>
                <option value=""></option>
                {perkiraans.map(p => <option key={p.id} value={p.id}>{p.no_perkiraan} - {p.nama_perkiraan}</option>)}
              </select>
            </div>
            <div className="flex items-start">
              <label className="w-40 text-xs font-semibold text-slate-700 shrink-0 pt-1.5">Keterangan</label>
              <textarea value={editForm.keterangan || ''} onChange={e => setEditForm({...editForm, keterangan: e.target.value})} className={`${inputClass} h-16 resize-none`} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Modern */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
        <button 
          onClick={onClose}
          className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          Batal
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={14} /> {isSaving ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </div>
    </div>
  );
};

export default SetupPelangganForm;
