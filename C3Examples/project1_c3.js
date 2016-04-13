/**
 * 
 */

//var inatAPI = "https://api.inaturalist.org/v1/observations/species_counts";
var inatAPI = "saveddata.json";
var place_id = "1250";
var raw_data = {};
var processed_data = {};
var data_columns = ["iconic_taxon_id", "iconic_taxon_name", "id", "is_active", "name", "observations_count", "preferred_common_name", "preferred_establishment_means", "rank", "rank_level"];
var taxalevel = "species";
var allData = {};
var months = ["all", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


// function to process data into c3 acceptable format
function processTaxum(taxa, col, addcol, filterCols, filterVals, filterFunctions) {
  var result = [];
  if (addcol) {
    result = [col];
  }
  for (var i = 0; i < taxa.length; i++) {
    var taxum = taxa[i].taxon;
    taxum["count"] = taxa[i].count;
    var unfiltered = true;
    for (var j = 0; j < filterCols.length; j++) {
    	var filterCol = filterCols[j];
      var filterValSet = filterVals[j];
      var filterFunction = filterFunctions[j];
      if (filterFunction(taxum[filterCol], filterValSet)) {
      	unfiltered = false;      
      } 
      
//      if (filterValSet.indexOf(taxum[filterCol])==-1) {
//}
    }
    if (unfiltered) {
    	result.push(taxum[col]);
    }
  }
  return result;
}

// combines data with same name
function consolidateData(data) {
  function resetDict(dict) {
    for (var i = 0; i < data.names.length; i++) {
      dict[data.names[i]] = 0;
    }
    return dict;
  }
  var names = resetDict({});
  var nameKeys = Object.keys(names);

  function getCounts(col, names, nameKeys) {
    var dict = resetDict({});
    for (var i = 0; i < names.length; i++) {
      dict[names[i]] += col[i + 1];
    }
    var result = ([col[0]]).concat(nameKeys.map(function(key) {
      return dict[key];
    }));
    return result;
  }
  return {
    "names": nameKeys,
    "columns": data.columns.map(function(col) {
      return getCounts(col, data.names, nameKeys);
    })
  }
}

function range(rangeLength) {
  var result = new Array();
  for (var i=0; i<rangeLength; i++) {
  	result.push(i);
  }
  return result;
}

function switchFirstColumnNamedLists(data) {
  console.log(data);
  var newData = {
    "names": [data.columns[0][0]],
    "columns": (range(data.names.length)).map(function(i) {
      return [data.names[i], data.columns[0][i]];
    })
  };
  return newData;
}

function processTaxa(taxa, datacols, namecol, consolidate, colsToName, filterCols, filterVals, filterFunctions) {
  var data = {
    "names": processTaxum(taxa, namecol, false, filterCols, filterVals, filterFunctions),
    "columns": datacols.map(function(col) {
      return processTaxum(taxa, col, true, filterCols, filterVals, filterFunctions);
    })
  };
  if (consolidate) {
    data = consolidateData(data);
  }
  if (colsToName) {
    data = switchFirstColumnNamedLists(data);
  }
  return data;
}

// get all data
function getAllData(callback) {
//	var requests = (range(months.length)).map(function(i) {
//		var month = i;
//    if (month==0) {
//    	month = "";
//    }
//    return $.getJSON(inatAPI, {
//        "verifiable": true,
//        "place_id": place_id,
//        "hrank": taxalevel,
//        "month": month
//      }, function(data) {
//        console.log(months[i]);
//        allData[months[i]] = data;
//      });
    //return x;
//  });
  //console.log(requests);
	//Promise.all(requests).then(callback());
  //Promise.all(requests).then(console.log("Done"));
	//$.when.apply(this, requests).done(console.log("finished!"));
  //$.when(x).done(console.log("finished x!"));
  //$.when.apply(this, requests).done(console.log(console.log(allData["April"])));
  //setTimeout(function(){
    //console.log(allData["April"]);
    //callback();
  //}, 1000);
	//allData = {}
	//callback();	
	$.getJSON("savedData.json"), function(data) {
		allData = data;
		}, callback());  
	//console.log(requests);
}

function barChartParameters(data) {
  //console.log(data.columns);
  var chart_data = {
    "data": {
      "columns": data.columns,
      "type": "bar",
      "selection": {
        "enabled": true
      }
    },
    "grid": {
      "x": {
        "show": false
      },
      "y": {
        "show": true
      }
    },
    "tooltip": {
      "show": true,
      "grouped": false
    },
    "legend": {
      "show": false
    },
    "axis": {
      "x": {
        "label": "",
        "type": 'category',
        "position": 'outer-middle',
        tick: {
          rotate: 60,
          multiline: false
        },
        "categories": data.names
      },
      "y": {
      	"label": "",
        "position": 'outer-middle'
      }
    }
  };
  return chart_data;
};

