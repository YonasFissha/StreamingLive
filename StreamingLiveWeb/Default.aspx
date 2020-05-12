<%@ Page Language="C#" MasterPageFile="~/MasterPages/MasterPage.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" MaintainScrollPositionOnPostback="true" Inherits="StreamingLiveWeb.Default" Title="Streaming Live - A free platform for church service streaming." %>
<%@ Register src="Controls/HomeBenefits.ascx" tagname="HomeBenefits" tagprefix="uc1" %>
<%@ Register src="Controls/HomeFeatures.ascx" tagname="HomeFeatures" tagprefix="uc1" %>
<%@ Register src="Controls/HomeRegister.ascx" tagname="HomeRegister" tagprefix="uc1" %>
<%@ Register src="Controls/Footer.ascx" tagname="Footer" tagprefix="uc1" %>

<asp:Content ID="Content4" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        #features li {margin-top:20px;}
    </style>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="MainContent" runat="server">
    <form id="form1" runat="server">
        <div id="hero">
            <div class="container">
                <div class="row">
                    <div class="col-6">
                        <a href="/"><img src="/images/logo.png" alt="Streaming Live" /></a>
                    </div>
                    <div class="col-6 text-right">
                        <a href="#register" class="btn btn-info btn-sm">Register</a>
                        <a href="/cp/" class="btn btn-primary btn-sm">Login</a>
                    </div>
                </div>
                <div class="text-center">
                    <h1>Connecting the Church</h1>
                    <p>Even While We're Apart</p>
                    <a href="#register" class="btn btn-info btn-lg">Get Started Now
                    </a>
                &nbsp;</div>
            </div>
        </div>

        <uc1:HomeBenefits ID="HomeBenefits1" runat="server" />
        <uc1:HomeFeatures ID="HomeFeatures1" runat="server" />
        <uc1:HomeRegister ID="HomeRegister1" runat="server" />
        <uc1:Footer ID="Footer1" runat="server" />
    </form>

</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="ScriptBlock" runat="server">
</asp:Content>
