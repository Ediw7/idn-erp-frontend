import React from 'react';
import { FilePlus } from 'lucide-react';
import { SalesOrderList } from './SalesOrderList';

interface SalesOrderListViewProps {
  dataList: any[];
  loadingData: boolean;
  pelanggans: any[];
  mataUangs: any[];
  salesmans: any[];
  wajibPpnbm: boolean;
  periode: string;
  setPeriode: (p: string) => void;
  onEdit: (item: any, idx: number) => void;
  onDelete: (id: number) => void;
  onOpenForm: () => void;
}

export const SalesOrderListView: React.FC<SalesOrderListViewProps> = ({
  dataList, loadingData, pelanggans, mataUangs, salesmans, wajibPpnbm,
  periode, setPeriode, onEdit, onDelete, onOpenForm
}) => {
  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-white">Sales Order</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-slate-300 font-medium">Pilih Periode:</span>
            <select 
              value={periode} 
              onChange={e => setPeriode(e.target.value)}
              className="text-xs bg-slate-700 text-white border border-slate-600 rounded-sm px-2 py-0.5 outline-none focus:border-slate-400"
            >
              <option value="2026-06">Juni 2026</option>
              <option value="2026-05">Mei 2026</option>
              <option value="2026-04">April 2026</option>
              <option value="2026-03">Maret 2026</option>
              <option value="2026-02">Februari 2026</option>
              <option value="2026-01">Januari 2026</option>
            </select>
          </div>
        </div>
        <button onClick={onOpenForm} className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-transparent hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
           <FilePlus size={14} /> + BUKA FORM
        </button>
      </div>

      <SalesOrderList
        salesOrders={dataList}
        loadingList={loadingData}
        pelanggans={pelanggans}
        mataUangs={mataUangs}
        salesmans={salesmans}
        wajibPpnbm={wajibPpnbm}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};
