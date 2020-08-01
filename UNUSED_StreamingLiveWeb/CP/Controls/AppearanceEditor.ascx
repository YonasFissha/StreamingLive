<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="AppearanceEditor.ascx.cs" Inherits="StreamingLiveWeb.CP.Controls.AppearanceEditor" %>
<div class="inputBox">
    <div class="header"><i class="fas fa-palette"></i> Appearance</div>
    <div class="content">
        <div class="section">Logo</div>
        <a href="javascript:uploadLogo()"><asp:Literal ID="LogoLit" runat="server" /></a>
        <asp:FileUpload ID="LogoUpload" runat="server" Style="display: none;" accept=".jpg,.png,.gif,.jpeg,.bmp" />
        <div class="form-group">
            <label>Home Page Url</label>
            <asp:TextBox ID="HomePageText" runat="server" CssClass="form-control" />
        </div>
        <div class="section">Colors</div>
        <div class="row">
            <div class="col">
                <div class="form-group">
                    <label>Primary</label>
                    <asp:TextBox ID="PrimaryColorText" runat="server" TextMode="color" value="#005288" class="form-control" />
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label>Contrast</label>
                    <asp:TextBox ID="ContrastColorText" runat="server" TextMode="color" value="#FFFFFF" class="form-control" />
                </div>
            </div>
            <div class="col">
                <div class="form-group">
                    <label>Header</label>
                    <asp:TextBox ID="HeaderColorText" runat="server" TextMode="color" value="#F1F0EC" class="form-control" />
                </div>
            </div>
        </div>
    </div>
    <div class="footer">
        <div class="row">
            <div class="col"><asp:Button ID="SaveAppearanceButton" runat="server" CssClass="btn btn-primary btn-block" Text="Save" OnClick="SaveAppearanceButton_Click" /></div>
        </div>
    </div>
</div>
<script>
    setTimeout(function () { 
        $('#<%= LogoUpload.ClientID %>').change(function () { $('#<%= SaveAppearanceButton.ClientID %>').click(); });
    }, 1000);

    function uploadLogo() {
        $('#<%=LogoUpload.ClientID%>')[0].click();
    }

</script>