#!/bin/bash

#resize window: printf '\033[8;(height);(width)t'  setting super high will windowed fullscreen it
printf '\033[8;75;300t'
heroku logs -a quacktemplate -t
$SHELL