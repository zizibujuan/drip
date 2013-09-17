echo off
set BASEDIR=%~dp0
echo %BASEDIR%

rem add path
rem export PATH=$PATH:$BASEDIR


rem run Selenium 2 Server

set SRCDIR=%BASEDIR%
java -jar %SRCDIR%\selenium-server-standalone-2.35.0.jar -Dwebdriver.ie.driver=%BASEDIR%\IEDriverServer.exe

rem 