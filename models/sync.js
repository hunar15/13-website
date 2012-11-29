var restock = require('../models/requests'),
	inventory = require('../models/inventory'),
	transaction = require('../models/transaction'),
	product = require('../models/product');
var config = require('../config/config'),
	connection = config.connection;
var request = require('request'),
	hq_host = config.hq_host,
	outletid = config.outletid;


exports.syncTransactions = function  (callback) {
	// body...
	var query = 'select d.id as id, d.barcode as barcode, d.quantity as quantity, d.price as price '+
			'from transaction t INNER JOIN transaction_details d on t.id=d.id where t.date=CURDATE() ;';

	connection.query(query, function (err,rows,fields) {
		// body...
		if(!err) {
			var sync_options = {
									url : hq_host+'/syncTransactions',
									json : true,
									body : { 'outletid' : outletid, 'transaction' : rows }
								};

			request.post(sync_options, function (error,response,body) {
				// body...
				if(!error) {
					if(body.status=='ADDED') {
						console.log("Sync successful");
						callback(true,null);
					} else {
						console.log("Anomaly occured");
						callback(true,null);
					}
				} else {
					console.log("ERROR : " + error);
					callback(true,null);
				}
			});
		} else {
			console.log("ERROR : " + err);
			callback(true,null);
		}
	});
};


function syncInventory(callback) {
	console.log("Syncing INVENTORY with HQ...");

	var query_2= 'SELECT * from inventory;';
	connection.query(query_2, function (err2,rows2, fields2) {
		// body...
		if(!err2) {
			var update_options = {
									url : hq_host+'/syncAll',
									json : true,
									body : { 'outletid' : outletid, 'inventory' : rows2 }
								};
			request.post(update_options, function(error2,response2,body2) {
				if(!error2) {
					if(body2["STATUS"] === "SUCCESS") {
						console.log("COMPLETE Sync successful");
					//	callback(null,true);
					} else {
						console.log(' ERROR occured : ' + error2);
					//	callback(true,null);
					}
					restockCheck(callback);
				} else {
					console.log(' ERROR occured : ' + error2);
					restockCheck(callback);
					//callback(true,null);
				}
			});
		} else {
			console.log(' ERROR occured : ' + err2);
			restockCheck(callback);
			//callback(true,null);
		}
	});
}
function syncUpdated(callback) {
	var get_updated = {
								url : hq_host+'/syncUpdated',
								json : true,
								body : { 'outletid' : outletid }
							};

	console.log('Retrieving updated PRODUCT list..');

	request.post(get_updated, function(error, response, body) {
		if(!error) {

			var ms_list = body.ms_list,
				query = '';

			console.log(ms_list);
			if(ms_list.length !== 0) {
				//update min_stock
				/*
				{
					ms_list : [
						{
							barcode : "",
							min_stock : "",
						},...
					]
				}
				*/
				for(var i in ms_list) {
					var current = ms_list[i];
					query += 'UPDATE inventory SET min_stock='+current['min_stock']+',selling_price='+current['selling_price']+' WHERE barcode=' + current['barcode']+' ;';
				}
				connection.query(query, function (err,rows,fields) {
					if(!err) {
						console.log(ms_list.length + " PRODUCTS updated successfully");
					} else {
						console.log(' ERROR occured : ' + err);
					}
					syncInventory(callback);
				});
			} else {
				console.log("No products to be UPDATED");
				syncInventory(callback);
			}
		} else {
			console.log("ERROR occured : " + error);
			syncInventory(callback);
		}
	});
}
function syncDeleted(callback) {
	var get_deleted = {
				url : hq_host+'/getDiscontinued',
				json : true,
				body : { 'outletid' : outletid }
			};
	request.post( get_deleted, function (error, response, body2) {
		if(!error) {
			var discontinueList = body2.discontinueList,
				discontinue_query = '';
			for (var i in discontinueList) {
				var current = discontinueList[i];
				discontinue_query += "UPDATE product SET status=\'DISCONTINUED\' WHERE barcode=" + current.barcode+";";
			}
			if(discontinue_query !== '') {
				connection.query(discontinue_query, function(err,rows,fields) {
					if(!err) {
						console.log("DISCONTINUED products successfully synced");
					} else {
						console.log("Error occured while syncing DISCONTINUED products");
						console.log("Error : " + err);
					}
					//sync updated products
					syncUpdated(callback);
				});
			} else {
				console.log("No products to be DISCONTINUED");
				//sync updated products
				syncUpdated(callback);
			}
		} else {
			console.log("ERROR : " + error);
			//sync updated products
			syncUpdated(callback);
		}
	});
}

