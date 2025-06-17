@echo off
echo ================================================
echo    Tic Tac Toe - Compilation vers EXE
echo ================================================
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Python n'est pas installé ou pas dans le PATH
    echo Veuillez installer Python depuis https://python.org
    pause
    exit /b 1
)

echo Python détecté avec succès!
echo.

REM Vérifier si PyInstaller est installé
pip show pyinstaller >nul 2>&1
if %errorlevel% neq 0 (
    echo PyInstaller n'est pas installé. Installation en cours...
    pip install pyinstaller
    if %errorlevel% neq 0 (
        echo ERREUR: Impossible d'installer PyInstaller
        pause
        exit /b 1
    )
)

echo PyInstaller est installé!
echo.

REM Créer le dossier de sortie s'il n'existe pas
if not exist "dist" mkdir dist

echo Compilation du jeu Tic Tac Toe en cours...
echo.

REM Compiler avec PyInstaller
pyinstaller --onefile --windowed --name "TicTacToe" --distpath "dist" --workpath "build" --specpath "." tic_tac_toe.py

if %errorlevel% equ 0 (
    echo.
    echo ================================================
    echo    COMPILATION RÉUSSIE!
    echo ================================================
    echo.
    echo Le fichier TicTacToe.exe a été créé dans le dossier 'dist'
    echo Vous pouvez maintenant partager ce fichier sans avoir besoin d'installer Python
    echo.
    echo Taille du fichier:
    dir "dist\TicTacToe.exe" | findstr "TicTacToe.exe"
    echo.
    
    REM Proposer de lancer le jeu
    set /p launch="Voulez-vous lancer le jeu maintenant? (o/n): "
    if /i "%launch%"=="o" (
        start "" "dist\TicTacToe.exe"
    )
) else (
    echo.
    echo ================================================
    echo    ERREUR DE COMPILATION
    echo ================================================
    echo.
    echo La compilation a échoué. Vérifiez les erreurs ci-dessus.
)

echo.
echo Appuyez sur une touche pour fermer...
pause >nul
