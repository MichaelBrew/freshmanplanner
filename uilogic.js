var selectedMajor = "";
var currentStep = 0;

function enableCertainty() {
	$("#noMayChangeMajorButton").prop("disabled", false);
	$("#yesMayChangeMajorButton").prop("disabled", false);
    $("#majorCertaintyDiv").css("opacity", 1);

}

function moveToAp() {
    currentStep = 1;

    $( "#pickApDiv" ).animate({
        opacity: 1.0
    }, 500);

    $( "#pickApDiv" ).find("input").prop("disabled", false);
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

    var checkBoxes = $( "#pickTransferCreditsDiv" ).find("input");
    checkBoxes.each(function() {
        if (!($( this ).prop("checked"))) {
            $( this ).prop("disabled", false);
        }
    });

	$( "#pickTransferCreditsDiv" ).find("button").prop("disabled", false);
    $('html, body').animate({
        scrollTop: $( "#pickTransferCreditsDiv" ).offset().top
    }, 1000);
}

function moveToCalcReadiness() {
    currentStep = 3;
    $( "#calcReadyDiv" ).animate({
    	opacity: 1.0
    }, 500);

    $( "#calcReadyDiv" ).find("input").prop("disabled", false);
    $( "#calcReadyDiv" ).find("button").prop("disabled", false);
    $('html, body').animate({
    	scrollTop: $( "#calcReadyDiv" ).offset().top
    }, 1000);
}

function moveToSchedule() {
    movedToScheduleYet = true;
    currentStep = 4;

    $( "#viewScheduleDiv" ).animate({
        opacity: 1.0
    }, 500);

    $('html, body').animate({
        scrollTop: $( "#viewScheduleDiv" ).offset().top
    }, 1000);

    $( "#viewScheduleDiv" ).find("button").prop("disabled", false);
}

/*
* If users scrolls during a scroll animation, stop the animation
* This is to prevent a bug where clicking "Done" multiple times leaves the
* users stuck at the bottom of the page and can't scroll up
*/
$("html, body").bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
    if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
        $("html, body").stop(true, true);
    }
});

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
    enableCertainty();
});

$( "#webMajor" ).click(function() {
    selectedMajor = "web";

    $( this ).css("background","#B2E0FF");
    $( this ).css("font-weight", "bold");

    $( "#coenMajor" ).css("background","#CAD0D5");
    $( "#coenMajor" ).css("border", "none");
    $( "#coenMajor" ).css("font-weight", "normal");
    enableCertainty();
});

$( "#yesMayChangeMajorButton" ).click(function() {
	updateSchedule();
    if (currentStep == 0 && selectedMajor != "") {
        moveToAp();
    }
});

$( "#noMayChangeMajorButton" ).click(function() {
	updateSchedule();
    if (currentStep == 0 && selectedMajor != "") {
        moveToAp();
    }
});

/****************/
/* AP SELECTION */
/****************/
$( ".apScoreNums" ).click(function() {
    updateApScores();
})

$( "#doneApButton" ).click(function() {
    moveToTransfer();
});

/**********************/
/* TRANSFER SELECTION */
/**********************/

$( ".transferCreditCheck" ).click(function() {
    updateTransferCredits();
});

$( "#doneTransferButton" ).click(function() {
    moveToCalcReadiness();
});

/*****************************/
/* CALC REAADINESS SELECTION */
/*****************************/

$( "#calcReady9Button" ).click(function() {
    updateSchedule();
    moveToSchedule();
});

$( "#calcReady11Button" ).click(function() {
    updateSchedule();
    moveToSchedule();
});


/***********/
/* GENERAL */
/***********/

(function disableElements() {
    // TODO: Probably shouldn't hardcode eq(x)
    var children = $( "#content" ).children();

    $(children[2]).css("opacity", 0.2);
    $(children[2]).find("input").prop("disabled", true);
    $(children[2]).find("button").prop("disabled", true);
    $(children[3]).css("opacity", 0.2);
    $(children[3]).find("input").prop("disabled", true);
    $(children[3]).find("button").prop("disabled", true);
    $(children[4]).css("opacity", 0.2);
    $(children[4]).find("input").prop("disabled", true);
    $(children[5]).css("opacity", 0.2);
    $(children[5]).find("button").prop("disabled", true);

    $ ("#noMayChangeMajorButton").prop("disabled", true);
	$ ("#yesMayChangeMajorButton").prop("disabled", true);
    $ ("#majorCertaintyDiv").css("opacity", 0.2);
    
}());

