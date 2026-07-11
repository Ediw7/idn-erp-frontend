import os
import glob

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if "useState('2026-06')" in content or "periode: '2026-06'" in content:
        content = content.replace("useState('2026-06')", "useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)")
        content = content.replace("periode: '2026-06'", "periode: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`")
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Fixed {filepath}")

files = [
    "invoicingfrontend/src/features/sales-order/components/useSalesOrderLogic.ts",
    "invoicingfrontend/src/features/kwitansi/components/useKwitansiLogic.ts",
    "invoicingfrontend/src/features/surat-jalan/components/useSuratJalanLogic.ts",
    "invoicingfrontend/src/features/pembayaran/components/PembayaranListView.tsx"
]

for file in files:
    fix_file(file)

