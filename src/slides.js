"use strict";

// Helper functions
var verticalAlign = { "position": "relative", "top": "50%", "transform": "translateY(-50%)" };

var rand_rgba = function rand_rgba() {
	return "rgba(" + [255, 255, 255].map(function (x) {
		return Math.round(Math.random() * x);
	}).join() + ", 1)";
};
var rand_angle = function rand_angle() {
	return Math.round(Math.random() * 180 - 90);
};

var random_gradient = () => {
	return 'linear-gradient(' + rand_angle().toString() + 'deg,' + rand_rgba() + ',' + rand_rgba() + ')' + ' center center fixed no-repeat'
}

var p = new Plato();
Descartes.add(p.base())
var currentSlide = 0
var lastBg = null
$("body").keydown(function(e) {
  if(e.keyCode == 37) { // left
  	if (currentSlide > 0) {
  		currentSlide--;
  		Descartes.paint()
  	}
  }
  else if(e.keyCode == 39) { // right
  	if (currentSlide < $("section").length - 1) {
	    currentSlide++;
	    Descartes.paint()
	}
  }
  if(history.pushState) {
    history.pushState(null, null, '#' + currentSlide);
  } else {
	location.hash = '#' + currentSlide;
  }
});
Descartes.add({
	"html": {
		"background": (_) => {
			if (currentSlide === 0) return random_gradient()
			var bg = JSON.parse($("section:nth-child(" + currentSlide + ")").attr("data-descartes")).background;
			return bg
		},
		"body": {
			"color": "#fff",
			"font-family": "Source Sans Pro, Helvetica",
			"font-size": 18,
			"h1": {
				"alias": "h1",
				"font-weight": 100,
				"text-shadow": "0 0 25px #666",
				"margin": 0,
				"line-height": 1,
				"font-size": () => { return p.scale(window.innerWidth, p.layout.wrappers.mobile, 3600, 72, 120) * 1.5}
				
			},
			"h2": {
				"alias": "h2",
				"font-weight": 100,
				"text-shadow": "0 0 25px #666",
				"margin": 0,
				"font-size": () => { return p.scale(window.innerWidth, p.layout.wrappers.mobile, 3600, 24, 36) * 1.5 }
				
			},
			"strong": {
				"font-weight": 600
			},
			"p": {
				"font-weight": 100,
				"text-shadow": "0 0 10px #666",
				"margin": 0,
			},
			"a": {
				"color": "#fff",
				"text-decoration": "none"
			},
			"hr": {
				"margin-bottom": 50,
				"opacity": 0.5
			},
			"pre": {
				"font-size": 16,
				"code": {
					"padding": 15
				}
			},
			"#twitter": {
				"alias": "twitter",
				"position": "fixed",
				"bottom": 25,
				"right": 25,
				"color": "#fff",
				"transition": "1.0s all ease",
				"opacity": () => { return currentSlide > 0 ? 1.0 : 0 },
				"text-decoration": "none",
				"z-index": 999
			},
			"section": {
				"alias": "section",
				"min-height": "100%",
				"background": (_) => { return $(_).index() === currentSlide ? random_gradient() : null; },
				"opacity": (_) => {
					return $(_).index() === currentSlide ? 1.0 : 0.0
				},
				"z-index": (_) => {
					return $(_).index() === currentSlide ? 100 : 0
				},
				"transition": "1.0s all ease",
				"position": "absolute",
				"top": 0,
				"left": 0,
				"width": "100%",
				"&.center": {
					"text-align": "center"
				},
				".table-row": {
					"alias": "tableRow",
					"_mixins": p.wrapper(900),
					"width": "100%",
					"min-height": function minHeight() {
						return window.innerHeight;
					},
					"> div": {
						"vertical-align": "middle"
					}
				}
			}
		}
	}
});

$(window).resize(function() {
	Descartes.alias.h1["font-size"]()
	Descartes.alias.h2["font-size"]()
	Descartes.alias.tableRow["min-height"]()
})
$("body").keyup(function(e) {
	Descartes.alias.section.background()
	Descartes.alias.section.opacity()
	Descartes.alias.section["z-index"]()
	Descartes.alias.twitter.opacity()
})
$(document).ready(function() {
	currentSlide = parseInt(window.location.hash.substr(1));
	if (currentSlide !== NaN && currentSlide > 0) {
		Descartes.alias.section.background()
		Descartes.alias.section.opacity()
		Descartes.alias.section["z-index"]()
		Descartes.alias.twitter.opacity()
		Descartes.paint()
	} else {
		currentSlide = 0
	}
})