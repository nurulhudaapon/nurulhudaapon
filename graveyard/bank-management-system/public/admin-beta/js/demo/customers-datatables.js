$(document).ready(function () {
  $('#dataTable').DataTable({
    columns: [
      { data: 'name' },
      { data: 'id' },
      { data: 'phone' },
      { data: 'address' },
      { data: 'email' },
      { data: 'date' },
    ],
    // oSearch: { "sSearch": "Running" },
    ajax: {
      url: '/api/customer',
      dataSrc: ''
    },
    columnDefs: [ {
      "targets": 5,
      "data": "date",
      "render": function ( data, type, row, meta ) {
        return new Date(data).toLocaleDateString('en-IN');
      }
    } ]
  });
});