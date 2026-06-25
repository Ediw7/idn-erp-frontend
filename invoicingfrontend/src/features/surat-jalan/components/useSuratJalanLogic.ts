import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext';
import { setupApi, PelangganData, GudangData, ItemData } from '../../setup/api';
import { salesOrderApi, SalesOrderData } from '../../sales-order/api';
import { useSignatureAutoFill } from '../../../hooks/useSignatureAutoFill';

export const useSuratJalanLogic = () => {
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
  const [isSaving, setIsSaving] = useState(false);
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [editLineIndex, setEditLineIndex] = useState<number | null>(null);
  const [lineForm, setLineForm] = useState<any>({ item_id: null, kode: '', nama: '', satuan: '', kuantum: 1, keterangan: '' });

  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [dataList, setDataList] = useState<any[]>(() => {
    const saved = localStorage.getItem('edi_surat_jalans');
    return saved ? JSON.parse(saved) : [];
  });

  const emptyForm = {
    id: '', no_sj: '', tanggal: new Date().toISOString().split('T')[0],
    pelanggan_id: '', alamat_kirim: '', gudang_id: '', no_so: '', no_po: '',
    no_kendaraan: '', no_invoice: '', keterangan: '',
    penandatangan: 'Admin', jabatan: 'Logistik', lines: [],
    create_date: '', create_uid_name: '', write_date: '', write_uid_name: ''
  };

  const [form, setForm] = useState<any>(emptyForm);
  const [modalForm, setModalForm] = useState<any>(emptyForm);

  const { signatureData } = useSignatureAutoFill('Surat Jalan');

  useEffect(() => {
    fetchInitialData();
  }, []);

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
    if (isSaving) return;
    if (!form.no_sj) {
      toast.error('Harap isi header Surat Jalan terlebih dahulu!');
      return;
    }
    if (!form.lines || form.lines.length === 0) {
      toast.error('Surat Jalan tidak dapat disimpan tanpa barang pengiriman!');
      return;
    }

    setIsSaving(true);
    try {
      const updatedForm = {
        ...form,
        write_date: new Date().toISOString(),
        write_uid_name: user?.name || 'Unknown'
      };

      setForm(updatedForm);
      
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
    } finally {
      setIsSaving(false);
    }
  };

  const calculateTotalQty = () => {
    return form.lines?.reduce((acc: number, curr: any) => acc + (Number(curr.kuantum) || 0), 0) || 0;
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
    if ((lineForm.kuantum || 0) <= 0) {
      toast.error('Kuantitas tidak boleh kurang dari atau sama dengan 0');
      return;
    }

    // Validasi Over-delivery terhadap Sales Order
    if (form.no_so) {
      const selectedSO = salesOrders.find(s => s.no_so === form.no_so);
      if (selectedSO && selectedSO.lines) {
        const soLine = selectedSO.lines.find((l: any) => String(l.item_id) === String(lineForm.item_id));
        if (soLine) {
          // Hitung qty yang sudah dikirim di SJ lain
          let previouslyShipped = 0;
          dataList.forEach(sj => {
            if (sj.no_so === form.no_so && sj.no_sj !== form.no_sj) {
              sj.lines?.forEach((l: any) => {
                if (String(l.item_id) === String(lineForm.item_id)) {
                  previouslyShipped += Number(l.kuantum) || 0;
                }
              });
            }
          });

          // Hitung qty di form SJ yang sedang aktif (baris lain dengan item sama)
          let shippedInCurrentForm = 0;
          (form.lines || []).forEach((l: any, idx: number) => {
            if (idx !== editLineIndex && String(l.item_id) === String(lineForm.item_id)) {
              shippedInCurrentForm += Number(l.kuantum) || 0;
            }
          });

          const maxAllowed = Number(soLine.kuantum) - previouslyShipped - shippedInCurrentForm;
          
          if (Number(lineForm.kuantum) > maxAllowed) {
            toast.error(`Over-delivery! Kuantum melebihi Sisa Order. Maksimal pengiriman: ${maxAllowed} unit.`);
            return;
          }
        }
      }
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

  const removeLine = (idx: number) => {
    const newLines = [...(form.lines || [])];
    newLines.splice(idx, 1);
    setForm({ ...form, lines: newLines });
  };

  const handleDeleteSJ = (no_sj: string) => {
    if (window.confirm('Yakin ingin menghapus Surat Jalan ini?')) {
      const newList = dataList.filter(sj => sj.no_sj !== no_sj);
      setDataList(newList);
      localStorage.setItem('edi_surat_jalans', JSON.stringify(newList));
      toast.success('Surat Jalan berhasil dihapus');
    }
  };

  return {
    navigate, user, pelanggans, gudangs, items, salesOrders, periode, setPeriode,
    showNewSjModal, setShowNewSjModal, showInvoiceModal, setShowInvoiceModal,
    activeTab, setActiveTab, isLineModalOpen, setIsLineModalOpen, editLineIndex, setEditLineIndex,
    lineForm, setLineForm, viewMode, setViewMode, dataList, setDataList,
    emptyForm, form, setForm, modalForm, setModalForm,
    handlePelangganChange, handleSOChange, handleCreateSJ, handleSaveAll,
    calculateTotalQty, handleOpenAddLine, handleOpenEditLine, handleSaveLine, removeLine, handleDeleteSJ,
    isSaving
  };
};
