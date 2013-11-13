
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var stripe = require('stripe')("sk_test_ROgDRilyDyxnnxBRAWBDOFnw");

var app = express();

// all environments
app.set('port', process.env.PORT || 1337);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/charge', function(req, res){
  res.send("get ok!")
});
app.post('/charge', function(req, res){
  var stripeToken = req.body.stripeToken;
  var amount = req.body.amount * 100;
  stripe.charges.create({
    amount: amount,
    currency: 'usd',
    card: stripeToken,
    description: 'payinguser@info.cc'
  }, function(err, charge){
    if(err) {
      console.log(err)
      console.log('charge err')
    } else {
      console.log('charge ok')
      console.log(charge)
    }
  });
  res.send("ok! <a href='javascript:window.history.back()'>Go Back</a>");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