function restockCheck (callback) {
	var restockCheckQuery = '';
	restockCheckQuery = "SELECT i.barcode as barcode, CEIL(i.min_stock * 2) as quantity FROM inventory i where i.stock <= i.min_stock " +
						" AND NOT EXISTS( select * FROM batch_request b INNER JOIN request_details d" +
						" ON b.date=d.date WHERE d.barcode=i.barcode AND ( b.status=\'ADDED\' OR b.status=\'SENT\')) " +
						" AND NOT EXISTS (select * from product p where p.barcode=i.barcode AND p.status =\'DISCONTINUED\');";
	connection.query(restockCheckQuery, function(err2,rows2,fields2) {
		if(!err2) {
			var result = {};
			result['requestList'] = rows2;
			restock.addRequest(result, function(err3, res3) {
				if(!err3) {
					//create restock requests
					console.log("RESTOCK REQUEST operation successfully completed");
					//syncRequests(callback);
					callback(null,true);
				} else {
					console.log("Error while adding RESTOCK REQUESTS");
					console.log("Error : " + err3);
					callback(true,null);
				}
			});
		} else {
			console.log("Error while calculating PRODUCTS which require restock");
			console.log("Error : " + err2);
			callback(true,null);
		}
	});
}

exports.syncRevenue = function (callback) {
	// find errors in arguments if any
	var result = {};
	if (outletid !== null) {
		var query = 'SELECT distinct date, SUM(price * total) as revenue FROM sold_yesterday;';

		connection.query(query, function ( err, rows, fields ) {
			if(!err) {
				result['date'] = rows[0]['date'];
				result['revenue'] = rows[0]['revenue'];

				var query_2 = 'SELECT barcode, MAX(price * total) as revenue FROM sold_yesterday GROUP BY barcode;';

				connection.query(query_2, function(err2,rows2,fields2) {
					if(!err2) {
						if(rows2.length !== 0) {
							result['barcode'] = rows2[0]['barcode'];
							result['outlet_id'] = outletid;

							console.log("Revenue details successfully retrieved");
							var post_options = {
									url : hq_host+'/syncRevenue',
									json : true,
									body : result
								};

							console.log("Syncing revenue with HQ...");

							//post sync request to HQ
							request.post(post_options, function(error, response, body) {
								if(!error) {
									if(body['STATUS'] === "SUCCESS") {
										console.log("Revenue successfully synced with HQ");
										callback(null,true);
									} else {
										console.log(body['STATUS']);
										callback(true,null);
									}
								} else {
									console.log("Error encountered");
									console.log("ERROR : " + error);
									callback(true,null);							}
							});
						} else {
							console.log("Nothing sold yesterday");
							callback(null,true);
						}
						
					} else {
						console.log("Error encountered");
						console.log("ERROR : " + err2);
						callback(true,null);
					}
				});
			} else {
				console.log("Error encountered");
				console.log("ERROR : " + err);
				callback(true,null);
			}
		});
	} else {
		console.log("Invalid or absent parameters");
		callback(true,null);
	}
};

exports.syncInventoryAndRestock = function(callback) {
		//find errors in arguments if any
		//create http request to hq server
		/*
		(need to split 1 and 2?)
		1. sync inventory
			a. retrieve added product list for outlet
			b. add products to list that arent there in both product AND inventory
			c. place stock requests for new items
		2. sync stock requests
			a. check status of past requests
			b. change ones that are necessary
		*/
		var get_added = {
								url : hq_host+'/getAdded',
								json : true,
								body : { 'outletid' : outletid }
							};
		
		console.log('Connecting to HQ Server..');
		request.post( get_added, function (error, response, body) {
			if(!error) {
				console.log("Connected successfully!");
				var addedList = body.addedList;
				if(addedList !== null) {
					console.log("No. of new products : " + addedList.length);
					var i, flag;
					var product_query= '',
						inventory_query = '';
					for (i=0; i< addedList.length;i++) {
						var current = addedList[i];
						product_query += "INSERT INTO product select "+current['barcode']+","+connection.escape(current['name'])+","+current['cost_price']+
									","+connection.escape(current['category'])+","+connection.escape(current['manufacturer'])+",\'ADDED\'" +
										" FROM DUAL WHERE NOT EXISTS(select * from product where barcode="+current['barcode']+");";
						/*if(i==(addedList.length - 1 ))
							flag = 1;

						callQuery(flag,query,current, outletid);*/
						inventory_query += "INSERT INTO inventory select "+current['barcode']+",0,"+current['selling_price']+","+current['min_stock']+
										" FROM DUAL WHERE NOT EXISTS(select * from inventory where barcode="+current['barcode']+");";

					}
					if(product_query !== '') {
						connection.query(product_query, function(err,rows,fields) {
							if(!err) {
									console.log(rows);
								connection.query(inventory_query, function(err2,rows2,fields2) {

									if(!err2) {
										console.log("NEW items successfully synced with HQ");
									} else {
										console.log("Error while adding to the INVENTORY table");
									}
									syncDeleted(callback);
								});
							} else {
								console.log("Error while adding to the PRODUCT table");
								console.log("Error : " +err);
							}
						});
					} else {
						console.log("No NEW products to be synced");
						syncDeleted(callback);
					}

				} else {
					console.log("Unable to retrieve added");
					syncDeleted(callback);
				}
				
				
				//now sync all products to be deleted
			}
		} );
		
};

