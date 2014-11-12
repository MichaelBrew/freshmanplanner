/* Main entry point for building the freshman schedule. */
function buildSchedule(major, incomingCredits) {
	var sched = [];
	if (major == MAJOR_COEN) {
		sched = buildCoenSchedule(incomingCredits);
	} else if (major == MAJOR_WEB) {
		sched = buildWebSchedule(incomingCredits);
	}
	var sorted = sortSched(sched);
	return sorted;
}

function updateUsed(used, coursesTaken) {

	// Look for chem11 or a chem11 sub
	if ($.inArray(chem11, coursesTaken) == -1) {
		for (var i = 0; i < coursesTaken.length; i++) {
			if ($.inArray(coursesTaken[i], chem11Subs) != -1) {
				used.push(chem11);
				coursesTaken.splice(i, 1);
				break;
			}
		}
	}

	// Look for a amth106 sub
	for (var i = 0; i < coursesTaken.length; i++) {
		if ($.inArray(coursesTaken[i], amth106Subs) != -1) {
			used.push(amth106);
			coursesTaken.splice(i, 1);
			break;
		}
	}


	for (var i = 0; i < coursesTaken.length; i++) {
		used.push(coursesTaken[i]);
	}	
}

/* Picks the next course to take.
 * Parameters:
 * course[] used (list of courses already taken in previous quarters)
 * course[] quarterCourses (list of classes currently taking this quarter)
 * course[][] courseList (first index represents category in order of decreasing preference)
 * int quarter
 */
function getAvailableCourse(used, quarterCourses, courseList, quarter) {
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
function addEngineering1(fall, winter, eng1) {

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