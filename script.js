			//Issues: 1) create filters (multiselect boxes) from nested array
					//2) link filters to chart (first: select one company, make others fade away (transition))
					//3) implement voronoi geometry for line selection
					//4) implement tooltip
					//5) API: how to chain API call to get all credit card complaints in one call and create one giant array
					//6) other visualizations (i.e. chord diagram? Map?)
					//7) switch line chart from total to change per day or some other measure (toggle on chart?)
					//8) design considerations?

//y axis variable
//var total = 0;

//establishes boundaries for the window
var margin = {top: 50, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right
var height = 550 - margin.top - margin.bottom;

//parsing data structure
var parseDate = d3.time.format("%x").parse//,
	/*bisectDate = d3.bisector(function(d) { return d["Date received"]; }).left
	formatDate = d3.time.format("%b %d")*/;

//defining scale for x axis
var x = d3.time.scale()
    .range([0, width]);

//defining scale for y axis
var y = d3.scale.linear()
    .range([height, 0]);

//defining orientation for x axis and establishing svg axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

//defining orientation of y axis and establishing svg axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

//defining path of line chart (drawing effects, etc.)
var line = d3.svg.line()
	.interpolate("linear")
    .x(function(d) { /*console.log("date0", d["Date received"]);*/ return x(d["Date received"]); })
    .y(function(d, i) { /*console.log("hmm...", y(i));*/ return y(i); })   

//placing svg html body and defining boundaries
var myChart = d3.select("#lineChart")
	.append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom) 
    .append("g")
    	.attr("transform", "translate(" + margin.left + "," + (margin.top-20) + ")")
    
//tooltip variable
/*var focus = myChart.append("g")
    .attr("class", "focus")
    .style("display", "none");*/
      
  //get the data
