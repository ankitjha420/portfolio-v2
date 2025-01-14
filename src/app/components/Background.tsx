import * as THREE from "three"
import {useEffect, useRef} from "react"
import noiseShader from "@/app/shaders/noise.glsl"
import noiseVertexShader from "@/app/shaders/noiseVertex.glsl"
import pointsShader from "@/app/shaders/points.glsl"
import pointsVertexShader from "@/app/shaders/pointsVertex.glsl"

interface BackgroundProps {
	mobileDevice: boolean
}

const Background = ({mobileDevice}: BackgroundProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const scene = new THREE.Scene()
		const camera = new THREE.OrthographicCamera(
			window.innerWidth / -2,
			window.innerWidth / 2,
			window.innerHeight / 2,
			window.innerHeight / -2,
			1,
			1000
		)

		camera.position.z = 1000
		camera.lookAt(0, 0, 0)

		// renderer
		const renderer = new THREE.WebGLRenderer()
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setClearColor(0xd6d6d6, 0)
		renderer.autoClear = false
		containerRef.current?.appendChild(renderer.domElement)

		const planeGeometry = new THREE.PlaneGeometry(
			window.innerWidth, window.innerHeight
		)
		const planeMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
				uTime: { value: 0.0 }
			},
			vertexShader: noiseVertexShader,
			fragmentShader: noiseShader
		})

		const plane: THREE.Mesh = new THREE.Mesh(
			planeGeometry,
			planeMaterial
		)
		scene.add(plane)

		// particle simulation ->
		const gl = renderer.getContext()
		const isFloatAvailable = gl.getExtension('OES_texture_float');
		const isFloatBlendAvailable = gl.getExtension('EXT_float_blend');

		const renderTargetParams = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			type: isFloatAvailable ? THREE.FloatType : THREE.UnsignedByteType
		}
		let renderTarget1 = new THREE.WebGLRenderTarget(
			window.innerWidth,
			window.innerHeight,
			renderTargetParams
		)
		let renderTarget2 = new THREE.WebGLRenderTarget(
			window.innerWidth,
			window.innerHeight,
			renderTargetParams
		)
		let currentRenderTarget = renderTarget1
		let previousRenderTarget = renderTarget2

		// Fading Shader (Trail Effect)
		const fadeScene = new THREE.Scene()
		const fadeCamera = new THREE.OrthographicCamera(
			-1,
			1,
			1,
			-1,
			0,
			1
		)
		const fadeMaterial = new THREE.ShaderMaterial({
			uniforms: {
				trailTexture: { value: null },
				fade: { value: 0.6 }
			},
			vertexShader: pointsVertexShader,
			fragmentShader: pointsShader
		})
		const fadePlane = new THREE.Mesh(
			new THREE.PlaneGeometry(2, 2),
			fadeMaterial
		)
		fadeScene.add(fadePlane)

		// particle system mathematics
		const NUM_PARTICLES = mobileDevice ? 500 : 2000
		const NOISE_SCALE = 0.001
		const REPEL_RADIUS = 100
		const REPEL_STRENGTH = 5
		const points: any[] = []
		let time = 0
		let mouse = new THREE.Vector2(10000, 10000)

		function noise (x: number, y: number, z: number) {
			return (Math.sin(x * 1.5 + z) * Math.cos(y * 1.5 + z) + 1) / 2
		}

		const geometry = new THREE.BufferGeometry()
		const positions = new Float32Array(NUM_PARTICLES * 3)
		const alphas = new Float32Array(NUM_PARTICLES)

		for (let i = 0; i < NUM_PARTICLES; i++) {
			positions[i * 3] = Math.random() * window.innerWidth - window.innerWidth / 2
			positions[i * 3 + 1] = Math.random() * window.innerHeight - window.innerHeight / 2
			positions[i * 3 + 2] = 0
			alphas[i] = Math.random()
			points.push({
				x: positions[i * 3],
				y: positions[i * 3 + 1]
			})
		}

		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
		geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1))

		const material = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 2,
			transparent: true,
			opacity: 1,
			depthWrite: false
		})

		const pointCloud = new THREE.Points(geometry, material)
		scene.add(pointCloud)

		// animation
		let animationFrameId: number
		const animate = (): void => {
			animationFrameId = requestAnimationFrame(animate)

			// update particles
			time += 0.001
			const positions = pointCloud.geometry.attributes.position.array

			for (let i = 0; i < points.length; i++) {
				const p = points[i]
				const n = noise(p.x * NOISE_SCALE, p.y * NOISE_SCALE, time)
				const angle = Math.PI * 2 * n

				p.x += Math.cos(angle)
				p.y += Math.sin(angle)

				const dx = p.x - mouse.x
				const dy = p.y - mouse.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < REPEL_RADIUS) {
					const force = (1 - distance / REPEL_RADIUS) * REPEL_STRENGTH
					p.x += (dx / distance) * force
					p.y += (dy / distance) * force
				}

				if (p.x < -window.innerWidth / 2 || p.x > window.innerWidth / 2 ||
					p.y < -window.innerHeight / 2 || p.y > window.innerHeight / 2) {
					p.x = Math.random() * window.innerWidth - window.innerWidth / 2
					p.y = Math.random() * window.innerHeight - window.innerHeight / 2
				}

				positions[i * 3] = p.x
				positions[i * 3 + 1] = p.y
				positions[i * 3 + 2] = 0
			}

			pointCloud.geometry.attributes.position.needsUpdate = true

			planeMaterial.uniforms.uTime.value += 0.01

			// particle trail effect
			renderer.setRenderTarget(currentRenderTarget)
			renderer.clear()
			renderer.render(scene, camera)  // render main scene

			// fade effect
			renderer.setRenderTarget(null)
			renderer.clear()

			fadeMaterial.uniforms.trailTexture.value = previousRenderTarget.texture
			renderer.render(fadeScene, fadeCamera);

			// swap render targets
			[currentRenderTarget, previousRenderTarget] = [previousRenderTarget, currentRenderTarget]
		}
		animate()

		// mouse & touch Interaction
		function onMouseMove(event: MouseEvent): void {
			mouse.x = event.clientX - window.innerWidth / 2
			mouse.y = -(event.clientY - window.innerHeight / 2)
		}

		document.addEventListener('mousemove', onMouseMove)

		// resizing
		function onWindowResize() {
			const width = window.innerWidth
			const height = window.innerHeight

			scene.children[0].scale.set(width, height, 1)

			camera.left = width / -2
			camera.right = width / 2
			camera.top = height / 2
			camera.bottom = height / -2
			camera.updateProjectionMatrix()

			renderer.setSize(width, height)
			renderTarget1.setSize(width, height)
			renderTarget2.setSize(width, height)
		}
		window.addEventListener('resize', onWindowResize)

		// clean up everything
		return () => {
			cancelAnimationFrame(animationFrameId)

			document.removeEventListener('mousemove', onMouseMove)
			window.removeEventListener('resize', onWindowResize)

			pointCloud.geometry.dispose()
			fadeMaterial.dispose()
			renderTarget1.dispose()
			renderTarget2.dispose()
			plane.geometry.dispose()
			planeMaterial.dispose()
			renderer.dispose()
		}
	}, [])

	return (
		<div id="three-background" ref={containerRef} className="fixed top-0"></div>
	)
}

export default Background