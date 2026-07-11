import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import ConfirmModal from "../components/ui/ConfirmModal";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

type ConfirmFunction = (options: ConfirmOptions | string) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFunction | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({ message: "" });
  const [resolver, setResolver] = useState<(value: boolean) => void>();

  const confirm: ConfirmFunction = useCallback((opts) => {
    return new Promise((resolve) => {
      setOptions(typeof opts === "string" ? { message: opts } : opts);
      setIsOpen(true);
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolver) resolver(true);
  }, [resolver]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolver) resolver(false);
  }, [resolver]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmModal
        isOpen={isOpen}
        title={options.title || "Konfirmasi"}
        message={options.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText={options.confirmText || "Ya, Lanjutkan"}
        cancelText={options.cancelText || "Batal"}
        isDestructive={
          options.isDestructive !== undefined ? options.isDestructive : true
        }
      />
    </ConfirmContext.Provider>
  );
};
