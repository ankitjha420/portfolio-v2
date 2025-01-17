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