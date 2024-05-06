import { render } from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { any, color } from 'three/examples/jsm/nodes/Nodes.js';
import *as CANNON from 'cannon';


//Significa * todo lo que esta en three
function DoThree(){

const conversorradiones = Math.PI/180;//conversion en radianes 

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//fov: Angulo de vision
//Aspect ratio
//Near plane: Que tan cerca puede estar un objeto
//Far plane


scene.background = new THREE.Color("skyblue");

const renderer = new THREE.WebGLRenderer();
renderer.toneMapping = THREE.ACESFilmicToneMapping; //opciones aestethic
renderer.outputColorSpace = THREE.SRGBColorSpace; //opciones aestethic
renderer.setPixelRatio(window.devicePixelRatio); //opciones aestethic
renderer.setSize( window.innerWidth, window.innerHeight );

renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera,renderer.domElement);

//Luz 
const directionallight = new THREE.DirectionalLight( 0xffffff, 2);
scene.add( directionallight);
directionallight.castShadow = true;

const ambientlight = new THREE.AmbientLight(0xdddddd);
scene.add(ambientlight);


document.body.appendChild( renderer.domElement );

//Geometria, material y mesh


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xffaaaa } );
const cubeMesh = new THREE.Mesh( geometry, material );
scene.add( cubeMesh );
cubeMesh.castShadow = true;
cubeMesh.position.x = 6;

camera.position.y = 5;
camera.position.z = 10;

const PlaneG = new THREE.PlaneGeometry(20,20,1,1)
const Planemat = new THREE.MeshPhongMaterial({color:0xaaffaa, side:THREE.DoubleSide});
const PlaneMesh = new THREE.Mesh(PlaneG, Planemat);
scene.add(PlaneMesh);
PlaneMesh.receiveShadow = true;

PlaneMesh.rotateX(90 * conversorradiones );


//Plane.translateY(-2);//relativo al objeto
PlaneMesh.position.set(0,-2,0);


//esferas
const esfegeo = new THREE.SphereGeometry(1,16,8);
const red = new THREE.MeshBasicMaterial({color:'red'})
const esferaMesh = new THREE.Mesh(esfegeo,red);

scene.add(esferaMesh);

esferaMesh.castShadow = true;

esferaMesh.position.x = 1

const vectorx = new THREE.Vector3(1,1,1);

esferaMesh.position.copy(vectorx);

//crear mundo
const world = new CANNON.World();//equivalente a la escena
world.gravity = new CANNON.Vec3(0,-9.81,0);

const pisoPhysMat = new CANNON.Material("Ice");//Material para un body

const pisoBody:any = new CANNON.Body({
  //shape:new CANNON.Plane(),//Plano es infinito por eso no recibe parametros
  //mass: 10
  shape: new CANNON.Box(new CANNON.Vec3(5,5,0.1)),
  type: CANNON.Body.STATIC,
  material: pisoPhysMat
})




















world.addBody(pisoBody);
pisoBody.quaternion.setFromEuler(-90 * conversorradiones,0,0);

//const esferaBodyMat = new CANNON.Material("esfera");
const esfeBody= new CANNON.Body({
  mass: 10,
  shape: new CANNON.Sphere(1),
  position: new CANNON.Vec3(0,5,0),
})

world.addBody(esfeBody);

const cuboPhysMat = new CANNON.Material("cubo");

const cuboBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box( new CANNON.Vec3 (0.5,0.5,0.5)), //La mitad de los visuales
  material: cuboPhysMat,
  position: new CANNON.Vec3(0.25,8,0.25)
})


world.addBody(cuboBody);

cuboBody.velocity.set(0,10,0);
// console.log(cuboBody.velocity.y);
cuboBody.angularVelocity.set(0,15,0);
cuboBody.angularDamping = 0.5; //0 a 1, 1 extremo y deteniendo 


const pisoCuboContactMaterial = new CANNON.ContactMaterial(pisoBody,
  pisoPhysMat,
  {
    //friction: 0, //0-1 friccion
    restitution: 0 //rebotabilidad
  }
 )



 world.addContactMaterial(pisoCuboContactMaterial);

 
  
 

const physStep = 1 / 60;
const clock = new THREE.Clock();

function animate() {
  //UPDATE
  let delta = clock.getDelta(); //tiempo entre frames
	requestAnimationFrame( animate ); //pide el siguiente frame
  world.step(physStep);//Velocidad de simulacion

  PlaneMesh.position.copy(pisoBody.position);
  PlaneMesh.quaternion.copy(pisoBody.quaternion);

  esferaMesh.position.copy(esfeBody.position);
  esferaMesh.quaternion.copy(esfeBody.quaternion);

  cubeMesh.position.copy(cuboBody.position);
  cubeMesh.quaternion.copy(cuboBody.quaternion);


	renderer.render( scene, camera );
}
//cambia el tamaño de la ventana
window.addEventListener( 'resize', onWindowResize, false );
  
  function onWindowResize(){ //funcion para redimensionar ventana si el usuario le anda moviendo
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

animate();
}



function App() {


  return (
    <>
      <h1>Hola mundo</h1>
      {DoThree()}
    </>
  )
}

export default App