//var my_chart_object = c3.generate(my_chart_parameters);

var my_chart_object;
var all_chart_data;
var processed_data;

function rejiggerDataByMonth(names, months, monthlyCounts) {
	//console.log(monthlyCounts);
  console.log(names);
  columns = new Array();
  for (i = 0; i<names.length; i++) {
  	columns.push([names[i]]);
    for (j = 0; j<months.length; j++) {
    	var namePos = monthlyCounts[j].names.indexOf(names[i]);
      var toadd = 0;
      if (namePos>-1) {
      	toadd = monthlyCounts[j].columns[0][namePos+1];
      }
    	columns[i].push(toadd);
    }
  }
  //console.log(columns);
  return {
  	"names": months,
    "columns": columns
  }
}

// slides
var slide_0 = function() {
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];	
	var names = processTaxa(allData.all.results, ['count'], "iconic_taxon_name", true, false, [], [[]], []).names;
	var processed_data = processTaxa(allData.all.results, ['count'], "iconic_taxon_name", true, false, [], [[]], []);
	var my_chart_data = barChartParameters(processed_data);
	//my_chart_data.axis.x.label = {"text": "Category", "position": "outer-center"};
	my_chart_data.axis.y.label = {"text": "# of Species Observed", "position": "outer-middle"};
	my_chart_data["color"] ={"pattern": ['#1f77b4']};
	my_chart_object = c3.generate(my_chart_data);
	document.getElementById("message").innerHTML = "An introduction to the observable wildlife in Santa Clara County. A large diversity of wildlife can be seen. Data are courtesy of inaturalist.org";
};


var slide_1 = function() {
  my_chart_object.select(["count"], [1]);
  document.getElementById("message").innerHTML = "Most of the observed species are aves. Aves is a scientific name for birds!";
};

var slide_2 = function() {
  var names = processTaxa(allData.all.results, ['count'], "iconic_taxon_name", true, false, [], [[]], []).names;
  //months = months.slice(1, months.length);
  processed_data = rejiggerDataByMonth(names, months, months.map(function(month) {
    	return processTaxa(allData[month].results, ["count"], "iconic_taxon_name", true, false, [], [[]], []);
      }));
  all_chart_data = processed_data;
  my_chart_data = barChartParameters(processed_data);
  my_chart_data["color"] ={"pattern": ['#1f77b4']};
	my_chart_object = c3.generate(my_chart_data);
	console.log(names.indexOf("Aves"));
  console.log(names);
	var nonAvesNames = names.slice();
  nonAvesNames.splice(names.indexOf("Aves"), 1).filter(function(x) {return x!=undefined});
	console.log(nonAvesNames);
  //console.log(names.indexOf("Aves"));
  my_chart_object.unload({
    ids: nonAvesNames
  });
  document.getElementById("message").innerHTML = "Birds can be seen all year round.";
};


var slide_3 = function() {
	my_chart_object.select(["Aves"], [0,1,2,10,11]);
	document.getElementById("message").innerHTML = "But there is a peak in sightings in the winter months.";
};

function getCategoryCounts(allData, datanames) {
  return allData.map(function(data) {
	  return {
		  	"names": ["counts"],
		    "columns": (range(data.columns.length)).map(function(i) {
		    	return [datanames[i], data.columns[0].length-1];
		    })
		  }  
  });
}

var slide_4 = function() {
  //var names = processTaxa(allData.all.results, ['count'], "preferred_common_name", false, false, ["iconic_taxon_name", "count"], [["Aves"], 12], [function(val, set) {return (set.indexOf(val)==-1);}, 
  //function(val, filterval) {return (val>filterval);}]).names;
  var names = processTaxa(allData.all.results, ['count'], "preferred_common_name", false, false, ["iconic_taxon_name"], [["Aves"]], [function(val, set) {return (set.indexOf(val)==-1);}]).names;
  //months = months.slice(1, months.length);
  processed_data = months.map(function(month) {
  	return processTaxa(allData[month].results, ["count"], "preferred_common_name", 
  			false, false, ["iconic_taxon_name", "preferred_common_name"], [["Aves"], names], 
  			[function(val, set) {return (set.indexOf(val)==-1);}, 
  			 function(val, set) {return (set.indexOf(val)==-1);}]);});
  processed_data = getCategoryCounts(processed_data, months);
  console.log("before rejiggering");
  console.log(processed_data);
  processed_data = rejiggerDataByMonth(["counts"], months, processed_data);
  var my_chart_data = barChartParameters(processed_data);
  //my_chart_data.data.type = "";
  my_chart_data.axis.y.label = {"text": "# of Species Observed", "position": "outer-middle"};
  my_chart_data["color"] ={"pattern": ['#1f77b4']};
  //console.log(my_chart_data);
  my_chart_object = c3.generate(my_chart_data);
  my_chart_object.select(["counts"], [0,1,2,10,11]);
  document.getElementById("message").innerHTML = "In addition to more sightings, overall more different species are observed in the winter months.";
};

