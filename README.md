# KyloRenService
kylo ren does stuff
## Web Part
* view all sound/light configs
* upload audio clip (length limit?)
* youtube clipper?
* color picker
* color/animation presets
* play saber start/stop
* play saber hum
* password
* save configs to dynamo
* record voice (apply voice change?)
* voice change for any clip


## Pi
* randomize but don't repeat configs (cache file?)
 * only reset cache after all files have been played (don't reset when configs get overwritten)
* play saber start/stop sync with led strip
* hum sound during clip sound (overlap sounds?)
* pulsing lights
* listen to dynamo changes and overwrite local config file each time
* listen to mqtt events and trigger config run
* IoT listener script should run always
* Stream listener should run always
* Sound and Light scripts together or separate, python or js?
* put pi on timed outlet, force pull dynamo configs on startup
* any way to deploy pi code automatically?
* manage pi volume via web slider.

## Pieces
(all in cloudformation, get a boilerplate)
* Lambda for site
* Dynamo for configs
 * Stream changes
* IOT Queue
* S3 for static files

get working in personal account, move to brazil.

pygame
https://raspberrypi.stackexchange.com/questions/7088/playing-audio-files-with-python

pygame overlap audio
https://stackoverflow.com/questions/41273152/any-way-i-can-get-python-sounds-to-overlap

## Setup
* download raspbian. flash an SD using balenaEtcher (just follow raspbian guide......)
* mvpdev is password for pi
* /boot/config.txt >> display_rotate=1 (90 deg rotate)
* sudo service lightdm restart (reboot just the gui)
* ctrl+alt+f1 to term, ctrl+alt+f7 back to gui
* https://raspberrypi.stackexchange.com/questions/12869/how-to-solve-encountered-a-section-with-no-package-header-error
* https://github.com/beyondscreen/node-rpi-ws281x-native
* neopixels on pi: https://learn.adafruit.com/neopixels-on-raspberry-pi
* need 74AHCT125 or 74HCT125N converters and mini breadboard
* wiring with the level shifting chip: https://learn.adafruit.com/neopixels-on-raspberry-pi/raspberry-pi-wiring
* got afp on pi. now on mac do open afp:raspberrypi.local to mount remote fs

show chris @vetco the project. via our email thread.

TESTING CODEPIPELINE RUNCOMMAND TRIGGER, again, again