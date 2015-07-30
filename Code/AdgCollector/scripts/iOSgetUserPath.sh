#!/bin/bash

dscl . -read Users/$1 NFSHomeDirectory | awk '{print $2}'