<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/CpFixed.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="StreamingLiveWeb.CP.Host.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link rel="stylesheet" href="/css/player.css" >
    <link rel="stylesheet" href="/css/host.css" >
   
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div style="display:flex;flex-direction:column;height:100%;">
        <h1 style="flex:0 0 0px;"><i class="fas fa-praying-hands"></i> Host Dashboard</h1>
    
        
        <div id="flexContainer" style="flex: 1 1 0%;">
            <div class="flex1">
                <div class="inputBox">
                    <div class="header"><i class="far fa-comments"></i> Public Chat</div>
                    <div id="chatContainer" class="content chatContainer">
                        <div id="callout"></div>
                        <div id="chatReceive" class="chatReceive"></div>
                        <div id="chatSend" class="chatSend">
                            <div class="input-group">
                                <div class="input-group-prepend"><a href="javascript:void();" data-field="sendText" class="btn btn-outline-secondary emojiButton" data-container="#chatContainer">😀</a></div>
                                <input type="text" class="form-control" id="sendText" />
                                <div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:sendMessage();">Send</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex1">
                <div class="inputBox">
                    <div class="header"><i class="fas fa-praying-hands"></i> Prayer Requests</div>
                    <div class="content">
                        <p id="noPrayerRequests">There are no current prayer requests</p>
                        <div id="prayerRequests">

                        </div>
                    </div>
                </div>
                <div id="noPrayerChat" style="flex: 1 1 0%;margin-bottom:30px;"></div>
                <div class="inputBox" style="display:none;" id="prayerChat">
                    <div class="header"><i  class="fas fa-praying-hands"></i> <span id="privatePrayerTitle">Private Prayer</span></div>
                    <div id="prayerContainer" class="content chatContainer">
                        <div id="prayerReceive" class="chatReceive">
                        </div>
                        <div id="sendPrivate" class="chatSend">
                            <div class="input-group">
                                <div class="input-group-prepend"><a href="javascript:void();" data-field="sendPrivateText" class="btn btn-outline-secondary emojiButton" data-container="#prayerContainer">😀</a></div>
                                <input type="text" class="form-control" id="sendPrivateText" />
                                <div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:sendPrivate();">Send</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex1">
                <div class="inputBox" id="videoBox">
                    <div class="header"><i class="fas fa-video"></i> Video</div>
                    <div class="content" style="display:flex;flex-direction:column;">
                        <div id="videoContainer" style="flex:1 1 0px;">
                            <iframe id="videoFrame" src="about:blank" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                            <div id="noVideoContent"><span id="noVideoCell"></span></div>
                        </div>
                        <div class="form-group" style="flex:0 0 0px; padding-top:10px;">
                            <label>Call Out Message</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="calloutText" />
                                <div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:setCallout();">Set</a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="inputBox">
                    <div class="header"><i class="fas fa-comments"></i> Private Host Chat</div>
                    <div id="hostChatContainer" class="content chatContainer">
                        <div id="hostChatReceive" class="chatReceive">
                        </div>
                        <div id="hostChatSend" class="chatSend">
                            <div class="input-group">
                                <div class="input-group-prepend"><a href="javascript:void();" data-field="hostSendText" class="btn btn-outline-secondary emojiButton" data-container="#hostChatContainer">😀</a></div>
                                <input type="text" class="form-control" id="hostSendText" />
                                <div class="input-group-append"><a class="btn btn-primary" style="border-radius:0px" href="javascript:sendHostMessage();">Send</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
    <script src="/js/player.js"></script>
    <script src="/js/host.js"></script>
    <script>
        keyName = '<%=KeyName%>';
        var displayName = '<%=StreamingLiveWeb.AppUser.Current.UserData.DisplayName%>';
        $(function () {
            init();
            initPlayer();
        });
    </script>
    
</asp:Content>
