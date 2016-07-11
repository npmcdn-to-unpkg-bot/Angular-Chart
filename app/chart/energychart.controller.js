app.controller('myController', function($scope, ChartService) {	
	$scope.responseData = [];
	$scope.pastDate = "2016-06-08";	
	$scope.options = ['monthly', 'quarterly', 'yearly'];
	$scope.periodValue = $scope.options[0];
	
	$scope.updatePeriod=function(val){
		if (val=='monthly'){				
			$scope.pastDate = "2016-06-08";
		}
		if (val=='quarterly'){
			$scope.pastDate = "2016-04-08";
		}
		else if (val=='yearly'){
			$scope.pastDate = "2015-07-08";
		}  
		showChart();
	}	
	
	var dateFormat = function(dateIn) {
		dateIn=dateIn.split("-");
		var newDate=dateIn[1]+"/"+dateIn[2]+"/"+dateIn[0];
		var dat = new Date(newDate).getTime();
		return dat;			
	};
		
	var getIndexOf = function(arr, k){
		for(var i=0; i<arr.length; i++){
			var index = arr[i][0].indexOf(k);
			if (index > -1){
				return [i];
			}
		}
	}
		
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
		
	var showChart = function(){
		ChartService.getchart().then(function(responseData) {
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