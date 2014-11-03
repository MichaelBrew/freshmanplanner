// TODO enum instead
var FALL = 0;
var WINTER = 1;
var SPRING = 2;

// TODO enum instead
var CATEGORY_MATH = 0;
var CATEGORY_SCIENCE = 1;
var CATEGORY_COEN = 2;
var CATEGORY_CORE = 3;

// Basically a hack, should fix later
var prevApCredits = [];

var movedToScheduleYet = false;
var skipCalcReadiness = false;

/* Prototype for a course object.
 * Params: string title
 *		   int category (one of CATEGORY_MATH, _SCIENCE, _COEN, _CORE)
 *	       boolean[] availableQuarters 
 *	       course[] prereqs 
 */
function course(title, category, availableQuarters, prereqs) {
	this.title = title;
	this.category = category;
	this.availableQuarters = availableQuarters;
	this.prereqs = prereqs;
	this.used = false;
	this.eligible = function() {
			// Always able to add CORE classes
			if (this.title == "CORE") {
				return true;
			}
			// Able to add if no more prereqs and not already used
			return (this.prereqs.length == 0 && !(this.used)) ;};
}

// TODO alter signature, split up some of the functionality of this function into others
/* Main entry point for building the freshman schedule.
 * Params: 	course[] mathCourses,
 *			course[] scienceCourses,
 *			course[] coenCourses,
 *			course[] coreCourses,
 *			course[] apCredits (AP credits need to be transformed to course array beforehand)
 *			course[] transferCredits,
 *			boolean sureOfMajor (if false ENG1 should be in the fall),
 *			course eng1
 */
