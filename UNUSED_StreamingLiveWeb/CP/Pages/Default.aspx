<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/ControlPanel.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="StreamingLiveWeb.CP.Pages.Default" ValidateRequest="false"  %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h1><i class="fas fa-code"></i> Pages</h1>
    <div class="row">
        <div class="col-md-8">
            <asp:PlaceHolder ID="PageListHolder" runat="server">
                <div class="inputBox">
                    <div class="header"><div class="float-right"><asp:LinkButton ID="AddPageLink" runat="server" OnClick="AddPageLink_Click"><i class="fas fa-plus"></i></asp:LinkButton></div>  <i class="fas fa-code"></i> Pages</div>
                    <div class="content">
                        
                        <table class="table table-sm">
                            <asp:Repeater ID="PageRepeater" runat="server" OnItemCommand="PageRepeater_ItemCommand" OnItemDataBound="PageRepeater_ItemDataBound" >
                                <ItemTemplate>
                                    <tr>
                                        <td><%#Eval("Name")%></td>
                                        <td class="text-right"><asp:LinkButton ID="EditLink" runat="server" CommandName="Edit"><i class="fas fa-pencil-alt"></i></asp:LinkButton></td>
                                    </tr>
                                </ItemTemplate>
                            </asp:Repeater>
                        </table>
                        <asp:Literal ID="NoPagesLit" runat="server" Visible="false"><p>Pages are designed to be a place for you to enter simple content that can be displayed within tabs on the live stream page.  Some examples would be sermon notes, bulletin information or resource links.  No pages have been added yet.  Click the plus button above to begin.</p></asp:Literal>
                    </div>
                </div>
            </asp:PlaceHolder>


            <asp:PlaceHolder ID="PageEditHolder" runat="server" Visible="false">
                <div class="inputBox">
                    <div class="header"><i class="fas fa-code"></i> Edit Page</div>
                    <div class="content">
                        <div class="form-group">
                            <label>Page Name</label>
                            <asp:TextBox ID="NameText" runat="server" CssClass="form-control" />
                            <asp:HiddenField ID="PageIdHid" runat="server" />
                        </div>
                        <div class="form-group">
                            <label>Contents</label>
                            <div id="summerNote"></div>
                            <asp:HiddenField ID="BodyHid" runat="server"  />
                        </div>
                    </div>
                    <div class="footer">
                        <div class="row">
                            <asp:PlaceHolder ID="DeleteHolder" runat="server"><div class="col"><asp:Button ID="DeleteButton" runat="server" CssClass="btn btn-danger btn-block" Text="Delete" OnClick="DeleteButton_Click" /></div></asp:PlaceHolder>
                            <div class="col"><asp:Button ID="CancelButton" runat="server" CssClass="btn btn-warning btn-block" Text="Cancel" OnClick="CancelButton_Click" /></div>
                            <div class="col"><asp:Button ID="SaveButton" runat="server" CssClass="btn btn-primary btn-block" Text="Save" OnClick="SaveButton_Click" /></div>
                        </div>
                    </div>
                </div>
            </asp:PlaceHolder>

        </div>
    </div>




</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
    <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.16/dist/summernote-bs4.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.16/dist/summernote-bs4.min.js"></script>

    <script>
        var bodyHid = $('#<%=BodyHid.ClientID%>');

        function setBodyValue() {
            var markup = $('#summerNote').eq(0).summernote('code');
            bodyHid.val(markup);
        }

        $('#summerNote').summernote({
            placeholder: 'Hello World',
            tabsize: 2,
            height: 300
        });
        $('#summerNote').summernote('code', bodyHid.val());
    </script>
</asp:Content>
