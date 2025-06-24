'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import backdropVertexShader from '@/shaders/backdrop.vert'
import backdropFragmentShader from '@/shaders/backdrop.frag'
import circleVertexShader from '@/shaders/circle.vert'
import circleFragmentShader from '@/shaders/circle.frag'

interface BackdropProps {
    children: React.ReactNode
}

export const Backdrop = (Props: BackdropProps) => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!mountRef.current) return

        const scene = new THREE.Scene()
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
        const renderer = new THREE.WebGLRenderer({ alpha: true })

        mountRef.current.appendChild(renderer.domElement)

        const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)

        const geometry = new THREE.PlaneGeometry(2, 2)
        const backdropMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_scene: { value: renderTarget.texture },
                u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                u_blur_radius: { value: 5.0 }, // Adjust for more/less blur
            },
            vertexShader: backdropVertexShader,
            fragmentShader: backdropFragmentShader,
        })

        const backdropMesh = new THREE.Mesh(geometry, backdropMaterial)
        backdropMesh.renderOrder = 0
        scene.add(backdropMesh)

        const meshes: THREE.Mesh[] = []

        for (let i = 0; i < 100; i++) {
            const circleMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    u_time: { value: 0.0 },
                    u_resolution: { value: new THREE.Vector2() },
                    u_color: { value: new THREE.Color('#FFFFFF') },
                    u_seed: { value: Math.random() * 1000 }, // Random seed for circle animation
                },
                vertexShader: circleVertexShader,
                fragmentShader: circleFragmentShader,
                transparent: true,
            })

            const circleMesh = new THREE.Mesh(geometry, circleMaterial)
            circleMesh.renderOrder = 1

            scene.add(circleMesh)
            meshes.push(circleMesh)
        }

        camera.position.z = 1

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderTarget.setSize(window.innerWidth, window.innerHeight)
            backdropMaterial.uniforms.u_resolution.value.x = window.innerWidth
            backdropMaterial.uniforms.u_resolution.value.y = window.innerHeight
        }

        const animate = () => {
            requestAnimationFrame(animate)

            // Update circle animations
            meshes.forEach(mesh => {
                (mesh.material as THREE.ShaderMaterial).uniforms.u_time.value += 0.01
            })

            // Pass 1: Render circles to render target
            renderer.setRenderTarget(renderTarget)
            backdropMesh.visible = false
            meshes.forEach(mesh => { mesh.visible = true })
            renderer.render(scene, camera)

            // Pass 2: Render backdrop with blur to screen
            renderer.setRenderTarget(null)
            backdropMesh.visible = true
            meshes.forEach(mesh => { mesh.visible = false })
            renderer.render(scene, camera)
        }

        window.addEventListener('resize', handleResize)
        handleResize()
        animate()

        return () => {
            window.removeEventListener('resize', handleResize)
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement)
            }
        }
    }, [])

    return (
        <>
            <div ref={mountRef} className='overflow-hidden fixed -top-0 -z-10 w-screen h-screen' />
            <div className='z-20 bg-none'>
                {Props.children}
            </div>
        </>
    )
}