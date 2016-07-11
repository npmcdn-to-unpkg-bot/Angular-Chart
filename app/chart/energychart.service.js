app.service('ChartService', function($http, $q) {
	var dataLoaded = false;
	var responseData = null;
	
	this.getchart = function(){
		if(!dataLoaded) {
			return $http.get("https://www.quandl.com/api/v3/datasets/WIKI/AAPL.json?column_index=4&api_key=xWD9EBTHstu3G_D7ZJcV")
			.then(function(response) {
				responseData = response.data.dataset.data;
				return responseData;
			})
		}
		else {
            return $q.when(responseData);
          }
	}

});