/**
* Script: gamestuff.js
* Written by: Andrew Helenius
* Updated: 8/25/2013
**/

function GameStuff() {
	this.hp = 100;
	this.maxhp = 100;
	this.secsLeft = 10; // aww yiss.
	this.maxSecs = 10;
	this.items = [];
	this.coins = 0;  // cashez.
	this.people = [];
	this.weapon = null; // wpnz
	this.shield = null; // shieldz
	this.texts = [];
	this.bitchTimer = GetTime(); // your complaining frequency
	this.talktime = GetTime();
	this.talkers = []; // people that spew infoz
	this.keys = [];
	this.dx = 0; // direction vectors
	this.dy = 0;
	this.monsters = [];
	this.timer = GetTime();
	this.gib = [];
}

GameStuff.prototype.addTalker = function(name, text) {
	this.talkers.push({name: name, x: GetPersonX(name), y: GetPersonY(name), text: text});
}

GameStuff.prototype.addText = function(x, y, text, duration) {
	if (duration === undefined) duration = 500;
	
	this.texts.push({
		x: x + 8 - Resources.fonts.font.getStringWidth(text)/2,
		y: y - 16,
		text: text,
		time: GetTime(),
		duration: duration
	});
}

GameStuff.prototype.addMonster = function(name, object) {
	var m = {};
	for (var i in object) m[i] = object[i];
	m.mask = CreateColor(255, 255, 255);
	m.tween = new Tween(255);
	m.name = name;
	m.atktime = GetTime();
	this.monsters.push(m);
}

GameStuff.prototype.hurtMonster = function(name) {
	var i = GetIndexOf(this.monsters, function(m) { return m.name == name; });
	if (i >= 0) {
		var m = this.monsters[i];
		m.hp -= this.weapon.atk;
		m.state = 1;
		if (m.hp <= 0) {
			var x = GetPersonX(m.name);
			var y = GetPersonY(m.name);
			CreateItem(x, y, m.items[Math.floor(Math.random()*m.items.length)]);
			RemoveAt(this.monsters, i);
			RandomText("player", "Die monster!", "I gotta go!", "Take that!", "Asshole!", "Die bitch.", "Die die die!", "No mercy!");
			return true;
		}
	}
	return false;
}

GameStuff.prototype.clearMonsters = function() {
	this.monsters = [];
}

GameStuff.prototype.updateMonsters = function() {
	var px = GetTileX("player");
	var py = GetTileY("player");
	
	Foreach(this.monsters, function(m) {
		switch (m.state) {
			case 1:
				m.tween.setup(255, 0, 100);
				m.state = 2;
			break;
			case 2:
				if (m.tween.isFinished()) m.state = 3;
			break;
			case 3:
				m.tween.setup(0, 255, 100);
				m.state = 0;
			break;
		}
		
		m.tween.update();
		m.mask.green = m.tween.value;
		m.mask.blue = m.tween.value;
		if (!DoesPersonExist(m.name)) return;
		SetPersonMask(m.name, m.mask);
		
		if (!IsCommandQueueEmpty(m.name)) return;
		var dx = px - GetTileX(m.name);
		var dy = py - GetTileY(m.name);
		var dist = dx*dx + dy*dy;
		if (dist <= 1 && m.atktime + 2000 < GetTime()) {
			this.hp -= m.atk;
			CreateAnimation(px, py, "anims.rss", "sword");
			m.atktime = GetTime();
		}
		
		if (dist > 36) return;
		
		var a = GetAngleDirection("player", m.name);
		var command = null;
		switch (a) {
			case "north": command = COMMAND_MOVE_NORTH; break;
			case "south": command = COMMAND_MOVE_SOUTH; break;
			case "east": command = COMMAND_MOVE_EAST; break;
			case "west": command = COMMAND_MOVE_WEST; break;
		}
		if (command != null && !IsObstructed(m.name, command)) Queue(m.name, command, 16);
	}, this);
}

GameStuff.prototype.renderTexts = function() {
	for (var i = 0; i < this.texts.length; ++i) {
		var item = this.texts[i];
		if (item.time + item.duration < GetTime()) {
			this.texts.splice(i, 1);
			i--;
		}
		else {
			Resources.fonts.font.drawText(MapToScreenX(0, item.x), MapToScreenY(0, item.y), item.text);
		}
	}
}

