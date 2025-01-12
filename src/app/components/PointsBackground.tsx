import {useEffect, useRef} from "react"
import * as THREE from "three"

interface PointsBackgroundProps {
	mobileDevice: boolean
}

const PointsBackground = ({mobileDevice}: PointsBackgroundProps) => {
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

		const renderer = new THREE.WebGLRenderer()
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setClearColor(0xd6d6d6, 0)
		renderer.autoClear = false
		containerRef.current?.appendChild(renderer.domElement)

		// Render Targets for Ping-Pong Buffering
		const renderTargetParams = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			type: THREE.FloatType
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
			vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
			fragmentShader: `
            uniform sampler2D trailTexture;
            uniform float fade;
            varying vec2 vUv;

            void main() {
                vec4 texel = texture2D(trailTexture, vUv);
                gl_FragColor = vec4(texel.rgb * fade, texel.a * fade);
            }
        `
		})
		const fadePlane = new THREE.Mesh(
			new THREE.PlaneGeometry(2, 2),
			fadeMaterial
		)
		fadeScene.add(fadePlane)

		// Particle System
		const NUM_PARTICLES = mobileDevice ? 200 : 2000
		const NOISE_SCALE = 0.003
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

		camera.position.z = 100

		// animation Loop
		let animationFrameId: number
		function animate() {
			animationFrameId = requestAnimationFrame(animate)
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

			// Step 1: Apply fading to previous frame
			fadeMaterial.uniforms.trailTexture.value = previousRenderTarget.texture
			renderer.setRenderTarget(currentRenderTarget)
			renderer.clear()
			renderer.render(fadeScene, fadeCamera)

			// Step 2: Draw points on top
			renderer.render(scene, camera)

			// Step 3: Render to screen
			renderer.setRenderTarget(null)
			renderer.render(fadeScene, fadeCamera);

			// Swap buffers
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

		// clean up use effect
		return () => {
			// Cancel animation frame
			cancelAnimationFrame(animationFrameId)

			// Remove event listeners
			document.removeEventListener('mousemove', onMouseMove)
			window.removeEventListener(onWindowResize)

			pointCloud.geometry.dispose()
			fadeMaterial.dispose()
			renderer.dispose()
			renderTarget1.dispose()
			renderTarget2.dispose()
		}
	}, [])

	return (
		<div id='points-background' ref={containerRef} className='absolute top-0'></div>
	)
}

export default PointsBackground