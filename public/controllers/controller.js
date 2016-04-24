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
.when('/panier',{
	templateUrl:'panier.html',
	controller:'cartCtrl'
})
.when('/login',{
	templateUrl:'login.html',
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
	//$location.path('/panier/'+id+'/'+title+'/'+prix);
	//$http.get('/panier/'+id).success(function(response){
	//	console.log(response);
	//});
    var data={idArticle:id,dCommande:new Date(),prix:prix,nom:title}
    $http.post('/ppanier', data).success(function(response){
	console.log(response);
	alert("Article ajouté avec succès!!!")
    });
    

};


$scope.voirPanier = function(){   
$location.path('/panier');
};

}]);

myApp.controller('cartCtrl', ['$scope','$routeParams','$http','$location', function($scope,$routeParams,$http,$location){
//Afficher contenu panier

//var refresh = function(){
$http.get('/panier').success(function(response){
$scope.panier = response;
//$location.path('/panier');
});

//refresh();

//var id = $routeParams.id;
//var title = $routeParams.title;
//var prix = $routeParams.prix;
//$scope.ref=id;
//$scope.nom = title;
//$scope.prix=prix;
//$scope.date = new Date();
//var data={idArticle:$scope.ref,dCommande:$scope.date,prix:$scope.prix,nom:$scope.nom};
//Ajouter produit dans panier


$scope.remove = function(id){
	console.log(id);
	$http.delete('/dpanier/' +id).success(function(response){
		refresh();
	});
};

$scope.Valider = function(){
	$location.path('/login');
};

}]);