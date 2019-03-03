#!/usr/bin/env python3

from omxplayer.player import OMXPlayer
from pathlib import Path
from time import sleep
import sys

SOUND_PATH = Path(sys.argv[1])

player = OMXPlayer(SOUND_PATH)
sleep(1)
player2 = OMXPlayer(SOUND_PATH)
sleep(3)

player.quit()
player2.quit()

print('done')
sys.stdout.flush()