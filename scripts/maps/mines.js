// mines

({
	intro: false,
	
	enter: function() {
		SetLayerRenderer(0, "gamestuff.renderGib();");
		gamestuff.people = GetPersonList();
		
		if (!this.intro) {
			DrawWindow("And so our hero finds himself in the mines... Looking for a way forward.");
			this.intro = true;
		}
	},
	
	wizard1: TextDude("Beware of Teleports!"),
	
	health1: HealthPotion(),
	health2: HealthPotion(),
	health3: HealthPotion(),
	health4: HealthPotion(),
	
	swords1: SwordEquip(1, "Steel Sword"),
	
	ghoulbat1: CreateMonster("ghoulbat"),
	ghoulbat2: CreateMonster("ghoulbat"),
	ghoulbat3: CreateMonster("ghoulbat"),
	
	savestone1: MakeSaveStone(),
	
	stairs1: Teleport(89, 11, "main.rmp"),
	stairs2: Teleport(14, 35, "main.rmp"),
	
	gate1: MakeDoor(),
	key1: MakeKey(),
	
	teleport1: Teleport(12, 15),
	teleport2: Teleport(17, 12),
	teleport3: Teleport(31, 13),
	teleport4: Teleport(22,  8),
	teleport5: Teleport(25, 12),
	teleport6: Teleport(10, 13),
	teleport7: Teleport(19, 12),
	teleport8: Teleport(22, 14),
});