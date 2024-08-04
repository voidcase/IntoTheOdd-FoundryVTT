/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export default class IntoTheOddActor extends Actor {
 
  /** @override */
  getRollData() {
    const data = super.getRollData();
    // Let us do @str etc, instead of @abilities.str.value
    for ( let [k, v] of Object.entries(data.abilities) ) {
      if ( !(k in data) ) data[k] = v.value;
    }
    return data;
  }

}
