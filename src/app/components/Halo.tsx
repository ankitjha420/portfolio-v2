'use client'

import React, {useEffect, useRef} from "react"
import * as THREE from "three"
import {GLTFLoader, DRACOLoader} from "three-stdlib"
import {OrbitControls} from "three-stdlib"

const Halo = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const sakRef = useRef<THREE.Object3D>(null)

	useEffect(() => {
		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / (window.innerHeight / 2),
			1,
			2000
		)
		camera.position.set(0, 10, 20)
		camera.lookAt(0, 0, 0)

		const light = new THREE.DirectionalLight(0xffffff, 10)
		light.position.set(10, 10, 10)
		scene.add(light)

		const opLight = new THREE.DirectionalLight(0xffffff, 10)
		opLight.position.set(-10, -10, -10)
		scene.add(opLight)


		const renderer = new THREE.WebGLRenderer({antialias: true})
		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight / 2)
		renderer.setClearColor(0x000000, 0)
		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMappingExposure = 1
		containerRef.current?.appendChild(renderer.domElement)

		const render = () => {
			renderer.render(scene, camera)
		}

		const controls = new OrbitControls(camera, renderer.domElement)
		controls.addEventListener('change', render)
		controls.target.set(0, 2, 0)
		controls.enableZoom = false
		controls.update()

		// loading model
		const dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
		const loader = new GLTFLoader()
		loader.setDRACOLoader(dracoLoader)
		loader.setPath('models/')
		loader.load('sak.gltf', function (gltf) {
			sakRef.current = gltf.scene
			gltf.scene.scale.set(0.5, 0.5, 0.5)
			scene.add(gltf.scene)
			render()
		})

		const onWindowResize = () => {
			camera.aspect = window.innerWidth / (window.innerHeight / 2)
			camera.updateProjectionMatrix()

			renderer.setSize(window.innerWidth, window.innerHeight / 2)

			render()
		}
		window.addEventListener('resize', onWindowResize)

		// animation ->
		let animationFrameId: number
		let time: number = 0
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate)
			controls.update()
			time += 0.01

			// move the models
			if (sakRef.current) {
				sakRef.current.rotation.y = Math.sin(time) * 0.25
				sakRef.current.rotation.x = Math.cos(time) * 0.25
			}

			renderer.render(scene, camera)
		}
		animate()

		// clean up ->
		return () => {
			cancelAnimationFrame(animationFrameId)
			window.removeEventListener('resize', onWindowResize)
			renderer.dispose()
		}

	}, [])

	return (
		<div id="halo-container" ref={containerRef}></div>
	)
}

export default Halo