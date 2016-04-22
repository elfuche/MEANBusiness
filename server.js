var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('productlist',['productlist']);
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
app.listen(3000);

console.log("Server Running on port 3000");