var numbers = new Array(0, 2, 14, 35, 23, 4, 16, 33, 21, 6, 18, 31, 19, 8, 12, 29, 25, 10, 27, 88, 1, 13, 36, 24, 3, 15, 34, 22, 5, 17, 32, 20, 7, 11, 30, 26, 9, 28);
var todayPattern = new Array(88, 32, 34, 23, 19, 15, 18, 36, 24, 27, 5, 35, 6, 19, 25, 36, 25, 29, 5, 14, 17, 33);
var red = new Array(1, 3, 36, 34, 5, 32, 7, 30, 9, 14, 23, 16, 21, 18, 19, 12, 25, 27);
var black = new Array(2, 35, 4, 33, 6, 31, 8, 29, 10, 13, 24, 15, 22, 17, 20, 11, 26, 28);
var seqMap = new Map();
var posList = new Array();
var lastSpin = new Array();
var nextAll = new Array();
var nextSelected = new Array();
var dynPatMap = new Map();
var repeatMap = new Map();
//d-double, h-half, s-subtract, a-addition, l-last, nm-number match, u1-up 1pos, d1-down 1pos, 1s-1st pos, d2- down 2pos, u2- up 2pos, 7-7th pos
var dynPatterns = new Array("d","h","s","a","l","u1","d1","1s", "7p", "9p","pv");
//var dynPatterns = new Array("d","h","s","a","l","u1","d1","1s", "7p", "9p", "nm");      
var minRepeat = 1;
var notSeenCount = 16;
var wins = new Array();
var possibleNumbersMap = new Map();
var nextHistoryMap = new Map();
var currNum = -1;
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
	})
}

