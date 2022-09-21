import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";
import sunTexture from "./images/sun.jpg";
import mercuryTexture from "./images/mercury.jpg";
import venusTexture from "./images/venus.jpg";
import earthTexture from "./images/earth.jpg";
import marsTexture from "./images/mars.jpg";
import jupiterTexture from "./images/jupiter.jpg";
import saturnTexture from "./images/saturn.jpg";
import saturnRingTexture from "./images/saturn ring.png";
import uranusRingTexture from "./images/uranusRing.png";
import uranusTexture from "./images/uranus.jpg";
import neptuneTexture from "./images/neptune.jpg";
import plutoTexture from "./images/pluto.jpg";

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x555555, 3);
scene.add(ambientLight);

var infodiv = document.querySelector(".infodiv");
var outputpara1 = document.createElement("p");
outputpara1.id = "output";
infodiv.appendChild(outputpara1);
var outputpara2 = document.createElement("p");
outputpara2.id = "output";
infodiv.appendChild(outputpara2);

function addStar() {
  const starGeo = new THREE.SphereGeometry(0.25, 50, 50);
  const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const starTexture = new THREE.Mesh(starGeo, starMat);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(300));

  starTexture.position.set(x, y, z);
  scene.add(starTexture);
}

Array(1000).fill().forEach(addStar);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
const group = new THREE.Group();
group.add(sun);
scene.add(group);

function createPlanete(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();

  const ringmat = new THREE.RingGeometry(position, position + 0.3, 500);
  const ringgeo = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  const mercuryRing = new THREE.Mesh(ringmat, ringgeo);
  scene.add(mercuryRing);

  obj.add(mesh);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    obj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  // scene.add(obj);
  group.add(obj);
  scene.add(group);
  mesh.position.x = position;
  return { mesh, obj, position };
}

