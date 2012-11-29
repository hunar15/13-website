var config = require('../config/config');

var connection = config.connection;

exports.addDisplayUnit = function (args,callback) {
	// body...
	var barcode = args.barcode,
		description = args.description,
		display_id = args.display_id;

	var query = "SELECT display_id from display WHERE barcode="+barcode+";";

	connection.query(query, function (err,rows,fields) {
		// body...
		if(!err) {
			query ='';
			if(rows.length !== 0) {
				query = "UPDATE display set barcode=NULL where display_id="+rows[0].display_id+";";
			}
			query += "INSERT INTO display VALUES("+display_id+","+barcode+","+connection.escape(description)+");";

			connection.query(query, function (err2,rows2,fields2) {
				if(!err2) {
					console.log("Display Unit with ID : " + rows2.insertId + " added");
					callback(null,rows2);
				} else {
					console.log("ERROR : " +err2);
					callback(true,null);
				}
			});
		} else {
			console.log("ERROR : " +err);
			callback(true,null);
		}
	});
};

exports.deleteDisplayUnit = function (args,callback) {
	// body...

	var display_id = args.display_id;

	if(display_id !== null) {
		var query = "DELETE FROM display where display_id="+display_id+";";

		connection.query(query, function (err,rows,fields) {
			// body...
			if(!err) {
				console.log("Display Unit with ID : " + display_id + " deleted from database");
				callback(null,true);
			} else {
				console.log("ERROR : " +err);
				callback(true,null);
			}
		});
	} else {
		console.log("Invalid or absent parameters");
		callback(true,null);
	}
};

exports.getAllDisplayUnits = function (callback) {
	// body...

	var query = "SELECT * from display;";
	var result = {};

	result['metadata'] = [];
	result['data']= [];
	result['metadata'].push({"name": "display_id", "label" : "Display ID", "datatype" : "string"});
	result['metadata'].push({"name": "barcode", "label" : "Barcode", "datatype" : "string"});
	result['metadata'].push({"name": "description", "label" : "Description of Price Display", "datatype" : "string"});
	result['metadata'].push({"name": "edit", "label" : "Edit/Delete"});
	connection.query(query, function (err,rows,fields) {
		// body...
		if(!err) {
			for(var i in rows) {
				var current = {};
				current['id'] = rows[i]['display_id'];
				current['values'] = rows[i];
				result['data'].push(current);
			}
			callback(null,result);
		} else {
			console.log("ERROR : " +err);
			callback(true,null);
		}
	});
};

exports.updateDisplayUnit = function  (args,callback) {
	// body...

	var display_id = args.display_id,
		barcode = args.barcode,
		description = args.description;


	if(display_id!==null && barcode!==null) {
		var query = "SELECT display_id from display WHERE barcode="+barcode+";";

		connection.query(query, function (err,rows,fields) {
			// body...
			if(!err) {
				query ='';
				if(rows.length !== 0) {
					query = "UPDATE display set barcode=NULL where display_id="+rows[0].display_id+";";
				}
				query += "UPDATE display set barcode="+barcode+",description="+connection.escape(description)+" where display_id="+display_id+";";

				connection.query(query, function (err2,rows2,fields2) {
					if(!err2) {
						callback(null,rows2);
					} else {
						console.log("ERROR : " +err2);
						callback(true,null);
					}
				});
			} else {
				console.log("ERROR : " +err);
				callback(true,null);
			}
		});
	} else {
		console.log("Invalid or absent parameters");
		callback(true,null);
	}
	
};