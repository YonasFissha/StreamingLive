<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/MasterPage.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="StreamingLiveWeb.Donate.Default" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script src="https://js.stripe.com/v3/"></script>
    <style>
        .form-control::placeholder {
            color:#aaa;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <nav class="navbar navbar-expand navbar-dark fixed-top bg-dark">
        <a class="navbar-brand" href="/" style="padding-top:0px;padding-bottom:0px;">
            <img src="/images/logo.png" style="height:35px;margin-top:5px;margin-bottom:5px;" />
        </a>
        <div class="collapse navbar-collapse" id="navbar">
            <ul class="navbar-nav mr-auto">
            </ul>
            <div class="navbar-nav ml-auto">
                <asp:Literal ID="LoginLit" runat="server"><a href="/cp/">Login</a></asp:Literal>
            </div>
        </div>
    </nav>
    <div id="userMenu" style="display:none;"></div>
    <div style="height:85px;"></div>


    <div class="container">
        <h1>Donate</h1>
        <div class="row">
            <div class="col">
                <p>Thank you for considering donating.  StreamingLive is a free service provided by Live Church Solutions, a 501(c)3.  Your donations are what enable us to offer services like this for free to churches.</p>
                <p>If you would like to donate, please use the form on the right.  The form is powered by Stripe, our payment provider, and all information submitted goes directly to Stripe.  Live Church Solutions does not receive any credit card info.</p>
                <p>If you choose to provide an email address, you will automatically be emailed a tax-receipt with the donation details.</p>
            </div>
            <div class="col">

                <asp:PlaceHolder ID="PrepFormHolder" runat="server">
                    <form runat="server">
                        <div class="inputBox">
                            <div class="header">
                                <div class="float-right">
                                    <img src="/images/stripe.png" style="opacity: 0.5;height:30px;" />
                                </div>
                                Donate
                            </div>
                            <div class="content">
                                <div class="form-group">
                                    <label>Amount</label>
                                    <asp:TextBox ID="AmountText" runat="server" CssClass="form-control" placeholder="$20.00"  />
                                </div>
                                <div class="form-group">
                                    <label>Name</label>
                                    <asp:TextBox ID="NameText" runat="server" CssClass="form-control" placeholder="Optional - for receipt"  />
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <asp:TextBox ID="EmailText" runat="server" CssClass="form-control" placeholder="Optional - for receipt"  />
                                </div>
                            </div>
                            <div class="footer">
                                <div class="row">
                                    <div class="col">
                                        <asp:Button ID="SubmitButton" runat="server" Text="Next" cssclass="btn btn-primary btn-block" OnClick="SubmitButton_Click" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </asp:PlaceHolder>

                <asp:PlaceHolder ID="StripeFormHolder" runat="server" Visible="false">
                    <form id="paymentForm">
                        <div class="inputBox">
                            <div class="header">
                                <div class="float-right">
                                    <img src="/images/stripe.png" style="opacity: 0.5;height:30px;" />
                                </div>
                                Donate
                            </div>
                            <div class="content">
                                <%=PrepSummary %>


                                <div class="form-group">
                                    <label>Card Details</label>
                                    <div id="card-element" style="border:1px solid #ced4da;border-radius:.25rem;padding:12px 12px;"></div>
                                </div>
                                <div id="card-errors" role="alert"></div>
                            
                            </div>
                            <div class="footer">
                                <div class="row">
                                    <div class="col">
                                        <button class="btn btn-primary btn-block">Donate</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </asp:PlaceHolder>


                <div class="inputBox" id="thankYouBox" style="display:none;">
                    <div class="header">
                        Donate
                    </div>
                    <div class="content">
                        <p>Thank you for your generosity!  Donations like yours are what enable us to offer this service.</p>
                    </div>
                    
                </div>

            </div>
        </div>
    </div>
    
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">


    <asp:PlaceHolder ID="StripeScriptHolder" runat="server" Visible="false">
        <script>
            // Create a Stripe client
            var stripe = Stripe('pk_live_Ny9Jk8nPW2lRf7NTjTg8QiBt00D4bjTh3y');

            // Create an instance of Elements
            var elements = stripe.elements();

            // Custom styling can be passed to options when creating an Element.
            // (Note that this demo uses a wider set of styles than the guide below.)
            var style = {
                base: {
                    color: '#333',
                    lineHeight: '18px',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            };

            // Create an instance of the card Element
            var card = elements.create('card', { style: style });

            // Add an instance of the card Element into the `card-element` <div>
            card.mount('#card-element');

            // Handle real-time validation errors from the card Element.
            card.addEventListener('change', function (event) {
                var displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });

            // Handle form submission
            var form = document.getElementById('paymentForm');
            form.addEventListener('submit', function (event) {
                event.preventDefault();


                /*
                try {
                    const result = await stripe.confirmCardPayment(clientSecret, {
                        payment_method: {
                            card: card,
                            billing_details: { name: 'Jeremy' },
                        }
                    });
                    if (result.error) {
                        document.getElementById('card-errors').textContent = result.error.message;
                        return false;
                    } else {
                        document.getElementById('card').submit();
                    }
                } catch (err) {
                    document.getElementById('card-errors').textContent = err.message;
                    return false;
                }
                */

                
                stripe.confirmCardPayment('<%=IntentKey%>', { payment_method: { card: card, billing_details: { name: '<%=Name%>' }}}).then(function (result) {
                    if (result.error) {
                        // Inform the user if there was an error
                        var errorElement = document.getElementById('card-errors');
                        errorElement.textContent = result.error.message;
                    } else {
                        // Send the token to your server
                        submitForm(result.token);
                    }
                });
                

            });

            function submitForm(token) {
                $('#paymentForm').hide();
                $('#thankYouBox').show();
            }

        </script>
    </asp:PlaceHolder>

</asp:Content>
