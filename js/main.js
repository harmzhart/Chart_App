
var xPadding = 30;
var yPadding = 30;
/*var graph = document.getElementById('myCanvas');
var c = graph[0].getContext('2d');*/
var obj = {};


function init(){
	document.getElementById('formSubmit').addEventListener('click', getInputValues);
	document.getElementById('chartGenerator').addEventListener('click', drawChart);
	var graph = document.getElementById('myCanvas');
	var c = graph.getContext('2d');


	function getInputValues(e) {
	e.preventDefault();
	var chartType = document.getElementById('chartType').value;
  var inputForX = document.getElementById('xAxisInput').value;
	var inputForY = document.getElementById('yAxisInput').value;

	if(inputForX == '' || inputForY == ''){
		alert("Please, fill in your x and y labels/values");
	}
	else{
		var inputXArray = inputForX.split(',');
		var inputYArray = inputForY.split(',');
		//console.log(inputXArray);
		//console.log(inputYArray);
		//console.log(chartType);
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

    	console.log(obj.inputValues.length);
    	document.getElementById('chartGenerator').disabled = false;
    	return obj;

	}
}

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

function drawChart() {

		c.lineWidth = 2;
		c.strokeStyle = '#333';
		c.font = 'italic 8pt sans-serif';
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

document.getElementById('clearCanvas').addEventListener('click', function() {
  c.clearRect(0, 0, graph.width, graph.height);
}, false);

}

window.onload = init;

