# start the ssm-agent
# start the iot listener
# do a git pull
#      check if package.json changed between local and origin latest
#      if so do sudo npm install
# dynamo sync
# pretty much run all the commands the ssm could have sent while the pi was offline.
# in the ~/.bashrc, have a line where this is invoked
sudo service amazon-ssm-agent stop
sudo service amazon-ssm-agent start
cd /home/pi/Documents/Dev/KyloRenService
#start iot listener
git stash
git checkout master
git reset --hard origin/master
git pull
conditional-install
dynamo-sync