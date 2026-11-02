# Screenshot one moment of the game in headless Chrome (no window, no sound), in game time, not real time.
# usage (from the repo root):  VT=30000 TO=100 bash tools/testing/cap.sh shotname "query" stage
#   VT = game milliseconds to run, TO = real seconds before giving up, stage = e.g. 6-2
# Needs a test copy of the game in simgame/ (see README.md); prints the test's report and writes shotname.jpg here.
H=$(cd "$(dirname "$0")" && pwd -W 2>/dev/null || pwd)
R=$(cd "$(dirname "$0")/../.." && pwd -W 2>/dev/null || pwd)
timeout ${TO:-60} "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --mute-audio --allow-file-access-from-files --virtual-time-budget=${VT:-10000} --dump-dom "file:///$R/simgame/index.html?$2#$3" 2>/dev/null > "$H/dom.txt"
PYTHONIOENCODING=utf-8 python -c "
import re,base64,sys
s=open(sys.argv[1],encoding='utf-8').read(); print(re.search(r'data-r=\"[^\"]*\"',s).group(0))
m=re.search(r'data-img=\"data:image/jpeg;base64,([^\"]+)\"',s); open(sys.argv[2],'wb').write(base64.b64decode(m.group(1)))" "$H/dom.txt" "$H/$1.jpg"
rm -f "$H/dom.txt"
