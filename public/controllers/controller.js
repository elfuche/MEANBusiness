var myApp = angular.module('myApp',[]);
myApp.controller('AppCtrl',['$scope','$http', function($scope,$http){
	
	console.log("Hello from controller");


$http.get('/productlist').success(function(response){
console.log('I received the data');
$scope.productlist = response;
});

	
}]);