/**
* Script: game.js
* Written by: Andrew Helenius
* Updated: 8/24/2013
**/

RequireScript("helperz.js");
RequireScript("resources.js");
RequireScript("colorz.js");
RequireScript("itenns.js");
RequireScript("analogue.js");
RequireScript("tween.js");

const SW = GetScreenWidth();
const SH = GetScreenHeight();

// CONCEPT (Like that movie "Crank")
// You have health for 10 seconds; play to keep life up.
// Upgrades cannot affect 10 second health.
// Slight comedy aspects.
// Quick-Equip items can enhance your character.
// Rouge-like presentation.

// AMPED ON HEALTH POTIONS

Resources.loadAll();
analogue.init();

function game()
{
	CreatePerson("player", "player.rss", false);
	SetPersonSpeed("player", 2);
	AttachCamera("player");
	SetUpdateScript("Update();");
	SetRenderScript("Render();");
	MapEngine("main.rmp", 60);
}

// all update logic goes here:
function Update()
{
	TileMover();
	gamestuff.updateHP();
}

// all render logic goes here:
function Render()
{
	gamestuff.renderHP();
	gamestuff.renderTexts();
}

function TileMover()
{
	if (!IsCommandQueueEmpty("player")) return;
	
	var command = null;
	if (IsKeyPressed(KEY_UP)) command = COMMAND_MOVE_NORTH;
	if (IsKeyPressed(KEY_DOWN)) command = COMMAND_MOVE_SOUTH;
	
	if (IsKeyPressed(KEY_LEFT)) {
		command = COMMAND_MOVE_WEST;
		QueuePersonCommand("player", COMMAND_FACE_WEST, true);
	}

	if (IsKeyPressed(KEY_RIGHT)) {
		command = COMMAND_MOVE_EAST;
		QueuePersonCommand("player", COMMAND_FACE_EAST, true);
	}

	if (command != null) {
		Queue("player", command, 8);
		QueuePersonScript("player", "TalkUpdater();", true);
	}
}

function GetTileX(name)
{
	return Math.floor(GetPersonX(name)/16);
}

function GetTileY(name)
{
	return Math.floor(GetPersonY(name)/16);
}

// check to see if we 'activated' an entity right under foot
function TalkUpdater()
{
	var px = GetTileX("player");
	var py = GetTileY("player");
	var found = null;
	Foreach(gamestuff.people, function(name) {
		var x = GetTileX(name);
		var y = GetTileY(name);
		if (x == px && y == py) found = name;
	});
	if (found) CallPersonScript(found, SCRIPT_ON_ACTIVATE_TALK);
}

function GameStuff() {
	this.hp = 100;
	this.maxhp = 100;
	this.secsLeft = 10;
	this.maxSecs = 10;
	this.items = [];
	this.coins = 0;
	this.people = [];
	this.weapon = null;
	this.shield = null;
	this.texts = [];
	this.bitchTimer = GetTime();
}

GameStuff.prototype.addText = function(x, y, text) {
	this.texts.push({x: x + 8 - Resources.fonts.font.getStringWidth(text)/2, y: y - 16, text: text, time: GetTime()});
}

GameStuff.prototype.renderTexts = function() {
	for (var i = 0; i < this.texts.length; ++i) {
		var item = this.texts[i];
		if (item.time + 500 < GetTime()) {
			this.texts.splice(i, 1);
			i--;
		}
		else {
			Resources.fonts.font.drawText(MapToScreenX(0, item.x), MapToScreenY(0, item.y), item.text);
		}
	}
}

GameStuff.prototype.sellLoot = function()
{
	Foreach(this.items, function(item) { this.coins += item.value; }, this);
	this.items = [];
}

GameStuff.prototype.heal = function(amount)
{
	this.hp += amount;
	if (this.hp > this.maxhp) this.hp = this.maxhp;
}

GameStuff.prototype.renderHP = function() {
	Rectangle(0, 0, SW * this.hp / this.maxhp, 16, Colors.red);
	Resources.fonts.font.drawText(4, 4, this.secsLeft + "/" + this.maxSecs);
	if (this.weapon) this.weapon.draw(0, 16);
	if (this.shield) this.shield.draw(16, 16);
	Resources.fonts.font.drawText(0, 32, this.texts.length);
}

GameStuff.prototype.updateHP = function() {	
	if (this.hp < 0) {
		this.hp = 0;
		// ON LOSS
	}
	else if (this.hp > 0) {
		this.hp -= 1/6;
		this.secsLeft = Math.floor(this.hp / 10);
	}
	
	if (this.bitchTimer + 1000 < GetTime()) {
		if (this.secsLeft <= 1)
			RandomText("player", "AHHH AHHH!", "Shit Shit Shit", "FUUUU");
		else if (this.secsLeft <= 3)
			this.addText(GetPersonX("player"), GetPersonY("player"), "I'm dieing!");
		else if (this.secsLeft <= 5) {
			RandomText("player", "Holy crappp!", "OMG Help!");
		}
		this.bitchTimer = GetTime();
	}
}

var gamestuff = new GameStuff();

function RandomText(name)
{
	gamestuff.addText(GetPersonX(name), GetPersonY(name), arguments[1 + Math.floor(Math.random() * (arguments.length - 1))]);
}

function DrawWindow(text)
{
	var done = false;
	
	var height = new Tween();
	height.setup(0, 48, 250);
	
	function Draw() {
		height.update();
		RenderMap();
		Resources.windowstyles.window.drawWindow(16, SH-64 + (24 - height.value/2), SW-32, height.value);
		Resources.fonts.font.drawTextBox(16, SH-64 + (24 - height.value/2), SW-32, height.value, 0, text);
		
		FlipScreen();
	}
	
	while (!done) {
		Draw();
		
		while (AreKeysLeft()) {
			if (GetKey() == KEY_SPACE) done = true;
		}
	}
	
	height.setup(48, 0, 250);
	
	while (!height.isFinished()) {
		Draw();
	}
}