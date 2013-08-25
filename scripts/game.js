/**
* Script: game.js
* Written by: Andrew Helenius
* Updated: 8/25/2013
**/

RequireScript("json2.js");
RequireScript("helperz.js");
RequireScript("resources.js");
RequireScript("colorz.js");
RequireScript("monsters.js");
RequireScript("itenns.js");
RequireScript("analogue.js");
RequireScript("tween.js");
RequireScript("gamestuff.js");

const SW = GetScreenWidth();
const SH = GetScreenHeight();

// CONCEPT (Like that movie "Crank")
// You have health for 10 seconds; play to keep life up.
// Upgrades cannot affect 10 second health.
// Slight comedy aspects.
// Quick-Equip items can enhance your character.
// Rouge-like presentation.

// AMP'D ON/FOR HEALTH POTIONS

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
	gamestuff.updateTalkers();
	gamestuff.updateMonsters();
	
	while (AreKeysLeft()) {
		switch (GetKey()) {
			case KEY_SPACE:
				Activate();
				CreateAnimation(GetTileX("player") + gamestuff.dx, GetTileY("player") + gamestuff.dy, "anims.rss", "sword");
			break;
		}
	}
}

// all render logic goes here:
function Render()
{
	gamestuff.renderTexts();
	gamestuff.renderUI();
}

function TileMover()
{
	if (!IsCommandQueueEmpty("player")) return;
	
	var command = null;
	
	if (IsKeyPressed(KEY_UP)) { command = COMMAND_MOVE_NORTH; gamestuff.dx = 0; gamestuff.dy = -1; }
	if (IsKeyPressed(KEY_DOWN)) { command = COMMAND_MOVE_SOUTH; gamestuff.dx = 0; gamestuff.dy = 1; }
	
	if (IsKeyPressed(KEY_LEFT)) {
		command = COMMAND_MOVE_WEST;
		QueuePersonCommand("player", COMMAND_FACE_WEST, true);
		gamestuff.dy = 0;
		gamestuff.dx = -1;
	}

	if (IsKeyPressed(KEY_RIGHT)) {
		command = COMMAND_MOVE_EAST;
		QueuePersonCommand("player", COMMAND_FACE_EAST, true);
		gamestuff.dy = 0;
		gamestuff.dx = 1;
	}

	if (command != null && !IsObstructed("player", command)) {
		Queue("player", command, 8);
		QueuePersonScript("player", "TalkUpdater();", true);
	}
}

function Activate()
{
	var p = GetPersonAt(GetTileX("player") + gamestuff.dx, GetTileY("player") + gamestuff.dy);
	if (p) { CallPersonScript(p, SCRIPT_ON_ACTIVATE_TALK); }
}

function GetTileX(name)
{
	return Math.floor(GetPersonX(name)/16);
}

function GetTileY(name)
{
	return Math.floor(GetPersonY(name)/16);
}

function GetPersonAt(x, y)
{
	var i = GetIndexOf(gamestuff.people, function(person) {
		var px = GetTileX(person);
		var py = GetTileY(person);
		return (px == x && py == y);
	});
	if (i >= 0) return gamestuff.people[i];
	return null;
}

// check to see if we 'activated' an entity right under foot
function TalkUpdater()
{
	var px = GetTileX("player");
	var py = GetTileY("player");
	var found = null;
	
	Foreach(gamestuff.people, function(name) {
		if (name == "player") return;
		var x = GetTileX(name);
		var y = GetTileY(name);
		if (x == px && y == py) found = name;
	});
	
	if (found) {
		CallPersonScript(found, SCRIPT_ON_ACTIVATE_TALK);
	}
}

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

