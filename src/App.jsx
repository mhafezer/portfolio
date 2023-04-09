import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AsciiRenderer, Stars, Sphere, useTexture, Effects, TrackballControls, CameraControls, OrbitControls } from '@react-three/drei'
import { Vector3 } from 'three'


let cameraView = 0;
let drag = false;
function CameraZoom(props) {
  const views = [new Vector3(5,2,0), new Vector3(0,7,0), new Vector3(0,300,0)]
  useFrame(state => {
    if (!drag) {
      state.camera.lookAt(0, 0, 0)
      state.camera.position.lerp(views[cameraView % views.length], 0.04)
      state.camera.updateProjectionMatrix()
    }
  })
  return null
}

function Earth() {
  const texture = useTexture("/earth.jpg")
  const sphereReference = useRef()
  useFrame(() => {
    sphereReference.current.rotation.y -= 0.005
  })
  return (
    <Sphere ref={sphereReference} scale={2} rotation={[0, 0, 0]}>
          <meshBasicMaterial
            map={texture}
            color="white"
          />
    </Sphere>
  )
}

function Moon() {
  const texture = useTexture("/moon.jpg")
  const sphereReference = useRef()
  const radius = 4
  let theta = 0;
  let dTheta = 2 * Math.PI / 600
  useFrame(() => {
    theta += dTheta;
    sphereReference.current.position.x = radius * Math.cos(theta)
    sphereReference.current.position.z = radius * Math.sin(theta)
  })
  return (
    <Sphere ref={sphereReference} rotation={[1, 0, 3]} scale={0.3} position={[radius, 0, 0]}>
          <meshBasicMaterial
            map={texture}
            color="white"
          />
    </Sphere>
  )
}

function RedirectButton(props) {
  return (
    <a href={props.href} target='_blank' className='m-1 px-1 font-mono text-lg  border-[LightCoral] bg-[LightCoral] hover:scale-110 pointer-events-auto cursor-pointer transition-all'>
      {props.children}
    </a>

  )
}

function App() {
  return (
    <div className='fixed inset-0 bg-black text-center'>
      <div className='flex flex-col fixed inset-y-0 inset-x-0 items-center justify-center z-10 pointer-events-none cursor-pointer'>
        <h1 onClick={() => cameraView = cameraView + 1} className='text-4xl font-mono text-[LightCoral] pointer-events-auto px-1 bg-black opacity-90'>eslamira</h1>
        <div className='flex m-1'>
          <RedirectButton href="https://place.eslamira.com/">place</RedirectButton>
          <RedirectButton href="https://chat.eslamira.com/">chat</RedirectButton>
          {/* <RedirectButton href="https://place.eslamira.com">resume</RedirectButton> */}
          <RedirectButton href="https://github.com/mhafezer">github</RedirectButton>
        </div>
      </div>
      <Canvas camera={{position: [100, 0, 0]}} onMouseDown={() => drag=true} onMouseUp={() => drag=false} onTouchStart={() => drag=true} onTouchEnd={() => drag=false} className='inset-0'>
        <color attach="background" args={['black']} />
        <CameraZoom view={cameraView}/>
        <OrbitControls enableDamping/>
        <Stars radius={10} depth={100} count={2000} factor={10} saturation={0} fade speed={2} />
        <Earth/>
        <Moon/>
        <AsciiRenderer invert characters={` .,:-+*=%@#`} fgColor='MistyRose' renderIndex={0}/>
        
      </Canvas>
    </div>
  )
}

export default App