/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class IntoTheOddItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["intotheodd", "sheet", "item"],
      width: 420,
      height: 320
    });
  }

  /** @override */
  get template() {
    const path = "systems/intotheodd/templates/item";
    // Return a single sheet for all item types.
    return `${path}/item-sheet.html`;
    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.

    // return `${path}/${this.item.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const context = super.getData();
    context.systemData = context.item.system;
    context.enrichedDescription = TextEditor.enrichHTML(context.systemData.description, {async: false});
    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Roll handlers, click handlers, etc. would go here.
  }
}
