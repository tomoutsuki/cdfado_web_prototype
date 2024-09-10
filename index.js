// =====================
//       SETTINGS
const playerTurn = 3;
const playerAmount = 4;

const activeColor = "#3e4132";
const disableColor = "#21221c";

// =====================
//        GLOBAL
let turn = 0;
let actionDone = false;

// =====================

const handElement = document.getElementById("hand");
const cardModal = document.getElementById("card");

const playerDivElements = [
	document.getElementById("p1"),
	document.getElementById("p2"),
	document.getElementById("p3"),
	document.getElementById("p4"),
];

const playerTitleElements = [
	document.getElementById("p1_name"),
	document.getElementById("p2_name"),
	document.getElementById("p3_name"),
	document.getElementById("p4_name"),
];

const playerStarElements = [
	document.getElementById("p1_star"),
	document.getElementById("p2_star"),
	document.getElementById("p3_star"),
	document.getElementById("p4_star"),
];

playerTitleElements[0].innerHTML = "Jo Soares";
playerTitleElements[1].innerHTML = "Carlinhos";
playerTitleElements[2].innerHTML = "Belzebul";
playerTitleElements[3].innerHTML = "Castelo Branco";

let players = [
	{
		name: "Jo Soares",
		lp: 3,
		inf: 2,
		hand: ["Justiça"]
	},
	{
		name: "Carlinhos",
		lp: 3,
		inf: 2,
		hand: ["Justiça"]
	},
	{
		name: "Belzebul",
		lp: 3,
		inf: 2,
		hand: ["Justiça"]
	},
	{
		name: "Castelo Branco",
		lp: 3,
		inf: 2,
		hand: ["Justiça","Discurso","Imposto","Imposto"]
	}
];

let cards;
await fetch("./cards.json")
	.then((res) => {
		if (!res.ok) {
			throw new Error
				(`HTTP error! Status: ${res.status}`);
		}
		return res.json();
	})
	.then((data) => 
		cards = data)
	.catch((error) => 
		console.error("Unable to fetch data:", error));


GameLoop();

async function GameLoop () {
	let isGame 	= true;
	let i = 0;


	while (isGame) {
		if (turn >= playerAmount) turn = 0;
		playerDivElements[turn].style.backgroundColor = activeColor;
		RenderCards();
		ReloadCards();


		console.log(`Turn: ${turn}`);
		await sleep(4000);

		actionDone = false;
		playerDivElements[turn].style.backgroundColor = disableColor;


		turn++; i++;
		
		UpdateStar();
		if (i > 10) isGame=false;
		
	}
}



function ReloadCards() {
	let cardElements = document.getElementsByClassName("card");
	
	for (let card of cardElements) {
		card.addEventListener("click", () => {
			if (turn != playerTurn) return;
			if (actionDone) return;
			
			actionDone = true;
			let raw = card.className;
			let com = raw.split(' ');
			let cardName = com[1];

			let effects = cards[cardName].effects;
			
			for (let effect of effects) {
				let com = effect.split(' ');
				let effectName = com[0];
				let effectAmount = com[1];
				
				ExecuteEffect(effectName, effectAmount);
			}
		});
	}
}

function RenderCards() {
	EraseCards();
	let df = document.createDocumentFragment();
	for (let card of players[turn].hand) {
		let cardElement = cardModal.cloneNode(true);
		let cardImg = cardElement.children[0];
		let cardObject = cards[card];

		cardElement.style.display = "flex";
		cardElement.className = `card ${cardObject.name}`;
		cardElement.id = "";
		
		
		console.log(cardImg);
		cardImg.src = cardObject.image;
		cardImg.id = "";

		handElement.appendChild(cardElement.cloneNode(true));
		
		console.log(cardElement);
	}
}

function EraseCards() {
	handElement.innerHTML = '';
}

async function ExecuteEffect(name, amount) {
	switch (name) {
		case "add":
			console.log(`Adicionou ${amount} de influência`);
			players[turn].inf += parseInt(amount);
			break;
			
		case "damage":
			console.log(`Deu ${amount} de dano`);
			break;
	}

	// Delay, display process
}

async function UpdateStar() {
	for (let [index, element] of playerStarElements.entries()) {
		let star = players[index].inf;
		element.innerHTML = "♦".repeat(star);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}