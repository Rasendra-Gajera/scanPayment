// fetch currency rates to populate dropdowns
var currencyList = [];
// map of currency codes to symbols (declare once to avoid redeclaration)
var currencySymbolMap = currencySymbolMap || {
    USD: '$', EUR: '€', INR: '₹', GBP: '£', JPY: '¥',
    AUD: 'A$', CAD: 'C$', CHF: 'CHF', CNY: '¥', HKD: 'HK$',
    NZD: 'NZ$', SEK: 'kr', KRW: '₩', SGD: 'S$', NOK: 'kr',
    MXN: '$', BRL: 'R$', ZAR: 'R', RUB: '₽', TRY: '₺'
};

async function fetchCurrencyList() {
    if (!CURRENCY_API_KEY) {
        console.warn('CURRENCY_API_KEY not set; skipping currency fetch');
        return;
    }
    try {
        const res = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${CURRENCY_API_KEY}&base_currency=INR`);
        const data = await res.json();
        console.log("data:>>>>>>>>>>>>>>> ", data);
        if (data && data.data) {
            currencyList = Object.keys(data.data).sort();
            populateCurrencySelectors();
        }
    } catch (err) {
        console.error('Failed to load currencies', err);
    }
}

function populateCurrencySelectors() {
    // fill select dropdowns
    const selects = ["#currency_online", "#currency_offline"];
    selects.forEach(selId => {
        const $sel = $(selId);
        $sel.empty();
        $sel.append('<option value="">Select</option>');
        currencyList.forEach(code => {
            $sel.append(`<option value="${code}">${code}</option>`);
        });
    });
}

// update symbol when currency changes
function attachCurrencyListeners() {
    $(document).on('change', '#currency_online', function () {
        const sym = currencySymbolMap[$(this).val()] || $(this).val();
        $('#currency_symbol_online').text(sym);
    });
    $(document).on('change', '#currency_offline', function () {
        const sym = currencySymbolMap[$(this).val()] || $(this).val();
        $('#currency_symbol_offline').text(sym);
    });
}

// initialize currency data
$(document).ready(function () {
    fetchCurrencyList();
    attachCurrencyListeners();
});

// Swal Fire Helper Function with Loader and Timer
function showSwalWithLoader(title, icon) {
    return Swal.fire({
        text: title,
        icon: icon,
        showConfirmButton: false, // This removes the "Ok" button
        buttonsStyling: false,
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

// Modal Loader Helper Function - Shows before modal opens
function showLoaderBeforeModal(modalId) {
    // Show loading alert with progress
    let timerInterval;
    Swal.fire({
        title: 'Loading',
        html: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false, // Ensure no button appears
        didOpen: (toast) => {
            timerInterval = setInterval(() => {
                // Progress will auto-complete
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    });

    // After 5 seconds, close loader and open modal
    setTimeout(function () {
        Swal.close();
        $(modalId).modal("show");
    }, 5000);
}

// Online Modal Functions
function openOnlineModal() {
    resetOnline();
    $(".popup-title-online").text("Create Transaction");
    showLoaderBeforeModal('#edit-modal-online');
}

function resetOnline() {
    $("#record_id_online").val("");
    $("#card_holder_name_online, #card_number_online, #cvv_online, #expiry_date_online, #amount_online").val("");
    $("#transaction_protocol_online, #auth_code_online").val("");
}

$(document).ready(function () {
    // Online form submission
    $(document).on("submit", "#edit_users_online", function (e) {
        e.preventDefault();
        $(".indicator-progress").css("display", "contents");

        // basic front-end validation
        if (!$("#card_holder_name_online").val()) {
            alert("Card holder name is required");
            return;
        }

        $.ajax({
            type: "POST",
            url: BASE_URL + "admin/online/save",
            data: {
                id: $("#record_id_online").val(),
                card_holder_name: $("#card_holder_name_online").val(),
                card_number: $("#card_number_online").val(),
                cvv: $("#cvv_online").val(),
                currency_symbol_online: $("#currency_symbol_online").text(),
                expiry_date: $("#expiry_date_online").val(),
                amount: $("#amount_online").val(), currency: $("#currency_online").val(), transaction_protocol: $("#transaction_protocol_online").val(),
                auth_code: $("#auth_code_online").val()
            },
            success: function (response) {
                $(".indicator-progress").hide();
                $("#edit_users_online").trigger("reset");

                if (response.err === 1) {
                    showSwalWithLoader(response.msg, "error");
                } else {
                    $("#edit-modal-online").modal("hide");
                    showSwalWithLoader(response.msg, "success");
                }
            }
        });
    });

    // clear form on modal hide
    $(document).on("hide.bs.modal", "#edit-modal-online", function () {
        resetOnline();
    });
});

// Offline Modal Functions
function openOfflineModal() {
    resetOffline();
    $(".popup-title-offline").text("Create Transaction");
    showLoaderBeforeModal('#edit-modal-offline');
}

function resetOffline() {
    $("#record_id_offline").val("");
    $("#card_holder_name_offline, #card_number_offline, #cvv_offline, #expiry_date_offline, #amount_offline").val("");
    $("#transaction_protocol_offline, #auth_code_offline").val("");
}

$(document).ready(function () {
    // Offline form submission
    $(document).on("submit", "#edit_users_offline", function (e) {
        e.preventDefault();
        $(".indicator-progress").css("display", "contents");

        // basic front-end validation
        if (!$("#card_holder_name_offline").val()) {
            alert("Card holder name is required");
            return;
        }

        $.ajax({
            type: "POST",
            url: BASE_URL + "admin/offline/save",
            data: {
                id: $("#record_id_offline").val(),
                card_holder_name: $("#card_holder_name_offline").val(),
                card_number: $("#card_number_offline").val(),
                cvv: $("#cvv_offline").val(),
                currency_symbol_offline: $("#currency_symbol_offline").text(),
                expiry_date: $("#expiry_date_offline").val(),
                amount: $("#amount_offline").val(), currency: $("#currency_offline").val(), transaction_protocol: $("#transaction_protocol_offline").val(),
                auth_code: $("#auth_code_offline").val()
            },
            success: function (response) {
                $(".indicator-progress").hide();
                $("#edit_users_offline").trigger("reset");

                if (response.err === 1) {
                    showSwalWithLoader(response.msg, "error");
                } else {
                    $("#edit-modal-offline").modal("hide");
                    showSwalWithLoader(response.msg, "success");
                }
            }
        });
    });

    // clear form on modal hide
    $(document).on("hide.bs.modal", "#edit-modal-offline", function () {
        resetOffline();
    });
});

// Wallet Modal Functions
function openWalletModal() {
    resetWallet();
    $(".popup-title-wallet").text("POS Wallet");
    showLoaderBeforeModal('#edit-modal-wallet');
}

function resetWallet() {
    $("#record_id_wallet").val("");
    $("#selected_network_wallet, #current_wallet_wallet").val("");
}

$(document).ready(function () {
    // Wallet form submission
    $(document).on("submit", "#edit_users_wallet", function (e) {
        e.preventDefault();
        $(".indicator-progress").css("display", "contents");

        // basic front-end validation
        if (!$("#selected_network_wallet").val() || !$("#current_wallet_wallet").val()) {
            alert("All fields are required");
            return;
        }

        $.ajax({
            type: "POST",
            url: BASE_URL + "admin/wallet/save",
            data: {
                id: $("#record_id_wallet").val(),
                selected_network: $("#selected_network_wallet").val(),
                current_wallet: $("#current_wallet_wallet").val()
            },
            success: function (response) {
                $(".indicator-progress").hide();
                $("#edit_users_wallet").trigger("reset");

                if (response.err === 1) {
                    showSwalWithLoader(response.msg, "error");
                } else {
                    $("#edit-modal-wallet").modal("hide");
                    showSwalWithLoader(response.msg, "success");
                }
            }
        });
    });

    // clear form on modal hide
    $(document).on("hide.bs.modal", "#edit-modal-wallet", function () {
        resetWallet();
    });
});
