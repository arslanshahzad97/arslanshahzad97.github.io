import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* =========================================
   THREE.JS — IMMERSIVE HERO BACKGROUND
   ========================================= */
const container = document.getElementById('hero-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xffffff, 0.035);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

// Realistic environment for PBR materials
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 2));

const dirLight = new THREE.DirectionalLight(0xfff5e6, 3);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const pointLight = new THREE.PointLight(0x3b82f6, 2, 20);
pointLight.position.set(-5, 3, 2);
scene.add(pointLight);

// Materials
const goldMat = new THREE.MeshStandardMaterial({
  color: 0xc9a227,
  metalness: 0.8,
  roughness: 0.25,
});

const creamMat = new THREE.MeshStandardMaterial({
  color: 0xfdfbf7,
  metalness: 0.1,
  roughness: 0.4,
});

const chromeMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1.0,
  roughness: 0.05,
});

// Geometry
const mesh1 = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), goldMat);
mesh1.position.set(2.5, 0.5, -2);
scene.add(mesh1);

const mesh2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 64, 64), chromeMat);
mesh2.position.set(-2.5, -0.5, -3);
scene.add(mesh2);

const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.25, 128, 32), creamMat);
mesh3.position.set(0, -1.5, -1);
scene.add(mesh3);

// Mouse parallax
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  mesh1.rotation.x = t * 0.15;
  mesh1.rotation.y = t * 0.25;
  mesh1.position.y = 0.5 + Math.sin(t * 0.6) * 0.25;

  mesh2.rotation.y = t * 0.2;
  mesh2.position.y = -0.5 + Math.cos(t * 0.5) * 0.2;

  mesh3.rotation.x = t * 0.3;
  mesh3.rotation.z = t * 0.1;
  mesh3.position.y = -1.5 + Math.sin(t * 0.7) * 0.3;

  targetX = mouseX * 0.8;
  targetY = mouseY * 0.5;
  camera.position.x += (targetX - camera.position.x) * 0.04;
  camera.position.y += (targetY - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* =========================================
   GSAP — SCROLL & ENTRANCE ANIMATIONS
   ========================================= */
gsap.registerPlugin(ScrollTrigger);

// Navbar glassmorphism
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Hero entrance sequence
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
  .from('.hero-badge', { y: 20, opacity: 0, duration: 0.8 })
  .from('.hero-title .line', { y: '110%', duration: 1.2, stagger: 0.12 }, '-=0.4')
  .from('.hero-subtitle', { y: 30, opacity: 0, duration: 1 }, '-=0.8')
  .from('.hero-actions .btn', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
  .from('.stat', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.4');

// Section headers
gsap.utils.toArray('.section-header').forEach(header => {
  gsap.from(header.children, {
    scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 40,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
  });
});

// About
gsap.from('.about-text', {
  scrollTrigger: { trigger: '.about-grid', start: 'top 75%' },
  x: -40,
  opacity: 0,
  duration: 1,
  ease: 'power3.out',
});

gsap.from('.about-image', {
  scrollTrigger: { trigger: '.about-grid', start: 'top 75%' },
  x: 40,
  opacity: 0,
  duration: 1,
  delay: 0.2,
  ease: 'power3.out',
});

// Bento cards
gsap.from('.bento-card', {
  scrollTrigger: { trigger: '.bento-grid', start: 'top 80%' },
  y: 60,
  opacity: 0,
  duration: 0.9,
  stagger: 0.1,
  ease: 'power3.out',
});

// Timeline
gsap.from('.timeline-item', {
  scrollTrigger: { trigger: '.timeline', start: 'top 75%' },
  x: -30,
  opacity: 0,
  duration: 0.9,
  stagger: 0.2,
  ease: 'power3.out',
});

// Portfolio
gsap.from('.portfolio-card', {
  scrollTrigger: { trigger: '.portfolio-grid', start: 'top 80%' },
  y: 50,
  opacity: 0,
  duration: 0.9,
  stagger: 0.15,
  ease: 'power3.out',
});

// Contact
gsap.from('.contact-title, .contact-text, .contact-links', {
  scrollTrigger: { trigger: '.contact', start: 'top 75%' },
  y: 30,
  opacity: 0,
  duration: 1,
  stagger: 0.15,
  ease: 'power3.out',
});

// Animated stat counters
gsap.utils.toArray('.stat-number').forEach(stat => {
  const target = parseInt(stat.dataset.target);
  gsap.to(stat, {
    scrollTrigger: { trigger: stat, start: 'top 90%' },
    innerHTML: target,
    duration: 2.2,
    snap: { innerHTML: 1 },
    ease: 'power2.out',
  });
});
