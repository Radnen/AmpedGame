/**
* Script: helperz.js
* Written by: Andrew Helenius
* Updated: 8/25/2013
**/

const PI = 3.1415926535;

function Repeat(func, times)
{
	for (var i = 0; i < times; ++i)
		func();
}

function RemoveAt(array, index, amount)
{
	if (amount === undefined) amount = 1;
	return array.splice(index, amount);
}

function Foreach(array, func, parent)
{
	for (var i = 0, l = array.length; i < l; ++i) {
		func.call(parent, array[i], i, array);
	}
	return array;
}

function GetIndexOf(array, func, parent)
{
	for (var i = 0, l = array.length; i < l; ++i) {
		if (func.call(parent, array[i])) return i;
	}
	return -1;
}

function Queue(name, command, times)
{
	Repeat(function() {
		QueuePersonCommand(name, command, false);
	}, times);
}

function FileExists(path, filename) {
	if (typeof path == "string") path = GetFileList(path);
	return Contains(path, function(i) { return i == filename; });
}

// Returns an angle between 0 and 2PI, between two entities
function GetAngleBetweenEntities(person1, person2)
{
	var dx = GetPersonX(person2)-GetPersonX(person1);
	var dy = GetPersonY(person2)-GetPersonY(person1);
	
	return Math.atan2(dy, dx)+PI;
}

function GetAngleDirection(person1, person2)
{
	var angle = GetAngleBetweenEntities(person1, person2);
	
	if (angle > 5*PI/4 && angle < 7*PI/4) return "north";
	else if (angle > 3*PI/4 && angle < 5*PI/4) return "west";
	else if (angle > PI/4 && angle < 3*PI/4) return "south";
	else return "east";
}

// This is used to check if a given person can move
// towards a given direction.
function IsObstructed(name, command)
{
	var H = 0, W = 0;
	var X = GetPersonX(name);
	var Y = GetPersonY(name);
	
	switch(command) {
		case COMMAND_MOVE_NORTH: H = -16; break;
		case COMMAND_MOVE_SOUTH: H =  16; break;
		case COMMAND_MOVE_EAST:  W =  16; break;
		case COMMAND_MOVE_WEST:  W = -16; break;
		default: return false; break;
	}

	if (IsPersonObstructed(name, X+W, Y+H)) return true;
	if (IsPersonObstructed(name, X+(W>>1), Y+(H>>1))) return true;
	return false; // just in case
}

var g_num = 0;
function CreateAnimation(tilex, tiley, ss, dir) {
	var name = "effect" + g_num;
	CreatePerson(name, ss, true);
	SetPersonX(name, tilex*16+7);
	SetPersonY(name, tiley*16+7);
	SetPersonDirection(name, dir);
	SetPersonLayer(name, 2);
	Queue(name, COMMAND_ANIMATE, 15);
	QueuePersonScript(name, "DestroyPerson(GetCurrentPerson());", true);
}

var g_items = 0;
function CreateItem(x, y, item)
{
	var name = "item" + g_items;
	if (typeof item == "number") {
		CreatePerson(name, "coins.rss", true);
		SetPersonScript(name, SCRIPT_ON_ACTIVATE_TALK, "gamestuff.coins += " + item + "; DestroyPerson('" + name + "');");
	}
	else {
		if (item == "hp") {
			CreatePerson(name, "health.rss", true);
			SetPersonScript(name, SCRIPT_ON_ACTIVATE_TALK, "gamestuff.heal(50); DestroyPerson('" + name + "');");
		}
	}
	SetPersonX(name, x);
	SetPersonY(name, y);
	SetPersonLayer(name, 0);
}

function Contains(array, func, parent)
{
	for (var i = 0, l = array.length; i < l; ++i) {
		if (func.call(parent, array[i], i)) {
			return true;
		}
	}
	return false;
}

function Compare(itemA, itemB, stat)
{
	return itemA[stat] - itemB[stat];
}

function TryEquip(name, type, stat)
{
	var item = Items[name];
	if (item === undefined) Abort(name + ": not an item");
	
	if (gamestuff[type] == null) {
		gamestuff[type] = item;
		return;
	}
	
	if (Compare(gamestuff[type], item, stat) < 0) {
		gamestuff.items.push(gamestuff[type].name);
		gamestuff[type] = item;
	}
	else {
		gamestuff.items.push(name);
	}
}

function TryEquipWeapon(name)
{
	TryEquip(name, "weapon", "atk");
}

function TryEquipShield(name)
{
	TryEquip(name, "shield", "def");
}

