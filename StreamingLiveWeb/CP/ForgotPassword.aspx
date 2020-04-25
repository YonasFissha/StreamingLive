<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/MasterPage.Master" AutoEventWireup="true" CodeBehind="ForgotPassword.aspx.cs" Inherits="StreamingLiveWeb.CP.ForgotPassword" %>
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
                <h2>Forgot Password</h2>
                <asp:TextBox ID="EmailText" runat="server" CssClass="form-control" placeholder="Email address" />
                <asp:Button ID="ResetButton" runat="server" CssClass="btn btn-lg btn-primary btn-block" Text="Reset Password" OnClick="ResetButton_Click" />
            </div>
        </div>
    </form>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
</asp:Content>
