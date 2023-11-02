/// Zappar for ThreeJS Examples
/// Instant Tracking 3D Model

// In this example we track a 3D model using instant world tracking

import * as THREE from "three";
import { Howl, Howler } from "howler";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as ZapparThree from "@zappar/zappar-threejs";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ZapparSharing from "@zappar/sharing";
import * as ZapparVideoRecorder from "@zappar/video-recorder";
import "./index.css";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
// The SDK is supported on many different browsers, but there are some that
// don't provide camera access. This function detects if the browser is supported
// For more information on support, check out the readme over at
// https://www.npmjs.com/package/@zappar/zappar-threejs
if (ZapparThree.browserIncompatible()) {
  // The browserIncompatibleUI() function shows a full-page dialog that informs the user
  // they're using an unsupported browser, and provides a button to 'copy' the current page
  // URL so they can 'paste' it into the address bar of a compatible alternative.
  ZapparThree.browserIncompatibleUI();

  // If the browser is not compatible, we can avoid setting up the rest of the page
  // so we throw an exception here.
  throw new Error("Unsupported browser");
}

// ZapparThree provides a LoadingManager that shows a progress bar while
// the assets are downloaded. You can use this if it's helpful, or use
// your own loading UI - it's up to you :-)
const manager = new ZapparThree.LoadingManager();
const model = new URL("../assets/diwali_3d_poster.glb", import.meta.url).href;
const music = new URL("../assets/music.mp3", import.meta.url).href;
const share = new URL("../assets/arrow.png", import.meta.url).href;
// Construct our ThreeJS renderer and scene as usual
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
document.body.appendChild(renderer.domElement);

// As with a normal ThreeJS scene, resize the canvas if the window resizes
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Create a Zappar camera that we'll use instead of a ThreeJS camera
const camera = new ZapparThree.Camera();

// In order to use camera and motion data, we need to ask the users for permission
// The Zappar library comes with some UI to help with that, so let's use it
ZapparThree.permissionRequestUI().then((granted) => {
  // If the user granted us the permissions we need then we can start the camera
  // Otherwise let's them know that it's necessary with Zappar's permission denied UI
  if (granted) camera.start();
  else ZapparThree.permissionDeniedUI();
});

// The Zappar component needs to know our WebGL context, so set it like this:
ZapparThree.glContextSet(renderer.getContext());

// Set the background of our scene to be the camera background texture
// that's provided by the Zappar camera
scene.background = camera.backgroundTexture;

// Create an InstantWorldTracker and wrap it in an InstantWorldAnchorGroup for us
// to put our ThreeJS content into
const instantTracker = new ZapparThree.InstantWorldTracker();
const instantTrackerGroup = new ZapparThree.InstantWorldAnchorGroup(
  camera,
  instantTracker
);

// Add our instant tracker group into the ThreeJS scene
scene.add(instantTrackerGroup);

//==================FRAME============================
// const frameSrc = new URL("../assets/frame.png", import.meta.url).href;
// const frameTexture = new THREE.TextureLoader(manager).load(frameSrc);
// const frame = new THREE.Mesh(
//   new THREE.PlaneBufferGeometry(),
//   new THREE.MeshBasicMaterial({ map: frameTexture, transparent: true })
// );
// frame.scale.set(2, 3.3, 1);
// // frame.position.set(0, 0, -0.1);
// instantTrackerGroup.add(frame);
// console.log(frame);

// Load a 3D model to place within our group (using ThreeJS's GLTF loader)
// Pass our loading manager in to ensure the progress bar works correctly
const gltfLoader = new GLTFLoader(manager);
let mymodel: any;
gltfLoader.load(
  model,
  (gltf) => {
    // Now the model has been loaded, we can add it to our instant_tracker_group
    mymodel = gltf.scene;
    instantTrackerGroup.add(gltf.scene);
    gltf.scene.visible = false;
    gltf.scene.scale.set(0.15, 0.25, 0.25);
    // gltf.scene.position.set(0, -0.2, 0);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 3, 0); // Set the position of the spotlight
    spotLight.target = mymodel; // Optionally, you can set a target for the spotlight
    spotLight.angle = Math.PI / 8; // Set the spotlight cone angle
    spotLight.intensity = 2; // Set the intensity of the spotlight

    gltf.scene.add(spotLight);
    // console.log(gltf.scene);
  },
  undefined,
  () => {
    console.log("An error ocurred loading the GLTF model");
  }
);

//==================FIRE CRACKERs========================

// function getRandomHexColorWithAlpha() {
//   // Generate a random integer between 0 and 0xffffff (16777215 in decimal)
//   const randomColor = Math.floor(Math.random() * 0xffffff);
//   // Convert the integer to a hexadecimal string with '0x' prefix
//   const hexColor = `0x${randomColor.toString(16)}`;
//   // Add the '1' at the end
//   return `${hexColor}1`;
// }

