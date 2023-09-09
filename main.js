import * as THREE from './three.js-dev';
import { OrbitControls } from './three.js-dev/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 4.5;
camera.position.y = 1.5;



const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



const controls = new OrbitControls(camera, renderer.domElement);



const ground = new THREE.Mesh(
	new THREE.BoxGeometry( 30, 1, 30),
	new THREE.MeshBasicMaterial( { color: 0x00ff00} )
);
ground.position.y = -1
scene.add( ground );



const player = new THREE.Mesh(
	new THREE.BoxGeometry( 0.5, 0.5, 0.5),
	new THREE.MeshBasicMaterial( { color: 0xff0000} )
);
scene.add( player );



function animate() {
	requestAnimationFrame( animate );

	controls.update();

	renderer.render( scene, camera );
}

animate();



window.addEventListener("resize",()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})

window.addEventListener("keydown",(e) => {
	if(e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
		player.position.x += 0.1;
	}
	if(e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
		player.position.x -= 0.1;
	}
  })