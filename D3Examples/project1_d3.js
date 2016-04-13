var DataSet = function() {
  this.data = {
    "items": {
      "item": [{
          "id": "0001",
          "type": "donut",
          "name": "Cake",
          "ppu": 0.55,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }, {
              "id": "1002",
              "type": "Chocolate"
            }, {
              "id": "1003",
              "type": "Blueberry"
            }, {
              "id": "1004",
              "type": "Devil's Food"
            }]
          },
          "topping": [{
            "id": "5001",
            "type": "None"
          }, {
            "id": "5002",
            "type": "Glazed"
          }, {
            "id": "5005",
            "type": "Sugar"
          }, {
            "id": "5007",
            "type": "Powdered Sugar"
          }, {
            "id": "5006",
            "type": "Chocolate with Sprinkles"
          }, {
            "id": "5003",
            "type": "Chocolate"
          }, {
            "id": "5004",
            "type": "Maple"
          }]
        }, {
          "id": "0002",
          "type": "donut",
          "name": "Raised",
          "ppu": 0.55,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }]
          },
          "topping": [{
            "id": "5001",
            "type": "None"
          }, {
            "id": "5002",
            "type": "Glazed"
          }, {
            "id": "5005",
            "type": "Sugar"
          }, {
            "id": "5003",
            "type": "Chocolate"
          }, {
            "id": "5004",
            "type": "Maple"
          }]
        },

        {
          "id": "0003",
          "type": "donut",
          "name": "Old Fashioned",
          "ppu": 0.55,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }, {
              "id": "1002",
              "type": "Chocolate"
            }]
          },
          "topping": [{
            "id": "5001",
            "type": "None"
          }, {
            "id": "5002",
            "type": "Glazed"
          }, {
            "id": "5003",
            "type": "Chocolate"
          }, {
            "id": "5004",
            "type": "Maple"
          }]
        }, {
          "id": "0004",
          "type": "bar",
          "name": "Bar",
          "ppu": 0.75,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }, ]
          },
          "topping": [{
            "id": "5003",
            "type": "Chocolate"
          }, {
            "id": "5004",
            "type": "Maple"
          }],
          "fillings": {
            "filling": [{
              "id": "7001",
              "name": "None",
              "addcost": 0
            }, {
              "id": "7002",
              "name": "Custard",
              "addcost": 0.25
            }, {
              "id": "7003",
              "name": "Whipped Cream",
              "addcost": 0.25
            }]
          }
        },

        {
          "id": "0005",
          "type": "twist",
          "name": "Twist",
          "ppu": 0.65,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }, ]
          },
          "topping": [{
            "id": "5002",
            "type": "Glazed"
          }, {
            "id": "5005",
            "type": "Sugar"
          }, ]
        },

        {
          "id": "0006",
          "type": "filled",
          "name": "Filled",
          "ppu": 0.75,
          "batters": {
            "batter": [{
              "id": "1001",
              "type": "Regular"
            }, ]
          },
          "topping": [{
            "id": "5002",
            "type": "Glazed"
          }, {
            "id": "5007",
            "type": "Powdered Sugar"
          }, {
            "id": "5003",
            "type": "Chocolate"
          }, {
            "id": "5004",
            "type": "Maple"
          }],
          "fillings": {
            "filling": [{
              "id": "7002",
              "name": "Custard",
              "addcost": 0
            }, {
              "id": "7003",
              "name": "Whipped Cream",
              "addcost": 0
            }, {
              "id": "7004",
              "name": "Strawberry Jelly",
              "addcost": 0
            }, {
              "id": "7005",
              "name": "Rasberry Jelly",
              "addcost": 0
            }]
          }
        }
      ]
    }
  }
};

function isArray(input) {
  //console.log(Object.prototype.toString.call(input));
  if (Object.prototype.toString.call(input) === '[object Array]') {
    return true;
  } else {
    return false;
  }
}

var i = 0;

function parseInputData(input) {
  var node = {
    'name': null,
    'type': null,
    "children": [],
    "children_key": null
  };
  // if there is only one key set name that key and set variable to make sure this key isn't used again 
  // as a node name
  var pushNonArrayObjectWithKey = true;
  if (Object.keys(input).length == 1 & !node.name) {
  	node["name"] = Object.keys(input)[0];
    pushNonArrayObjectWithKey = false;
  }
  // loop through object keys and set as attributes or as new objects
  for (var key in input) {
    var next = input[key];
    if (typeof next === 'object') {
      if (isArray(next)) {
      	if (pushNonArrayObjectWithKey) {
          var toadd = {};
          toadd[key] = next;
          node["children"].push(parseInputData(toadd));	
        } else {
          for (var item in next) {
            node["children"].push(parseInputData(next[item]));
          }
      	}
      } else {
        var toadd = {};
        toadd[key] = next;
        if (pushNonArrayObjectWithKey) {
        	node["children"].push(parseInputData(toadd));
        } else {
          node["children"].push(parseInputData(next));
        }
      }
    } else {
      node[key] = input[key];
    }
  }
  node["otherid"]=node["id"];
  node["id"] = null;
  return node;
}

// instantiate data
var mydata = parseInputData((new DataSet()).data);

// set height and width of svg
var height = 500,
  width = 500;

// make an svg on the page
var svg = d3.select("#hierarchy")
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .append("g")
  .attr("transform", "translate(50,0)");

// create a tree object without data
var tree = d3
  .layout
  .tree()
  .size([height, width - 150]);

