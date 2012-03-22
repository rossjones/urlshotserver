#!/bin/sh
git clone git://github.com/ariya/phantomjs.git && cd phantomjs
git checkout 1.5
./build.sh --jobs 2
mv bin/ ../