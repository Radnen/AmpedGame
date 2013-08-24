/* World */

({
	enter: function() {
		gamestuff.people = GetPersonList();
		DrawWindow("There was a time of great strife. But people prevailed and learned to overcome their weaknesses.");
		DrawWindow("Well, exepect one kid. He's got ten seconds to live.");
	},
	
	ironsword: SwordEquip(0, "Iron Sword"),
	woodshield: ShieldEquip(0, "Wood Shield"),

	villager1: TextDude("Swords cut bushes"),
	villager2: TextDude("Keys unlock doors"),
	
	health1: HealthPotion(),
	health2: HealthPotion(),
	//health3: HealthPotion(),
	//health4: HealthPotion(),
	//health5: HealthPotion(),
});