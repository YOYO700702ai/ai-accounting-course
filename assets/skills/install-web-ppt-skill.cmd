@echo off
setlocal
title Install Visual Web PPT Skill for Codex

set "SOURCE=%~dp0build-visual-web-ppt"
set "SKILLS_HOME=%USERPROFILE%\.codex\skills"
set "TARGET=%SKILLS_HOME%\build-visual-web-ppt"

if not exist "%SOURCE%\SKILL.md" goto missing
if not exist "%SKILLS_HOME%" mkdir "%SKILLS_HOME%"
if errorlevel 1 goto failed

echo Installing Visual Web PPT Skill...
xcopy "%SOURCE%\*" "%TARGET%\" /E /I /Y /Q >nul
if errorlevel 1 goto failed
if not exist "%TARGET%\SKILL.md" goto failed

echo.
echo Skill files copied successfully.
echo Skill folder: %TARGET%
echo Next: return to Codex and type $build-visual-web-ppt.
echo If the skill does not appear, restart Codex and try again.
echo.
pause
exit /b 0

:missing
echo.
echo Installation package is incomplete.
echo Keep this installer beside the build-visual-web-ppt folder, then try again.
echo.
pause
exit /b 1

:failed
echo.
echo Installation failed. Please use the manual installation steps in the gift-pack web page.
echo.
pause
exit /b 1
