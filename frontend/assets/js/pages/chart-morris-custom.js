'use strict';
$(document).ready(function() {
    setTimeout(function() {
    // [ bar-stacked ] chart start
    Morris.Bar({
        element: 'morris-bar-stacked-chart',
        data: [{
                y: 'ENERO',
                a: 50,
            },
            {
                y: 'FEBRERO',
                a: 75,
            },
            {
                y: 'MARZO',
                a: 50,
            },
            {
                y: 'ABRIL',
                a: 75,
            },
            {
                y: 'MAYO',
                a: 100,
            },
            {
                y: 'JUNIO',
                a: 75,
            },
            {
                y: 'JULIO',
                a: 100,
            },
            {
                y: 'AGOSTO',
                a: 75,
            },
            {
                y: 'SEPTIEMBRE',
                a: 100,
            },
            {
                y: 'OCTUBRE',
                a: 75,
            },
            {
                y: 'NOVIEMBRE',
                a: 100,
            },
            {
                y: 'DICIEMBRE',
                a: 75,
            }
        ],
        xkey: 'y',
        stacked: true,
        barSizeRatio: 0.50,
        barGap: 3,
        resize: true,
        responsive:true,
        ykeys: ['a'],
        labels: ['Consultas'],
        barColors: ["0-#487aa1-#7c8071"]
    });
    // [ bar-stacked ] chart end

    
    // [ Donut-chart ] end
        }, 700);
});
