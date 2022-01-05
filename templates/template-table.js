$(document).ready(function () {
  document.getElementById('searchTemplate').addEventListener('keyup', filterTable);
  $('#mytable #checkall').click(function () {
    if ($('#mytable #checkall').is(':checked')) {
      $('#mytable input[type=checkbox]').each(function () {
        $(this).prop('checked', true);
      });

    } else {
      $('#mytable input[type=checkbox]').each(function () {
        $(this).prop('checked', false);
      });
    }
  });
  $('#delete-selected').click(function () {
    if ($('input:checkbox:checked').length > 0) {
      if (confirm('Are you sure you want to delete these templates?')) {
        $('input:checkbox:checked').each(function () {
          var url = $(this).parent().parent().children().eq(2).text();
          var row_id = $(this).parent().parent()[0].rowIndex;
          document.getElementById('mytable').deleteRow(row_id);
          chrome.storage.sync.remove(url + '-template');
        });
      }
    }
    $(this).blur();
  });
  $('[data-toggle=tooltip]').tooltip();
  //Populate table
  var templateService = new TemplateService();
  templateService.getTemplateUrls(function(allKeys) {
    var row_id = 0;
    if(allKeys == undefined) {
      return;
    }
    allKeys.forEach(function (key) {
      var urlParser = new URLParser(key);
      var url = urlParser.removeTemplate();
      var urlHostname = urlParser.extractHostname();
      var row = document.createElement('TR');
      var hiddenRow = document.createElement('TR');
      var cell0 = row.insertCell(0);
      var cell1 = row.insertCell(1);
      var cell2 = row.insertCell(2);
      var cell3 = row.insertCell(3);  
      var cell4 = row.insertCell(4);
      var cell5 = row.insertCell(5);
      hiddenRow.className = 'hidden_row'
      cell0.innerHTML = '<input type="checkbox" class="checkthis" />';
      cell1.innerHTML = urlHostname;
      cell2.innerHTML = url;
      cell3.innerHTML = '<td><pdata-placement="top"><button id="edit' + row_id + '" class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-pencil"></span></button></p></td>';
      cell4.innerHTML = '<p data-placement="top" title="Delete"><button id="delete' + row_id + '" class="btn btn-danger btn-xs" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-trash"></span></button></p>';
      cell5.innerHTML = ''
      $('#mytable > tbody:last-child').append(row);
      $('#mytable > tbody:last-child').append(hiddenRow);
      document.getElementById('edit' + row_id).addEventListener('click', async function (e) {
        e.stopPropagation();
        await editTemplate(url);
        $(this).blur();
      }, false);
      document.getElementById('delete' + row_id).addEventListener('click', async function (e) {
        e.stopPropagation();
        await deleteTemplate(url, row); $(this).blur();
      }, false);
      var createClickHandler = function(e, row, url, urlHostname) {
        return function() {
          if(e.getElementsByTagName('td').length > 0) {
            toggleRow(row, url, urlHostname);
          }
        };
      };
      row.onclick = createClickHandler(row, 'hidden' + row_id, url, urlHostname);
      jQuery(row).attr('id', row_id);
      jQuery(hiddenRow).attr('id', "hidden" + row_id);
      row_id++;
    });
  });
});

// Navigate to template url by creating a new tab, and executing the restore-template script to populate form data
async function editTemplate(url) {
  var urlParser = new URLParser(url);
  urlParser.removeTemplate();
  await chrome.tabs.create({'url': urlParser.url, selected: true, active: true}, async function (newTab) {
    if (!newTab.url) await onTabUrlUpdated(newTab.id);
    var obj = {};
    obj['isFromPopup'] = false;
    await chrome.runtime.sendMessage({type: "store-local", value: obj}, function(response) {
      chrome.scripting.executeScript(
      {
        target: {tabId: newTab.id},
        files: [
          "content_scripts/url-parser.js",
          "content_scripts/form-parser.js",
          "content_scripts/data-stack.js",
          "content_scripts/template-service.js",
          "js/jquery.min.js",
          "content_scripts/main.js",
          'templates/restore-template.js'
        ],
      },
      function() {
        window.close();
        console.log("Last error:", chrome.runtime.lastError);
      });
    });
  });
}

// Delete template from chrome storage and table
async function deleteTemplate(url, row) {
  if (confirm('Are you sure you want to delete this template?') == false) {
    return;
  } else {
    var i = row.rowIndex;
    document.getElementById('mytable').deleteRow(i);
    await chrome.storage.sync.remove(url + '-template');
  }
}

function toggleRow(row_id, url, urlHostname) {
  var templateService = new TemplateService();
  templateService.getTemplateData(url, urlHostname, function(data) {
    if (Object.keys(data).length === 0) {
      console.log("No template data stored for this url.");
      return;
    }
    var innerHtml = '<td><table class="table-expand table table-bordred table-striped sortable" style="text-align:center;"><tr><td> Attribute Name </td> <td> Attribute Value </td></tr>'
    jQuery.each(data, function(idx, row) {
      innerHtml += "<tr><td>" + JSON.stringify(idx) + "</td> <td>" + JSON.stringify(row.value) + "</td></tr>"
    })
    innerHtml += '</table></td>';
    var rowElem = document.getElementById(row_id);
    var rowCell;
    if(rowElem.cells.length == 0) {
      rowCell = rowElem.insertCell(0);
    }
    else {
      rowCell = rowElem.cells[0];
      rowCell.innerHTML = null;
    }
    rowCell.innerHTML = innerHtml;
    rowCell.colSpan = 4;
    if($("#" + row_id).length){
      $("#" + row_id).toggle();
    }
  });
}

function filterTable() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById('searchTemplate');
  filter = input.value.toUpperCase();
  table = document.getElementById('mytable');
  tr = table.getElementsByTagName('tr');

  var hiddenRows = $('[id^="hidden"]');
  for (i = 0; i < hiddenRows.length;i++){
    hiddenRows[i].style.display = 'none';
  }

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    var td1 = tr[i].getElementsByTagName('td')[1];
    var td2 = tr[i].getElementsByTagName('td')[2];
    if (td1 || td2) {
      if (td1.innerHTML.toUpperCase().indexOf(filter) > -1 || td2.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = '';
      } else {
        tr[i].style.display = 'none';
      }
    }
  }
}

function retrieveTemplateData(url) {
  var data = [];
  chrome.storage.sync.get(url + '-template', function (items) {
    var item_len = Object.keys(items).length;
    if (items != undefined && item_len > 0) {
      data = items[url + '-template'];
    }
  });
  return data;
}

function onTabUrlUpdated(tabId) {
  return new Promise((resolve, reject) => {
    const onUpdated = (id, info) => id === tabId && info.url && done(true);
    const onRemoved = id => id === tabId && done(false);
    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.onRemoved.addListener(onRemoved);
    function done(ok) {
      chrome.tabs.onUpdated.removeListener(onUpdated);
      chrome.tabs.onRemoved.removeListener(onRemoved);
      (ok ? resolve : reject)();
    }
  })};