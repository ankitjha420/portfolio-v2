'use client'

import React, {useEffect, useRef} from "react"
import * as THREE from "three"
import {DRACOLoader, GLTFLoader, OrbitControls} from "three-stdlib"
import {findTopLevelParent, scaleDown, scaleUp, shuffle, useAllIcons} from "@/app/utils/hooks"

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

	useEffect(() => {
		const scene = new THREE.Scene()
		scene.name = 'halo-scene'
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
		const mouse = new THREE.Vector2()
		let models: THREE.Object3D[] = [];

		useAllIcons(models, scene, iconsMap, RADIUS, ANGLE_STEP, SHUFFLE, RANDOM_NUMBERS)
			.then((models: THREE.Object3D[]) => {
				const refs = models.map(model => {
					const ref = React.createRef<THREE.Object3D>()
					ref.current = model
					return ref
				})
				iconRefs.push(...refs)
				render()
			})

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
		let currentIntersected: THREE.Object3D | null = null
		const animate = () => {
			animationFrameId = requestAnimationFrame(animate)
			time += 0.01

			// rotate all models except the first one (swiss army knife)
			if (iconRefs.length > 0) {
				for (let i = 1; i < ICON_COUNT; i++) {
					const ref = iconRefs[i]

					if (ref.current) {
						ref.current.rotation.y = Math.sin(time * RANDOM_NUMBERS[i] * 5)
						ref.current.rotation.z = Math.cos(time * RANDOM_NUMBERS[i] * 5)
					}
				}
			}

			// raycaster
			raycaster.setFromCamera(mouse, camera)
			const intersects = raycaster.intersectObjects(models)

			if (intersects.length > 0) {
				const intersect = intersects[0]
				const intersected = findTopLevelParent(intersect.object)
				if (intersected !== currentIntersected) {
					if (currentIntersected) {
						scaleDown(currentIntersected)
					}

					scaleUp(intersected)
					currentIntersected = intersected
				}
			} else if (currentIntersected) {
				scaleDown(currentIntersected)
				currentIntersected = null
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