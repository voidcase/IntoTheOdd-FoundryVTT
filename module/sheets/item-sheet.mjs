const { HandlebarsApplicationMixin } = foundry.applications.api

export default class IntoTheOddItemSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {


  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["intotheodd", "item", "equipment"],
    position: {
      width: 350,
      height: 550
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
      template: "systems/intotheodd/templates/equipment-main.hbs"
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
    console.log('equipment context', context);
    return context;
  }

}