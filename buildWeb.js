function buildWebSchedule(incomingCredits) {
	var mathCourses = [math9, math11, math12, math13, math14, amth108];
	var scienceCourses = [chem11];
	var coreCourses = [core];
	var commCourses = [comm2, comm12, comm30];

	var used = [];

	if (hasNaturalScience(incomingCredits)) {
		scienceCourses = [];
	}

	// add transfer courses
	updateUsed(used, incomingCredits);

	// Build fall schedule
	var fall = [];
	
	var q1Comm = [getAvailableCourse(used, fall, [commCourses], FALL)];
	// MATH slot. Can be filled with COMM or CORE if no more math to take.
	var preferedCategories = [mathCourses, q1Comm, coreCourses];
	var course = getAvailableCourse(used, fall, preferedCategories, FALL);
	fall.push(course);

	// SCIENCE slot. Can be filled with CORE if no more science to take.
	preferedCategories = [scienceCourses, q1Comm, coreCourses];
	course = getAvailableCourse(used, fall, preferedCategories, FALL);
	fall.push(course);

	// COEN slot.
	preferedCategories = [[coen10], q1Comm, coreCourses];
	course = getAvailableCourse(used, fall, preferedCategories, FALL);	
	fall.push(course);

	// CTW slot. Hard-coded requirement
	fall.push(ctw1);

	// Update preqs based on classes taken in the fall
	updateUsed(used, fall);
	
	// Build winter schedule
	var winter = [];

	var q2Comm = [getAvailableCourse(used, winter, [commCourses], WINTER)];
	// MATH slot. Can be filled with COMM or CORE if no more math to take.
	preferedCategories = [mathCourses, q2Comm, coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);
	winter.push(course);
	
	// CI1 slot. Hard-coded requirement
	winter.push(ci1);

	// COEN slot. Can be filled with COMM or CORE if no more coen to take.
	preferedCategories = [[coen11], q2Comm, coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);	
	winter.push(course);
	
	// CTW1 slot. Hard-coded requirement
	winter.push(ctw2);
	
	// Update preqs based on classes taken in the fall
	updateUsed(used, winter);
	
	// Add eng1 to fall or winter based on difficulty of sched or certainty of major
	addEngineering1(fall, winter, eng1);
		
	// Build spring schedule
	var spring = [];
	
	var q3Comm = [getAvailableCourse(used, spring, [commCourses], SPRING)];
	// MATH slot. Can be filled with COMM or CORE if no more math to take.
	preferedCategories = [mathCourses, q3Comm, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);
	spring.push(course);
	
	// CI2 slot. Hard-coded requirement
	spring.push(ci2);

	// COEN slot. Can be filled with COMM or CORE if no more coen to take.
	preferedCategories = [[coen12], q3Comm, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);	
	spring.push(course);

	// COEN slot. Can be filled with COMM or CORE if no more coen to take.
	preferedCategories = [[coen19], q3Comm, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);	
	spring.push(course);
	
	var courses = [fall, winter, spring];
	return courses;
} 

function hasNaturalScience(incomingCredits) {
	for (var i = 0; i < naturalScience.length; i++) {
		if ($.inArray(naturalScience[i], incomingCredits) != -1) {
			return true;
		}
	}
	return false;
}
