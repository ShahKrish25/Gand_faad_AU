"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, Sphere } from "@react-three/drei"

function FloatingSpheres() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <Float
          key={i}
          speed={1 + Math.random() * 2}
          rotationIntensity={0.2}
          floatIntensity={0.5}
          position={[(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10]}
        >
          <Sphere args={[0.2 + Math.random() * 0.8, 16, 16]}>
            <meshStandardMaterial
              color={new THREE.Color().setHSL(Math.random(), 0.7, 0.5)}
              roughness={0.1}
              metalness={0.8}
              envMapIntensity={1}
              transparent
              opacity={0.7}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  )
}

function GridLines() {
  const gridRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!gridRef.current) return
    gridRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
  })

  return (
    <group ref={gridRef}>
      {Array.from({ length: 20 }).map((_, i) => {
        const y = (i - 10) * 1.5
        return (
          <line key={`horizontal-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={new Float32Array([-15, y, 0, 15, y, 0])}
                count={2}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#1a365d" transparent opacity={0.2} />
          </line>
        )
      })}

      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i - 10) * 1.5
        return (
          <line key={`vertical-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={new Float32Array([x, -15, 0, x, 15, 0])}
                count={2}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#1a365d" transparent opacity={0.2} />
          </line>
        )
      })}
    </group>
  )
}

// Simplified version to avoid potential issues
function MovingParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!particlesRef.current) return

    const particleCount = 500
    const positions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30
      positions[i + 1] = (Math.random() - 0.5) * 30
      positions[i + 2] = (Math.random() - 0.5) * 30
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    if (particlesRef.current) {
      particlesRef.current.geometry = geometry
      setInitialized(true)
    }
  }, [])

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial size={0.05} color="#4299e1" transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

export default function ThreeBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Canvas className="h-full w-full">
      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", 5, 30]} />
      <ambientLight intensity={0.5} />
      <FloatingSpheres />
      <GridLines />
      <MovingParticles />
      <Environment preset="city" />
    </Canvas>
  )
}