d3.csv("https://data.consumerfinance.gov/resource/x94z-ydhh.csv?$order=date_received&state=OH&product=credit%20card",
//d3.csv("https://data.consumerfinance.gov/resource/x94z-ydhh.csv?$order=date_received&product=credit%20card", 
		function(error, data) {
  data.forEach(function(d,i) {
    d["Date received"] = parseDate(d["Date received"]);
    //d.total= ++total;
});

//creating nested array
    var bankData = d3.nest()
    	//.rollup(function(leaves) { return leaves.length; })
    	.key(function(d) { Company: return d["Company"]; })
    	
    	/*.key(function(d) { return {
    			Company: d["Company"],
    			Total: d.total } ;})*/
    	//.rollup(function(leaves) { return leaves.length; })
    	//.key(function(d) {return d["State"]; })
    	.entries(data)
    	//console.log("bankData", bankData);
    	console.log("banks", bankData);
    	
//line color variable
var color = d3.scale.ordinal()
		  .domain([0, bankData.length*.33, bankData.length*.66, bankData.length
		  ])	//sets cycling order
          .range(["#330099", "#669900","#009933","#990066","#00e64d"]); //colors to cycle through

//scale the range of the data.  Need to set y domain as function of value.length(?) 
  x.domain(d3.extent(data, function(d) { /*console.log("x", d["Date received"]);*/ return d["Date received"];  }));
  y.domain(d3.extent(bankData, function(d) { return d.values.length; }));
  //y.domain(d3.extent([0,100]));
  //data, function(d) { return total; }));
  //y.domain(d3.extent( [0, bankData.values]));
  //console.log("y", d3.extent(bankData, function(d) { return d.values.length; }));
  

  //draws x axis
  myChart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("x", 900)
      .attr("dy", "2.5em")
	  .style("text-anchor", "end")
      .text("Date received");

  //draws y axis
  myChart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-3em")
	  .style("text-anchor", "end")
      .text("Total Credit Card Complaints Received");

 var companyNames = myChart.selectAll(".companyNames") //select everything with a class named "companyNames", even though they don't exist yet
            .data(bankData) //see: http://bost.ocks.org/mike/join/
          .enter().append("g")
            .attr("class", "companyNames");

  ///*//draws lines 
  companyNames.append("path")
      .data(bankData)
      //.datum(data)
      .attr("class", "line")
      .attr("d", function (d) { //console.log("key ", d.key);
          	 return line(d.values); })
      .style("stroke", function (d) { console.log("line colors", color(d.key), d.key); return color(d.key);  }) //colors have already been mapped	
    


   //populate Company filter
var companyFilter = document.getElementById("Bank")/*.multiple = true*/;
//figure out multiple question (http://www.w3schools.com/jsref/prop_select_multiple.asp)
//why are values not being properly recognized to populate non-company filters?

//Create and append select list
var bankSelectList = document.createElement("select");
bankSelectList.id = "bankSelect";
filters.appendChild(bankSelectList);

//Create and append the options
for (var i = 0; i < bankData.length; i++) {
    var option = document.createElement("option");
    option.value = bankData[i].key;
    option.text = bankData[i].key;
    bankSelectList.appendChild(option);
    }
    
 /* ///* //populate Issue filter
var companyFilter = document.getElementById("Issue");

//Create and append select list
var issueSelectList = document.createElement("select");
issueSelectList.id = "issueSelect";
filters.appendChild(issueSelectList);

//Create and append the options
for (var i = 0; i < bankData.length; i++) {
    var option = document.createElement("option");
    option.value = bankData[i].values[i].Issue;
    option.text = bankData[i].values[i].Issue;
    issueSelectList.appendChild(option);//*/
//}

  /* //populate State filter
var stateFilter = document.getElementById("State");

//Create and append select list
var stateSelectList = document.createElement("select");
stateSelectList.id = "stateSelect";
filters.appendChild(stateSelectList);

//Create and append the options
for (var i = 0; i < bankData.length; i++) {
    var option = document.createElement("option");
    option.value = bankData[i].values[i].State;
    option.text = bankData[i].values[i].State;
    issueSelectList.appendChild(option);*/
//}
   
   /*tooltip stuff
   
    //console.log("height:", height);

  	// append the x line.  
    focus.append("line")
        .attr("class", "x")
        .style("stroke", "blue")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", height)
        .attr("y2", 0);
        
    //console.log("width:", width);
    // append the y line
	focus.append("line")
			.attr("class", "y")
			.style("stroke", "blue")
			.style("stroke-dasharray", "3,3")
			.style("opacity", 0.5)
			.attr("x1", 0)
			.attr("x2", width);

    // append the circle at the intersection
    focus.append("circle")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "blue")
        .attr("r", 4);

    // place the value at the intersection
    focus.append("text")
        .attr("class", "y1")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 1)
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    // place the date at the intersection
    focus.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 1)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em");

  	//adds rectangle overlay and mouse events
  	myChart.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

  	//determines mouse position
  	function mousemove() {
    	var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    	
    	//adds text to tooltip. how can I make it auto correct instead of exiting the box
    	//How can I add a content box around it to make it more readable?
	focus.select("circle.y")
      .attr("transform",
            "translate(" + x(d["Date received"]) + "," +
                           y(total) + ")");

  	focus.select("text.y1")
      .attr("transform",
            "translate(" + x(d["Date received"]) + "," +
                           y(total) + ")")
      .text(total);

  	focus.select("text.y2")
      .attr("transform",
            "translate(" + x(d["Date received"]) + "," +
                           y(total) + ")")
      .text(total);

  	focus.select("text.y3")
      .attr("transform",
            "translate(" + x(d["Date received"]) + "," +
                           y(total) + ")")
      .text(formatDate(d["Date received"]));

  	focus.select("text.y4")
      .attr("transform",
            "translate(" + x(d["Date received"]) + "," +
                           y(total) + ")")
      .text(formatDate(d["Date received"]));

  	focus.select(".x")
      .attr("transform",
            "translate(" + x(d["Date received"]) + "," +
                           y(total) + ")")
                 .attr("y2", height);

  	focus.select(".y")
      .attr("transform",
            "translate(" + width * -1 + "," +
                           y(total) + ")")
                 .attr("x2", width + width);
  }
  */
});



