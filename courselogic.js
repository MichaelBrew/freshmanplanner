var selectedMajor = "";
var currentStep = 0;

function moveToAp() {
    currentStep = 1;

    $( "#pickApDiv" ).animate({
        opacity: 1.0
    }, 500);

    $( "#pickApDiv" ).find("button").prop("disabled", false);

    $('html, body').animate({
        scrollTop: $( "#pickApDiv" ).offset().top
    }, 1000);
}

function moveToTransfer() {
    currentStep = 2;

    $( "#pickTransferCreditsDiv" ).animate({
        opacity: 1.0
    }, 500);

    $( "#pickTransferCreditsDiv" ).find("input").prop("disabled", false);

    $('html, body').animate({
        scrollTop: $( "#pickTransferCreditsDiv" ).offset().top
    }, 1000);
}

function moveToCalcReadiness() {
    currentStep = 3;

    $( "#calcReadyDiv" ).animate({
        opacity: 1.0
    }, 500);

    $( "#calcReadyDiv" ).find("button").prop("disabled", false);

    $('html, body').animate({
        scrollTop: $( "#calcReadyDiv" ).offset().top
    }, 1000);
}

function moveToSchedule() {
    currentStep = 4;

    $( "#viewScheduleDiv" ).animate({
        opacity: 1.0
    }, 500);

    $('html, body').animate({
        scrollTop: $( "#viewScheduleDiv" ).offset().top
    }, 1000);
}

/*******************/
/* MAJOR SELECTION */
/*******************/

// Hover functions
$( "#coenMajor" ).hover(function() {
    if (!(selectedMajor == "coen")) {
        $( this ).css("background", "#B2E0FF");
    }
}, function() {
    if (!(selectedMajor == "coen")) {
        $( this ).css("background", "#CAD0D5");
    }
});

$( "#webMajor" ).hover(function() {
    if (!(selectedMajor == "web")) {
        $( this ).css("background", "#B2E0FF");
    }
}, function() {
    if (!(selectedMajor == "web")) {
        $( this ).css("background", "#CAD0D5");
    }
});

// Click down functions
$( "#coenMajor" ).mousedown(function() {
    if (!(selectedMajor == "coen")) {
        $( this ).css("background", "#8EB3CC");
    }
});

$( "#webMajor" ).mousedown(function() {
    if (!(selectedMajor == "web")) {
        $( this ).css("background", "#8EB3CC");
    }
});

// Full click functions
$( "#coenMajor" ).click(function() {
    selectedMajor = "coen";

    $( this ).css("background","#B2E0FF");
    $( this ).css("font-weight", "bold");

    $( "#webMajor" ).css("background","#CAD0D5");
    $( "#webMajor" ).css("border", "none");
    $( "#webMajor" ).css("font-weight", "normal");
});

$( "#webMajor" ).click(function() {
    selectedMajor = "web";

    $( this ).css("background","#B2E0FF");
    $( this ).css("font-weight", "bold");

    $( "#coenMajor" ).css("background","#CAD0D5");
    $( "#coenMajor" ).css("border", "none");
    $( "#coenMajor" ).css("font-weight", "normal");
});

$( "#yesMayChangeMajorButton" ).click(function() {
	updateSchedule();
    if (currentStep == 0) {
        moveToAp();
    }
});

$( "#noMayChangeMajorButton" ).click(function() {
	updateSchedule();
    if (currentStep == 0) {
        moveToAp();
    }
});

/****************/
/* AP SELECTION */
/****************/
$( ".apScoreNums" ).click(function() {
    updateApScores();
})

$( "#doneApButton" ).click(function() {
    moveToTransfer();
});

/**********************/
/* TRANSFER SELECTION */
/**********************/

$( ".transferCreditCheck" ).click(function() {
    updateTransferCredits();
})

$( "#doneTransferButton" ).click(function() {
    moveToCalcReadiness();
});

/*****************************/
/* CALC REAADINESS SELECTION */
/*****************************/

$( "#calcReady9Button" ).click(function() {
    updateSchedule();
    moveToSchedule();
});

$( "#calcReady11Button" ).click(function() {
    updateSchedule();
    moveToSchedule();
});


/***********/
/* GENERAL */
/***********/

(function disableElements() {
    // TODO: Probably shouldn't hardcode eq(x)
    var children = $( "#content" ).children();

    $(children[1]).css("opacity", 0.2);
    $(children[1]).find("button").prop("disabled", true);
    $(children[2]).css("opacity", 0.2);
    $(children[2]).find("input").prop("disabled", true);
    $(children[3]).css("opacity", 0.2);
    $(children[3]).find("button").prop("disabled", true);
    $(children[4]).css("opacity", 0.2);
}());