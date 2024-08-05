const { HandlebarsApplicationMixin } = foundry.applications.api

export default class IntoTheOddAttackSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {


  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["intotheodd", "item", "attack"],
    position: {
      width: 350,
      height: 500
    },
    form: {
      submitOnChange: true
    },
    window: {
      resizable: true
    }
  };

  /** @override */
  static PARTS = {
    main: {
      template: "systems/intotheodd/templates/attack-main.hbs"
    }
  }

  /** @override */
  async _prepareContext() {
    const context = {
      fields: this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
      item: this.document,
      system: this.document.system,
      source: this.document.toObject(),
      enrichedDescription: await TextEditor.enrichHTML(this.document.system.description, { async: true })
    }
    console.log('attack context', context);
    return context;
  }

}