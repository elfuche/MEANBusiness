var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongojs = require('mongojs');
var db = mongojs('productlist',['productlist']);
var dbcart=mongojs('productlist',['cartSession']);
//collections panier
var dbp = mongojs('productlist',['panier']);
var dbu = mongojs('productlist',['users']);
var bodyParser = require('body-parser');
var app = express();


app.use(express.static(__dirname+"/public"));

app.use(bodyParser.json());

app.use(session({
     secret: 'secret',
     store: new MongoStore({db:dbcart}),
     resave: false,
     saveUninitialized: true
}));


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

app.post('/cart', function (req, res) {
        //Load (or initialize) the cart
        req.session.cart = req.session.cart || {};
        var cart = req.session.cart;
        //Read the incoming product data
        var id = req.body.idArticle;
        console.log(id);
        //var id = req.body.id;
        //console.log(id);
        //Locate the product to be added
        db.productlist.findOne({_id: mongojs.ObjectId(id)}, function(err,doc){
          if (err) {
                console.log('Error adding product to cart: ', err);
                return;
            }
          //Add or increase the product quantity in the shopping cart.
            if (cart[id]) {
                cart[id].qty++;
            }
            else {
                cart[id] = {
                    ref: id,
                    name: doc.title,
                    price: doc.prix,
                    //prettyPrice: prod.prettyPrice(),
                    qty: 1
                };
            }
          res.json(doc);
        });        
    });

app.get('/pcart', function (req, res) {
  
        console.log("Donne moi ton panier");
        //Retrieve the shopping cart from memory
        var cart = req.session.cart,
            displayCart = {items: [], total: 0},
            total = 0;
        req.session.shop = req.session.shop || [];    
        if (!cart) {
            //res.render('result', {result: 'Your cart is empty!'});
            //return;
            console.log("Ton panier est vide !!!");
        }
        //Ready the products for display
        for (var item in cart) {
            displayCart.items.push(cart[item]);
            total += (cart[item].qty * cart[item].price);
        }
        req.session.total = displayCart.total = total.toFixed(2);
        console.log(displayCart.items);
        req.session.shop=displayCart.items;
        var model =
        {
            cart: displayCart
        };

        //res.status(200).send(JSON.parse(model));
       res.json(req.session.shop);
});
app.get('/total', function(req,res){
  res.json(req.session.total);
});

app.delete('/cart/:id', function(req, res){
  console.log('supprimer cette horreur!!!');
  var id = req.params.id;
  console.log(id);
  
  var obj= req.session.shop;
    var i=0;
    for(i=0;i<obj.length;i++){
      if(obj[i].ref === id){
        obj[i].qty--;
  //Recalcul du prix total
  var amount = req.session.total = req.session.total-obj[i].price;        
        break;
      }
    }

//suppression totale du panier après diminution    
if(obj[i].qty<=0){obj.splice(i, 1);}


req.session.shop = obj;

req.session.cart={obj, amount};

//res.json(req.session.shop);
console.log("horreur modifiée");
res.redirect('/postsuppr');
});

app.get('/postsuppr', function(req, res){
res.json(req.session.shop);
});

app.get('/totalsuppr', function(req,res){
  res.json(req.session.total);
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
return res.json(req.session.user);
});

app.listen(3000);

console.log("Server Running on port 3000");