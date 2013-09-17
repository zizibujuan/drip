echo off
set BASEDIR=%~dp0
echo BASEDIR %BASEDIR%
cd ..
cd ..

set DEVDIR=%cd%
echo DEVDIR %DEVDIR%

set SRCDIR=%BASEDIR%

cd %BASEDIR%

echo copy files starting
echo copy files from %DEVDIR%\com.zizibujuan.drip.client.editor\static\mathEditor to %SRCDIR%\mathEditor\
xcopy  %DEVDIR%\com.zizibujuan.drip.client.editor\static\mathEditor %SRCDIR%\mathEditor\ /Q /s

rem run
pushd %SRCDIR%
rem locv.info put at static dir
node node_modules/intern/runner.js config=mathEditor/tests/intern reporters=console reporters=lcov
popd

rem reporters=console reporters=lcov

rem close Selenium 2 Server

rem delete files
rmdir /q /s "%SRCDIR%/mathEditor"