//GALAXY
// Create a buffer geometry for the particles
const particlesGeometry1 = new THREE.BufferGeometry();

const particleCount1 = 200000;
const positions1 = new Float32Array(particleCount1 * 3);
const colors1 = new Float32Array(particleCount1 * 3);

const particleColor1 = new THREE.Color(0xffa500); // Fire color

const spiral = (t: any) => {
  const r = t; // Radius increases linearly with time
  const theta = 50 * t; // Angle increases linearly with time
  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);
  const z = (Math.random() - 0.5) * 2;
  return new THREE.Vector3(x, y, z);
};

for (let i = 0; i < particleCount1; i++) {
  const t = i / (particleCount1 - 1); // Linearly distribute points along the spiral
  const point = spiral(t);

  positions1[i * 3] = point.x;
  positions1[i * 3 + 1] = point.y;
  positions1[i * 3 + 2] = point.z;

  colors1[i * 3] = particleColor1.r;
  colors1[i * 3 + 1] = particleColor1.g;
  colors1[i * 3 + 2] = particleColor1.b;
}

particlesGeometry1.setAttribute(
  "position",
  new THREE.BufferAttribute(positions1, 3)
);
particlesGeometry1.setAttribute("color", new THREE.BufferAttribute(colors1, 3));

const particlesMaterial2 = new THREE.PointsMaterial({
  size: 0.05,
  //@ts-ignore
  vertexColors: THREE.VertexColors,
});

const particles1 = new THREE.Points(particlesGeometry1, particlesMaterial2);
particles1.rotation.set(Math.PI / 2, 0, 0);
particles1.scale.set(0.5, 0.5, 0.01);
//particles1.position.set(1, 0, 0);
particles1.visible = false;
instantTrackerGroup.add(particles1);

// Particle system parameters
const particleCount = 10000; // Adjust the number of particles as desired
const particleSize = 0.006; // Adjust the size of the particles
const particleColor = 0xf4a146; // Adjust the color of the particles

// Create the particle system
const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial({
  size: particleSize,
  color: particleColor,
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
instantTrackerGroup.add(particles);

// Generate random particle positions and colors
const positions = [];
const colors = [];

for (let i = 0; i < particleCount; i++) {
  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 10;
  positions.push(x, y, z);

  const r = Math.random();
  const g = Math.random();
  const b = Math.random();
  colors.push(r, g, b);
}

particlesGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(colors, 3)
);

// ADDING SOUND

const sound = new Howl({
  src: [music],
});

// Let's add some lighting, first a directional light above the model pointing down
const directionalLight = new THREE.DirectionalLight("white", 0.8);
directionalLight.position.set(0, 5, 0);
directionalLight.lookAt(0, 0, 0);
instantTrackerGroup.add(directionalLight);

// And then a little ambient light to brighten the model up a bit
const ambientLight = new THREE.AmbientLight("white", 0.4);
instantTrackerGroup.add(ambientLight);

// When the experience loads we'll let the user choose a place in their room for
// the content to appear using setAnchorPoseFromCameraOffset (see below)
// The user can confirm the location by tapping on the screen
let hasPlaced = false;

const arrow = document.getElementById("arrow2");
const placeButton =
  document.getElementById("tap-to-place") || document.createElement("div");
placeButton.addEventListener("click", () => {
  hasPlaced = true;
  mymodel.visible = true;
  sound.play();
  particles.visible = false;
  particles1.visible = true;

  //add fanisko text

  //=====================ADDING 3D TEXT===============

  // Load your font
  // Create a font loader
  const fontLoader = new FontLoader();

  // Use the default font (helvetiker) - you can choose a different one if desired
  fontLoader.load(
    "https://cdn.rawgit.com/mrdoob/three.js/r125/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      createText(font);
    }
  );

  function createText(font: any) {
    const textGeometry = new TextGeometry("FANISKO \n WISHES YOU", {
      font: font,
      size: 0.2, // Adjust the size as needed
      height: 0.05, // Adjust the thickness as needed
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xf4a146 }); // Adjust the text color as needed
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.scale.set(0.8, 0.8, 0.8);
    textMesh.position.x = -1;
    textMesh.position.y = 2;
    // Position the text within your scene
    // textMesh.position.set(-1, 0.2, -3); // Adjust the position as needed

    // Add the text to the scene
    instantTrackerGroup.add(textMesh);
  }

  placeButton.remove();
  //@ts-ignore
  arrow.remove();
});

// Get a reference to the 'Snapshot' button so we can attach a 'click' listener
const canvas = document.getElementById("firecrackerCanvas");

const imageBtn =
  document.getElementById("image") || document.createElement("div");
