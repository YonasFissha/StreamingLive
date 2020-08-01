<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="TabEditor.ascx.cs" Inherits="StreamingLiveWeb.CP.Controls.TabEditor" %>
<asp:PlaceHolder ID="TabListHolder" runat="server">
    <div class="inputBox">
        <div class="header"><div class="float-right"><asp:LinkButton ID="AddTabLink" runat="server" OnClick="AddTabLink_Click"><i class="fas fa-plus"></i></asp:LinkButton></div><i class="fas fa-folder"></i> Tabs</div>
        <div class="content">
            <table class="table table-sm">
                <asp:Literal ID="TabsLit" runat="server" />
                <asp:Repeater ID="TabRepeater" runat="server" OnItemCommand="TabRepeater_ItemCommand" OnItemDataBound="TabRepeater_ItemDataBound" >
                    <ItemTemplate>
                        <tr>
                            <td><a href="<%#Eval("Url")%>" target="_blank"><i class="<%#Eval("Icon")%>"></i> <%#Eval("Text")%></a></td>
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
<asp:PlaceHolder ID="TabEditHolder" runat="server" Visible="false">
    <div class="inputBox">
        <div class="header"><i class="fas fa-folder"></i> Edit Tab</div>
        <div class="content">
            <div class="form-group">
                <label>Text</label>
                <div class="input-group">
                    <asp:TextBox ID="TabTextText" runat="server" CssClass="form-control" />
                    <div class="input-group-append">
                        <button class="btn btn-secondary" role="iconpicker" name="TabIcon" id="TabIcon" runat="server" data-iconset="fontawesome5"></button>
                    </div>
                </div>
                            
                <asp:HiddenField ID="TabIdHid" runat="server" />
            </div>
            <div class="form-group">
                <label>Type</label>
                <asp:DropDownList ID="TabType" runat="server" CssClass="form-control" AutoPostBack="true" OnSelectedIndexChanged="TabType_SelectedIndexChanged">
                    <asp:ListItem Value="url" Text="External Url" />
                    <asp:ListItem Value="page" Text="Page" />
                    <asp:ListItem Value="chat" Text="Chat" />
                    <asp:ListItem Value="prayer" Text="Prayer" />
                </asp:DropDownList>
            </div>
            <asp:PlaceHolder ID="TabUrlHolder" runat="server">
                <div class="form-group">
                    <label>Url</label>
                    <asp:TextBox ID="TabUrlText" runat="server" CssClass="form-control" />
                </div>
            </asp:PlaceHolder>
            <asp:PlaceHolder ID="PageHolder" runat="server" Visible="false">
                <div class="form-group">
                    <label>Page</label>
                    <asp:DropDownList ID="PageList" runat="server" CssClass="form-control" DataValueField="Id" DataTextField="Name" />
                </div>
            </asp:PlaceHolder>
        </div>
        <div class="footer">
            <div class="row">
                <asp:PlaceHolder ID="DeleteTabHolder" runat="server"><div class="col"><asp:Button ID="DeleteTabButton" runat="server" CssClass="btn btn-danger btn-block" Text="Delete" OnClick="DeleteTabButton_Click" /></div></asp:PlaceHolder>
                <div class="col"><asp:Button ID="CancelTabButton" runat="server" CssClass="btn btn-warning btn-block" Text="Cancel" OnClick="CancelTabButton_Click" /></div>
                <div class="col"><asp:Button ID="SaveTabButton" runat="server" CssClass="btn btn-primary btn-block" Text="Save" OnClick="SaveTabButton_Click" /></div>
            </div>
        </div>
    </div>
</asp:PlaceHolder>


            