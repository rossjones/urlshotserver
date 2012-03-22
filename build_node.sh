#!/bin/sh
wget http://nodejs.org/dist/v0.6.13/node-v0.6.13.tar.gz
tar -xzvf node-v0.6.13.tar.gz
rm node-v0.6.13.tar.gz
cd node-v0.6.13
./configure
make
sudo make install
npm install phantom
npm install imagemagick