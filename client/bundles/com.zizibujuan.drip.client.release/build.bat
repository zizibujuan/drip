echo off

set BASEDIR=D:\git\repo\com.zizibujuan.drip\client\bundles\com.zizibujuan.drip.client.release
rem dev source dir
set DEVDIR=D:\git\repo\com.zizibujuan.drip\client\bundles

set SRCDIR=%BASEDIR%\src
set TOOLSDIR=%SRCDIR%\util\buildscripts
set DISTDIR=%BASEDIR%\release
rem LOADERMID=""
rem LOADERCONF=""
set PROFILE=%BASEDIR%\profiles\drip.profile.js"



echo "copy files to %SRCDIR%..."
cd %BASEDIR%
xcopy %DEVDIR%\com.zizibujuan.drip.client.core\web\favicon.ico %DISTDIR%\favicon.ico /e /h /y /i /q
xcopy %DEVDIR%\com.zizibujuan.drip.client.core\web\robots.txt %DISTDIR%\robots.txt /e /h /y /i /q
xcopy %DEVDIR%\com.zizibujuan.drip.client.core\web\baidu_verify_3Em7IPlFxO.html %DISTDIR%\baidu_verify_3Em7IPlFxO.html /e /h /y /i /q
xcopy %DEVDIR%\com.zizibujuan.drip.client.core\web\google4361b96ddcf23ebc.html %DISTDIR%\google4361b96ddcf23ebc.html /e /h /y /i /q

echo "delete dojo libs"
rd /q /s "%SRCDIR%\dojo"
rd /q /s "%SRCDIR%\dijit"
rd /q /s "%SRCDIR%\dojox"
rd /q /s "%SRCDIR%\util"
	
rem copy once
echo "copy dojo libs"
xcopy %DEVDIR%\com.zizibujuan.drip.client.dojo\static\dojo %SRCDIR%\dojo /e /h /y /i /q
xcopy %DEVDIR%\com.zizibujuan.drip.client.dojo\static\dijit %SRCDIR%\dijit /e /h /y /i /q
xcopy %DEVDIR%\com.zizibujuan.drip.client.dojo\static\dojox %SRCDIR%\dojox /e /h /y /i /q
xcopy %DEVDIR%\com.zizibujuan.drip.client.dojo\static\util %SRCDIR%\util /e /h /y /i /q

echo "delete mathEditor"
rd /q /s "%SRCDIR%\mathEditor"

echo "delete drip"
rd /q /s "%SRCDIR%\drip"

echo "delete doc"
rd /q /s "%SRCDIR%\doc"

echo "delete marked"
rd /q /s "%SRCDIR%\marked"

echo "copy mathEditor"
xcopy %DEVDIR%\com.zizibujuan.drip.client.editor\static\mathEditor %SRCDIR%\mathEditor /e /h /y /i /q

echo "copy drip"
xcopy %DEVDIR%\com.zizibujuan.drip.client.core\web\drip %SRCDIR%\drip /e /h /y /i /q

echo "copy doc"
xcopy %DEVDIR%\com.zizibujuan.drip.client.doc\web\doc %SRCDIR%\doc /e /h /y /i /q

echo "copy marked"
xcopy %DEVDIR%\com.zizibujuan.drip.client.marked\static\marked %SRCDIR%\marked /e /h /y /i /q

echo " Done"

echo "Cleaning old files..."
rd /q /s "%DISTDIR%\dijit"
rd /q /s "%DISTDIR%\dojo"
rd /q /s "%DISTDIR%\dojox"
rd /q /s "%DISTDIR%\drip"
rd /q /s "%DISTDIR%\mathEditor"
rd /q /s "%DISTDIR%\doc"
rd /q /s "%DISTDIR%\marked"



cd "%TOOLSDIR%"
echo %PROFILE%
echo %DISTDIR%
node ../../dojo/dojo.js load=build --profile "D:\\git\\repo\\com.zizibujuan.drip\\client\\bundles\\com.zizibujuan.drip.client.release\\profiles\\drip.profile.js"

rem  --releaseDir "%DISTDIR%"

echo "Build complete"
