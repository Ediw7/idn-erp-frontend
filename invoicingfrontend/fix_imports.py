import os
import re

directory = '/home/edi/custom_addons/edi_frontend/invoicingfrontend/src/features/ppn'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Find lines starting with import
            lines = content.split('\n')
            new_lines = []
            for line in lines:
                if line.startswith('import '):
                    # We need to increase the depth of relative imports going out of features
                    # If it imports from '../../' or '../../../', add one more '../'
                    # But we should only add '../' if it's pointing to something outside the current module.
                    # Actually, if we just blindly replace '../../' with '../../../' and '../../../' with '../../../../' it should work because ALL of these features moved one level deeper.
                    
                    # Replace 4 levels with 5, 3 with 4, 2 with 3
                    line = line.replace("'../../../../", "'../../../../../")
                    line = line.replace("'../../../", "'../../../../")
                    line = line.replace("'../../", "'../../../")
                new_lines.append(line)
            
            new_content = '\n'.join(new_lines)
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")

