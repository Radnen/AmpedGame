/**
* Script: itenns.js
* Written by: Andrew Helenius
* Updated: 8/23/2013
**/

function Item()
{
	this.name = "";
	this.image = "";
	this.atk = 0;
	this.def = 0;
}

Item.prototype.draw = function(x, y) {
	Resources.images[this.image].blit(x, y);
}

var Items = {};

AddItem("Iron Sword", {atk: 5, image: "ironsword"});
AddItem("Steel Sword", {atk: 10, image: "steelsword"});
AddItem("Champ Sword", {atk: 15, image: "champsword"});
AddItem("Mithril Sword", {atk: 20, image: "mithrilsword"});
AddItem("Dragon Sword", {atk: 25, image: "dragonsword"});
AddItem("Wood Shield", {def: 5, image: "woodshield"});
AddItem("Iron Shield", {def: 10, image: "ironshield"});
AddItem("Hero Shield", {def: 15, image: "heroshield"});
AddItem("Mithril Shield", {def: 20, image: "mithrilshield"});
AddItem("Great Shield", {def: 25, image: "greatshield"});

function AddItem(name, item)
{
	Items[name] = new Item();
	Items[name].name = name;
	for (var i in item) {
		Items[name][i] = item[i];
	}
}