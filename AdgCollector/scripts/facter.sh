#!/bin/bash

# export FACTERLIB=$(pwd)/facter
# echo $FACTERLIB

export FACTERLIB=$(pwd)/facter && export LANG=en_US.UTF-8 && /usr/bin/facter -j
# export LANG=en_US.UTF-8 && /usr/bin/facter -j
