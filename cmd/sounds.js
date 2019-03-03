function main(config) {
  const spawn = require("child_process").spawn;
  const path = require('path');
  const pythonProcess = spawn('python',[__dirname + "/playSound.py", path.join(__dirname, '..','/data/soundfiles/saberStart.mp3')]);
  pythonProcess.stdout.on('data', (data) => {
    // Do something with the data returned from python script
});
}

module.exports = {
  main
}
