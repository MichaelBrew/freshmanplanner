function buildWebSchedule(incomingCredits, sureOfMajor) {
	var coenCourses = [coen10, coen11, coen12];
	var mathCourses = [math9, math11, math12, math13, math14, amth108];
	var scienceCourses = [chem11]; // TODO there are easier / more logical classes out there
	var coreCourses = [ctw1, ctw2, ci1, ci2, rtc1, core];
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
	preferedCategories = [scienceCourses, coreCourses];
	course = getAvailableCourse(used, fall, preferedCategories, FALL);
	fall.push(course);

	// COEN slot.
	preferedCategories = [coenCourses, coreCourses];
	course = getAvailableCourse(used, fall, preferedCategories, FALL);	
	fall.push(course);

	// CTW slot. Hard-coded requirement
	preferedCategories = [coreCourses];
	course = getAvailableCourse(used, fall, preferedCategories, FALL);
	fall.push(course);

	// Update preqs based on classes taken in the fall
	updateUsed(used, fall);
	
	// Build winter schedule
	var winter = [];

	// MATH slot. Can be filled with COMM or CORE if no more math to take.
	preferedCategories = [mathCourses, commCourses, coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);
	winter.push(course);
	
	// CORE slot.
	preferedCategories = [coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);
	winter.push(course);

	// COEN slot. Can be filled with CORE if no more coen to take.
	preferedCategories = [coenCourses, coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);	
	winter.push(course);
	
	// CTW slot. Hard-coded requirement
	preferedCategories = [coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);	
	winter.push(course);
	
	// Update preqs based on classes taken in the fall
	updateUsed(used, winter);
	
	// Check if added core twice make CI
	var ci = checkForCI(fall, winter);
	
	// Add eng1 to fall or winter based on difficulty of sched or certainty of major
	addEngineering1(fall, winter, sureOfMajor, eng1);
		
	// Build spring schedule
	var spring = [];
	
	// MATH slot. Can be filled with COMM or CORE if no more math to take.
	preferedCategories = [mathCourses, commCourses, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);
	spring.push(course);
	
	// SCIENCE slot. Can be filled with CORE if no more science to take.
	preferedCategories = [scienceCourses, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);
	spring.push(course);

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);	
	spring.push(course);

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(used, spring, preferedCategories, SPRING);	
	spring.push(course);
	
	// Check if added core twice make CI
	if (!ci) {
		checkForCI(winter, spring);
	}
	
	var courses = [fall, winter, spring];
	return courses;
} 
