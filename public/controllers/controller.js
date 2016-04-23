var myApp = angular.module('myApp',['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider){

$routeProvider
.when('/',{
	templateUrl:'products.html',
	controller:'AppCtrl'
})
.when('/render/:id',{
    templateUrl:'render.html',
	controller:'detailCtrl'	
})
.when('/panier/:id/:title/:prix',{
	templateUrl:'panier.html',
	controller:'cartCtrl'
})
.otherwise({redirectTo:'/'})
}]);




myApp.controller('AppCtrl',['$scope','$http','$location', function($scope,$http,$location){
	
	console.log("Hello from controller");


$http.get('/productlist').success(function(response){
console.log('I received the data');
$scope.productlist = response;
});

$scope.Commander = function(id){
	console.log(id);
	$location.path('/render/'+id);
	
};
	
}]);


myApp.controller('detailCtrl',['$scope','$http','$routeParams','$location', function($scope,$http,$routeParams,$location){
var id = $routeParams.id;	
$http.get('/productlist/' +id).success(function(response){
		$scope.produit = response;
	});

$scope.ajoutPanier = function(id,title,prix){
	//alert("ok");
	console.log("panier reçoit le produit n° "+id+" nommé: "+title+" à: "+prix);
	$location.path('/panier/'+id+'/'+title+'/'+prix);
	$http.get('/panier/'+id).success(function(response){
		console.log(response);
	});
};

}]);

myApp.controller('cartCtrl', ['$scope','$routeParams', function($scope,$routeParams){
var id = $routeParams.id;
var title = $routeParams.title;
var prix = $routeParams.prix;
console.log(id);
console.log(title);
console.log(prix);
$scope.ref=id;
$scope.nom = title;
$scope.prix=prix;
$scope.date = new Date();
}]);