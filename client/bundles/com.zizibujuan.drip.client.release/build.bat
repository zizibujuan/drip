echo off

set BASEDIR=D:\git\repo\com.zizibujuan.drip\client\bundles\com.zizibujuan.drip.client.release
rem dev source dir
DEVDIR=D:\git\repo\com.zizibujuan.drip\client\bundles

set SRCDIR=%BASEDIR%\src
set TOOLSDIR=%SRCDIR%\util\buildscripts
set DISTDIR=%BASEDIR%\release
rem LOADERMID=""
rem LOADERCONF=""
set PROFILE=%BASEDIR%\profiles\drip.profile.js"


echo "copy files to %SRCDIR%..."
cd $BASEDIR
#cp $DEVDIR/com.zizibujuan.drip.client.core/web/drip/index.html $DISTDIR/index.html
cp $DEVDIR/com.zizibujuan.drip.client.core/web/favicon.ico $DISTDIR/favicon.ico
cp $DEVDIR/com.zizibujuan.drip.client.core/web/robots.txt $DISTDIR/robots.txt
cp $DEVDIR/com.zizibujuan.drip.client.core/web/baidu_verify_3Em7IPlFxO.html $DISTDIR/baidu_verify_3Em7IPlFxO.html
cp $DEVDIR/com.zizibujuan.drip.client.core/web/google4361b96ddcf23ebc.html $DISTDIR/google4361b96ddcf23ebc.html

# 如果版本没有变化，就不拷贝
grep -q 1.10.0-pre $SRCDIR/dojo/package.json
if [ $? -eq 0 ]
then
      echo "dojo 版本没有变化，因此不拷贝"
else
	rm -rf "$SRCDIR/dojo"
	rm -rf "$SRCDIR/dijit"
	rm -rf "$SRCDIR/dojox"
	rm -rf "$SRCDIR/util"
	
	cp -r $DEVDIR/com.zizibujuan.drip.client.dojo/static/dojo $SRCDIR
	cp -r $DEVDIR/com.zizibujuan.drip.client.dojo/static/dijit $SRCDIR
	cp -r $DEVDIR/com.zizibujuan.drip.client.dojo/static/dojox $SRCDIR
	cp -r $DEVDIR/com.zizibujuan.drip.client.dojo/static/util $SRCDIR
fi

rm -rf "$SRCDIR/mathEditor"
rm -rf "$SRCDIR/drip"
rm -rf "$SRCDIR/doc"
rm -rf "$SRCDIR/static"


cp -r $DEVDIR/com.zizibujuan.drip.client.editor/static/mathEditor $SRCDIR
cp -r $DEVDIR/com.zizibujuan.drip.client.core/web/drip $SRCDIR
cp -r $DEVDIR/com.zizibujuan.drip.client.doc/web/doc $SRCDIR
cp -r $DEVDIR/com.zizibujuan.drip.client.marked/static/marked $SRCDIR


echo " Done"

if [ ! -d "$TOOLSDIR" ]; then
	echo "Can't find Dojo build tools -- did you initialise submodules? (git submodule update --init --recursive)"
	exit 1
fi

echo "Building application with $PROFILE to $DISTDIR."

echo -n "Cleaning old files..."
rm -rf "$DISTDIR/dijit"
rm -rf "$DISTDIR/dojo"
rm -rf "$DISTDIR/dojox"
rm -rf "$DISTDIR/drip"
rm -rf "$DISTDIR/mathEditor"
rm -rf "$DISTDIR/doc"
rm -rf "$DISTDIR/marked"


echo " Done"

cd "$TOOLSDIR"

#--require "$LOADERCONF"  --releaseDir "$DISTDIR" --check-args --check-discovery
if which node >/dev/null; then
	node ../../dojo/dojo.js load=build  --profile "$PROFILE" --releaseDir "$DISTDIR"  $@
elif which java >/dev/null; then
	java -Xms512m -Xmx512m  -cp ../shrinksafe/js.jar:../closureCompiler/compiler.jar:../shrinksafe/shrinksafe.jar org.mozilla.javascript.tools.shell.Main  ../../dojo/dojo.js baseUrl=../../dojo load=build  --profile "$PROFILE" $@
else
	echo "Need node.js or Java to build!"
	exit 1
fi

# Copy & minify index.html to dist
#cat "$BASEDIR/com.zizibujuan.drip.client.core/web/index.html" | tr '\n' ' ' | \
#perl -pe "
#  s/<\!--.*?-->//g;                          # Strip comments
#  s/isDebug: *1/deps:['$LOADERMID']/;        # Remove isDebug, add deps
#  s/<script src=\"$LOADERMID.*?\/script>//;  # Remove script app/run
#  s/\s+/ /g; 



echo "Build complete"