/*****************/
/* READING INPUT */
/*****************/

// Returns course[] of ap credits
// TODO: this will need a lot of work when adding amth 106 credit
function getApCredits() {
	incomingCredits = [];
	var apScores = [];
    var apSubjects = $( "form" );

    $( "form" ).each(function() {
		var subject = this;
		var subjectName = $( this ).attr("id");
		var buttons = $( subject ).children();
		buttons.each(function(button) {
			var button = this;
			if (($( button ).attr("value") != "None") && ($( button ).is( ":checked" ))) {
				apScores[subjectName] = $( button ).attr("value");
			}
		});
	});

    var apCredits = [];
	if ("calcAb" in apScores) {
		var score = apScores["calcAb"];
		switch (score) {
			case "4":
				incomingCredits.push("Calc AB (Score 4): Math 11");
				apCredits.push(math11);
				break;
			case "5":
				incomingCredits.push("Calc AB (Score 5): Math 11");
				apCredits.push(math11);
				break;
			default:
				// not good enough
		}
	}
	if ("enviro" in apScores) {
		var score = apScores["enviro"];
		switch (score) {
			case "4":
				incomingCredits.push("Environmental Science (Score 4): Chem 11 Substitution");
				apCredits.push(chem11);
				break;
			case "5":
				incomingCredits.push("Environmental Science (Score 4): Chem 11 Substitution");
				apCredits.push(chem11);
				break;
			default:
				// not good enough
		}
	}
	if ("calcBc" in apScores) {
		var score = apScores["calcBc"];
		switch (score) {
			case "3":
				incomingCredits.push("Calc BC (Score 3): Math 11");			
				apCredits.push(math11);
				break;
			case "4":
				incomingCredits.push("Calc BC (Score 4): Math 11 and Math 12");			
				apCredits.push(math11);
				apCredits.push(math12);
				break;
			case "5":
				incomingCredits.push("Calc BC (Score 5): Math 11 and Math 12");
				apCredits.push(math11);
				apCredits.push(math12);
				break;
			default:
				// not good enough
		}
	}
	if ("physElectric" in apScores) {
		var score = apScores["physElectric"];
		switch (score) {
			case "4":
				incomingCredits.push("Physics EM (Score 4): Phys 33");
				apCredits.push(phys33);
				break;
			case "5":
				incomingCredits.push("Physics EM (Score 5): Phys 33");			
				apCredits.push(phys33);
				break;
			default:
				// not good enough
		}
	}
	if ("chem" in apScores) {
		var score = apScores["chem"];
		switch (score) {
			case "3":
				incomingCredits.push("Chemistry (Score 3): Chem 11");			
				apCredits.push(chem11);
				break;
			case "4":
				incomingCredits.push("Chemistry (Score 4): Chem 11");						
				apCredits.push(chem11);
				break;
			case "5":
				incomingCredits.push("Chemistry (Score 5): Chem 11");						
				apCredits.push(chem11);
				break;
			default:
				// not good enough
		}
	}
	if ("physMechanics" in apScores) {
		var score = apScores["physMechanics"];
		switch (score) {
			case "4":
				incomingCredits.push("Physics EM (Score 4): Phys 31");						
				apCredits.push(phys31);
				break;
			case "5":
				incomingCredits.push("Physics EM (Score 5): Phys 31");									
				apCredits.push(phys31);
				break;
			default:
				// not good enough
		}
	}
	if ("compSci" in apScores) {
		var score = apScores["compSci"];
		switch (score) {
			case "3":
				incomingCredits.push("Computer Science A (Score 3): Coen 10");									
				apCredits.push(coen10);
				break;
			case "4":
				incomingCredits.push("Computer Science A (Score 4): Coen 10 and Coen 11");												
				apCredits.push(coen10);
				apCredits.push(coen11);
				break;
			case "5":
				incomingCredits.push("Computer Science A (Score 5): Coen 10 and Coen 11");															
				apCredits.push(coen10);
				apCredits.push(coen11);
				break;
			default:
				// not good enough
		}
	}

	return apCredits;
}

