'use client'

import React, {useEffect, useRef} from "react"
import * as THREE from "three"
import gsap from "gsap"
import {GLTFLoader, DRACOLoader, OrbitControls} from "three-stdlib"
import {addIcons, shuffle} from "@/app/utils/hooks"

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

		// mouse move raycaster
		const raycaster = new THREE.Raycaster()
		const mouse = new THREE.Vector2();
		let models: THREE.Object3D[] = [];

		(function () {
			// swiss army knife model
			addIcons('sak', 'sak.gltf', 0.6, {x: 0, y: -4}, scene, models)

			// go icon
			addIcons('go',
				iconsMap['go'],
				0.015,
				{
					x: RADIUS + (RADIUS * RANDOM_NUMBERS[0]) * Math.cos(ANGLE_STEP * SHUFFLE[0]),
					y: RADIUS + (RADIUS * RANDOM_NUMBERS[0]) * Math.sin(ANGLE_STEP * SHUFFLE[0])
				},
				scene,
				models
			)

			// linux icon
			addIcons('linux',
				iconsMap['linux'],
				0.04,
				{
					x: (RADIUS + (RADIUS * RANDOM_NUMBERS[1])) * Math.cos(ANGLE_STEP * SHUFFLE[1]),
					y: (RADIUS + (RADIUS * RANDOM_NUMBERS[1])) * Math.sin(ANGLE_STEP * SHUFFLE[1]),
				},
				scene,
				models
			)

			// react icon
			addIcons('react',
				iconsMap['react'],
				0.025,
				{
					x: (RADIUS + (RADIUS * RANDOM_NUMBERS[2])) * Math.cos(ANGLE_STEP * SHUFFLE[2]),
					y: (RADIUS + (RADIUS * RANDOM_NUMBERS[2])) * Math.sin(ANGLE_STEP * SHUFFLE[2]),
				},
				scene,
				models
			)

			// aws icon
			addIcons('aws',
				iconsMap['aws'],
				0.015,
				{
					x: (RADIUS + (RADIUS * RANDOM_NUMBERS[3])) * Math.cos(ANGLE_STEP * SHUFFLE[3]),
					y: (RADIUS + (RADIUS * RANDOM_NUMBERS[3])) * Math.sin(ANGLE_STEP * SHUFFLE[3]),
				},
				scene,
				models
			)

			// docker icon
			addIcons('docker',
				iconsMap['docker'],
				0.02,
				{
					x: (RADIUS + (RADIUS * RANDOM_NUMBERS[4])) * Math.cos(ANGLE_STEP * SHUFFLE[4]),
					y: (RADIUS + (RADIUS * RANDOM_NUMBERS[4])) * Math.sin(ANGLE_STEP * SHUFFLE[4]),
				},
				scene,
				models
			)

			// git icon
			addIcons('git',
				iconsMap['git'],
				0.01,
				{
					x: (RADIUS + (RADIUS * RANDOM_NUMBERS[5])) * Math.cos(ANGLE_STEP * SHUFFLE[5]),
					y: (RADIUS + (RADIUS * RANDOM_NUMBERS[5])) * Math.sin(ANGLE_STEP * SHUFFLE[5]),
				},
				scene,
				models
			)

			// js icon
			addIcons('js',
				iconsMap['js'],
				0.015,
				{
					x: (RADIUS + (RADIUS * RANDOM_NUMBERS[6])) * Math.cos(ANGLE_STEP * SHUFFLE[6]),
					y: (RADIUS + (RADIUS * RANDOM_NUMBERS[6])) * Math.sin(ANGLE_STEP * SHUFFLE[6]),
				},
				scene,
				models
			)

			// python icon
			addIcons('py',
				iconsMap['py'],
				0.0015,
				{
					x: (RADIUS + (RADIUS * RANDOM_NUMBERS[7])) * Math.cos(ANGLE_STEP * SHUFFLE[7]),
					y: (RADIUS + (RADIUS * RANDOM_NUMBERS[7])) * Math.sin(ANGLE_STEP * SHUFFLE[7]),
				},
				scene,
				models
			)

			// postgres icon
			addIcons('postgres',
				iconsMap['postgres'],
				0.01,
				{
					x: (RADIUS + (RADIUS * RANDOM_NUMBERS[8])) * Math.cos(ANGLE_STEP * SHUFFLE[8]),
					y: (RADIUS + (RADIUS * RANDOM_NUMBERS[8])) * Math.sin(ANGLE_STEP * SHUFFLE[8]),
				},
				scene,
				models
			)

			// redis icon
			addIcons('redis',
				iconsMap['redis'],
				0.015,
				{
					x: (RADIUS + (RADIUS * RANDOM_NUMBERS[9])) * Math.cos(ANGLE_STEP * SHUFFLE[9]),
					y: (RADIUS + (RADIUS * RANDOM_NUMBERS[9])) * Math.sin(ANGLE_STEP * SHUFFLE[9]),
				},
				scene,
				models
			)

			// ts icon
			addIcons('ts',
				iconsMap['ts'],
				0.015,
				{
					x: (RADIUS + (RADIUS * RANDOM_NUMBERS[10])) * Math.cos(ANGLE_STEP * SHUFFLE[10]),
					y: (RADIUS + (RADIUS * RANDOM_NUMBERS[10])) * Math.sin(ANGLE_STEP * SHUFFLE[10]),
				},
				scene,
				models
			)

			// vite icon
			addIcons('vite',
				iconsMap['vite'],
				0.03,
				{
					x: (RADIUS + (RADIUS * RANDOM_NUMBERS[11])) * Math.cos(ANGLE_STEP * SHUFFLE[11]),
					y: (RADIUS + (RADIUS * RANDOM_NUMBERS[11])) * Math.sin(ANGLE_STEP * SHUFFLE[11]),
				},
				scene,
				models,
				0x8978FE
			)
			// loader.load(iconsMap["vite"], (gltf) => {
			// 	gltf.scene.scale.set(0.03, 0.03, 0.03)
			// 	// @ts-ignore
			// 	gltf.scene.children[0].children[1].material = new THREE.MeshBasicMaterial(
			// 		{color: 0x8978FE}
			// 	)
			// 	iconRefs[11].current = gltf.scene
			//
			// 	const radius = RADIUS + (RADIUS * RANDOM_NUMBERS[11])
			//
			// 	let x = radius * Math.cos(ANGLE_STEP * SHUFFLE[11])
			// 	let y = radius * Math.sin(ANGLE_STEP * SHUFFLE[11])
			//
			// 	gltf.scene.position.set(x, y, 0)
			//
			// 	const boxHelper = new THREE.BoxHelper(gltf.scene, 0xff0000)
			// 	scene.add(boxHelper)
			//
			// 	scene.add(gltf.scene)
			// })

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

		window.addEventListener('mousemove', (e: MouseEvent) => {
			mouse.x = (e.clientX / window.innerWidth) * 2 - 1
			mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
		})

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

			// mouse interaction with models
			raycaster.setFromCamera(mouse, camera)
			let hoveredModel: THREE.Object3D | null = null

			const intersects = raycaster.intersectObjects(
				models
			)

			if (intersects.length > 0 && intersects[0].object) {
				console.log(intersects[0].object.name)
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