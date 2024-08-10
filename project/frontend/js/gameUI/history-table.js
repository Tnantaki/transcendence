const matchHistoryTable = document.getElementById('match-history-table');
const numberOfMatches = 6;

for (let i = 0; i < numberOfMatches; i++) {
	const matchRow = `
		<div class="row align-items-center mb-5 ">
			<div class="col-3">player_name${i + 1}</div>
			<div class="col">0 : 0</div>
			<div class="col-3">player2_name${i + 1}</div>
			<div class="col-3">11/07/2024</div>
			<div class="col">01:01</div>
		</div>
		`;
	matchHistoryTable.innerHTML += matchRow;
}