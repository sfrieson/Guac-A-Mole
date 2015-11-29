/*global $, console, alert, prompt, document, window*/
'use strict';

$(document).mousemove(function (e) {
	$('#cursor').css({
		top: e.pageY,
		left: e.pageX
	});
});