// Returns course[] of transfer credits
function getTransferCredits() {
	var transferCredits = [];
	if (document.getElementById("checkMath11").checked) {
		transferCredits.push(math11);
	}
	if (document.getElementById("checkMath12").checked) {
		transferCredits.push(math12);
	}
	if (document.getElementById("checkMath13").checked) {
		transferCredits.push(math13);
	}
	if (document.getElementById("checkMath14").checked) {
		transferCredits.push(math14);
	}
	if (document.getElementById("checkChem11").checked) {
		transferCredits.push(chem11);
	}
	if (document.getElementById("checkPhys31").checked) {
		transferCredits.push(phys31);
	}
	if (document.getElementById("checkPhys32").checked) {
		transferCredits.push(phys32);
	}
	if (document.getElementById("checkPhys33").checked) {
		transferCredits.push(phys33);
	}
	if (document.getElementById("checkCoen10").checked) {
		transferCredits.push(coen10);
	}
	if (document.getElementById("checkCoen11").checked) {
		transferCredits.push(coen11);
	}
	if (document.getElementById("checkCoen12").checked) {
		transferCredits.push(coen12);
	}
	if (document.getElementById("checkCoen19").checked) {
		transferCredits.push(coen19);
	}
	return transferCredits;
}

/*********************/
/* REACTING TO INPUT */
/*********************/

// Called after interaction with AP scores
function updateApScores() {
	checkTransferCreditsFromApCredits();
	checkTransferCreditsFromTransferCredits();
	checkCalcReadiness();
    updateSchedule();
}

// Called after interaction with Transfer credits
function updateTransferCredits() {
	checkTransferCreditsFromTransferCredits();
	checkCalcReadiness();
    updateSchedule();
}

// Called after interaction with any element
function updateSchedule() {
	listCredits();

	var apCredits = getApCredits();
	var transferCredits = getTransferCredits();
	var sureOfMajor = document.getElementById("noMayChangeMajorButton").checked;

	var hasMath9Credit = document.getElementById("calcReady11Button").checked;
	if (hasMath9Credit) {
		transferCredits.unshift(math9);
	}

 	// TODO list credits for print out
	var sched = buildSchedule(MAJOR_COEN, apCredits.concat(transferCredits), sureOfMajor);
	displaySchedule(sched);
}

/*********************/
/* DISPLAYING OUTPUT */
/*********************/

function displaySchedule(sortedSched) {
	document.getElementById("fall0").innerHTML = sortedSched[0][0].title;
	colorCourse("fall0", sortedSched[0][0], false);
	document.getElementById("fall1").innerHTML = sortedSched[0][1].title;
	colorCourse("fall1", sortedSched[0][1], false);
	document.getElementById("fall2").innerHTML = sortedSched[0][2].title;
	colorCourse("fall2", sortedSched[0][2], false);
	document.getElementById("fall3").innerHTML = sortedSched[0][3].title;
	colorCourse("fall3", sortedSched[0][3], false);

	document.getElementById("winter0").innerHTML = sortedSched[1][0].title;
	colorCourse("winter0", sortedSched[1][0], false);
	document.getElementById("winter1").innerHTML = sortedSched[1][1].title;
	colorCourse("winter1", sortedSched[1][1], false);
	document.getElementById("winter2").innerHTML = sortedSched[1][2].title;
	colorCourse("winter2", sortedSched[1][2], false);
	document.getElementById("winter3").innerHTML = sortedSched[1][3].title;
	colorCourse("winter3", sortedSched[1][3], false);

	document.getElementById("spring0").innerHTML = sortedSched[2][0].title;
	colorCourse("spring0", sortedSched[2][0], false);
	document.getElementById("spring1").innerHTML = sortedSched[2][1].title;
	colorCourse("spring1", sortedSched[2][1], false);
	document.getElementById("spring2").innerHTML = sortedSched[2][2].title;
	colorCourse("spring2", sortedSched[2][2], false);
	document.getElementById("spring3").innerHTML = sortedSched[2][3].title;
	colorCourse("spring3", sortedSched[2][3], false);

	// Add eng1 cell
	if (sortedSched[0].length == 5) {
		document.getElementById("fall4").innerHTML = sortedSched[0][4].title;
		colorCourse("fall4", sortedSched[0][4], false);
		document.getElementById("winter4").innerHTML = "";
		colorCourse("winter4", sortedSched[0][4], true);
	} else if (sortedSched[1].length == 5) {
		document.getElementById("winter4").innerHTML = sortedSched[1][4].title;
		colorCourse("winter4", sortedSched[1][4], false);
		document.getElementById("fall4").innerHTML = "";
		colorCourse("fall4", sortedSched[1][4], true);
	}
}

