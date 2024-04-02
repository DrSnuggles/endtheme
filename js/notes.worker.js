/*
	Worker for OffscreenCanvas
*/

let ctx, w, h, offscreen, dur, totalLength, pos

onmessage = function(e) {
	// most used on top
	if (e.data.pos) {
		//	(pos/dur*totalLength = absPos) * noteWidth - startOffset(mid screen)
		pos = e.data.pos / dur * totalLength * 64.0 - w*5/8
		return
	}

	// 1st init = transfer of offscreen canvas
	if (e.data.canvas) {
		const canv = e.data.canvas 
		ctx = canv.getContext('2d', {alpha: false, desynchronized: true, willReadFrequently: false})
		w = canv.width
		h = canv.height
		return
	}

	// 2nd init = received song data
	if (e.data.song) {
		dur = e.data.dur
		drawPiano(e.data.song)
		requestAnimationFrame(renderLoop)
		return
	}

	// still here ?
	console.error('Unknown message:', e.data)
}

function renderLoop(delta) {
	ctx.clearRect(0,0,w,h)
	ctx.drawImage(offscreen, pos, 0, w, h, 0, 0, w, h)
/*
	ctx.lineWidth = 2
	ctx.setLineDash([5,5])
	ctx.strokeStyle = "#404040"
	ctx.moveTo(w/2, 0)
	ctx.lineTo(w/2, h)
	ctx.stroke()
	*/
	requestAnimationFrame(renderLoop)
}

function drawPiano(song) {
	const channels = song.channels
	const orders = song.orders
	const patterns = song.patterns
	const channelHeight = h/channels.length
	const notesPerChannel = 25
	const noteHeight = channelHeight/notesPerChannel
	const noteWidth = 64

	// get total length of first channel
	totalLength = 0
	for (let o = 0; o < orders.length; o++) {
		totalLength += patterns[orders[o].pat].rows.length
	}

	offscreen = new OffscreenCanvas(totalLength*noteWidth, h)	// why at all? because max transferable screen width :) lol i found
	const octx = offscreen.getContext('2d', {alpha: false, desynchronized: true, willReadFrequently: true})

	let actIdx = 0
	for (let o = 0; o < orders.length; o++) {
		const aRows = patterns[orders[o].pat].rows
		for (let r = 0; r < aRows.length; r++) {
			for (let v = 0; v < channels.length; v++) {
				const oct = Math.floor( (aRows[r][v][0]-1) / 12.0)
				let note = (aRows[r][v][0]-1) % 12
				if (note < 0 || oct < 0) continue
				//console.log(note, oct)
				note = notesPerChannel - (note + (oct-4)*12) -1
				//console.log(note)
				octx.fillStyle = 'indigo'
				if (v == 1) octx.fillStyle = 'lime'
				if (v == 2) octx.fillStyle = 'red'
				if (v == 3) {
					// looped string
					// clear on new note
					octx.fillStyle = 'black'
					octx.fillRect(actIdx*noteWidth, v*channelHeight+10, 4096, channelHeight)
					// draw long enough till next note
					octx.fillStyle = 'blue'
					octx.fillRect(actIdx*noteWidth, v*channelHeight+10 + note*noteHeight, 4096, noteHeight)
				} else {
					// normal note
					octx.fillRect(actIdx*noteWidth, v*channelHeight+10 + note*noteHeight, noteWidth, noteHeight)
				}
			}
			actIdx++ 
		}
	}
}
