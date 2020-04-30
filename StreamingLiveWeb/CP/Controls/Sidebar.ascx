<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Sidebar.ascx.cs" Inherits="StreamingLiveWeb.CP.Controls.Sidebar" %>
<nav class="col-sm-3 col-md-2 d-none d-sm-block bg-dark sidebar" id="sidebar">
    <a class="navbar-brand" href="/" style="margin-left:16px;margin-top:15px;"><i class="fas fa-users"></i> Streaming Live</a>
    <ul class="nav flex-column" style="margin-top:0px;">
        <li class="nav-item"><a class="nav-link" href="/cp/host/"><i class="fas fa-praying-hands"></i> Host Dashboard</a></li>
        <li class="nav-item"><a class="nav-link" href="/cp/users/"><i class="fas fa-user"></i> User Settings</a></li>
    </ul>
    <asp:PlaceHolder ID="AdminHolder" runat="server">
        <hr />
        <ul class="nav flex-column" style="margin-top:0px;">
            <li class="nav-item"><a class="nav-link" href="/cp/live/"><i class="fas fa-video"></i> Stream Settings</a></li>
            <li class="nav-item"><a class="nav-link" href="/cp/pages/"><i class="fas fa-code"></i> Pages</a></li>
            <li class="nav-item"><a class="nav-link" href="/cp/reports/"><i class="fas fa-chart-area"></i> Traffic</a></li>
        </ul>
    </asp:PlaceHolder>
</nav>