var slide_5 = function() {
	var names = processTaxa(allData.all.results, ['count'], "preferred_common_name", false, false, ["iconic_taxon_name"], [["Aves"]], [function(val, set) {return (set.indexOf(val)==-1);}]).names;
	processed_data = months.map(function(month) {
		return processTaxa(allData[month].results, ["count"], "preferred_common_name", 
  			false, false, ["iconic_taxon_name", "preferred_common_name"], [["Aves"], names], 
  			[function(val, set) {return (set.indexOf(val)==-1);}, 
  			 function(val, set) {return (set.indexOf(val)==-1);}]);});
	processed_data = rejiggerDataByMonth(names, months, processed_data);
	var colors = {};
	var colorFunc = d3.scale.linear().domain([0,5]).range(["blue","red"]);
	(range(processed_data.columns.length)).map(function(i) {
		var name = processed_data.columns[i].slice(0,1);
		var column = processed_data.columns[i].slice(1,13);
		var maxPos = column.indexOf(math.max(column));
		var colorPos = math.min([maxPos, column.length-maxPos]);
		colors[name]=(colorFunc(colorPos));
	});
	
	var my_chart_data = barChartParameters(processed_data);
	my_chart_data.axis.y.label = {"text": "# of Observations", "position": "outer-middle"};
	my_chart_data.data["type"] = "line";
	my_chart_data.data["colors"] = colors;
	my_chart_object = c3.generate(my_chart_data);
	//my_chart_object.data.colors(colors);
	document.getElementById("message").innerHTML = "We can also look at the observation patterns for individual species and color by the season with the largest number of observations.";
};

var slide_6 = function() {
	var nonmigratory = (range(processed_data.columns.length)).map(function(i) {
		var name = processed_data.columns[i].slice(0,1);
		var column = processed_data.columns[i].slice(1,13);
		column = column.sort(function(a, b) {return a - b;});
		var half = Math.floor(column.length/2);
		var halfcol = column.slice(0, half);
		var quartile = math.median(halfcol);
		if (math.max(column)>4*quartile & (math.max(column)>10)) {//math.min(column)) {
			return("");
		} else {
			return(name[0]);
		}
	});
	my_chart_object.unload({
		ids: nonmigratory 
	});
	document.getElementById("message").innerHTML = "Some species are much more prevalent in specific seasons.";
};

var slide_7 = function() {
	var notCanadianGoose = (range(processed_data.columns.length)).map(function(i) {
		var name = processed_data.columns[i].slice(0,1);
		var column = processed_data.columns[i].slice(1,13);
		var maxPos = column.indexOf(math.max(column));
		if (name != "Canada Goose") {
			return(name[0]);
		} else {
			return("");
		}
	});
	my_chart_object.unload({
		ids: notCanadianGoose 
	});
  document.getElementById("message").innerHTML = "In the case of the Canada Goose, this is consistent with a southern migration from Canada during the winter months.";
};

var slide_8 = function() {
	var names = processTaxa(allData.all.results, ['count'], "iconic_taxon_name", true, false, [], [[]], []).names;
	var processed_data = processTaxa(allData.all.results, ['count'], "iconic_taxon_name", true, false, [], [[]], []);
	var my_chart_data = barChartParameters(processed_data);
	my_chart_data.axis.y.label = {"text": "# of Species Observed", "position": "outer-middle"};
	my_chart_data["color"] ={"pattern": ['#1f77b4']};
	my_chart_object = c3.generate(my_chart_data);
	document.getElementById("message").innerHTML = "An introduction to the observable wildlife in Santa Clara County. A large diversity of wildlife can be seen. Data are courtesy of inaturalist.org";
	my_chart_object.select(["count"], [3]);
	document.getElementById("message").innerHTML = "Looking back at the overview slide, there are also many observed species of Plantae. Plantae is a scientific name for plants!";
};

