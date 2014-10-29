/*******************/
/* MAJOR SELECTION */
/*******************/

var selectedMajor;

// Hover functions
$( "#coenMajor" ).hover(function() {
	if (!(selectedMajor == "coen")) {
		$( this ).css("background", "#B2E0FF");
	}
}, function() {
	if (!(selectedMajor == "coen")) {
		$( this ).css("background", "#CAD0D5");
	}
});

$( "#webMajor" ).hover(function() {
	if (!(selectedMajor == "web")) {
		$( this ).css("background", "#B2E0FF");
	}
}, function() {
	if (!(selectedMajor == "web")) {
		$( this ).css("background", "#CAD0D5");
	}
});

// Click down functions
$( "#coenMajor" ).mousedown(function() {
	if (!(selectedMajor == "coen")) {
		$( this ).css("background", "#8EB3CC");
	}
});

$( "#webMajor" ).mousedown(function() {
	if (!(selectedMajor == "web")) {
		$( this ).css("background", "#8EB3CC");
	}
});

// Full click functions
$( "#coenMajor" ).click(function() {
	selectedMajor = "coen";

	$( this ).css("background","#B2E0FF");
	$( this ).css("font-weight", "bold");

	$( "#webMajor" ).css("background","#CAD0D5");
	$( "#webMajor" ).css("border", "none");
	$( "#webMajor" ).css("font-weight", "normal");
});

$( "#webMajor" ).click(function() {
	selectedMajor = "web";

	$( this ).css("background","#B2E0FF");
	$( this ).css("font-weight", "bold");

	$( "#coenMajor" ).css("background","#CAD0D5");
	$( "#coenMajor" ).css("border", "none");
	$( "#coenMajor" ).css("font-weight", "normal");
})
