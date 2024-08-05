// Import Modules
import IntoTheOddActor from "./documents/actor.js";
import IntoTheOddItem from "./documents/item.js";
import IntoTheOddCharacterData from "./data/character.mjs";
import IntoTheOddEncounterData from "./data/encounter.mjs";
import IntoTheOddItemData from "./data/item.mjs";
import IntoTheOddAttackData from "./data/attack.mjs";
import IntoTheOddCharacterSheet from "./sheets/character-sheet.mjs";
import IntoTheOddEncounterSheet from "./sheets/encounter-sheet.mjs";
import IntoTheOddItemSheet from "./sheets/item-sheet.js";
import IntoTheOddAttackSheet from "./sheets/attack-sheet.mjs";

Hooks.once('ready', async function () {
  if (game.user.isGM && game.settings.get('intotheodd', 'showInitiativeHelp') === true) {
    alert(
      'To the GM from the game-system developer:\n\n' +

      'In order to use group initiative as written in Into the Odd, use the two macros ' +
      'in the included compendium (see the compendium tab)' +
      'to set which side goes first in combat.\n\n' +

      'This message will only appear once (but can be reset in system settings).'
    )
    game.settings.set('intotheodd', 'showInitiativeHelp', false)
  }
});

Hooks.once('init', async function () {

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "@dex - 1d20",
    decimals: 1
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = IntoTheOddActor;
  CONFIG.Actor.dataModels = {
    character: IntoTheOddCharacterData,
    encounter: IntoTheOddEncounterData
  };

  CONFIG.Item.documentClass = IntoTheOddItem;
  CONFIG.Item.dataModels = {
    equipment: IntoTheOddItemData,
    attack: IntoTheOddAttackData
  };

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("intotheodd", IntoTheOddCharacterSheet, { types: ["character"], makeDefault: true });
  Actors.registerSheet("intotheodd", IntoTheOddEncounterSheet, { types: ["encounter"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("intotheodd", IntoTheOddItemSheet, { types: ["equipment"], makeDefault: true });
  Items.registerSheet("intotheodd", IntoTheOddAttackSheet, { types: ["attack"], makeDefault: true });

  game.settings.register('intotheodd', 'showInitiativeHelp', {
    name: 'Show initiative helptext on next startup',
    hint: 'This option only exists so the helptext won\'t appear on every startup.\n When the message appears, this option will uncheck itself.',
    scope: 'system',
    config: true,
    type: Boolean,
    default: true
  })

});

