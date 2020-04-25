<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/ControlPanel.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="StreamingLiveWeb.CP.Live.Default" MaintainScrollPositionOnPostback="true" ValidateRequest="false" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>
        #previewWrapper
        {
            width:100%;
            height:500px;
            overflow:hidden;
        }
        #previewFrame {
            width:200%;
            height:1000px;
            -ms-transform: scale(0.5);
            -moz-transform: scale(0.5);
            -o-transform: scale(0.5);
            -webkit-transform: scale(0.5);
            transform: scale(0.5);

            -ms-transform-origin: 0 0;
            -moz-transform-origin: 0 0;
            -o-transform-origin: 0 0;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row" style="margin-bottom:25px;">
        <div class="col"><h1 style="border-bottom:0px;margin-bottom:0px;"><i class="fas fa-video"></i> Live Stream</h1></div>
        <div class="col text-right"><asp:Button ID="PublishButton" runat="server" CssClass="btn btn-primary btn-lg" Text="Publish Changes" OnClick="PublishButton_Click" /></div>
    </div>
    
    <div class="row">
        <div class="col-md-8">
            
            <div class="inputBox">
                <div class="header"><i class="far fa-calendar-alt"></i> Preview</div>
                <div class="content">
                    <div id="previewWrapper">
                        <iframe id="previewFrame" src="<%=PreviewUrl %>"></iframe>
                    </div>
                    <asp:Literal ID="LiveLinkLit" runat="server" />
                </div>
            </div>

            <asp:PlaceHolder ID="ServiceListHolder" runat="server">
                <div class="inputBox">
                    <div class="header"><div class="float-right"><asp:LinkButton ID="AddServiceLink" runat="server" OnClick="AddServiceLink_Click"><i class="fas fa-plus"></i></asp:LinkButton></div>  <i class="far fa-calendar-alt"></i> Services</div>
                    <div class="content">
                        <table class="table table-sm">
                            <asp:Literal ID="ServicesLit" runat="server" />
                            <asp:Repeater ID="ServiceRepeater" runat="server" OnItemCommand="ServiceRepeater_ItemCommand" >
                                <ItemTemplate>
                                    <tr>
                                        <td><%#Eval("serviceTime")%></td>
                                        <td class="text-right"><asp:LinkButton ID="EditLink" runat="server" CommandName="Edit"><i class="fas fa-pencil-alt"></i></asp:LinkButton></td>
                                    </tr>
                                </ItemTemplate>
                            </asp:Repeater>
                        </table>
                        <asp:Literal ID="NoServicesLit" runat="server" Visible="false"><p>No services have been added.  Click the plus button above to begin.</p></asp:Literal>
                    </div>
                </div>
            </asp:PlaceHolder>

            <asp:PlaceHolder ID="ServiceEditHolder" runat="server" Visible="false">
                <div class="inputBox">
                    <div class="header"><i class="far fa-calendar-alt"></i> Edit Service</div>
                    <div class="content">
                        <asp:Literal ID="ServiceOutputLit" runat="server" />

                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label>Service Time</label>
                                    <asp:TextBox ID="CountdownTimeText" runat="server" TextMode="DateTimeLocal" CssClass="form-control" />
                                    <asp:HiddenField ID="ServiceIndexHid" runat="server" />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label>Start Early<span class="description">For videos with countdowns</span></label>
                                    <div class="row">
                                        <div class="col">
                                            <div class="input-group">
                                                <asp:TextBox ID="EarlyStartMinText" runat="server" TextMode="number" CssClass="form-control" min="0" step="1" />
                                                <div class="input-group-append"><label class="input-group-text">min</label></div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div class="input-group">
                                                <asp:TextBox ID="EarlyStartSecText" runat="server" TextMode="number" CssClass="form-control" min="0" step="1" max="59" />
                                                <div class="input-group-append"><label class="input-group-text">sec</label></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label>Duration</label>
                                    <div class="row">
                                        <div class="col">
                                            <div class="input-group">
                                                <asp:TextBox ID="DurationMinText" runat="server" TextMode="number" CssClass="form-control" min="0" step="1" />
                                                <div class="input-group-append"><label class="input-group-text">min</label></div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div class="input-group">
                                                <asp:TextBox ID="DurationSecText" runat="server" TextMode="number" CssClass="form-control" min="0" step="1" max="59" />
                                                <div class="input-group-append"><label class="input-group-text">sec</label></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label>Video Provider</label>
                                    <asp:DropDownList ID="ProviderList" runat="server" CssClass="form-control" AutoPostBack="true" OnSelectedIndexChanged="ProviderList_SelectedIndexChanged">
                                        <asp:ListItem Value="youtube_live" Text="YouTube" OptionGroup="Live Stream" />
                                        <asp:ListItem Value="vimeo_live" Text="Vimeo" OptionGroup="Live Stream" />
                                        <asp:ListItem Value="custom_live" Text="Custom Embed Url" OptionGroup="Live Stream" />
                                        <asp:ListItem Value="youtube_watchparty" Text="YouTube" OptionGroup="Prerecorded Video" />
                                        <asp:ListItem Value="vimeo_watchparty" Text="Vimeo" OptionGroup="Prerecorded Video" />
                                        <asp:ListItem Value="custom_watchparty" Text="Custom Embed Url" OptionGroup="Prerecorded Video" />
                                    </asp:DropDownList>
                                </div>
                            </div>
                            <asp:PlaceHolder ID="VideoEmbedHolder" runat="server" Visible="false">
                                <div class="col">
                                    <div class="form-group">
                                        <label>Video Embed Url</label>
                                        <asp:TextBox ID="VideoUrlText" runat="server" CssClass="form-control" Placeholder="https://yourprovider.com/yoururl/" />
                                    </div>
                                </div>
                            </asp:PlaceHolder>
                            <asp:PlaceHolder ID="YouTubeHolder" runat="server" Visible="false">
                                <div class="col">
                                    <div class="form-group">
                                        <label>YouTube Key <span class="description">Ex: https://www.youtube.com/watch?v=<b>abcd1234</b></span></label>
                                        <asp:TextBox ID="YouTubeKeyText" runat="server" CssClass="form-control" Placeholder="abcd1234" />
                                    </div>
                                </div>
                            </asp:PlaceHolder>
                            <asp:PlaceHolder ID="VimeoHolder" runat="server" Visible="false">
                                <div class="col">
                                    <div class="form-group">
                                        <label>Vimeo Key <span class="description">Ex: https://vimeo.com/<b>123456789</b></span></label>
                                        <asp:TextBox ID="VimeoKeyText" runat="server" CssClass="form-control" Placeholder="123456789" />
                                    </div>
                                </div>
                            </asp:PlaceHolder>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="row">
                            <asp:PlaceHolder ID="DeleteServiceHolder" runat="server"><div class="col"><asp:Button ID="DeleteServiceButton" runat="server" CssClass="btn btn-danger btn-block" Text="Delete" OnClick="DeleteServiceButton_Click" /></div></asp:PlaceHolder>
                            <div class="col"><asp:Button ID="CancelServiceButton" runat="server" CssClass="btn btn-warning btn-block" Text="Cancel" OnClick="CancelServiceButton_Click" /></div>
                            <div class="col"><asp:Button ID="SaveServiceButton" runat="server" CssClass="btn btn-primary btn-block" Text="Save" OnClick="SaveServiceButton_Click" /></div>
                        </div>
                    </div>
                </div>
            </asp:PlaceHolder>
            

            

            


        </div>
        <div class="col-md-4">


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

            <asp:PlaceHolder ID="ButtonListHolder" runat="server">
                <div class="inputBox">
                    <div class="header"><div class="float-right"><asp:LinkButton ID="AddButtonLink" runat="server" OnClick="AddButtonLink_Click"><i class="fas fa-plus"></i></asp:LinkButton></div> <i class="far fa-square"></i> Buttons</div>
                    <div class="content">
                        <table class="table table-sm">
                            <asp:Literal ID="ButtonsLit" runat="server" />
                            <asp:Repeater ID="ButtonRepeater" runat="server" OnItemCommand="ButtonRepeater_ItemCommand" >
                                <ItemTemplate>
                                    <tr>
                                        <td><a href="<%#Eval("Url")%>" target="_blank"><%#Eval("Text")%></a></td>
                                        <td class="text-right"><asp:LinkButton ID="LinkButton1" runat="server" CommandName="Edit"><i class="fas fa-pencil-alt"></i></asp:LinkButton></td>
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



            <asp:PlaceHolder ID="TabListHolder" runat="server">
                <div class="inputBox">
                    <div class="header"><div class="float-right"><asp:LinkButton ID="AddTabLink" runat="server" OnClick="AddTabLink_Click"><i class="fas fa-plus"></i></asp:LinkButton></div><i class="fas fa-folder"></i> Tabs</div>
                    <div class="content">
                        <table class="table table-sm">
                            <asp:Literal ID="TabsLit" runat="server" />
                            <asp:Repeater ID="TabRepeater" runat="server" OnItemCommand="TabRepeater_ItemCommand" >
                                <ItemTemplate>
                                    <tr>
                                        <td><a href="<%#Eval("Url")%>" target="_blank"><i class="<%#Eval("Icon")%>"></i> <%#Eval("Text")%></a></td>
                                        <td class="text-right"><asp:LinkButton ID="LinkButton2" runat="server" CommandName="Edit"><i class="fas fa-pencil-alt"></i></asp:LinkButton></td>
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
                            
                            <asp:HiddenField ID="TabIndexHid" runat="server" />
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


            

        </div>

        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
    <script>


        $(function () {
            //$('.iconpicker').iconpicker();
            $('#<%= LogoUpload.ClientID %>').change(function () { $('#<%= SaveAppearanceButton.ClientID %>').click(); });
        });

        function uploadLogo() {
            $('#<%=LogoUpload.ClientID%>')[0].click();
        }

    </script>

    <asp:PlaceHolder ID="UpdateConfigHolder" runat="server" Visible="false">
        <script>
            socket = new WebSocket('wss://i9qa0ppf43.execute-api.us-east-1.amazonaws.com/production');
            socket.onopen = function (e) {
                socket.send(JSON.stringify({ 'action': 'updateConfig', 'room': '<%=StreamingLiveWeb.AppUser.Current.Site.KeyName%>' }));
            };
        </script>
    </asp:PlaceHolder>
</asp:Content>

