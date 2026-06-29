import { useState, useEffect, useMemo } from 'react';
import { useConfirm } from '../../../../contexts/ConfirmContext';
import { sptMasaApi, SptMasa1111Data } from '../api';
import toast from 'react-hot-toast';

export const useSptMasaLogic = () => {
  const confirm = useConfirm();

  const [dataList, setDataList] = useState<SptMasa1111Data[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const emptyForm: SptMasa1111Data = {
    tahun: new Date().getFullYear().toString(),
    masa_awal: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    masa_akhir: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    pembetulan_ke: 0,
    tanggal_spt: new Date().toISOString().split('T')[0],
    is_locked: false,
    
    dpp_ekspor: 0, ppn_ekspor: 0,
    dpp_dipungut_sendiri: 0, ppn_dipungut_sendiri: 0,
    dpp_dipungut_pemungut: 0, ppn_dipungut_pemungut: 0,
    dpp_tidak_dipungut: 0, ppn_tidak_dipungut: 0,
    dpp_dibebaskan: 0, ppn_dibebaskan: 0,
    dpp_tidak_terutang: 0,

    ppn_disetor_dimuka: 0,
    pajak_masukan_diperhitungkan: 0,
    ppn_spt_dibetulkan: 0,
    
    tgl_lunas_kurang_bayar: '',
    ntpn_kurang_bayar: '',
    
    lebih_bayar_pada: '',
    lebih_bayar_oleh: '',
    lebih_bayar_diminta_untuk: '',
    kompensasi_masa: '',
    kompensasi_tahun: '',
    restitusi_pasal_17c: '',
    restitusi_pasal_17d: '',
    restitusi_pasal_9_4c: false,
    
    membangun_dpp: 0, membangun_ppn: 0
  };

  const [form, setForm] = useState<SptMasa1111Data>(emptyForm);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoadingList(true);
    try {
      const listRes = await sptMasaApi.getAll().catch(() => []);
      setDataList(listRes);
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoadingList(false);
    }
  };

  const handleNewClick = () => {
    setForm(emptyForm);
    setIsNew(true);
    setViewMode('form');
  };

  const handleEditClick = (item: SptMasa1111Data) => {
    setForm(item);
    setIsNew(false);
    setViewMode('form');
  };

  const handleSave = async () => {
    if (form.is_locked) {
      toast.error('Data terkunci dan tidak dapat disimpan ulang.');
      return;
    }
    try {
      setIsSaving(true);
      const res = await sptMasaApi.save(form);
      toast.success('Data berhasil disimpan');
      setIsNew(false);
      
      const newData = { ...form, id: form.id || res.id };
      if (isNew) {
        setDataList([newData, ...dataList]);
      } else {
        setDataList(dataList.map(x => x.id === form.id ? newData : x));
      }
    } catch (error) {
      toast.error('Gagal menyimpan data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteById = async (id: number) => {
    const item = dataList.find(x => x.id === id);
    if (item?.is_locked) {
      toast.error('Data SPT telah dikunci dan tidak dapat dihapus');
      return;
    }
    const isConfirmed = await confirm('Apakah Anda yakin ingin menghapus SPT ini?');
    if (!isConfirmed) return;
    try {
      await sptMasaApi.delete(id);
      toast.success('Data berhasil dihapus');
      setDataList(dataList.filter(x => x.id !== id));
      if (form.id === id) {
        setViewMode('list');
      }
    } catch (error) {
      toast.error('Gagal menghapus data');
    }
  };

  // Kalkulasi I.A
  const totalDppA = useMemo(() => {
    return (form.dpp_ekspor || 0) + (form.dpp_dipungut_sendiri || 0) + 
           (form.dpp_dipungut_pemungut || 0) + (form.dpp_tidak_dipungut || 0) + 
           (form.dpp_dibebaskan || 0);
  }, [form.dpp_ekspor, form.dpp_dipungut_sendiri, form.dpp_dipungut_pemungut, form.dpp_tidak_dipungut, form.dpp_dibebaskan]);

  const totalPpnA = useMemo(() => {
    return (form.ppn_ekspor || 0) + (form.ppn_dipungut_sendiri || 0) + 
           (form.ppn_dipungut_pemungut || 0) + (form.ppn_tidak_dipungut || 0) + 
           (form.ppn_dibebaskan || 0);
  }, [form.ppn_ekspor, form.ppn_dipungut_sendiri, form.ppn_dipungut_pemungut, form.ppn_tidak_dipungut, form.ppn_dibebaskan]);

  // Kalkulasi I.C
  const totalDppC = useMemo(() => totalDppA + (form.dpp_tidak_terutang || 0), [totalDppA, form.dpp_tidak_terutang]);

  // Kalkulasi II
  const iiA = totalPpnA;
  const iiD = useMemo(() => {
    return iiA - (form.ppn_disetor_dimuka || 0) - (form.pajak_masukan_diperhitungkan || 0);
  }, [iiA, form.ppn_disetor_dimuka, form.pajak_masukan_diperhitungkan]);

  const iiF = useMemo(() => {
    return iiD - (form.ppn_spt_dibetulkan || 0);
  }, [iiD, form.ppn_spt_dibetulkan]);

  return {
    dataList, loadingList,
    form, setForm,
    viewMode, setViewMode,
    isNew, isSaving,
    handleNewClick, handleEditClick, handleSave, handleDeleteById,
    calculated: {
      totalDppA, totalPpnA, totalDppC, iiA, iiD, iiF
    }
  };
};
