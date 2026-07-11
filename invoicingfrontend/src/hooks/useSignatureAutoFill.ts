import { useState, useEffect } from "react";
import { setupApi, TandaTanganData } from "../features/setup/api";

export const useSignatureAutoFill = (jenisFormulir: string) => {
  const [signatureData, setSignatureData] = useState<TandaTanganData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSignature = async () => {
      setIsLoading(true);
      try {
        const data = await setupApi.getTandaTangan();
        const matchedData = data.find(
          (item) =>
            item.jenis_formulir?.trim().toLowerCase() ===
            jenisFormulir.trim().toLowerCase(),
        );
        if (matchedData) {
          setSignatureData(matchedData);
        } else {
          setSignatureData(null);
        }
      } catch (error) {
        console.error("Failed to fetch signature data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignature();
  }, [jenisFormulir]);

  return { signatureData, isLoading };
};
