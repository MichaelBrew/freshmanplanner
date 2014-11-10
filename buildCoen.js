function buildCoenSchedule(incomingCredits, sureOfMajor) {
	var coenCourses = [coen10, coen11, coen12, coen19];
	var mathCourses = [math9, math11, math12, math13, math14, amth106, amth108, math53];
	var scienceCourses = [chem11, phys31, phys32];
	var coreCourses = [ctw1, ctw2, core]; 

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

	// COEN slot.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
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

	// MATH slot. Can be filled with SCIENCE or CORE if no more math to take.
	preferedCategories = [mathCourses, scienceCourses, coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);
	winter.push(course);
	
	// SCIENCE slot. Can be filled with CORE if no more science to take.
	preferedCategories = [scienceCourses, coreCourses];
	course = getAvailableCourse(used, winter, preferedCategories, WINTER);
	winter.push(course);

	// COEN slot. Can be filled with SCIENCE or CORE if no more coen to take.
	preferedCategories = [coenCourses, scienceCourses, coreCourses];
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
	
	// MATH slot. Can be filled with SCIENCE or CORE if no more math to take.
	preferedCategories = [mathCourses, scienceCourses, coreCourses];
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

/* Make two consecutive CORE's a C&I sequence.
 * Returns true if made a C&I sequence, else false.
 */
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