// create a path generation object to make curvy lines
var diagonal = d3
  .svg
  .diagonal()
  .projection(function(d) {
    return [d.y, d.x];
  });

var search_term = "Glazed";

function getNodeName(d) {
  if (d.name) {
    return d.name;
  } else if (d.type) {
    return d.type;
  } else {
    return "none";
  }
}

function findInPath(source, text) {
	//console.log("text");
  //console.log(text);
  source.name = getNodeName(source);
  if (source.name) {
  	if (source.name==text) {
    //if (source.name.search(text) > 0) {
      //console.log(source.name);
      return true;
    }
  }
  if (source.children || source._children) {
    var c = source.children ? source.children : source._children;
    for (var i = 0; i < c.length; i++) {
      if (findInPath(c[i], text)) {
        return true;
      }
    }
  }
  return false;
}

//function findInPath(source, text) {
	//var name = Object.prototype.toString(getNodeName(source));
//  if (source.name) {
//  	console.log(source.name);
//  	if (source.name.search(text) > 0) {
//    	return true;
//  	}
  //console.log(name);
  //if (name.search(text) > 0) {
  //  console.log("yes!!");
  //  return true;
  //}
//  }
//  if (source.children || source._children) {
//    var c = source.children ? source.children : source._children;
//    for (var i = 0; i < c.length; i++) {
//      if (findInPath(c[i], text)) {
//        return true;
//      }
//    }
//  }
//  return false;
//}

// set the origin to be to the left and centered vertically
mydata.x0 = height / 2;
mydata.y0 = 0;

var duration = 750;

update(mydata);

// create function that updates the data
function update(source, newsearchterm) {
	console.log(newsearchterm);
	console.log(newsearchterm==null);
  if (newsearchterm!=null) {
  	search_term = newsearchterm;
  }
  console.log(search_term);
  // create node objects
  var nodes = tree.nodes(mydata);
  // create link objects
  var links = tree.links(nodes);
  // create node var and add unique id to each node
  var i =0;
  var node = svg
    .selectAll("g.node")
    .data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });
  console.log(node);
    //.data(nodes);

  // create variable for all nodes not yet visualized and position them at the parent node origin
  var nodeEnter = node.
  enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    });
    //.on("click", click);

  // draw circles for the new nodes
  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("stroke", "steelblue")
    .style("stroke-width", "1.5px")
    .on("click", clickExpander);

  // draw text labels for new nodes
  nodeEnter.append("text")
    .attr("x", function(d) {
      return d.children || d._children ? -13 : 13;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function(d) {
      return getNodeName(d);
    })
    .style("fill-opacity", 1e-6)
    .style("font", "10px sans-serif")
    .style("fill", "black")
    .style("stroke-width", "0.01px")
    .on("click", clickHighlighter);

  // move nodes from origin to final position
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  // change color of specific nodes
  nodeUpdate.select("circle")
    .filter(function(d) {
      return findInPath(d, search_term)
    })
    .style("fill", function(d) {
      return d._children ? "red" : "#faa";
    });

  // set colore of nodes not set above
  nodeUpdate.select("circle")
    .filter(function(d) {
      return !findInPath(d, search_term)
    })
    .style("fill", function(d) {
      return d._children ? "lightsteelblue" : "#fff";
    });

	//nodecolor = d3.scale.ordinal()
    //      .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2"])
      //    .domain([""]);

  nodeUpdate.select("circle")
    .filter(function(d) {
      return findInPath(d, search_term)
    })
    .style("fill", function(d) {
      return d._children ? "red" : "#faa";
    });

  nodeUpdate.select("circle")
    .filter(function(d) {
      return !findInPath(d, search_term)
    })
    .style("fill", function(d) {
      return d._children ? "lightsteelblue" : "#fff";
    });
    
  nodeUpdate.select("circle")
    .attr("r", 5)
    .style("stroke", "steelblue")
    .style("stroke-width", "1.5px");


  // set node color
  //nodeUpdate.select("circle")
  //  .style("fill", "lightsteelblue");

  // make updated nodes visible
//  nodeUpdate.select("circle")
//    .attr("r", 5)
//    .style("stroke", "steelblue")
//    .style("stroke-width", "1.5px");

  // make labels of updated nodes visible
  nodeUpdate.select("text")
    .style("fill-opacity", 1)
    .style("font", "10px sans-serif")
    .style("fill", "black")
    .style("stroke-width", ".01px");

  // select nodes to delete and transition them to the origin of their parent
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  // set size of exiting nodes to be really small
  nodeExit.select("circle")
    .attr("r", 1e-6);

  // set opacity to be clear for labels of exiting nodes
  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  // select all links and add the target id as data for the link
  var link = svg.selectAll("path.link")
    .data(links, function(d) {
      return d.target.id;
    });

  // visualize unvisualized links but make origin and destiation of links the same so they will be invisible
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {
        x: source.x0,
        y: source.y0
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .style("fill", "none")
    .style("stroke-width", "1.5px");

  // animate expansion of links
  link.transition()
    .duration(duration)
    .attr("d", diagonal);

  // on exit contract the links
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();

	// create a link filter
  var linkFilter = function(d) {
  	return findInPath(d.target, search_term)
	}

  // color certain links red
  link.filter(linkFilter).style("stroke", "red");

  // stroke of links not in the filter
  link.filter(function(d) {
    return !linkFilter(d);
  }).style("stroke", "ccc");
  //link.style("stroke", "ccc");

  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function clickExpander(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d, null);
}

function clickHighlighter(d) {
  update(d, getNodeName(d));
}


