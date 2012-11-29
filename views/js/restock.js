var editableGrid;
var checkAll = 0;
window.onload = function() {
	initTable();
	initSetReceived();
}

function initTable(){
	$.getJSON( "get/requests", function(data){
		init(data);
		editableGrid.setPageIndex(0);
		editableGrid.filter('');
	});
}

function initSetReceived(){
	$('#receive-all').click(function(){
	var date = $('#restock-date').text();
	console.log('sent');
		$.ajax({
			url: "/stock/receivedAll",
			type: 'POST',
			data: {
				"date": date
			},
			success: function (response) {
				initTable();
				$('#restockDetails').modal('hide');
			
			}
		});
	});
	$('#confirm-checked-product').click(function(){
		var batch_received=[];
		$('.received-check').each(function(k,v){
			if ($(v).attr('checked')=='checked')
				batch_received.push([$(v).attr('id').substring(6),$(v).attr('data-quantity')]);
		});

		var date = $('#restock-date').text();
		
		if (batch_received.length == 0)
			$('#restockDetails').modal('hide');
			
		$.each(batch_received, function(k,v){
			
			$.ajax({
				url: "/stock/setAsReceived",
				type: 'POST',
				data: {
					"date": date,
					"barcode": v[0],
					"quantity": v[1]
				},
				success: function (response) {
					if (k==(batch_received.length - 1)){
						initTable();
						$('#restockDetails').modal('hide');
					}
				}
			});
		});

		
	});	
}

function init(data){
	editableGrid = new EditableGrid("DemoGridJSON", {
		enableSort: false, // true is the default, set it to false if you don't want sorting to be enabled
		editmode: "absolute", // change this to "fixed" to test out editorzone, and to "static" to get the old-school mode
		editorzoneid: "edition", // will be used only if editmode is set to "fixed"
		pageSize: 10,
		maxBars: 10
	});

	$('#filter').bind('keypress',function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			editableGrid.filter($('#filter').val());
		}		
	});
	
	editableGrid.load({"metadata": data.metadata,"data": data.data});
	editableGrid.renderGrid("restocktablecontent", "testgrid");

	
	editableGrid.setCellRenderer("details", new CellRenderer({render: function(cell, value) {
		var rowId = editableGrid.getRowId(cell.rowIndex);

		var status = editableGrid.getRowValues(rowId).status;
		
		cell.innerHTML = "<a href=\"#restockDetails\" data-toggle=\"modal\" onclick=\"generateDetails("+cell.rowIndex+"); \" style=\"cursor:pointer\">" +
						 "<img src=\"images/view.png\" border=\"0\" alt=\"delete\" title=\"View details\"/></a>";
	}})); 
	
	editableGrid.updatePaginator = function () {
		var paginator = $("#paginator").empty();
		var nbPages = editableGrid.getPageCount();


		// get interval
		var interval = editableGrid.getSlidingPageInterval(10);
		if (interval == null) return;

		// get pages in interval (with links except for the current page)
		var pages = editableGrid.getPagesInInterval(interval, function(pageIndex, isCurrent) {
			if (isCurrent) return "" + (pageIndex + 1);
			return $("<a>").css("cursor", "pointer")
				.html(pageIndex + 1)
				.click(function(event) {
					editableGrid.setPageIndex(parseInt($(this).html()) - 1); 
				});
		});

		// "first" link
		var link = $("<a>").html("<img src='images/gofirst.png'/>&nbsp;");
		if (!editableGrid.canGoBack())
			link.css({ opacity : 0.4, filter: "alpha(opacity=40)" });
		else 
			link.css("cursor", "pointer").click(function(event) {
				editableGrid.firstPage(); 
				//updatePaginator();
				});
		paginator.append(link);

		// "prev" link
		link = $("<a>").html("<img src='images/prev.png'/>&nbsp;");
		if (!editableGrid.canGoBack())
			link.css({ opacity : 0.4, filter: "alpha(opacity=40)" });
		else
			link.css("cursor", "pointer").click(function(event) { 
				editableGrid.prevPage(); 
				//updatePaginator()
			});
		paginator.append(link);
		
		// pages
		for (p = 0; p < pages.length; p++) paginator.append(pages[p]).append(" | ");

		// "next" link
		link = $("<a>").html("<img src='images/next.png'/>&nbsp;");
		if (!editableGrid.canGoForward())
			link.css({ opacity : 0.4, filter: "alpha(opacity=40)" });
		else
			link.css("cursor", "pointer").click(function(event) {
				editableGrid.nextPage(); 			
				//updatePaginator();
				});
		paginator.append(link);

		// "last" link
		link = $("<a>").html("<img src='images/golast.png'/>&nbsp;");
		if (!editableGrid.canGoForward())
			link.css({ opacity : 0.4, filter: "alpha(opacity=40)" });
		else
			link.css("cursor", "pointer").click(function(event) { 
				editableGrid.lastPage(); 			
				//updatePaginator();
			});
		paginator.append(link);

	};

	editableGrid.tableRendered = function() { this.updatePaginator(); };
}

