var args;
var MystatsData =
  MystatsData ||
  (function () {
    return {
      init: function (Arg) {
        var args = JSON.parse(Arg.replace(/&quot;/g, '"'));
        console.log(args);
      },
      helloWorld: function () {
        var temp = args.toString();
        console.log(temp);
      },
    };
  })();

var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["item1", "item2", "item3"],
    datasets: [
      {
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        data: [10, 10, 50],
      },
    ],
  },
  // options: {
  //     scales: {
  //         y: {
  //             beginAtZero: true
  //         }
  //     }
  // }
});

var ctx2 = document.getElementById("myChart2").getContext("2d");
var myChart2 = new Chart(ctx2, {
  type: "doughnut",

  data: {
    labels: ["item1", "item2", "item3"],
    datasets: [
      {
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        data: [10, 10, 10],
      },
    ],
  },
  // options: {
  //     scales: {
  //         y: {
  //             beginAtZero: true
  //         }
  //     }
  // }
});
