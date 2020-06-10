// Import Modules
import { IntoTheOddActor } from "./actor/actor.js";
import { IntoTheOddActorSheet } from "./actor/actor-sheet.js";
import { IntoTheOddItem } from "./item/item.js";
import { IntoTheOddItemSheet } from "./item/item-sheet.js";

Hooks.once('ready', async function() {
  // Add macros for ITO initiative if they don't exist
  // TODO make this less duplicatey and ugly.
  if (game.macros.filter(m => m.data.flags.intotheodd && m.data.flags.intotheodd.NPCsFirst).length < 1) {
    Macro.create({
      name:  'Give NPCS first initiative',
      type: 'script',
      command: 'game.combat.combatants.forEach(c => {game.combat.setInitiative(c._id, (c.actor.isPC) ? 0 : 1)})',
      flags: { 'intotheodd.NPCsFirst': true }
    })
  } else {
    console.log('macro already exists')
  }

  if (game.macros.filter(m => m.data.flags.intotheodd && m.data.flags.intotheodd.PCsFirst).length < 1) {
    Macro.create({
      name:  'Give PCS first initiative',
      type: 'script',
      command: 'game.combat.combatants.forEach(c => {game.combat.setInitiative(c._id, (c.actor.isPC) ? 1 : 0)})',
      flags: { 'intotheodd.PCsFirst': true }
    })
  } else {
    console.log('macro already exists')
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

