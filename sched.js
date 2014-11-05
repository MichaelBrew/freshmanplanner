
var used = [];


/* Main entry point for building the freshman schedule. */
function buildSchedule(major, incomingCredits, sureOfMajor) {
	used = [];
	// add transfer courses
	updateUsed(incomingCredits);

	// Build fall schedule
	var fall = [];
	
	// MATH slot. Can be filled with SCIENCE or CORE if no more math to take.
	var preferedCategories = [mathCourses, scienceCourses, coreCourses];
	var course = getAvailableCourse(fall, preferedCategories, FALL);
	fall.push(course);

	// SCIENCE slot. Can be filled with MATH or CORE if no more science to take.
	preferedCategories = [scienceCourses, mathCourses, coreCourses];
	course = getAvailableCourse(fall, preferedCategories, FALL);
	fall.push(course);

	// COEN slot.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(fall, preferedCategories, FALL);	
	fall.push(course);

	// CTW slot. Hard-coded requirement
	preferedCategories = [coreCourses];
	course = getAvailableCourse(fall, preferedCategories, FALL);
	fall.push(course);

	// Update preqs based on classes taken in the fall
	updateUsed(fall);
	
	// Build winter schedule
	var winter = [];

	// MATH slot. Can be filled with SCIENCE or CORE if no more math to take.
	preferedCategories = [mathCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(winter, preferedCategories, WINTER);
	winter.push(course);
	
	// SCIENCE slot. Can be filled with MATH or CORE if no more science to take.
	preferedCategories = [scienceCourses, mathCourses, coreCourses];
	course = getAvailableCourse(winter, preferedCategories, WINTER);
	winter.push(course);

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(winter, preferedCategories, WINTER);	
	winter.push(course);
	
	// CTW slot. Hard-coded requirement
	preferedCategories = [coreCourses];
	course = getAvailableCourse(winter, preferedCategories, WINTER);	
	winter.push(course);
	
	// Update preqs based on classes taken in the fall
	updateUsed(winter);
	
	// Check if added core twice make CI
	var ci = checkForCI(fall, winter);
	
	// Add eng1 to fall or winter based on difficulty of sched or certainty of major
	addEngineering1(fall, winter, sureOfMajor, eng1);
		
	// Build spring schedule
	var spring = [];
	
	// MATH slot. Can be filled with SCIENCE or CORE if no more math to take.
	preferedCategories = [mathCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(spring, preferedCategories, SPRING);
	spring.push(course);
	
	// SCIENCE slot. Can be filled with MATH or CORE if no more science to take.
	preferedCategories = [scienceCourses, mathCourses, coreCourses];
	course = getAvailableCourse(spring, preferedCategories, SPRING);
	spring.push(course);

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(spring, preferedCategories, SPRING);	
	spring.push(course);

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(spring, preferedCategories, SPRING);	
	spring.push(course);
	
	// Check if added core twice make CI
	if (!ci) {
		checkForCI(winter, spring);
	}
	
	var courses = [fall, winter, spring];
	var sorted = sortSched(courses);
	return sorted;
}

function updateUsed(coursesTaken) {
	for (var i = 0; i < coursesTaken.length; i++) {
		used.push(coursesTaken[i]);
	}	
}

/* Picks the next course to take.
 * Parameters:
 * course[] quarterCourses (list of classes currently taking this quarter)
 * course[][] courseList (first index represents category in order of decreasing preference)
 * int quarter
 */
function getAvailableCourse(quarterCourses, courseList, quarter) {
	// Try to pick a course from the preferred category first
	for (var i = 0; i < courseList.length; i++) {
		// Go through the available courses in the current category
		for (var j = 0; j < courseList[i].length; j++) {	
			var course = courseList[i][j];
			// Make sure course can be added
			if (course.eligible(used, quarter)) {
				// Make sure course is in this quarter (or is a core course)
				if (course == core || $.inArray(course, quarterCourses) == -1) {
					return course;
				}
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
		var userCoen = [];
		var userScience = [];
		var userMath = [];
		var userCore = [];
		
		// Sort into categories
		for (var j = 0; j < schedule[i].length; j++) {
			switch (schedule[i][j].category) {
				case CATEGORY_MATH:
					 userMath.push(schedule[i][j]);
					break;
				case CATEGORY_SCIENCE:
					 userScience.push(schedule[i][j]);
					break;
				case CATEGORY_COEN:
					 userCoen.push(schedule[i][j]);
					break;
				case CATEGORY_CORE:
					 userCore.push(schedule[i][j]);
					break;
			}			
		}
		
		// TODO more second level organizing
		sorted.push(userCoen.concat(userMath).concat(userScience).concat(userCore));
		
		// Put ENG1 at the bottom of the list
		for (var j = 0; j < sorted[i].length; j++) {
			if (sorted[i][j] == eng1) {
				var temp = sorted[i].splice(j, 1);
				sorted[i].push(temp[0]);
				break;
			}
		}
		
	}
	return sorted;
}