GameStuff.prototype.renderGib = function() {
	Foreach(this.gib, function(gib) {
		Resources.images[gib.img].blit(MapToScreenX(0, gib.x), MapToScreenY(0, gib.y));
	});
}

GameStuff.prototype.updateTalkers = function()
{
	var px = GetPersonX("player");
	var py = GetPersonY("player");
	
	if (this.talktime + 3000 < GetTime()) {
		Foreach(this.talkers, function(talker) {
			var dx = px - talker.x;
			var dy = py - talker.y;
			if (dx*dx + dy*dy < 9216)
				this.addText(talker.x, talker.y, talker.text, 2000);
		}, this);
		this.talktime = GetTime();
	}
}

GameStuff.prototype.tryKey = function(door) {
	if (this.keys.length > 0) {
		var key = this.keys.pop();
		key.dead = true;
		return true;
	}
	else return false;
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

GameStuff.prototype.renderUI = function() {
	Rectangle(0, 0, SW * this.hp / this.maxhp, 16, Colors.red);
	Resources.fonts.font.drawText(4, 4, this.secsLeft + "/" + this.maxSecs);
	if (this.weapon) this.weapon.draw(0, 16);
	if (this.shield) this.shield.draw(16, 16);
}

GameStuff.prototype.addGib = function(x, y, base) {
	var images = ["gib1", "gib2"];
	this.gib.push({x: x-7, y: y-7, img: images[Math.floor(Math.random()*images.length)]});
}

GameStuff.prototype.updateHP = function() {	
	if (this.hp <= 0) {
		this.hp = 0;
		this.secsLeft = 0;
		this.addGib(GetPersonX("player"), GetPersonY("player"));
		this.quickload();
	}
	else if (this.hp > 0) {
		this.hp -= 1/6;
		this.secsLeft = Math.ceil(this.hp / 10);
		
		if (this.bitchTimer + 1000 < GetTime()) {
			if (this.secsLeft <= 1)
				RandomText("player", "AHHH AHHH!", "Shit Shit Shit", "FUUUU");
			else if (this.secsLeft <= 3)
				RandomText("player", "I'm dieing!", "Help help!", "Somenbody juice mee!", "Needs powers now!!", "HALP!");
			else if (this.secsLeft <= 5) {
				RandomText("player", "Holy crappp!", "OMG Help!", "WTH!?", "Duuuude!", "Oh man, Oh man!");
			}
			this.bitchTimer = GetTime();
		}
	}
}

GameStuff.prototype.quicksave = function() {
	var w    = analogue.world;
	w.coins  = this.coins;
	if (this.weapon)
		w.weapon = this.weapon.name;
	if (this.shield)
		w.shield = this.shield.name;
	w.items    = this.items;
	w.px       = GetPersonX("player");
	w.py       = GetPersonY("player");
	w.worldmap = GetCurrentMap();
	
	var file = OpenRawFile("quicksave.sav", true);
	file.write(CreateByteArrayFromString(JSON.stringify(w)));
	file.close();
}

GameStuff.prototype.quickload = function() {
	var file = OpenRawFile("quicksave.sav");
	var w    = JSON.parse(CreateStringFromByteArray(file.read(file.getSize())));
	analogue.mergeWorld(w);
	file.close();
	this.reset(true);
	this.keys     = [];
	this.items    = w.items;
	this.hp       = 100; // full heal here
	this.secsLeft = 10;
	if (w.weapon) this.weapon = Items[w.weapon];
	else this.weapon = null;
	if (w.shield) this.shield = Items[w.shield];
	else this.shield = null;
	if (IsMapEngineRunning()) {
		ChangeMap(w.worldmap);
		SetPersonX("player", w.px);
		SetPersonY("player", w.py);
	}
	else {
		StartEngine(w.worldmap, function() {
			g_reset = true;
		});
	}
}

GameStuff.prototype.reset = function(people, gib)
{
	if (people) this.people   = GetPersonList();
	this.talkers  = [];
	this.monsters = [];
	this.texts    = [];
	if (gib) this.gib = [];
}

var gamestuff = new GameStuff();