var slide_9 = function() {
	var names = processTaxa(allData.all.results, ['count'], "iconic_taxon_name", true, false, [], [[]], []).names;
	processed_data = rejiggerDataByMonth(names, months, months.map(function(month) {
	 	return processTaxa(allData[month].results, ["count"], "iconic_taxon_name", true, false, [], [[]], []);
	}));
	console.log(processed_data);
	my_chart_data = barChartParameters(processed_data);
	my_chart_data.axis.y.label = {"text": "# of Observations", "position": "outer-middle"};
	my_chart_data["color"] ={"pattern": ['#1f77b4']};
	my_chart_object = c3.generate(my_chart_data);
	var nonPlantaeNames = names.slice();
	nonPlantaeNames.splice(names.indexOf("Plantae"), 1).filter(function(x) {return x!=undefined});
	console.log(nonPlantaeNames);
	my_chart_object.unload({
	  ids: nonPlantaeNames
	});
	document.getElementById("message").innerHTML = "Like birds plants can be seen all year round.";
};

var slide_10 = function() {
	my_chart_object.regions.add([{
		    "end": 4.5}]);
	my_chart_object.select(["Aves"], [0,1,2,3,4]);
	document.getElementById("message").innerHTML = "However, most observations are from January through May.";
};

var slide_11 = function() {
	//months = months.slice(1, months.length);
	var names = processTaxa(allData.all.results, ['count'], "preferred_common_name", false, false, ["iconic_taxon_name", "rank"], [["Plantae"], ["species"]], [function(val, set) {return (set.indexOf(val)==-1);}, function(val, set) {return (set.indexOf(val)==-1);}]).names;
	names = names.filter(function(n){ return n != undefined });
	processed_data = months.map(function(month) {
		return processTaxa(allData[month].results, ["count"], "preferred_common_name", 
  			false, false, ["iconic_taxon_name", "preferred_common_name"], [["Plantae"], names], 
  			[function(val, set) {return (set.indexOf(val)==-1);}, 
  			 function(val, set) {return (set.indexOf(val)==-1);}]);});
	processed_data = rejiggerDataByMonth(names, months, processed_data);
	var colors = {};
	var colorFunc = d3.scale.linear().domain([0,5]).range(["blue","red"]);
	(range(processed_data.columns.length)).map(function(i) {
		var name = processed_data.columns[i].slice(0,1);
		var column = processed_data.columns[i].slice(1,13);
		var maxPos = column.indexOf(math.max(column));
		var colorPos = math.min([maxPos, column.length-maxPos]);
		colors[name]=(colorFunc(colorPos));
	});
	
	var my_chart_data = barChartParameters(processed_data);
	my_chart_data.axis.y.label = {"text": "# of Observations", "position": "outer-middle"};
	my_chart_data.data["type"] = "line";
	my_chart_data.data["colors"] = colors;
	my_chart_object = c3.generate(my_chart_data);
	//my_chart_object.data.colors(colors);
	document.getElementById("message").innerHTML = "We can also look at the observation patterns for individual species and color by the season with the largest number of observations.";

};

var slide_12 = function() {
	var notPoppy = (range(processed_data.columns.length)).map(function(i) {
		var name = processed_data.columns[i].slice(0,1);
		var column = processed_data.columns[i].slice(1,13);
		var maxPos = column.indexOf(math.max(column));
		if (name != "California Poppy") {
			return(name[0]);
		} else {
			return("");
		}
	});
	my_chart_object.unload({
		ids: notPoppy
	});
	document.getElementById("message").innerHTML = "In the case of many plants such as the California Poppy, the observation pattern is consistent with a spring time bloom.";
};

var slide_13 = function() {
	my_chart_object.select(['California Poppy'], [2,3]);
	document.getElementById("message").innerHTML = "The height of the bloom is in March and April.";
};



var slides = [slide_0, slide_1, slide_2, slide_3, slide_4, slide_5, slide_6, slide_7, slide_8, slide_9, slide_10, slide_11, slide_12, slide_13]; //, slide_14, slide_15, slide_16, slide_17, slide_18, slide_19, slide_20, slide_21, slide_22, slide_23, slide_24, slide_25, slide_26, slide_27];

// cycle through slides

var current_slide = 0;

var run = function() {
	//console.log(allData);
  slides[current_slide]();
  current_slide += 1;

  if (current_slide === 1) {
    document.getElementById("start_btn").innerHTML = "Start";
  } else if (current_slide === slides.length) {
    current_slide = 0;
    document.getElementById("start_btn").innerHTML = "Replay";
  } else {
    document.getElementById("start_btn").innerHTML = "Continue";
  }
};

// button event handler
document.getElementById('start_btn').addEventListener("click", run);

// init
getAllData(run);


