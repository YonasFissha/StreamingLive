<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="HomeRegister.ascx.cs" Inherits="StreamingLiveWeb.Controls.HomeRegister" %>
<style>
    #loginBox {background-color:#EEE;border:1px solid #CCC;border-radius:5px;padding:20px;}
    
</style>
<div id="register">
    <div class="container">
        <div class="text-center">
            <h2 style="margin-bottom:20px;">Register <span>Your Church</span></h2>
        </div>

        <div class="row">
            <div class="col-lg-6">
                <p>This is a <b><u>completely free</u></b> service offered to churches by Live Church Solutions, a 501(c)3.</p>
                <p>If you would like to help support our mission of enabling churches to thrive with technology solutions, please consider <a href="/donate/">donating</a>.</p>
            </div>
            <div class="col-lg-6">
                <div id="loginBox">
                    <asp:Literal ID="OutputLit" runat="server" />
                    <div class="form-group">
                        <div class="input-group">
                            <asp:TextBox ID="KeyNameText" runat="server" CssClass="form-control" placeholder="yourchurch" />
                            <div class="input-group-append"><span class="input-group-text">.streaminglive.church</span></div>
                        </div>
                    </div>
                    <div class="form-group">
                        <asp:TextBox ID="EmailText" runat="server" CssClass="form-control" placeholder="Email address" />
                    </div>
                    <div class="form-group">
                         <asp:TextBox ID="PasswordText" TextMode="Password" runat="server" CssClass="form-control" placeholder="Password" />
                    </div>
                    <asp:Button ID="RegisterButton" runat="server" CssClass="btn btn-lg btn-primary btn-block" Text="Register" OnClick="RegisterButton_Click"/>
                    <br />
                    <div>
                        Already have a site? <a href="/cp/">Login</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>