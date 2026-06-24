import React, { useState, useEffect } from 'react';
import { FilePlus, Trash2, X, Printer, Search, Save, Send, Plus, Edit2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext';
import { setupApi, PelangganData, GudangData, ItemData } from '../../setup/api';
import { salesOrderApi, SalesOrderData } from '../../sales-order/api';
import { useSignatureAutoFill } from '../../../hooks/useSignatureAutoFill';

const SuratJalan: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Master Data
  const [pelanggans, setPelanggans] = useState<PelangganData[]>([]);
  const [gudangs, setGudangs] = useState<GudangData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrderData[]>([]);

  const [periode, setPeriode] = useState('2026-06');

  const [showNewSjModal, setShowNewSjModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [activeTab, setActiveTab] = useState<'info' | 'detail'>('info');
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [editLineIndex, setEditLineIndex] = useState<number | null>(null);
  const [lineForm, setLineForm] = useState<any>({ item_id: null, kode: '', nama: '', satuan: '', kuantum: 1, keterangan: '' });

  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [dataList, setDataList] = useState<any[]>(() => {
    const saved = localStorage.getItem('edi_surat_jalans');
    return saved ? JSON.parse(saved) : [];
  });

  const emptyForm = {
    id: '',
    no_sj: '',
    tanggal: new Date().toISOString().split('T')[0],
    pelanggan_id: '',
    alamat_kirim: '',
    gudang_id: '',
    no_so: '',
    no_po: '',
    no_kendaraan: '',
    no_invoice: '',
    keterangan: '',
    penandatangan: 'Admin',
    jabatan: 'Logistik',
    lines: [],
    create_date: '',
    create_uid_name: '',
    write_date: '',
    write_uid_name: ''
  };

  const [form, setForm] = useState<any>(emptyForm);
  const [modalForm, setModalForm] = useState<any>(emptyForm);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const { signatureData } = useSignatureAutoFill('Surat Jalan');

  useEffect(() => {
    if (signatureData) {
      setForm((prev: any) => ({
        ...prev,
        penandatangan: signatureData.nama || prev.penandatangan,
        jabatan: signatureData.jabatan || prev.jabatan
      }));
    }
  }, [signatureData]);

  useEffect(() => {
    // Parse query params if navigating from Sales Order
    const params = new URLSearchParams(location.search);
    const so = params.get('so');
    const pelanggan = params.get('pelanggan');
    const gudang = params.get('gudang');
    const tgl = params.get('tgl');

    if (so) {
      setViewMode('form');
    }

    if (so && salesOrders.length > 0 && items.length > 0) {
      const selectedSO = salesOrders.find(s => s.no_so === so);
      let soLines: any[] = [];
      if (selectedSO && selectedSO.lines) {
        soLines = selectedSO.lines.map((line: any) => {
          const itemInfo = items.find(i => String(i.id) === String(line.item_id));
          return {
            item_id: line.item_id,
            kode: itemInfo?.kode || line.kode || '',
            nama: itemInfo?.nama || line.nama || '',
            satuan: itemInfo?.satuan || line.satuan || '',
            kuantum: line.kuantum,
            keterangan: line.keterangan || ''
          };
        });
      }

      setForm((prev: any) => {
        // Hanya generate No. SJ jika belum ada
        const autoSjNumber = prev.no_sj || `SJ/00${Math.floor(Math.random() * 100)}/06/2026`;
        
        return {
          ...prev,
          no_sj: autoSjNumber,
          no_so: so,
          pelanggan_id: pelanggan || (selectedSO?.pelanggan_id ? String(selectedSO.pelanggan_id) : ''),
          alamat_kirim: selectedSO?.alamat_kirim || prev.alamat_kirim || '',
          no_po: selectedSO?.no_po || prev.no_po || '',
          gudang_id: gudang || prev.gudang_id || '',
          tanggal: tgl || prev.tanggal,
          lines: soLines.length > 0 ? soLines : prev.lines
        };
      });
    }
  }, [location.search, salesOrders, items]);

  const fetchInitialData = async () => {
    try {
      const [p, g, i, so] = await Promise.all([
        setupApi.getPelanggan(),
        setupApi.getGudang(),
        setupApi.getItem(),
        salesOrderApi.getAll()
      ]);
      setPelanggans(p || []);
      setGudangs(g || []);
      setItems(i || []);
      setSalesOrders(so || []);
      
      const defGudang = (g || []).find((x: any) => x.is_default);
      if (defGudang && !form.gudang_id && !form.no_so) {
        setForm((prev: any) => ({ ...prev, gudang_id: String(defGudang.id) }));
      }
    } catch (e) {
      toast.error('Gagal mengambil data referensi');
    }
  };

  const handlePelangganChange = (targetForm: any, setTargetForm: any, val: string) => {
    const p = pelanggans.find(x => String(x.id) === val);
    setTargetForm({ ...targetForm, pelanggan_id: val, alamat_kirim: p?.alamat_kirim || p?.alamat || '' });
  };

  const handleSOChange = (targetForm: any, setTargetForm: any, val: string) => {
    const so = salesOrders.find(x => x.no_so === val);
    if (so) {
      let soLines: any[] = [];
      if (so.lines) {
        soLines = so.lines.map((line: any) => {
          const itemInfo = items.find(i => String(i.id) === String(line.item_id));
          return {
            item_id: line.item_id,
            kode: itemInfo?.kode || line.kode || '',
            nama: itemInfo?.nama || line.nama || '',
            satuan: itemInfo?.satuan || line.satuan || '',
            kuantum: line.kuantum,
            keterangan: line.keterangan || ''
          };
        });
      }

      setTargetForm({
        ...targetForm,
        no_so: val,
        no_sj: targetForm.no_sj || `SJ/00${Math.floor(Math.random() * 100)}/06/2026`,
        pelanggan_id: String(so.pelanggan_id || ''),
        alamat_kirim: so.alamat_kirim || '',
        no_po: so.no_po || '',
        lines: soLines.length > 0 ? soLines : targetForm.lines
      });
    } else {
      setTargetForm({ ...targetForm, no_so: val });
    }
  };

  const handleCreateSJ = () => {
    if (!modalForm.no_sj) {
      toast.error('No. Surat Jalan harus diisi!');
      return;
    }
    if (!modalForm.pelanggan_id) {
      toast.error('Pelanggan harus dipilih!');
      return;
    }

    // Auto-fill lines if SO is selected from Modal
    let initialLines: any[] = [];
    if (modalForm.no_so) {
      const selectedSO = salesOrders.find(so => so.no_so === modalForm.no_so);
      if (selectedSO && selectedSO.lines) {
        initialLines = selectedSO.lines.map((line: any) => {
          const itemInfo = items.find(i => String(i.id) === String(line.item_id));
          return {
            item_id: line.item_id,
            kode: itemInfo?.kode || line.kode || '',
            nama: itemInfo?.nama || line.nama || '',
            satuan: itemInfo?.satuan || line.satuan || '',
            kuantum: line.kuantum,
            keterangan: line.keterangan || ''
          };
        });
      }
    }

    // Move modal data to main form
    setForm({
      ...modalForm,
      lines: initialLines,
      create_date: new Date().toISOString(),
      create_uid_name: user?.name || 'Unknown'
    });

    setShowNewSjModal(false);
    toast.success('Header Surat Jalan berhasil dibuat. Silakan cek detail barang.');
  };

  const handleSaveAll = () => {
    if (!form.no_sj) {
      toast.error('Harap isi header Surat Jalan terlebih dahulu!');
      return;
    }

    const updatedForm = {
      ...form,
      write_date: new Date().toISOString(),
      write_uid_name: user?.name || 'Unknown'
    };

    setForm(updatedForm);
    
    // Save to localStorage and state list
    const existingIndex = dataList.findIndex(sj => sj.no_sj === updatedForm.no_sj);
    let newList = [...dataList];
    if (existingIndex >= 0) {
      newList[existingIndex] = updatedForm;
    } else {
      newList.push(updatedForm);
    }
    setDataList(newList);
    localStorage.setItem('edi_surat_jalans', JSON.stringify(newList));

    toast.success('Surat Jalan berhasil disimpan');
    setViewMode('list');
  };

  const calculateTotalQty = () => {
    return form.lines.reduce((acc: number, curr: any) => acc + (Number(curr.kuantum) || 0), 0);
  };

  const handleOpenAddLine = () => {
    setEditLineIndex(null);
    setLineForm({ item_id: null, kode: '', nama: '', satuan: '', kuantum: 1, keterangan: '' });
    setIsLineModalOpen(true);
  };

  const handleOpenEditLine = (idx: number) => {
    setEditLineIndex(idx);
    setLineForm({ ...form.lines[idx] });
    setIsLineModalOpen(true);
  };

  const handleSaveLine = () => {
    if (!lineForm.item_id) {
      toast.error('Item harus dipilih!');
      return;
    }
    const newLines = [...(form.lines || [])];
    if (editLineIndex !== null) {
      newLines[editLineIndex] = lineForm;
    } else {
      newLines.push(lineForm);
    }
    setForm({ ...form, lines: newLines });
    setIsLineModalOpen(false);
  };

  const handleDeleteSJ = (no_sj: string) => {
    if (window.confirm('Yakin ingin menghapus Surat Jalan ini?')) {
      const newList = dataList.filter(sj => sj.no_sj !== no_sj);
      setDataList(newList);
      localStorage.setItem('edi_surat_jalans', JSON.stringify(newList));
      toast.success('Surat Jalan berhasil dihapus');
    }
  };

  const inputClass = "w-full px-3 py-1.5 border border-slate-300 rounded-sm text-sm focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white";
  const labelClass = "text-sm font-semibold text-slate-700 w-36 shrink-0 pt-1";

  if (viewMode === 'list') {
    return (
      <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white">Surat Jalan</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-slate-300 font-medium">Pilih Periode:</span>
              <select
                value={periode}
                onChange={e => setPeriode(e.target.value)}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026-06">Juni 2026</option>
                <option value="2026-05">Mei 2026</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => {
              setForm(emptyForm);
              setViewMode('form');
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
          >
            <Plus size={14} /> TAMBAH BARU
          </button>
        </div>

        <div className="flex-1 p-6 overflow-hidden flex flex-col">
          <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-x-auto flex-1">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 font-semibold text-slate-700">Kode Gudang</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">No. SJ</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Tgl</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Nama Pelanggan</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Alamat</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">No. PO</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">No. SO</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">No. Invoice</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Kendaraan</th>
                  <th className="px-3 py-2 font-semibold text-slate-700">Keterangan</th>
                  <th className="px-3 py-2 font-semibold text-slate-700 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dataList.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-slate-500 italic">Belum ada data Surat Jalan.</td>
                  </tr>
                ) : (
                  dataList.map((item, idx) => {
                    const pelanggan = pelanggans.find(p => String(p.id) === String(item.pelanggan_id));
                    const pelangganNama = pelanggan?.nama || item.pelanggan_id;
                    const alamat = item.alamat_kirim || pelanggan?.alamat || '';
                    const gudang = gudangs.find(g => String(g.id) === String(item.gudang_id));
                    const gudangKode = gudang?.kode_gudang || item.gudang_id || '-';

                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-800">{gudangKode}</td>
                        <td className="px-3 py-2 font-mono text-slate-800 font-medium">{item.no_sj}</td>
                        <td className="px-3 py-2 text-slate-600">{item.tanggal}</td>
                        <td className="px-3 py-2 text-slate-800">{pelangganNama}</td>
                        <td className="px-3 py-2 text-slate-600 truncate max-w-[150px]" title={alamat}>{alamat}</td>
                        <td className="px-3 py-2 text-slate-600">{item.no_po || '-'}</td>
                        <td className="px-3 py-2 font-mono text-slate-600">{item.no_so || '-'}</td>
                        <td className="px-3 py-2 font-mono text-slate-600">{item.no_invoice || '-'}</td>
                        <td className="px-3 py-2 text-slate-600">{item.no_kendaraan || '-'}</td>
                        <td className="px-3 py-2 text-slate-600 truncate max-w-[100px]" title={item.keterangan}>{item.keterangan || '-'}</td>
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
                              onClick={() => handleDeleteSJ(item.no_sj)}
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
  }

  return (
    <>
      <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white">Surat Jalan</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-slate-300 font-medium">Pilih Periode:</span>
              <select
                value={periode}
                onChange={e => setPeriode(e.target.value)}
                className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
              >
                <option value="2026-06">Juni 2026</option>
                <option value="2026-05">Mei 2026</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 transition-colors rounded-sm shadow-sm mr-2"
            >
              KEMBALI KE LIST
            </button>
            <button
              onClick={() => {
                const defGudangId = gudangs.find(g => g.is_default)?.id || '';
                setModalForm({ ...emptyForm, gudang_id: String(defGudangId), no_sj: `SJ/00${Math.floor(Math.random() * 100)}/06/2026` });
                setShowNewSjModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm"
            >
              <FilePlus size={14} /> BUAT SJ OTOMATIS </button>
            <button
              onClick={() => {
                const reportName = 'Surat Jalan (A4 / Kwarto / 1/2 Kwarto) - Font 10';
                const url = form.no_sj
                  ? `/laporan?sj_number=${encodeURIComponent(form.no_sj)}&reportName=${encodeURIComponent(reportName)}`
                  : `/laporan?reportName=${encodeURIComponent(reportName)}`;
                navigate(url);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors ml-2 rounded-sm shadow-sm"
            >
              <Printer size={14} /> CETAK
            </button>
            <button
              onClick={() => {
                if (!form.no_sj) {
                  toast.error('Harap buat atau pilih Surat Jalan terlebih dahulu! Data invoice akan ditarik otomatis dari Surat Jalan tersebut.');
                  return;
                }
                setShowInvoiceModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-green-600 border border-transparent hover:bg-green-500 transition-colors ml-2 rounded-sm shadow-sm"
            >
              <Send size={14} /> BUAT INVOICE </button>
          </div>
        </div>

        {/* Mini Header State */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex gap-12">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">No. Surat Jalan</span>
              <span className="text-sm font-mono font-bold text-slate-800">{form.no_sj || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Pelanggan</span>
              <span className="text-sm font-bold text-slate-800">
                {pelanggans.find(p => String(p.id) === form.pelanggan_id)?.nama || '-'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tanggal</span>
              <span className="text-sm font-bold text-slate-800">{form.tanggal || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Dari SO</span>
              <span className="text-sm font-mono font-bold text-slate-800">{form.no_so || '-'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {form.no_invoice && (
              <span className="px-2.5 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-sm uppercase tracking-wide">
                Telah Di-Invoice
              </span>
            )}
          </div>
        </div>

        {/* Main Flowing Layout */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-6 flex flex-col gap-6">

          {/* Informasi Umum Block */}
          <div className="bg-white border border-slate-300 rounded-sm shadow-sm p-6 shrink-0">
            <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Informasi Umum</h3>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Kolom Kiri */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-start">
                  <label className={labelClass}>No. Surat Jalan</label>
                  <div className="flex gap-1 flex-1">
                    <input type="text" className={`${inputClass} font-mono w-48 bg-slate-50`} readOnly value={form.no_sj || ''} />
                    <button className="px-3 py-1.5 border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm"><Search size={14} /></button>
                  </div>
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Tanggal</label>
                  <input type="date" className={`${inputClass} w-48`} value={form.tanggal || ''} onChange={e => setForm({ ...form, tanggal: e.target.value })} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Nama Pelanggan</label>
                  <div className="flex gap-1 flex-1">
                    <select className={inputClass} value={form.pelanggan_id || ''} onChange={e => handlePelangganChange(form, setForm, e.target.value)}>
                      <option value="">-- Pilih --</option>
                      {pelanggans.map(p => <option key={p.id} value={String(p.id)}>{p.nama}</option>)}
                    </select>
                    <button onClick={() => navigate('/setup/pelanggan')} className="px-3 py-1.5 font-bold border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm text-slate-600">+</button>
                  </div>
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Dikirim ke Alamat</label>
                  <textarea className={`${inputClass} h-20 resize-none bg-slate-50`} readOnly value={form.alamat_kirim || ''} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Gudang</label>
                  <select className={`${inputClass} w-64`} value={form.gudang_id || ''} onChange={e => setForm({ ...form, gudang_id: e.target.value })}>
                    <option value="">-- Pilih --</option>
                    {gudangs.map(g => <option key={g.id} value={String(g.id)}>{g.nama_gudang}</option>)}
                  </select>
                </div>
              </div>

              {/* Kolom Tengah */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-start">
                  <label className={labelClass}>No. Sales Order</label>
                  <div className="flex gap-1 flex-1">
                    <select className={`${inputClass} font-mono`} value={form.no_so || ''} onChange={e => handleSOChange(form, setForm, e.target.value)}>
                      <option value="">-- Pilih --</option>
                      {salesOrders.map(so => <option key={so.id} value={so.no_so}>{so.no_so}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>No. PO</label>
                  <input type="text" className={`${inputClass} w-full`} value={form.no_po || ''} onChange={e => setForm({ ...form, no_po: e.target.value })} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>No. Kendaraan</label>
                  <input type="text" className={`${inputClass} w-64`} value={form.no_kendaraan || ''} onChange={e => setForm({ ...form, no_kendaraan: e.target.value })} />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>No. Invoice</label>
                  <input type="text" className={`${inputClass} w-64 bg-slate-50 cursor-not-allowed`} readOnly value={form.no_invoice || ''} placeholder="Terisi jika sudah di-invoice" />
                </div>
                <div className="flex items-start">
                  <label className={labelClass}>Keterangan</label>
                  <textarea className={`${inputClass} h-20 resize-none`} value={form.keterangan || ''} onChange={e => setForm({ ...form, keterangan: e.target.value })} />
                </div>
              </div>

              {/* Kolom Kanan - Audit */}
              <div className="w-[280px] flex flex-col gap-4">
                <div className="border border-slate-300 p-3 relative mt-2 rounded-sm bg-white shadow-sm">
                  <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Created</span>
                  <div className="flex gap-2 mt-2">
                    <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.create_date ? new Date(form.create_date).toLocaleString('id-ID') : '-'} />
                    <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.create_uid_name || user?.name || 'Unknown'} />
                  </div>
                </div>
                <div className="border border-slate-300 p-3 relative mt-3 rounded-sm bg-white shadow-sm">
                  <span className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Record Modified</span>
                  <div className="flex gap-2 mt-2">
                    <input type="text" className="w-full px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 font-mono rounded-sm" readOnly value={form.write_date ? new Date(form.write_date).toLocaleString('id-ID') : '-'} />
                    <input type="text" className="w-20 px-2 py-1.5 text-xs border border-slate-200 bg-slate-50 text-center rounded-sm" readOnly value={form.write_uid_name || user?.name || 'Unknown'} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Barang Block */}
          <div className="bg-white border border-slate-300 rounded-sm shadow-sm flex flex-col shrink-0">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-300 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Detail Barang Surat Jalan</h3>
              <button onClick={handleOpenAddLine} className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors rounded-sm shadow-sm">
                <Plus size={14} /> TAMBAH BARANG PENGIRIMAN
              </button>
            </div>

            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-xs text-slate-700 bg-slate-100 border-b border-slate-300 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-center w-12 border-r border-slate-200">No.</th>
                    <th className="px-4 py-3 font-semibold w-48 border-r border-slate-200">Kode Barang</th>
                    <th className="px-4 py-3 font-semibold min-w-[250px] border-r border-slate-200">Nama Barang</th>
                    <th className="px-4 py-3 font-semibold text-center w-24 border-r border-slate-200">Satuan</th>
                    <th className="px-4 py-3 font-semibold text-right w-32 border-r border-slate-200">Kuantum</th>
                    <th className="px-4 py-3 font-semibold min-w-[200px] border-r border-slate-200">Keterangan</th>
                    <th className="px-4 py-3 font-semibold text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {(form.lines || []).map((line: any, idx: number) => (
                    <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-4 py-2.5 text-center font-medium text-slate-500 border-r border-slate-200">{idx + 1}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-700 border-r border-slate-200">{line.kode}</td>
                      <td className="px-4 py-2.5 text-slate-800 font-medium border-r border-slate-200">{line.nama}</td>
                      <td className="px-4 py-2.5 text-center text-slate-600 border-r border-slate-200">{line.satuan}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-800 border-r border-slate-200">{line.kuantum}</td>
                      <td className="px-4 py-2.5 text-slate-600 border-r border-slate-200 truncate max-w-[200px]">{line.keterangan || '-'}</td>
                      <td className="px-4 py-2.5 text-center">
                        <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenEditLine(idx)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Ubah"><Edit2 size={16} /></button>
                          <button onClick={() => removeLine(idx)} className="text-red-500 hover:text-red-700 transition-colors" title="Hapus"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!form.lines || form.lines.length === 0) && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400 bg-slate-50 italic">
                        Belum ada barang pengiriman. Klik "TAMBAH BARANG PENGIRIMAN" untuk memasukkan item.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Global Persistent Footer */}
        <div className="bg-white border-t border-slate-200 p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-sm px-6 py-2 flex items-center gap-4">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Total Kuantum Pengiriman</span>
                <span className="text-2xl font-mono font-black text-blue-900">{calculateTotalQty()}</span>
              </div>
            </div>
            <button onClick={handleSaveAll} className="px-10 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg rounded-sm flex items-center gap-2">
              <Save size={18} /> SIMPAN SURAT JALAN
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah SJ (Header Only) */}
      {showNewSjModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-md shadow-2xl flex flex-col overflow-hidden border border-slate-300 my-8">
            {/* Modal Header */}
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white shrink-0">
              <div>
                <h3 className="font-semibold text-base">Buat Surat Jalan Baru</h3>
                <p className="text-xs text-slate-300 mt-0.5">Isi detail dokumen header sebelum menambahkan pengiriman barang.</p>
              </div>
              <button onClick={() => setShowNewSjModal(false)} className="text-slate-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {/* Kolom 1 */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">No. Surat Jalan</label>
                    <div className="flex gap-2">
                      <input type="text" className={`${inputClass} flex-1`} value={modalForm.no_sj || ''} onChange={e => setModalForm({ ...modalForm, no_sj: e.target.value })} />
                      <button
                        className="px-3 py-1.5 text-xs font-bold border border-slate-300 bg-slate-100 hover:bg-slate-200 rounded-sm shadow-sm"
                        onClick={() => {
                          const defGudangId = gudangs.find(g => g.is_default)?.id || '';
                          setModalForm({ ...modalForm, gudang_id: String(defGudangId), no_sj: `SJ/00${Math.floor(Math.random() * 100)}/06/2026` });
                        }}
                      >
                        Auto No
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Tanggal Pengiriman</label>
                    <input type="date" className={inputClass} value={modalForm.tanggal || ''} onChange={e => setModalForm({ ...modalForm, tanggal: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Nama Pelanggan</label>
                    <select
                      className={inputClass}
                      value={modalForm.pelanggan_id || ''}
                      onChange={e => handlePelangganChange(modalForm, setModalForm, e.target.value)}
                    >
                      <option value="">-- Pilih --</option>
                      {pelanggans.map(p => <option key={p.id} value={String(p.id)}>{p.nama}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Dikirim ke Alamat</label>
                    <textarea
                      className={`${inputClass} h-20 resize-none bg-slate-50`}
                      readOnly
                      value={modalForm.alamat_kirim || ''}
                    />
                  </div>
                </div>
                {/* Kolom 2 */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Gudang</label>
                    <select className={inputClass} value={modalForm.gudang_id || ''} onChange={e => setModalForm({ ...modalForm, gudang_id: e.target.value })}>
                      <option value="">-- Pilih Gudang --</option>
                      {gudangs.map(g => <option key={g.id} value={String(g.id)}>{g.nama_gudang}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-700">No. Sales Order</label>
                      <select className={inputClass} value={modalForm.no_so || ''} onChange={e => handleSOChange(modalForm, setModalForm, e.target.value)}>
                        <option value="">-- Pilih SO --</option>
                        {salesOrders.map(so => <option key={so.id} value={so.no_so}>{so.no_so}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-slate-700">No. PO Pelanggan</label>
                      <input type="text" className={inputClass} value={modalForm.no_po || ''} onChange={e => setModalForm({ ...modalForm, no_po: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">No. Kendaraan</label>
                    <input type="text" className={inputClass} value={modalForm.no_kendaraan || ''} onChange={e => setModalForm({ ...modalForm, no_kendaraan: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Keterangan</label>
                    <input type="text" className={inputClass} value={modalForm.keterangan || ''} onChange={e => setModalForm({ ...modalForm, keterangan: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowNewSjModal(false)}
                className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCreateSJ}
                className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 border border-transparent rounded-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={14} /> Buat Header SJ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Buat Invoice */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-md shadow-2xl flex flex-col overflow-hidden border border-slate-300">
            {/* Modal Header */}
            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center text-white shrink-0">
              <h3 className="font-semibold text-base">Generate Invoice</h3>
              <button onClick={() => setShowInvoiceModal(false)} className="text-slate-300 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-slate-50 flex flex-col gap-4">
              <div className="bg-green-50 text-green-800 text-xs p-3 rounded-sm border border-green-200 font-medium">
                Proses ini akan mengonversi Surat Jalan saat ini menjadi Draft Invoice.
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Nama Pelanggan</label>
                <select className={`${inputClass} bg-slate-100 cursor-not-allowed`} disabled value={form.pelanggan_id || ''}>
                  <option value="">-- Pilih --</option>
                  {pelanggans.map(p => <option key={p.id} value={String(p.id)}>{p.nama}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Dikirim ke Alamat</label>
                <textarea className={`${inputClass} bg-slate-100 h-16 resize-none cursor-not-allowed`} disabled value={form.alamat_kirim || ''} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">No. Surat Jalan</label>
                  <select className={`${inputClass} bg-slate-100 font-mono cursor-not-allowed`} disabled value={form.no_sj || ''}>
                    <option value={form.no_sj}>{form.no_sj}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">Tanggal Buat Invoice</label>
                  <input type="date" className={inputClass} value={new Date().toISOString().split('T')[0]} readOnly />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Pilih Jenis PPN</label>
                <select className={inputClass} >
                  <option>Dengan PPN 11%</option>
                  <option>Tanpa PPN (0%)</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  toast.success('Draft Invoice berhasil digenerate!');
                  const sjParam = encodeURIComponent(form.no_sj || '');
                  const soParam = encodeURIComponent(form.no_so || '');
                  const pelangganParam = encodeURIComponent(form.pelanggan_id || '');
                  navigate(`/invoice?sj=${sjParam}&so=${soParam}&pelanggan=${pelangganParam}`);
                }}
                className="px-6 py-2 text-xs font-semibold text-white bg-green-600 border border-transparent rounded-sm hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Send size={14} /> Buat Invoice Penjualan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Line Item Modal */}
      {isLineModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 bg-slate-800 text-white shrink-0">
              <h3 className="font-semibold text-base">{editLineIndex !== null ? 'Ubah' : 'Tambah'} Barang Pengiriman</h3>
              <button onClick={() => setIsLineModalOpen(false)} className="hover:text-slate-300 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 bg-slate-50 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item / Barang *</label>
                <select 
                  className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm" 
                  value={lineForm.item_id || ''} 
                  onChange={e => {
                    const id = Number(e.target.value);
                    const item = items.find(i => i.id === id);
                    setLineForm({ 
                      ...lineForm, 
                      item_id: id,
                      kode: item?.kode || lineForm.kode,
                      nama: item?.nama || lineForm.nama,
                      satuan: item?.satuan || lineForm.satuan
                    });
                  }}
                >
                  <option value="">-- Pilih Item --</option>
                  {items.map(i => <option key={i.id} value={i.id}>{i.kode} - {i.nama}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Satuan</label>
                  <input type="text" className="w-full px-3 py-2 bg-slate-100 border border-slate-300 focus:outline-none rounded-sm text-sm cursor-not-allowed" readOnly value={lineForm.satuan || ''} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kuantum Pengiriman</label>
                  <input type="number" className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm text-right font-mono text-blue-700 font-bold" value={lineForm.kuantum === 0 ? '' : lineForm.kuantum} onChange={e => setLineForm({ ...lineForm, kuantum: Number(e.target.value) })} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan Baris</label>
                <input type="text" className="w-full px-3 py-2 bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-500 rounded-sm text-sm" placeholder="Catatan tambahan (contoh: kondisi barang, dus no 1)..." value={lineForm.keterangan || ''} onChange={e => setLineForm({ ...lineForm, keterangan: e.target.value })} />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsLineModalOpen(false)} className="px-6 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-sm transition-colors">Batal</button>
              <button onClick={handleSaveLine} className="px-6 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-sm transition-colors flex items-center gap-2">
                <Save size={14} /> Simpan Barang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuratJalan;
