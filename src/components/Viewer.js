import React, { Suspense,useEffect,useState,useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, TransformControls, Line} from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader";

import * as THREE from 'three';

import "./Viewer.scss";

function Scene() {
  const linesVisable = true
  const coordGridVisable = true


  const R = 8000
  const pointSize = R/50
  const coordLinesSize = R/100
  const coordFlatSize = R*5

  const [activePoint, setActivePoint] = useState(0)

  const camerasTextures = [
    '360-1.jpg',
    '360-2.jpg'
  ];

  const coordsOfPoints = [
    [0.01,-R,0.01],
    [25000,-R,-4500],
    [2000,-R, -20000]
  ]
  const [Cx,Cz,Cy] = coordsOfPoints[0] //расположение камеры

  function getPointInfo([Ax,Az,Ay], index) {
    let AxyCz = ((Ay**2)+(Ax**2))**0.5
    let AxyC = ((R**2)+(AxyCz**2))**0.5
    let Kxy = Math.sign(Ay) * (R*AxyCz)/AxyC

    let Ky = (Ay * Kxy)/AxyCz * Math.sign(Ay)
    let Kx = ((Kxy**2)-(Ky**2))**0.5 * Math.sign(Ax)
    let Kz = ((R**2)-(Kxy**2))**0.5 * -1
    
    return {
      coords: [Kx,Kz,Ky],
      angle: Math.acos(AxyCz/AxyC)
    }
  }

  function createPoint(coord,index){
    function getPointColor(index){
      const colors = ['#CCFF00','#CC6600','#FFCC00','#FF9999','#330000','#660099','#3300CC','#003366','#006666','#66CCFF','#339933','#999900'];
      const randInd = Math.floor(Math.random()*(colors.length-1))
      return(colors[randInd])
    }
    const pointColor = getPointColor(index)
    return(
      <group className={`point-${index}`} key={index}>
              <mesh position={getPointInfo(coord,index).coords}
                rotation={[Math.PI/2,getPointInfo(coord,index).angle,0]}>
                <sphereBufferGeometry args={[pointSize,32]}/>
                <meshBasicMaterial
                  color={pointColor}
                  side={THREE.DoubleSide}
                  />
              </mesh>

              {coordGridVisable&&
                <mesh position={coord}>
                <sphereBufferGeometry args={[pointSize,50,50]} />
                <meshBasicMaterial
                  color={pointColor}
                />
                </mesh>
              }
              <group name="LINES">
                <Line
                    points={[[0, 0, 0],coord]}                                
                    color="black"                  
                    lineWidth={linesVisable? 0.5 : 0}
                    dashed={true}   
                  />
                <Line
                    points={[[0, -R, 0],coord]}                                
                    color="grey"                  
                    lineWidth={linesVisable? 1 : 0}               
                  />
                <Line
                    points={[[0, 0, 0],getPointInfo(coord,index).coords]}                                
                    color={pointColor}                  
                    lineWidth={linesVisable? 1 : 0}                
                  />
              </group> 
            </group>
    )
  }

  const texture = camerasTextures[activePoint]
  
  //загружает текстуру сферы и убирает вертикальное отражение внутри сферы
  const sphereImg = useLoader(TextureLoader, texture);
  sphereImg.wrapS = THREE.RepeatWrapping
  sphereImg.repeat.x = -1
  
  
  
  return (
    <>
      <ambientLight intensity={1.5} />

      <mesh position={[0,0,0]}
      
        rotation={[0,0.04,0]}>
        <sphereBufferGeometry args={[R,100,100]}/>
        <meshStandardMaterial
          transparent={true}
          opacity={1}
          depthTest={true}
          depthWrite={true}
          map={sphereImg}
          side={THREE.DoubleSide}/>
      </mesh>


     
      {
        coordsOfPoints.map((coord,index)=> createPoint(coord,index))
      }
 
     { coordGridVisable && 
        <group name="COORDINAT_GRID"> 
          <mesh position={[0,-R,0]} rotation={[-Math.PI/2,0,0]}>
            <circleBufferGeometry args={[coordFlatSize,32]}/>
            <meshBasicMaterial
              color={'#d3d3d3'}
              side={THREE.DoubleSide}
              />
          </mesh>
          <mesh position={[0,0,0]}>
            <sphereBufferGeometry args={[pointSize,10,10]} />
            <meshBasicMaterial
              color={'white'}
            />
          </mesh>
          <mesh position={[0,-R,0]}>
            <boxBufferGeometry args={[coordLinesSize,1,R*20]}/>
            <meshBasicMaterial
              color={'red'}
            />
          </mesh>
          <mesh position={[0,-R,0]} rotation={[0,Math.PI/2,0]}>
            <boxBufferGeometry args={[coordLinesSize,1,R*20]}/>
            <meshBasicMaterial
              color={'blue'}
            />
          </mesh>
        </group>
     }
    
    </>
  );
}

export default function App() {
  return (
    <div className="all">
      <div className="viewer">
        <Canvas linear camera={{
          filmGauge: 200,
          position: [0,0,100000],
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
