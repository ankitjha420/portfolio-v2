import {useDate} from '../utils/hooks'

const Navbar = () => {

	return (
		<div
			id='navbar'
			className='flex items-center h-10'>

			<div className='navbar-music pl-1.5 w-10 flex items-center justify-center h-full border-r-[3px] border-white'>
				<svg width="32px" height="32px"
					 viewBox="0 0 512 512" version="1.1"
					 xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
					<g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><title>sound-quiet</title><g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="icon" fill="#fff" transform="translate(42.666667, 85.333333)"><path d="M276.914133,274.101547 L243.589973,247.442773 C283.38304,204.875093 283.38432,138.998827 243.588693,96.4311467 L276.912853,69.77216 C329.118507,127.992107 329.118507,215.880107 276.914133,274.101547 Z M191.749973,1.42108547e-14 L80.8957867,87.2292267 L7.10542736e-15,87.2292267 L7.10542736e-15,257.895893 L81.0208,257.895893 L191.749973,343.35424 L191.749973,1.42108547e-14 L191.749973,1.42108547e-14 Z M42.6666667,129.895893 L95.6874667,129.895893 L149.083307,87.8749867 L149.083307,256.520747 L95.5624533,215.229227 L42.6666667,215.229227 L42.6666667,129.895893 Z" id="Shape"></path></g></g></g>
				</svg>
			</div>

			<div className='navbar-date text-xs h-10 flex-grow border-r-[3px] border-white flex items-center justify-center'>
				<span>{useDate()}</span>
			</div>

			<div className='navbar-menu w-10 flex justify-center'>
				<svg width="21" height="12" viewBox="0 0 21 12" fill="none" xmlns="http://www.w3.org/2000/svg">
					<line y1="1.5" x2="21" y2="1.5" stroke="white" strokeWidth="3"/>
					<line y1="10.5" x2="21" y2="10.5" stroke="white" strokeWidth="3"/>
				</svg>
			</div>
		</div>
	)
}

export default Navbar