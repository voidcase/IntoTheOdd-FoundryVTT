// Import Modules
import { IntoTheOddActor } from "./documents/actor.js";
import { IntoTheOddCharacterSheet } from "./sheets/character-sheet.mjs";
import { IntoTheOddItem } from "./item/item.js";
import { IntoTheOddItemSheet } from "./item/item-sheet.js";

import IntoTheOddCharacter from "./data/character.mjs";

Hooks.once('ready', async function() {
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

Hooks.once('init', async function() {

  game.intotheodd = {
    IntoTheOddActor,
    IntoTheOddItem
  };

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
    character: IntoTheOddCharacter
  };

  CONFIG.Item.documentClass = IntoTheOddItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("intotheodd", IntoTheOddCharacterSheet, { types: ["character"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("intotheodd", IntoTheOddItemSheet, { types: ["item"], makeDefault: true });

  game.settings.register('intotheodd', 'showInitiativeHelp', {
    name: 'Show initiative helptext on next startup',
    hint: 'This option only exists so the helptext won\'t appear on every startup.\n' +
    'When the message appears, this option will uncheck itself.',
    scope: 'system',
    config: true,
    type: Boolean,
    default: true
  })

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function() {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toUpperCase', function(str) {
    return str.toUpperCase();
  });

  Handlebars.registerHelper('boldIf', function(cond, options) {
    return (cond) ? '<b>' + options.fn(this) + '</b>' : options.fn(this);
  });

});

