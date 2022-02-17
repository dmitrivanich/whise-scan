import React, { Suspense,useEffect,useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, TransformControls, Line} from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import * as THREE from 'three';

import "./Viewer.scss";

function Scene() {
  
  const R = 10000
  const pointSize = R/50
  const coordGridSize = R/100
  const [activePoint, setActivePoint] = useState(0)

  const camerasTextures = [
    '360-1.jpg',
    '360-2.jpg'
  ];

  const [Cx,Cz,Cy] = [0,-R,0]

  const [Ax,Az,Ay] = [-8000,-R,1000]


  let AxyCz = ((Ay**2)+(Ax**2))**0.5
  let AxyC = ((R**2)+(AxyCz**2))**0.5
  let Kxy = Math.sign(Ay) * (R*AxyCz)/AxyC

  let Ky = (Ay * Kxy)/AxyCz * Math.sign(Ay)
  let Kx = ((Kxy**2)-(Ky**2))**0.5 * Math.sign(Ax)
  let Kz = ((R**2)-(Kxy**2))**0.5 * -1


  const pointsCoords = [
        [[Cx,Cz,Cy],
        [Ax,Az,Ay],
        [Kx,Kz,Ky]]]


  const texture = camerasTextures[activePoint]
  
  //загружает текстуру сферы и убирает вертикальное отражение внутри сферы
  const sphereImg = useLoader(TextureLoader, texture);
  sphereImg.wrapS = THREE.RepeatWrapping
  sphereImg.repeat.x = -1
  
  function pointColor(index,activePoint){
      if(index ===  activePoint){
        return("black")
      } else {
        switch (index) {
          case 0:
            return "blue"
            break;
          case 1:
            return "orange"
            break;
          case 2:
            return "green"
            break;
          case 3:
            return "yellow"
            break;
          case 4:
            return "purple"
            break;
          
          default:
            return "red"
            break;
        }
      }
      
  }
  
  return (
    <>
      <ambientLight intensity={1.5} />

      <mesh position={[0,0,0]}
      
        rotation={[0,0.04,0]}>
        <sphereBufferGeometry args={[R,100,100]}
        
        />
        <meshStandardMaterial
          transparent={true}
          opacity={0.2}
          depthTest={true}
          depthWrite={true}
          map={sphereImg}
          side={THREE.DoubleSide}
          />
      </mesh>

      <mesh position={[0,-R,0]} rotation={[-Math.PI/2,0,0]}>
        <circleBufferGeometry args={[100000,32]}/>
        <meshBasicMaterial
          color={'#d3d3d3'}
          side={THREE.DoubleSide}
          />
      </mesh>

      <group name="LINES">
        <Line
            points={[[0, 0, 0],[Ax, Az, Ay]]}                                
            color="black"                  
            lineWidth={1} 
            dashed={true}                  
          />
        <Line
            points={[[0, Cz, 0],[Ax, Az, Ay]]}                                
            color="#262277"                  
            lineWidth={1} 
            dashed={true}                  
          />
        <Line
            points={[[0, 0, 0],[Cx, Cz, Cy]]}                                
            color="red"                  
            lineWidth={1} 
            dashed={true}                  
          />
        <Line
            points={[[Kx, 0, Ky],[Kx, Cz, Ky]]}                                
            color="blue"                  
            lineWidth={1} 
            dashed={true}                  
        />
      </group>

     <group name="COORDINAT_GRID"> 
        <mesh position={[0,0,0]}>
          <sphereBufferGeometry args={[2,10,10]} />
          <meshBasicMaterial
            color={'white'}
          />
        </mesh>
        <mesh position={[0,-R,0]}>
          <boxBufferGeometry args={[1,1,100000]}/>
          <meshBasicMaterial
            color={'red'}
          />
        </mesh>
        <mesh position={[0,-R,0]} rotation={[0,Math.PI/2,0]}>
          <boxBufferGeometry args={[1,1,100000]}/>
          <meshBasicMaterial
            color={'blue'}
          />
        </mesh>
     </group>

     <group name="POINTS">
      {/* ТОЧКИ ПЕРЕХОДА КАМЕРЫ */}
      {pointsCoords[activePoint].map((coord, index)=>(
        <mesh position={coord} key={index}
        onClick={(e)=>{
          setActivePoint(index)
        }}>
          <sphereBufferGeometry args={[pointSize,50,50]} />
          <meshBasicMaterial
            color={pointColor(index,activePoint)}
          />
        </mesh>
      ))}
     </group>
    
    </>
  );
}

export default function App() {
  return (
    <div className="all">
      <div className="viewer">
        <Canvas linear camera={{
          filmGauge: 200,
          position: [0,0,20000],
          fov: 60,
          far: 100000000,
          near:10,
        }}
          >
          <Suspense fallback={null}>
            <Scene />
            
            <OrbitControls
              rotateSpeed={0.5}
              // enableZoom={false}
              // autoRotate={true}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* <div className="control_panel">
        
      </div> */}
    </div>
  );
}
