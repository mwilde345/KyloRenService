console.log('starting');
var ws281x = require('rpi-ws281x-native');
//speed and pattern of lightsaber: https://youtu.be/zy-wqB4cbT8?t=337

var NUM_LEDS = 28; //parseInt(process.argv[2], 10) || 10,
var NUM_ITERATIONS = 24; //24 cycles cuz left/right go together
var LEFT = 0;
var RIGHT = 4;
var MIDDLE = 8;

var a_left = new Array(4).fill(0);
var a_right = new Array(4).fill(0);
var a_middle = new Array(20).fill(0);

ws281x.init(NUM_LEDS);

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});


// ---- animation-loop
async function main(config) {
  var color = parseInt(config.color);
  console.log('expanding');
  await expand(color);
  console.log('waiting');
  await wait(config.soundlength);
  console.log('contracting');
  await contract();
  console.log('done in lights');
}

async function expand(color) {
  var iteration = -1;
  return await new Promise(resolve => {
    //while(iteration < NUM_ITERATIONS){
    var interval = setInterval(function () {
        if (++iteration >= NUM_ITERATIONS) {
          clearInterval(interval);
          resolve();
        }
        if(iteration < 20) {
          //expand middle
          a_middle[iteration] = color;
          ws281x.render(
            Uint32Array.from(a_left.concat(a_right, a_middle))
          );
        }else {
          //expand sides
          a_left[iteration%4] = color;
          a_right[3 - iteration%4] = color;
        }
        ws281x.render(
          Uint32Array.from(a_left.concat(a_right, a_middle))
        )
      }, 10)
  });
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function contract() {
  ws281x.render(new Uint32Array(28));
}

module.exports = {
  main
}