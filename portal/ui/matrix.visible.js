export function renderMatrix() {
  document.getElementById("main").innerHTML = `
    <h2>MATRIX</h2>
    <p>Deterministic spreadsheet engine.</p>
    <table border="1" cellpadding="5">
      <tr><th>A</th><th>B</th></tr>
      <tr><td>1</td><td>2</td></tr>
    </table>
  `;
}
