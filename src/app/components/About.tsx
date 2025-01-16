import Halo from "@/app/components/Halo"

export default function About() {
	return (
		<div id="about-container" className="relative z-[2]">
			<div className="container">
				<h3 className="text-lg mb-4">about me</h3>
				<p className="text-xs">
					“No, Plymouth would suit me well enough,” I said, grinning at his understandable
					misperception.The air is fresher, for one. A view of the sea would suit me, but not
					too near a view. The picture unfolded itself still further. “A modest white-painted
					cottage, a little orchard, perhaps even a wife, if she tolerates my day-dreaming.
					I should call it Hilltop Cottage. There would be vines and honeysuckle, and perhaps
					some fine oaks about. I should like enough patients to balance my books, and sufficient
					that I may be of some service to the townsfolk, but not so many that they interfere with
					my writing. Does that seem unreasonable?” “I think you are better suited to the sea
					than you realise.”
				</p>
				<div className="sak-container">
					{/*<Spline*/}
					{/*	scene="https://prod.spline.design/t6z4wowk8Lu5k4o8/scene.splinecode"*/}
					{/*/>*/}
				</div>
			</div>

			<Halo/>
		</div>
	)
}