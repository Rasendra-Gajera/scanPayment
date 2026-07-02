
// fetch currency rates to populate dropdowns
var currencyList = [];
// map of currency codes to symbols (declare once to avoid redeclaration)
var currencySymbolMap = currencySymbolMap || {
    USD: '$', EUR: '€', INR: '₹', GBP: '£', JPY: '¥',
    AUD: 'A$', CAD: 'C$', CHF: 'CHF', CNY: '¥', HKD: 'HK$',
    NZD: 'NZ$', SEK: 'kr', KRW: '₩', SGD: 'S$', NOK: 'kr',
    MXN: '$', BRL: 'R$', ZAR: 'R', RUB: '₽', TRY: '₺'
};
var mode;


console.log("BASE_URL: ", BASE_URL);
if (BASE_URL.includes("localhost")) {
    mode = "local";
} else {
    mode = "production";
}
console.log("mode: ", mode);
console.log("CURRENCY_API_KEY: ", CURRENCY_API_KEY);
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

function getOfflineReceiptData() {
    return {
        card_holder_name: $("#card_holder_name_offline").val() || "",
        card_number: $("#card_number_offline").val() || "",
        cvv: $("#cvv_offline").val() || "",
        amount: $("#amount_offline").val() || "0",
        expiry_date: $("#expiry_date_offline").val() || "",
        transaction_protocol: $("#transaction_protocol_offline").val() || "",
        auth_code: $("#auth_code_offline").val() || "",
        currency: $("#currency_offline").val() || "",
        currency_symbol: $("#currency_symbol_offline").text() || "€",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
}

function formatReceiptCardNumber(number) {
    var digits = String(number).replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    return "**** **** **** " + digits.slice(-4);
}

function buildOfflineReceiptDocDefinition(data) {
    var logoImage = BASE_URL + "admin/assets/media/logos/vertext_logo.png"; // default logo path'';

    return {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],
        content: [
            { image: logoImage, width: 120, alignment: 'center', margin: [0, 0, 0, 20] },
            { text: 'MASTER SALE RECEIPT', style: 'receiptTitle', alignment: 'center', margin: [0, 0, 0, 12] },
            { text: 'CUSTOMER COPY', style: 'receiptSubtitle', alignment: 'center', margin: [0, 0, 0, 20] },
            {
                columns: [
                    [
                        { text: 'Withdrawal Date :', style: 'fieldLabel' },
                        { text: 'Withdrawal Time :', style: 'fieldLabel' },
                        { text: 'Card Holder Name :', style: 'fieldLabel' },
                        { text: 'Card Number :', style: 'fieldLabel' },
                        { text: 'Expiry Date :', style: 'fieldLabel' },
                        { text: 'CVV :', style: 'fieldLabel' },
                        { text: 'Transaction Protocol :', style: 'fieldLabel' },
                        { text: 'Auth Code :', style: 'fieldLabel' }
                    ],
                    [
                        { text: data.date, style: 'fieldValue' },
                        { text: data.time, style: 'fieldValue' },
                        { text: data.card_holder_name, style: 'fieldValue' },
                        { text: formatReceiptCardNumber(data.card_number), style: 'fieldValue' },
                        { text: data.expiry_date, style: 'fieldValue' },
                        { text: data.cvv ? '***' : '', style: 'fieldValue' },
                        { text: data.transaction_protocol, style: 'fieldValue' },
                        { text: data.auth_code, style: 'fieldValue' }
                    ]
                ],
                columnGap: 10,
                margin: [0, 0, 0, 20]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
            { text: 'AMOUNT : ' + data.currency_symbol + parseFloat(data.amount || 0).toFixed(2), style: 'amountLine', margin: [0, 12, 0, 4] },
            { text: 'TOTAL : ' + data.currency_symbol + parseFloat(data.amount || 0).toFixed(2), style: 'amountLine', margin: [0, 0, 0, 20] },
            { text: 'AUTH CODE: ' + data.auth_code, style: 'footerBold', alignment: 'center', margin: [0, 0, 0, 4] },
            { text: 'RESPONSE CODE: 000 APPROVED', style: 'footerBold', alignment: 'center', margin: [0, 0, 0, 4] },
            { text: 'APPROVED AUTHORISED TRANSACTION SUCCESSFUL', style: 'footerBold', alignment: 'center', margin: [0, 0, 0, 12] },
            { text: 'Cardholder Not Present', style: 'footerNote', alignment: 'center' },
            { text: 'Please DEBIT My Account With Total Shown', style: 'footerNote', alignment: 'center' }
        ],
        styles: {
            receiptTitle: { fontSize: 18, bold: true },
            receiptSubtitle: { fontSize: 12, bold: true },
            fieldLabel: { fontSize: 10, bold: true },
            fieldValue: { fontSize: 10, margin: [0, 0, 0, 8] },
            amountLine: { fontSize: 14, bold: true },
            footerBold: { fontSize: 11, bold: true },
            footerNote: { fontSize: 10 }
        }
    };
}

function createOfflineReceiptPdf(data) {
    if (typeof pdfMake !== 'undefined' && pdfMake.createPdf) {
        return pdfMake.createPdf(buildOfflineReceiptDocDefinition(data));
    }
    return null;
}

function printOrDownloadOfflineReceipt(data) {
    var pdf = createOfflineReceiptPdf(data);
    if (mode === 'production') {
        if (pdf) {
            pdf.print();
        } else {
            window.open('', '_blank').document.write('<p>Printing is unavailable because pdfMake is not loaded.</p>');
        }
    } else {
        if (pdf) {
            pdf.download('offline-receipt-' + new Date().getTime() + '.pdf');
        } else {
            window.open('', '_blank').document.write('<p>Download is unavailable because pdfMake is not loaded.</p>');
        }
    }
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

                if (response.err === 1) {
                    showSwalWithLoader(response.msg, "error");
                } else {
                    const sendData = {
                        card_holder_name: $("#card_holder_name_offline").val(),
                        card_number: $("#card_number_offline").val(),
                        cvv: $("#cvv_offline").val(),
                        expiry_date: $("#expiry_date_offline").val(),
                        amount: $("#amount_offline").val(),
                        currency_symbol: $("#currency_symbol_offline").text(),
                        transaction_protocol: $("#transaction_protocol_offline").val(),
                        auth_code: $("#auth_code_offline").val(),
                        mode: mode
                    };
                    console.log("sendData: ", sendData);
                    $.ajax({
                        url: BASE_URL + "admin/receipt",
                        type: "POST",
                        data: sendData,
                        success: function (receiptHtml) {
                            if (mode == "local") {
                                downloadReceiptPDF(receiptHtml);
                            } else {
                                printReceipt(receiptHtml);
                            }
                            $("#edit-modal-offline").modal("hide");
                            showSwalWithLoader(response.msg, "success");
                        }
                    });
                $("#edit_users_offline").trigger("reset");

                }
            }
        });
    });

    // clear form on modal hide
    $(document).on("hide.bs.modal", "#edit-modal-offline", function () {
        resetOffline();
    });
});

function printReceipt(html) {
    const win = window.open("", "_blank", "width=400,height=700");
    win.document.open();
    win.document.write(html);
    win.document.close();
}

function downloadReceiptPDF(html) {
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
    const receipt = container.querySelector(".receipt");
    const opt = {
        margin: 0,
        filename: "Receipt.pdf",
        image: {
            type: "jpeg",
            quality: 1
        },
        html2canvas: {
            scale: 3
        },
        jsPDF: {
            unit: "mm",
            format: [80, 220],
            orientation: "portrait"
        }
    };

    html2pdf()
        .set(opt)
        .from(receipt)
        .save()
        .then(function () {
            document.body.removeChild(container);
        });

}

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
