var selectedMajor = "";

/*******************/
/* MAJOR SELECTION */
/*******************/

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

/****************/
/* AP SELECTION */
/****************/

// Full click functions
$( ".apScoreNums" ).click(function() {
	// TODO: currently clicking on a button changes the style of all other scores (besides just removing border) - fix that
	$( this ).css("border","2px solid blue");

	var span = $( this ).parent();
	var tempButton;

	for(var i = 0; i < span.children().length; i++) {
		tempButton = span.children().eq(i);

		if(tempButton.attr("id") != $( this ).attr("id")) {
			console.log("Removing border from a button");
			tempButton.css("border", "none");
		}
	}
});