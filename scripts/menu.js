/**
* Script: menu.js
* Written by: Andrew Helenius
* Updated: 8/25/2013
**/

function Menu()
{
	this.items = [];
	this.preRender = function() { if (IsMapEngineRunning()) RenderMap(); }
}

Menu.prototype.addItem = function(text, call) {
	this.items.push({text: text, call: call});
}

Menu.prototype.execute = function(x, y, w, h) {
	var done = false;
	var index = 0;
	
	while (!done) {
		this.preRender();
		
		Resources.windowstyles.window.drawWindow(x, y, w, h);
		Foreach(this.items, function(item, i) {
			if (i == index) {
				Resources.fonts.font.setColorMask(Colors.yellow);
				Resources.images.arrow.blit(x, y + i * 12);
			}
			Resources.fonts.font.drawText(x + 12, y + i * 12, item.text);
			Resources.fonts.font.setColorMask(Colors.white);
		});
		
		FlipScreen();
		
		while (AreKeysLeft()) {
			switch (GetKey()) {
				case KEY_UP:
					if (index > 0) index--;
				break;
				case KEY_DOWN:
					if (index < this.items.length-1) index++;
				break;
				case KEY_SPACE: done = true; break;
			}
		}
	}
	
	this.items[index].call();
}