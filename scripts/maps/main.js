/* World */

({
	enter: function() {
		gamestuff.people = GetPersonList();
	},
	
	ironsword: SwordEquip(0, "Iron Sword"),
	woodshield: ShieldEquip(0, "Wood Shield"),

	
	
	health1: HealthPotion(),
	health2: HealthPotion(),
	//health3: HealthPotion(),
	//health4: HealthPotion(),
	//health5: HealthPotion(),
});