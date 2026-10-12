@echo off
rem Plays the game in its own Chrome window with sound always on (no click needed, so a controller is enough).
rem It uses its own Chrome profile, so its saved progress is separate from a normal Chrome tab.
cd /d "%~dp0"
powershell -NoProfile -Command "try { (New-Object Net.Sockets.TcpClient('localhost', 8765)).Close(); exit 0 } catch { exit 1 }"
if errorlevel 1 start "David server" /min python -m http.server 8765
timeout /t 1 /nobreak >nul
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="%LOCALAPPDATA%\DavidSlingChrome" --autoplay-policy=no-user-gesture-required --start-fullscreen --app=http://localhost:8765/game/index.html
