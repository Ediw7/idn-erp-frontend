import React from 'react';
import { FilePlus, Edit2, Trash2 } from 'lucide-react';

interface InvoiceListViewProps {
  dataList: any[];
  setForm: (form: any) => void;
  setModalForm: (form: any) => void;
  emptyForm: any;
  setViewMode: (mode: 'list' | 'form') => void;
  handleDeleteInvoice: (id: number) => void;
  pelanggans: any[];
  salesmans: any[];
  mataUangs: any[];
  proyeks: any[];
}

export const InvoiceListView: React.FC<InvoiceListViewProps> = ({
  dataList, setForm, setModalForm, emptyForm, setViewMode, handleDeleteInvoice, pelanggans, salesmans, mataUangs, proyeks
}) => {
  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Invoice</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-slate-300 font-medium">Pilih Periode:</span>
            <select className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400">
              <option>Juni 2026</option>
              <option>Mei 2026</option>
            </select>
          </div>
        </div>
        <button onClick={() => {
          setForm(emptyForm);
          setModalForm(emptyForm);
          setViewMode('form');
        }} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
           <FilePlus size={14} /> + BUKA FORM
        </button>
      </div>

      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-3 py-2 font-semibold text-slate-700">No. Invoice</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Jenis</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Tgl</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Nama Pembeli</th>
                <th className="px-3 py-2 font-semibold text-slate-700">No PO</th>
                <th className="px-3 py-2 font-semibold text-slate-700">No SO</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Ccy</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right">PPN</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right">PPh 22</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-right">Nilai Invoice</th>
                <th className="px-3 py-2 font-semibold text-slate-700">No. Faktur Pajak</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Cara Bayar</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Tanggal JT</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Salesman</th>
                <th className="px-3 py-2 font-semibold text-slate-700">Proyek</th>
                <th className="px-3 py-2 font-semibold text-slate-700 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataList.length === 0 ? (
                <tr>
                  <td colSpan={16} className="px-4 py-8 text-center text-slate-500 italic">Belum ada data Invoice.</td>
                </tr>
              ) : (
                dataList.map((item, idx) => {
                  const pembeliNama = pelanggans.find(p => String(p.id) === String(item.pembeli_id))?.nama || item.pembeli_id;
                  const salesman = salesmans.find(s => String(s.id) === String(item.salesman_id))?.nama || '';
                  const ccy = mataUangs.find(m => String(m.id) === String(item.mata_uang))?.kode || item.mata_uang || 'IDR';
                  const proyekNama = proyeks.find(p => String(p.id) === String(item.proyek))?.nama || item.proyek || '';

                  const subtotal = (item.lines || []).reduce((acc: number, line: any) => {
                    const base = (line.kuantum || 0) * (line.harga_satuan || 0);
                    const disc = (base * (line.disc_persen || 0) / 100) + (line.disc_harga || 0);
                    return acc + (base - disc);
                  }, 0);
                  const ppnAmount = subtotal * 0.11;
                  const pphAmount = 0;
                  const total = subtotal + ppnAmount;

                  return (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono text-slate-800 font-medium">{item.no_invoice}</td>
                      <td className="px-3 py-2 text-slate-600">VAT</td>
                      <td className="px-3 py-2 text-slate-600">{item.tgl_invoice}</td>
                      <td className="px-3 py-2 text-slate-800 truncate max-w-[150px]" title={pembeliNama}>{pembeliNama}</td>
                      <td className="px-3 py-2 text-slate-600">{item.no_po || '-'}</td>
                      <td className="px-3 py-2 text-slate-600">{item.no_so || '-'}</td>
                      <td className="px-3 py-2 text-slate-600 font-medium">{ccy}</td>
                      <td className="px-3 py-2 font-mono text-slate-800 text-right">{ppnAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td className="px-3 py-2 font-mono text-slate-800 text-right">{pphAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td className="px-3 py-2 font-mono text-slate-800 text-right font-semibold">{total.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                      <td className="px-3 py-2 text-slate-600">{item.no_faktur_pajak || '-'}</td>
                      <td className="px-3 py-2 text-slate-600">{item.cara_pembayaran || '-'}</td>
                      <td className="px-3 py-2 text-slate-600">{item.tgl_jt || '-'}</td>
                      <td className="px-3 py-2 text-slate-600">{salesman || '-'}</td>
                      <td className="px-3 py-2 text-slate-600">{proyekNama || '-'}</td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setForm(item);
                              setViewMode('form');
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => item.id && handleDeleteInvoice(item.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
