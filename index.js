// =====================
//       SETTINGS
const playerTurn = 3;
const playerAmount = 4;
const maxTurnTime = 8000;

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

const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");

const descriptionText = document.getElementById("descriptionText")

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

let timer, choice;
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

		const action = await WaitForActionTaken();

		playerDivElements[turn].style.backgroundColor = disableColor;


		i++;
		NextTurn();
		UpdateStar();
		if (i > 10) isGame=false;
		
	}
}

function WaitForActionTaken() {
	return new Promise(resolve => {
	  const interval = setInterval(() => {
		if (actionDone == true) {
		  clearInterval(interval);
		  resolve();
		}
	  }, 100);
	});
}



function ReloadCards() {
	let cardElements = document.getElementsByClassName("card");
	
	for (let card of cardElements) {

		card.addEventListener("mouseover", async () => {
			let raw = card.className;
			let com = raw.split(' ');
			let cardName = com[1];

			let cardObject = cards[cardName];
			descriptionText.innerHTML = cardObject.quote;
		});


		card.addEventListener("click", async () => {
			
			if (actionDone) return;

			let raw = card.className;
			let com = raw.split(' ');
			let cardName = com[1];

			let cardObject = cards[cardName];

			if (cardObject.type == "task") {
				console.log("task")
				await WaitChoice(cardObject);
				console.log("A");
				actionDone = true;
			} else {

				await ShowDialogue(cardObject);
				actionDone = true;
			}
			
		});
	}
}

function RenderCards() {
	EraseCards();
	let df = document.createDocumentFragment();
	for (let card of players[turn].hand) {
		let cardElement = cardModal.cloneNode(true);
		let cardTitle = cardElement.children[0];
		let cardImg = cardElement.children[1];
		
		cardElement.style.display = "flex";
		cardElement.className = `card ${card.name}`;
		
		cardElement.id = "";
		
		
		console.log(cardImg);
		cardImg.src = card.image;

		let newTitle = card.name.replaceAll("_"," ");
		cardTitle.innerHTML = newTitle;

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

async function NextTurn() {
	turn++;
	actionDone = false;
}

function UpdateChoice(c) {
	choice = c;
	console.log(choice);
}

async function WaitChoice(cardObject) {

	let question = cardObject.question;
	let choice1  = cardObject.choice[0];
	let choice2  = cardObject.choice[1];
	let messages = cardObject.messages;
	let index;

	choiceModal.style.display = "flex";
	choiceText.innerHTML = question;
	option1Text.innerHTML = choice1;
	option2Text.innerHTML = choice2;

	option1.addEventListener("click", ()=>{UpdateChoice(choice1); index=0}, false);
	option2.addEventListener("click", ()=>{UpdateChoice(choice2); index=1}, false);

	choice="";
	console.log("A");
	console.log(option1);
	await WaitForChoice();

	option1.removeEventListener("click", UpdateChoice);
	option2.removeEventListener("click", UpdateChoice);

	console.log(choice + "selected");
	choiceModal.style.display = "none";
	choiceText.innerHTML = "";


	//Dialogue	
	dialogueModal.style.display = "flex";
	dialogueText.innerHTML = messages[index];

	await sleep(3000);

	dialogueModal.style.display = "none";
	dialogueText.innerHTML = "";


	//Apply Effect
	let effects = cardObject.effects[index];
	
	for (let effect of effects) {
		let com = effect.split(' ');
		ExecuteEffect(com);
	}
}



function WaitForChoice() {
	return new Promise(resolve => {
	  const interval = setInterval(() => {
		
		if (choice != "") {
		  clearInterval(interval);
		  resolve();
		}
	  }, 100);
	});
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