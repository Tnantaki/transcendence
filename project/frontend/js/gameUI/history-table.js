import { getMatchHistory } from "../services/gameService.js";
import { getProfile } from "../services/profileService.js";

fetchHistoryData()

async function fetchHistoryData() {
	const matches = await getMatchHistory()
	if (!matches) return
	listHistory(matches)
}

function listHistory(matches) {
	const matchHistoryTable = document.getElementById('match-history-table');

  matches.forEach(async match => {
		const { date } = convertDate(match.created);
		const player_1 = await getProfile(match.player_1)
		const player_2 = await getProfile(match.player_2)

    const item = document.createElement("li");
    item.classList.add("row", "table-list-item");
    item.innerHTML = `
			<div id="my-profile" class="col-1 player-item-picture">
				<img src="/api${player_1.profile}" alt="profile-picture">
			</div>
			<div class="col-2 player-item-content friend-name" data-bs-toggle="modal" data-bs-target="#profileModal"
				onclick="getProfileById('${player_1.id}')">${player_1.display_name}</div>
			<div class="col player-item-content">${match.player_1_score} : ${match.player_2_score}</div>
			<div id="friend-profile" class="col-1 player-item-picture">
				<img src="/api${player_2.profile}" alt="profile-picture">
			</div>
			<div class="col-2 player-item-content friend-name" data-bs-toggle="modal" data-bs-target="#profileModal"
				onclick="getProfileById('${player_2.id}')">${player_2.display_name}</div>
			<div class="col-3 player-item-content">${date}</div>
			<div class="table-item-background"></div>
    `
    matchHistoryTable.appendChild(item);
  })
}

function convertDate(apiTime) {
	const bangkokTime = new Date(apiTime).toLocaleString("en-GB", {
		timeZone: "Asia/Bangkok",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false, // Use 24-hour format
	});

	const [date, time] = bangkokTime.split(", ")
	return {date, time}
}