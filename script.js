$(document).ready(function() {

    var rawData = $.getJSON("https://f0ud2aqo45.execute-api.us-west-2.amazonaws.com/test", gotData, "jsonp");

    function gotData(data) {
        datePlot = data.date;
        ratePlot = data.rate;

        var datePlotArray = [];
        var ratePlotArray = [];
        var rateExpressPlotArray = [];

        for (var i = 0; i < datePlot.length; i++) {
            datePlotArray.push(datePlot[i]);
            ratePlotArray.push((Math.max.apply(null, ratePlot[i])));
            rateExpressPlotArray.push((Math.min.apply(null, ratePlot[i])));
        }

        new Chart(document.getElementById("line-chart"), {
            type: "line",
            data: {
                labels: datePlotArray,
                datasets: [{
                    data: ratePlotArray,
                    label: "Rate",
                    borderColor: "#3e95cd",
                    fill: true,
                    lineTension: 0.25
                }, {
                    data: rateExpressPlotArray,
                    label: "Express Rate",
                    borderColor: "#8e5ea2",
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                title: {
                    display: true,
                    text: "Remitly USD To INR"
                }
            }
        });
    }
});