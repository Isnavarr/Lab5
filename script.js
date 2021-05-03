// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const input = document.getElementById('image-input');
const form = document.getElementById('generate-meme');
const clear = document.querySelector("[type='reset']");
const read = document.querySelector("[type='button']");
const vol = document.querySelector("[type='range']");
const select = document.getElementById('voice-selection');
var voices = null;
select.disabled = false;
var canvas = document.getElementById('user-image');
var ctx = canvas.getContext('2d');
//const log = document.getElementById('image-input');

speechSynthesis.addEventListener("voiceschanged", () => {
  voices = speechSynthesis.getVoices()
  console.log(voices);
  for(let i = 0; i < voices.length; i++)
  {
    var option1 = document.createElement("option");
    option1.value = i;
    option1.text = voices[i].name;
    select.add(option1);
  }
})
//console.log(speechSynthesis.getVoices());
// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  var object = getDimmensions(400, 400, img.width, img.height);
  ctx.clearRect(0, 0, 400, 400);
  //document.getElementsByClassName("button-group").disabled = false;
  clear.disabled = false;
  ctx.fillStyle = 'black';
  //console.log("dome");
  ctx.fillRect(0, 0, 400, 400);
  ctx.drawImage(img, object.startX, object.startY, object.width, object.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

input.addEventListener('change', () => {
  var s = URL.createObjectURL(input.files[0]);
  img.src = s;
  //console.log("ichi");
  img.alt = s.replace(/^.*[\\\/]/, '');
});

form.addEventListener('submit', () => {
  event.preventDefault();
  var top = document.getElementById('text-top').value;
  var bottom = document.getElementById('text-bottom').value;
  //console.log("hi");
  clear.disabled = false;
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(top, 200,40);
  ctx.fillText(bottom,200, 385);
  //read.disabled = false;
})

clear.addEventListener('click', () => {
  ctx.clearRect(0, 0, 400, 400);
  clear.disabled = true;
});

read.addEventListener('click', () => {
  let utterance1 = new SpeechSynthesisUtterance(document.getElementById('text-top').value);
  let utterance2 = new SpeechSynthesisUtterance(document.getElementById('text-bottom').value);
  //console.log(select.value);
  utterance1.volume = vol.value/100;
  utterance2.volume = vol.value/100;
  console.log(vol.value);
    utterance1.voice = voices[select.value];
    utterance2.voice = voices[select.value];
    speechSynthesis.speak(utterance1);
    speechSynthesis.speak(utterance2);
});

vol.addEventListener('change', () => {
  if(vol.value >= 67)
    document.querySelector("img").src = "icons/volume-level-3.svg";
  else if (34 <= vol.value && vol.value < 67)
    document.querySelector("img").src = "icons/volume-level-2.svg";
  else if (1 <= vol.value && vol.value < 34)
    document.querySelector("img").src = "icons/volume-level-1.svg";
  else
    document.querySelector("img").src = "icons/volume-level-0.svg";
  //console.log(vol.value);
});

select.addEventListener('change', () => {
  if(select.value != "none")
    read.disabled = false;
  else 
    read.disabled = true;
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
