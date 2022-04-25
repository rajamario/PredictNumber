var numbers = new Array(0, 2, 14, 35, 23, 4, 16, 33, 21, 6, 18, 31, 19, 8, 12, 29, 25, 10, 27, 88, 1, 13, 36, 24, 3, 15, 34, 22, 5, 17, 32, 20, 7, 11, 30, 26, 9, 28);
var todayPattern = new Array(88, 32, 34, 23, 19, 15, 18, 36, 24, 27, 5, 35, 6, 19, 25, 36, 25, 29, 5, 14, 17, 33);
var red = new Array(1,3,36,34,5,32,7,30,9,14,23,16,21,18,19,12,25,27);
var black = new Array(2,35,4,33,6,31,8,29,10,13,24,15,22,17,20,11,26,28);
var db = [
	//new Array(16, 10, 28, 3, 6, 35, 16, 7, 16, 35, 25, 11, 2, 88, 30, 3, 26, 15, 12, 13, 16, 14, 34),
	//new Array(6, 88, 19, 24, 26, 34, 2, 6, 32, 20, 31, 8, 33, 34, 29, 6, 5, 34, 19, 1, 20, 12, 30)
];
var ongoingSpins = new Array();
db.push(ongoingSpins);

function showSlots() {
	var slot = "<table style=\"position:relative;\"><tr>";
	for (var i = 1; i <= 36; i++) {
		slot += "<td align=\"center\"><input type=\"button\" onclick=\"addToOngoingSpin(this)\" value=\"" + i + "\" \/><\/td>";
		if (i % 6 == 0) {
			slot+= "<\/tr><tr>";
		}
	}
	slot += "<tr><td colspan=\"3\" align=\"right\"><input type=\"button\" onclick=\"addToOngoingSpin(this)\" value=\"0\" \/><\/td>";
	slot += "<td colspan=\"3\" \"left\"><input type=\"button\" onclick=\"addToOngoingSpin(this)\" value=\"88\" \/><\/td><\/tr>";
	slot += "<\/tr><\/table>";
	$("#slots").html(slot);
	applyColor();
}

function applyColor(){
	$.each($('input[type=button]'),function(){
		if (red.indexOf(parseInt($(this).val())) != -1) {
			$(this).addClass('redButton');
		} else if (black.indexOf(parseInt($(this).val())) != -1) {
			$(this).addClass('blackButton');
		} else {
			$(this).addClass('greenButton');
		}
		console.log();
	})
}

function showSpin() {
	var val = [];
	var print="<table><tr>";
	var row=0;
	ongoingSpins.forEach(function(v) {
		val.push(v);
	});

	val.reverse().forEach(function(v) {
		row+=1;
		print += "<td align=\"center\" class=\"spinHistory";
		if (red.indexOf(parseInt(v)) != -1) {
			print += " redButton \">";
		} else if (black.indexOf(parseInt(v)) != -1) {
			print += " blackButton \">";
		} else {
			print += " greenButton \">";
		} 
		print += v + "<\/td>"
		if (row % 14 == 0) {
			print += "<\/tr><tr>";
		}
		//print += v;
	});
	print += "<\/tr><\/table>";
	
	$("#currSpin").html("<h5>Ongoing Spins:&nbsp;<\/h5>" + print);
}

function addToOngoingSpin(obj) {
	if ($(obj).val()) {
		ongoingSpins.push(parseInt($(obj).val()));
		db.pop();
		db.push(ongoingSpins);
		showSpinAnalysis();
		applyColor();
	}
}

function planNextMove(obj){
	var formation = formRollingSequence(ongoingSpins[ongoingSpins.length-1]);
	var nextPositions = locateSlots(formation, parseInt(obj.value));
	var row = 0;
	var print="<table><tr>";
	//nextPositions = nextPositions.sort();
	nextPositions.forEach(function(v) {
		row+=1;
		print += "<td class=\"spinHistory";
		if (red.indexOf(parseInt(v)) != -1) {
			print += " redButton \">";
		} else if (black.indexOf(parseInt(v)) != -1) {
			print += " blackButton \">";
		} else {
			print += " greenButton \">";
		} 
		print += v + "<\/td>"
		if (row % 12 == 0) {
			print += "<\/tr><tr>";
		}
		//print += v;
	});
	print += "<\/tr><\/table>";
	$("#next").html("<h5>Possible Next:&nbsp;<\/h5>"+ print);
}

function formatForDisplay(array){
	//not used now
	var print = "";
	if (array) {
		array.forEach(function(v) {
			if (print.length != 0) {
				print += " - ";
			}
			print += v ;
		});
	}
	return print;
}

function showSpinAnalysis() {
	//console.log("Started..");
	showSpin();
	var print = "";
	var moved = [];
	db.forEach(function(list) {
		//console.log("list: "+ list);
		for (var i = list.length - 1; i > 0; i--) {
			var ret = getPositions(list[i], list[i - 1]);
			if (ret != -1) {
				moved.push(ret);
			}
		}
		//print+="\n<br>";
	});
	var patternButton ="<table><tr>";
	var row=0;
	moved.forEach(function(v) {
		patternButton += "<td><input type=\"button\" class=\"patternButton\" onclick=\"planNextMove(this)\" value=\""+ v +"\" \/></td>";
		row += 1;
		if (row % 6 == 0) {
			patternButton += "<\/tr><tr>";
		}
		print += v + " - ";
	});
	patternButton += "<\/tr><\/table>";
	//console.log(print);
	if (patternButton.length > 0) {
		$("#patternFlow").html("<h5>Pattern:&nbsp;<\/h5>" + patternButton);
	} else {
		$("#patternFlow").html("Need more Spins to identify pattern....");
	}
}


function getPositions(start, end) {
	var count = false;
	var moves = -1;
	var seq = formRollingSequence(start);
	//console.log("seq:"+seq);
	if (seq) {
		seq.forEach(function(num) {
			if (num == start) {
				count = true;
			}
			if (count) {
				moves++;
			}
			if (num == end) {
				count = false;
			}
		});
	}
	if (moves >= 19) {
		moves = 38 - moves;
	}
	//console.log("moves:"+ moves);
	return moves;
}

function formRollingSequence(startNum) {
	var startIndex = numbers.indexOf(startNum);
	var formation = [];
	if (startIndex != -1) {
		var k = startIndex;
		for (; k < 38; k++) {
			formation.push(numbers[k]);
		}
		if (formation.length != 38) {
			for (var l = 0; l < startIndex; l++) {
				formation.push(numbers[l]);
			}
		}
	}
	//console.log("formation:" + formation);
	return formation;
}

function locateSlots(formation, moves) {
	var positions = [];
	//positions.add(formation.get(0));
	for (var i = 1; i <= 38; i++) {
		if (i == moves || i == (19 - moves) || i == (19 + moves) || i == (38 - moves)) {
			if (i < 38) {
				positions.push(formation[i]);
			}
		}
	}
	//console.log("next:" + positions);
	return positions;
}

function checkReload(){
	if(confirm("Spin Details will be lost. Do you want to refresh ??")){
		window.location.reload();
	} else {
		return '';
	}	
}