function initDetail(data){
	detailedEditableGrid = new EditableGrid("RequestDetail", {
		enableSort: true, // true is the default, set it to false if you don't want sorting to be enabled
		editmode: "absolute", // change this to "fixed" to test out editorzone, and to "static" to get the old-school mode
		editorzoneid: "edition", // will be used only if editmode is set to "fixed"
		pageSize: 10,
		maxBars: 10
	});

	$('#detailfilter').bind('keypress',function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			detailedEditableGrid.filter($('#filter').val());
		}		
	});
	
	detailedEditableGrid.load({"metadata": data.metadata,"data": data.data});
	detailedEditableGrid.renderGrid("restockdetailstablecontent", "detailgrid");
	
	detailedEditableGrid.setCellRenderer("received", new CellRenderer({render: function(cell, value) {
		// this action will remove the row, so first find the ID of the row containing this cell 
		var rowId = detailedEditableGrid.getRowId(cell.rowIndex);
		var quantity = detailedEditableGrid.getRowValues(cell.rowIndex).quantity;
		if (value==0)
			cell.innerHTML = "<input class='received-check' id='check-"+rowId+"' data-quantity='"+quantity+"' type='checkbox'/>";
		else
			cell.innerHTML = "<input type='checkbox' checked='true' disabled='true'/>";
	}})); 
	
	detailedEditableGrid.updatePaginator = function () {
		var paginator = $(".paginator2").empty();
		var nbPages = detailedEditableGrid.getPageCount();


		// get interval
		var interval = detailedEditableGrid.getSlidingPageInterval(10);
		if (interval == null) return;

		// get pages in interval (with links except for the current page)
		var pages = detailedEditableGrid.getPagesInInterval(interval, function(pageIndex, isCurrent) {
			if (isCurrent) return "" + (pageIndex + 1);
			return $("<a>").css("cursor", "pointer")
				.html(pageIndex + 1)
				.click(function(event) {
					editableGrid.setPageIndex(parseInt($(this).html()) - 1); 
				});
		});

		// "first" link
		var link = $("<a>").html("<img src='images/gofirst.png'/>&nbsp;");
		if (!detailedEditableGrid.canGoBack())
			link.css({ opacity : 0.4, filter: "alpha(opacity=40)" });
		else 
			link.css("cursor", "pointer").click(function(event) {
				detailedEditableGrid.firstPage(); 
				//updatePaginator();
				});
		paginator.append(link);

		// "prev" link
		link = $("<a>").html("<img src='images/prev.png'/>&nbsp;");
		if (!detailedEditableGrid.canGoBack())
			link.css({ opacity : 0.4, filter: "alpha(opacity=40)" });
		else
			link.css("cursor", "pointer").click(function(event) { 
				detailedEditableGrid.prevPage();
			});
		paginator.append(link);
		
		// pages
		for (p = 0; p < pages.length; p++) paginator.append(pages[p]).append(" | ");

		// "next" link
		link = $("<a>").html("<img src='images/next.png'/>&nbsp;");
		if (!detailedEditableGrid.canGoForward())
			link.css({ opacity : 0.4, filter: "alpha(opacity=40)" });
		else
			link.css("cursor", "pointer").click(function(event) {
				detailedEditableGrid.nextPage();
			});
		paginator.append(link);

		// "last" link
		link = $("<a>").html("<img src='images/golast.png'/>&nbsp;");
		if (!detailedEditableGrid.canGoForward())
			link.css({ opacity : 0.4, filter: "alpha(opacity=40)" });
		else
			link.css("cursor", "pointer").click(function(event) { 
				detailedEditableGrid.lastPage();
			});
		paginator.append(link);

	};

	detailedEditableGrid.tableRendered = function() { this.updatePaginator(); };
}



function generateDetails(rowIndex) {
	var date = editableGrid.getRowValues(rowIndex).date;
	var status = editableGrid.getRowValues(rowIndex).status;

	$.ajax({
		url: "/get/requests/details",
		type: 'POST',
		data: {
			"date": date
		},
		success: function (response) {
			initDetail(response);
			detailedEditableGrid.setPageIndex(0);
			detailedEditableGrid.filter('');
			$('#restock-date').text(date);
			$('#restockDetails').modal('show');
			if (status != "DISPATCHED" && status != "INCOMPLETE")
				$('.received-check').attr("disabled","disabled");
			else
				$('.received-check').removeAttr("disabled","disabled");	
			if (status == "RECEIVED" || status == "ADDED")
				$('#receive-all').attr("disabled",'disabled');
			else
				$('#receive-all').removeAttr("disabled",'disabled');
		}
	});	
}