function showSpin() {
	var val = [];
	var print = "<table><tr>";
	var row = 0;
	ongoingSpins.forEach(function(v) {
		val.push(v);
	});

	val.reverse().forEach(function(v,i) {
		row += 1;
		print += "<td align=\"center\" ondblclick=\"selectWin(this);\" index=\"" + i + ":" + v + "\" class=\"";
		if (red.indexOf(parseInt(v)) != -1) {
			print += "redButton";
		} else if (black.indexOf(parseInt(v)) != -1) {
			print += "blackButton";
		} else {
			print += "greenButton";
		}
		
		if (currNum != -1 && i != 0) {
			if (currNum === parseInt(v)) {
				print += " markLast";
			}

			if (i != 1 && parseInt(val[1]) === parseInt(v) && (currNum === val[i-1] || currNum === val[i+1])) {
				print += " markPair";
			}
		}
		
		if(currNum != -1){
			//Sequence Possibility
			var matchedIndex = verifyNumSeq(val,1, 3);
			//console.log("matchedIndexes.."+ matchedIndex);
			if (matchedIndex != [] && matchedIndex.indexOf(i) != -1) {
				//console.log("1 Num Seq:: i:"+i);
				//print += " blink";
				print += " markSeq1";
			}
			
			matchedIndex = verifyNumSeq(val, 10, 6);
			//console.log("matchedIndexes.."+ matchedIndex);
			if (matchedIndex != [] && matchedIndex.indexOf(i) != -1) {
				//console.log("10 num Seq:: i:"+i);
				//print += " blink";
				print += " markSeq10";
			}
			
			
		}
		
		if(wins.indexOf(parseInt(v)) != -1){
			print += " markWon\">";
		} else {
			print += "\">";
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

function verifyNumSeq(ongoingNums, nthSeq, lpCount){
	//console.log("received:" + ongoingNums);
	var seqFound = [];
	if (ongoingNums.length >= 9) {
		for (var i = 0; i < 3; i++) {
			if (nthSeq == 1) {
				for (var j = 1; j <= lpCount; j++) {
					if ((parseInt(ongoingNums[i]) - parseInt(ongoingNums[i + j]) == nthSeq) || (parseInt(ongoingNums[i + j]) - parseInt(ongoingNums[i]) == nthSeq)) {
						if (seqFound.indexOf(i) == -1) { seqFound.push(i); }
						if (seqFound.indexOf(i + j) == -1) { seqFound.push(i + j); }
					}
					//console.log("1st Seq::  i:" + i + " Num:" + ongoingNums[i] + " :::  " + currNum + " ::: SeqFound:" + seqFound);
				}
			}
			if (nthSeq == 10) {
				for (var j = 1; j <= lpCount; j++) {
					//if ((parseInt(ongoingNums[i]) - parseInt(ongoingNums[i + j]) == 10) || (parseInt(ongoingNums[i + j]) - parseInt(ongoingNums[i]) == 10) || (parseInt(ongoingNums[i]) - parseInt(ongoingNums[i + j]) == 20) || (parseInt(ongoingNums[i + j]) - parseInt(ongoingNums[i]) == 20) || (parseInt(ongoingNums[i]) - parseInt(ongoingNums[i + j]) == 30) || (parseInt(ongoingNums[i + j]) - parseInt(ongoingNums[i]) == 30)) {
					var firstDiff = parseInt(ongoingNums[i]) - parseInt(ongoingNums[i + j]);
					var secondDiff = parseInt(ongoingNums[i + j]) - parseInt(ongoingNums[i]);
					if (firstDiff != 0 && secondDiff != 0 && ((firstDiff % nthSeq == 0) || (secondDiff % nthSeq == 0))) {
						if (seqFound.indexOf(i) == -1) { seqFound.push(i); }
						if (seqFound.indexOf(i + j) == -1) { seqFound.push(i + j); }
					}
					//console.log("10th Seq::  i:" + i + " Num:" + ongoingNums[i] + " :::  " + currNum + " ::: SeqFound:" + seqFound);
				}
			}
		}
	}
	return seqFound;
}

function collectNextHistory(currentNum, isUndo, prevNum){
	var val = [];
	ongoingSpins.forEach(function(v) {
		val.push(v);
	});
	
	if (nextHistoryMap && ongoingSpins.length >= 2) {
		if (isUndo) {
			var innerMap = nextHistoryMap.get(ongoingSpins[ongoingSpins.length - 2]);
			if (innerMap.get(currentNum) >= 0) {
				innerMap.set(currentNum, innerMap.get(currentNum) - 1);
				currentNum = ongoingSpins[ongoingSpins.length-2];
			}
		} else {
			var innerMap = nextHistoryMap.get(ongoingSpins[ongoingSpins.length - 2]);
			innerMap.set(currentNum, innerMap.get(currentNum) + 1);
		}
		//nextHistoryMap.set(ongoingSpins[ongoingSpins.length - 2], nextHistoryMap.get(ongoingSpins[ongoingSpins.length - 2]).get(currentNum) + 1);
	}
	
	var cHisPrint = "<font class=\"footNoteAfterCount\">";
	var sMap = new Map([...nextHistoryMap.get(currentNum).entries()].sort((a, b) => b[1] - a[1]));
	sMap.forEach(function(v, k) {
		if (v != 0) {
			cHisPrint += k + ":" + v + "&nbsp;&nbsp;";
		}
	});
	cHisPrint += "<\/font>";
	$("#patternAfterHistory").html(cHisPrint);
}

function addToOngoingSpin(obj) {
	if ($(obj).val()) {
		currNum = parseInt($(obj).val());
		nextAll = new Array();
		nextSelected = new Array();
		possibleNumbersMap = new Map();
		ongoingSpins.push(parseInt($(obj).val()));
		db.pop();
		db.push(ongoingSpins);
		showSpinAnalysis();
		applyColor();
		$(".undo").show();
		planNextMove();
		getSpecialSequence();
		analyzeDynPattern();
		collectNextHistory(parseInt($(obj).val()));
	}
}

function planNextMove(obj, spl, htmlId) {
	var lastMove = spl != undefined ? spl : posList[0];
	var formation = formRollingSequence(ongoingSpins[ongoingSpins.length - 1]);
	var nextPositions = locateNextSlots(formation, obj ? parseInt(obj.value) : parseInt(lastMove));
	var row = 0;
	var print = "<table><tr>";
	nextPositions = nextPositions.sort(function(a, b){return a-b});
	
	if(htmlId != undefined){
		return nextPositions;
	}
	
	if ($(obj) && ($(obj).hasClass('patternCalcButton') || $(obj).hasClass('patternCalcButtonRepat'))) {
		if ($(obj).hasClass('patternCalcButtonSelected')) {
			$(obj).removeClass('patternCalcButtonSelected');
			removeAddedNextSelected(nextPositions);
			//Remove if any other button has similar values.
			var v = $(obj).val();
			$.each($('.patternCalcButton'), function() {
				if (v == parseInt($(this).val()) && $(this).hasClass('patternCalcButtonSelected')) {
					$(this).removeClass('patternCalcButtonSelected');
				}
			});
			$.each($('.patternCalcButtonRepat'), function() {
				if (v == parseInt($(this).val()) && $(this).hasClass('patternCalcButtonSelected')) {
					$(this).removeClass('patternCalcButtonSelected');
				}
			});
			//console.log("Removing:" + nextPositions);
		} else {
			$(obj).addClass('patternCalcButtonSelected');
			addToNextSelected(nextPositions);
			//Select if any other button has similar values.
			var v = $(obj).val();
			$.each($('.patternCalcButton'), function() {
				if (v == parseInt($(this).val())) {
					$(this).addClass('patternCalcButtonSelected');
				}
			});
			$.each($('.patternCalcButtonRepat'), function() {
				if (v == parseInt($(this).val())) {
					$(this).addClass('patternCalcButtonSelected');
				}
			});
			//console.log("Adding:" + nextPositions);
		}
	}
	
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

	if ($("#repeatCount")) {
		minRepeat = $("#repeatCount option:selected").val();
	} else {
		minRepeat = 1;
	}

	if ($("#notSeenCount")) {
		notSeenCount = parseInt($("#notSeenCount option:selected").val());
	} else {
		notSeenCount = 16;
	}

	if (parseInt(dynPatMap.get("l")) >= minRepeat) {
		addToNextAll(nextPositions);
	}

	print += "<\/td><td>&nbsp;&nbsp;&nbsp;<\/td>";

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
	addToNextAll(lastSpin);

	print += "<\/tr><\/table>";
	$("#next").html("<h5>Repeat Position:&nbsp;<\/h5>" + print);
	
	nextAll = nextAll.filter((item, index) =>
		parseInt(nextAll[index]) == parseInt(item)).sort(function(a, b) { return a - b });
	if (nextSelected.length == 0 )  {
		$("#nextSelected").hide();
		$("#nextAll").show();
		print = "<table><tr>";
		nextAll.forEach(function(v) {
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
		print += "<\/tr><\/table>";

		//$("#nextAll").html("<h5>Possible All Next (Auto):&nbsp;<font class=\"footNote\">(" + nextAll.length + ")<\/font><\/h5>" + print);
		//console.log("Size:" + nextAll.length + " ==> NextALL:" + nextAll);
		
		
		var numPrint = "<table>";
		possibleNumbersMap.forEach(function(v, k) {
			if (v != undefined) {
				numPrint += "<tr><td>" + k + "<\/td><td style=\"border:1px gray solid\">" + v + "&nbsp;&nbsp;<\/td><\/tr>";
			}
		});
		numPrint += "<\/table>";
		$("#possibleAll").html("<h5>Possible Patterns:&nbsp;<br/>" + numPrint + "<\/h5>");
		
	} else {
		$("#nextAll").hide();
		$("#nextSelected").show();
		nextSelected = nextSelected.filter((item, index) =>
			parseInt(nextSelected[index]) == parseInt(item)).sort(function(a, b) { return a - b });

		print = "<table><tr>";
		nextSelected.forEach(function(v) {
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
		print += "<\/tr><\/table>";

		$("#nextSelected").html("<h5>Possible All Next (Selected):&nbsp;<font class=\"footNote\">(" + nextSelected.length + ")<\/font><\/h5>" + print);
		//console.log("Size:" + nextSelected.length + " ==> NextALL:" + nextSelected);
	}
}

function analyzeDynPattern() {
	if (posList) {
		dynPatterns.forEach(function(v) {
			dynPatMap.set(v, 0);
		});
		//d-double, h-half, s-subtract, a-addition, l-last, nm-number match, u1-up 1pos, d1-down 1pos, 1s-1st pos, d2-down 2pos, u2- up 2pos, 7p- 7th pos, 9p- 9th pos
		for (var i = (i>25 ? 25 : posList.length-1); i > -1; i--) {
			if (posList[i] ==  posList[i-1]) {
				var c = parseInt(dynPatMap.get("l"));
				if (c != undefined) {
					dynPatMap.set("l", ++c);
				}
			} else if (posList[i-2] && posList[i] == posList[i-2]) {
				var c = parseInt(dynPatMap.get("d1"));
				if (c != undefined) {
					dynPatMap.set("pv", ++c);
				}
			} else if (posList[i] != posList[i - 1] && posList[i - 1] == 7) {
				var c = parseInt(dynPatMap.get("7p"));
				if (c != undefined) {
					dynPatMap.set("7p", ++c);
				}
			} else if (posList[i] != posList[i - 1] && posList[i - 1] == 9) {
				var c = parseInt(dynPatMap.get("9p"));
				if (c != undefined) {
					dynPatMap.set("9p", ++c);
				}
			} else if (posList[i] != 0 && posList[i - 1] != 0) {
				if (posList[i - 2] == posList[i - 1] - posList[i] || posList[i - 2] == posList[i] - posList[i - 1]) {
					var c = parseInt(dynPatMap.get("s"));
					if (c != undefined) {
						dynPatMap.set("s", ++c);
					}
				} else if (posList[i - 2] == posList[i - 1] + posList[i]) {
					var c = parseInt(dynPatMap.get("a"));
					if (c != undefined) {
						dynPatMap.set("a", ++c);
					}
				} else if (posList[i - 1] == posList[i] / 2) {
					var c = parseInt(dynPatMap.get("h"));
					if (c != undefined) {
						dynPatMap.set("h", ++c);
					}
				} else if (posList[i - 1] == posList[i] * 2) {
					var c = parseInt(dynPatMap.get("d"));
					if (c != undefined) {
						dynPatMap.set("d", ++c);
					}
				} else if (posList[i] - 1 == posList[i - 1]) {
					var c = parseInt(dynPatMap.get("d1"));
					if (c != undefined) {
						dynPatMap.set("d1", ++c);
					}
				} else if (posList[i] - 2 == posList[i - 1]) {
					var c = parseInt(dynPatMap.get("d1"));
					if (c != undefined) {
						dynPatMap.set("d2", ++c);
					}
				} else if (posList[i] + 1 == posList[i - 1]) {
					var c = parseInt(dynPatMap.get("u1"));
					if (c != undefined) {
						dynPatMap.set("u1", ++c);
					}
				} else if (posList[i] + 2 == posList[i - 1]) {
					var c = parseInt(dynPatMap.get("u1"));
					if (c != undefined) {
						dynPatMap.set("u2", ++c);
					}
				} else if (posList[i] != posList[i - 1] && posList[i - 1] == 1) {
					var c = parseInt(dynPatMap.get("1s"));
					if (c != undefined) {
						dynPatMap.set("1s", ++c);
					}
				}
			}
		}
		
		//Sort Map
		dynPatMap = new Map([...dynPatMap.entries()].sort((a,b) => b[1]-a[1]));
		//console.log("Sorted Map:");
		//console.log(dynPatMap);
		
		var cPrint = "<font class=\"footNote\">";
		dynPatMap.forEach(function(v, k) {
			cPrint += k + ":" + v + "&nbsp;&nbsp;";
		});
		cPrint += "<\/font>";
		//Commenting. Because not using this much... 
		//$("#patternCount").html(cPrint);
		//console.log("dynPattens:");
		//console.log(dynPatMap);
		
		var cPrint = "<font class=\"footNote\"><table><tr><td><img src=\"greentick.png\" height=\"10px\" width=\"10px\"/>negi</td>";
		cPrint += "<td><img src=\"greentick.png\" height=\"10px\" width=\"10px\"/>10th</td>";
		cPrint += "<td><img src=\"greentick.png\" height=\"10px\" width=\"10px\"/>sub+n</td>";
		cPrint += "<td><img src=\"greentick.png\" height=\"10px\" width=\"10px\"/>sum+n</td>";
		cPrint += "</tr></table><\/font>";
		$("#coverPattern").html(cPrint);
		
		
		//Count occurrance of Numbers 
		var occrMap = ongoingSpins.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
		occrMap = new Map([...occrMap.entries()].sort((a,b) => b[1]-a[1]));
		//console.log(occrMap);
		var ncPrint = "<font class=\"footNote\">";
		var cnt=0;
		occrMap.forEach(function(v, k) {
			if(cnt<10){
				ncPrint += k + ":" + v + "&nbsp;&nbsp;";
			}
			cnt++;
		});
		ncPrint += "<\/font>";
		$("#occurCount").html(ncPrint);
	}
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
	
	//Check Prev Sequence
	if (lastMove != undefined) {
		if ((posList[2] == lastMove) || (posList[2] - lastMove == 1) || (lastMove - posList[2] == 1)) {
			$('.patternButton[index=1]').addClass('prevSeq');
		} 
	}
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

	var patternButton = "<div id=\"patternTable\"><table><tr>";
	var row = 0;
	var index = -1;
	var spinIndex = ongoingSpins.length - 1 || -1;
	//console.log("moved..."+moved);
	moved.forEach(function(v, i) {
		index++;
		var currVal = v;
		var prev1Val = moved[i+1];
		var prev2Val = moved[i+2];
		var patFound = triagePattern(currVal,prev1Val,prev2Val);
		//console.log("curr:"+currVal);
		//console.log("prev1Val:"+prev1Val);
		//console.log("prev2Val:"+prev2Val);
		//console.log("patFound:"+patFound);
		
		if(row < 24 ){
			if (patFound) {
				//patternButton += "<td>" + "<font class=\"superScriptPattern\">" + spinIndex + ":&nbsp;" + patFound + "-" + ongoingSpins[spinIndex] + "<\/font>" + "<input type=\"button\" class=\"patternButton\" index=\"" + index + "\" onclick=\"planNextMove(this)\" value=\"" + v + "\" \/>";
				patternButton += "<td>" + "<font class=\"superScriptPattern\">" + patFound + "-" + ongoingSpins[spinIndex] + "<\/font>" + "<input type=\"button\" class=\"patternButton\" index=\"" + index + "\" onclick=\"planNextMove(this)\" value=\"" + v + "\" \/>";
			} else {
				//patternButton += "<td>" + "<font class=\"superScript\">" + spinIndex + ":&nbsp;" + ongoingSpins[spinIndex] + "<\/font>" + "<input type=\"button\" class=\"patternButton\" index=\"" + index + "\" onclick=\"planNextMove(this)\" value=\"" + v + "\" \/>";
				patternButton += "<td>" + "<font class=\"superScript\">" + ongoingSpins[spinIndex] + "<\/font>" + "<input type=\"button\" class=\"patternButton\" index=\"" + index + "\" onclick=\"planNextMove(this)\" value=\"" + v + "\" \/>";
			}

			/*
			if (index == posList.length-1) {
				patternButton += "<font class=\"superScript\">"+ ongoingSpins[0] + "<\/font>";
			}
			*/
			patternButton += "</td>";

			row += 1;
			spinIndex--;
			if (row % 4 == 0) {
				patternButton += "<\/tr><tr>";
			}
			print += v + " - ";
		}
	});
	patternButton += "<\/tr><\/table></div>";
	//console.log(print);

	if (patternButton.length > 0) {
		$("#patternFlow").html("<div onClick=togglePatternTable()><h5>Style:&nbsp;&nbsp;(" + posList.length + ")<\/h5></div>" + patternButton);
	} else {
		$("#patternFlow").html("Need more Spins to identify pattern....");
	}

	//Prepare and display Repeated Patterns
	if (posList) {
		var repatedPositions = posList.reduce(function(a, b) {
			return a[b] ? ++a[b] : a[b] = 1, a
		}, {});

		//Sort and convert Object to Map
		repeatMap = new Map([...new Map(Object.entries(repatedPositions)).entries()].sort((a, b) => b[1] - a[1]));

		//Display repeated patterns buttons
		var cPrint = "<table><tr>";
		var i = -1;
		repeatMap.forEach(function(v, k) {
			cPrint += "<td>" +  "<font class=\"superScript\">" + v + "<\/font>" + "<font class=\"leftSuperScript\">" + planNextMove(null, k, this) + "<\/font>" + "<input type=\"button\" class=\"patternCalcButton\" index=\"" + ++i + "\" onclick=\"planNextMove(this)\" value=\"" + k + "\" \/></td>";
			//cPrint += k + ":" + v + "&nbsp;&nbsp;";
			if (i == 4 || i == 9) {
				cPrint += "<\/tr><tr>";
			}
		});
		cPrint += "<\/tr><\/table>";
		$("#repeatedPatterns").html("<h5>Patterns:&nbsp;<\/h5>" + cPrint);
		//console.log("repatedPositions::: " + cPrint);
	}

	//Display calculated buttons
	var patternCalc = "<table><tr>";
	var indexforCalc = -1;
	if (posList.length > 1) {
		if (posList[0] != undefined && posList[1] != undefined) {
			var f = parseInt(posList[0]);
			var s = parseInt(posList[1]);
			var seventh = false;
			var nineth = false;
			var disNum = 0;
			
			//Last to Last Position 
			disNum = s;
			indexforCalc++;
			var lastToLastMove = planNextMove(null, disNum, this);
			patternCalc += "<td>" + "<font class=\"superScript\">" + "pv" + "<\/font>" + "<font class=\"leftSuperScript\">" + lastToLastMove + "<\/font>" + "<input type=\"button\" class=\"patternCalcButtonRepat\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
			possibleNumbersMap.set("last", lastToLastMove);
			addToNextAll(lastToLastMove);
		
			//Subtract
			if (f > s) {
				disNum = ((f - s) % 10);
			} else {
				disNum = ((s - f) % 10);
			}
			indexforCalc++;
			var diffMove = planNextMove(null, disNum, this);
			var repeat = parseInt(dynPatMap.get("s")) >= minRepeat;
			patternCalc += "<td>"+"<font class=\"superScript\">"+"sub"+"<\/font>"+"<font class=\"leftSuperScript\">"+ diffMove +"<\/font>"+"<input type=\"button\" class=\""+(repeat ? "patternCalcButtonRepat" : "patternCalcButton")+"\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
			possibleNumbersMap.set("sub", diffMove);
			if (repeat) {
				addToNextAll(diffMove);
			}

			//Double
			if (f < 6) {
				disNum = ((f * 2) % 10);
				indexforCalc++;
				var doubleMove = planNextMove(null, disNum, this);
				var repeat = parseInt(dynPatMap.get("d")) >= minRepeat;
				patternCalc += "<td>"+"<font class=\"superScript\">"+"db"+"<\/font>"+"<font class=\"leftSuperScript\">"+ doubleMove +"<\/font>"+"<input type=\"button\" class=\""+(repeat ? "patternCalcButtonRepat" : "patternCalcButton")+"\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
				possibleNumbersMap.set("dbl", doubleMove);
				if(repeat){
					addToNextAll(doubleMove);
				}
			}

			if (indexforCalc != 0 && parseInt(indexforCalc) % 4 == 0) {
				patternCalc += "<\/tr><tr>";
			}
			
			//Half
			if (f % 2 == 0) {
				disNum = ((f / 2));
				indexforCalc++;
				var halfMove = planNextMove(null, disNum, this);
				var repeat = parseInt(dynPatMap.get("h")) >= minRepeat;
				patternCalc += "<td>"+"<font class=\"superScript\">"+"hf"+"<\/font>"+"<font class=\"leftSuperScript\">"+ halfMove +"<\/font>"+"<input type=\"button\" class=\""+ (repeat ? "patternCalcButtonRepat" : "patternCalcButton") +"\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
				possibleNumbersMap.set("hlf", halfMove);
				if(repeat){
					addToNextAll(halfMove);
				}
			}

			if (indexforCalc != 0 && parseInt(indexforCalc) % 4 == 0) {
				patternCalc += "<\/tr><tr>";
			}
			
			//add
			if ((f + s) < 10) {
				disNum = f + s;
				indexforCalc++;
				var addMove = planNextMove(null, disNum, this);
				var repeat = parseInt(dynPatMap.get("a")) >= minRepeat;
				patternCalc += "<td>" + "<font class=\"superScript\">" + "add" + "<\/font>" + "<font class=\"leftSuperScript\">" + addMove + "<\/font>" + "<input type=\"button\" class=\""+(repeat ? "patternCalcButtonRepat" : "patternCalcButton")+"\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
				possibleNumbersMap.set("add", addMove);
				if (indexforCalc != 0 && parseInt(indexforCalc) % 4 == 0) {
					patternCalc += "<\/tr><tr>";
				}
				if(repeat){
					addToNextAll(addMove);
				}
			}

			if (indexforCalc != 0 && indexforCalc != 8 && parseInt(indexforCalc) % 4 == 0) {
				patternCalc += "<\/tr><tr>";
			}

			//Seventh
			if (f == 0 || s == 0 || f == s || (f == 9 || s == 9)) {
				disNum = 7;
				indexforCalc++;
				var seventhMove = planNextMove(null, disNum, this);
				patternCalc += "<td>" + "<font class=\"superScript\">" + "7th" + "<\/font>" + "<font class=\"leftSuperScript\">" + seventhMove + "<\/font>" + "<input type=\"button\" class=\"patternCalcButtonRepat\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
				possibleNumbersMap.set("7th", seventhMove);
				addToNextAll(seventhMove);
				seventh = true;
				//console.log("indexforCalc:"+indexforCalc);
			}
			
			if (indexforCalc != 0 && indexforCalc != 8 && parseInt(indexforCalc) % 4 == 0) {
				patternCalc += "<\/tr><tr>";
			}

			//Nineth
			if (f == 7 || s == 7) {
				disNum = 9;
				indexforCalc++;
				var ninethMove = planNextMove(null, disNum, this);
				patternCalc += "<td>" + "<font class=\"superScript\">" + "9th" + "<\/font>" + "<font class=\"leftSuperScript\">" + planNextMove(null, disNum, this) + "<\/font>" + "<input type=\"button\" class=\"patternCalcButtonRepat\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
				possibleNumbersMap.set("9th", ninethMove);
				addToNextAll(ninethMove);
				nineth = true;
				//console.log("indexforCalc:"+indexforCalc);
			}

			if (indexforCalc != 0 && indexforCalc != 8 && parseInt(indexforCalc) % 4 == 0) {
				patternCalc += "<\/tr><tr>";
			}
			
			//1 Position Up
			/*
			disNum = ((f + 1) % 10);
			indexforCalc++;
			var up1PosMove = planNextMove(null, disNum, this);
			var repeat = parseInt(dynPatMap.get("u1")) >= minRepeat;
			patternCalc += "<td>"+"<font class=\"superScript\">"+"&uarr;1p"+"<\/font>"+"<font class=\"leftSuperScript\">"+ up1PosMove +"<\/font>"+"<input type=\"button\" class=\""+(repeat ? "patternCalcButtonRepat" : "patternCalcButton")+"\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\""+disNum+"\" \/></td>";
			possibleNumbersMap.set("1up", up1PosMove);
			if (repeat) {
				addToNextAll(up1PosMove);
			}
			if (indexforCalc != 0 && indexforCalc != 8 && parseInt(indexforCalc) % 4 == 0) {
				patternCalc += "<\/tr><tr>";
			}
			if (indexforCalc != 0 && parseInt(indexforCalc) % 4 == 0) {
				patternCalc += "<\/tr><tr>";
			}
			*/
			
			/*
			//1 Position Down 
			if (f > 1) {
				disNum = ((f - 1) % 10);
				indexforCalc++;
				var down1PosMove = planNextMove(null, disNum, this);
				var repeat = parseInt(dynPatMap.get("d1")) >= minRepeat;
				patternCalc += "<td>" + "<font class=\"superScript\">" + "&darr;1p" + "<\/font>" +"<font class=\"leftSuperScript\">"+ down1PosMove +"<\/font>"+ "<input type=\"button\" class=\""+(repeat ? "patternCalcButtonRepat" : "patternCalcButton")+"\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
			}
			possibleNumbersMap.set("1dn", down1PosMove);
			if (repeat) {
				addToNextAll(down1PosMove);
			}
			if (indexforCalc != 0 && parseInt(indexforCalc) % 4 == 0) {
				patternCalc += "<\/tr><tr>";
			}
			*/
			//pos +2
			/*
			disNum = ((f + 2) % 10);
			indexforCalc++;
			var pos2upMove = planNextMove(null, disNum, this);
			patternCalc += "<td>"+"<font class=\"superScript\">"+"&uarr;2p"+"<\/font>"+"<font class=\"leftSuperScript\">"+ planNextMove(null, disNum, this)+"<\/font>" +"<input type=\"button\" class=\"patternCalcButton\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\""+disNum+"\" \/></td>";
			//console.log("indexforCalc:"+indexforCalc);
			if (indexforCalc != 0 && indexforCalc > 5 && parseInt(indexforCalc) % 5 == 0) {
				patternCalc += "<\/tr><tr>";
			}
			possibleNumbersMap.set("2up", pos2upMove);
			*/
			
			//-2 posistion movement
			/*
			if (f > 2) {
				disNum = ((f - 2) % 10);
				indexforCalc++;
				var pos2dnMove = planNextMove(null, disNum, this);
				possibleNumbersMap.set("2dn", pos2dnMove);
				patternCalc += "<td>" + "<font class=\"superScript\">" + "&darr;2p" + "<\/font>" + "<font class=\"leftSuperScript\">"+ planNextMove(null, disNum, this)+"<\/font>"+"<input type=\"button\" class=\"patternCalcButton\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"" + disNum + "\" \/></td>";
			}
			if (indexforCalc != 0 && indexforCalc> 8 && parseInt(indexforCalc) % 9 == 0) {
				patternCalc += "<\/tr><tr>";
			}
			*/
			
			//1st position
			/*
			indexforCalc++;
			var firstPosMove = planNextMove(null, 1, this);
			var repeat = parseInt(dynPatMap.get("1s")) >= minRepeat;
			patternCalc += "<td>"+"<font class=\"superScript\">"+"1st"+"<\/font>"+"<font class=\"leftSuperScript\">"+ firstPosMove +"<\/font>"+"<input type=\"button\" class=\""+(repeat ? "patternCalcButtonRepat" : "patternCalcButton")+"\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"1\" \/></td>";
			possibleNumbersMap.set("1st", firstPosMove);
			if (repeat) {
				addToNextAll(firstPosMove);
			}
			*/


			if (indexforCalc != 0 &&  indexforCalc> 5 && parseInt(indexforCalc) % 5 == 0) {
				patternCalc += "<\/tr><tr>";
			}
			/*
			//+2
			indexforCalc++;
			patternCalc += "<td>"+"<font class=\"superScript\">"+"2nd"+"<\/font>"+"<font class=\"leftSuperScript\">"+ planNextMove(null, "2", this)+"<\/font>"+"<input type=\"button\" class=\"patternCalcButton\" index=\"" + indexforCalc + "\" onclick=\"planNextMove(this)\" value=\"2\" \/></td>";
			if (indexforCalc != 0 && parseInt(indexforCalc) % 4 == 0) {
				patternCalc += "<\/tr><tr>";
			}
			*/
			
			//Add the last spin number
			//nextAll.push(lastSpin[0]);
		}
		patternCalc += "<\/tr><\/table>";
		$("#patternCalc").html("<h5>Calculate:&nbsp;<\/h5>" + patternCalc);
		
		var notSeen = findNotSeenPositions();
		if (notSeen && notSeen.length >0){
			var print = "<table><tr>";
			var index = -1;
			for (i = 0; i < notSeen.length; i++) {
				index++;
				var positions = planNextMove(null, notSeen[i], this);
				print += "<td>" + "<font class=\"leftSuperScript\">" + positions + "<\/font>" + "<input type=\"button\" class=\"patternCalcButton\" index=\"" + index + "\" onclick=\"planNextMove(this)\" value=\"" + notSeen[i] + "\" \/></td>";
			}
			print += "<\/tr><\/table>";
			$("#notSeen").html("<h5>Not seen in "+ notSeenCount +" Spins:&nbsp;<\/h5>" + print);
		} else {
			$("#notSeen").html("");
		}
	}	
}

function triagePattern(first, second, third) {
	var result;
	if (first != undefined) {
		first = parseInt(first);
		if (second != undefined) {
			second = parseInt(second);
			if (third != undefined) {
				third = parseInt(third);
			}
		}
	}

	if (second == first) {
		result = "l";
	} else if (first == third) {
		result = "pv";
	} else if (second != 0 && first != 0) {
		if (first == third - second || first == second - third) {
			result = "sub";
		} else if (first == second + third) {
			result = "add";
		} else if (first == second / 2) {
			result = "hlf";
		} else if (first == second * 2) {
			result = "dbl";
		}
	} else if (second != first && first == 7) {
		result = "7p";
	} else if (second != first && first == 9) {
		result = "9p";
	} else if (second - 1 == first) {
		result = "d1";
	} else if (second - 2 == first) {
		result = "d2";
	} else if (second + 1 == first) {
		result = "u1";
	} else if (second + 2 == first) {
		result = "u2";
	} else if (second != first && first == 1) {
		result = "1s";
	}
	return result;
}

function addToNextAll(arr){
	if (arr) {
		arr.forEach(function(v) {
			if (nextAll.indexOf(parseInt(v)) == -1) {
				nextAll.push(v);
			}
		});
	}
	return nextAll;
}

function findNotSeenPositions() {
	if (posList.length >= notSeenCount) {
		var arr = new Array();
		for (i = 1; i<10; i++) {
			var found = false;
			for (j = 0; j < notSeenCount; j++) {
				if(posList[j] == i) {
					found = true;
				}
			}
			if (!found) {
				arr.push(i);
			}
		}
		//console.log("Not seen:" + arr);
		return arr;
	}
} 

function removeAddedNextAll(arr){
	if (arr) {
		arr.forEach(function(v) {
			if (nextAll.indexOf(parseInt(v)) != -1) {
				nextAll.splice(nextAll.indexOf(parseInt(v)),1);
			}
		});
	}
	return nextAll;
}

function addToNextSelected(arr){
	if (arr) {
		arr.forEach(function(v) {
			if (nextSelected.indexOf(parseInt(v)) == -1) {
				nextSelected.push(v);
			}
		});
	}
	return nextSelected;
}

function removeAddedNextSelected(arr){
	if (arr) {
		arr.forEach(function(v) {
			if (nextSelected.indexOf(parseInt(v)) != -1) {
				nextSelected.splice(nextSelected.indexOf(parseInt(v)),1);
			}
		});
	}
	return nextSelected;
}

function removeFromWinArray(v) {
	if (v) {
		//v = i.split(":")[1];
		//v = v.replace(/["']/g, "");
		if (wins.indexOf(parseInt(v)) != -1) {
			wins.splice(wins.indexOf(parseInt(v)), 1);
		}
	}
	return wins;
}

function confirmSequence(f, s, t) {
	var found = false;
	var i = 0;
	if (f === undefined || s === undefined || t === undefined) {
		return found;
	}

	if (posList) {
		var diff = -1;
		for (var i = 3; i < posList.length; i++) {
			if (posList[i + 1] !== undefined && (posList[i] == parseInt(f) && posList[i + 1] == parseInt(s))) {
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
	if (/*$('#fs').is(":checked") &&*/ (moves != 10 && moves > 9) ) {
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
	
	for (var i = 0; i < 37; i++) {
		var innerMap = new Map();
		for (var j = 0; j < 37; j++) {
			innerMap.set(j, 0);
		}
		nextHistoryMap.set(i, innerMap);
	}
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

function selectWin(obj) {
	if ($(obj)) {
		if ($(obj).hasClass('markWon')) {
			$(obj).removeClass('markWon');
			removeFromWinArray($(obj).text());
		} else {
			$(obj).addClass('markWon');
			wins.push(parseInt($(obj).text()));
		}
		console.log("Wins:");
		console.log(wins);
	}
}

function checkReload() {
	if (confirm("Spin Details will be lost. Do you want to refresh ??")) {
		window.location.reload();
	} else {
		return '';
	}
}

function undoLast() {
	removeAddedNextAll(planNextMove(null, parseInt(posList[0]), this));
	currNum = parseInt(ongoingSpins[ongoingSpins.length-2]); 
	collectNextHistory(ongoingSpins[ongoingSpins.length-1], true, parseInt(ongoingSpins[ongoingSpins.length-1]));
	ongoingSpins.pop();
	showSpinAnalysis();
	planNextMove();
	$(".undo").hide();
	getSpecialSequence();
}

function togglePatternTable() {
	$("#patternTable").toggle();
}

function showAfter(){
	$("#afterCounts").toggle();
	var cHisPrint = "<font class=\"footNote\"><br/>";
	nextHistoryMap.forEach(function(v1, k1) {
		var cHisPrintIn = ""; 
		var inMap = nextHistoryMap.get(k1);
		var sMap = new Map([...inMap.entries()].sort((a, b) => b[1] - a[1]));
		sMap.forEach(function(v, k) {
			if (v != 0) {
				cHisPrintIn += k + ":" + v + "&nbsp;&nbsp;";
			}
		});
		if (cHisPrintIn.length > 0) {
			cHisPrint += k1 + " -> " + cHisPrintIn + "<br/>";
		}
	});
		cHisPrint += "<\/font>";
	$("#afterCounts").html(cHisPrint);
}