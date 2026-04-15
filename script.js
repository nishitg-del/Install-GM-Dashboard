Promise.all([
  fetch('https://opensheet.elk.sh/1Y6iwc9uI52vs5aTZa4c1c55b93J-h3qh5oQIKPJMkF0/BOM').then(r => r.json()),
  fetch('https://opensheet.elk.sh/1Y6iwc9uI52vs5aTZa4c1c55b93J-h3qh5oQIKPJMkF0/Master Summary1').then(r => r.json()),
  fetch('https://opensheet.elk.sh/YOUR_ID/GRN').then(r => r.json()),
  fetch('https://opensheet.elk.sh/YOUR_ID/Booking Data').then(r => r.json())
])
.then(([bom, master, grn, booking]) => {

  let projects = {};

  // Revenue
  master.forEach(r => {
    projects[r["Project ID"]] = {
      revenue: parseFloat(r["Booking Value"]) || 0,
      designCost: 0,
      installCost: 0
    };
  });

  // Design Cost
  bom.forEach(r => {
    let id = r["Project ID"];
    let amt = parseFloat(r["Amount"]) || 0;
    if (projects[id]) projects[id].designCost += amt;
  });

  // Install Cost
  grn.forEach(r => {
    let id = r["Project ID"];
    let amt = parseFloat(r["Actual Cost"]) || 0;
    if (projects[id]) projects[id].installCost += amt;
  });

  // Calculate GM
  let labels = [];
  let designGM = [];
  let installGM = [];

  Object.keys(projects).forEach(id => {
    let p = projects[id];

    let dgm = ((p.revenue - p.designCost) / p.revenue) * 100;
    let igm = ((p.revenue - p.installCost) / p.revenue) * 100;

    labels.push(id);
    designGM.push(dgm);
    installGM.push(igm);
  });

  // Chart
  new Chart(document.getElementById('myChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Design GM %', data: designGM },
        { label: 'Install GM %', data: installGM }
      ]
    }
  });

});
