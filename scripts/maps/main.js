/* World */

({
	intro: false,
	
	enter: function() {
		SetLayerRenderer(0, "gamestuff.renderGib();");
		gamestuff.people = GetPersonList();
		
		if (!this.intro) {
			DrawWindow("There was a time of great strife. But people prevailed and learned to overcome their weaknesses.");
			DrawWindow("Well, except one kid. He's got ten seconds to live.");
			this.intro = true;
			gamestuff.quicksave();
		}
	},
	
	ironsword: SwordEquip(0, "Iron Sword"),

	shields1: ShieldEquip(0, "Wood Shield"),
	shields2: ShieldEquip(1, "Iron Shield"),
	
	savestone1: MakeSaveStone(),
	savestone2: MakeSaveStone(),
	savestone3: MakeSaveStone(),

	villager1: TextDude("Swords cut bushes."),
	villager2: TextDude("Keys unlock doors."),
	villager3: TextDude("Help save us!"),
	villager4: TextDude("Where's my key?"),
	guard1: TextDude("Beware of monsters!"),
	guard2: TextDude("Beware of monsters!"),
	guard3: TextDude("Monsters in mines!"),
	guard4: TextDude("Welcome!"),
	guard5: TextDude("Welcome!"),
	lass1: TextDude("Help Save Me!"),
	
	wizard1: TextDude("Save on savestones."),
	wizard2: TextDude("A dragon, help!"),
	
	blank1: Teleport(5, 35, "mines.rmp"),
	blank2: Teleport(3, 6, "mines.rmp"),
	
	key1: MakeKey(),
	key2: MakeKey(),
	key3: MakeKey(),
	key4: MakeKey(),
	
	gate1: MakeDoor(),
	gate2: MakeDoor(),
	gate3: MakeDoor(),
	gate4: MakeDoor(),
	
	bush1: MakeBush(),
	bush2: MakeBush(),
	bush3: MakeBush(),
	bush4: MakeBush(),
	
	spook1: CreateMonster("spook"),
	spook2: CreateMonster("spook"),
	spook3: CreateMonster("spook"),
	spook4: CreateMonster("spook"),
	spook5: CreateMonster("spook"),
	
	ghoulbat1: CreateMonster("ghoulbat"),
	ghoulbat2: CreateMonster("ghoulbat"),
	
	dragon1: CreateMonster("dragon"),
	
	health1: HealthPotion(),
	health2: HealthPotion(),
	health3: HealthPotion(),
	health4: HealthPotion(),
	health5: HealthPotion(),
	health6: HealthPotion(),
	health7: HealthPotion(),
	health8: HealthPotion(),
	health9: HealthPotion(),
	health10: HealthPotion(),
	
	youth: {
		talk: function() {
			DrawWindow("And so the hero has finally found the fountain of youth. But it was dry... and so he died.");
			while (true) {
				Resources.images.theend.blit(0, 0);
				FlipScreen();
				GetKey();
				ExitMapEngine();
			}
		},
	},
});