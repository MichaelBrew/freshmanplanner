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
	for (var i = 0; i < coursesTaken.length; i++) {
		var relevantCourses;
		
		// Select relevant courses
		switch (coursesTaken[i].category) {
			case CATEGORY_MATH:
				relevantCourses = mathCourses;
				break;
			case CATEGORY_SCIENCE:
				relevantCourses = scienceCourses;
				break;
			case CATEGORY_COEN:
				relevantCourses = coenCourses;
				break;
			case CATEGORY_CORE:
				relevantCourses = coreCourses;
				break;
			default:
				return;
		}
		
		// Search for taken course as prereq in relevant courses 
		for (var j = 0; j < relevantCourses.length; j++) {
			// Ensure taken courses are marked as used
			if (relevantCourses[j].title == coursesTaken[i].title) {
				relevantCourses[j].used = true;
			}
			// Remove taken course as prereqs for other courses
			for (var k = 0; k < relevantCourses[j].prereqs.length; k++) {
				if (relevantCourses[j].prereqs[k].title == coursesTaken[i].title) {
					relevantCourses[j].prereqs.splice(0, k+1);
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
					quarter1Courses[i].title = "C&I 1";
					quarter2Courses[i].title = "C&I 2";
					return true;
				}
			}
		}	
	}
	
	return false;
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

	var chem11 = new course("CHEM 11", CATEGORY_SCIENCE, [true,true,true], []);
	var phys31 = new course("PHYS 31", CATEGORY_SCIENCE, [true,true,true], []);
	var phys32 = new course("PHYS 32", CATEGORY_SCIENCE, [true,true,true], [phys31]);
	var phys33 = new course("PHYS 33", CATEGORY_SCIENCE, [true,true,true], [phys32]);

	var scienceClasses = [chem11, phys31, phys32, phys33];

	var ctw1 = new course("CTW 1", CATEGORY_CORE, [true,false,false], []);
	var ctw2 = new course("CTW 2", CATEGORY_CORE, [false,true,false], [ctw1]);
	var core = new course("CORE", CATEGORY_CORE, [true,true,true], []);

	var coreClasses = [ctw1, ctw2, core];
	
	var transferchem11 = new course("CHEM 11", CATEGORY_SCIENCE, [true,true,true], []);
	var transferphys31 = new course("PHYS 31", CATEGORY_SCIENCE, [true,true,true], []);
	var transferphys32 = new course("PHYS 32", CATEGORY_SCIENCE, [true,true,true], []);
	
	var transferCourses = [transferchem11, transferphys31, transferphys32];
	
	
	var sched = buildSchedule(mathClasses, scienceClasses, coenClasses, coreClasses, [], transferCourses, false, true);

	alert("fall: " + sched[0][0].title + sched[0][1].title + sched[0][2].title +sched[0][3].title);
	alert("winter: " + sched[1][0].title + sched[1][1].title + sched[1][2].title +sched[1][3].title);
	alert("spring: " + sched[2][0].title + sched[2][1].title + sched[2][2].title +sched[2][3].title);
}


