<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Traffic.ascx.cs" Inherits="StreamingLiveWeb.CP.Controls.Traffic" %>
<div class="inputBox">
    <div class="header"><i class="fas fa-chart-area"></i> Traffic</div>
    <div class="content">
        <asp:PlaceHolder ID="ChartHolder" runat="server">
            <div id="chart_div"></div>
            <!--Load the AJAX API-->
            <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
            <script type="text/javascript">
                google.charts.load('current', { 'packages': ['corechart'] });
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                    var data = google.visualization.arrayToDataTable([
                        ['Grouping', 'Sessions', { role: 'annotation' }],
                       <%=ChartOutput%>
                    ]);

                    var options = {
                        height: 400,
                        legend: { position: 'top', maxLines: 3 },
                        bar: { groupWidth: '75%' },
                        isStacked: true,
                    };

                    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
                    chart.draw(data, options);
                }
            </script>
        </asp:PlaceHolder>


    </div>
</div>