// TODO enum instead
var PRE = -1;
var FALL = 0;
var WINTER = 1;
var SPRING = 2;

// TODO enum instead
var CATEGORY_MATH = 0;
var CATEGORY_SCIENCE = 1;
var CATEGORY_COEN = 2;
var CATEGORY_CORE = 3;

var MAJOR_COEN = 0;
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
	this.eligible = function(usedCourses, quarter) {
			if (!availableQuarters[quarter]) {
				return false;
			}

			// Always able to add CORE classes
			if (this == core) {
				return true;
			}

			// If this is already used, can't add again
			if ($.inArray(this, usedCourses) != -1) {
				return false;
			}

			// check if all prereqs fulfilled
			var prereqDone = true;
			for (var i = 0; i < this.prereqs.length; i++) {
				if ($.inArray(this.prereqs[i], usedCourses) == -1) {
					prereqDone = false;
					break;
				}
			}
			return prereqDone;
		};
}

var eng1 = new course("ENGR 1", CATEGORY_COEN, [true, true, false], []);

var coen10 = new course("COEN 10", CATEGORY_COEN, [true, false, false], []);
var coen11 = new course("COEN 11", CATEGORY_COEN, [true, true, true], [coen10]);
var coen12 = new course("COEN 12", CATEGORY_COEN, [true, true, true], [coen10, coen11]);
var coen19 = new course("COEN 19", CATEGORY_COEN, [false, false, true], []);
var coenCourses = [coen10, coen11, coen12, coen19];

var math9 = new course("MATH 9", CATEGORY_MATH, [true, false, false], []);
var math11 = new course("MATH 11", CATEGORY_MATH, [true, true, true], [math9]);
var math12 = new course("MATH 12", CATEGORY_MATH, [true, true, true], [math9, math11]);
var math13 = new course("MATH 13", CATEGORY_MATH, [true, true, true], [math9, math11, math12]);
var math14 = new course("MATH 14", CATEGORY_MATH, [true, true, true], [math9, math11, math12, math13]);
var math53 = new course("MATH 53", CATEGORY_MATH, [false, true, true], [math9, math11, math12, math13]);
var amth106 = new course("AMTH 106", CATEGORY_MATH, [true, true, true], [math9, math11, math12, math13, math14]);
var amth108 = new course("AMTH 108", CATEGORY_MATH, [true, true, true], [math9, math11, math12, math13, math14]);

var mathCourses = [math9, math11, math12, math13, math14, amth106, amth108, math53];

var biol18 = new course("BIOL 18", CATEGORY_SCIENCE, [false, false, false], []);
var biol21 = new course("BIOL 21", CATEGORY_SCIENCE, [false, false, false], []);
var chem11 = new course("CHEM 11", CATEGORY_SCIENCE, [true, false, false], []);
var chem12 = new course("CHEM 12", CATEGORY_SCIENCE, [false, false, false], [chem11]);
var envs21 = new course("ENVS 21", CATEGORY_SCIENCE, [false, false, false], []);
var phys31 = new course("PHYS 31", CATEGORY_SCIENCE, [false, true, false], [math11]);
var phys32 = new course("PHYS 32", CATEGORY_SCIENCE, [false, false, true], [phys31]); 
var phys34 = new course("PHYS 34", CATEGORY_SCIENCE, [false, false, false], []);
var scienceCourses = [chem11, phys31, phys32];

var chem11Subs = [biol18, envs21, phys34];
var amth106Subs = chem11Subs.concat([chem12, biol21]);

var ctw1 = new course("CTW 1", CATEGORY_CORE, [true,false,false], []);
var ctw2 = new course("CTW 2", CATEGORY_CORE, [false,true,false], [ctw1]);
var core = new course("CORE", CATEGORY_CORE, [true,true,true], []);
var coreCourses = [ctw1, ctw2, core]; 

