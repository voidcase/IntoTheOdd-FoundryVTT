import IntoTheOddChat from "../chat.mjs";

export default class IntoTheOddActor extends Actor {

  /**
 * Roll a save for ability
 * @param {*} ability 
 * @returns 
 */
  async rollSave(ability) {
    const roll = await new Roll("1d20").roll();
    const total = roll.total;
    let success = false;
    const abilityValue = this.system.abilities[ability].value;

    if (total <= abilityValue) {
      success = true;
    }

    const abilityName = game.i18n.localize(`INTOTHEODD.Character.FIELDS.${ability}.label`);
    let introText;
    if (success) {
      introText = game.i18n.format("INTOTHEODD.Roll.SaveRoll", { ability: abilityName, value: abilityValue });
    }
    else {
      introText = game.i18n.format("INTOTHEODD.Roll.SaveRoll", { ability: abilityName, value: abilityValue });
    }

    let chatData = {
      rollType: "save",
      abilityValue,
      actingCharName: this.name,
      actingCharImg: this.img,
      introText,
      formula: roll.formula,
      total: total,
      tooltip: await roll.getTooltip(),
      success
    }

    let chat = await new IntoTheOddChat(this)
      .withTemplate("systems/intotheodd/templates/roll-result.hbs")
      .withData(chatData)
      .withRolls([roll])
      .create();

    await chat.display();

    return { roll, total, success };
  }

  /**
   * 
   * @param {*} itemName 
   * @param {*} formula 
   */
  async rollDamage(itemName, formula) {
    const roll = await new Roll(formula).roll();
    const result = roll.total;

    const label = game.i18n.format("INTOTHEODD.Roll.AttackRollDamage", { itemName });

    let chatData = {
      rollType: "damage",
      actingCharName: this.name,
      actingCharImg: this.img,
      introText: label,
      formula: roll.formula,
      total: roll.total,
      tooltip: await roll.getTooltip()
    }

    let chat = await new IntoTheOddChat(this)
      .withTemplate("systems/intotheodd/templates/roll-result.hbs")
      .withData(chatData)
      .withRolls([roll])
      .create();

    await chat.display();

    return { roll, result };
  }
}
