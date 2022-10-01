/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IntoTheOddActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();
    // const actorData = this.data;
    // const data = actorData.system;
    // const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (this.type === 'character') this._prepareCharacterData();
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData() {
    this.system.armour = this.items
      .map(item => item.system.armour * item.system.equipped)
      .reduce((a,b) => a + b, 0);
  }
  
  /** @override */
  getRollData() {
    const data = super.getRollData();
    // Let us do @str etc, instead of @abilities.str.value
    for ( let [k, v] of Object.entries(data.abilities) ) {
      if ( !(k in data) ) data[k] = v.value;
    }
    return data;
  }

  /** @override */
  deleteOneItem(itemId) {
    const item = this.items.get(itemId);
    if (item.system.quantity > 1) {
      item.system.quantity--;
    } else {
      item.delete();
    }
  }
}
