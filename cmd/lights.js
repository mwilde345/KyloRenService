console.log('starting');
var ws281x = require('rpi-ws281x-native');

var NUM_LEDS = 28; //parseInt(process.argv[2], 10) || 10,
var LEFT = 0;
var RIGHT = 4;
var MIDDLE = 8;
    // use rgb color format for pixelData array
var pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});


// ---- animation-loop
function main(config) {
  setInterval(function () {
    var i=NUM_LEDS;
    while(i--) {
        pixelData[i] = 0;
    }
    pixelData[firstStart - offsetFirst] = 0x3076D1;
    pixelData[secondStart + offsetSecond] = 0x3076D1;
  
    ws281x.render(pixelData);
  }, 100);
  
  console.log('Press <ctrl>+C to exit.');
}

module.exports = {
  main
}