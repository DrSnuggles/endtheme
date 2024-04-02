/*
	DrSnuggles ℗©®™
	Revision MMXXIV

	Credits:
	The Horse In Motion was shot by photographer Eadweard Muybridge
	endtheme was composed by Karsten Obarski
	chiptune3 is a worklet based player using libopenmpt
	endtheme remix by my wife Gnu, visualizer is inspired by ffmpeg

	Dedicated to one of us
*/

import { preloadFonts } from './preloadFonts.js'
import {ChiptuneJsPlayer} from '/chiptune/chiptune3.min.js'	// 0.8.0 branch
import {Visualizer} from '/visualizer/visualizer.min.js'

// let aud		DEBUG
let ctx = new AudioContext(),
node, viz

preloadFonts()

//
// Part 0 Prepare
//
function part0() {
	if (ctx.state !== 'running') {
		// stupid no audio till user interaction policy thingy
		document.body.innerHTML = '<style>#audioModal{width:100vw;height:100vh;font-size:18vw;line-height:100vh;}</style><main id="audioModal">👉💻👂🎶</main>'
		function resume() {
			ctx.resume()
			part1()
		}
		audioModal.addEventListener('keydown', resume)
		audioModal.addEventListener('click', resume)
		audioModal.addEventListener('touchend', resume)
	} else {
		part1()
	}

	// ESC
	onkeydown = (ev) => {
		if (ev.key == 'Escape')
			close()	
	}
}

//
// Part 1 Intro
//
function part1() {
	document.body.innerHTML = `<style>
	#intro{
		position:relative;
		width:100vw;
		height:100vh;
		animation:move 2s ease-in-out 0s 1 normal forwards;
		will-change:transform
	}
	@keyframes move{
		0%{transform:translateX(-30vw)}
		100%{transform:translateX(37vw)}
	}
	#Revision{
		width:25vw;
		position:absolute;
		top:50%;
		color:#FFF;
		font:4vw Syncopate;
		text-align:center;
		border:5px solid #FFF;
		border-radius:10px;
		animation:zoom 1.5s linear 2s 1 normal forwards,end .5s linear 4s normal forwards;
		will-change:transform;
		white-space:nowrap;
	}
	@keyframes zoom{
		0%{transform:scale(1.00,1.00)}
		100%{transform:scale(1.03,1.03)}
	}
	@keyframes end{
		0%{transform:scale(1.03,1.03);filter:blur(0);opacity:1}
		100%{transform:scale(100.00,100.00);filter:blur(100px);opacity:0}
	}
	#HiM{
		background-color:white;
		width:10vw;
		position:absolute;
		top:calc(50% - 1vw);
		animation:move2 .75s ease-in-out 2s 1 normal forwards,rainbowAnim 140s linear infinite;
		will-change:transform;transform:translateX(28vw)
	}
	@keyframes move2{
		0%{transform:translateX(28vw)}
		100%{transform:translateX(65vw)}
	}
	.rainbow{
		background-image:linear-gradient(to right,red,orange,yellow,green,blue,indigo,violet,red);
		animation:rainbowAnim 35s linear infinite
	}
	@keyframes rainbowAnim{
		to{background-position:4500vh}
	}
	</style>
	<main id="intro">
		<span id="Revision">Revision</span>
		<img id="HiM" src="./gfx/HQ_mask.gif" class="rainbow"/>
	</main>`
	function checkCSSEnded() {
		if (Revision.getBoundingClientRect().height < 3300) {
			setTimeout(()=>{ checkCSSEnded() }, 100)
			return
		}
		part2()
	}
	checkCSSEnded()
}

