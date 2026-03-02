
var limit = 10;
var start = 1;

// pagination + search
function pagination(page) {
    var search = $("#search").val();
    $.ajax({
        type: "POST",
        url: BASE_URL + "admin/online/list/" + page + "/" + limit + "/",
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
        htmlData += "<td>" + list[i].card_holder_name + "</td>";
        htmlData += "<td>****" + list[i].card_number.slice(-4) + "</td>";
        htmlData += "<td>***</td>";                                 // cvv masked
        htmlData += "<td>" + (list[i].expiry_date ? new Date(list[i].expiry_date).toLocaleDateString() : "") + "</td>"; // expiry
        htmlData += "<td>" + list[i].amount + "</td>";
        htmlData += "<td>" + list[i].transaction_protocol + "</td>";
        htmlData += "<td>" + list[i].auth_code + "</td>";
        htmlData += "<td>" + new Date(list[i].created_at).toLocaleString() + "</td>";
        htmlData += "<td>";
        htmlData += '<a href="javascript:;" onclick="view(\'' + list[i]._id + '\');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><i class="fas fa-edit"></i></a>';
        htmlData += '<a href="javascript:;" onclick="remove(\'' + list[i]._id + '\');" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"><i class="fas fa-trash"></i></a>';
        htmlData += "</td></tr>";
    }
    $(".table-data").html(htmlData || '<tr><td colspan="8"><span class="fw-bold d-block fs-7">No records found</span></td></tr>');
}

function view(id) {
    $.ajax({
        type: "POST",
        url: BASE_URL + "admin/online/view",
        data: { id: id },
        success: function (response) {
            if (response.err === 0) {
                var d = response.data;
                $("#record_id").val(d._id);
                $("#card_holder_name").val(d.card_holder_name);
                $("#card_number").val(d.card_number);
                $("#cvv").val(d.cvv);
                $("#expiry_date").val(d.expiry_date ? new Date(d.expiry_date).toISOString().split('T')[0] : "");
                $("#amount").val(d.amount);
                $("#transaction_protocol").val(d.transaction_protocol);
                $("#auth_code").val(d.auth_code);
                $(".popup-title").text("Edit Online Transaction");
                $("#edit-modal").modal("show");
            }
        }
    });
}

function Reset() {
    $("#record_id").val("");
    $("#card_holder_name, #card_number, #cvv, #expiry_date, #amount").val("");
    $("#transaction_protocol, #auth_code").val("");
}

function add_record() {
    Reset();
    $(".popup-title").text("Add Online Transaction");
    $("#edit-modal").modal("show");
}

function toggleCardNumber() {
    var fld = $("#card_number");
    fld.attr("type", fld.attr("type") === "password" ? "text" : "password");
}

function toggleCVV() {
    var fld = $("#cvv");
    fld.attr("type", fld.attr("type") === "password" ? "text" : "password");
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

        // basic front‑end validation
        if (!$("#card_holder_name").val()) {
            alert("Card holder name is required");
            return;
        }

        $.ajax({
            type: "POST",
            url: BASE_URL + "admin/online/save",
            data: {
                id: $("#record_id").val(),
                card_holder_name: $("#card_holder_name").val(),
                card_number: $("#card_number").val(),
                cvv: $("#cvv").val(),
                expiry_date: $("#expiry_date").val(),
                amount: $("#amount").val(),
                transaction_protocol: $("#transaction_protocol").val(),
                auth_code: $("#auth_code").val()
            },
            success: function (response) {
                $(".indicator-progress").hide();
                $("#edit_users").trigger("reset");

                if (response.err === 1) {
                    Swal.fire({
                        text: response.msg,
                        icon: "error",
                        buttonsStyling: !1,
                        confirmButtonText: "Ok, got it!",
                        customClass: { confirmButton: "btn btn-primary" }
                    });
                } else {
                    $("#edit-modal").modal("hide");
                    Swal.fire({
                        text: response.msg,
                        icon: "success",
                        buttonsStyling: !1,
                        confirmButtonText: "Ok, got it!",
                        customClass: { confirmButton: "btn btn-primary" }
                    });
                    start = 1;
                    pagination(start);
                }
            }
        });
    });
});

function remove(id) {
    console.log("id: ", id);
    Swal.fire({
        text: "Are you sure you would like to delete?",
        icon: "warning",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, return",
        customClass: { confirmButton: "btn btn-primary", cancelButton: "btn btn-light" }
    }).then(function (result) {
        if (result.value) {
            $.ajax({
                type: "POST",
                url: BASE_URL + "admin/online/delete",
                data: { id: id },
                success: function (response) {
                    if (response.err === 1) {
                        Swal.fire({
                            text: response.msg,
                            icon: "error",
                            buttonsStyling: !1,
                            confirmButtonText: "Ok, got it!",
                            customClass: { confirmButton: "btn btn-primary" }
                        });
                    } else {
                        Swal.fire({
                            text: response.msg,
                            icon: "success",
                            buttonsStyling: !1,
                            confirmButtonText: "Ok, got it!",
                            customClass: { confirmButton: "btn btn-primary" }
                        });
                        start = 1;
                        pagination(start);
                    }
                }
            });
        }
    });
}