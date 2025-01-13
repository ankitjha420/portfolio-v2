'use client'

import {useEffect, useState} from "react"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
// import Mouse from "@/app/components/Mouse"
import PointsBackground from "@/app/components/PointsBackground"
import NoiseBackground from "@/app/components/NoiseBackground"
import About from "@/app/components/About"

const Homepage = () => {
	const [isMobile, setIsMobile] = useState<boolean>(
		(): boolean => typeof window !== 'undefined' ? window.innerWidth <= 768 : false
	)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768)
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	return (
		<div id='homepage' className='relative'>
			<Navbar/>

			<section className='h-[96vh]'>
				<PointsBackground mobileDevice={isMobile}/>
				{/* Title Section */}
				<div className='title mt-32 flex flex-col relative z-[2]'>
					<h1 className='text-2xl lg:text-[4rem] mb-4 flex items-center justify-center'>
						<span>ANKIT KUMAR JHA</span>
					</h1>
					<div className='title-points text-[10px] border-white border-t-2 flex justify-between pt-3'>
						<span>2023 comp sci grad</span>
						<span>frontend developer @ DEPT</span>
						<span>mumbai</span>
					</div>
				</div>

				{/* Contents Section */}
				<div className='homepage-contents container relative z-[2]'>
					<h3>CONTENTS</h3>
					<ul className='contents-list text-[10px] mt-4'>
						<li className='border-b border-white pr-1.5 w-max mb-1.5'>about</li>
						<li className='border-b border-white pr-1.5 w-max mb-1.5'>skills & work ex</li>
						<li className='border-b border-white pr-1.5 w-max mb-1.5'>contact info & socials</li>
					</ul>
				</div>
			</section>

			<section className='h-[100vh]'>
				<NoiseBackground/>
				<About/>
			</section>

			<Footer/>
		</div>
	)
}

export default Homepage