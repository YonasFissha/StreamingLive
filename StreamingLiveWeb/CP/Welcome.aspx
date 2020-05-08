<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/ControlPanel.master" AutoEventWireup="true" CodeBehind="Welcome.aspx.cs" Inherits="StreamingLiveWeb.CP.Welcome" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        .aspect-ratio-box { height: 0; overflow: hidden; padding-top: 56.25%; background: white; position: relative; }
        .aspect-ratio-box-inside { position: absolute; top: 0; left: 0; width: 100%; height: 100%;}
    </style>
    <script> gtag('event', 'conversion', { 'send_to': 'AW-643544702/MOfgCIiR7M8BEP7s7rIC' }); </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h1><i class="fas fa-video"></i> Welcome to StreamingLive</h1>
    <hr style="margin-bottom:40px;" />
    <div class="row">
        <div class="col-md-7">
            <div class="inputBox">
                <div class="header">
                    <i class="fas fa-video"></i> Welcome to StreamingLive
                </div>
                <div class="content" style="padding-top:20px;padding-bottom:20px;">
                    <p>Thank you for signing up.  You're site is already live at <asp:Literal ID="SiteLink" runat="server" /> , but needs to be customized.  To do so, click <a href="/live/">Stream Settings</a> on the left.  Here you can upload your logo, set your color scheme, and schedule your first service.  Be sure to click the Publish button on that page once the customizations are complete.</p>
                    <p>When it is time for your first service, use the <a href="/host/">Host Dashboard</a> to the left to moderate the chat and respond to prayer requests.</p>
                    <p>Have questions?  We would be happy to help you get started.  Email us at <a href="mailto:support@streaminglive.church">support@streaminglive.church</a>.</p>
                </div>
            </div>
        </div>
        <div class="col-md-5">
            <div class="aspect-ratio-box">
                <iframe class="aspect-ratio-box-inside" src="https://www.youtube.com/embed/HC0B3hHdRew" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
</asp:Content>
