document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) {
	  return;
  };

  const f_reader = new FileReader();
  f_reader.onload = function(e) {
    const content = e.target.result;
    const transactions = parse(content);
    const result = transform_data(transactions);
    document.getElementById('output').textContent = JSON.stringify(result, null, 2);
  };
  f_reader.readAsText(file);
});

function parse(content) {
  return JSON.parse(content
    .replace(/(\w+):/g, '"$1":')
    .replace(/'/g, '"')
	);
}

function transform_data(transactions) {
  return transactions
    .filter(t => t.state === "canceled")
    .sort((a, b) => b.createdAt - a.createdAt)
    .reduce((acc, { year, amount, createdAt, customerName }) => {
      const year_k = year.toString();
      acc[year_k] = acc[year_k] || [];
      acc[year_k].push({ amount, createdAt, customerName });
      return acc;
    }, {});
}