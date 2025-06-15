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
    },
    actions: {
      editImage: IntoTheOddItemSheet.#onEditImage
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
      enrichedDescription: await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.document.system.description, { async: true })
    }
    //console.log('equipment context', context);
    return context;
  }

  /**
 * Handle changing a Document's image.
 *
 * @this BoilerplateActorSheet
 * @param {PointerEvent} event   The originating click event
 * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
 * @returns {Promise}
 * @private
 */
  static async #onEditImage(event, target) {
    const attr = target.dataset.edit;
    const current = foundry.utils.getProperty(this.document, attr);
    const { img } =
      this.document.constructor.getDefaultArtwork?.(this.document.toObject()) ??
      {};
    const fp = new FilePicker({
      current,
      type: 'image',
      redirectToRoot: img ? [img] : [],
      callback: (path) => {
        this.document.update({ [attr]: path });
      },
      top: this.position.top + 40,
      left: this.position.left + 10,
    });
    return fp.browse();
  }
}