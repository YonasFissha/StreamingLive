<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/MasterPage.Master" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="StreamingLiveWeb.CP.Login" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <style>
        #loginBox {background-color:#EEE;border:1px solid #CCC;border-radius:5px;padding:20px;}
        #loginBox input {margin-bottom:5px;}
        .smallCenterBlock {margin-top:60px;max-width:350px;margin-left:auto;margin-right:auto;}
    </style>
    <form runat="server">
        <div class="smallCenterBlock">
            <asp:Literal ID="OutputLit" runat="server" />
            <div id="loginBox">
                <h2>Please sign in</h2>
                <asp:TextBox ID="EmailText" runat="server" CssClass="form-control" placeholder="Email address" />
                <asp:TextBox ID="PasswordText" TextMode="Password" runat="server" CssClass="form-control" placeholder="Password" />
                <asp:Button ID="SigninButton" runat="server" CssClass="btn btn-lg btn-primary btn-block" Text="Sign in" OnClick="SigninButton_Click" />
                <br />
                <div class="text-right">
                    <a href="/#register">Register</a> &nbsp; | &nbsp; 
                    <a href="/cp/forgotpassword.aspx">Forgot Password</a>
                    &nbsp;
                </div>
            </div>
        </div>
    </form>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
</asp:Content>
