#!/usr/bin/env bash
BASEDIR="./src/protos"
OUTDIR="./src/compiled-protos"

./node_modules/.bin/pbjs -t static-module \
  -p ${BASEDIR} \
  -w commonjs \
  ${BASEDIR}/contract.proto \
  ${BASEDIR}/data_entry.proto -o \
  ${OUTDIR}/index.js

./node_modules/.bin/pbts --no-comments \
  -o ${OUTDIR}/index.d.ts \
    ${OUTDIR}/index.js
