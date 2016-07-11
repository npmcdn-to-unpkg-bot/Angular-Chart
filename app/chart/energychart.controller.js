app.controller('myController', function($scope, ChartService) {	
	$scope.responseData = [];
	$scope.pastDate = "2016-06-08";	
	$scope.options = ['monthly', 'quarterly', 'yearly'];
	$scope.periodValue = $scope.options[0];
	
	// Show loading spinner.
	$scope.loading = true;
	
	// Update Chart based on selected period in dropdown
	$scope.updatePeriod=function(val){
		if (val=='monthly'){
			
			$scope.pastDate = getPeriod(30);
		}
		if (val=='quarterly'){
			$scope.pastDate = getPeriod(91);
		}
		else if (val=='yearly'){
			$scope.pastDate = getPeriod(365);
		}  
		showChart();
	}	
	
	// Format JSON date per HighChart date
	var dateFormat = function(dateIn) {
		dateIn=dateIn.split("-");
		var newDate=dateIn[1]+"/"+dateIn[2]+"/"+dateIn[0];
		var dat = new Date(newDate).getTime();
		return dat;			
	};
	
	// Get Index of particular date in array	
	var getIndexOf = function(arr, k){
		for(var i=0; i<arr.length; i++){
			var index = arr[i][0].indexOf(k);
			if (index > -1){
				return [i];
			}
		}
	}
	
	// Get particular date based on period selection in dropdown
	var getPeriod = function(n){
		var date = new Date("2016-07-08");
		var pastDate = date.setDate(date.getDate() - n);
		var t = new Date(pastDate);
		var dd = t.getDate()+1;
		var mm = t.getMonth()+1;
		var yyyy = t.getFullYear();		
		var myDate = yyyy + '-' + ('0' + mm).slice(-2) + '-' + ('0' + dd).slice(-2);		
		return myDate;
	}
	
	// Push data into array as per HighChart format
	var getChartFormatData = function(json){
		var dates = json || [];
		var elements = json || [];
		var chartSeries = [];
		var periodLength = getIndexOf(json, $scope.pastDate);
		if (elements[0]){					
			for (var i = 0; i <= periodLength; i++) {
				var dat = dateFormat(dates[i][0]);						
				var pointData = [
					dat,
					elements[i][1]
				];
				chartSeries.push(pointData);
			};
		}
		return chartSeries;
	};		
	
	// Show HighChart
	var showChart = function(){
		ChartService.getchart().then(function(responseData) {
			$scope.loading = false;
			$scope.chartData = getChartFormatData(responseData);
			$('#container').highcharts({
				chart: {
					zoomType: 'x'
				},
				title: {
					text: 'Energy Consumption For 2016'
				},
				xAxis: {
					type: 'datetime'
				},
				yAxis: {
					title: {
						text: 'Energy Consumption'
					}
				},
				legend: {
					enabled: false
				},
				tooltip: {
					crosshairs: [true,true],
					pointFormat: "Energy Consumed: <b>{point.y} KWH</b><br/>"
				},
				series: [{
					type: 'line',
					data: $scope.chartData
				}]
			});
		})
	}         
	showChart();
})