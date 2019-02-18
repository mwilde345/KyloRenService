console.log('starting');
var ws281x = require('rpi-ws281x-native');

var NUM_LEDS = parseInt(process.argv[2], 10) || 10,
    // use rgb color format for pixelData array
    pixelData = new Uint32Array(NUM_LEDS);

ws281x.init(NUM_LEDS);

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});


// ---- animation-loop
var firstStart = Math.min(NUM_LEDS/2);
var secondStart = firstStart + 1;
var offsetFirst = 0;
var offsetSecond = 0;
setInterval(function () {
  var i=NUM_LEDS;
  while(i--) {
      pixelData[i] = 0;
  }
  pixelData[firstStart - offsetFirst] = 0x3076D1;
  pixelData[secondStart + offsetSecond] = 0x3076D1;

  offsetFirst = (offsetFirst + 1) % firstStart;
  offsetSecond = (offsetSecond + 1) % (NUM_LEDS - secondStart);
  ws281x.render(pixelData);
}, 100);

console.log('Press <ctrl>+C to exit.');
