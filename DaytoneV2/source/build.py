"""Build the self-contained HTML and optional Windows executable.
Needs Python 3; native compile additionally needs MinGW-w64 and Pillow for icon.
Run: python build.py --compiler x86_64-w64-mingw32-gcc
"""
from pathlib import Path
import argparse, subprocess, shutil
p=Path(__file__).resolve().parent
html=(p/'index.html').read_text(encoding='utf-8').replace('<link rel="stylesheet" href="style.css">','<style>'+(p/'style.css').read_text(encoding='utf-8')+'</style>')
html=html.replace('<script src="core.js"></script>','<script>'+(p/'core.js').read_text(encoding='utf-8')+'</script>').replace('<script src="app.js"></script>','<script>'+(p/'app.js').read_text(encoding='utf-8')+'</script>')
(p.parent/'Daytone.html').write_text(html,encoding='utf-8')
b=html.encode('utf-8')
(p/'embedded_ui.h').write_text('static const unsigned char daytone_ui[]={'+','.join(str(x) for x in b)+'};\nstatic const unsigned int daytone_ui_len='+str(len(b))+';\n')
parser=argparse.ArgumentParser();parser.add_argument('--compiler');args=parser.parse_args()
if args.compiler:
    cmd=[args.compiler,str(p/'launcher.c'),'-o',str(p.parent/'Daytone.exe'),'-municode','-mwindows','-Os','-s','-static','-lshell32','-lshlwapi','-luser32']
    if (p/'resources.o').exists():cmd.append(str(p/'resources.o'))
    subprocess.run(cmd,check=True)
    print('Built Daytone.exe')
print('Built Daytone.html')
