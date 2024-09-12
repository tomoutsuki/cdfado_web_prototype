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
const cardModal   = document.getElementById("card");

const dialogueModal = document.getElementById("dialogue");
const dialogueText  = document.getElementById("dialogueText");

const choiceModal = document.getElementById("choice");
const choiceText  = document.getElementById("choiceText");
const option1Text = document.getElementById("option1Text");
const option2Text = document.getElementById("option2Text");

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

playerTitleElements[0].innerHTML = "Zé Roliço";
playerTitleElements[1].innerHTML = "Carlinhos";
playerTitleElements[2].innerHTML = "Capitão Pururuca";
playerTitleElements[3].innerHTML = "Belzebul";

let players = [
	{
		name: "Zé Roliço",
		role: "medic",
		influence: 0,
		moral: 10,
		poison: 0,
		corruption: 0,
		silenceTurn: 0,
		immunityTurn: 0,

		hand: []
	},
	{
		name: "Carlinhos",
		role: "corrupt",
		influence: 0,
		moral: 10,
		poison: 0,
		corruption: 0,
		silenceTurn: 0,
		immunityTurn: 0,

		hand: []
	},
	{
		name: "Capitão Pururuca",
		role: "innocent",
		influence: 0,
		moral: 10,
		poison: 0,
		corruption: 0,
		silenceTurn: 0,
		immunityTurn: 0,

		hand: []
	},
	{
		name: "Belzebul",
		role: "innocent",
		influence: 0,
		moral: 10,
		poison: 0,
		corruption: 0,
		silenceTurn: 0,
		immunityTurn: 0,

		hand: []
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
		
		GetRandomCard();
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

		card.addEventListener("click", async () => {

			if (turn != playerTurn) return;
			if (actionDone) return;
			
			actionDone = true;
			let raw = card.className;
			let com = raw.split(' ');
			let cardName = com[1];

			let cardObject = cards[cardName];

			if (cardObject.type == "task") {

				await WaitChoice(cardObject);

			} else {

				await ShowDialogue(cardObject);
				
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
		
		cardElement.style.display = "flex";
		cardElement.className = `card ${card.name}`;
		cardElement.id = "";
		
		
		console.log(cardImg);
		cardImg.src = card.image;
		cardImg.id = "";

		handElement.appendChild(cardElement.cloneNode(true));
		
		console.log(cardElement);
	}
}

function EraseCards() {
	handElement.innerHTML = '';
}

async function GetRandomCard() {
	let cardType;
	switch (players[turn].role) {
		case "innocent": cardType="task"; break;
		case "corrupt" : cardType="poison"; break;
		case "medic":    cardType="medicine"; break;
	}

	const filtered = Object.values(cards)
		.filter(card => card.type == cardType);
	
	let pickedCard = filtered[Math.floor(Math.random()*filtered.length)];
	
	players[turn].hand.push(pickedCard);

}

async function ShowDialogue(cardObject) {

	let text = cardObject.quote;

	dialogueModal.style.display = "flex";
	dialogueText.innerHTML = text;

	await sleep(3000);

	dialogueModal.style.display = "none";
	dialogueText.innerHTML = "";

	let effects = cardObject.effects;
	
	for (let effect of effects) {
		let com = effect.split(' ');
		ExecuteEffect(com);
	}
}

async function WaitChoice(text, choice1, choice2) {
	choiceModal.style.display = "flex";
	choiceText.innerHTML = text;

	

	choiceModal.style.display = "none";
	choiceText.innerHTML = "";

	
}

async function ExecuteEffect(com) {
	let name = com[0];

	switch (name) {
		case "add":
			let parameter = com[1];
			let amount 	  = com[2];

			console.log(`Adicionou ${amount} de ${parameter}`);
			players[turn][parameter] += parseInt(amount);
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