var selectedMajor = "";
var currentStep = 0;

function moveToAp() {
    currentStep = 1;

    $( "#pickApDiv" ).animate({
        opacity: 1.0
    }, 500);

    $( "#pickApDiv" ).find("button").prop("disabled", false);

    $('html, body').animate({
        scrollTop: $( "#pickApDiv" ).offset().top
    }, 1000);
}

function moveToTransfer() {
    currentStep = 2;

    $( "#pickTransferCreditsDiv" ).animate({
        opacity: 1.0
    }, 500);

    $( "#pickTransferCreditsDiv" ).find("input").prop("disabled", false);

    $('html, body').animate({
        scrollTop: $( "#pickTransferCreditsDiv" ).offset().top
    }, 1000);
}

function moveToSchedule() {
    currentStep = 3;

    $( "#viewScheduleDiv" ).animate({
        opacity: 1.0
    }, 500);

    $('html, body').animate({
        scrollTop: $( "#viewScheduleDiv" ).offset().top
    }, 1000);
}

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

	if(currentStep == 0) {
		moveToAp();
	}

});

$( "#webMajor" ).click(function() {
	selectedMajor = "web";

	$( this ).css("background","#B2E0FF");
	$( this ).css("font-weight", "bold");

	$( "#coenMajor" ).css("background","#CAD0D5");
	$( "#coenMajor" ).css("border", "none");
	$( "#coenMajor" ).css("font-weight", "normal");

	if(currentStep == 0) {
		moveToAp();
	}
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

$( "#doneApButton" ).click(function() {
	moveToTransfer();
});

/**********************/
/* TRANSFER SELECTION */
/**********************/

$( "#doneTransferButton" ).click(function() {
	moveToSchedule();
});


/***********/
/* GENERAL */
/***********/

(function disableElements() {
	// TODO: Probably shouldn't hardcode eq(x)
	$( "#content" ).children().eq(1).css("opacity", 0.2);
	$( "#content" ).children().eq(1).find("button").prop("disabled", true);
	$( "#content" ).children().eq(2).css("opacity", 0.2);
	$( "#content" ).children().eq(2).find("input").prop("disabled", true);
	$( "#content" ).children().eq(3).css("opacity", 0.2);
}());