var numbers = new Array(0, 2, 14, 35, 23, 4, 16, 33, 21, 6, 18, 31, 19, 8, 12, 29, 25, 10, 27, 88, 1, 13, 36, 24, 3, 15, 34, 22, 5, 17, 32, 20, 7, 11, 30, 26, 9, 28);
var todayPattern = new Array(88, 32, 34, 23, 19, 15, 18, 36, 24, 27, 5, 35, 6, 19, 25, 36, 25, 29, 5, 14, 17, 33);
var red = new Array(1, 3, 36, 34, 5, 32, 7, 30, 9, 14, 23, 16, 21, 18, 19, 12, 25, 27);
var black = new Array(2, 35, 4, 33, 6, 31, 8, 29, 10, 13, 24, 15, 22, 17, 20, 11, 26, 28);
var seqMap = new Map();
var posList = new Array();
var lastSpin = new Array();
var db = [
	//new Array(16, 10, 28, 3, 6, 35, 16, 7, 16, 35, 25, 11, 2, 88, 30, 3, 26, 15, 12, 13, 16, 14, 34),
	//new Array(6, 88, 19, 24, 26, 34, 2, 6, 32, 20, 31, 8, 33, 34, 29, 6, 5, 34, 19, 1, 20, 12, 30)
];
var ongoingSpins = new Array();
db.push(ongoingSpins);

function init() {
	var slot = "<table style=\"position:relative;\"><tr>";
	for (var i = 1; i <= 36; i++) {
		slot += "<td align=\"center\"><input type=\"button\" onclick=\"addToOngoingSpin(this)\" value=\"" + i + "\" \/><\/td>";
		if (i % 6 == 0) {
			slot += "<\/tr><tr>";
		}
	}
	slot += "<tr><td colspan=\"3\" align=\"right\"><input type=\"button\" onclick=\"addToOngoingSpin(this)\" value=\"0\" \/><\/td>";
	slot += "<td colspan=\"2\" align=\"left\"><input type=\"button\" onclick=\"addToOngoingSpin(this)\" value=\"88\" \/>";
	slot += "<td align=\"center\"><img src=\"undo.png\" class=\"undo\" onclick=\"undoLast()\" height=\"15px\" width=\"15px\" href=\"#\"\/><\/td><\/tr>";
	slot += "<\/tr><\/table>";
	$("#slots").html(slot);
	initMap();
	applyColor();
}

