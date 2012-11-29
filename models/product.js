var config = require('../config/config');

var connection = config.connection;


exports.getBarcodes = function(args, callback) {

	var result =[];
	
	var query2 = 'SELECT barcode, name from product;';
	connection.query(query2, function(err, rows, fields) {
		if(rows[0]) {
			for (var tuple in rows) {
				var item = new Object();
				item.label = ''+rows[tuple].barcode+'';
				item.value = rows[tuple].name;
				result.push(item);
			}
			callback(null,result);
		} else {
			console.log("Error in processing query : " + err);
			callback(true,null);
		}
	});
	
};

exports.getProducts =  function(args, callback) {
	//query
	
	var query = 'SELECT p.barcode as barcode, p.name as name, p.category as category, p.manufacturer as manufacturer, i.stock as stock,'+
				' i.min_stock as min_stock ';
		query+=', i.selling_price as selling_price, p.cost_price as cost_price, p.status as status FROM ';
		query+= 'product p INNER JOIN inventory i on i.barcode = p.barcode;';
	//var searchParameter = args.query;
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
	result['metadata'].push({"name": "status", "label": "Status", "datatype" : "string"});

	connection.query( query,  function(err, rows, fields) {
		//var idx = 0;
		if(err) {
			console.log(err);
			callback(true,null);
		} else {
			for (var tuple in rows) {
				var current ={};
				current['id'] = rows[tuple].barcode;
				//idx++;
				current['values'] = rows[tuple];
				result['data'].push(current);
			}
			//console.log(result);
			callback(err, result);
		}
		
	});
};

