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
.when('/register',{
	templateUrl:'register.html',
	controller:'registerCtrl'
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
    var data={idArticle:id};
    $http.post('/cart', data).success(function(response){
	console.log(response);
	alert("Article ajouté avec succès!!!")
    });
};


$scope.voirPanier = function(){   

	 $location.path('/panier');

};

}]);

myApp.controller('cartCtrl', ['$scope','$http','$location', function($scope,$http,$location){
//var refresh =function(){
$http.get('/pcart').success(function(response){
	 //alert("voilà mon panier!!!!!");	 
	 //$scope.panier=response;
	 $scope.panier=response;
});
$http.get('/total').success(function(response){
	$scope.total=response;
});	
//};
//refresh();

$scope.remove = function(id){
alert(id);
	$http.delete('/cart/' +id).success(function(response){
		alert("supprimé");
		//refresh();
	});
	$http.get('/postsuppr').success(function(response){
		$scope.panier=response;
	});

	$http.get('/totalsuppr').success(function(response){
	$scope.total=response;
});	
};

$scope.Valider = function(){
	$location.path('/login');
};

}]);

myApp.controller('loginCtrl',['$scope','$http','$location', function($scope,$http,$location){

$scope.login = function(){
	alert('login button');
var data = {username:$scope.loginForm.username, password:$scope.loginForm.password};	
$http.post('/login',data).success(function(response){
    $location.path('/dashboard');
});

};
}]);

myApp.controller('dashCtrl',['$scope','$routeParams','$http', function($scope,$routeParams,$http){
$http.get('/dashboard').success(function(response){
	//alert('dashboard controller');
	$scope.ok=response;
});

//var user =$routeParams.user;
//$scope.user=user;


$http.get('/totalsuppr').success(function(response){
	$scope.tot=response;
});	
}]);

myApp.controller('registerCtrl', ['$scope','$http','$location', function($scope,$http,$location){
	$scope.register = function(){
	var data = {name: $scope.name, username: $scope.username, email:$scope.email, password: $scope.password};
	$http.post('/register',data).success(function(response){
     console.log(response);
     alert('Vous pouvez vous connecter maintenant');
     $location.path('/login');
	});
};
}]);