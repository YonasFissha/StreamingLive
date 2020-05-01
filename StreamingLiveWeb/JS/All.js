function toggleUserMenu() {
    if ($('#userMenu').is(':hidden')) {
        $.get('/cp/usermenu.aspx', function (data) {
            $('#userMenu').html(data);
            $('#userMenu').show();
        });
    }
    else $('#userMenu').hide();
}

function selectSite(id) {
    $.get('/cp/usermenu.aspx?mode=select&id=' + id.toString(), function (data) {
        window.location.href = '/cp/';
    });
}