import React, { useState, useEffect } from 'react'

const Mouse = () => {
	const [position, setPosition] = useState({ x: 0, y: 0 })

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setPosition({ x: e.clientX, y: e.clientY });
		}

		document.addEventListener('mousemove', handleMouseMove)

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		}
	}, [])

	const style: {[key: string]: string | number} = {
		position: 'absolute',
		top: position.y,
		left: position.x,
		width: '20px',
		height: '20px',
		backgroundColor: '#8D8D8DFF',
		borderRadius: '50%',
		pointerEvents: 'none',
		transition: 'all 0.1s ease'
	}

	return <div id="mouse-follower" style={style}></div>
};

export default Mouse
