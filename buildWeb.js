function buildWebSchedule(incomingCredits, sureOfMajor) {
	var mathCourses = [math9, math11, math12, math13, math14, amth108];
	var scienceCourses = [chem11]; // TODO there are easier / more logical classes out there
	var coreCourses = [core];
	var commCourses = [comm2, comm12, comm30];

	var used = [];

	// add transfer courses
	updateUsed(used, incomingCredits);

	// Build fall schedule
	var fall = [];
	
	// MATH slot. Can be filled with COMM or CORE if no more math to take.
	var preferedCategories = [mathCourses, commCourses, coreCourses];
	var course = getAvailableCourse(used, fall, preferedCategories, FALL);
	fall.push(course);

	// SCIENCE slot. Can be filled with CORE if no more science to take.
	preferedCategories = [scienceCourses, commCourses, coreCourses];
	course = getAvailableCourse(used, fall, preferedCategories, FALL);
	fall.push(course);

	// COEN slot.
	preferedCategories = [[coen10], commCourses, coreCourses];
	course = getAvailableCourse(used, fall, preferedCategories, FALL);	
	fall.push(course);

	// CTW slot. Hard-coded requirement
	fall.push(ctw1);

	// Update preqs based on classes taken in the fall
	updateUsed(used, fall);
	
	// Build winter schedule
	var winter = [];

	// MATH slot. Can be filled with COMM or CORE if no more math to take.
	preferedCategories = [mathCourses, commCourses, coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);
	winter.push(course);
	
	// CI1 slot. Hard-coded requirement
	winter.push(ci1);

	// COEN slot. Can be filled with COMM or CORE if no more coen to take.
	preferedCategories = [[coen11], commCourses, coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);	
	winter.push(course);
	
	// CTW1 slot. Hard-coded requirement
	winter.push(ctw2);
	
	// Update preqs based on classes taken in the fall
	updateUsed(used, winter);
	
	// Add eng1 to fall or winter based on difficulty of sched or certainty of major
	addEngineering1(fall, winter, sureOfMajor, eng1);
		
	// Build spring schedule
	var spring = [];
	
	// MATH slot. Can be filled with COMM or CORE if no more math to take.
	preferedCategories = [mathCourses, commCourses, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);
	spring.push(course);
	
	// CI2 slot. Hard-coded requirement
	spring.push(ci2);

	// COEN slot. Can be filled with COMM or CORE if no more coen to take.
	preferedCategories = [[coen12], commCourses, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);	
	spring.push(course);

	// COEN slot. Can be filled with COMM or CORE if no more coen to take.
	preferedCategories = [[coen19], commCourses, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);	
	spring.push(course);
	
	var courses = [fall, winter, spring];
	return courses;
} 
