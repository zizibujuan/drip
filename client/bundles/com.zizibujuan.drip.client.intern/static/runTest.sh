#!/bin/bash

BASEDIR=$(cd $(dirname $0) && pwd)
DEVDIR="/home/jzw/git/private/aliyun/com.zizibujuan.drip/client/bundles/"
SRCDIR="$BASEDIR"

internDir=$baseDir/static/intern

# copy files
echo copy files from $DEVDIR/com.zizibujuan.drip.client.editor/static/mathEditor to $SRCDIR
cp -r $DEVDIR/com.zizibujuan.drip.client.editor/static/mathEditor $SRCDIR

# run
node $SRCDIR/intern/runner.js config=static/mathEditor/tests/intern 

#reporters=console reporters=lcov

# close Selenium 2 Server

# delete files
rm -rf "$SRCDIR/mathEditor"
