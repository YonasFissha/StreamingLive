context('Admin - Service Inactive', () => {
    logIntoAdmin();
    editService();
});

function logIntoAdmin() {
    it('Log Into Admin', () => {
        cy.visit(Cypress.env('adminUrl') + '/cp/login.aspx?ReturnUrl=%2fcp%2flive%2f');
        
        cy.get('#MainContent_EmailText').type(Cypress.env('email'));
        cy.get('#MainContent_PasswordText').type(Cypress.env('password'));
        cy.get('#MainContent_SigninButton').click();
        cy.get('body').should('contain', 'View your live site:');

    });
}


function editService() {
    it('Set Service for 1 hour later', () => {
        cy.wait(750);
        var services = Cypress.$('#servicesBox .fa-pencil-alt');
        var id = services[services.length - 1].parentElement.id;
        cy.get('#' + id).click();
        cy.wait(500);
        var serviceTime = getCurrentMinute();
        serviceTime.setTime(serviceTime.getTime() + 60 * 60 * 1000); //1 hour

        cy.get('#MainContent_MainContent_CountdownTimeText')
            .should('exist')
            .type(formatDateTimeLocal(serviceTime));
        cy.get('#MainContent_MainContent_SaveServiceButton').click();
        cy.get('#MainContent_MainContent_PublishButton').click();
        cy.wait(2000);
    });
}


function getCurrentMinute() {
    var result = new Date();
    result.setTime(result.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
    var ms = 1000 * 60;
    result = new Date(Math.round(result.getTime() / ms) * ms);
    return result;
}

function formatDateTimeLocal(dt) {
    var result = dt.toISOString().replace('Z', '').split('.')[0];
    result = result.substring(0, result.length - 3);
    return result;
}