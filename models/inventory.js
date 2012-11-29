var config = require('../config/config');

var connection = config.connection;


exports.getDiscontinued = function (callback) {
	// body...
	var query = 'SELECT p.barcode, p.name, p.category, p.manufacturer, i.stock, i.min_stock' +
			', i.selling_price, p.cost_price, p.status FROM ' +
			' product p INNER JOIN inventory i on p.barcode = i.barcode WHERE p.status=\'DISCONTINUED\';';
	var result = {};
	result['metadata'] = [];
	result['data']= [];

	result['metadata'].push({"name": "p.barcode", "label" : "Barcode", "datatype" : "string"});
	result['metadata'].push({"name": "p.name", "label" : "Name", "datatype" : "string"});
	result['metadata'].push({"name": "p.category", "label" : "Category", "datatype" : "string"});
	result['metadata'].push({"name": "p.manufacturer", "label" : "Manufacturer", "datatype" : "string"});
	result['metadata'].push({"name": "i.stock", "label" : "Stock", "datatype" : "double(,0,dot,comma,1,n/a)"});
	result['metadata'].push({"name": "i.min_stock", "label" : "Min. Stock", "datatype" : "double(,0,dot,comma,1,n/a)"});
	result['metadata'].push({"name": "i.selling_price", "label" : "Selling Price", "datatype" : "double($,2,dot,comma,1,n/a)"});
	result['metadata'].push({"name": "p.cost_price", "label" : "Cost Price", "datatype" : "double($,2,dot,comma,1,n/a)"});
	result['metadata'].push({"name": "p.status", "label" : "Status", "datatype" : "string"});

	connection.query( query, function (err, rows, fields) {
		// body...
		if(!err) {
			for( var i in rows) {
				var current = {};
				current['id'] = rows[i]['p.barcode'];
				current['values'] = rows[i];
				result['data'].push(current);
			}
			callback(err,result);
		} else {
			console.log(err);
		}
	});
};
exports.getInventory =  function(callback) {
	//query
	var query = 'SELECT p.barcode as barcode, p.name as name,p.category as category,'+
			' p.manufacturer as manufacturer, i.stock as stock, i.min_stock as min_stock' +
			', i.selling_price as selling_price, p.cost_price as cost_price, p.status as status FROM ' +
			' product p INNER JOIN inventory i on p.barcode = i.barcode;';

	var result = {};
	result['metadata'] = [];
	result['data']= [];

	result['metadata'].push({"name": "barcode", "label" : "Barcode", "datatype" : "string"});
	result['metadata'].push({"name": "name", "label" : "Name", "datatype" : "string"});
	result['metadata'].push({"name": "category", "label" : "Category", "datatype" : "string"});
	result['metadata'].push({"name": "manufacturer", "label" : "Manufacturer", "datatype" : "string"});
	result['metadata'].push({"name": "stock", "label" : "Stock", "datatype" : "double(,0,dot,comma,1,n/a)"});
	result['metadata'].push({"name": "min_stock", "label" : "Min. Stock", "datatype" : "double(,0,dot,comma,1,n/a)"});
	result['metadata'].push({"name": "selling_price", "label" : "Selling Price", "datatype" : "double($,2,dot,comma,1,n/a)"});
	result['metadata'].push({"name": "cost_price", "label" : "Cost Price", "datatype" : "double($,2,dot,comma,1,n/a)"});
	result['metadata'].push({"name": "status", "label" : "Status", "datatype" : "string"});
	connection.query( query,  function(err, rows, fields) {
		if(!err) {
			for( var i in rows) {
				var current = {};
				current['id'] = rows[i]['barcode'];
				current['values'] = rows[i];
				//console.log(current);
				result['data'].push(current);
			}
			callback(err,result);
		} else {
			console.log(err);
		}
	});
};

exports.getPrice = function(args, callback) {
	/*

	{
		cashier : "",
		barcode : ""
	}
	*/
	var cashier = args.cashier,
		barcode = args.barcode,
		result ={};
	
	if(cashier!== null && barcode !== null) {
		var query = 'SELECT selling_price from inventory WHERE barcode=' + barcode + ';';
		connection.query(query, function(err, rows, fields) {
			//if(err === null) {
			if (rows[0]){
				console.log("Price of " + barcode + " successfully retrieved");
				result['cashier'] = cashier;
				result['barcode'] = barcode;
				result['price'] = rows[0]['selling_price'];
				console.log(result);
				//callback(null,result);
			} else {
				console.log("Error in processing query : " + err);
				callback(true,null);
			}
		});
		
		var query2 = 'SELECT name from product WHERE barcode=' + barcode + ';';
		connection.query(query2, function(err, rows, fields) {
			if(rows[0]) {
				console.log("Name of " + barcode + " successfully retrieved");
				result['name'] = rows[0]['name'];
				console.log(result);
				callback(null,result);
			} else {
				console.log("Error in processing query : " + err);
				callback(true,null);
			}
		});
	} else {
		console.log("Invalid or missing parameters");
		callback(true,null);
	}
};

function recomputeDiscontinuedSellingPrice (callback) {
	// body...
	var query = 'UPDATE inventory i inner join product p on i.barcode=p.barcode ' +
			' set i.selling_price= 0.5 * p.cost_price where p.status=\'DISCONTINUED\';';

	connection.query(query, function(err,rows,fields) {
		if(!err) {
			console.log("Selling price of DISCONTINUED products halved");
			callback(null,true);
		} else {
			console.log("Error encountered");
			console.log("ERROR : "+err);
			callback(true,null);
		}
	});
}
exports.recomputeSellingPrice = function(callback) {
	
	var select_query = 'SELECT i.barcode AS barcode, FORMAT(GREATEST(1.05* p.cost_price, ( ' +
					'IFNULL( s.total, 0 ) * i.selling_price ) / ( 0.9 * i.min_stock ) ' +
					'),2) AS new_price FROM product p INNER JOIN inventory i ON p.barcode = i.barcode ' +
					' LEFT JOIN sold_yesterday s ON i.barcode = s.barcode WHERE p.status <> \'ADDED\' AND p.status<>\'DISCONTINUED\';';

	connection.query(select_query,function (err, rows, fields) {
		if(!err) {
			var update_query = '';
			for(var i in rows) {
				var current = rows[i];
				update_query += 'UPDATE inventory SET selling_price='+current['new_price']+' WHERE barcode='+current['barcode']+';';
			}
			connection.query(update_query, function(err2,rows2,fields2) {
				if(!err2) {
					console.log("Selling prices of NORMAL PRODUCTS successfully updated");
				//	callback(null,true);
				} else {
					console.log("Error while updating prices");
					console.log("ERROR : " + err2);
				//	callback(true,null);
				}
				recomputeDiscontinuedSellingPrice(callback);
			});
		} else {
			console.log("Error encountered");
			console.log("ERROR : "+err);
		//	callback(true,null);
			recomputeDiscontinuedSellingPrice(callback);
		}
	});

};

exports.addStock = function (args, callback) {
	var stock = args.stock,
		barcode = args.barcode;

	if(stock!== null && barcode!==null) {
		var query = 'UPDATE inventory set stock=stock+' + stock + ' WHERE barcode='+ barcode+' ;';

		connection.query(query, function(err, rows, fields) {
			if(!err) {
				console.log("Stock of BARCODE : " + barcode + " successfully updated");
				callback(null,true);
			} else {
				console.log("Error occured while adding stock");
				callback(true,null);
			}
		});
	} else {
		console.log("Invalid or absent parameters");
		callback(true,null);
	}
};

