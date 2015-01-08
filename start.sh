#!/bin/bash


# Invoke the Forever module (to START our Node.js server).
# NOTE: if log folder doesn't exist, this script will break, TODO: add folder check and if not exist, create
NODE_ENV=production \
forever \
start \
-al forever.log \
-ao log/out.log \
-ae log/err.log \
~/www/phenome/server.js