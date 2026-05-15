@echo off
title WUT Racing - local server
cd /d "%~dp0"
echo.
echo  WUT Racing - lokalny serwer HTTP
echo  =================================
echo.
echo  Otwieram stronę pod http://localhost:8080
echo  (zamknij to okno, aby zatrzymac serwer)
echo.

REM Try Python launcher (py) first, fall back to python.
REM We run our serve.py wrapper (not http.server directly) so .js gets the
REM correct application/javascript MIME — without it, ES modules silently fail.
where py >nul 2>nul
if %errorlevel%==0 (
    start "" "http://localhost:8080"
    py serve.py 8080
    goto end
)

where python >nul 2>nul
if %errorlevel%==0 (
    start "" "http://localhost:8080"
    python serve.py 8080
    goto end
)

echo  Nie znalazlem Pythona w systemie.
echo  Zainstaluj Pythona z https://www.python.org/downloads/
echo  albo otworz folder w VS Code i uzyj rozszerzenia "Live Server".
echo.
pause
:end
