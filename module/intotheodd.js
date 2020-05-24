// Import Modules
import { IntoTheOddActor } from "./actor/actor.js";
import { IntoTheOddActorSheet } from "./actor/actor-sheet.js";
import { IntoTheOddItem } from "./item/item.js";
import { IntoTheOddItemSheet } from "./item/item-sheet.js";

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
    formula: "1d20",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = IntoTheOddActor;
  CONFIG.Item.entityClass = IntoTheOddItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("intotheodd", IntoTheOddActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("intotheodd", IntoTheOddItemSheet, { makeDefault: true });

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

  Handlebars.registerHelper('toLowerCase', function(str) {
    return str.toLowerCase();
  });
});
