import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { setupApi } from '../../setup/api';
import { salesOrderApi } from '../../sales-order/api';
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
  const [reportTitle, setReportTitle] = useState('DOKUMEN ERP');
  const [docNumber, setDocNumber] = useState('-');
  const [docDate, setDocDate] = useState('-');
  const [customerName, setCustomerName] = useState('-');
  const [customerAddress, setCustomerAddress] = useState('-');
  const [lines, setLines] = useState<any[]>([]);
  const [signature, setSignature] = useState<{nama: string, jabatan: string, ttd_image?: string | null} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // SO-specific financial data
  const [isSoReport, setIsSoReport] = useState(false);
  const [soFinancials, setSoFinancials] = useState({
    potongan_harga: 0,
    ppn_persen: 0,
    ppnbm_persen: 0,
    ongkos_angkut: 0,
    no_po: '',
    pembayaran_nama: '',
    salesman_nama: '',
    tgl_kirim: '',
    dipesan_oleh: '',
    keterangan: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('reportType') || '';
    const sjNo = params.get('no_sj');
    const soNo = params.get('no_so');

    let title = 'LAPORAN';
    let targetFormulir = '';
    if (type.startsWith('sj')) { title = 'SURAT JALAN'; targetFormulir = 'Surat Jalan'; }
    if (type.startsWith('so')) { title = 'SALES ORDER'; targetFormulir = 'Sales Order'; setIsSoReport(true); }
    if (type.startsWith('inv')) { title = 'INVOICE'; targetFormulir = 'Invoice'; }
    setReportTitle(title);

    const targetNo = type.startsWith('sj') ? sjNo : soNo;
    setDocNumber(targetNo || '-');

    const fetchData = async () => {
      try {
        const [perusahaan, preferensi, soData, pelanggans, items, tandaTanganData, pembayarans, salesmans] = await Promise.all([
          setupApi.getPerusahaan(),
          setupApi.getPreferensi(),
          salesOrderApi.getAll(),
          setupApi.getPelanggan(),
          setupApi.getItem(),
          setupApi.getTandaTangan(),
          setupApi.getPembayaran().catch(() => []),
          setupApi.getSalesman().catch(() => [])
        ]);

        setCompany({
          name: perusahaan?.name || 'PT. Bawaan Sistem',
          alamat: perusahaan?.street || 'Jl. Placeholder',
          managerName: preferensi?.namaPencetak || ''
        });

        if (tandaTanganData && tandaTanganData.length > 0) {
          // Cari tanda tangan yang cocok dengan jenis formulir
          const match = tandaTanganData.find((t: any) => t.jenis_formulir?.toLowerCase() === targetFormulir.toLowerCase());
          if (match) {
            setSignature({ nama: match.nama, jabatan: match.jabatan, ttd_image: match.ttd_image });
          } else {
            // Fallback ke data pertama jika tidak ada yang cocok tapi ada data
            setSignature({ nama: tandaTanganData[0].nama, jabatan: tandaTanganData[0].jabatan, ttd_image: tandaTanganData[0].ttd_image });
          }
        }

        // Try to find matching transaction
        let matchingSo = null;
        if (targetNo) {
           if (type.startsWith('so')) {
             matchingSo = soData.find((s:any) => s.no_so === targetNo);
           } else if (type.startsWith('sj')) {
             matchingSo = soData.find((s:any) => s.no_so === targetNo) || soData[soData.length-1];
           }
        }

        if (matchingSo) {
          setDocDate(matchingSo.tgl_so || matchingSo.tanggal || new Date().toISOString().split('T')[0]);
          const p = pelanggans.find((x:any) => String(x.id) === String(matchingSo.pelanggan_id));
          setCustomerName(p?.nama || '-');
          setCustomerAddress(matchingSo.alamat_kirim || p?.alamat_kirim || p?.alamat || '-');

          // SO financial details
          if (type.startsWith('so')) {
            const pembNama = pembayarans.find((x:any) => String(x.id) === String(matchingSo.pembayaran_id))?.nama || '';
            const salesNama = salesmans.find((x:any) => String(x.id) === String(matchingSo.salesman_id))?.nama || '';
            setSoFinancials({
              potongan_harga: matchingSo.potongan_harga || 0,
              ppn_persen: matchingSo.ppn_persen || 0,
              ppnbm_persen: matchingSo.ppnbm_persen || 0,
              ongkos_angkut: matchingSo.ongkos_angkut || 0,
              no_po: matchingSo.no_po || '',
              pembayaran_nama: pembNama,
              salesman_nama: salesNama,
              tgl_kirim: matchingSo.tgl_kirim || '',
              dipesan_oleh: matchingSo.dipesan_oleh || '',
              keterangan: matchingSo.keterangan || ''
            });
          }
          
          if (matchingSo.lines) {
            const mappedLines = matchingSo.lines.map((l:any) => {
              const item = items.find((i:any) => String(i.id) === String(l.item_id));
              return {
                kode: item?.kode || l.kode || '-',
                nama: item?.nama || l.nama || '-',
                kuantum: l.kuantum || 1,
                satuan: item?.satuan || l.satuan || 'Pcs',
                harga_satuan: l.harga_satuan || 0,
                disc_persen: l.disc_persen || 0,
                disc_harga: l.disc_harga || 0,
                keterangan: l.keterangan || '-'
              };
            });
            setLines(mappedLines);
          }
        }

      } catch (error) {
        console.error('Error fetching print data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [location.search]);

  const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2 });

  // Calculate financial totals for SO
  const subtotal = lines.reduce((acc, l) => {
    const base = (l.kuantum || 0) * (l.harga_satuan || 0);
    const disc = (base * (l.disc_persen || 0) / 100) + (l.disc_harga || 0);
    return acc + (base - disc);
  }, 0);
  const dpp = subtotal - soFinancials.potongan_harga;
  const ppnAmount = dpp * soFinancials.ppn_persen / 100;
  const ppnbmAmount = dpp * soFinancials.ppnbm_persen / 100;
  const totalAkhir = dpp + ppnAmount + ppnbmAmount + soFinancials.ongkos_angkut;

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center text-slate-500 font-semibold bg-slate-100">Memuat Dokumen...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-slate-200 flex flex-col">
      {/* Toolbar - hidden when printing */}
      <div className="print:hidden bg-slate-800 px-6 py-3 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-semibold text-sm">Preview Dokumen — {reportTitle}</h1>
          <span className="text-slate-400 text-xs font-mono">{docNumber}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-xs font-semibold rounded-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Printer size={14} /> PRINT
          </button>
          <button
            onClick={() => window.close()}
            className="px-5 py-2 bg-white text-slate-700 text-xs font-semibold rounded-sm hover:bg-slate-100 transition-colors border border-slate-300"
          >
            TUTUP
          </button>
        </div>
      </div>

      {/* Paper */}
      <div className="flex-1 flex justify-center py-8 print:py-0 print:bg-white overflow-y-auto">
        <div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg print:shadow-none p-12 flex flex-col font-sans">
          
          {/* Header Dokumen */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900">{reportTitle}</h1>
              <p className="text-sm font-semibold text-slate-700 mt-1">{company.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{company.alamat}</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-mono font-bold text-slate-800">{docNumber}</h2>
              <p className="text-sm text-slate-600 mt-1">Tanggal: <span className="font-semibold">{docDate}</span></p>
            </div>
          </div>

          {/* Customer Info + SO Meta */}
          <div className="mb-6 flex gap-8">
            <div className="border border-slate-300 p-4 rounded-sm flex-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Dikirim Kepada / Pelanggan:</p>
              <p className="text-sm font-bold text-slate-800 uppercase">{customerName}</p>
              <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{customerAddress}</p>
            </div>
            {isSoReport && (
              <div className="border border-slate-300 p-4 rounded-sm w-[240px] text-xs text-slate-700 flex flex-col gap-1.5">
                {soFinancials.no_po && (
                  <div className="flex justify-between"><span className="font-semibold">No. PO:</span><span>{soFinancials.no_po}</span></div>
                )}
                {soFinancials.tgl_kirim && (
                  <div className="flex justify-between"><span className="font-semibold">Tgl Kirim:</span><span>{soFinancials.tgl_kirim}</span></div>
                )}
                {soFinancials.pembayaran_nama && (
                  <div className="flex justify-between"><span className="font-semibold">Pembayaran:</span><span>{soFinancials.pembayaran_nama}</span></div>
                )}
                {soFinancials.salesman_nama && (
                  <div className="flex justify-between"><span className="font-semibold">Salesman:</span><span>{soFinancials.salesman_nama}</span></div>
                )}
                {soFinancials.dipesan_oleh && (
                  <div className="flex justify-between"><span className="font-semibold">Dipesan Oleh:</span><span>{soFinancials.dipesan_oleh}</span></div>
                )}
              </div>
            )}
          </div>

          {/* Tabel Konten Barang */}
          <div className="flex-1">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-400">
                  <th className="py-2 px-2 text-left w-10">No.</th>
                  <th className="py-2 px-2 text-left w-24">Kode</th>
                  <th className="py-2 px-2 text-left">Nama Barang</th>
                  <th className="py-2 px-2 text-center w-16">Satuan</th>
                  <th className="py-2 px-2 text-right w-16">Qty</th>
                  {isSoReport && (
                    <>
                      <th className="py-2 px-2 text-right w-24">Harga</th>
                      <th className="py-2 px-2 text-center w-14">Disc%</th>
                      <th className="py-2 px-2 text-right w-28">Jumlah</th>
                    </>
                  )}
                  {!isSoReport && (
                    <th className="py-2 px-2 text-left w-40">Keterangan</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {lines.length > 0 ? lines.map((l, i) => {
                  const base = (l.kuantum || 0) * (l.harga_satuan || 0);
                  const disc = (base * (l.disc_persen || 0) / 100) + (l.disc_harga || 0);
                  const jumlah = base - disc;

                  return (
                    <tr key={i}>
                      <td className="py-2.5 px-2 text-slate-500">{i+1}</td>
                      <td className="py-2.5 px-2 font-mono text-slate-700 text-xs">{l.kode}</td>
                      <td className="py-2.5 px-2 font-semibold text-slate-800">{l.nama}</td>
                      <td className="py-2.5 px-2 text-center text-slate-600">{l.satuan}</td>
                      <td className="py-2.5 px-2 text-right font-bold text-slate-800">{l.kuantum}</td>
                      {isSoReport && (
                        <>
                          <td className="py-2.5 px-2 text-right font-mono text-slate-700 text-xs">{fmt(l.harga_satuan)}</td>
                          <td className="py-2.5 px-2 text-center text-slate-600 text-xs">{l.disc_persen > 0 ? `${l.disc_persen}%` : '-'}</td>
                          <td className="py-2.5 px-2 text-right font-mono font-semibold text-slate-800 text-xs">{fmt(jumlah)}</td>
                        </>
                      )}
                      {!isSoReport && (
                        <td className="py-2.5 px-2 text-slate-600">{l.keterangan}</td>
                      )}
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={isSoReport ? 8 : 6} className="py-8 text-center text-slate-400 italic">Tidak ada rincian barang.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Financial Summary for SO */}
            {isSoReport && lines.length > 0 && (
              <div className="mt-4 flex justify-end">
                <div className="w-[300px] border-t-2 border-slate-400 pt-3 flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Sub Total</span>
                    <span className="font-mono font-semibold text-slate-800">{fmt(subtotal)}</span>
                  </div>
                  {soFinancials.potongan_harga > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Potongan Harga</span>
                      <span className="font-mono text-red-600">-{fmt(soFinancials.potongan_harga)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">DPP</span>
                    <span className="font-mono text-slate-700">{fmt(dpp)}</span>
                  </div>
                  {soFinancials.ppn_persen > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">PPN ({soFinancials.ppn_persen}%)</span>
                      <span className="font-mono text-slate-700">{fmt(ppnAmount)}</span>
                    </div>
                  )}
                  {soFinancials.ppnbm_persen > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">PPnBM ({soFinancials.ppnbm_persen}%)</span>
                      <span className="font-mono text-slate-700">{fmt(ppnbmAmount)}</span>
                    </div>
                  )}
                  {soFinancials.ongkos_angkut > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Ongkos Angkut</span>
                      <span className="font-mono text-slate-700">{fmt(soFinancials.ongkos_angkut)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t-2 border-slate-800 pt-2 mt-1">
                    <span className="font-bold text-slate-800">TOTAL</span>
                    <span className="font-mono font-bold text-slate-900 text-base">{fmt(totalAkhir)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Keterangan */}
          {isSoReport && soFinancials.keterangan && (
            <div className="mt-6 mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Keterangan:</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{soFinancials.keterangan}</p>
            </div>
          )}

          {/* Footer / Tanda Tangan */}
          <div className="mt-12 pt-8 border-t border-slate-200 shrink-0">
            <div className="flex justify-between items-start text-sm text-slate-800">
              {/* Sisi Kiri: Dibuat Oleh */}
              <div className="flex flex-col items-center w-48 text-center">
                <span className="font-semibold mb-2">Dibuat Oleh,</span>
                <div className="mt-20 w-full">
                  <p className="font-bold underline underline-offset-4 decoration-slate-400 uppercase">
                    {user?.name || 'User Tidak Dikenal'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{user?.is_admin ? 'Administrator' : 'Staff'}</p>
                </div>
              </div>

              {/* Sisi Tengah: Penerima */}
              <div className="flex flex-col items-center w-48 text-center">
                <span className="font-semibold mb-2">Penerima / Pelanggan,</span>
                <div className="mt-20 w-full">
                  <div className="w-full border-b border-slate-800 pt-5"></div>
                  <p className="text-xs text-slate-500 mt-1">Nama Jelas & Cap</p>
                </div>
              </div>

              {/* Sisi Kanan: Disetujui Oleh */}
              <div className="flex flex-col items-center w-48 text-center">
                <span className="font-semibold mb-2">Disetujui Oleh,</span>
                <div className="mt-8 w-full flex flex-col items-center min-h-[60px]">
                  {signature?.ttd_image ? (
                    <img src={`data:image/png;base64,${signature.ttd_image}`} alt="Tanda Tangan" className="h-16 object-contain mb-2" />
                  ) : (
                    <div className="h-16" />
                  )}
                  
                  {signature ? (
                    <>
                      <p className="font-bold underline underline-offset-4 decoration-slate-400 uppercase">
                        {signature.nama}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{signature.jabatan}</p>
                    </>
                  ) : company.managerName ? (
                    <>
                      <p className="font-bold underline underline-offset-4 decoration-slate-400 uppercase">
                        {company.managerName}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Manager</p>
                    </>
                  ) : (
                    <div className="w-full border-b border-slate-800 pt-5"></div>
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
