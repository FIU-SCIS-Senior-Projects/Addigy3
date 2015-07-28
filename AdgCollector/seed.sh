#!/bin/bash

COUNTER=0
while [  $COUNTER -lt 100 ]; do
  java -jar target/adgcollector-1.0-SNAPSHOT-jar-with-dependencies.jar
  let COUNTER=COUNTER+1 
  sleep 120
done
