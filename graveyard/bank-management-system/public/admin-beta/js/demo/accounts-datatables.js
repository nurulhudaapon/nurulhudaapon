$(document).ready(function() {
  $("#dataTable").DataTable({
    columns: [
      { data: "name" },
      { data: "acn" },
      { data: "total" },
      { data: "min" },
      { data: "date" },
      { data: "current" },
      { data: null, render: data => Math.round(data.age) + " Days" },
      {
        data: null,
        render: data => {
          return (
            `<div class="progress mb-4">
                <div class="progress-bar bg-primary" style="width:${Math.round((data.current/data.total)*100)}%"></div>
            </div>`
          )
        }
      },
      { data: "status" }
    ],
    oSearch: { sSearch: "Running" },
    ajax: {
      url: "/api/account?type=for-table-date",
      dataSrc: ""
    }
  });
});
