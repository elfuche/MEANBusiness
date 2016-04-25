var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('productlist',['productlist']);
//collections panier
var dbp = mongojs('productlist',['panier']);
var dbu = mongojs('productlist',['users']);
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(session({secret:"azerty456321qsdfgh789", resave:false,saveUninitialized:true}));

app.get('/productlist', function(req, res){
	console.log('I received a GET request');
	db.productlist.find(function(err, docs){
		console.log(docs);
		res.json(docs);
	});
});

app.get('/productlist/:id', function(req,res){
   var id = req.params.id;
   console.log(id);
   db.productlist.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
     res.json(doc);
   });

});


//extraction contenu panier
app.get('/panier', function(req, res){
  dbp.panier.find(function(err, docs){
    console.log(docs);
    //req.session.cart=docs;
    res.json(docs);
  });
});
//ajout dans panier
app.post('/ppanier', function(req,res){
  console.log('On mets dans le panier');
  console.log(req.body);
  dbp.panier.insert(req.body, function(err, doc){
    res.json(doc);
  });
});

app.delete('/dpanier/:id', function(req, res){
  var id = req.params.id;
  console.log(id);
  dbp.panier.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
    res.json(doc);
  });
});

//Partie login
app.post('/login', function(req, res){
var username=req.body.username;
var password = req.body.password;
console.log(username+"  "+password);
dbu.users.findOne({username:username, password:password}, function(err, user){
if(err){
console.log(err);
return res.status(500).send();
}
if(!user){
return res.status(404).send();
}

console.log("trouvé");
//register user in session
req.session.user=user;
//return res.status(200).send();
res.json(user);
})

});

app.get('/dashboard', function(req,res){
  console.log('Dashboard ici!!');
if(!req.session.user){ //if (!req.session.user)
return res.status(401).send();
console.log("ya rien ici mec!!")
}
//return res.status(200).send("Welcome to SUPER-secret");
//console.log(typeof req.session.user);
//console.log(req.session.user);
//console.log('-----------------');
//console.log(res.json(req.session.user));
return res.json(req.session.user);
});

app.listen(3000);

console.log("Server Running on port 3000");