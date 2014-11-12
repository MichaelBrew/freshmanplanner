var selectedMajor = "";
var currentStep = 0;

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
    $( this ).css("border", "1px solid black");
    $( this ).css("border-radius", "2px");

    $( "#webMajor" ).css("background","#CAD0D5");
    $( "#webMajor" ).css("border", "none");
    $( "#webMajor" ).css("font-weight", "normal");

    if (currentStep == 0 && selectedMajor != "") {
        moveToAp();
    }

    if (currentStep > 0) {
        updateSchedule();
    }
});

$( "#webMajor" ).click(function() {
    selectedMajor = "web";

    $( this ).css("background","#B2E0FF");
    $( this ).css("border", "1px solid black");
    $( this ).css("border-radius", "2px");

    $( "#coenMajor" ).css("background","#CAD0D5");
    $( "#coenMajor" ).css("border", "none");
    $( "#coenMajor" ).css("font-weight", "normal");

    if (currentStep == 0 && selectedMajor != "") {
        moveToAp();
    }

    if (currentStep > 0) {
        updateSchedule();
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

/****************************/
/* CALC READINESS SELECTION */
/****************************/

$( "input[name='calcRadio']" ).click(function() {
    updateSchedule();
    moveToSchedule();
});

/***********/
/* GENERAL */
/***********/

(function clearAllInputs() {
    var inputs = $( "input" );
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].checked = false;
    }

    var noneButtons = $( ".noneButton" );
    for (var i = 0; i < noneButtons.length; i++) {
        noneButtons[i].checked = true;
    }
}());

(function disableElements() {
    var apSelection = $( "#pickApDiv" );
    var transferSelection = $( "#pickTransferCreditsDiv ");
    var calcReadiness = $( "#calcReadyDiv" );
    var scheduleDiv = $( "#viewScheduleDiv" );

    $(apSelection).css("opacity", 0.2);
    $(apSelection).find("input").prop("disabled", true);
    $(apSelection).find("button").prop("disabled", true);

    $(transferSelection).css("opacity", 0.2);
    $(transferSelection).find("input").prop("disabled", true);
    $(transferSelection).find("button").prop("disabled", true);

    $(calcReadiness).css("opacity", 0.2);
    $(calcReadiness).find("input").prop("disabled", true);

    $(scheduleDiv).css("opacity", 0.2);
    $(scheduleDiv).find("button").prop("disabled", true);
}());

/*****************/
/* READING INPUT */
/*****************/

// Returns course[] of ap credits
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
					incomingCredits.push("Environmental Science (Score 4): ENVS 21");
					apCredits.push(envs21);
					break;
				case "5":
					incomingCredits.push("Environmental Science (Score 5): ENVS 21");
					apCredits.push(envs21);
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
	if ("chem" in apScores) {
		var score = apScores["chem"];
		switch (score) {
			case "3":
				incomingCredits.push("Chemistry (Score 3): Chem 11");			
				apCredits.push(chem11);
				break;
			case "4":
				incomingCredits.push("Chemistry (Score 4): Chem 11 and Chem 12");						
				apCredits.push(chem11);
				apCredits.push(chem12);				
				break;
			case "5":
				incomingCredits.push("Chemistry (Score 5): Chem 11 and Chem 12");						
				apCredits.push(chem11);
				apCredits.push(chem12);
				break;
			default:
				// not good enough
		}
	}
	if ("physMechanics" in apScores) {
		var score = apScores["physMechanics"];
		switch (score) {
			case "4":
				incomingCredits.push("Physics Mechanics (Score 4): Phys 31");						
				apCredits.push(phys31);
				break;
			case "5":
				incomingCredits.push("Physics Mechanics (Score 5): Phys 31");									
				apCredits.push(phys31);
				break;
			default:
				// not good enough
		}
	}
	if ("physEM" in apScores) {
		var score = apScores["physEM"];
		switch (score) {
			case "4":
				incomingCredits.push("Physics Electricity & Magnetism (Score 4): Phys 33");						
				apCredits.push(phys33);
				break;
			case "5":
				incomingCredits.push("Physics Electricity & Magnetism (Score 5): Phys 33");									
				apCredits.push(phys33);
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
	if (document.getElementById("checkChem12").checked) {
		transferCredits.push(chem12);
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
	if (document.getElementById("checkPhys34").checked) {
		transferCredits.push(phys34);
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
	if (document.getElementById("checkEnvs21").checked) {
		transferCredits.push(envs21);
	}
	if (document.getElementById("checkBiol18").checked) {
		transferCredits.push(biol18);
	}
	if (document.getElementById("checkBiol21").checked) {
		transferCredits.push(biol21);
	}			
	return transferCredits;
}

// Returns MAJOR_COEN, MAJOR_WEB, or ""
function getMajor() {
	switch (selectedMajor) {
		case "coen":
			return MAJOR_COEN;
		case "web":
			return MAJOR_WEB;
		default:
			return "";
	}
}

/*********************/
/* REACTING TO INPUT */
/*********************/

// Called after interaction with AP scores
function updateApScores() {
	checkTransferCreditsFromApCredits();
	checkTransferCreditsFromTransferCredits();
    updateSchedule();
}

// Called after interaction with Transfer credits
function updateTransferCredits() {
	checkTransferCreditsFromTransferCredits();
    updateSchedule();
}

// Called after interaction with any element
function updateSchedule() {
	updatePrintout();

	var transferCredits = getTransferCredits();

	// Selecting calcReady 9 or 11 should override previous credits
	var calcReady9 = document.getElementById("calcReady9Button").checked;
	var calcReady11 = document.getElementById("calcReady11Button").checked;
	if (!calcReady9) {
		transferCredits.unshift(math9);					
	}
	if (calcReady9 || calcReady11) {
		var index = $.inArray(math11, transferCredits);
		if (index != -1) {
			transferCredits.splice(index, 1);
		}
		index = $.inArray(math12, transferCredits);
		if (index != -1) {
			transferCredits.splice(index, 1);
		}
		index = $.inArray(math13, transferCredits);
		if (index != -1) {
			transferCredits.splice(index, 1);
		}
		index = $.inArray(math14, transferCredits);
		if (index != -1) {
			transferCredits.splice(index, 1);
		}	
	}

	var sched = buildSchedule(getMajor(), transferCredits);
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
function updatePrintout(){
	var apCredits = getApCredits();
	var transferCredits = getTransferCredits();
	
	// Set title
	var title = document.getElementById("printoutTitle");
	title.innerHTML = getMajor();

	// Set AP/Transfers list
	var getElement = document.getElementById("creditsParagraph");
	var output = "";

	if (incomingCredits.length > 0 || apCredits.length > 0) {
		output += "<b>Waved Classes:</b><br>";
	}

	if (incomingCredits.length > 0){
		output += "<br><b>AP Credits:</b><br>";
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
	
	if (uniqueTransfers.length > 0){
		output += "<br><b>Transfer Credits:</b><br>";
		for (var i = 0; i < uniqueTransfers.length; i++) {
			output += uniqueTransfers[i] + "<br>";
		}
	}

	getElement.innerHTML = output;	
}

function checkTransferCreditsFromTransferCredits() {
    var math11Box = document.getElementById("checkMath11");
    var math12Box = document.getElementById("checkMath12");
    var math13Box = document.getElementById("checkMath13");
    var math14Box = document.getElementById("checkMath14");

    var coen10Box = document.getElementById("checkCoen10");
    var coen11Box = document.getElementById("checkCoen11");
    var coen12Box = document.getElementById("checkCoen12");

    // MATH courses
    if (math14Box.checked) {
        math11Box.disabled = true;
        math12Box.disabled = true;
        math13Box.disabled = true;

        math11Box.checked = true;
        math12Box.checked = true;
        math13Box.checked = true;
    } else if (math13Box.checked) {
        math11Box.disabled = true;
        math12Box.disabled = true;
        math13Box.disabled = false;
        math14Box.disabled = false;

        math11Box.checked = true;
        math12Box.checked = true;
    } else if (math12Box.checked) {
        math11Box.disabled = true;
        math12Box.disabled = false;
        math13Box.disabled = false;
        math14Box.disabled = false;

        math11Box.checked = true;
    } else if (math11Box.checked) {
        math11Box.disabled = false;
        math12Box.disabled = false;
        math13Box.disabled = false;
        math14Box.disabled = false;
    }

    // COEN courses
    if (coen12Box.checked) {
        coen10Box.disabled = true;
        coen11Box.disabled = true;

        coen10Box.checked = true;
        coen11Box.checked = true;
    } else if (coen11Box.checked) {
        coen10Box.disabled = true;
        coen11Box.disabled = false;
        coen12Box.disabled = false;

        coen10Box.checked = true;
    } else if (coen10Box.checked) {
        coen10Box.disabled = false;
        coen11Box.disabled = false;
        coen12Box.disabled = false;
    }

    // If AP scores selected, make sure the courses are still selected
    for (var i = 0; i < prevApCredits.length; i++) {
        $( prevApCredits[i] ).prop("checked", true);
        $( prevApCredits[i] ).prop("disabled", true);
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
			case chem12:
				coursesToDisable.push("#checkChem12");
				break;
			case envs21:
				coursesToDisable.push("#checkEnvs21");
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
