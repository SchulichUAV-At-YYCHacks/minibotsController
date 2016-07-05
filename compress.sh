#!/bin/bash
node compress.js
ls -l compressed.html -h | awk  '{print "The new file size is: "$5"B"}'
