import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Html } from '@react-three/drei'
import { useStore } from '@/store/useStore'
import { Lead, LeadStage } from '@/types'
import * as THREE from 'three'
import './SolarSystemView.css'

// Componente do Sol (Empresa do Cliente)
function Sun({ position }: { position: [number, number, number] }) {
  const { clientCompany } = useStore()
  
  return (
    <mesh position={position}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color="#ffd700"
        emissive="#ffaa00"
        emissiveIntensity={0.5}
      />
      <Html distanceFactor={10} position={[0, 3, 0]}>
        <div className="sun-label">
          {clientCompany?.name || 'Sua Empresa'}
        </div>
      </Html>
    </mesh>
  )
}

// Componente de Planeta (Lead)
function LeadPlanet({
  lead,
  radius,
  angle,
  index,
}: {
  lead: Lead
  radius: number
  angle: number
  index: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const { setSelectedLead } = useStore()
  
  const stageColors: Record<LeadStage, string> = {
    [LeadStage.UNKNOWN]: '#ef4444',
    [LeadStage.AWARE]: '#f59e0b',
    [LeadStage.CONSIDERING]: '#3b82f6',
    [LeadStage.DECIDING]: '#8b5cf6',
    [LeadStage.ACTING]: '#10b981',
  }

  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime()
      const speed = 0.2 + (index % 5) * 0.1
      const x = Math.cos(angle + time * speed) * radius
      const z = Math.sin(angle + time * speed) * radius
      ref.current.position.set(x, Math.sin(time * 2) * 0.5, z)
      ref.current.rotation.y += 0.01
    }
  })

  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  return (
    <mesh
      ref={ref}
      position={[x, 0, z]}
      onClick={() => setSelectedLead(lead)}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color={stageColors[lead.stage]}
        emissive={stageColors[lead.stage]}
        emissiveIntensity={0.3}
      />
      <Html distanceFactor={10} position={[0, 0.8, 0]}>
        <div className="lead-label">
          {lead.firstName} {lead.lastName}
          <div className="lead-company">{lead.company.name}</div>
        </div>
      </Html>
    </mesh>
  )
}

// Componente de Órbita
function Orbit({ radius }: { radius: number }) {
  const points = []
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      )
    )
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color="#333"
        opacity={0.3}
        transparent
      />
    </line>
  )
}

// Componente principal da cena
function Scene() {
  const { leads, clientCompany } = useStore()
  
  // Agrupar leads por estágio
  const leadsByStage: Record<LeadStage, Lead[]> = {
    [LeadStage.UNKNOWN]: [],
    [LeadStage.AWARE]: [],
    [LeadStage.CONSIDERING]: [],
    [LeadStage.DECIDING]: [],
    [LeadStage.ACTING]: [],
  }

  leads.forEach((lead) => {
    leadsByStage[lead.stage].push(lead)
  })

  // Raio de cada órbita por estágio
  const orbitRadii = {
    [LeadStage.UNKNOWN]: 4,
    [LeadStage.AWARE]: 6,
    [LeadStage.CONSIDERING]: 8,
    [LeadStage.DECIDING]: 10,
    [LeadStage.ACTING]: 12,
  }

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      
      <Sun position={[0, 0, 0]} />
      <Stars radius={300} depth={50} count={5000} factor={4} />
      
      {Object.values(LeadStage).map((stage) => {
        const stageLeads = leadsByStage[stage]
        const radius = orbitRadii[stage]
        
        return (
          <group key={stage}>
            <Orbit radius={radius} />
            {stageLeads.map((lead, index) => {
              const angle = (index / stageLeads.length) * Math.PI * 2
              return (
                <LeadPlanet
                  key={lead.id}
                  lead={lead}
                  radius={radius}
                  angle={angle}
                  index={index}
                />
              )
            })}
          </group>
        )
      })}
    </>
  )
}

export function SolarSystemView() {
  const { leads, clientCompany, setClientCompany } = useStore()

  useEffect(() => {
    // Inicializar empresa do cliente se não existir
    if (!clientCompany) {
      setClientCompany({
        id: 'client-1',
        name: 'Sua Empresa',
        domain: 'suaempresa.com',
        industry: 'Tecnologia',
        size: '50-100',
        revenue: '$1M-$10M',
        location: 'São Paulo, BR',
        description: 'Empresa do cliente',
      })
    }
  }, [clientCompany, setClientCompany])

  return (
    <div className="solar-system-view">
      <div className="view-header">
        <h2>Sistema Solar de Leads</h2>
        <div className="stage-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ef4444' }}></span>
            Desconhecido
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f59e0b' }}></span>
            Consciente
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#3b82f6' }}></span>
            Consideração
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></span>
            Decisão
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#10b981' }}></span>
            Ação
          </div>
        </div>
      </div>
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 15, 20], fov: 60 }}>
          <Scene />
          <OrbitControls
            enablePan={false}
            minDistance={10}
            maxDistance={30}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-value">{leads.length}</span>
          <span className="stat-label">Total de Leads</span>
        </div>
        {Object.values(LeadStage).map((stage) => {
          const count = leads.filter((l) => l.stage === stage).length
          return (
            <div key={stage} className="stat">
              <span className="stat-value">{count}</span>
              <span className="stat-label">{stage}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

