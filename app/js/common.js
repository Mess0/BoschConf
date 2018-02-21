import {Line,mixins} from 'vue-chartjs'



const data = 'data.json';
let chartData = [];

// labels: ["begin", "end"],
//     datasets: [
//     {
//         label: 'Sensor 1',
//         backgroundColor: '#f87979',
//         data: chartData
//     }
// ]


let fetchApi = fetch(data)
    .then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }

            // Examine the text in the response
            response.json().then(function (resdata) {
                chartData = resdata.sensor.map(function (value) {
                    return value.y;
                });
                updateChartData();
            });
        }
    )
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    });
console.log(data);

Vue.component('line-chart', {
    extends: Line,
    mixins: [mixins.reactiveProp],
    methods: {
        updateChartData() {
            this.chartData = chartData;
        }
    },
    mounted() {
        this.renderChart(this.chartData, {responsive: true, maintainAspectRatio: false})
    }

});


setTimeout(function () {
    chartData.push(10);
    console.log(chartData);
}, 1);

//INIT
const vm = new Vue({
    el: '.app',
});
