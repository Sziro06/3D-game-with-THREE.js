import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



const pointsUI = document.querySelector("#points");
let points = 0;

const randomRangeNum = (max,min)=>{
	return Math.floor(Math.random() * (max - min + 1) + min);
}



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


const powerups = []
for(let i = 0; i < 10; i++) {
	const powerup = new THREE.Mesh(
		new THREE.TorusGeometry( 1, 0.4, 16, 50),
		new THREE.MeshBasicMaterial({ color: 0xffff00 })
	);
	powerup.scale.set( 0.1, 0.1, 0.1 )
	powerup.name = "powerup" + i + 1
	powerup.position.x = i+2
	powerups.push(powerup);
	scene.add( powerup );
}


const gridHelper = new THREE.GridHelper( 30, 30 );
scene.add( gridHelper)



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
	if(e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
		player.position.z -= 0.1;
	}
	if(e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
		player.position.z += 0.1;
	}
  })