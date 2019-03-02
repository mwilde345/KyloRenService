# when this script is renamed, the KRS-updatePi document will fail, because syncScript will not have been
# pulled in on the pi. But the rename happens here on the file, in the updatePi document, and in .bashrc on the pi
# so you gotta manually pull on the pi after renaming this... or have the git pulling happen outside of this script.
# like have the updatePi document do a git pull before running any scripts.

# essentially any git pull stuff needs to happen outside of a named, source control file.
# either set in the bashrc under an alias
# or in a runcommand document... neither of which are really source controlled.

# start the ssm-agent
# start the iot listener
# do a git pull
#      check if package.json changed between local and origin latest
#      if so do sudo npm install
# dynamo sync
# pretty much run all the commands the ssm could have sent while the pi was offline.
# in the ~/.bashrc, have a line where this is invoked
sudo service amazon-ssm-agent start
#start iot listener
cd /home/pi/Documents/Dev/KyloRenService
git stash
git checkout master
git reset --hard origin/master
git pull
conditional-install
dynamo-sync