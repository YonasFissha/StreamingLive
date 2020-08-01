<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPages/ControlPanel.master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="StreamingLiveWeb.CP.Reports.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <h1><i class="fas fa-chart-area"></i> Stream Traffic</h1>

    <div class="row">
        <div class="col-md-8">
            <div class="inputBox">
                <div class="header"><i class="fas fa-chart-area"></i> Traffic</div>
                <div class="content">
                    <asp:PlaceHolder ID="ChartHolder" runat="server" Visible="false">
                        <div id="chart_div"></div>
                        <!--Load the AJAX API-->
                        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
                        <script type="text/javascript">
                            google.charts.load('current', { 'packages': ['corechart'] });
                            google.charts.setOnLoadCallback(drawChart);
                            function drawChart() {
                                var data = google.visualization.arrayToDataTable([
                                    ['Grouping', 'Viewers'],
                                   <%=ChartOutput%>
                                ]);

                                var options = {
                                    height: 400,
                                    legend: { position: 'top', maxLines: 3 },
                                    bar: { groupWidth: '75%' }
                                };

                                var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
                                chart.draw(data, options);
                            }
                        </script>
                    </asp:PlaceHolder>
                    <asp:Literal ID="NoChartLit" runat="server"><p>No data.  Check back after hosting your first service.</p></asp:Literal>
                </div>
            </div>
        </div>





        <div class="col-md-4">
            <div class="inputBox">
                <div class="header"><i class="far fa-calendar-alt"></i> Recent Services</div>
                <div class="content">
                    <table class="table table-sm">
                        <tr><th>Date</th><th>Start</th><th>End</th></tr>
                        <asp:Repeater ID="ServiceRepeater" runat="server" OnItemCommand="ServiceRepeater_ItemCommand" OnItemDataBound="ServiceRepeater_ItemDataBound">
                            <ItemTemplate>
                                <tr>
                                    <td><%#Eval("StartTime", "{0:M/d/yyyy}")%></td>
                                    <td><asp:LinkButton ID="TimeLink" runat="server" CommandName="Show" /></td>
                                    <td><%#Eval("EndTime", "{0:h:mm tt}")%></td>
                                </tr></ItemTemplate>
                        </asp:Repeater>
                    </table>
                </div>
            </div>
        </div>
    </div>

    
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ScriptBlock" runat="server">
</asp:Content>
