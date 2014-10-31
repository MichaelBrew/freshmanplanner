// TODO enum instead
var FALL = 0;
var WINTER = 1;
var SPRING = 2;

// TODO enum instead
var CATEGORY_MATH = 0;
var CATEGORY_SCIENCE = 1;
var CATEGORY_COEN = 2;
var CATEGORY_CORE = 3;

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
 *			boolean sureOfMajor (if false ENG1 should be in the fall)
 */
function buildSchedule(mathCourses, scienceCourses, coenCourses, coreCourses,
		apCredits, transferCredits, sureOfMajor) {
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

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
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
	// TODO
		
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
					allCourses[j].prereqs.splice(0, k+1);
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
			var course = courseList[i][j]
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





function getTransferCredits() {
						
}

function test() {
	var coen10 = new course("COEN 10", CATEGORY_COEN, [true, true, true], []);
	var coen11 = new course("COEN 11", CATEGORY_COEN, [true, true, true], [coen10]);
	var coen12 = new course("COEN 12", CATEGORY_COEN, [true, true, true], [coen11]);
	var coen19 = new course("COEN 19", CATEGORY_COEN, [true, false, true], []);

	var coenClasses = [coen10, coen11, coen12, coen19];

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
	
	// Get user's transfer credits
	var transferCredits = [];
	if (document.getElementById("checkMath11").checked)
		transferCredits.push(math11);	
	if (document.getElementById("checkMath12").checked)
		transferCredits.push(math12);	
	if (document.getElementById("checkMath13").checked)
		transferCredits.push(math13);	
	if (document.getElementById("checkMath14").checked)
		transferCredits.push(math14);	
	if (document.getElementById("checkChem11").checked)
		transferCredits.push(chem11);	
	if (document.getElementById("checkPhys31").checked)
		transferCredits.push(phys31);					
	if (document.getElementById("checkPhys32").checked)
		transferCredits.push(phys32);	
	if (document.getElementById("checkPhys33").checked)
		transferCredits.push(phys33);
	if (document.getElementById("checkCoen10").checked)
		transferCredits.push(coen10);							
	if (document.getElementById("checkCoen11").checked)
		transferCredits.push(coen11);	
	if (document.getElementById("checkCoen12").checked)
		transferCredits.push(coen12);			
	if (document.getElementById("checkCoen19").checked)
		transferCredits.push(coen19);	
	
	var sched = buildSchedule(mathClasses, scienceClasses, coenClasses, coreClasses, [], transferCredits, false, true);
	var sortedSched = sortSched(sched);

	// Display schedule on table
	// TODO need way to add ENG1 cell
	document.getElementById("fall0").innerHTML = sortedSched[0][0].title;
	document.getElementById("fall1").innerHTML = sortedSched[0][1].title;
	document.getElementById("fall2").innerHTML = sortedSched[0][2].title;
	document.getElementById("fall3").innerHTML = sortedSched[0][3].title;

	document.getElementById("winter0").innerHTML = sortedSched[1][0].title;
	document.getElementById("winter1").innerHTML = sortedSched[1][1].title;
	document.getElementById("winter2").innerHTML = sortedSched[1][2].title;
	document.getElementById("winter3").innerHTML = sortedSched[1][3].title;

	document.getElementById("spring0").innerHTML = sortedSched[2][0].title;
	document.getElementById("spring1").innerHTML = sortedSched[2][1].title;
	document.getElementById("spring2").innerHTML = sortedSched[2][2].title;
	document.getElementById("spring3").innerHTML = sortedSched[2][3].title;
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
		
		// TODO second level organizing
		
		sorted.push(coenCourses.concat(mathCourses).concat(scienceCourses).concat(coreCourses));
	}
	return sorted;
}