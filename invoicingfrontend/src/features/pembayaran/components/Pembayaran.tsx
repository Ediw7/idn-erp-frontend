import React, { useState, useEffect } from 'react';
import { Search, Plus, Save, FileText, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface InvoiceItem {
  id: string;
  noInvoice: string;
  noFakturPajak: string;
  tglJt: string;
  ccy: string;
  saldoPiutang: number;
  pembayaranStr: string;
  potonganStr: string;
  keterangan: string;
}

const dummyPelanggan = [
  { id: 'CUST-001', nama: 'PT Maju Bersama', alamat: 'Jl. Sudirman No. 1, Jakarta Pusat, DKI Jakarta 10220' },
  { id: 'CUST-002', nama: 'CV Sentosa', alamat: 'Jl. Merdeka No. 45, Bandung, Jawa Barat 40111' },
];

const dummyInvoice = [
  { noInvoice: 'INV-2025-001', pelangganId: 'CUST-001', noFakturPajak: '010.000-25.00000001', tglJt: '2025-12-26', ccy: 'IDR', saldoPiutang: 27500000 },
  { noInvoice: 'INV-2025-002', pelangganId: 'CUST-001', noFakturPajak: '010.000-25.00000002', tglJt: '2025-12-29', ccy: 'IDR', saldoPiutang: 11000000 },
  { noInvoice: 'INV-2026-001', pelangganId: 'CUST-002', noFakturPajak: '010.000-26.00000001', tglJt: '2026-01-21', ccy: 'IDR', saldoPiutang: 11450400 },
];

const Pembayaran: React.FC = () => {
  const navigate = useNavigate();

  const [pelangganId, setPelangganId] = useState('');
  const [alamat, setAlamat] = useState('');
  const [jumlahPenerimaanStr, setJumlahPenerimaanStr] = useState('');

  const [rows, setRows] = useState<InvoiceItem[]>([
    { id: '1', noInvoice: '', noFakturPajak: '', tglJt: '', ccy: '', saldoPiutang: 0, pembayaranStr: '', potonganStr: '', keterangan: '' }
  ]);

  useEffect(() => {
    const cust = dummyPelanggan.find(c => c.id === pelangganId);
    if (cust) {
      setAlamat(cust.alamat);
    } else {
      setAlamat('');
    }
  }, [pelangganId]);

  const formatCurrency = (num: number) => {
    if (isNaN(num)) return '0.00';
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
  };

  const parseCurrency = (str: string) => {
    const parsed = parseFloat(str.replace(/,/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleRowChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setRows(prevRows => prevRows.map(row => {
      if (row.id === id) {
        const newRow = { ...row, [field]: value };
        if (field === 'noInvoice') {
          const inv = dummyInvoice.find(i => i.noInvoice === value);
          if (inv) {
            newRow.noFakturPajak = inv.noFakturPajak;
            newRow.tglJt = inv.tglJt;
            newRow.ccy = inv.ccy;
            newRow.saldoPiutang = inv.saldoPiutang;
          } else {
            newRow.noFakturPajak = '';
            newRow.tglJt = '';
            newRow.ccy = '';
            newRow.saldoPiutang = 0;
          }
        }
        return newRow;
      }
      return row;
    }));
  };

  const handleNumberChange = (id: string, field: 'pembayaranStr' | 'potonganStr', val: string) => {
    let cleanVal = val.replace(/[^0-9.]/g, '');
    const parts = cleanVal.split('.');
    if (parts.length > 2) {
      cleanVal = parts[0] + '.' + parts.slice(1).join('');
    }
    handleRowChange(id, field, cleanVal);
  };

  const handleNumberBlur = (id: string, field: 'pembayaranStr' | 'potonganStr', val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      handleRowChange(id, field, formatCurrency(num));
    } else {
      handleRowChange(id, field, '');
    }
  };

  const handleNumberFocus = (id: string, field: 'pembayaranStr' | 'potonganStr', val: string) => {
    if (val) {
      handleRowChange(id, field, val.replace(/,/g, ''));
    }
  };

  const handleJumlahPenerimaanChange = (val: string) => {
    let cleanVal = val.replace(/[^0-9.]/g, '');
    const parts = cleanVal.split('.');
    if (parts.length > 2) cleanVal = parts[0] + '.' + parts.slice(1).join('');
    setJumlahPenerimaanStr(cleanVal);
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now().toString(), noInvoice: '', noFakturPajak: '', tglJt: '', ccy: '', saldoPiutang: 0, pembayaranStr: '', potonganStr: '', keterangan: '' }]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const getSaldoAkhir = (row: InvoiceItem) => {
    const pembayaran = parseCurrency(row.pembayaranStr || '0');
    const potongan = parseCurrency(row.potonganStr || '0');
    return row.saldoPiutang - (pembayaran + potongan);
  };

  const totalPembayaran = rows.reduce((acc, row) => acc + parseCurrency(row.pembayaranStr || '0'), 0);
  const totalPotongan = rows.reduce((acc, row) => acc + parseCurrency(row.potonganStr || '0'), 0);

  const availableInvoices = dummyInvoice.filter(inv => inv.pelangganId === pelangganId);

  const inputClass = "w-full px-3 py-1.5 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm";
  const readOnlyClass = "w-full px-3 py-1.5 bg-slate-50 text-slate-500 border border-slate-300 focus:outline-none rounded-sm text-sm";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1 shrink-0 w-40";
  const btnPrimary = "px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-sm hover:bg-slate-700 shadow-sm flex items-center gap-2 transition-colors";
  const btnSecondary = "px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-bold rounded-sm hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-colors";

  return (
    <div className="bg-white shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0 overflow-x-auto">
        <div className="flex items-center gap-6 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-white">Pembayaran Piutang Dagang</h2>
            <p className="text-xs text-slate-300 mt-1">Catat penerimaan pembayaran faktur dari pelanggan.</p>
          </div>
          <div className="h-8 w-px bg-slate-600"></div>
          <div className="flex items-center gap-2 text-sm text-slate-200">
            <span className="whitespace-nowrap">Pilih Periode:</span>
            <select className="bg-slate-700 border border-slate-600 text-white px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option></option>
            </select>
            <button className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white hover:bg-slate-600">+</button>
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0 ml-4">
          <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-sm text-xs font-semibold flex items-center gap-1 transition-colors text-white whitespace-nowrap">
            <FileText size={14} /> LAPORAN
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Main Header Area */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-4 mb-4 shrink-0">
          <div className="flex gap-8">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-2 max-w-lg">
              <div className="flex items-center">
                <label className={labelClass}>No. Bukti</label>
                <div className="flex gap-1 flex-1">
                  <input type="text" className={`${inputClass} font-semibold`} />
                  <button className="px-3 bg-slate-100 border border-slate-300 rounded-sm text-xs font-semibold text-slate-700 hover:bg-slate-200 whitespace-nowrap">Auto No</button>
                </div>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Tanggal</label>
                <input type="date" className={`${inputClass} w-40`} />
              </div>
              <div className="flex items-center mt-2">
                <label className={labelClass}>Nama Pembeli</label>
                <select 
                  className={inputClass}
                  value={pelangganId}
                  onChange={(e) => setPelangganId(e.target.value)}
                >
                  <option value="">- Pilih Pelanggan -</option>
                  {dummyPelanggan.map(p => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-start">
                <label className={labelClass}>Alamat</label>
                <textarea className={`${readOnlyClass} h-16 resize-none`} readOnly value={alamat} />
              </div>
              
              <div className="flex items-center mt-2">
                <label className={labelClass}>Metode Pembayaran</label>
                <select className={`${inputClass} w-40`}>
                  <option>Cash</option>
                  <option>Transfer</option>
                  <option>Giro</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>No. Cek/Giro</label>
                <input type="text" className={inputClass} />
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Tanggal Cair</label>
                <input type="date" className={`${inputClass} w-40`} />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-2 max-w-lg">
              <div className="flex items-center">
                <label className={labelClass}>Perkiraan Kas/Bank</label>
                <select className={inputClass}>
                  <option>- Pilih Perkiraan -</option>
                  <option>1101 - Kas Besar</option>
                  <option>1102 - Bank BCA</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Mata Uang</label>
                <select className={`${inputClass} w-32`}>
                  <option>IDR</option>
                  <option>USD</option>
                </select>
              </div>
              <div className="flex items-center mt-2">
                <label className={labelClass}>Jumlah Penerimaan</label>
                <input 
                  type="text" 
                  className={`${inputClass} w-48 text-right font-semibold`} 
                  value={jumlahPenerimaanStr}
                  onChange={(e) => handleJumlahPenerimaanChange(e.target.value)}
                  onBlur={(e) => {
                    const num = parseFloat(e.target.value);
                    if (!isNaN(num)) setJumlahPenerimaanStr(formatCurrency(num));
                  }}
                  onFocus={(e) => {
                    if (e.target.value) setJumlahPenerimaanStr(e.target.value.replace(/,/g, ''));
                  }}
                />
              </div>
              <div className="flex items-center">
                <label className={labelClass}>Kurs Pembayaran</label>
                <input type="text" className={`${inputClass} w-32 text-right`} defaultValue="1.00" />
              </div>
              <div className="flex items-start mt-2">
                <label className={labelClass}>Keterangan</label>
                <textarea className={`${inputClass} h-16 resize-none`} />
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-700 mb-1">Rincian Pembayaran</div>
        {/* Data Grid Section */}
        <div className="bg-white rounded-md shadow-sm border border-slate-200 flex-1 flex flex-col min-h-[200px] overflow-hidden mb-4">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs whitespace-nowrap">
              <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300">
                <tr>
                  <th className="w-8 px-2 py-2 text-center border-r border-slate-300"></th>
                  <th className="w-48 px-3 py-2 text-left border-r border-slate-300 font-semibold">No Invoice</th>
                  <th className="w-48 px-3 py-2 text-left border-r border-slate-300 font-semibold">No. Faktur Pajak</th>
                  <th className="w-24 px-3 py-2 text-center border-r border-slate-300 font-semibold">Tgl JT</th>
                  <th className="w-16 px-3 py-2 text-center border-r border-slate-300 font-semibold">Ccy</th>
                  <th className="w-32 px-3 py-2 text-right border-r border-slate-300 font-semibold">Saldo Piutang</th>
                  <th className="w-32 px-3 py-2 text-right border-r border-slate-300 font-semibold">Pembayaran</th>
                  <th className="w-28 px-3 py-2 text-right border-r border-slate-300 font-semibold">Potongan</th>
                  <th className="w-32 px-3 py-2 text-right border-r border-slate-300 font-semibold">Saldo Akhir</th>
                  <th className="px-3 py-2 text-left font-semibold">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const saldoAkhir = getSaldoAkhir(row);
                  return (
                    <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-2 py-1 text-center border-r border-slate-200">
                        <button onClick={() => removeRow(row.id)} className="text-red-500 hover:text-red-700 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                      <td className="px-2 py-1 border-r border-slate-200">
                        <select 
                          className="w-full px-2 py-1 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-xs bg-white"
                          value={row.noInvoice}
                          onChange={(e) => handleRowChange(row.id, 'noInvoice', e.target.value)}
                        >
                          <option value="">- Pilih Invoice -</option>
                          {availableInvoices.map(inv => (
                            <option key={inv.noInvoice} value={inv.noInvoice}>{inv.noInvoice}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-1 border-r border-slate-200 bg-slate-50 text-slate-500">{row.noFakturPajak}</td>
                      <td className="px-2 py-1 border-r border-slate-200 bg-slate-50 text-slate-500 text-center">{row.tglJt}</td>
                      <td className="px-2 py-1 border-r border-slate-200 bg-slate-50 text-slate-500 text-center">{row.ccy}</td>
                      <td className="px-2 py-1 border-r border-slate-200 bg-slate-50 text-slate-500 text-right">
                        {row.noInvoice ? formatCurrency(row.saldoPiutang) : ''}
                      </td>
                      <td className="px-2 py-1 border-r border-slate-200 text-right">
                        <input 
                          type="text" 
                          className="w-full px-2 py-1 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-xs text-right bg-white" 
                          value={row.pembayaranStr}
                          onChange={(e) => handleNumberChange(row.id, 'pembayaranStr', e.target.value)}
                          onBlur={(e) => handleNumberBlur(row.id, 'pembayaranStr', e.target.value)}
                          onFocus={(e) => handleNumberFocus(row.id, 'pembayaranStr', e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-slate-200 text-right">
                        <input 
                          type="text" 
                          className="w-full px-2 py-1 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-xs text-right bg-white" 
                          value={row.potonganStr}
                          onChange={(e) => handleNumberChange(row.id, 'potonganStr', e.target.value)}
                          onBlur={(e) => handleNumberBlur(row.id, 'potonganStr', e.target.value)}
                          onFocus={(e) => handleNumberFocus(row.id, 'potonganStr', e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-1 border-r border-slate-200 bg-slate-50 text-slate-500 text-right">
                        {row.noInvoice ? formatCurrency(saldoAkhir) : ''}
                      </td>
                      <td className="px-2 py-1">
                        <input 
                          type="text" 
                          className="w-full px-2 py-1 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-xs bg-white" 
                          value={row.keterangan}
                          onChange={(e) => handleRowChange(row.id, 'keterangan', e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
                {/* Tambah Baris */}
                <tr className="border-b border-slate-200">
                  <td className="px-2 py-1 text-center border-r border-slate-200 font-bold text-slate-400">*</td>
                  <td colSpan={9} className="px-2 py-1">
                    <button onClick={addRow} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                      <Plus size={14} /> Tambah Baris
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Internal Footer totals */}
          <div className="bg-slate-100 border-t border-slate-300 p-2 flex justify-center text-xs font-bold text-slate-800">
            Pembayaran : IDR {formatCurrency(totalPembayaran)} | Potongan : IDR {formatCurrency(totalPotongan)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 shrink-0">
          <button className={btnSecondary} onClick={() => navigate(-1)}><X size={16} /> Batal</button>
          <button className={btnPrimary}><Save size={16} /> Simpan Pembayaran</button>
        </div>
      </div>
    </div>
  );
};

export default Pembayaran;

