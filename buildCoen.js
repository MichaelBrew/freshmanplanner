function buildCoenSchedule(incomingCredits) {
	var coenCourses = [coen10, coen11, coen12, coen19];
	var mathCourses = [math9, math11, math12, math13, math14, amth106, amth108, math53];
	var scienceCourses = [chem11, phys31, phys32];
	var coreCourses = [core]; 

	var used = [];

	// add transfer courses
	updateUsed(used, incomingCredits);

	// Build fall schedule
	var fall = [];
	
	// MATH slot. Can be filled with CORE if no more math to take.
	var preferedCategories = [mathCourses, coreCourses];
	var course = getAvailableCourse(used, fall, preferedCategories, FALL);
	fall.push(course);

	// SCIENCE slot. Can be filled with CORE if no more science to take.
	preferedCategories = [scienceCourses, coreCourses];
	course = getAvailableCourse(used, fall, preferedCategories, FALL);
	fall.push(course);

	// COEN slot. Prefer not to advance past coen10
	preferedCategories = [[coen10], coreCourses];
	course = getAvailableCourse(used, fall, preferedCategories, FALL);	
	fall.push(course);

	// CTW slot. Hard-coded requirement
	fall.push(ctw1);

	// Update preqs based on classes taken in the fall
	updateUsed(used, fall);
	
	// Build winter schedule
	var winter = [];

	// MATH slot. Can be filled with SCIENCE or CORE if no more math to take.
	preferedCategories = [mathCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);
	winter.push(course);
	
	// SCIENCE slot. Can be filled with CORE if no more science to take.
	preferedCategories = [scienceCourses, coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);
	winter.push(course);

	// COEN slot. Prefer not to advance past coen11
	preferedCategories = [[coen11], coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);	
	winter.push(course);
	
	// CTW slot. Hard-coded requirement
	winter.push(ctw2);
	
	// Update preqs based on classes taken in the fall
	updateUsed(used, winter);
	
	// Check if added core twice make CI
	var ci = checkForCI(fall, winter);
	
	// Add eng1 to fall or winter based on difficulty of sched or certainty of major
	addEngineering1(fall, winter, eng1);
		
	// Build spring schedule
	var spring = [];
	
	// MATH slot. Can be filled with SCIENCE or CORE if no more math to take.
	preferedCategories = [mathCourses, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);
	spring.push(course);
	
	// SCIENCE slot. Can be filled with CORE if no more science to take.
	preferedCategories = [scienceCourses, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);
	spring.push(course);

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [[coen12], coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);	
	spring.push(course);

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [[coen19], coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);	
	spring.push(course);
	
	// Check if added core twice make CI
	if (!ci) {
		checkForCI(winter, spring);
	}
	
	var courses = [fall, winter, spring];
	return courses;
}

/* Make two consecutive CORE's a C&I sequence.
 * Attempts to put the sequence on the same row.
 * Returns true if made a C&I sequence, else false.
 */
function checkForCI(quarter1Courses, quarter2Courses) {
	var q1Core = [];
	var q2Core = [];
	for (var i = 0; i < quarter1Courses.length; i++) {
		if (quarter1Courses[i] == core) {
			q1Core.push(i);
		}
	}
	for (var i = 0; i < quarter2Courses.length; i++) {
		if (quarter2Courses[i] == core) {
			// found a common row
			if ($.inArray(i, q1Core) != -1) {
				quarter1Courses[i] = ci1;
				quarter2Courses[i] = ci2;
				return true;
			}
			q2Core.push(i);
		}
	}

	// No common row. See if both quarters have core
	if (q1Core.length > 0 && q2Core.length > 0) {
		// Cant align C&I, just put in first available rows
		quarter1Courses[q1Core[0]] = ci1;
		quarter2Courses[q2Core[0]] = ci2;
		return true;
	}

	return false;
}