<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Header.ascx.cs" Inherits="StreamingLiveWeb.Controls.Header" %>
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
<div style="height:66px;"></div>