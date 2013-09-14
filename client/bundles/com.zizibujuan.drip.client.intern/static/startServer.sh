#!/bin/bash

BASEDIR=$(cd $(dirname $0) && pwd)


# add path
# export PATH=$PATH:$BASEDIR

chmod +x $BASEDIR/chromedriver

# run Selenium 2 Server

SRCDIR="$BASEDIR"
java -jar $SRCDIR/selenium-server-standalone-2.35.0.jar -Dwebdriver.chrome.driver=$BASEDIR/chromedriver 