function buildSchedule(mathCourses, scienceCourses, coenCourses, coreCourses, apCredits, transferCredits, sureOfMajor, eng1) {
	// eliminate transfer courses
	removeTransferCourses(mathCourses, scienceCourses, coenCourses, coreCourses, apCredits, transferCredits);

	// Build fall schedule
	var fall = [];
	
	// MATH slot. Can be filled with SCIENCE or CORE if no more math to take.
	var preferedCategories = [mathCourses, scienceCourses, coreCourses];
	var course = getAvailableCourse(preferedCategories, FALL);
	fall.push(course);
	
	// SCIENCE slot. Can be filled with MATH or CORE if no more science to take.
	preferedCategories = [scienceCourses, mathCourses, coreCourses];
	course = getAvailableCourse(preferedCategories, FALL);
	fall.push(course);

	// COEN slot. If user has already taken coen10 prefer user finishes available science courses
	if (coenCourses[0].title == "COEN 10" && !coenCourses[0].used) {
		preferedCategories = [coenCourses, scienceCourses, coreCourses];
	} else {
		preferedCategories = [scienceCourses, coenCourses, coreCourses];		
	}
	course = getAvailableCourse(preferedCategories, FALL);	
	fall.push(course);
	
	// CTW slot. Hard-coded requirement
	preferedCategories = [coreCourses];
	course = getAvailableCourse(preferedCategories, FALL);
	fall.push(course);
	
	// Update preqs based on classes taken in the fall
	updatePrereqs(fall, mathCourses, scienceCourses, coenCourses, coreCourses);
	
	// Build winter schedule
	var winter = [];

	// MATH slot. Can be filled with SCIENCE or CORE if no more math to take.
	preferedCategories = [mathCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(preferedCategories, WINTER);
	winter.push(course);
	//alert("added(math slot)"+course.title);	
	
	// SCIENCE slot. Can be filled with MATH or CORE if no more science to take.
	preferedCategories = [scienceCourses, mathCourses, coreCourses];
	course = getAvailableCourse(preferedCategories, WINTER);
	winter.push(course);
	//alert("added(sci slot)"+course.title);	

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(preferedCategories, WINTER);	
	winter.push(course);
	//alert("added(coen slot)"+course.title);	
	
	// CTW slot. Hard-coded requirement
	preferedCategories = [coreCourses];
	course = getAvailableCourse(preferedCategories, WINTER);	
	winter.push(course);
	//alert("added(ctw slot)"+course.title);	
	
	// Update preqs based on classes taken in the fall
	updatePrereqs(winter, mathCourses, scienceCourses, coenCourses, coreCourses);
	
	// Check if added core twice make CI
	var ci = checkForCI(fall, winter);
	
	// Add eng1 to fall or winter based on difficulty of sched or certainty of major
	addEngineering1(fall, winter, sureOfMajor, eng1);
		
	// Build spring schedule
	var spring = [];
	
	// MATH slot. Can be filled with SCIENCE or CORE if no more math to take.
	preferedCategories = [mathCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(preferedCategories, SPRING);
	spring.push(course);
	
	// SCIENCE slot. Can be filled with MATH or CORE if no more science to take.
	preferedCategories = [scienceCourses, mathCourses, coreCourses];
	course = getAvailableCourse(preferedCategories, SPRING);
	spring.push(course);

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(preferedCategories, SPRING);	
	spring.push(course);

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(preferedCategories, SPRING);	
	spring.push(course);
	
	// Check if added core twice make CI
	if (!ci) {
		checkForCI(winter, spring);
	}
	
	var courses = [fall, winter, spring];
	return courses;
}

function removeTransferCourses(mathCourses, scienceCourses, coenCourses, coreCourses, apCredits, transferCredits) {
	var incomingCourses = apCredits.concat(transferCredits);
	updatePrereqs(incomingCourses, mathCourses, scienceCourses, coenCourses, coreCourses);	
}

// TODO hacky remove after tuesday
var incomingCredits = [];

function getApCreditsFromScores(apScores) {
	var apCredits = [];
	incomingCredits = [];

	var coen10 = new course("COEN 10", CATEGORY_COEN, [true, true, true], []);
	var coen11 = new course("COEN 11", CATEGORY_COEN, [true, true, true], [coen10]);
	var coen12 = new course("COEN 12", CATEGORY_COEN, [true, true, true], [coen11]);

	var math11 = new course("MATH 11", CATEGORY_MATH, [true, true, true], []);
	var math12 = new course("MATH 12", CATEGORY_MATH, [true, true, true], [math11]);

	var chem11 = new course("CHEM 11", CATEGORY_SCIENCE, [true,false,false], []);
	var phys31 = new course("PHYS 31", CATEGORY_SCIENCE, [false,true,false], [math11]);
	var phys32 = new course("PHYS 32", CATEGORY_SCIENCE, [false,false,true], [phys31]);
	var phys33 = new course("PHYS 33", CATEGORY_SCIENCE, [true,false,false], [phys32]);

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

function updatePrereqs(coursesTaken, mathCourses, scienceCourses, coenCourses, coreCourses) {
	var allCourses = mathCourses.concat(scienceCourses).concat(coenCourses).concat(coreCourses);
	for (var i = 0; i < coursesTaken.length; i++) {
		// Search for taken course as prereq in allCourses 
		for (var j = 0; j < allCourses.length; j++) {
			// Ensure taken courses are marked as used
			if (allCourses[j].title == coursesTaken[i].title) {
				allCourses[j].used = true;
			}
			// Remove taken course as prereqs for other courses
			for (var k = 0; k < allCourses[j].prereqs.length; k++) {
				if (allCourses[j].prereqs[k].title == coursesTaken[i].title) {
					allCourses[j].prereqs.splice(k, 1);
				}
			}
		}
	}	
}

/* Picks the next course to take.
 * Parameters:
 * course[][] courseList (first index represents category in order of decreasing preference)
 * int quarter
 */
function getAvailableCourse(courseList, quarter) {
	// Try to pick a course from the preferred category first
	for (var i = 0; i < courseList.length; i++) {
		// Go through the available courses in the current category
		for (var j = 0; j < courseList[i].length; j++) {
		//alert("get@"+i+","+j);	
			var course = courseList[i][j];
			//alert("course title " + course.title);
			//alert("course avail: " + course.availableQuarters[quarter]);
			//alert("course elig: " + course.eligible());
			if (course.availableQuarters[quarter] && course.eligible()) {
				course.used = true;
				//alert("found " + course.title); 
				return course;
			}
		}
	}
}

/* Add eng1 to fall or winter based on difficulty of sched or certainty of major
 * Parameters:
 * course[] fall
 * course[] winter
 * boolean sureOfMajor
 * course eng1
 */
function addEngineering1(fall, winter, sureOfMajor, eng1) {
	if (!sureOfMajor) {
		fall.push(eng1);
		return;
	}

	var MATH_INDEX = 0;
	var SCIENCE_INDEX = 1;
	var COEN_INDEX = 2;
		
	// Helper function to return int[] of number of math, sci, and coen courses a quarter has
	function countCategories(courseList) {
		var categories = [0,0,0];
		for (var i = 0; i < courseList.length; i++) {
			switch (courseList[i].category) {
				case CATEGORY_MATH:
					categories[MATH_INDEX] = categories[MATH_INDEX] + 1;
					break;
				case CATEGORY_SCIENCE:
					categories[SCIENCE_INDEX] = categories[SCIENCE_INDEX] + 1;
					break;
				case CATEGORY_COEN:
					categories[COEN_INDEX] = categories[COEN_INDEX] + 1;
					break;										
			}
		}
		return categories;
	}
	
	var fallCategories = countCategories(fall);
	var winterCategories = countCategories(winter);
	
	var fallLabs = fallCategories[SCIENCE_INDEX] + fallCategories[COEN_INDEX];
	var winterLabs = winterCategories[SCIENCE_INDEX] + winterCategories[COEN_INDEX];

	/* Assign quarter with less labs eng1. 
	 * If equal number of labs assign the quarter with less technical classes (coen, sci, math).
	 * If even, assign eng1 to the fall */
	if (fallLabs > winterLabs) {
		winter.push(eng1);
	} else if (fallLabs < winterLabs) {
		fall.push(eng1);
	} else if (fallCategories[MATH_INDEX] > winterCategories[MATH_INDEX]) {
		winter.push(eng1);
	} else if (fallCategories[MATH_INDEX] < winterCategories[MATH_INDEX]) {
		fall.push(eng1);
	} else {
		fall.push(eng1);
	}
}

function checkForCI(quarter1Courses, quarter2Courses) {

	for (var i = 0; i < quarter1Courses.length; i++) {
		if (quarter1Courses[i].title == "CORE") {
			for (var j = 0; j < quarter2Courses.length; j++) {
				if (quarter2Courses[j].title == "CORE") {
					var ci1 = new course("C&I 1", CATEGORY_CORE, [true,true,true], []);
					var ci2 = new course("C&I 2", CATEGORY_CORE, [true,true,true], []);
					quarter1Courses[i] = ci1;
					quarter2Courses[j] = ci2;
					return true;
				}
			}
		}
	}

	return false;
}

/* Takes freshman schedule and returns a schedule sorted by category
 * Parameters:
 *	course[][] schedule (course[FALL] corresponds to fall courses and so on) 
 * Return:
 *	course[][] (sorted list of courses)
 */
function sortSched(schedule) {
	var sorted = [];

	// Sort each quarter
	for (var i = 0; i < schedule.length; i++) {
		var coenCourses = [];
		var scienceCourses = [];
		var mathCourses = [];
		var coreCourses = [];
		
		// Sort into categories
		for (var j = 0; j < schedule[i].length; j++) {
			switch (schedule[i][j].category) {
				case CATEGORY_MATH:
					 mathCourses.push(schedule[i][j]);
					break;
				case CATEGORY_SCIENCE:
					 scienceCourses.push(schedule[i][j]);
					break;
				case CATEGORY_COEN:
					 coenCourses.push(schedule[i][j]);
					break;
				case CATEGORY_CORE:
					 coreCourses.push(schedule[i][j]);
					break;
			}			
		}
		
		// TODO more second level organizing
		
		sorted.push(coenCourses.concat(mathCourses).concat(scienceCourses).concat(coreCourses));
		
		// Put ENG1 at the bottom of the list
		for (var j = 0; j < sorted[i].length; j++) {
			if (sorted[i][j].title == "ENGR 1") {
				var temp = sorted[i].splice(j, 1);
				sorted[i].push(temp[0]);
				break;
			}
		}
		
	}
	return sorted;
}

function checkTransferCreditsFromApCredits(apCredits) {
	var coursesToDisable = [];
	for (var i = 0 ; i < apCredits.length; i++) {
		var course = apCredits[i];

		switch (course.title) {
			case "MATH 11":
				coursesToDisable.push("#checkMath11");
				break;
			case "MATH 12":
				//coursesToDisable.push("#checkMath11");
				coursesToDisable.push("#checkMath12");
				break;
			case "CHEM 11":
				coursesToDisable.push("#checkChem11");
				break;
			case "COEN 10":
				coursesToDisable.push("#checkCoen10");
				break;
			case "COEN 11":
				//coursesToDisable.push("#checkCoen10");
				coursesToDisable.push("#checkCoen11");
				break;
			case "PHYS 31":
				coursesToDisable.push("#checkPhys31");
				break;
			case "PHYS 33":
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

		//if (!(coursesToDisable.indexOf(course) > -1)) {
		var contains = false;
		for (var j = 0; j < coursesToDisable.length; j++) {
			if (coursesToDisable[j] == course) {
				contains = true;
			}
		}
		if (!contains) {
			$( course ).prop("disabled", false);
			$( course ).prop("checked", false);
		}
		
	}

	prevApCredits = coursesToDisable;
}

function updateMajor() {
    // TODO: change schedule based on selected major
    // For the initial system, only has to work with COEN
}

function updateApScores() {
    updateSchedule();
}

function updateTransferCredits() {
    updateSchedule();
}

function updateCalcReadiness(readinessButton) {
	var calcRecommend9;

    if ($( readinessButton ).attr("id") == "calcReady9Button") {
        calcRecommend9 = true;
    } else {
        calcRecommend9 = false;
    }

    updateSchedule();
}

function updateSchedule() {
	/*********************/
	/* BUILD ALL COURSES */
	/*********************/
	var eng1 = new course("ENGR 1", CATEGORY_COEN, [true, true, false], []);

	var coen10 = new course("COEN 10", CATEGORY_COEN, [true, true, true], []);
	var coen11 = new course("COEN 11", CATEGORY_COEN, [true, true, true], [coen10]);
	var coen12 = new course("COEN 12", CATEGORY_COEN, [true, true, true], [coen11]);
	var coen19 = new course("COEN 19", CATEGORY_COEN, [true, false, true], []);
	var coenClasses = [coen10, coen11, coen12, coen19];

	var math9 = new course("MATH 9", CATEGORY_MATH, [true, false, false], []);
	var math11 = new course("MATH 11", CATEGORY_MATH, [true, true, true], []);
	var math12 = new course("MATH 12", CATEGORY_MATH, [true, true, true], [math11]);
	var math13 = new course("MATH 13", CATEGORY_MATH, [true, true, true], [math12]);
	var math14 = new course("MATH 14", CATEGORY_MATH, [true, true, true], [math13]);
	var math53 = new course("MATH 53", CATEGORY_MATH, [false, true, true], [math13]);
	// TODO more courses
	var mathClasses = [math11, math12, math13, math14, math53];

	var chem11 = new course("CHEM 11", CATEGORY_SCIENCE, [true,false,false], []);
	var phys31 = new course("PHYS 31", CATEGORY_SCIENCE, [false,true,false], [math11]);
	/* TODO: technically math12 a pre/co requisite for 32. While it shouldn't be a problem b/c 
	 * 31 requires 11 a student could technically have 31 ap credit and not 11 ap credit. 
	 * Need to change existing alg to allow for coreqs. */
	var phys32 = new course("PHYS 32", CATEGORY_SCIENCE, [false,false,true], [phys31]); 
	var phys33 = new course("PHYS 33", CATEGORY_SCIENCE, [true,false,false], [phys32]);
	// phys33 is put ahead of chem11 because order in the array breaks ties and if user 
	// has incoming credit for 31 & 32 we  prefer they take phys33 first rather than wait
	// a year
	var scienceClasses = [phys33, chem11, phys31, phys32];

	var ctw1 = new course("CTW 1", CATEGORY_CORE, [true,false,false], []);
	var ctw2 = new course("CTW 2", CATEGORY_CORE, [false,true,false], [ctw1]); /* TODO: are there some cases where CTW 2 is in the spring? */
	var core = new course("CORE", CATEGORY_CORE, [true,true,true], []);
	var coreClasses = [ctw1, ctw2, core];

	/********************/
	/* CHECK AP CREDITS */
	/********************/
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

    var apCredits = getApCreditsFromScores(apScores);

    checkTransferCreditsFromApCredits(apCredits);

	/**************************/
	/* CHECK TRANSFER CREDITS */
	/**************************/
	var transferCredits = [];
	if (document.getElementById("checkMath11").checked) {
		transferCredits.push(math11);
	}
	if (document.getElementById("checkMath12").checked) {
		$( "#checkMath11" ).prop("checked", true);
		transferCredits.push(math11);
		transferCredits.push(math12);
	}
	if (document.getElementById("checkMath13").checked) {
		$( "#checkMath11" ).prop("checked", true);
		$( "#checkMath12" ).prop("checked", true);
		transferCredits.push(math11);
		transferCredits.push(math12);
		transferCredits.push(math13);
	}
	if (document.getElementById("checkMath14").checked) {
		$( "#checkMath11" ).prop("checked", true);
		$( "#checkMath12" ).prop("checked", true);
		$( "#checkMath13" ).prop("checked", true);
		transferCredits.push(math11);
		transferCredits.push(math12);
		transferCredits.push(math13);
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
		$( "#checkCoen10" ).prop("checked", true);
		transferCredits.push(coen10);
		transferCredits.push(coen11);
	}
	if (document.getElementById("checkCoen12").checked) {
		$( "#checkCoen10" ).prop("checked", true);
		$( "#checkCoen11" ).prop("checked", true);
		transferCredits.push(coen10);
		transferCredits.push(coen11);
		transferCredits.push(coen12);
	}
	if (document.getElementById("checkCoen19").checked) {
		transferCredits.push(coen19);
	}

	/******************/
	/* CALC READINESS */
	/******************/
	if (($( "#checkMath11" ).prop("checked")) || ($( "#checkMath12" ).prop("checked")) ||
		($( "#checkMath13" ).prop("checked")) || ($( "#checkMath14" ).prop("checked"))) {
		skipCalcReadiness = true;
	} else {
		skipCalcReadiness = false;
	}

	if (skipCalcReadiness) {
		$( "#calcReadyDiv" ).css("opacity", "0.2");
		$( "#calcReadyDiv" ).find("button").prop("disabled", true);
	} else {
		if (movedToScheduleYet) {
			$( "#calcReadyDiv" ).css("opacity", "1.0");
			$( "#calcReadyDiv" ).find("button").prop("disabled", false);
		}
		// push math9 if selected and make math9 a prereq for 11
		var math9Needed = document.getElementById("calcReady9Button").checked;
		if (math9Needed) {
			math11.prereqs.push(math9);
			mathClasses.unshift(math9);
		}
	}
    
    // get user's major certainty
    var sureOfMajor = document.getElementById("noMayChangeMajorButton").checked;
    
    listCredits(apCredits, transferCredits);
    
    var sched = buildSchedule(mathClasses, scienceClasses, coenClasses, coreClasses, apCredits, transferCredits, sureOfMajor, eng1);
	var sortedSched = sortSched(sched);

    displaySchedule(sortedSched);
}

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

function listCredits(apCredits, transferCredits){

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
