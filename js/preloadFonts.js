export function preloadFonts() {
	// https://stackoverflow.com/questions/53808106/chrome-offscreencanvas-custom-fonts
	const fontFace = new FontFace(
		'Syncopate',
		"local('Syncopate'), url(css/pe0sMIuPIYBCpEV5eFdCBfe_.woff2) format('woff2')"
	)
	// add it to the list of fonts our worker supports
	if (self.fonts) {
		self.fonts.add(fontFace)
		//console.log('fonts added to self')
	} else {
		document.fonts.add(fontFace)
		//console.log('fonts added to document')
	}

	// load the font
	fontFace.load()
}