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

export const addIcons = (
	name: string,
	path: string,
	scale: number,
	position: IconPosition,
	scene: THREE.Scene,
	modelsArray: THREE.Object3D[],
	color?: number
): void => {
	const dracoLoader = new DRACOLoader()
	dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
	const loader = new GLTFLoader()
	loader.setDRACOLoader(dracoLoader)
	loader.setPath('models/')

	loader.load(path, function (gltf) {
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
	})
}