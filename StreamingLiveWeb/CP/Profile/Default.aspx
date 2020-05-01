<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/ControlPanel.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="StreamingLiveWeb.CP.Profile.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h1><i class="fas fa-user"></i> My Profile</h1>
    <div class="row">
        <div class="col-md-8">
            <asp:Literal ID="OutputLit" runat="server" />
            <div class="inputBox">
                <div class="header"><i class="fas fa-users"></i> Edit Profile</div>
                <div class="content">
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label>Name</label>
                                <asp:TextBox ID="NameText" runat="server" CssClass="form-control" />
                                <asp:HiddenField ID="UserIdHid" runat="server" />
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label>Email</label>
                                <asp:TextBox ID="EmailText" runat="server" CssClass="form-control" />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label>Password</label>
                                <asp:TextBox ID="PasswordText" runat="server" CssClass="form-control" TextMode="Password" />
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label>Confirm Password</label>
                                <asp:TextBox ID="PasswordConfirm" runat="server" CssClass="form-control" TextMode="Password" />
                            </div>
                        </div>

                    </div>
                </div>
                <div class="footer">
                    <div class="row">
                        <div class="col"><asp:Button ID="SaveButton" runat="server" CssClass="btn btn-primary btn-block" Text="Save" OnClick="SaveButton_Click" /></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
</asp:Content>
