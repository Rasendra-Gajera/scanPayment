var limit = 10;
var start = 1;

// Swal Fire Helper Function with Loader and Timer
function showSwalWithLoader(title, icon) {
    return Swal.fire({
        text: title,
        icon: icon,
        buttonsStyling: !1,
        confirmButtonText: "Ok, got it!",
        customClass: { confirmButton: "btn btn-primary" },
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
            Swal.showLoading();
        },
        willClose: () => {
            // cleanup if needed
        }
    });
}

// pagination + search
function pagination(page) {
    var search = $("#search").val();
    $.ajax({
        type: "POST",
        url: BASE_URL + "admin/wallet/list/" + page + "/" + limit + "/",
        data: { search: search },
        success: function (response) {
            if (response.err === 0) {
                var data = response.data;
                $(".pagination").html(data.html);
                $(".pagination-text").html(data.text);
                renderTable(data.list);
            }
        }
    });
}

$("#search").keydown(function (e) {
    if (e.key === "Enter") {
        start = 1;
        pagination(start);
    }
});

function renderTable(list) {
    var htmlData = "";
    for (var i = 0; i < list.length; i++) {
        htmlData += "<tr>";
        htmlData += "<td>" + list[i].selected_network + "</td>";
        htmlData += "<td>" + list[i].current_wallet + "</td>";
        htmlData += "<td>" + new Date(list[i].created_at).toLocaleString() + "</td>";
        htmlData += "<td>";
        htmlData += '<a href="javascript:;" onclick="view(\'' + list[i]._id + '\');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><i class="fas fa-edit"></i></a>';
        htmlData += '<a href="javascript:;" onclick="remove(\'' + list[i]._id + '\');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><i class="fas fa-trash"></i></a>';
        htmlData += "</td></tr>";
    }
    $(".table-data").html(htmlData || '<tr><td colspan="4"><span class="fw-bold d-block fs-7">No records found</span></td></tr>');
}

function view(id) {
    $.ajax({
        type: "POST",
        url: BASE_URL + "admin/wallet/view",
        data: { id: id },
        success: function (response) {
            if (response.err === 0) {
                var d = response.data;
                $("#record_id").val(d._id);
                $("#selected_network").val(d.selected_network);
                $("#current_wallet").val(d.current_wallet);
                $(".popup-title").text("Edit Wallet Setting");
                $("#edit-modal").modal("show");
            }
        }
    });
}

function Reset() {
    $("#record_id").val("");
    $("#selected_network, #current_wallet").val("");
}

function add_record() {
    Reset();
    $(".popup-title").text("Add Wallet Setting");
    $("#edit-modal").modal("show");
}

function remove(id) {
    if (confirm("Are you sure you want to delete this wallet setting?")) {
        $.ajax({
            type: "POST",
            url: BASE_URL + "admin/wallet/delete",
            data: { id: id },
            success: function (response) {
                if (response.err === 0) {
                    showSwalWithLoader(response.msg, "success");
                    start = 1;
                    pagination(start);
                } else {
                    showSwalWithLoader(response.msg, "error");
                }
            }
        });
    }
}

$(document).ready(function () {
    pagination(start);

    // clear form on modal hide
    $(document).on("hide.bs.modal", "#edit-modal", function () {
        Reset();
    });

    $("#edit_users").on("submit", function (e) {
        e.preventDefault();
        $(".indicator-progress").css("display", "contents");

        // basic front-end validation
        if (!$("#selected_network").val() || !$("#current_wallet").val()) {
            alert("All fields are required");
            return;
        }

        $.ajax({
            type: "POST",
            url: BASE_URL + "admin/wallet/save",
            data: {
                id: $("#record_id").val(),
                selected_network: $("#selected_network").val(),
                current_wallet: $("#current_wallet").val()
            },
            success: function (response) {
                $(".indicator-progress").hide();
                $("#edit_users").trigger("reset");

                if (response.err === 1) {
                    showSwalWithLoader(response.msg, "error");
                } else {
                    $("#edit-modal").modal("hide");
                    showSwalWithLoader(response.msg, "success");
                    start = 1;
                    pagination(start);
                }
            }
        });
    });
});