/**
* Script: main.js
* Written by: Andrew Helenius
* Updated: 8/23/2013
**/

RequireScript("helperz.js");
RequireScript("colorz.js");
RequireScript("resources.js");

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
	MapEngine("test.rmp", 60);
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
	if (IsKeyPressed(KEY_LEFT)) command = COMMAND_MOVE_WEST;
	if (IsKeyPressed(KEY_RIGHT)) command = COMMAND_MOVE_EAST;

	if (command != null) {
		Queue("player", command, 8);
	}
}

function GameStuff() {
	this.hp = 100;
	this.maxhp = 100;
	this.secsLeft = 10;
	this.items = [];
	this.coins = 0;
}

GameStuff.prototype.sellLoot = function()
{
	Foreach(this.items, function(item) { this.coins += item.value; }, this);
	this.items = [];
}

GameStuff.prototype.renderHP = function() {
	Rectangle(0, 0, SW * this.hp / this.maxhp, 16, Colors.red);
	Resources.fonts.font.drawText(4, 4, this.secsLeft);
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