steal.config({
	root: steal.config('root').join('../'),
	map: {
		"*": {
			"jquery/jquery.js" : "jquery"
		}
	},
	paths: {
		"jquery": "bower_components/jquery/jquery.js"
	},
	shim : {
		jquery: {
			exports: "jQuery"
		}
	},
	ext: {
		js: "js",
		css: "css",
		less: "lib/steal/less/less.js"
	}
})
