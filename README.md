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
* any way to deploy pi code automatically?
https://dzone.com/articles/github-continuous-deployment-to-a-raspberry-pi

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