function CheckDead(name)
{
	if (analogue.person(name).dead)
		_DestroyPerson(name);
}

function TextDude(text)
{
	return {
		text: text,
		create: function() {
			gamestuff.addTalker(GetCurrentPerson(), this.text);
		},
	}
}

function MakeKey()
{
	return {
		dead: false,
		create: function() { CheckDead(GetCurrentPerson()); },
		talk: function() {
			gamestuff.keys.push(this);
			DestroyPerson(GetCurrentPerson());
		}
	}
}

function MakeBush()
{
	return {
		talk: function() {
			if (gamestuff.weapon == null) {
				gamestuff.addText(GetPersonX("player"), GetPersonY("player"), "Can't cut it.");
				return;
			}
			if (gamestuff.weapon != "bow")
			{
				DestroyPerson(GetCurrentPerson());
				gamestuff.addText(GetPersonX("player"), GetPersonY("player"), "Swoosh");
			}
		},
	}
}

function MakeDoor()
{
	return {
		dead: false,
		create: function() { CheckDead(GetCurrentPerson()); },
		talk: function() {
			if (gamestuff.tryKey()) {
				this.dead = true;
				DestroyPerson(GetCurrentPerson());
				gamestuff.addText(GetPersonX("player"), GetPersonY("player"), "Unlocked!");
			}
			else {
				gamestuff.addText(GetPersonX("player"), GetPersonY("player"), "No keys!");
			}
		},
	}
}

function MakeSaveStone()
{
	return {
		talk: function() {
			var name = GetCurrentPerson();
			CreateAnimation(GetTileX(name), GetTileY(name), "anims.rss", "sparkle");
			gamestuff.addText(GetPersonX("player"), GetPersonY("player"), "Saved, at last!");
			gamestuff.quicksave();
		}
	}
}

function HealthPotion()
{
	return {
		talk: function() {
			gamestuff.heal(50);
			DestroyPerson(GetCurrentPerson());
		},
	}
}

function LifePotion()
{
	return {
		dead: false,
		create: function() { CheckDead(GetCurrentPerson()); },
		talk: function() {
			gamestuff.lives++;
			DestroyPerson(GetCameraPerson());
		},
	}
}

var _DestroyPerson = DestroyPerson;
DestroyPerson = function(name)
{
	var i = GetIndexOf(gamestuff.people, function(item) { return item == name; });
	if (i >= 0) {
		RemoveAt(gamestuff.people, i);
		_DestroyPerson(name);
	}
}

var _CreatePerson = CreatePerson;
CreatePerson = function(name, ss, die) {
	_CreatePerson(name, ss, die);
	gamestuff.people.push(name);
}

function CreateMonster(type)
{
	return {
		type: type,
		
		create: function() {
			gamestuff.addMonster(GetCurrentPerson(), Monsters[this.type]);
		},
		
		talk: function() {
			if (gamestuff.hurtMonster(GetCurrentPerson())) {
				DestroyPerson(GetCurrentPerson());
			}
		}
	}
}

function Alert(text)
{
	var done = false;
	while (!done) {
		Rectangle(0, 0, SW, SH, Colors.black);
		Resources.fonts.font.drawTextBox(0, 0, SW, SH, 0, text);
		FlipScreen();
		while (AreKeysLeft()) {
			if (GetKey() == KEY_ENTER) done = true;
		}
	}
}

function SwordEquip(frame, name)
{
	return {
		item: name,
		dead: false,
		
		create: function() {
			SetPersonFrame(GetCurrentPerson(), frame);
			CheckDead(GetCurrentPerson());
		},
		
		talk: function() {
			TryEquipWeapon(this.item);
			DestroyPerson(GetCurrentPerson());
			this.dead = true;
		},
	}
}

function ShieldEquip(frame, name)
{
	return {
		item: name,
		dead: false,
		
		create: function() {
			SetPersonFrame(GetCurrentPerson(), frame);
			CheckDead(GetCurrentPerson());
		},
		
		talk: function() {
			TryEquipShield(name);
			DestroyPerson(GetCurrentPerson());
			this.dead = true;
		},
	}
}

function Teleport(x, y, map)
{
	return {
		x: x,
		y: y,
		map: map,
		talk: function () {
			AddRunner(function() {
				if (this.map) {
					gamestuff.reset(false, true);
					ChangeMap(this.map);
				}
				SetPersonX("player", this.x*16+7);
				SetPersonY("player", this.y*16+7);
			}, this);
		}
	}
}