fetch('data.json')
  .then(response => response.json())
  .then(data => {
    new Chart(document.getElementById('myChart'), {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Values',
          data: data.values
        }]
      }
    });
  });
