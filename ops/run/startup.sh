#!/bin/bash
service redis-server start
service redis-server restart
service redis-server start
service nginx start
service nginx restart
service nginx status
node index.js