function updateIncompleteRequests(callback) {
	var query = "SELECT b.date as date, d.barcode as barcode, d.received as received "+
			"FROM batch_request b INNER JOIN request_details d "+
			"ON b.date=d.date WHERE b.status=\'INCOMPLETE\';";
	console.log("Updating INCOMPLETE requests..");
	connection.query(query, function(err,rows, fields) {
		if(!err) {
			console.log("Posting Sync request to HQ...");
			request.post({url : hq_host+'/syncIncompleteRequests',json :true, body: {'outletid' : outletid, 'incompleteList' : rows}}, function(error,response,body){
				if(!error) {
					if(body.status == "COMPLETED") {
						console.log("Server sync successful");
						callback(null,true);
					}
				} else {
					console.log("Unable to sync with HQ\nError : " + error);
					callback(true,null);
				}
			});
		} else {
			console.log("Errors in retrieving INCOMPLETE stock requests");
			console.log("ERROR : " + err);
			callback(true,null);
		}
	});

}
function updateDispatchedRequests(callback) {
	console.log("Retrieving DISPATCHED requests from HQ..");
	request.post( {url : hq_host+'/syncDispatchedRequests',json :true, body: {'outletid' : outletid}}, function(error,response,body) {
		if(!error) {
			if(body['STATUS'] === "SUCCESS") {
				var dp_list = body.dp_list;

				if(dp_list.length !== 0) {
					var query = '';
					for (var i in dp_list) {
						var current = dp_list[i],
							date = current['date'].split("T")[0];
						query += 'UPDATE batch_request SET status=\'DISPATCHED\' where date=\''+date+'\';';
					}

					connection.query(query, function (err,rows,fields) {
						if(!err) {
							console.log("DISPATCHED requests successfully updated");
						} else {
							console.log("ERROR : " + err);
						}
						updateIncompleteRequests(callback);
					});
				} else {
					console.log("No requests dispatched from HQ side");
					updateIncompleteRequests(callback);
				}
			}
		} else {
			console.log("ERROR while posting request : " + error);
			updateIncompleteRequests(callback);
		}
	});
}

function updateReceivedRequests(callback) {
	var query = "SELECT DATE(date) as date, status FROM batch_request WHERE status=\'RECEIVED\';";
	console.log("Updating RECEIVED requests..");
	connection.query(query, function(err,rows, fields) {
		if(!err) {
			console.log("Posting Sync request to HQ...");
			request.post({url : hq_host+'/syncReceivedRequests',json :true, body: {'outletid' : outletid, 'receivedList' : rows}}, function(error,response,body){
				if(!error) {
					if(body.status == "COMPLETED") {
						console.log("Server sync successful");
						var query_update = "UPDATE batch_request SET status=\'COMPLETED\' WHERE status=\'RECEIVED\';";
						connection.query(query_update, function(err2,rows2,fields2) {
							if(!err2) {
								console.log("COMPLETED Requests Synced");
							} else {
								console.log("Error in updating outletdb requests");
							}
							//Final Step
							updateDispatchedRequests(callback);
						});
					}
				} else {
					console.log("Unable to sync with HQ\nError : " + error);
					updateDispatchedRequests(callback);
				}
			});
		} else {
			console.log("Errors in retrieving RECEIVED stock requests");
			updateDispatchedRequests(callback);
		}
	});
}
function syncRequests (callback) {
	// body...
	/*
	involves syncing 3 major components:
	1. newly added requests from outletdb to hqdb
	2. processed requests from hqdb to outletdb
	*/

	//get all the newly added requests
	var query = "SELECT b.date as date, d.barcode as barcode, d.quantity as quantity " +
				"FROM batch_request b INNER JOIN request_details d ON b.date=d.date WHERE b.status = \'ADDED\';";

	connection.query(query, function(err, rows, fields) {
		if(!err) {
			console.log(rows.length);
			request.post({ url: hq_host+'/syncAddedRequests',json:true, body :{ 'outletid' : outletid, 'addedList' : rows}}, function(error,response,body) {
				if(!error) {
					if( body.status == "ADDED") {
						var query_update = "UPDATE batch_request SET status=\'SENT\' WHERE status=\'ADDED\';";
						connection.query(query_update, function(err,rows2,fields2) {
							if(!err) {
								console.log("New Requests Synced");
								//callback(null,true);
							} else {
								console.log("Error in updating outletdb requests");
								//callback(true,null);
							}
							//update RECEIVED requests
							updateReceivedRequests(callback);
						});
					} else {
						console.log("Anomaly occured");
						updateReceivedRequests(callback);
					}
				} else {
					console.log("Error in connecting to the server");
					callback(true,null);
				}
			});
		} else {
			console.log(err);
			callback(true,null);
		}
		//updateReceivedRequests(callback);

	});
}
exports.restockCheck = restockCheck;
exports.syncRequests = syncRequests;
