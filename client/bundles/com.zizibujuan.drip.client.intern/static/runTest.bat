set BASEDIR=$(cd $(dirname $0) && pwd)
set DEVDIR="/home/jzw/git/private/aliyun/com.zizibujuan.drip/client/bundles/"
set SRCDIR="$BASEDIR"

# copy files
echo copy files from $DEVDIR/com.zizibujuan.drip.client.editor/static/mathEditor to $SRCDIR
cp -r $DEVDIR/com.zizibujuan.drip.client.editor/static/mathEditor $SRCDIR

# run
pushd $SRCDIR/
# locv.info put at static dir
node node_modules/intern/runner.js config=mathEditor/tests/intern reporters=console reporters=lcov
popd

#reporters=console reporters=lcov

# close Selenium 2 Server

# delete files
rm -rf "$SRCDIR/mathEditor"
