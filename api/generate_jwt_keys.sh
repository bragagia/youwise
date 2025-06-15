#!/bin/bash

set -e

openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048 2>/dev/null >/dev/null
openssl rsa -pubout -in private_key.pem -out public_key.pem 2>/dev/null >/dev/null

echo -n "JWT_PRIVATE_KEY=\""
cat private_key.pem | sed 's/$/\\n/' | tr -d '\n'
echo "\""

echo

echo -n "JWT_PUBLIC_KEY=\""
cat public_key.pem | sed 's/$/\\n/' | tr -d '\n'
echo "\""

rm private_key.pem public_key.pem