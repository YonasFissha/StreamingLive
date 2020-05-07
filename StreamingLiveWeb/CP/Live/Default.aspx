<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/ControlPanel.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="StreamingLiveWeb.CP.Live.Default" MaintainScrollPositionOnPostback="true" ValidateRequest="false" %>
<%@ Register src="../Controls/TabEditor.ascx" tagname="TabEditor" tagprefix="uc1" %>
<%@ Register src="../Controls/ButtonEditor.ascx" tagname="ButtonEditor" tagprefix="uc1" %>
<%@ Register src="../Controls/AppearanceEditor.ascx" tagname="AppearanceEditor" tagprefix="uc1" %>
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
                            <asp:Repeater ID="ServiceRepeater" runat="server" OnItemCommand="ServiceRepeater_ItemCommand" OnItemDataBound="ServiceRepeater_ItemDataBound" >
                                <ItemTemplate>
                                    <tr>
                                        <td><asp:Literal ID="ServiceTimeLit" runat="server" /></td>
                                        <td class="text-right"><asp:LinkButton ID="EditButton" runat="server" CommandName="Edit"><i class="fas fa-pencil-alt"></i></asp:LinkButton></td>
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
                                    <asp:HiddenField ID="ServiceIdHid" runat="server" />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label>Total Service Duration</label>
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
                                    <label>Enable Chat and Prayer</label>
                                    <div class="row">
                                        <div class="col">
                                            <div class="input-group">
                                                <asp:TextBox ID="ChatBeforeText" runat="server" TextMode="number" CssClass="form-control" min="0" step="1" />
                                                <div class="input-group-append"><label class="input-group-text">min before</label></div>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <div class="input-group">
                                                <asp:TextBox ID="ChatAfterText" runat="server" TextMode="number" CssClass="form-control" min="0" step="1" max="59" />
                                                <div class="input-group-append"><label class="input-group-text">min after</label></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label>Start Video Early <span class="description"> (Optional) For videos with countdowns</span></label>
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
                        </div>
                    
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label>Video Provider</label>
                                    <asp:DropDownList ID="ProviderList" runat="server" CssClass="form-control" AutoPostBack="true" OnSelectedIndexChanged="ProviderList_SelectedIndexChanged">
                                        <asp:ListItem Value="youtube_live" Text="YouTube" OptionGroup="Live Stream" />
                                        <asp:ListItem Value="vimeo_live" Text="Vimeo" OptionGroup="Live Stream" />
                                        <asp:ListItem Value="facebook_live" Text="Facebook" OptionGroup="Live Stream" />
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
                                        <label>YouTube Video ID <span class="description">Ex: https://www.youtube.com/watch?v=<b>abcd1234</b></span></label>
                                        <asp:TextBox ID="YouTubeKeyText" runat="server" CssClass="form-control" Placeholder="abcd1234" />
                                    </div>
                                </div>
                            </asp:PlaceHolder>
                            <asp:PlaceHolder ID="VimeoHolder" runat="server" Visible="false">
                                <div class="col">
                                    <div class="form-group">
                                        <label>Vimeo ID <span class="description">Ex: https://vimeo.com/<b>123456789</b></span></label>
                                        <asp:TextBox ID="VimeoKeyText" runat="server" CssClass="form-control" Placeholder="123456789" />
                                    </div>
                                </div>
                            </asp:PlaceHolder>
                            <asp:PlaceHolder ID="FacebookHolder" runat="server" Visible="false">
                                <div class="col">
                                    <div class="form-group">
                                        <label>Facebook Video ID <span class="description">Ex: https://facebook.com/video.php?v=<b>123456789</b></span></label>
                                        <asp:TextBox ID="FacebookKeyText" runat="server" CssClass="form-control" Placeholder="123456789" />
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
            <uc1:AppearanceEditor runat="server" Id="AppearanceEditor1" />
            <uc1:ButtonEditor runat="server" Id="ButtonEditor1" />
            <uc1:TabEditor runat="server" Id="TabEditor1" />
        </div>
    </div>
    <asp:HiddenField ID="TZOffsetHid" runat="server" />
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
    
    <script>
        $(function () {
            $('#<%=TZOffsetHid.ClientID%>').val(new Date().getTimezoneOffset().toString());
        });
    </script>

    <asp:PlaceHolder ID="UpdateConfigHolder" runat="server" Visible="false">
        <script>
            socket = new WebSocket('wss://lr6pbsl0ji.execute-api.us-east-2.amazonaws.com/production');
            socket.onopen = function (e) {
                socket.send(JSON.stringify({ 'action': 'updateConfig', 'room': '<%=StreamingLiveWeb.AppUser.Current.Site.KeyName%>' }));
            };
        </script>
    </asp:PlaceHolder>


</asp:Content>

