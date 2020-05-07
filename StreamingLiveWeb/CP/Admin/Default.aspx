<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/ControlPanel.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="StreamingLiveWeb.CP.Admin.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h1><i class="fas fa-user-lock"></i>  Admin Dashboard</h1>
    <div class="row">
        <div class="col-md-8">

            <div class="inputBox">
                <div class="header"><i class="far fa-calendar-alt"></i> Upcoming Services</div>
                <div class="content">
                    <table class="table table-sm">
                        <tr><th>Site</th><th>Time</th></tr>
                        <asp:Literal ID="UpcomingLit" runat="server" />
                    </table>
                    
                </div>
            </div>

        </div>
        <div class="col-md-4">

            


            <div class="inputBox">
                <div class="header"><i class="fas fa-users"></i> Recent Registrations</div>
                <div class="content">
                    <div class="input-group">
                        <asp:TextBox ID="SearchText" runat="server" CssClass="form-control" placeholder="Search" />
                        <div class="input-group-append"><asp:Button ID="SearchButton" runat="server" CssClass="btn btn-primary" Text="Search Sites" OnClick="SearchButton_Click" /></div>
                    </div>
                    <table class="table table-sm" style="margin-top:20px;">
                        <tr><th>Site</th><th>Action</th></tr>
                        <asp:Repeater ID="SiteRepeater" runat="server" OnItemCommand="SiteRepeater_ItemCommand" OnItemDataBound="SiteRepeater_ItemDataBound">
                            <ItemTemplate>
                                <tr>
                                    <td><a href="https://<%#Eval("KeyName")%>.streaminglive.church/"><%#Eval("KeyName")%></a></td>
                                    <td><asp:LinkButton ID="AccessLink" runat="server" CommandName="Access"><i class="fas fa-sign-in-alt"></i></asp:LinkButton></td>
                                </tr>
                            </ItemTemplate>
                        </asp:Repeater>
                    </table>
                </div>
            </div>

        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
</asp:Content>
