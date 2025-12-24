import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const loader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
renderer.setAnimationLoop( animate );

camera.position.y = 1

const text = "_pf_26"
const textel = document.getElementById("pf")

let symbols = [
    '>',
    '<',
    '$',
    '_',
    '#',
    '-',
    '/',
    '\\',
    '*',
    '^',
    'x',
    'q',
    'w',
];

var light = new THREE.DirectionalLight(0x5470b9, 10);
scene.add(light);



setInterval(function() {
    textel.innerText = text.replace(text.charAt(Math.floor(Math.random() * 6)), symbols[Math.floor(Math.random() * symbols.length)])
}, 200)



let pozadi

loader.load("models/base.glb", function(gltf) {
    scene.add(gltf.scene);
    pozadi = gltf.scene
}, undefined, function(e) {
    console.error(e);
});

function animate() {
    renderer.render( scene, camera );
}


const listener = new THREE.AudioListener();
camera.add( listener );

const sound = new THREE.PositionalAudio( listener );
const audioLoader = new THREE.AudioLoader();

const buffers = []
const files = ['0.mp3', '1.mp3', '2.mp3', '3.mp3', '4.mp3', '5.mp3', '6.mp3']

await Promise.all(
  files.map((url, i) =>
    audioLoader.loadAsync("sounds/" + url).then(buffer => {
      buffers[i] = buffer;
    })
  )
);

let nextStartTime = listener.context.currentTime;

function loadAudio() {
  const buffer = buffers[Math.floor(Math.random() * buffers.length)];

  const source = listener.context.createBufferSource();
  source.buffer = buffer;
  source.loop = false;

  source.connect(sound.getOutput());

  source.start(nextStartTime);
  nextStartTime += buffer.duration - 10;

  source.onended = loadAudio;
}

const bgnois = new Audio()

function tilt(x, y) {
    if (bgnois.ended || bgnois.paused) {
        bgnois.src = "sounds/zap_" + (Math.ceil(Math.random() * 12)) + ".mp3"
        bgnois.play()
    }
    light.position.setZ(x * Math.random())
    light.position.setX(y * Math.random())
    camera.rotateX(-y / 100)
    camera.rotateY(-x / 100)
}

document.addEventListener("mousemove", (event) => tilt(event.movementX, event.movementY));
let beta = 0, gamma = 0

textel.onclick = function() {
    listener.context.resume();

    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
        DeviceMotionEvent.requestPermission(), 1000
    }

    // fuck web standarts i guess
    window.addEventListener("deviceorientation", function (event) {
        tilt((beta - event.alpha) * 3, (gamma - event.gamma) * 3);
        beta = event.alpha
        gamma = event.gamma
    }, true);
//    window.addEventListener('devicemotion', function (event) {
//        tilt(event.acceleration.x * 2, event.acceleration.y * 2);
//    }, true);
    window.addEventListener("MozOrientation", function (orientation) {
        tilt(orientation.x * 50, orientation.y * 50);
    }, true);
}

loadAudio(audioLoader, sound)
