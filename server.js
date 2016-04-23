var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('productlist',['productlist']);
//collections panier
var dbp = mongojs('productlist',['panier']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.json());

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

app.get('/panier/:id', function(req, res){
	var id = req.params.id;
    console.log(id);
	db.productlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
       res.json(doc);
     });
});


//extraction contenu panier
app.get('/panier', function(req, res){
  dbp.panier.find(function(err, docs){
    console.log(docs);
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

app.listen(3000);

console.log("Server Running on port 3000");