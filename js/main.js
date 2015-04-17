//global variables
var obj = {}; // this holds the input values
var inputYArrayTwo;
//windows onload function
function init(){

	var chartType = document.getElementById('chartType').value;
	var select = document.getElementById('chartType');

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
  var inputForX = document.getElementById('xAxisInput').value;
	var inputForY = document.getElementById('yAxisInput').value;

	//Testing for non-empty input values and process values to return for line chart
	if(chartType === 'Line Chart'){
		if(inputForX == '' || inputForY == ''){
			alert("Please, fill in your x and y labels/values");
		}
		else{
			var inputXArray = inputForX.split(',');
			var inputYArray = inputForY.split(',');
			var data = [inputXArray,inputYArray];
    	var x_labels = data[0];
    	var y_values = data[1];

    	obj["inputValues"] = new Array();
    	for (var i = 0; i < x_labels.length; i++) {
    		var item = {};
    		item["X"] = x_labels[i];
    		item["Y"] = Number(y_values[i]);
    		obj.inputValues.push(item);
    	};

    	document.getElementById('chartGenerator').disabled = false;
  		return obj;
		}
	}

	//Testing for non-empty input values and process values to return for pie chart
	if (chartType === 'Pie Chart') {
		if(inputForX === '' || inputForY === ''){
			alert("Please, fill in your x and y labels/values");
		}
		else{
			var inputXArray = inputForX.split(',');
			var inputYArray = inputForY.split(',');
			inputYArrayTwo = [];
			for(var x in inputYArray){
				inputYArrayTwo.push(Number(inputYArray[x]));
			};

			console.log("Y array " + inputYArrayTwo);
			document.getElementById('chartGenerator').disabled = false;
			
		}
	}
}

//Draw line chart function
function drawLine() {

	var xPadding = 30; //padding for x axis
	var yPadding = 30; //padding for y axis

	function getMaxY() {		
  	var maxim = 0;
     
  for(var i = 0; i < obj.inputValues.length; i++) {
    if(obj.inputValues[i].Y > maxim) {
      maxim = obj.inputValues[i].Y;
    }
  }
     
   maxim += 10 - maxim % 10;
   return maxim;
	}

	function getXPixel(val) {
  	return ((graph.width - xPadding) / obj.inputValues.length) * val + (xPadding * 1.5);
	}
 
	function getYPixel(val) {
    return graph.height - (((graph.height - yPadding) / getMaxY()) * val) - yPadding;
	}

		c.clearRect(0, 0, graph.width, graph.height);
		c.lineWidth = 2;
		c.strokeStyle = '#333';
		c.font = '10pt sans-serif';
		c.textAlign = "center";
		c.beginPath();
		c.moveTo(xPadding, 0);
		c.lineTo(xPadding, graph.height - yPadding);
		c.lineTo(graph.width, graph.height - yPadding);
		c.stroke();

		for(var i = 0; i < obj.inputValues.length; i++) {
	    c.fillText(obj.inputValues[i].X, getXPixel(i), graph.height - yPadding + 20);
		}

		c.textAlign = "right"
		c.textBaseline = "middle";
	 
		for(var i = 0; i < getMaxY(); i += 10) {
	    c.fillText(i, xPadding - 10, getYPixel(i));
		}

		c.strokeStyle = '#f00';
		c.beginPath();
		c.moveTo(getXPixel(0), getYPixel(obj.inputValues[0].Y));
	 
		for(var i = 1; i < obj.inputValues.length; i ++) {
	    c.lineTo(getXPixel(i), getYPixel(obj.inputValues[i].Y));
		}
		c.stroke();

		c.fillStyle = '#333';
	 
		for(var i = 0; i < obj.inputValues.length; i ++) {  
	    c.beginPath();
	    c.arc(getXPixel(i), getYPixel(obj.inputValues[i].Y), 4, 0, Math.PI * 2, true);
	    c.fill();
		}
	document.getElementById('chartGenerator').disabled = true;
}

//Draw pie chart function

function getTotal(){
		var myTotal = 0;
		console.log("getTotal array " + inputYArrayTwo);
		for (var j = 0; j < inputYArrayTwo.length; j++) {
			myTotal += (typeof inputYArrayTwo[j] == 'number') ? inputYArrayTwo[j] : 0;
		}
	return myTotal;
}

function drawPie() {
	var lastend = 0;
	console.log("drawLine Y array " + inputYArrayTwo);
	var myTotal = getTotal();
	myData = inputYArrayTwo;
	c.clearRect(0, 0, graph.width, graph.height);
	var myColor = ["#ECD078","#D95B43","#C02942","#542437","#53777A"];

	for (var i = 0; i < myData.length; i++) {

		c.fillStyle = myColor[i];
		c.beginPath();
		c.moveTo(200,150);
		c.arc(200,150,150,lastend,lastend+(Math.PI*2*(myData[i]/myTotal)),false);
		
		c.lineTo(200,150);
		c.fill();
		lastend += Math.PI*2*(myData[i]/myTotal);
	}

	document.getElementById('chartGenerator').disabled = true;
}

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

window.onload = init;

