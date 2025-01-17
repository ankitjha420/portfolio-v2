'use client'

import React, {useEffect, useMemo, useRef} from "react"
import * as THREE from "three"
import {GLTFLoader, DRACOLoader, GLTF, OrbitControls} from "three-stdlib"
import {shuffle} from "@/app/utils/hooks"

// paths to tech stack icons ->
const iconsMap: { [key: string]: string } = {
	go: '/icons/go_icon.glb',
	linux: '/icons/linux_icon.glb',
	react: '/icons/react_icon.glb',
	aws: '/icons/aws_icon.glb',
	docker: '/icons/docker_icon.glb',
	git: '/icons/git_icon.glb',
	js: '/icons/js_icon.glb',
	postgres: '/icons/postgres_icon.glb',
	py: '/icons/py_icon.glb',
	redis: '/icons/redis_icon.glb',
	ts: '/icons/ts_icon.glb',
	vite: '/icons/vite_icon.glb',
}

// constants ->
const RADIUS: number = 10
const ICON_COUNT: number = Object.keys(iconsMap).length
const ANGLE_STEP: number = (2 * Math.PI) / ICON_COUNT
const RANDOM_NUMBERS: number[] = []
let SHUFFLE: number[] = []
for (let i = 0; i < ICON_COUNT; i++) {
	RANDOM_NUMBERS.push((Math.random() - 0.5) * 0.5)
	SHUFFLE.push(i - Math.floor(ICON_COUNT / 2))
}
shuffle(SHUFFLE)

const Halo = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const sakRef = useRef<THREE.Object3D>(null)
	const iconRefs: React.RefObject<THREE.Object3D<THREE.Object3DEventMap> | null>[] = []

	for (let i = 0; i < ICON_COUNT; i++) {
		iconRefs.push(useRef<THREE.Object3D>(null))
	}

	useEffect(() => {
		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / (window.innerHeight),
			1,
			2000
		)
		camera.position.set(0, 0, 50)
		camera.lookAt(0, 0, 0)

		const light = new THREE.DirectionalLight(0xffffff, 5)
		light.position.set(10, 10, 10)
		scene.add(light)

		const opLight = new THREE.DirectionalLight(0xffffff, 5)
		opLight.position.set(-10, -10, -10)
		scene.add(opLight)


		const renderer = new THREE.WebGLRenderer({antialias: true})
		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setClearColor(0x000000, 0)
		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMappingExposure = 1
		containerRef.current?.appendChild(renderer.domElement)

		const render = () => {
			renderer.render(scene, camera)
		}

		const dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
		const loader = new GLTFLoader()
		loader.setDRACOLoader(dracoLoader)
		loader.setPath('models/');

		(function () {
			// swiss army knife model
			loader.load('sak.gltf', function (gltf) {
				sakRef.current = gltf.scene
				gltf.scene.scale.set(0.6, 0.6, 0.6)
				gltf.scene.position.y -= 4
				scene.add(gltf.scene)
			})

			// go icon
			loader.load(iconsMap["go"], (gltf) => {
				gltf.scene.scale.set(0.015, 0.015, 0.015)
				iconRefs[0].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[0])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[0])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[0])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			// linux icon
			loader.load(iconsMap["linux"], (gltf) => {
				gltf.scene.scale.set(0.04, 0.04, 0.04)
				iconRefs[1].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[1])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[1])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[1])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			// react icon
			loader.load(iconsMap["react"], (gltf) => {
				gltf.scene.scale.set(0.025, 0.025, 0.025)
				iconRefs[2].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[2])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[2])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[2])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			// aws icon
			loader.load(iconsMap["aws"], (gltf) => {
				gltf.scene.scale.set(0.015, 0.015, 0.015)
				iconRefs[3].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[3])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[3])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[3])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			// docker icon
			loader.load(iconsMap["docker"], (gltf) => {
				gltf.scene.scale.set(0.02, 0.02, 0.02)
				iconRefs[4].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[4])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[4])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[4])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			// git icon
			loader.load(iconsMap["git"], (gltf) => {
				gltf.scene.scale.set(0.01, 0.01, 0.01)
				iconRefs[5].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[5])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[5])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[5])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			// js icon
			loader.load(iconsMap["js"], (gltf) => {
				gltf.scene.scale.set(0.015, 0.015, 0.015)
				iconRefs[6].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[6])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[6])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[6])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			// python icon
			loader.load(iconsMap["py"], (gltf) => {
				gltf.scene.scale.set(0.0015, 0.0015, 0.0015)
				iconRefs[7].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[7])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[7])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[7])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			// postgres icon
			loader.load(iconsMap["postgres"], (gltf) => {
				gltf.scene.scale.set(0.01, 0.01, 0.01)
				iconRefs[8].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[8])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[8])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[8])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			// redis icon
			loader.load(iconsMap["redis"], (gltf) => {
				gltf.scene.scale.set(0.015, 0.015, 0.015)
				iconRefs[9].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[9])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[9])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[9])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			// ts icon
			loader.load(iconsMap["ts"], (gltf) => {
				gltf.scene.scale.set(0.015, 0.015, 0.015)
				iconRefs[10].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[10])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[10])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[10])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			// vite icon
			loader.load(iconsMap["vite"], (gltf) => {
				gltf.scene.scale.set(0.03, 0.03, 0.03)
				// @ts-ignore
				gltf.scene.children[0].children[1].material = new THREE.MeshBasicMaterial(
					{color: 0x8978FE}
				)
				iconRefs[11].current = gltf.scene

				const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[11])

				let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[11])
				let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[11])

				gltf.scene.position.set(x, y, 0)
				scene.add(gltf.scene)
			})

			render()
		})()

		scene.position.y -= 5

		const controls = new OrbitControls(camera, containerRef.current!)
		controls.enableZoom = false
		controls.update()

		const onWindowResize = () => {
			camera.aspect = window.innerWidth / (window.innerHeight)
			camera.updateProjectionMatrix()

			renderer.setSize(window.innerWidth, window.innerHeight)

			render()
		}
		window.addEventListener('resize', onWindowResize)

		// animation ->
		let animationFrameId: number
		let time: number = 0
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate)
			time += 0.01

			// move the models
			if (sakRef.current) {
				sakRef.current.rotation.y = Math.sin(time) * 0.25
				sakRef.current.rotation.x = Math.cos(time) * 0.25
			}

			for (let i = 0; i < ICON_COUNT; i++) {
				const ref = iconRefs[i]
				if (ref.current) {
					ref.current.rotation.y = Math.sin(time * RANDOM_NUMBERS[i] * 5)
					ref.current.rotation.z = Math.cos(time * RANDOM_NUMBERS[i] * 5)
				}
			}

			controls.update()
			renderer.render(scene, camera)
		}
		animate()

		// clean up ->
		return () => {
			cancelAnimationFrame(animationFrameId)
			window.removeEventListener('resize', onWindowResize)
			renderer.dispose()
			dracoLoader.dispose()
		}

	}, [])

	return (
		<div id="halo-container" ref={containerRef} className="absolute top-0"></div>
	)
}

export default Halo