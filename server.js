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
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

app.use(express.static(__dirname+"/public"));

app.use(bodyParser.json());

app.use(session({
     secret: 'secret',
     store: new MongoStore({db:dbcart}),
     resave: false,
     saveUninitialized: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

//Les routes
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
  req.session.total = req.session.total-obj[i].price;        
        break;
      }
    }

//suppression totale du panier après diminution    
if(obj[i].qty<=0){obj.splice(i, 1);}


req.session.shop = obj;

//req.session.cart={obj, amount};

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


//    Partie PassportJs

//passport.use(new LocalStrategy(
  //function(username, password, done) {
    //dbu.users.findOne({username:username, password:password}, function(err, user) {
      //if (err) { return done(err); }
      //if (!user) {
        //return done(null, false);
        //console.log('login raté');
      //}
      //compare password
      //console.log('user: '+user);
      //req.session.user = user;
       //bcrypt.compare(password, hash, function(err, res) {
        // res == true
        //if(err) { console.log('password error'); return done(null, false);}
        //console.log("password verified");
       //});
      //fin comparaison
      //if (!user.validPassword(password)) {
        //return done(null, false, { message: 'Incorrect password.' });
      //}
      
      //return done(null, user);
    //});
  //}
//));

//passport.serializeUser(function(user, done) {
  //done(null, user.id);
//});

//passport.deserializeUser(function(id, done) {
  //dbu.users.find({ _id: ObjectId(id) }, function(err,user) { 
    //done(err, user); 
  //});
//});
//app.post('/login',
  //passport.authenticate('local', {successRedirect:'/llogin', failureRedirect:'/login',failureFlash: true}),
  //function(req, res) {
    //var username=req.body.username;
    //var password = req.body.password;
    //req.session.username = req.body.username;
    //req.session.password = req.body.password;
  
  //});
//fin passportJS
//app.get('llogin', function(req,res){
  
//});
//    fin PassportJs

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
//compare
//bcrypt.compare(password, user.password, function(err, isMatch) {
  //    if(err) throw err;
    //  err(null, isMatch);
  //});


//register user in session
req.session.user=user;
//return res.status(200).send();
res.json(user);
})
});


//Partie login

app.get('/dashboard', function(req,res){
  console.log('Dashboard ici!!');
if(!req.session.user){ //if (!req.session.user)
return res.status(401).send();
console.log("ya rien ici mec!!")
}
return res.json(req.session.user);
});

app.post('/register', function(req, res){
console.log(req.body);
//cryptage password
bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
          req.body.password = hash;
      });
  });
//fin cryptage
  dbu.users.insert(req.body, function(err, doc){
    res.json(doc);
  });
});
app.listen(3000);

console.log("Server Running on port 3000");