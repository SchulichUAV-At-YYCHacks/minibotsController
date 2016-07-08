#!/bin/bash
node compress.js
munch --html compressed.html
#rm compressed.html
#mv compressed.opt.html compressed.html
echo "Checkout compress.opt.html"
ls -l compressed.opt.html -h | awk  '{print "The new file size is: "$5"B"}'
