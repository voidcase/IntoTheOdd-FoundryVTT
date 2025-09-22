import { LEVEL } from "../config.mjs"

export default class IntoTheOddCharacterData extends foundry.abstract.TypeDataModel {
  /** @override */
  static defineSchema() {
    const fields = foundry.data.fields

    return {
      biography: new fields.HTMLField({ required: false, blank: true, initial: "", textSearch: true }),
      hp: new fields.SchemaField({
        value: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
        max: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
      }),
      deprived: new fields.BooleanField({ required: true, nullable: false, initial: false }),
      critical: new fields.BooleanField({ required: true, nullable: false, initial: false }),
      level: new fields.StringField({
        required: true,
        nullable: false,
        initial: LEVEL.NOVICE,
        choices: Object.fromEntries(Object.entries(LEVEL).map(([key, value]) => [value, { label: `INTOTHEODD.Level.${value}` }])),
      }),
      abilities: new fields.SchemaField({
        str: new fields.SchemaField({
          value: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
          max: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
        }),
        dex: new fields.SchemaField({
          value: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
          max: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
        }),
        wil: new fields.SchemaField({
          value: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
          max: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
        }),
      }),
      wealth: new fields.SchemaField({
        guilders: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
        shillings: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
        pennies: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
      }),
      electricBastionland: new fields.SchemaField({
        cha: new fields.SchemaField({
          value: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
          max: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
        }),
        pounds: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
        debt: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
      }),
    }
  }

  /** @override */
  static LOCALIZATION_PREFIXES = ["INTOTHEODD.Character"]

  /** @override */
  prepareBaseData() {
    this.armour = this.parent.items
      .filter((item) => item.system.subType === "armour" && item.system.equipped)
      .map((item) => item.system.armour)
      .reduce((acc, curr) => acc + curr, 0)
  }

  /**
   * A few minutes of rest and a swig of water recovers all of a character’s lost hp.
   */
  shortRest() {
    if (this.deprived) {
      ui.notifications.warn(game.i18n.localize("INTOTHEODD.Warns.canNotRest"))
      return
    }
    return this.parent.update({ "system.hp.value": this.hp.max })
  }

  /**
   * A Full Rest requires a week of downtime at a comfortable location. This restores all Ability Scores
   */
  fullRest() {
    if (this.deprived) {
      ui.notifications.warn(game.i18n.localize("INTOTHEODD.Warns.canNotRest"))
      return
    }
    return this.parent.update({
      "system.hp.value": this.hp.max,
      "system.abilities.str.value": this.abilities.str.max,
      "system.abilities.dex.value": this.abilities.dex.max,
      "system.abilities.wil.value": this.abilities.wil.max,
    })
  }
}
