import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
// Custom random point generator for a sphere
function generatePointsInSphere(count: number, radius: number) {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = radius * Math.cbrt(Math.random());
        
        points[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        points[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        points[i * 3 + 2] = r * Math.cos(phi);
    }
    return points;
}

function StarField(props: any) {
    const ref = useRef<any>(null)
    const [sphere] = useState(() => generatePointsInSphere(5000, 1.5))

    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10
            ref.current.rotation.y -= delta / 15
        }
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    )
}

export default function EventsBackground() {
    return (
        <div className="absolute inset-0 z-[-1] opacity-60">
            <Canvas 
                camera={{ position: [0, 0, 1] }}
                gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
                dpr={1}
            >
                <StarField />
            </Canvas>
        </div>
    )
}
