/* World */

({
	intro: false,
	
	enter: function() {
		SetLayerRenderer(0, "gamestuff.renderGib();");
		gamestuff.people = GetPersonList();
		
		if (!this.intro) {
			DrawWindow("There was a time of great strife. But people prevailed and learned to overcome their weaknesses.");
			DrawWindow("Well, exepect one kid. He's got ten seconds to live.");
			this.intro = true;
			gamestuff.quicksave();
		}
	},
	
	ironsword: SwordEquip(0, "Iron Sword"),

	woodshield: ShieldEquip(0, "Wood Shield"),
	
	savestone1: MakeSaveStone(),

	villager1: TextDude("Swords cut bushes."),
	villager2: TextDude("Keys unlock doors."),
	guard1: TextDude("Beware of monsters!"),
	guard2: TextDude("Beware of monsters!"),
	wizard1: TextDude("Save on savestones."),
	
	key1: MakeKey(),
	
	gate1: MakeDoor(),
	
	bush1: MakeBush(),
	
	spook1: CreateMonster("spook"),
	spook2: CreateMonster("spook"),
	
	health1: HealthPotion(),
	health2: HealthPotion(),
	health3: HealthPotion(),
	health4: HealthPotion(),
	//health5: HealthPotion(),
});