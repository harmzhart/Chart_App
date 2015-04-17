//global variables
var obj = {}; // this holds the input values
var arraySplittedYTwo;
//windows onload function. This contains every other functions
function init(){

	var chartType = document.getElementById('chartType').value;//get type of chart
	var select = document.getElementById('chartType');

	//event for when select box is changed
	select.addEventListener('change', function(e){
		chartType = select.value;
	});

	//get input values when submit button is clicked and generate chart when chartGenerate button is clicked
	document.getElementById('formSubmit').addEventListener('click', getInputValues);
	document.getElementById('chartGenerator').addEventListener('click', drawChart);

	//define global canvas element context
	var graph = document.getElementById('myCanvas');
	var c = graph.getContext('2d');
	document.getElementById('chartGenerator').disabled = true;

	//Getting values from input boxes
	function getInputValues(e) {
	e.preventDefault(); //this prevents search button default reload onclick
  	var initialX = document.getElementById('xAxisInput').value; //initial x values from textbox
	var initialY = document.getElementById('yAxisInput').value; //initial y values from textbox

	//Testing for non-empty input values and process values to return for line chart
	if(chartType === 'Line Chart'){
		if(initialX == '' || initialY == ''){
			alert("Please, fill in your x and y labels/values");
		}
		//the else part
		else{
			var arraySplittedX = initialX.split(','); //intial x splitted into an array
			var arraySplittedY = initialY.split(','); //initial y splitted into an array
			var data = [arraySplittedX,arraySplittedY]; //this holds the two arrays
    	var x_labels = data[0]; //x_labels represent first array
    	var y_values = data[1]; //y_labels represent second array

    	obj["inputValues"] = new Array();//creating an instance obj of array
      //a loop to get objects of array of object
    	for (var i = 0; i < x_labels.length; i++) {
    		var item = {};
    		item["X"] = x_labels[i];
    		item["Y"] = Number(y_values[i]); //convert y_values to number
    		obj.inputValues.push(item); //add each element into array obj
        //console.log(item.length);
      };

      // check for non integer y axis values
      for(var i = 0; i < obj.inputValues.length; i++) {
        if(obj.inputValues[i].Y < 0) {
          alert("Input values for y axis must be a number and must be greater than 0");
        }
      }//loop ends

    	document.getElementById('chartGenerator').disabled = false; //this enables chart generation button
  		return obj; // object obj is return by this function
		}
	}

	//Testing for non-empty input values and process values to return for pie chart
	if (chartType === 'Pie Chart') {
		if(initialX === '' || initialY === ''){
			alert("Please, fill in your x and y labels/values");
		}
    //else part
		else{
			var arraySplittedX = initialX.split(',');
			var arraySplittedY = initialY.split(',');
			arraySplittedYTwo = [];
			for(var x in arraySplittedY){
				arraySplittedYTwo.push(Number(arraySplittedY[x]));
			};

			document.getElementById('chartGenerator').disabled = false; //enable the chart generation button
		}
	}
}

  //Draw line chart function
  function drawLine() {

  	var xPadding = 30; //padding for x axis labels
  	var yPadding = 30; //padding for y axis labels

    // calculating maximun y 
  	function getMaxY() {		
    	var maxim = 0;
       
      for(var i = 0; i < obj.inputValues.length; i++) {
        if(obj.inputValues[i].Y > maxim) {
          maxim = obj.inputValues[i].Y;
        }
      }
       // y is in increamentents and rounded up to ten
      maxim += 10 - maxim % 10;
      return maxim;
  	}
	// get pixel value for x from user input
  	function getXPixel(val) {
    	return ((graph.width - xPadding) / obj.inputValues.length) * val + (xPadding * 1.5);
  	}
   	// get pixel y values from input y values
  	function getYPixel(val) {
      return graph.height - (((graph.height - yPadding) / getMaxY()) * val) - yPadding;
  	}
		
		//local variables declaration
  		c.clearRect(0, 0, graph.width, graph.height); // clears the rectangle on initialize
  		c.lineWidth = 2; //thickness of line
  		c.strokeStyle = '#333';
  		c.font = '10pt sans-serif';
  		c.textAlign = "center";
  		c.beginPath();
  		c.moveTo(xPadding, 0); // starting from y paddind a line to x pixels
  		c.lineTo(xPadding, graph.height - yPadding); // draw a line straigth to the line to form x axis
  		c.lineTo(graph.width, graph.height - yPadding); // draw a line through the path
  		c.stroke(); // stroke the path
		
		// write x labels with 20px spacing
  		for(var i = 0; i < obj.inputValues.length; i++) {
  	    		c.fillText(obj.inputValues[i].X, getXPixel(i), graph.height - yPadding + 20);
  		}

  		c.textAlign = "right"
  		c.textBaseline = "middle";
  	 	
  	 	//write y values with 10px spacing
  		for(var i = 0; i < getMaxY(); i += 10) {
  	    		c.fillText(i, xPadding - 10, getYPixel(i));
  		}

  		c.strokeStyle = '#f00'; // draw stroke with color
  		c.beginPath(); // call begin path function for where to begin
  		c.moveTo(getXPixel(0), getYPixel(obj.inputValues[0].Y)); // end at the specified
  	 	
  		for(var i = 1; i < obj.inputValues.length; i ++) {
  	    		c.lineTo(getXPixel(i), getYPixel(obj.inputValues[i].Y));
  		}
  		c.stroke(); // stroke it

  		c.fillStyle = '#333'; // fill with this color
  	 	
  	 	// this loop draws a circled arc foe the points where x and y values intercept
  		for(var i = 0; i < obj.inputValues.length; i ++) {  
  	    		c.beginPath(); // begin here
  	    		c.arc(getXPixel(i), getYPixel(obj.inputValues[i].Y), 4, 0, Math.PI * 2, true); // calculate here and end
  	    		c.fill(); // fill with color
  		}
  	document.getElementById('chartGenerator').disabled = true;
}

//Draw pie chart function getTotal of input Y
  function getTotal(){
  		var myTotal = 0;
  		//console.log("getTotal array " + arraySplittedYTwo);
  		for (var j = 0; j < arraySplittedYTwo.length; j++) {
  			myTotal += (typeof arraySplittedYTwo[j] == 'number') ? arraySplittedYTwo[j] : 0; // checks if input y is a number then calculates the sum
  		}
  	return myTotal;
  }

  //actual function to draw pie chart
  function drawPie() {
  	var lastend = 0; 
  	var myTotal = getTotal();
  	myData = arraySplittedYTwo;
  	c.clearRect(0, 0, graph.width, graph.height); //set canvas to empty on start
  	var myColor = ["#ECD078","#D95B43","#C02942","#542437","#53777A"]; //color fills for the data

  	for (var i = 0; i < myData.length; i++) {

  		c.fillStyle = myColor[i];
  		c.beginPath();
  		c.moveTo(200,150);
  		c.arc(200,150,150,lastend,lastend+(Math.PI*2*(myData[i]/myTotal)),false);
  		
  		c.lineTo(200,150);
  		c.fill();
  		lastend += Math.PI*2*(myData[i]/myTotal);
  	}

  	document.getElementById('chartGenerator').disabled = true; //disabled chartGenerator button
  }

  //function to be passed to the chartGenerator button due to a condiyion
  function drawChart(){
  	console.log(chartType);
  	if(chartType ==='Line Chart'){
  		drawLine();
  		
  	} else if(chartType === 'Pie Chart'){
  		console.log('drawPie');
  		drawPie();
  	}
  }

  //clear canvas button
  document.getElementById('clearCanvas').addEventListener('click', function() {
    c.clearRect(0, 0, graph.width, graph.height);
  }, false);

}

window.onload = init; //load the init function automatically