function applyColor() {
	$.each($('input[type=button]'), function() {
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
	var print = "<table><tr>";
	var row = 0;
	ongoingSpins.forEach(function(v) {
		val.push(v);
	});

	val.reverse().forEach(function(v) {
		row += 1;
		print += "<td align=\"center\" class=\"";
		if (red.indexOf(parseInt(v)) != -1) {
			print += "redButton\">";
		} else if (black.indexOf(parseInt(v)) != -1) {
			print += "blackButton \">";
		} else {
			print += "greenButton \">";
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
		$(".undo").show();
		planNextMove();
		getSpecialSequence();
	}
}

function planNextMove(obj, spl) {
	var lastMove = spl || posList[0];
	var formation = formRollingSequence(ongoingSpins[ongoingSpins.length - 1]);
	var nextPositions = locateNextSlots(formation, obj ? parseInt(obj.value) : parseInt(lastMove));
	var row = 0;
	var print = "<table><tr>";
	//nextPositions = nextPositions.sort(function(a, b){return a-b});
	nextPositions.forEach(function(v) {
		row += 1;
		print += "<td class=\"";
		if (red.indexOf(parseInt(v)) != -1) {
			print += "redButton\">";
		} else if (black.indexOf(parseInt(v)) != -1) {
			print += "blackButton\">";
		} else {
			print += "greenButton\">";
		}
		print += v + "<\/td>"
		if (row % 12 == 0) {
			print += "<\/tr><tr>";
		}
		//print += v;
	});

	print += "<\/td><td>&nbsp;&nbsp;&nbsp;<\/td>";

	//	if (!obj) {
	lastSpin = lastSpin.sort(function(a, b) { return a - b });
	lastSpin.forEach(function(v) {
		print += "<td class=\"";
		if (red.indexOf(parseInt(v)) != -1) {
			print += "redButton\">";
		} else if (black.indexOf(parseInt(v)) != -1) {
			print += "blackButton\">";
		} else {
			print += "greenButton\">";
		}
		print += v + "<\/td>"
	});
	//}

	print += "<\/tr><\/table>";
	$("#next").html("<h5>Possible Next:&nbsp;<\/h5>" + print);
}

function formatForDisplay(array) {
	//not used now
	var print = "";
	if (array) {
		array.forEach(function(v) {
			if (print.length != 0) {
				print += " - ";
			}
			print += v;
		});
	}
	return print;
}

function getSpecialSequence() {
	var result = new Map();
	var lastMove = posList[0];
	if (lastMove != undefined) {
		seqMap.get(lastMove).forEach(function(v, k) {
			if (parseInt(v) != 0) {
				result.set(k, v);
			}
		});
		console.log("Spl. Seq..");
		console.log(result);
	}

	result.forEach(function(v, k) {
		$.each($('.patternButton'), function() {
			var i = parseInt($(this).attr("index"));
			//console.log('Attri:'+$('.patternButton[index='+(i+1)+']').val());
			if (parseInt($(this).val()) == k && parseInt($('.patternButton[index=' + (i + 1) + ']').val()) == lastMove) {
				var superMatch = confirmSequence(k, posList[0], posList[1]);
				$(this).addClass('specialSeq');
				if (superMatch) {
					$(this).addClass('confirmSeq');
				}
			}
		});
	});
}

function showSpinAnalysis() {
	//console.log("Started..");
	showSpin();
	var print = "";
	var moved = [];
	posList = [];
	db.forEach(function(list) {
		//console.log("list: "+ list);
		for (var i = list.length - 1; i > 0; i--) {
			var ret = getPositions(list[i], list[i - 1]);
			if (ret != -1) {
				moved.push(ret);
				posList.push(parseInt(ret));  //check to optimize. Everytime calculates all movements
			}
		}
		//print+="\n<br>";
	});

	saveSequence();

	var patternButton = "<table><tr>";
	var row = 0;
	var index = -1;
	var spinIndex = ongoingSpins.length - 1 || -1;
	moved.forEach(function(v) {
		index++;
		patternButton += "<td>" + "<font class=\"superScript\">" + ongoingSpins[spinIndex] + "<\/font>" + "<input type=\"button\" class=\"patternButton\" index=\"" + index + "\" onclick=\"planNextMove(this)\" value=\"" + v + "\" \/>";
		/*
		if (index == posList.length-1) {
			patternButton += "<font class=\"superScript\">"+ ongoingSpins[0] + "<\/font>";
		}
		*/
		patternButton += "</td>";
		
		row += 1;
		spinIndex--;
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

	//Display calculated buttons
	var patternCalc = "<table><tr>";
	var indexforCalc = -1;
	if (posList.length > 1) {
		if (posList[0] != undefined && posList[1] != undefined) {
			var f = parseInt(posList[0]);
			var s = parseInt(posList[1]);
			var disNum = 0;
			//+1
			disNum = ((f + 1) % 9);
			indexforCalc++;
			patternCalc += "<td>"+"<font class=\"superScript\">"+"+1&nbsp;"+"<\/font>"+"<input type=\"button\" class=\"patternCalcButton\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
			//+2
			disNum = ((f + 2) % 9);
			indexforCalc++;
			patternCalc += "<td>"+"<font class=\"superScript\">"+"+2&nbsp;"+"<\/font>"+"<input type=\"button\" class=\"patternCalcButton\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
			//subtract
			if (f > s) {
				disNum = ((f - s) % 9);
			} else {
				disNum = ((s - f) % 9);
			}
			indexforCalc++;
			patternCalc += "<td>"+"<font class=\"superScript\">"+"Sub&nbsp;"+"<\/font>"+"<input type=\"button\" class=\"patternCalcButton\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
			//add
			disNum = ((f + s) % 9);
			indexforCalc++;
			patternCalc += "<td>"+"<font class=\"superScript\">"+"Add&nbsp;"+"<\/font>"+"<input type=\"button\" class=\"patternCalcButton\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
			//Half
			if (f % 2 == 0) {
				disNum = ((f / 2));
				indexforCalc++;
				patternCalc += "<td>"+"<font class=\"superScript\">"+"Half&nbsp;"+"<\/font>"+"<input type=\"button\" class=\"patternCalcButton\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
			}
			//duplicate
		}
		patternCalc += "<\/tr><\/table>";
		$("#patternCalc").html("<h5>Possible Calc:&nbsp;<\/h5>" + patternCalc);
	}	
	
}

function confirmSequence(f, s, t) {
	console.log("f:" + f + " s:" + s + " t:" + t);
	var found = false;
	var i = 0;
	if (f === undefined || s === undefined || t === undefined) {
		return found;
	}

	if (posList) {
		var diff = -1;
		for (var i = 3; i < posList.length; i++) {
			if (posList[i + 1] !== undefined && (posList[i] == parseInt(f) && posList[i + 1] == parseInt(s))) {
				console.log("v:" + posList[i] + " i:" + i + " posList[i + 1]:" + posList[i + 1] + " posList[i + 2]" + posList[i + 2]);
				if (posList[i + 2] !== undefined && diff == -1) {
					if (parseInt(t) >= posList[i + 2]) {
						diff = parseInt(t) - posList[i + 2];
					} else {
						diff = posList[i + 2] - parseInt(t);
					}

					if (diff == 0 || diff == 1) {
						found = true;
					}
				}
			}
		};
	}
	return found;
}


function saveSequence() {
	if (seqMap && seqMap.size > 0) {
		if (posList.length > 1) {
			//console.log("posList.length:"+posList);
			//console.log(posList);
			var val = seqMap.get(posList[1]).get(posList[0]);
			seqMap.get(posList[1]).set(posList[0], ++val);
		}
	}
	console.log("After update.. Seq. Map");
	console.log(seqMap);
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
	//temp-flipflow
	if ($('#fs').is(":checked") && moves > 9) {
		moves = 19 - moves;
	}

	//console.log("moves:"+ moves);
	return moves;
}

function initMap() {
	var arr = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19);
	arr.forEach(function(v) {
		var m = new Map();
		for (var i = 0; i < 20; i++) {
			m.set(i, 0);
		}
		seqMap.set(v, m);
	});
	console.log("Seq Map initialized....");
	console.log(seqMap);
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

function locateNextSlots(formation, moves) {
	var positions = [];
	lastSpin = [];
	//positions.push(formation[0]);
	lastSpin.push(parseInt(formation[0]));
	for (var i = 1; i <= 38; i++) {
		//if (i == moves || i == (19 - moves) || i == (19 + moves) || i == (38 - moves)) {
		if (i == 19) {
			lastSpin.push(parseInt(formation[i]));
		}
		if (i == moves || i == (19 - moves) || i == (19 + moves) || i == (38 - moves)) {
			if (i < 38) {
				positions.push(parseInt(formation[i]));
			}
		}
	}
	//console.log("next:" + positions);
	return positions;
}

function checkReload() {
	if (confirm("Spin Details will be lost. Do you want to refresh ??")) {
		window.location.reload();
	} else {
		return '';
	}
}

function undoLast() {
	ongoingSpins.pop();
	showSpinAnalysis();
	planNextMove();
	$(".undo").hide();
	getSpecialSequence();
}