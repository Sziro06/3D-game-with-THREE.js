import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

// const gridHelper = new THREE.GridHelper( 30, 30 );
// scene.add( gridHelper)



//variabeler
const pointsUI = document.querySelector("#pointsUI");
let points = 0;
let gameOver = false;


//randomRangeNum
const randomRangeNum = (max,min) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};
const moveObstacles = (arr, speed, maxX, minX, maxZ, minZ) => {
	arr.forEach((el) => {
		el.body.position.z += speed;
		if(el.body.position.z > camera.position.z) {
			el.body.position.x = randomRangeNum(maxX, minX);
			el.body.position.z = randomRangeNum(maxZ, minZ);
		}
		el.mesh.position.copy( el.body.position);
		el.mesh.quaternion.copy( el.body.quaternion);
	});
}


// lager scene, verden og tyndekraft.
const scene = new THREE.Scene();
const world = new CANNON.World({
	gravity: new CANNON.Vec3(0, -9.82, 0)
})
const cannonDebugger = new CannonDebugger( scene, world, {
	color: "#AEE2FF",
	scale: 1,
});
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 4.5;
camera.position.y = 1.5;



const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const controls = new OrbitControls(camera, renderer.domElement);



// lager bakken
const groundBody = new CANNON.Body({
	shape: new CANNON.Box( new CANNON.Vec3( 15, 0.5, 15 ))
})
groundBody.position.y = -1
world.addBody( groundBody );
const ground = new THREE.Mesh(
	new THREE.BoxGeometry( 30, 1, 30),
	new THREE.MeshBasicMaterial( { color: 0x00ff00} )
);
ground.position.y = -1
scene.add( ground );



//lager hovedkarakteren
const playerBody = new CANNON.Body({
	mass: 1,
	shape: new CANNON.Box( new CANNON.Vec3( 0.25, 0.25, 0.25 )),
	fixedRotation: true,
});
world.addBody( playerBody );
const player = new THREE.Mesh(
	new THREE.BoxGeometry( 0.5, 0.5, 0.5),
	new THREE.MeshBasicMaterial( { color: 0xff0000} )
);
scene.add( player );



// det som skjer når hovedkarakteren kolliderer
playerBody.addEventListener("collide", (e) => {
	powerups.forEach((el) => {
		if( e.body === el.body ) {
			el.body.position.x = randomRangeNum( 8,-8 );
			el.body.position.z = randomRangeNum( -5,-10 );
			el.mesh.position.copy( el.body.position );
			el.mesh.quaternion.copy( el.body.quaternion );
			points += 1;
			pointsUI.textContent = points.toString();
		}
	});
	enemies.forEach((el) => {
		if( e.body === el.body ) {
			gameOver = true
		}
	});
})



//poeng
const powerups = []
for(let i = 0; i < 10; i++) {
	const posX = randomRangeNum( 8,-8 );
	const posZ = randomRangeNum( -5,-10 );

	const powerup = new THREE.Mesh(
		new THREE.TorusGeometry( 1, 0.4, 16, 50),
		new THREE.MeshBasicMaterial({ color: 0xffff00 })
	);
	powerup.scale.set( 0.1, 0.1, 0.1 );
	powerup.position.x = posX;
	powerup.position.z = posZ;
	powerup.name = "powerup" + [i + 1]
	scene.add( powerup );

	const powerupBody = new CANNON.Body({
		shape: new CANNON.Sphere( 0.2 ),
	});
	powerupBody.position.set( posX, 0, posZ );
	world.addBody( powerupBody );

	const powerObject = {
		mesh: powerup,
		body: powerupBody,
	};

	powerups.push( powerObject );
}



//fiender
const enemies = [];

for(let i = 0; i < 3; i++) {
	const posX = randomRangeNum( 8,-8 );
	const posZ = randomRangeNum( -5,-10 );

	const enemy = new THREE.Mesh(
		new THREE.BoxGeometry( 1, 1, 1 ),
		new THREE.MeshBasicMaterial({ color: 0x0000ff })
	);

	enemy.position.x = posX;
	enemy.position.z = posZ;
	enemy.name = "enemy" + [i + 1];
	scene.add( enemy );

	const enemyBody = new CANNON.Body({
		shape: new CANNON.Box( new CANNON.Vec3( 0.5, 0.5, 0.5 )),
	});
	enemyBody.position.set( posX, 0, posZ );
	world.addBody( enemyBody );

	const enemyObject = {
		mesh: enemy,
		body: enemyBody,
	};

	enemies.push( enemyObject );
	
}



scene.fog = new THREE.FogExp2( 0x0047ab, 0.09, 50 );

const geometry = new THREE.BufferGeometry();
const vertices = [];
const size = 2000;

for( let i = 0; i < 5000; i++){
	const x = (Math.random() * size + Math.random() * size) / 2 - size / 2;
	const y = (Math.random() * size + Math.random() * size) / 2 - size / 2;
	const z = (Math.random() * size + Math.random() * size) / 2 - size / 2;

	vertices.push( x, y, z );
}

geometry.setAttribute(
	"position",
	new THREE.Float32BufferAttribute( vertices, 3 )
);

const material = new THREE.PointsMaterial({
	size: 2,
	color: 0xffffff,
})

const particles = new THREE.Points( geometry, material );
scene.add( particles );



//her er funksjonen som får de ulike tingene til å gjøre noe
function animate() {
	requestAnimationFrame( animate );

	particles.rotation.x+=.0001
	particles.rotation.y+=.0001
	particles.rotation.z+=.0005

	if(!gameOver){
	moveObstacles( powerups, 0.1, 8, -8, -5, -10)
	moveObstacles( enemies, 0.2, 8, -8, -5, -10)
	} else {
		pointsUI.textContent = "GAME OVER";
		playerBody.velocity.set( playerBody.position.x, 5, 5 );

		enemies.forEach((el) => {
			scene.remove( el.mesh );
			world.removeBody( el.body );
		});
		powerups.forEach((el) => {
			scene.remove( el.mesh );
			world.removeBody( el.body );
		});

		if( playerBody.position.z > camera.position.z ) {
			scene.remove( player );
			world.removeBody( playerBody );
		}
	}

	controls.update();

	world.fixedStep()

	player.position.copy(playerBody.position);
	player.quaternion.copy(playerBody.quaternion);

	cannonDebugger.update()

	renderer.render( scene, camera );
}

animate();



// koden til vinduet for at vinduet kan tilpasse seg til de forskjellige størrelsene til skjermen (responsiv).
window.addEventListener("resize",()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})



// kontrollene
window.addEventListener("keydown",(e) => {
	if(e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
		playerBody.position.x += 0.1;
	} else if(e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
		playerBody.position.x -= 0.1;
	} else if(e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
		playerBody.position.z -= 0.1;
	} else if(e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
		playerBody.position.z += 0.1;
	} else if(e.key === 'p' || e.key === 'P'){
		playerBody.position.x = 0;
		playerBody.position.y = 0;
		playerBody.position.z = 0;
	} else if(e.key === ' '){
		playerBody.position.y += 2;
	}
  })