//
// Part 2 chiptune3
//
function part2() {
	document.body.innerHTML = `<style>
	#sCont{position:relative;height:100vh}
	#s1 {position:absolute;top:5%;transform:translateX(-100vw);width:100vw;text-align:center;will-change:transform;animation:move1 2s ease-in-out 0s 1 normal forwards,move1b 2s ease-in-out 3s 1 normal forwards;}
	#s2 {position:absolute;top:45%;transform:translateX(100vw);width:100vw;text-align:center;will-change:transform;animation:move2 2s ease-in-out 3s 1 normal forwards,move2b 2s ease-in-out 6s 1 normal forwards;}
	#s3 {position:absolute;top:90%;transform:translateX(-100vw);width:100vw;text-align:center;will-change:transform;animation:move3 2s ease-in-out 6s 1 normal forwards,move3b 2s ease-in-out 9s 1 normal forwards;}
	#s4 {position:absolute;top:45%;transform:translateX(100vw);width:100vw;text-align:center;will-change:transform;animation:move4 1s ease-in-out 27s 1 normal forwards,move4b 1s ease-in-out 28s 1 normal forwards;}
	#s5 {position:absolute;top:80%;white-space:nowrap;transform:translateX(100vw);will-change:transform;animation:move5 60s linear 0s 1 normal forwards;}
	@keyframes move1{
		0%{transform:translateX(-100vw)}
		100%{transform:translateX(0vw)}
	}
	@keyframes move1b{
		0%{transform:translateX(0vw)}
		100%{transform:translateX(100vw)}
	}

	@keyframes move2{
		0%{transform:translateX(100vw)}
		100%{transform:translateX(0vw)}
	}
	@keyframes move2b{
		0%{transform:translateX(0vw)}
		100%{transform:translateX(-100vw)}
	}

	@keyframes move3{
		0%{transform:translateX(-100vw)}
		100%{transform:translateX(0vw)}
	}
	@keyframes move3b{
		0%{transform:translateX(0vw)}
		100%{transform:translateX(100vw)}
	}

	@keyframes move4{
		0%{transform:translateX(100vw)}
		100%{transform:translateX(0vw)}
	}
	@keyframes move4b{
		0%{transform:translateY(0vh)}
		100%{transform:translateY(100vh)}
	}

	@keyframes move5{
		0%{transform:translateX(100vw)}
		100%{transform:translateX(-100%)}
	}

</style><canvas id="vizCanv"></canvas><canvas id="pianoCanv"></canvas><canvas id="scrollCanv"></canvas><div id="sCont">
<div id="s1">Hello  Revision</div>
<div id="s2">"Endtheme"  by  Karsten  Obarski</div>
<div id="s3">Played  back  using  chiptune  3</div>
<div id="s4">Party  time  !</div>
</div>`
	pianoCanv.width = screen.width // 16*1024 // screen.width	// 24576	// aha a new issue max transferable width
	pianoCanv.height = screen.height
	const canvasWorker = new Worker(new URL('./notes.worker.js', import.meta.url), {type: 'module'})
	const offscreen = pianoCanv.transferControlToOffscreen()
	canvasWorker.postMessage({ canvas: offscreen, devicePixelRatio: devicePixelRatio }, [offscreen])
	let pitch = 1.0

	const chiptune = new ChiptuneJsPlayer()
	//console.log(chiptune)
	chiptune.onInitialized(() => {
		chiptune.load('./sfx/endtheme.mod')
	})
	chiptune.onMetadata((o) => {
		canvasWorker.postMessage(o)
	})
	chiptune.onProgress((o) => {
		canvasWorker.postMessage(o)
		const fPos = o.pos / chiptune.duration
		if (fPos > .6) {
			pitch -= .005
			chiptune.setPitch(pitch)
		}
		if (pitch < 0.05) {
			chiptune.stop()
			part3()
		}
	})
}

//
// Part 3 Remix & Visualizer
//
let raf
function part3() {
	if (typeof pianoCanv == 'undefined') return
	document.body.removeChild(pianoCanv)
	sCont.removeChild(s1)
	sCont.removeChild(s2)
	sCont.removeChild(s3)
	sCont.removeChild(s4)
	const aud = new Audio()
	aud.src = './sfx/03_Kandidat_1_endtheme.flac'
	aud.loop = true
	aud.oncanplay = () => { aud.play() }
	viz = new Visualizer(aud, vizCanv)

	// and endless, todo
	sCont.innerHTML += '<div id="s5">And now the same song again... Remixed by Gnu... &nbsp; &nbsp;  &nbsp; &nbsp; The FFMpeg style visualizer even runs on my old party laptop or a PI 400. &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; But this demo ends now and it\'s time to say goodbye. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Goodbye to a person i don\'t even know. &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Goodbye m0d.</div>' 
	
	// hop to the beat
	let y = 80
	setInterval(()=>{
		y = (y == 80) ? 85 : 80
		s5.style.top = y +'%'
	},500)

	// fade out (song=96s)
	aud.preservesPitch = false
	let timerStarted = false
	aud.ontimeupdate = (e) => {
		if (aud.playbackRate <= 0.07) {
			if (!timerStarted) {
				timerStarted = setTimeout(()=>{
					//aud.volume = 0
					//aud.pause()
					//part4()
					// fade down first
					aud.ontimeupdate = fadeDown
				}, 15000)	// todo: maybe longer than 15s
			}
			return
		}
		if (aud.currentTime <= 0.6*aud.duration) return
		aud.playbackRate -= 0.01
	}
	function fadeDown() {
		if (aud.volume <= 0.01) {
			aud.volume = 0
			aud.pause()
			setTimeout(()=>{document.body.innerHTML=''},5000)
			return
		}
		aud.volume -= 0.01
	}
}

//
// Main
//
part0()
