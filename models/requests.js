var request = require('request');
var config = require('../config/config');

var connection = config.connection;
var hq_host = config.hq_host,
	outletid = config.outletid;

exports.viewRequests = function  (callback) {
	// body...

	var query = 'select DATE_FORMAT(date,\'%Y-%m-%d\') as date, status FROM batch_request;';
	var result = {};
	result['metadata'] = [];
	result['data']= [];

	result['metadata'].push({"name":"date","label":"Date of Request", "datatype" : "date"});
	result['metadata'].push({"name":"status","label":"Status", "datatype" : "string"});
	result['metadata'].push({"name":"details","label":"View details"});
	connection.query(query, function  (err, rows, fields) {
		// body...
		if(!err) {
			for( var i in rows) {
				var current ={};
				current['id'] = i;
				current['values'] = rows[i];
				result['data'].push(current);
			}
			callback(null,result);
		} else {
			console.log(err);
			callback(true,null);
		}
	});
};

exports.viewRequestDetails = function  (args,callback) {
	// body...
	var date = args.date;

	if(date !== null) {
		var query = 'select barcode, quantity, received from request_details where date = \''+date+'\';',
			result ={};


		result['metadata'] = [];
		result['data']= [];

		result['metadata'].push({"name":"barcode","label":"Barcode", "datatype" : "string"});
		result['metadata'].push({"name":"quantity","label":"Quantity", "datatype" : "double(,0,dot,comma,1,n/a)"});
		result['metadata'].push({"name":"received","label":"Received"});
		//what metadata is required?
		connection.query(query, function (err,rows,fields) {
			// body...
			if(!err) {
				for(var i in rows) {
					var current = {};
					current['id'] = rows[i]['barcode'];
					current['values'] = rows[i];
					result['data'].push(current);
				}
				callback(null,result);
			} else {
				console.log("ERROR : " + err);
				callback(true,null);
			}
		});
	} else {
		console.log("Invalid or absent parameters");
		callback(true,null);
	}
};

exports.addRequest =  function(args, callback) {
	//packet format
	/*
	{
		barcode : "",
		quantity : ""
	}
	*/
	//check if current date order tuple exists in the db
	var query = 'INSERT INTO batch_request(date,status) SELECT CURDATE(),\'ADDED\' FROM DUAL WHERE ' +
				'NOT EXISTS(SELECT * FROM batch_request WHERE date=CURDATE());';
		requestList = args.requestList;

	if (requestList !== null) {
		console.log("Creating stock requests for required PRODUCTS...");
		connection.query( query,  function(err, rows, fields) {
			if(!err) {
				var errorFlag = 0,
					query_2 = '';
				console.log("Request List length : "+ requestList.length);
				for(var i in requestList) {
					var current = requestList[i];
					query_2 += "INSERT INTO request_details SELECT CURDATE()," + current['barcode']+"," + current['quantity']+ ", 0"+
							" FROM DUAL WHERE NOT EXISTS(SELECT * FROM request_details WHERE date= CURDATE() AND barcode="+current['barcode']+");";
				}
				if(query_2 !== '') {
					//execute multiple queries
					connection.query(query_2, function (err2, rows2, fields2) {
						if(!err2) {
							console.log("Restock request for "+ requestList.length+ " items added");
							callback(null,true);
						} else {
							errorFlag = 1;
							console.log(err2);
							callback(true,null);
						}
					});
				} else {
					console.log("Nothing to RESTOCK");
					callback(null,true);
				}
				
			} else {
				console.log(err);
				callback(true,null);
			}
		});
	} else {

	}
};

exports.deleteRequest = function (args, callback) {
	/*
		{
			request_id : ""
		}
	*/
	var date = args.date;
	if(request_id !== null) {
		var query = 'UPDATE batch_request SET status =\'CANCELLED\' WHERE date='+date+';';
		connection.query( query, function (err, rows, fields) {
		// body...
			if(!err) {
				console.log("Request successfully cancelled");
				callback(null,true);
			} else {
				console.log(err);
				callback(true,null);
			}
		});
	} else {
		console.log("Invalid or absent parameters");
	}
	
};

exports.receivedAll = function (args, callback) {
	// body...
	var date = args.date;

	if(date !== null) {
		var query = "UPDATE inventory i inner join request_details r on r.barcode=i.barcode set i.stock=i.stock +" +
						" r.quantity where r.date=\'"+date+"\' AND r.received=0;";
			query +="UPDATE batch_request SET status=\'RECEIVED\' WHERE date=\'"+date+"\' ;";
		

		connection.query(query, function(err,rows, fields) {
			if(!err) {
				console.log(query);
				//callback(null,true);

				//check if all products in the batch have been received and update
				
				var query2 = "UPDATE request_details SET received=1 WHERE date=\'"+date+"\';";
				connection.query(query2, function(err2,rows2,fields2) {
					if(!err2) {
						console.log("Batch Request COMPLETED");
						callback(null,true);
					} else {
						console.log("Error encountered : "+ err2);
						callback(true,null);
					}
				});
			} else {
				console.log("Error encountered : " + err);
				callback(true,null);
			}
		});
	} else {
		console.log("Invalid or absent parameters");
		callback(true,null);
	}
};
exports.setAsReceived = function(args, callback) {
	var date = args.date,
		barcode = args.barcode,
		quantity = args.quantity;

	if(quantity!== null && date!==null && barcode!==null) {
		var query = "UPDATE request_details SET received=1 WHERE date=\'"+date+"\' AND barcode="+barcode+" ;";

		connection.query(query, function(err,rows, fields) {
			if(!err) {
				console.log(query);
				console.log("Barcode : " + barcode + " RECEIVED");
				//callback(null,true);

				//check if all products in the batch have been received and update
				var query2 ="UPDATE batch_request SET status=\'INCOMPLETE\' WHERE date=\'"+date+"\' ;";
					query2 += "UPDATE inventory SET stock=stock+"+quantity+" WHERE barcode="+barcode+";";

				connection.query(query2, function(err2,rows2,fields2) {
					if(!err2) {
						var query3 = "UPDATE batch_request SET status=\'RECEIVED\' WHERE date=\'"+date+"\'"+
							" AND NOT EXISTS( SELECT * from request_details WHERE date=\'"+date+"\' AND received=\'false\')";

						connection.query(query3, function(err3, rows3, fields3) {
							if(!err3) {
								console.log("Batch Request COMPLETED");
								callback(null,true);
							} else {
								console.log("Error encountered : " + err3);
								callback(true,null);
							}
						});
					} else {
						console.log("Error encountered : "+ err2);
						callback(true,null);
					}
				});
			} else {
				console.log("Error encountered : " + err);
				callback(true,null);
			}
		});
	} else {
		console.log("Invalid or absent parameters");
		callback(true,null);
	}
};

