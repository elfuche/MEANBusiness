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
	controller:'loginCtrl'
})
.when('/dashboard',{
	templateUrl:'dashboard.html',
	controller:'dashCtrl'
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


myApp.controller('loginCtrl',['$scope','$http','$location', function($scope,$http,$location){

$scope.login = function(){
var data = {username:$scope.loginForm.username, password:$scope.loginForm.password};	
$http.post('/login',data).success(function(response){
	//alert("user trouvé!!!");

    //$scope.user = response;
    
    //$location.path('/dashboard');
    //console.log(typeof $scope.user);
    //console.log(JSON.stringify(response));
    
    //var rs= JSON.stringify(response);
    
    //alert(typeof rs);
    //alert((JSON.parse(rs))["username"]);
    
    //var user = (JSON.parse(rs))["username"];
    $location.path('/dashboard');
});

};
}]);

myApp.controller('dashCtrl',['$scope','$routeParams','$http', function($scope,$routeParams,$http){
$http.get('/dashboard').success(function(response){
	alert('dashboard controller');
	$scope.ok=response;
});

var user =$routeParams.user;
$scope.user=user;
$http.get('/panier').success(function(response){
$scope.panier = response;
});



}]);
