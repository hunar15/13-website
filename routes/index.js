
/*
 * GET home page.
 */
var mysql      = require('mysql'),
	restock = require('../models/requests'),
	inventory = require('../models/inventory'),
	transaction = require('../models/transaction'),
	product = require('../models/product'),
	sync = require('../models/sync'),
	display = require('../models/display');
var config = require('../config/config'),
	connection = config.connection;
var request = require('request'),
	hq_host = config.hq_host,
	outletid = config.outletid;

exports.syncTransactions = function (req,res) {
	sync.syncTransactions(function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.restockCheck = function (req,res) {
	sync.restockCheck(function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.syncRequests = function (req,res) {
	sync.syncRequests(function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.syncInventory = function (req,res) {
	// body..
	sync.syncInventoryAndRestock(function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.syncRevenue = function (req,res) {
	// body..
	sync.syncRevenue(function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.addDisplayUnit = function (req,res) {
	display.addDisplayUnit(req.body,function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};
exports.receivedAll = function  (req,res) {
	// body...
	restock.receivedAll(req.body,function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.getAllDisplayUnits = function (req,res) {
	display.getAllDisplayUnits(function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.updateDisplayUnit = function (req,res) {
	display.updateDisplayUnit(req.body,function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.deleteDisplayUnit = function (req,res) {

	display.deleteDisplayUnit(req.body,function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};
exports.getProducts = function (req,res) {
	product.getProducts(req.body,function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.viewRequests = function (req,res) {
	restock.viewRequests(function (err, result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};
exports.viewRequestDetails = function (req,res) {
	restock.viewRequestDetails(req.body, function (err, result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.viewTransactions = function (req,res) {
	transaction.viewTransactions( function (err, result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.viewTransactionDetails = function (req,res) {
	console.log('hello');
	transaction.viewTransactionDetails(req.body, function (err, result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};
exports.getInventory = function (req,res) {
	inventory.getInventory(function(err,result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.recomputeSellingPrice = function (req,res) {
	inventory.recomputeSellingPrice(function (err, result) {
		if(!err) {
			res.send({"STATUS" : "SUCCESS"});
		} else {
			res.send({"STATUS" : "ERROR"});
		}
	});
};

exports.addStock = function(req,res) {
	inventory.addStock(req.body, function(err, result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};

exports.addTransaction = function (req,res) {
	transaction.addTransaction(req.body, function (err, result) {
		if(!err) {
			res.send(result);
		} else {
			res.send(err);
		}
	});
};


exports.setAsReceived = function(req,res) {
	restock.setAsReceived(req.body,function(err, rows){
		if(!err) {
			res.send(rows);
		} else {
			res.send(err);
		}
	});
};

var t_errorFlag = 0;

exports.getPrice = function(req,res) {
	inventory.getPrice(req.body, function(err, result){
		if(err !== null) {
			res.send(err);
		} else {
			res.send(result);
		}
	});
};

exports.getBarcodes = function (req, res) {
	product.getBarcodes(req.body, function(err,result){
		if(err !== null) {
			res.send(err);
		} else {
			res.send(result);
		}
	});
}

exports.syncAtEnd = function (req, res) {
	var query = 'UPDATE product set status=\'NORMAL\' where status=\'ADDED\';';

	connection.query( query, function  (err3, result3) {
		// body...
		if(!err3) {
			console.log("Status of ADDED products changed to NORMAL");
		} else {
			console.log("ERROR : "+ err3);
		}
		sync.syncInventoryAndRestock(function (err, result1) {
			if(!err) {
				inventory.recomputeSellingPrice(function (err2, result2) {
					if(!err2) {
						res.send({"STATUS" : "SUCCESS"});
					} else {
						res.send({"STATUS" : "ERROR"});
					}
				});
			} else {
				console.log("ERROR encountered while syncing inventory and restock requests");
				res.send({"STATUS" : "ERROR"});
			}
		});
	});
};

exports.syncAtStart = function (req,res) {
	sync.syncInventoryAndRestock(function (err, result) {
		if(!err) {
			sync.syncRevenue(function (err, result) {
				if(!err) {
					res.send({"STATUS" : "SUCCESS"});
				} else {
					res.send({"STATUS" : "ERROR"});
				}
			});
		} else {
			console.log("ERROR encountered while syncing inventory and restock requests");
			res.send({"STATUS" : "ERROR"});
		}
	});
};

exports.processTransaction = function (req, res) {
	// body...
	t_errorFlag =0;
	//first error check : do the required arguments exist
    console.log(req.body);
	var itemList = req.body.list,
		result = {};
	result['cashier'] = req.body.cashier;
	result['list'] = itemList;
	var cashier = result['cashier'];
    
	if (itemList !== null) {
		/*
		{
			cashier : "",
			list : [{
				barcode : "",
				quantity : "",
				price : ""
			}]
		}
		*/
		var updateStockQuery ='';
            console.log(itemList);
		for (var i in itemList) {
			var current = itemList[i];
                    console.log(itemList[i]);
			updateStockQuery += "UPDATE inventory SET stock= stock -" +itemList[i]['quantity'] +" WHERE barcode=" + itemList[i]['barcode'] +" ;";
			//callTransactionQuery(query,current,cashier);
		}
		connection.query(updateStockQuery, function(err,rows,fields) {
			if(!err) {
				console.log("Bill processed without errors");
				result['errors'] = false;
				//carry out product stock request check
				
				//add to transaction table
				transaction.addTransaction(result, function (err3, res3) {
					if(!err3) {
						console.log("TRANSACTION successfully completed");
						console.log("Computing RESTOCK check ...");
						sync.restockCheck(function(err,result) {
							if(!err) {
								res.send({"STATUS" : "SUCCESS"});
							} else {
								res.send({"STATUS" : "ERROR"});
							}
						});
					} else {
						console.log(err3);
						res.send({ "STATUS" : "ERROR"});
					}
				});
						
			} else {
				console.log("Bill processed with errors");
				console.log(err);
				res.send({ "STATUS" : "ERROR"});
			}
		});
		//res.send(result);
	} else {
		console.log("Absent parameters");
		res.send({ "STATUS" : "ERROR"});
	}
};