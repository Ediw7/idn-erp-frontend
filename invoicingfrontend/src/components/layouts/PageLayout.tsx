import React, { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

interface PageLayoutProps {
  title: string;
  onBack?: () => void;
  filters?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  onBack,
  filters,
  actions,
  children,
  contentClassName = "flex-1 overflow-y-auto p-6 flex flex-col gap-4",
}) => {
  return (
    <div className="bg-slate-50 shadow-sm border border-slate-300 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="text-slate-300 hover:text-white transition-colors"
                title="Kembali"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          {filters && (
            <div className={`flex items-center gap-4 mt-1.5 ${onBack ? "ml-9" : ""}`}>
              {filters}
            </div>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className={contentClassName}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
