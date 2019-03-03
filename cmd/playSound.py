#!/usr/bin/env python3

from omxplayer.player import OMXPlayer
from pathlib import Path
from time import sleep
import sys

SOUND_PATH = Path(sys.argv[1])

player = OMXPlayer(SOUND_PATH)
sleep(3)

player.quit()

print('done')
sys.stdout.flush()