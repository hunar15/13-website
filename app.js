
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'views')));
  app.engine('html', require('ejs').renderFile);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

//sync routes
app.get('/syncAtStart', routes.syncAtStart);
app.get('/syncAtEnd', routes.syncAtEnd);
app.get('/syncTransactions',routes.syncTransactions);

app.get('/get/products',routes.getProducts);
app.get('/get/display',routes.getAllDisplayUnits);
app.get('/get/inventory',routes.getInventory);
app.get('/get/requests',routes.viewRequests);
app.get('/get/transactions',routes.viewTransactions);
app.get('/recompute/sellingPrice',routes.recomputeSellingPrice);
app.get('/sync/inventory',routes.syncInventory);
app.get('/sync/revenue',routes.syncRevenue);
app.get('/sync/requests',routes.syncRequests);
app.get('/recompute/stock',routes.restockCheck);

app.post('/get/transaction/details',routes.viewTransactionDetails);

app.post('/add/display',routes.addDisplayUnit);
app.post('/stock/receivedAll',routes.receivedAll);
app.post('/deleteDisplayUnit',routes.deleteDisplayUnit);
app.post('/updateDisplayUnit', routes.updateDisplayUnit);
app.post('/get/requests/details',routes.viewRequestDetails);
app.post('/add/stock',routes.addStock);
app.post('/processTransaction', routes.processTransaction);
app.post('/stock/setAsReceived', routes.setAsReceived);
app.post('/getPrice', routes.getPrice);
app.get('/getBarcodes', routes.getBarcodes);
app.post('/add/transaction', routes.addTransaction);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
