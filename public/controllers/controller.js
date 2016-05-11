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
.when('/services',{
	templateUrl:'services.html',
	controller:'srvCtrl'
})
.when('/rrender/:id',{
    templateUrl:'rrender.html',
	controller:'rdetailCtrl'	
})
.when('/reservation/:id', {
  templateUrl:'reservation.html',
  controller:'resCtrl'
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


//Partie Réservations

myApp.controller('srvCtrl',['$scope','$http','$location', function($scope,$http,$location){
	$scope.ok='test';
	console.log("Hello from srv controller");


$http.get('/reservelist').success(function(response){
console.log('I received the data');
$scope.produit = response;
});

$scope.Commander = function(id){
	console.log(id);
	$location.path('/rrender/'+id);
	
};
	
}]);


myApp.controller('rdetailCtrl',['$scope','$http','$routeParams','$location', function($scope,$http,$routeParams,$location){
var id = $routeParams.id;

$http.get('/reservelist/' +id).success(function(response){
		$scope.produit = response;
	});

//Traitement des dates disponibles pour la réservation du produit
$http.get('/datesDispo/' +id).success(function(response){
	var dates = response;

//partie datepicker
$(function() {
	
         var unavailableDates=dates;

        function unavailable(date) {
        dmy = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
        if ($.inArray(dmy, unavailableDates) == -1) {
            return [true, ""];
        } else {
            return [false, "", "Unavailable"];
        }
        }


            $( "#datepicker,#datepicker2" ).datepicker({
            	monthNames: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
			dayNamesMin: ["Di","Lu","Ma","Me","Je","Ve","Sa"],
			dateFormat: 'yy-mm-dd',
			numberOfMonths: 2,
            	beforeShowDay: function(date){
                var string = jQuery.datepicker.formatDate('dd-mm-yy', date);
                 return [unavailableDates.indexOf(string) == -1 ]
                 },
                showOn: "button",
                buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif",
                buttonImageOnly: true,
                onSelect: function(){
                var selected = $(this).val();
                 alert(selected);
                }
            });
        });
//fin partie datepicker
});

$scope.louer = function(){
Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};
//Traitement pour calculer dates dans un intervalle
function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      var month=currentDate.getMonth()+1;
      month = month<10 ? "0"+ (currentDate.getMonth()+1) : currentDate.getMonth()+1; 
      var jour=currentDate.getDate();
      jour = jour<10 ||jour===1 ? "0"+currentDate.getDate() : currentDate.getDate(); 
        dateArray.push(jour+"-"+month+"-"+currentDate.getFullYear());
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

   $(function() {
    var d1 = $('#datepicker').val();
    console.log(d1);
    var d2 = $('#datepicker2').val();
    console.log(d2);
    
   console.log(typeof d1);
   var ds1=d1.replace('-',' ');
   var dc1 = ds1.replace('-',' ');
   console.log(dc1);
   console.log(typeof new Date(dc1));
   console.log(((new Date(dc1)) instanceof Date) );
   var startDate = new Date(dc1);
   var mon;
      mon = mon<9 ? "0"+ (startDate.getMonth()+1) : startDate.getMonth()+1; 
   console.log(startDate.getDate()+" "+(mon)+" "+ startDate.getFullYear());

   console.log("plus un jour");
   console.log(startDate.addDays(1));
   
  var ds2=d2.replace('-',' ');
   var dc2 = ds2.replace('-',' ');
  var endDate= new Date(dc2);

  var arr = getDates(startDate,endDate);
  console.log(arr);
 
  var donnees = {idArticle:id,dates:arr};
  $http.post('/updateProduit', donnees).success(function(response){
    alert('modifié!!!');
    $location.path('/reservation/'+id);
  });

   });
};

}]);

myApp.controller('resCtrl',['$scope','$http','$routeParams', function($scope, $http, $routeParams){
  var id = $routeParams.id;
  $scope.ok='test';
$http.get('/reservation/'+id).success(function(response){  
  console.log("controlleur reservation");
 $scope.resa = response[0];

});


}]);


