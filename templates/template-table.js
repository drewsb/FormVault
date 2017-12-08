$(document).ready(function() {
    document.getElementById("searchTemplate").addEventListener("keyup", filterTable);
    $("#mytable #checkall").click(function () {
        if ($("#mytable #checkall").is(':checked')) {
            $("#mytable input[type=checkbox]").each(function () {
                $(this).prop("checked", true);
            });

        } else {
            $("#mytable input[type=checkbox]").each(function () {
                $(this).prop("checked", false);
            });
        }
    });
    $("[data-toggle=tooltip]").tooltip();
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        var row_id = 0
        allKeys.forEach(function (key) {
            var urlParser = new URLParser(key)
            var row = document.createElement("TR");
            var cell0 = row.insertCell(0);
            var cell1 = row.insertCell(1);
            var cell2 = row.insertCell(2);
            var cell3 = row.insertCell(3);
            var cell4 = row.insertCell(4);
            cell0.innerHTML = '<input type="checkbox" class="checkthis" />';
            cell1.innerHTML = urlParser.extractHostname();
            cell2.innerHTML = key;
            cell3.innerHTML = '<td><pdata-placement="top"><button id="edit' + row_id + '" class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-pencil"></span></button></p></td>';
            cell4.innerHTML = '<p data-placement="top" title="Delete"><button id="delete' + row_id + '" class="btn btn-danger btn-xs" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-trash"></span></button></p>';
            $('#mytable > tbody:last-child').append(row);
            document.getElementById('edit' + row_id).addEventListener("click", function(){ editTemplate(key);}, false);
            document.getElementById('delete' + row_id).addEventListener("click", function(){ deleteTemplate(key, row);}, false);
            row_id++;
        })
    });
});

function editTemplate(url) {
    console.log("EDITING")
    var urlParser = new URLParser(url);
    urlParser.removeFragment();
    urlParser.removeTemplate();
    chrome.tabs.create({'url': urlParser.url, selected: true, active: true}, function(tab) {
            console.log(tab.id);
        chrome.tabs.update(tab.id, {selected: true, highlighted: true}, function() {
            console.log(tab.id);
            // var tempParser = new FormParser($('form'))
            // tempParser.initializeTemplate(urlParser.url);
        })
    });
    function updateListener(tabId, changeInfo, tab) {
        // make sure the status is 'complete' and it's the right tab
        if (changeInfo.status == 'complete'){
            chrome.tabs.onUpdated.removeListener(updateListener)
            console.log('COMPLETED')
            console.log(tab.id)
            console.log($('form'))
            // chrome.tabs.update(tab.id, {'url': urlParser.url, selected: true}, function(tab) {
            //     console.log($('form'))
            // });
            // var tempParser = new FormParser($('form'))
            // tempParser.initializeTemplate(urlParser.url);
        }
    };
    chrome.tabs.onUpdated.addListener(updateListener);
}

function deleteTemplate(url, row) {
    var i = row.rowIndex;
    document.getElementById("mytable").deleteRow(i);
    chrome.storage.sync.remove(url);
}

function filterTable() {
    console.log("FILTERING")
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("searchTemplate");
  filter = input.value.toUpperCase();
  table = document.getElementById("mytable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td1 = tr[i].getElementsByTagName("td")[1];
    td2 = tr[i].getElementsByTagName("td")[2];
    if (td1 || td2) {
      if (td1.innerHTML.toUpperCase().indexOf(filter) > -1 || td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}

