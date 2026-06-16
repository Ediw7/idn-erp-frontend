const fs = require('fs');
const files = [
  'src/features/faktur-pajak/components/TransferEFaktur.tsx',
  'src/features/inventory/components/PenerimaanBarang.tsx',
  'src/features/inventory/components/AdjustmentInventory.tsx',
  'src/features/inventory/components/TransferBarang.tsx',
  'src/features/inventory/components/ProsesHPP.tsx',
  'src/features/inventory/components/KartuStock.tsx',
  'src/features/inventory/components/RekapStock.tsx',
  'src/features/kartu-piutang/components/KartuPiutang.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 1. Remove the opening wrapper
    content = content.replace(/<div className="bg-slate-50 min-h-\[calc\(100vh-4rem\)\] p-8">\s*/, '');
    
    // 2. Replace the inner wrapper with the flat corporate one
    content = content.replace(/<div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden w-full[^>]*">/, '<div className="bg-white shadow-sm border border-slate-300 flex flex-col min-h-[calc(100vh-8rem)] w-full">');
    
    // 3. Remove the extra closing </div> at the end
    // Match the exact pattern at the end of the file
    content = content.replace(/<\/div>\s*<\/div>\s*\);\s*};\s*export default/, '</div>\n  );\n};\n\nexport default');
    
    fs.writeFileSync(file, content);
    console.log(`Processed ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
