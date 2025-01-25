import * as THREE from "three"
import {DRACOLoader, GLTFLoader} from "three-stdlib";

export const useDate = (): string => {
	const date = new Date()

	const daysOfWeek: {[key: number]: string} = {
		1: 'Sunday',
		2: 'Monday',
		3: 'Tuesday',
		4: 'Wednesday',
		5: 'Thursday',
		6: 'Friday',
		7: 'Saturday',
	}
	const monthsOfYear: {[key: number]: string} = {
		1: 'January',
		2: 'February',
		3: 'March',
		4: 'April',
		5: 'May',
		6: 'June',
		7: 'July',
		8: 'August',
		9: 'September',
		10: 'October',
		11: 'November',
		12: 'December',
	}

	return `${daysOfWeek[date.getDay() + 1]} ${date.getDate()} ${monthsOfYear[date.getMonth() + 1]}
	${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
}

export const shuffle = (array: number[]) => {
	let currentIndex = array.length

	while (currentIndex != 0) {
		let randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
	}
}

interface IconPosition {
	x: number
	y: number
}

export const useAddIcons = (
	name: string,
	path: string,
	scale: number,
	position: IconPosition,
	scene: THREE.Scene,
	modelsArray: THREE.Object3D[],
	color?: number
): Promise<THREE.Object3D> => {
	return new Promise((resolve, reject) => {
		const dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
		const loader = new GLTFLoader()
		loader.setDRACOLoader(dracoLoader)
		loader.setPath('models/')

		loader.load(
			path,
			(gltf) => {
				gltf.scene.scale.set(scale, scale, scale)
				gltf.scene.position.set(position.x, position.y, 0)
				gltf.scene.name = name

				if (color) {
					// @ts-ignore
					gltf.scene.children[0].children[1].material = new THREE.MeshBasicMaterial(
						{color: color}
					)
				}

				const boxHelper = new THREE.BoxHelper(gltf.scene, 0xff0000)
				scene.add(boxHelper)

				modelsArray.push(gltf.scene)
				scene.add(gltf.scene)

				resolve(gltf.scene)
			},
			undefined,
			(error) => reject(error)
		)
	})
}

export const useAllIcons = async (
	models: THREE.Object3D[],
	scene: THREE.Scene,
	iconsMap: { [key: string]: string },
	RADIUS: number,
	ANGLE_STEP: number,
	SHUFFLE: number[],
	RANDOM_NUMBERS: number[],
): Promise<THREE.Object3D[]> => {
	const modelsArray: THREE.Object3D[] = []
	// swiss army knife model
	modelsArray.push(await useAddIcons('sak', 'sak.gltf', 0.6, {x: 0, y: -4}, scene, models))

	// go icon
	modelsArray.push(await useAddIcons('go',
		iconsMap['go'],
		0.015,
		{
			x: RADIUS + (RADIUS * RANDOM_NUMBERS[0]) * Math.cos(ANGLE_STEP * SHUFFLE[0]),
			y: RADIUS + (RADIUS * RANDOM_NUMBERS[0]) * Math.sin(ANGLE_STEP * SHUFFLE[0])
		},
		scene,
		models
	))

	// linux icon
	modelsArray.push(await useAddIcons('linux',
		iconsMap['linux'],
		0.04,
		{
			x: (RADIUS + (RADIUS * RANDOM_NUMBERS[1])) * Math.cos(ANGLE_STEP * SHUFFLE[1]),
			y: (RADIUS + (RADIUS * RANDOM_NUMBERS[1])) * Math.sin(ANGLE_STEP * SHUFFLE[1]),
		},
		scene,
		models
	))

	// react icon
	modelsArray.push(await useAddIcons('react',
		iconsMap['react'],
		0.025,
		{
			x: (RADIUS + (RADIUS * RANDOM_NUMBERS[2])) * Math.cos(ANGLE_STEP * SHUFFLE[2]),
			y: (RADIUS + (RADIUS * RANDOM_NUMBERS[2])) * Math.sin(ANGLE_STEP * SHUFFLE[2]),
		},
		scene,
		models
	))

	// aws icon
	modelsArray.push(await useAddIcons('aws',
		iconsMap['aws'],
		0.015,
		{
			x: (RADIUS + (RADIUS * RANDOM_NUMBERS[3])) * Math.cos(ANGLE_STEP * SHUFFLE[3]),
			y: (RADIUS + (RADIUS * RANDOM_NUMBERS[3])) * Math.sin(ANGLE_STEP * SHUFFLE[3]),
		},
		scene,
		models
	))

	// docker icon
	modelsArray.push(await useAddIcons('docker',
		iconsMap['docker'],
		0.02,
		{
			x: (RADIUS + (RADIUS * RANDOM_NUMBERS[4])) * Math.cos(ANGLE_STEP * SHUFFLE[4]),
			y: (RADIUS + (RADIUS * RANDOM_NUMBERS[4])) * Math.sin(ANGLE_STEP * SHUFFLE[4]),
		},
		scene,
		models
	))

	// git icon
	modelsArray.push(await useAddIcons('git',
		iconsMap['git'],
		0.01,
		{
			x: (RADIUS + (RADIUS * RANDOM_NUMBERS[5])) * Math.cos(ANGLE_STEP * SHUFFLE[5]),
			y: (RADIUS + (RADIUS * RANDOM_NUMBERS[5])) * Math.sin(ANGLE_STEP * SHUFFLE[5]),
		},
		scene,
		models
	))

	// js icon
	modelsArray.push(await useAddIcons('js',
		iconsMap['js'],
		0.015,
		{
			x: (RADIUS + (RADIUS * RANDOM_NUMBERS[6])) * Math.cos(ANGLE_STEP * SHUFFLE[6]),
			y: (RADIUS + (RADIUS * RANDOM_NUMBERS[6])) * Math.sin(ANGLE_STEP * SHUFFLE[6]),
		},
		scene,
		models
	))

	// python icon
	modelsArray.push(await useAddIcons('py',
		iconsMap['py'],
		0.0015,
		{
			x: (RADIUS + (RADIUS * RANDOM_NUMBERS[7])) * Math.cos(ANGLE_STEP * SHUFFLE[7]),
			y: (RADIUS + (RADIUS * RANDOM_NUMBERS[7])) * Math.sin(ANGLE_STEP * SHUFFLE[7]),
		},
		scene,
		models
	))

	// postgres icon
	modelsArray.push(await useAddIcons('postgres',
		iconsMap['postgres'],
		0.01,
		{
			x: (RADIUS + (RADIUS * RANDOM_NUMBERS[8])) * Math.cos(ANGLE_STEP * SHUFFLE[8]),
			y: (RADIUS + (RADIUS * RANDOM_NUMBERS[8])) * Math.sin(ANGLE_STEP * SHUFFLE[8]),
		},
		scene,
		models
	))

	// redis icon
	modelsArray.push(await useAddIcons('redis',
		iconsMap['redis'],
		0.015,
		{
			x: (RADIUS + (RADIUS * RANDOM_NUMBERS[9])) * Math.cos(ANGLE_STEP * SHUFFLE[9]),
			y: (RADIUS + (RADIUS * RANDOM_NUMBERS[9])) * Math.sin(ANGLE_STEP * SHUFFLE[9]),
		},
		scene,
		models
	))

	// ts icon
	modelsArray.push(await useAddIcons('ts',
		iconsMap['ts'],
		0.015,
		{
			x: (RADIUS + (RADIUS * RANDOM_NUMBERS[10])) * Math.cos(ANGLE_STEP * SHUFFLE[10]),
			y: (RADIUS + (RADIUS * RANDOM_NUMBERS[10])) * Math.sin(ANGLE_STEP * SHUFFLE[10]),
		},
		scene,
		models
	))

	// vite icon
	modelsArray.push(await useAddIcons('vite',
		iconsMap['vite'],
		0.03,
		{
			x: (RADIUS + (RADIUS * RANDOM_NUMBERS[11])) * Math.cos(ANGLE_STEP * SHUFFLE[11]),
			y: (RADIUS + (RADIUS * RANDOM_NUMBERS[11])) * Math.sin(ANGLE_STEP * SHUFFLE[11]),
		},
		scene,
		models,
		0x8978FE
	))

	return modelsArray
}