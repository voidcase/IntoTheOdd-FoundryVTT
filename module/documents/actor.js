/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export default class IntoTheOddActor extends Actor {

      /**
     * Roll a save for ability
     * @param {*} ability 
     * @returns 
     */
      async rollSave(ability) {
        const roll = await new Roll("1d20").roll();
        const result = roll.total;

        if (result <= this.system.abilities[ability].value) {
            return { roll, result, success: true };
        }

        return { roll, result, success: false };
    }

    /**
     * 
     * @param {*} itemName 
     * @param {*} formula 
     */
    async rollDamage(itemName, formula) {
        const roll = await new Roll(formula).roll();
        const result = roll.total;
        return { roll, result };
    }    
}
