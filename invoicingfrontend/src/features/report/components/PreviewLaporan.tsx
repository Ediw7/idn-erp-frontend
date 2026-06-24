import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('reportType') || '';
    const sjNo = params.get('no_sj');
    const soNo = params.get('no_so');

    let title = 'LAPORAN';
    let targetFormulir = '';
    if (type.startsWith('sj')) { title = 'SURAT JALAN'; targetFormulir = 'Surat Jalan'; }
    if (type.startsWith('so')) { title = 'SALES ORDER'; targetFormulir = 'Sales Order'; }
    if (type.startsWith('inv')) { title = 'INVOICE'; targetFormulir = 'Invoice'; }
    setReportTitle(title);

    const targetNo = type.startsWith('sj') ? sjNo : soNo;
    setDocNumber(targetNo || '-');

    const fetchData = async () => {
      try {
        const [perusahaan, preferensi, soData, pelanggans, items, tandaTanganData] = await Promise.all([
          setupApi.getPerusahaan(),
          setupApi.getPreferensi(),
          salesOrderApi.getAll(),
          setupApi.getPelanggan(),
          setupApi.getItem(),
          setupApi.getTandaTangan()
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
             // Because SJ is prototype, we assume the SO that has this SJ or just take the latest SO
             // If we can't find mapping, we just grab one for demonstration of "Real Data"
             matchingSo = soData.find((s:any) => s.no_so === targetNo) || soData[soData.length-1];
           }
        }

        if (matchingSo) {
          setDocDate(matchingSo.tgl_so || matchingSo.tanggal || new Date().toISOString().split('T')[0]);
          const p = pelanggans.find((x:any) => String(x.id) === String(matchingSo.pelanggan_id));
          setCustomerName(p?.nama || '-');
          setCustomerAddress(matchingSo.alamat_kirim || p?.alamat_kirim || p?.alamat || '-');
          
          if (matchingSo.lines) {
            const mappedLines = matchingSo.lines.map((l:any) => {
              const item = items.find((i:any) => String(i.id) === String(l.item_id));
              return {
                kode: item?.kode || l.kode || '-',
                nama: item?.nama || l.nama || '-',
                kuantum: l.kuantum || 1,
                satuan: item?.satuan || l.satuan || 'Pcs',
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

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center text-slate-500 font-semibold bg-slate-100">Memuat Dokumen...</div>;
  }

  return (
    <div className="w-full h-full bg-slate-100 p-8 flex justify-center overflow-y-auto">
      {/* Kertas A4 Preview */}
      <div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg p-12 flex flex-col font-sans">
        
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

        {/* Customer Info Box */}
        <div className="mb-8 border border-slate-300 p-4 rounded-sm w-1/2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Dikirim Kepada / Pelanggan:</p>
          <p className="text-sm font-bold text-slate-800 uppercase">{customerName}</p>
          <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{customerAddress}</p>
        </div>

        {/* Tabel Konten Barang */}
        <div className="flex-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-400">
                <th className="py-2 px-2 text-left w-12">No.</th>
                <th className="py-2 px-2 text-left w-32">Kode</th>
                <th className="py-2 px-2 text-left">Nama Barang</th>
                <th className="py-2 px-2 text-center w-24">Satuan</th>
                <th className="py-2 px-2 text-right w-24">Kuantum</th>
                <th className="py-2 px-2 text-left w-48">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {lines.length > 0 ? lines.map((l, i) => (
                <tr key={i}>
                  <td className="py-3 px-2 text-slate-500">{i+1}</td>
                  <td className="py-3 px-2 font-mono text-slate-700">{l.kode}</td>
                  <td className="py-3 px-2 font-semibold text-slate-800">{l.nama}</td>
                  <td className="py-3 px-2 text-center text-slate-600">{l.satuan}</td>
                  <td className="py-3 px-2 text-right font-bold text-slate-800">{l.kuantum}</td>
                  <td className="py-3 px-2 text-slate-600">{l.keterangan}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">Tidak ada rincian barang.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
  );
};

export default PreviewLaporan;
