// had to do this to import glsl without ts throwing a fit
declare module '*.glsl' {
	const content: string
	export default content
}