/**
* Script: helperz.js
* Written by: Andrew Helenius
* Updated: 8/24/2013
**/

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
	
	if (Compare(item, gamestuff[type], stat) < 0) {
		gamestuff.items.push(gamestuff[type].name);
		gamestuff[type] = item;
	}
	else {
		gamestuff.items.push(item.name);
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

function SwordEquip(frame, name)
{
	return {
		item: name,
		
		create: function() {
			SetPersonFrame(GetCameraPerson(), frame);
		},
		
		talk: function() {
			TryEquipWeapon(this.item);
			DestroyPerson(GetCurrentPerson());
		},
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

function ShieldEquip(frame, name)
{
	return {
		item: name,
		
		create: function() {
			SetPersonFrame(GetCameraPerson(), frame);
		},
		
		talk: function() {
			TryEquipShield(name);
			DestroyPerson(GetCurrentPerson());
		},
	}
}