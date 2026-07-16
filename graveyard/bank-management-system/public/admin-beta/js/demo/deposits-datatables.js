$(document).ready(function () {
  $('#dataTable').DataTable({
    columns: [
      { data: 'date' },
      { data: 'name' },
      { data: 'acn' },
      { data: 'amount' },
      { data: 'dBy' },
      { data: 'dTo' },
    ],
    ajax: {
      url: '/api/deposit',
      dataSrc: ''
    },
    columnDefs: [ {
      "targets": 0,
      "data": "date",
      "render": function ( data, type, row, meta ) {
        return new Date(data).toLocaleDateString('en-IN');
      }
    } ]
  });
});