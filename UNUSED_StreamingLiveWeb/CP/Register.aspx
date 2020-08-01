<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/MasterPage.Master" AutoEventWireup="true" CodeBehind="Register.aspx.cs" Inherits="StreamingLiveWeb.CP.Register" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <style>
        #loginBox {background-color:#EEE;border:1px solid #CCC;border-radius:5px;padding:20px;}
        .smallCenterBlock {margin-top:60px;max-width:400px;margin-left:auto;margin-right:auto;}
    </style>
    <form runat="server">
        <div class="smallCenterBlock">
            <asp:Literal ID="OutputLit" runat="server" />
            <div id="loginBox">
                <h2>Register Your Site</h2>
                <div class="form-group">
                    <label>Domain</label>
                    <div class="input-group">
                        <asp:TextBox ID="KeyNameText" runat="server" CssClass="form-control" placeholder="yourchurch" />
                        <div class="input-group-append"><span class="input-group-text">.streaminglive.church</span></div>
                    </div>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <asp:TextBox ID="EmailText" runat="server" CssClass="form-control" placeholder="Email address" />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <asp:TextBox ID="PasswordText" TextMode="Password" runat="server" CssClass="form-control" placeholder="Password" />
                </div>
                <asp:Button ID="RegisterButton" runat="server" CssClass="btn btn-lg btn-primary btn-block" Text="Register" OnClick="RegisterButton_Click"/>
                <br />
                <div>
                    Already have a site? <a href="/cp/login.aspx">Login</a>
                </div>
            </div>
        </div>
    </form>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
</asp:Content>
