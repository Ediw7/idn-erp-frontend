import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { setupApi } from '../../setup/api';
import { salesOrderApi } from '../../sales-order/api';
import { getSuratJalan, getInvoices, getPembayaran as getPembayaranTrx } from '../../transactionsApi';
import { useAuth } from '../../auth/contexts/AuthContext';

interface CompanyProfile {
  name?: string;
  alamat?: string;
  managerName?: string;
}

const PreviewLaporan: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [company, setCompany] = useState<CompanyProfile>({});
  
  // Data State
  const [reportType, setReportType] = useState('');
  const [reportTitle, setReportTitle] = useState('DOKUMEN ERP');
  const [docNumber, setDocNumber] = useState('-');
  const [docDate, setDocDate] = useState('-');
  const [customerName, setCustomerName] = useState('-');
  const [customerAddress, setCustomerAddress] = useState('-');
  const [customerNpwp, setCustomerNpwp] = useState('-');
  const [lines, setLines] = useState<any[]>([]);
  const [signature, setSignature] = useState<{nama: string, jabatan: string, ttd_image?: string | null} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Financials & Meta
  const [meta, setMeta] = useState<any>({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('reportType') || '';
    const targetNo = params.get('no_sj') || params.get('no_so') || params.get('no_invoice') || params.get('no_pembayaran') || '';

    let title = 'LAPORAN';
    let targetFormulir = '';
    if (type.startsWith('bpk')) { title = 'BUKTI PENERIMAAN KAS'; targetFormulir = 'Pembayaran'; }
    if (type.startsWith('sj')) { title = 'SURAT JALAN'; targetFormulir = 'Surat Jalan'; }
    if (type.startsWith('so')) { title = 'SALES ORDER'; targetFormulir = 'Sales Order'; }
    if (type.startsWith('inv')) { title = 'INVOICE'; targetFormulir = 'Invoice'; }
    setReportTitle(title);
    setReportType(targetFormulir);
    setDocNumber(targetNo || '-');

    const fetchData = async () => {
      try {
        const [perusahaan, preferensi, soData, sjData, invData, pelanggans, items, tandaTanganData, pembayarans, salesmans, pembayaranTrxData] = await Promise.all([
          setupApi.getPerusahaan().catch(() => ({}) as any),
          setupApi.getPreferensi().catch(() => ({}) as any),
          salesOrderApi.getAll().catch(() => [] as any[]),
          getSuratJalan().catch(() => [] as any[]),
          getInvoices().catch(() => [] as any[]),
          setupApi.getPelanggan().catch(() => [] as any[]),
          setupApi.getItem().catch(() => [] as any[]),
          setupApi.getTandaTangan().catch(() => [] as any[]),
          setupApi.getPembayaran().catch(() => [] as any[]),
          setupApi.getSalesman().catch(() => [] as any[]),
          getPembayaranTrx().catch(() => [] as any[])
        ]);

        setCompany({
          name: perusahaan?.name || 'PT. Bawaan Sistem',
          alamat: perusahaan?.street || 'Jl. Placeholder',
          managerName: preferensi?.namaPencetak || ''
        });

        if (tandaTanganData && tandaTanganData.length > 0) {
          const match = tandaTanganData.find((t: any) => t.jenis_formulir?.toLowerCase() === targetFormulir.toLowerCase());
          if (match) {
            setSignature({ nama: match.nama, jabatan: match.jabatan, ttd_image: match.ttd_image });
          } else {
            setSignature({ nama: tandaTanganData[0].nama, jabatan: tandaTanganData[0].jabatan, ttd_image: tandaTanganData[0].ttd_image });
          }
        }

        let mappedLines: any[] = [];
        let p: any = null;

        if (targetFormulir === 'Sales Order') {
          const so = soData.find((s:any) => s.no_so === targetNo);
          if (so) {
            setDocDate(so.tgl_so);
            p = pelanggans.find((x:any) => String(x.id) === String(so.pelanggan_id));
            const pembNama = pembayarans.find((x:any) => String(x.id) === String(so.pembayaran_id))?.nama || '';
            const salesNama = salesmans.find((x:any) => String(x.id) === String(so.salesman_id))?.nama || '';
            setMeta({
              potongan_harga: so.potongan_harga || 0,
              ppn_persen: so.ppn_persen || 0,
              ppnbm_persen: so.ppnbm_persen || 0,
              ongkos_angkut: so.ongkos_angkut || 0,
              no_po: so.no_po || '',
              pembayaran: pembNama,
              salesman: salesNama,
              tgl_kirim: so.tgl_kirim || '',
              keterangan: so.keterangan || ''
            });
            mappedLines = (so.lines || []).map((l:any) => {
              const item = items.find((i:any) => String(i.id) === String(l.item_id));
              return { kode: item?.kode || l.kode || '-', nama: item?.nama || l.nama || '-', kuantum: l.kuantum || 1, satuan: item?.satuan || l.satuan || 'Pcs', harga_satuan: l.harga_satuan || 0, disc_persen: l.disc_persen || 0, disc_harga: l.disc_harga || 0, keterangan: l.keterangan || '-' };
            });
          }
        } 
        else if (targetFormulir === 'Surat Jalan') {
          const sj = sjData.find((s:any) => s.no_sj === targetNo);
          if (sj) {
            setDocDate(sj.tanggal || sj.tgl_sj);
            p = pelanggans.find((x:any) => String(x.id) === String(sj.pelanggan_id));
            setMeta({
              no_so: sj.no_so,
              no_po: sj.no_po,
              no_kendaraan: sj.no_kendaraan,
              gudang: sj.gudang_id, // can be mapped to name if gudangs fetched
              keterangan: sj.keterangan
            });
            mappedLines = (sj.lines || []).map((l:any) => {
              const item = items.find((i:any) => String(i.id) === String(l.item_id));
              return { kode: item?.kode || l.kode || '-', nama: item?.nama || l.nama || '-', kuantum: l.kuantum || 1, satuan: item?.satuan || l.satuan || 'Pcs', keterangan: l.keterangan || '-' };
            });
          }
        }
        else if (targetFormulir === 'Invoice') {
          const inv = invData.find((i:any) => i.no_invoice === targetNo);
          if (inv) {
            setDocDate(inv.tgl_invoice);
            p = pelanggans.find((x:any) => String(x.id) === String(inv.pembeli_id));
            const pembNama = pembayarans.find((x:any) => String(x.id) === String(inv.cara_pembayaran))?.nama || inv.cara_pembayaran || '';
            const salesNama = salesmans.find((x:any) => String(x.id) === String(inv.salesman_id))?.nama || '';
            setMeta({
              potongan_harga: inv.potongan_harga || 0,
              ppn_persen: inv.ppn_persen || 0,
              pph_persen: inv.pph_persen || 0,
              ongkos_angkut: inv.ongkos_angkut || 0,
              no_so: inv.no_so || '',
              no_po: inv.no_po || '',
              tgl_jt: inv.tgl_jt || '',
              mata_uang: inv.mata_uang || 'IDR',
              pembayaran: pembNama,
              salesman: salesNama,
              keterangan: inv.keterangan || ''
            });
            mappedLines = (inv.lines || []).map((l:any) => {
              const item = items.find((i:any) => String(i.id) === String(l.item_id));
              return { kode: item?.kode || l.kode || '-', nama: item?.nama || l.nama || '-', kuantum: l.kuantum || 1, satuan: item?.satuan || l.satuan || 'Pcs', harga_satuan: l.harga_satuan || 0, disc_persen: l.disc_persen || 0, disc_harga: l.disc_harga || 0, keterangan: l.keterangan || '-' };
            });
          }
        }
        else if (targetFormulir === 'Pembayaran') {
          const pem = pembayaranTrxData.find((i:any) => i.no_bukti === targetNo);
          if (pem) {
            setDocDate(pem.tgl_pembayaran || pem.tanggal);
            p = pelanggans.find((x:any) => String(x.id) === String(pem.pelanggan_id));
            setMeta({
              keterangan: pem.keterangan || '',
              jumlah_penerimaan: pem.jumlah_penerimaan || 0,
              total_potongan: pem.total_potongan || 0,
              mata_uang: pem.mata_uang || 'IDR',
              perkiraan_kas_id: pem.perkiraan_kas_id || ''
            });
            
            let tempLines: any[] = [];
            (pem.lines || []).forEach((l:any) => {
              const inv = invData.find((i:any) => i.no_invoice === l.no_invoice);
              
              tempLines.push({ 
                kode: l.no_invoice || '-', 
                nama: `--- RINCIAN INVOICE: ${l.no_invoice || '-'} ${inv?.no_so ? `(SO: ${inv.no_so})` : ''} ---`, 
                kuantum: '', satuan: '', harga_satuan: 0, disc_persen: 0, disc_harga: 0, keterangan: 'HEADER' 
              });

              if (inv && inv.lines) {
                inv.lines.forEach((invL:any) => {
                  const item = items.find((i:any) => String(i.id) === String(invL.item_id));
                  tempLines.push({ 
                    kode: item?.kode || invL.kode || '-', 
                    nama: item?.nama || invL.nama || '-', 
                    kuantum: invL.kuantum || 1, 
                    satuan: item?.satuan || invL.satuan || 'Pcs', 
                    harga_satuan: invL.harga_satuan || 0, 
                    disc_persen: invL.disc_persen || 0, 
                    disc_harga: invL.disc_harga || 0, 
                    keterangan: invL.keterangan || '-' 
                  });
                });
              }

              tempLines.push({ 
                kode: 'PAY', 
                nama: `>> NOMINAL DIBAYAR UNTUK ${l.no_invoice}`, 
                kuantum: 1, 
                satuan: 'Doc', 
                harga_satuan: l.jumlah_bayar || 0, 
                disc_persen: 0, 
                disc_harga: l.potongan || 0, 
                keterangan: 'PAYMENT' 
              });
            });
            mappedLines = tempLines;
          }
        }

        if (p) {
          setCustomerName(p.nama);
          setCustomerAddress(p.alamat_kirim || p.alamat || p.alamat_wp || '-');
          setCustomerNpwp(p.npwp || '-');
        }
        setLines(mappedLines);

      } catch (error) {
        console.error('Error fetching print data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [location.search]);

  const fmt = (n: number) => (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

  // Calculate financial totals
  const subtotal = lines.reduce((acc, l) => {
    const base = (l.kuantum || 0) * (l.harga_satuan || 0);
    const disc = (base * (l.disc_persen || 0) / 100) + (l.disc_harga || 0);
    return acc + (base - disc);
  }, 0);
  const dpp = subtotal - (meta.potongan_harga || 0);
  const ppnAmount = dpp * (meta.ppn_persen || 0) / 100;
  const pphAmount = dpp * (meta.pph_persen || 0) / 100;
  const ppnbmAmount = dpp * (meta.ppnbm_persen || 0) / 100;
  const totalAkhir = dpp + ppnAmount + pphAmount + ppnbmAmount + (meta.ongkos_angkut || 0);

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center text-slate-500 font-semibold bg-slate-100">Memuat Dokumen...</div>;
  }

  const isFinancial = reportType === 'Sales Order' || reportType === 'Invoice' || reportType === 'Pembayaran';

  return (
    <div className="w-full min-h-screen bg-slate-200 flex flex-col font-sans text-slate-800">
      <div className="print:hidden bg-slate-800 px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-semibold text-sm">Preview Dokumen — {reportTitle}</h1>
          <span className="text-slate-400 text-xs font-mono">{docNumber}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-sm hover:bg-blue-700 transition-colors shadow-sm"><Printer size={14} /> PRINT</button>
          <button onClick={() => window.close()} className="px-5 py-2 bg-white text-slate-700 text-xs font-semibold rounded-sm hover:bg-slate-100 transition-colors border border-slate-300">TUTUP</button>
        </div>
      </div>

      <div className="flex-1 flex justify-center py-8 print:py-0 print:bg-white overflow-y-auto">
        <div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg print:shadow-none p-10 flex flex-col relative">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-[3px] border-blue-900 pb-5 mb-6">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-blue-900 tracking-tight uppercase">{company.name}</h2>
              <p className="text-sm text-slate-600 mt-1 max-w-[300px] leading-relaxed">{company.alamat}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <h1 className="text-3xl font-black text-slate-300 uppercase tracking-widest">{reportTitle}</h1>
              <div className="mt-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-sm inline-flex flex-col items-end">
                <span className="text-sm font-bold text-blue-900">{docNumber}</span>
                <span className="text-xs text-slate-600 mt-0.5">Tanggal: <span className="font-semibold">{docDate}</span></span>
              </div>
            </div>
          </div>

          {/* Info Boxes */}
          <div className="flex gap-6 mb-6">
            <div className="flex-1 border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Informasi Pelanggan</h3>
              <p className="text-base font-bold text-slate-800">{customerName}</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{customerAddress}</p>
              {isFinancial && customerNpwp !== '-' && (
                <p className="text-xs text-slate-500 mt-2 font-mono">NPWP: {customerNpwp}</p>
              )}
            </div>
            
            <div className="w-[280px] border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Referensi Dokumen</h3>
              <table className="w-full text-xs text-slate-700">
                <tbody>
                  {meta.no_so && <tr><td className="py-1 font-semibold text-slate-500">No. SO</td><td className="py-1 text-right font-medium">{meta.no_so}</td></tr>}
                  {meta.no_po && <tr><td className="py-1 font-semibold text-slate-500">No. PO</td><td className="py-1 text-right font-medium">{meta.no_po}</td></tr>}
                  {meta.no_kendaraan && <tr><td className="py-1 font-semibold text-slate-500">No. Kendaraan</td><td className="py-1 text-right font-medium">{meta.no_kendaraan}</td></tr>}
                  {meta.tgl_kirim && <tr><td className="py-1 font-semibold text-slate-500">Tgl Kirim</td><td className="py-1 text-right font-medium">{meta.tgl_kirim}</td></tr>}
                  {meta.tgl_jt && <tr><td className="py-1 font-semibold text-slate-500">Jatuh Tempo</td><td className="py-1 text-right font-medium">{meta.tgl_jt}</td></tr>}
                  {meta.pembayaran && <tr><td className="py-1 font-semibold text-slate-500">Termin</td><td className="py-1 text-right font-medium">{meta.pembayaran}</td></tr>}
                  {meta.salesman && <tr><td className="py-1 font-semibold text-slate-500">Salesman</td><td className="py-1 text-right font-medium">{meta.salesman}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 border-y border-slate-300">
                  <th className="py-3 px-3 text-left w-12 font-bold text-slate-700">No</th>
                  <th className="py-3 px-3 text-left w-24 font-bold text-slate-700">Kode</th>
                  <th className="py-3 px-3 text-left font-bold text-slate-700">Deskripsi Barang</th>
                  <th className="py-3 px-3 text-center w-20 font-bold text-slate-700">Satuan</th>
                  <th className="py-3 px-3 text-center w-20 font-bold text-slate-700">Qty</th>
                  {isFinancial && (
                    <>
                      <th className="py-3 px-3 text-right w-28 font-bold text-slate-700">Harga ({meta.mata_uang || 'IDR'})</th>
                      <th className="py-3 px-3 text-right w-20 font-bold text-slate-700">Disc</th>
                      <th className="py-3 px-3 text-right w-32 font-bold text-slate-700">Total</th>
                    </>
                  )}
                  {!isFinancial && (
                    <th className="py-3 px-3 text-left w-48 font-bold text-slate-700">Keterangan</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lines.length > 0 ? lines.map((l, i) => {
                  const base = (l.kuantum || 0) * (l.harga_satuan || 0);
                  const disc = (base * (l.disc_persen || 0) / 100) + (l.disc_harga || 0);
                  const jumlah = base - disc;

                  return (
                    <tr key={i} className="group">
                      <td className="py-3 px-3 text-slate-500">{i+1}</td>
                      <td className="py-3 px-3 font-mono text-slate-600 text-xs">{l.kode}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{l.nama}</td>
                      <td className="py-3 px-3 text-center text-slate-600 text-xs">{l.satuan}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800 bg-slate-50/50 group-hover:bg-transparent">{l.kuantum}</td>
                      {isFinancial && (
                        <>
                          {l.keterangan === 'HEADER' ? (
                            <td colSpan={3} className="py-3 px-3 text-right font-mono font-semibold text-slate-500 text-xs">-</td>
                          ) : l.keterangan === 'PAYMENT' ? (
                            <>
                              <td className="py-3 px-3 text-right font-mono text-emerald-700 text-xs">{fmt(l.harga_satuan)}</td>
                              <td className="py-3 px-3 text-right text-emerald-600 text-xs">{l.disc_harga > 0 ? fmt(l.disc_harga) : '-'}</td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800 text-xs bg-emerald-50/50">{fmt(jumlah)}</td>
                            </>
                          ) : (
                            <>
                              <td className="py-3 px-3 text-right font-mono text-slate-700 text-xs">{fmt(l.harga_satuan)}</td>
                              <td className="py-3 px-3 text-right text-slate-500 text-xs">{l.disc_persen > 0 ? `${l.disc_persen}%` : l.disc_harga > 0 ? fmt(l.disc_harga) : '-'}</td>
                              <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800 text-xs">{fmt(jumlah)}</td>
                            </>
                          )}
                        </>
                      )}
                      {!isFinancial && (
                        <td className="py-3 px-3 text-slate-600 text-xs">{l.keterangan}</td>
                      )}
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={isFinancial ? 8 : 6} className="py-12 text-center text-slate-400 italic">Tidak ada rincian barang.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Financial Summary */}
            {isFinancial && lines.length > 0 && (
              <div className="mt-6 flex justify-end">
                <div className="w-[320px] bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col gap-2 text-sm">
                  {reportType === 'Pembayaran' ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Total Diterima</span>
                        <span className="font-mono font-semibold text-emerald-700">{fmt(meta.jumlah_penerimaan)}</span>
                      </div>
                      {meta.total_potongan > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Total Potongan</span>
                          <span className="font-mono text-red-600">-{fmt(meta.total_potongan)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t-2 border-slate-800 pt-3 mt-2">
                        <span className="font-black text-slate-900 tracking-wider">NET DITERIMA</span>
                        <span className="font-mono font-black text-blue-900 text-lg">{fmt((meta.jumlah_penerimaan || 0) - (meta.total_potongan || 0))}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Sub Total</span>
                        <span className="font-mono font-semibold text-slate-800">{fmt(subtotal)}</span>
                      </div>
                      {meta.potongan_harga > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Potongan Harga</span>
                          <span className="font-mono text-red-600">-{fmt(meta.potongan_harga)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-slate-200 pt-2 mt-1">
                        <span className="text-slate-700 font-bold">Dasar Pengenaan Pajak (DPP)</span>
                        <span className="font-mono font-bold text-slate-800">{fmt(dpp)}</span>
                      </div>
                      {meta.ppn_persen > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">PPN ({meta.ppn_persen}%)</span>
                          <span className="font-mono text-slate-700">{fmt(ppnAmount)}</span>
                        </div>
                      )}
                      {meta.pph_persen > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">PPh 22 ({meta.pph_persen}%)</span>
                          <span className="font-mono text-slate-700">{fmt(pphAmount)}</span>
                        </div>
                      )}
                      {meta.ppnbm_persen > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">PPnBM ({meta.ppnbm_persen}%)</span>
                          <span className="font-mono text-slate-700">{fmt(ppnbmAmount)}</span>
                        </div>
                      )}
                      {meta.ongkos_angkut > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Ongkos Angkut</span>
                          <span className="font-mono text-slate-700">{fmt(meta.ongkos_angkut)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t-2 border-slate-800 pt-3 mt-2">
                        <span className="font-black text-slate-900 tracking-wider">TOTAL TAGIHAN</span>
                        <span className="font-mono font-black text-blue-900 text-lg">{fmt(totalAkhir)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {meta.keterangan && (
            <div className="mb-8 bg-amber-50/50 border border-amber-200 p-4 rounded-lg">
              <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">Catatan Tambahan:</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{meta.keterangan}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 shrink-0 relative">
            {/* Dekorasi Garis Kaki */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-600 to-transparent opacity-20"></div>
            
            <div className="flex justify-between items-start text-sm text-slate-800">
              <div className="flex flex-col items-center w-48 text-center">
                <span className="font-semibold text-slate-600 mb-2">Dibuat Oleh,</span>
                <div className="mt-20 w-full">
                  <p className="font-bold underline underline-offset-4 decoration-slate-400 uppercase tracking-wide">
                    {user?.name || 'Admin ERP'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{user?.is_admin ? 'Administrator' : 'Staff'}</p>
                </div>
              </div>

              {reportType === 'Surat Jalan' && (
                <div className="flex flex-col items-center w-48 text-center">
                  <span className="font-semibold text-slate-600 mb-2">Pengemudi / Supir,</span>
                  <div className="mt-20 w-full">
                    <div className="w-full border-b-2 border-slate-300 pt-5 border-dashed"></div>
                    <p className="text-xs text-slate-500 mt-2">Tanda Tangan & Nama</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center w-48 text-center">
                <span className="font-semibold text-slate-600 mb-2">Penerima / Pelanggan,</span>
                <div className="mt-20 w-full">
                  <div className="w-full border-b-2 border-slate-300 pt-5 border-dashed"></div>
                  <p className="text-xs text-slate-500 mt-2">Tanda Tangan, Nama, & Cap</p>
                </div>
              </div>

              <div className="flex flex-col items-center w-48 text-center">
                <span className="font-semibold text-slate-600 mb-2">Disetujui Oleh,</span>
                <div className="mt-6 w-full flex flex-col items-center min-h-[70px]">
                  {signature?.ttd_image ? (
                    <img src={`data:image/png;base64,${signature.ttd_image}`} alt="Tanda Tangan" className="h-20 object-contain mb-2 opacity-90 mix-blend-multiply" />
                  ) : (
                    <div className="h-20" />
                  )}
                  
                  {signature ? (
                    <>
                      <p className="font-bold underline underline-offset-4 decoration-slate-400 uppercase tracking-wide">
                        {signature.nama}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{signature.jabatan}</p>
                    </>
                  ) : company.managerName ? (
                    <>
                      <p className="font-bold underline underline-offset-4 decoration-slate-400 uppercase tracking-wide">
                        {company.managerName}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Direktur / Manager</p>
                    </>
                  ) : (
                    <div className="w-full border-b-2 border-slate-300 pt-5 border-dashed"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreviewLaporan;