function colorCourse(id, course, blank) {
	id = "#" + id;

	if (blank) {
		$( id ).css("background-color", "white");
		return;
	}
	// MATH & SCIENCE: blue
	// COEN: green
	// CORE: yellow
	if (course.category == CATEGORY_MATH) {
		$( id ).css("background-color", "#ADE2FF");
	} else if (course.category == CATEGORY_SCIENCE) {
		$( id ).css("background-color", "#ADE2FF");
	} else if (course.category == CATEGORY_COEN) {
		$( id ).css("background-color", "#C2FFC2");
	} else {
		$( id ).css("background-color", "#FBFFB3");
	}
}

var incomingCredits = [];
function listCredits(){
	var apCredits = getApCredits();
	var transferCredits = getTransferCredits();
	
	var getElement = document.getElementById("creditsParagraph");
	var output = "";

	if (incomingCredits.length > 0){
		output = "AP Credits:<br>";
		for (var i = 0; i < incomingCredits.length; i++) {
			output += incomingCredits[i] + "<br>";
		}
	}
	
	var uniqueTransfers = [];
	for (var i = 0; i < transferCredits.length; i++) {
		var contained = false;
		for (var j = 0; j < apCredits.length; j++) {
			if (transferCredits[i].title == apCredits[j].title) {
				contained = true;
			}
		}
		if (!contained && $.inArray(transferCredits[i].title, uniqueTransfers) == -1) {
			uniqueTransfers.push(transferCredits[i].title);
		}
	}
	
	var transferOutput = "";
	if (uniqueTransfers.length > 0){
		transferOutput = "Transfer Credits:<br>";
		for (var i = 0; i < uniqueTransfers.length; i++) {
			transferOutput += uniqueTransfers[i] + "<br>";
		}
	}

	getElement.innerHTML = output+ transferOutput;	
}

function checkCalcReadiness() {
	var apCredits = getApCredits();
	var transferCredits = getTransferCredits();

	var incoming = apCredits.concat(transferCredits);
	if ($.inArray(math11, incoming) != -1) {
		// Skip calc readiness
		$( "#calcReadyDiv" ).css("opacity", "0.2");
		$( "#calcReadyDiv" ).find("button").prop("disabled", true);
		$( "#calcReady11Button" ).prop("checked", true)
	} else {
		// Don't skip calc readiness
		$( "#calcReadyDiv" ).css("opacity", "1.0");
		$( "#calcReadyDiv" ).find("button").prop("disabled", false);
	}
}

function checkTransferCreditsFromTransferCredits() {
	if (document.getElementById("checkMath12").checked) {
		$( "#checkMath11" ).prop("checked", true);
	}
	if (document.getElementById("checkMath13").checked) {
		$( "#checkMath11" ).prop("checked", true);
		$( "#checkMath12" ).prop("checked", true);
	}
	if (document.getElementById("checkMath14").checked) {
		$( "#checkMath11" ).prop("checked", true);
		$( "#checkMath12" ).prop("checked", true);
		$( "#checkMath13" ).prop("checked", true);
	}
	if (document.getElementById("checkCoen11").checked) {
		$( "#checkCoen10" ).prop("checked", true);
	}
	if (document.getElementById("checkCoen12").checked) {
		$( "#checkCoen10" ).prop("checked", true);
		$( "#checkCoen11" ).prop("checked", true);
	}
}

var prevApCredits = [];
function checkTransferCreditsFromApCredits() {
	var coursesToDisable = [];
	var apCredits = getApCredits();
	for (var i = 0 ; i < apCredits.length; i++) {
		var course = apCredits[i];

		switch (course) {
			case math11:
				coursesToDisable.push("#checkMath11");
				break;
			case math12:
				coursesToDisable.push("#checkMath12");
				break;
			case chem11:
				coursesToDisable.push("#checkChem11");
				break;
			case coen10:
				coursesToDisable.push("#checkCoen10");
				break;
			case coen11:
				coursesToDisable.push("#checkCoen11");
				break;
			case phys31:
				coursesToDisable.push("#checkPhys31");
				break;
			case phys33:
				coursesToDisable.push("#checkPhys33");
				break;
			default:
				// nada
		}
	}

	for (var i = 0; i < coursesToDisable.length; i++) {
		var course = coursesToDisable[i];
		$( course ).prop("disabled", true);
		$( course ).prop("checked", true);
	}

	for (var i = 0; i < prevApCredits.length; i++) {
		var course = prevApCredits[i];
		var contains = ($.inArray(course, coursesToDisable) != -1)
		if (!contains) {
			$( course ).prop("disabled", false);
			$( course ).prop("checked", false);
		}
		
	}

	prevApCredits = coursesToDisable;
}
