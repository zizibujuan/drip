#!/usr/bin/env bash

set -e

BASEDIR="/home/jzw/git/private/aliyun/com.zizibujuan.drip/client/bundles"
SRCDIR="$BASEDIR/com.zizibujuan.drip.client.dojo/static"
TOOLSDIR="$SRCDIR/util/buildscripts"
DISTDIR="$BASEDIR/com.zizibujuan.drip.client.release/release"
#LOADERMID=""
#LOADERCONF=""
PROFILE="$BASEDIR/com.zizibujuan.drip.client.release/profiles/drip.profile.js"

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
echo " Done"

cp $BASEDIR/com.zizibujuan.drip.client.core/web/index.html $DISTDIR/index.html

cd "$TOOLSDIR"

#--require "$LOADERCONF"  --releaseDir "$DISTDIR" --check-args
#if which node >/dev/null; then
#	node ../../dojo/dojo.js load=build  --profile "$PROFILE"  $@
#elif which java >/dev/null; then
	java -Xms512m -Xmx512m  -cp ../shrinksafe/js.jar:../closureCompiler/compiler.jar:../shrinksafe/shrinksafe.jar org.mozilla.javascript.tools.shell.Main  ../../dojo/dojo.js baseUrl=../../dojo load=build  --profile "$PROFILE" $@
#else
#	echo "Need node.js or Java to build!"
#	exit 1
#fi

# Copy & minify index.html to dist
#cat "$BASEDIR/com.zizibujuan.drip.client.core/web/index.html" | tr '\n' ' ' | \
#perl -pe "
#  s/<\!--.*?-->//g;                          # Strip comments
#  s/isDebug: *1/deps:['$LOADERMID']/;        # Remove isDebug, add deps
#  s/<script src=\"$LOADERMID.*?\/script>//;  # Remove script app/run
#  s/\s+/ /g; 



echo "Build complete"