const mercury = createPlanete(3.2, mercuryTexture, 63);
const venus = createPlanete(5.8, venusTexture, 100);
const earth = createPlanete(6, earthTexture, 147);
const mars = createPlanete(4, marsTexture, 180);
const jupiter = createPlanete(12, jupiterTexture, 230);
const saturn = createPlanete(10, saturnTexture, 300, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = createPlanete(7, uranusTexture, 360, {
  innerRadius: 5,
  outerRadius: 20,
  texture: uranusRingTexture,
});

const neptune = createPlanete(7, neptuneTexture, 410);
const pluto = createPlanete(2.8, plutoTexture, 450);

const backgroundScene = textureLoader.load("/images/stars.jpg");
scene.background = backgroundScene;

const pointLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(pointLight);

const zoomInTimeline = (x, y, z, zoomOutFactor = 0) => {
  let tl = gsap
    .timeline({ defaults: { duration: 1.5, ease: "expo.out" } })
    .to(orbit.target, { x, y, z })
    .to(camera.position, { x, y, z: z + zoomOutFactor }, 0);
};

const zoomOutTimeline = (x, y, z) => {
  let tl1 = gsap
    .timeline({ defaults: { duration: 1.5, ease: "ease.in" } })
    .to(orbit.target, { x, y, z })
    .to(camera.position, { x, y, z }, 0);
};

var sunbtn = document.getElementById("sun");
var mercurybtn = document.getElementById("merc");
var venusbtn = document.getElementById("venu");
var earthbtn = document.getElementById("eart");
var marsbtn = document.getElementById("mar");
var jupiterbtn = document.getElementById("jupi");
var saturnbtn = document.getElementById("satu");
var uranusbtn = document.getElementById("uran");
var neptunebtn = document.getElementById("nept");
var plutobtn = document.getElementById("plut");
var zout = document.getElementById("zoomout");

var res, gravity;

document.querySelector("#wtinp").addEventListener("click", () => {
  res = parseFloat(prompt("Enter the weight of object on Earth:"));
});

zout.addEventListener("click", () => {
  zoomOutTimeline(0, 140, 140);
});

sunbtn.addEventListener("click", () => {
  if (res == undefined) {
    alert("please enter the weight of the object");
  } else {
    zoomInTimeline(0, 25, 25);
    infodiv.style.visibility = "visible";
    gravity = 27.07;
    outputpara1.innerHTML = "The weight on Earth's surface is: " + res;
    outputpara2.innerHTML = "The weight on Sun's surface is: " + res * gravity;
  }
});
mercurybtn.addEventListener("click", () => {
  if (res == undefined) {
    alert("please enter the weight of the object");
  } else {
    zoomInTimeline(mercury.position, 5, 5);
    gravity = 0.38;
    outputpara1.innerHTML = "The weight on Earth's surface is: " + res;
    outputpara2.innerHTML =
      "The weight on Mercury's surface is: " + res * gravity;
  }
});
venusbtn.addEventListener("click", () => {
  if (res == undefined) {
    alert("please enter the weight of the object");
  } else {
    zoomInTimeline(venus.position, 10, 10);
    gravity = 0.91;
    outputpara1.innerHTML = "The weight on Earth's surface is: " + res;
    outputpara2.innerHTML =
      "The weight on Venus's surface is: " + res * gravity;
  }
});
earthbtn.addEventListener("click", () => {
  if (res == undefined) {
    alert("please enter the weight of the object");
  } else {
    zoomInTimeline(earth.position, 10, 10);
    gravity = 1;
    outputpara1.innerHTML = "The weight on Earth's surface is: " + res;
    outputpara2.innerHTML =
      "The weight on Earth's surface is: " + res * gravity;
  }
});
marsbtn.addEventListener("click", () => {
  if (res == undefined) {
    alert("please enter the weight of the object");
  } else {
    zoomInTimeline(mars.position, 8, 8);
    gravity = 0.38;
    outputpara1.innerHTML = "The weight on Earth's surface is: " + res;
    outputpara2.innerHTML = "The weight on Mars's surface is: " + res * gravity;
  }
});
jupiterbtn.addEventListener("click", () => {
  if (res == undefined) {
    alert("please enter the weight of the object");
  } else {
    zoomInTimeline(jupiter.position, 17, 17);
    gravity = 2.34;
    outputpara1.innerHTML = "The weight on Earth's surface is: " + res;
    outputpara2.innerHTML =
      "The weight on Jupiter's surface is: " + res * gravity;
  }
});
saturnbtn.addEventListener("click", () => {
  if (res == undefined) {
    alert("please enter the weight of the object");
  } else {
    zoomInTimeline(saturn.position, 15, 15);
    gravity = 1.06;
    outputpara1.innerHTML = "The weight on Earth's surface is: " + res;
    outputpara2.innerHTML =
      "The weight on Saturn's surface is: " + res * gravity;
  }
});
uranusbtn.addEventListener("click", () => {
  if (res == undefined) {
    alert("please enter the weight of the object");
  } else {
    zoomInTimeline(uranus.position, 10, 10);
    gravity = 0.92;
    outputpara1.innerHTML = "The weight on Earth's surface is: " + res;
    outputpara2.innerHTML =
      "The weight on Uranus's surface is: " + res * gravity;
  }
});
neptunebtn.addEventListener("click", () => {
  if (res == undefined) {
    alert("please enter the weight of the object");
  } else {
    zoomInTimeline(neptune.position, 10, 10);
    gravity = 1.19;
    outputpara1.innerHTML = "The weight on Earth's surface is: " + res;
    outputpara2.innerHTML =
      "The weight on Neptune's surface is: " + res * gravity;
  }
});
plutobtn.addEventListener("click", () => {
  if (res == undefined) {
    alert("please enter the weight of the object");
  } else {
    zoomInTimeline(pluto.position, 10, 10);
    gravity = 0.06;
    outputpara1.innerHTML = "The weight on Earth's surface is: " + res;
    outputpara2.innerHTML =
      "The weight on Pluto's surface is: " + res * gravity;
  }
});

function animate() {
  requestAnimationFrame(animate);

  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  renderer.render(scene, camera);
}

animate();
