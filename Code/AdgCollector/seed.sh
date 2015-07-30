#!/bin/bash

COUNTER=0
while [  $COUNTER -lt 100 ]; do
  sudo java -jar target/adgcollector-1.0-SNAPSHOT-jar-with-dependencies.jar server http://wda-dev.cis.fiu.edu:80/resource/storeCollectedData/ connector 8675 org Addigy
  let COUNTER=COUNTER+1 
  sleep 600
done
