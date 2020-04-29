<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ButtonEditor.ascx.cs" Inherits="StreamingLiveWeb.CP.Controls.ButtonEditor" %>
<asp:PlaceHolder ID="ButtonListHolder" runat="server">
    <div class="inputBox">
        <div class="header"><div class="float-right"><asp:LinkButton ID="AddButtonLink" runat="server" OnClick="AddButtonLink_Click"><i class="fas fa-plus"></i></asp:LinkButton></div> <i class="far fa-square"></i> Buttons</div>
        <div class="content">
            <table class="table table-sm">
                <asp:Literal ID="ButtonsLit" runat="server" />
                <asp:Repeater ID="ButtonRepeater" runat="server" OnItemCommand="ButtonRepeater_ItemCommand" OnItemDataBound="ButtonRepeater_ItemDataBound" >
                    <ItemTemplate>
                        <tr>
                            <td><a href="<%#Eval("Url")%>" target="_blank"><%#Eval("Text")%></a></td>
                            <td class="text-right">
                                <asp:LinkButton ID="UpButton" runat="server" CommandName="Up"><i class="fas fa-arrow-up"></i></asp:LinkButton>
                                <asp:LinkButton ID="DownButton" runat="server" CommandName="Down"><i class="fas fa-arrow-down"></i></asp:LinkButton>
                                <asp:LinkButton ID="EditButton" runat="server" CommandName="Edit"><i class="fas fa-pencil-alt"></i></asp:LinkButton>
                            </td>
                        </tr>
                    </ItemTemplate>
                </asp:Repeater>
            </table>
        </div>
    </div>
</asp:PlaceHolder>
<asp:PlaceHolder ID="ButtonEditHolder" runat="server" Visible="false">
    <div class="inputBox">
        <div class="header"><i class="far fa-square"></i> Edit Button</div>
        <div class="content">
            <div class="form-group">
                <label>Text</label>
                <asp:TextBox ID="ButtonTextText" runat="server" CssClass="form-control" />
                <asp:HiddenField ID="ButtonIndexHid" runat="server" />
            </div>
            <div class="form-group">
                <label>Url</label>
                <asp:TextBox ID="ButtonUrlText" runat="server" CssClass="form-control" />
            </div>
        </div>
        <div class="footer">
            <div class="row">
                <asp:PlaceHolder ID="DeleteButtonHolder" runat="server"><div class="col"><asp:Button ID="DeleteButtonButton" runat="server" CssClass="btn btn-danger btn-block" Text="Delete" OnClick="DeleteButtonButton_Click" /></div></asp:PlaceHolder>
                <div class="col"><asp:Button ID="CancelButtonButton" runat="server" CssClass="btn btn-warning btn-block" Text="Cancel" OnClick="CancelButtonButton_Click" /></div>
                <div class="col"><asp:Button ID="SaveButtonButton" runat="server" CssClass="btn btn-primary btn-block" Text="Save" OnClick="SaveButtonButton_Click" /></div>
            </div>
        </div>
    </div>
</asp:PlaceHolder>