var editableGrid;
var cashier = 3002;
var itemIdx = 0;
var totalPrice = 0;
window.onload = function() {
	initTable();
	initAddDisplay();
	initEditDisplay();
}

function initTable(){
	$.getJSON( "/get/display", function(data){
		init(data);
		editableGrid.setPageIndex(0);
		editableGrid.filter('');
	});
}


function initAddDisplay(){
	$('#confirm-add-display').click(function(){
		var display_id = $('#inputId').val();
		var barcode = $('#inputBarcode').val();
		var description = $('#inputDescription').val();
		$.ajax({
			url: "/add/display",
			type: 'POST',
			data: {
				"display_id":display_id,
				"barcode":barcode,
				"description":description
			},
			success: function (response) {
				$('#new-display-form')[0].reset();
				initTable();
				$('#addNewDisplay').modal('hide');
			}
		});

	});
	$.getJSON( "/getBarcodes", function(data){
		
		$('#inputBarcode').autocomplete({
			source: data,
			minLength: 0,
			select: function( event, ui ) {
                $( "#inputBarcode" ).val( ui.item.label ); 
                return false;
            }
		})
		.data( "autocomplete" )._renderItem = function( ul, item ) {
            return $( "<li>" )
                .data( "item.autocomplete", item )
                .append( "<a><b>" + item.label + "</b> " + item.value + "</a>" )
                .appendTo( ul );
        };
		$('#edit-barcode').autocomplete({
			source: data,
			minLength: 0,
			select: function( event, ui ) {
                $( "#edit-barcode" ).val( ui.item.label ); 
                return false;
            }
		})
		.data( "autocomplete" )._renderItem = function( ul, item ) {
            return $( "<li>" )
                .data( "item.autocomplete", item )
                .append( "<a><b>" + item.label + "</b> " + item.value + "</a>" )
                .appendTo( ul );
        };
	});	
}

function initEditDisplay(){
	$('#confirm-edit-display').click(function(){
		var display_id = $('#edit-display-id').val();
		var barcode = $('#edit-barcode').val();
		var description = $('#edit-description').val();
		$.ajax({
			url: "/updateDisplayUnit",
			type: 'POST',
			data: {
				"display_id":display_id,
				"barcode":barcode,
				"description":description
			},
			success: function (response) {
				initTable();
				$('#edit-display').modal('hide');
			}
		});

	});
}

function init(data){
	editableGrid = new EditableGrid("DemoGridJSON", {
		enableSort: true, // true is the default, set it to false if you don't want sorting to be enabled
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
	editableGrid.renderGrid("transactioncontent", "testgrid");

	editableGrid.setCellRenderer("edit", new CellRenderer({render: function(cell, value) { 
		var rowId = editableGrid.getRowId(cell.rowIndex);
		
		cell.innerHTML = "<a href=\"#edit-display\" data-toggle=\"modal\" onclick=\"editDisplay("+cell.rowIndex+"); \" style=\"cursor:pointer\">" +
						"<img src=\"images/edit.png\" border=\"0\" title=\"Edit price display\"/></a>"+
						"&nbsp;&nbsp;<a onclick=\"if (confirm('Are you sure you want to delete this display ? ')) { deleteDisplay("+cell.rowIndex+");} \" style=\"cursor:pointer\">" +
						"<img src=\"images/delete.png\" border=\"0\" title=\"Delete price display\"/></a>";
	}})); 
	editableGrid.updatePaginator = function () {
		var paginator = $("#paginator").empty();
		var nbPages = editableGrid.getPageCount();
		console.log(nbPages);

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

function editDisplay(rowIndex) {
	var display_id = editableGrid.getRowValues(rowIndex).display_id;
	var barcode = editableGrid.getRowValues(rowIndex).barcode;
	var description = editableGrid.getRowValues(rowIndex).description;
	$('#edit-display-id').val(display_id);
	$('#edit-description').text(description);
	$('#edit-barcode').val(barcode);
}


function deleteDisplay(rowIndex) {
	var display_id = editableGrid.getRowValues(rowIndex).display_id;
	$.ajax({
		url: "/deleteDisplayUnit",
		type: 'POST',
		data: {
				"display_id": display_id
		},
		success: function (response) {
			initTable();
		}
	});
}