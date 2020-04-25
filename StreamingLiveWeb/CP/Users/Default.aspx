<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/ControlPanel.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="StreamingLiveWeb.CP.Users.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h1><i class="fas fa-users"></i> Users</h1>
    <div class="row">
        <div class="col-md-8">
            <asp:Literal ID="OutputLit" runat="server" />
            <div class="inputBox">
                <div class="header"><i class="fas fa-users"></i> Edit User</div>
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
                                <label>Role</label>
                                <asp:DropDownList ID="RoleList" runat="server" CssClass="form-control">
                                    <asp:ListItem Value="host">Host</asp:ListItem>
                                    <asp:ListItem Value="admin">Admin</asp:ListItem>
                                </asp:DropDownList>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="footer">
                    <div class="row">
                        <asp:PlaceHolder ID="DeleteHolder" runat="server">
                            <div class="col"><asp:Button ID="DeleteButton" runat="server" CssClass="btn btn-danger btn-block" Text="Delete" OnClick="DeleteButton_Click" /></div>
                        </asp:PlaceHolder>
                        <div class="col"><asp:Button ID="SaveButton" runat="server" CssClass="btn btn-primary btn-block" Text="Save" OnClick="SaveButton_Click" /></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            <asp:PlaceHolder ID="UserListHolder" runat="server">
                <div class="inputBox">
                <div class="header"><div class="float-right"><asp:LinkButton ID="AddUserLink" runat="server" OnClick="AddUserLink_Click" ><i class="fas fa-plus"></i></asp:LinkButton></div>  <i class="fas fa-users"></i> Users</div>
                <div class="content">
                    <table class="table table-sm">
                        <tr><th>Name</th><th>Email</th><th></th></tr>
                        <asp:Repeater ID="UserRepeater" runat="server" OnItemCommand="UserRepeater_ItemCommand" OnItemDataBound="UserRepeater_ItemDataBound" >
                            <ItemTemplate>
                                <tr>
                                    <td><%#Eval("DisplayName")%></td>
                                    <td><%#Eval("Email")%></td>
                                    <td class="text-right"><asp:LinkButton ID="EditLink" runat="server" CommandName="Edit"><i class="fas fa-pencil-alt"></i></asp:LinkButton></td>
                                </tr>
                            </ItemTemplate>
                        </asp:Repeater>
                    </table>
                </div>
            </div>
            </asp:PlaceHolder>
        </div>
    </div>




</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
   
</asp:Content>
