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
  chrome.storage.sync.get(null, function (items) {
    var allKeys = [];
    Object.keys(items).forEach(function (k) {
      if (k.indexOf('-domain') == -1) {
        allKeys.push(k);
      }
    });
    var row_id = 0;
    allKeys.forEach(function (key) {
      var urlParser = new URLParser(key);
      var url = urlParser.removeTemplate();
      var row = document.createElement('TR');
      var cell0 = row.insertCell(0);
      var cell1 = row.insertCell(1);
      var cell2 = row.insertCell(2);
      var cell3 = row.insertCell(3);
      var cell4 = row.insertCell(4);
      cell0.innerHTML = '<input type="checkbox" class="checkthis" />';
      cell1.innerHTML = urlParser.extractHostname();
      cell2.innerHTML = url;
      cell3.innerHTML = '<td><pdata-placement="top"><button id="edit' + row_id + '" class="btn btn-primary btn-xs"><span class="glyphicon glyphicon-pencil"></span></button></p></td>';
      cell4.innerHTML = '<p data-placement="top" title="Delete"><button id="delete' + row_id + '" class="btn btn-danger btn-xs" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-trash"></span></button></p>';
      $('#mytable > tbody:last-child').append(row);
      document.getElementById('edit' + row_id).addEventListener('click', function () {
        editTemplate(url); $(this).blur();
      }, false);
      document.getElementById('delete' + row_id).addEventListener('click', function () {
        deleteTemplate(url, row); $(this).blur();
      }, false);
      jQuery(row).attr('id', row_id);
      row_id++;
    });
  });
});

function editTemplate(url) {
  var urlParser = new URLParser(url);
  urlParser.removeTemplate();
  chrome.tabs.create({'url': urlParser.url, selected: true, active: true}, function (tab) {
    chrome.tabs.executeScript(tab.id, {file: 'js/jquery.min.js'}, function () {
      chrome.tabs.executeScript(tab.id, {file: 'content_scripts/main.js'}, function () {
        chrome.tabs.executeScript(tab.id, {file: 'templates/restore-template.js'});
      });
    });
  });
}

// Delete template from chrome storage and table
function deleteTemplate(url, row) {
  if (confirm('Are you sure you want to delete this template?') == false) {
    return;
  } else {
    var i = row.rowIndex;
    document.getElementById('mytable').deleteRow(i);
    chrome.storage.sync.remove(url + '-template');
  }
}

function filterTable() {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById('searchTemplate');
  filter = input.value.toUpperCase();
  table = document.getElementById('mytable');
  tr = table.getElementsByTagName('tr');

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