imageBtn.addEventListener("click", () => {
  // Create a copy of the camera's current position and rotation
  const originalCameraPosition = camera.position.clone();
  const originalCameraRotation = camera.rotation.clone();

  // Move the camera to a position that captures the entire scene
  camera.position.set(0, 0, 5); // Adjust the position as needed
  camera.lookAt(0, 0, 0);

  // Render the scene
  renderer.render(scene, camera);

  // Take a snapshot of the entire scene
  const url = renderer.domElement.toDataURL("image/jpeg", 0.8);

  // Restore the original camera position and rotation
  camera.position.copy(originalCameraPosition);
  camera.rotation.copy(originalCameraRotation);

  // Take snapshot
  ZapparSharing(
    {
      data: url,
      fileNamePrepend: "Zappar",
      shareUrl: "www.zappar.com",
      shareTitle: "Hello World!",
      shareText: "Hello World!",

      onSave: () => {
        console.log("Image was saved");
      },
      onShare: () => {
        console.log("Share button was pressed");
      },
      onClose: () => {
        console.log("Dialog was closed");
      },
    },
    {
      buttonImage: {
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
        margin: "auto",
        width: "0px",
        height: "40px",
        backgroundImage: share,
      },
      saveShareAnchor: {
        display: "flex",
        width: "70px",
        height: "70px",
        marginTop: "2.5%",
        marginLeft: "5%",
        marginRight: "5%",
      },
    },
    {
      SAVE: "Fanisko",
      SHARE: "SHARE",
      NowOpenFilesAppToShare: "Now open files app to share",
      TapAndHoldToSave: "Tap and hold the image<br/>to save to your Photos app",
    }
  );

  // Capture the element by its ID
  const zapparSaveButton = document.getElementById("zapparSaveButton");
  if (zapparSaveButton) {
    //Create a new SVG image content
    const newSVGContent = `
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64" height="64" viewBox="0 0 40 40">
      <path d="M 12.5 1 C 11.125 1 10 2.125 10 3.5 C 10 3.980469 10.144531 4.425781 10.378906 4.808594 L 8.054688 7 L 5.949219 7 C 5.714844 5.863281 4.703125 5 3.5 5 C 2.125 5 1 6.125 1 7.5 C 1 8.875 2.125 10 3.5 10 C 4.703125 10 5.714844 9.136719 5.949219 8 L 8.054688 8 L 10.40625 10.148438 C 10.152344 10.539063 10 11 10 11.5 C 10 12.875 11.125 14 12.5 14 C 13.875 14 15 12.875 15 11.5 C 15 10.125 13.875 9 12.5 9 C 11.984375 9 11.5 9.15625 11.101563 9.429688 L 9 7.507813 L 9 7.476563 L 11.0625 5.539063 C 11.472656 5.824219 11.964844 6 12.5 6 C 13.875 6 15 4.875 15 3.5 C 15 2.125 13.875 1 12.5 1 Z M 12.5 2 C 13.335938 2 14 2.664063 14 3.5 C 14 4.335938 13.335938 5 12.5 5 C 11.664063 5 11 4.335938 11 3.5 C 11 2.664063 11.664063 2 12.5 2 Z M 3.5 6 C 4.335938 6 5 6.664063 5 7.5 C 5 8.335938 4.335938 9 3.5 9 C 2.664063 9 2 8.335938 2 7.5 C 2 6.664063 2.664063 6 3.5 6 Z M 12.5 10 C 13.335938 10 14 10.664063 14 11.5 C 14 12.335938 13.335938 13 12.5 13 C 11.664063 13 11 12.335938 11 11.5 C 11 10.664063 11.664063 10 12.5 10 Z"></path>
     
    <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="black" font-size="10" font-weight="bold">SHARE</text>
    </svg>
  `;
    // Set the new content for the zapparSaveButton
    zapparSaveButton.innerHTML = newSVGContent;
    // Change the src attribute to the new image URL
  }
});

// Use a function to render our scene as usual
function render(): void {
  if (!hasPlaced) {
    // If the user hasn't chosen a place in their room yet, update the instant tracker
    // to be directly in front of the user
    instantTrackerGroup.setAnchorPoseFromCameraOffset(0, 0, -5);
  }

  // Update particle positions or properties here
  const positions: any = particlesGeometry.getAttribute("position").array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += Math.random() * 0.01; // Move particles upward
    if (positions[i + 1] > 5) {
      positions[i + 1] = -5; // Reset particles' Y position when they go beyond the screen
    }
  }
  particles1.rotation.z += 0.1;
  // Update particles1 to move in a circular path
  const radius = 2; // Adjust the radius of the circular path
  const speed = 0.01; // Adjust the speed of rotation
  particles1.position.x = radius * Math.cos(speed * performance.now());
  particles1.position.z = radius * Math.sin(speed * performance.now());

  particlesGeometry.getAttribute("position").needsUpdate = true;
  // particles.rotation.z += 0.001;

  // The Zappar camera must have updateFrame called every frame
  camera.updateFrame(renderer);

  // Draw the ThreeJS scene in the usual way, but using the Zappar camera
  renderer.render(scene, camera);

  // Call render() again next frame
  requestAnimationFrame(render);
}

// Start things off
render();
