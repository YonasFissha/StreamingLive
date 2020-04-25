function toggleUserMenu() {
    if ($('#userMenu').is(':hidden')) {
        $.get('/cp/usermenu.aspx', function (data) {
            $('#userMenu').html(data);
            $('#userMenu').show();
        });
    }
    else $('#userMenu').hide();
}