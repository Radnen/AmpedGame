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
	IgnorePersonObstructions("player", true);
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
}

var gamestuff = new GameStuff();