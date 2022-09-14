#!/bin/bash


server/server.py > server.log 2>&1 &
pid=$!
echo $pid > ./server.pid

echo "Started server ($pid)"

