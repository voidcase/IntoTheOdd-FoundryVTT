/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class IntoTheOddActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["intotheodd", "sheet", "actor"],
      template: "systems/intotheodd/templates/actor/actor-sheet.html",
      width: 500,
      height: 500,
      tabs: [
		  {navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" },
	  ]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();

    if (this.actor.isOwner) {
      buttons = [
        {
          label: 'Rest',
          class: 'rest-up',
          icon: 'fas fa-bed',
          onclick: () => this._rest(),
        },
      ].concat(buttons);
    }

    return buttons;
  }

  /** @override */
  async getData() {
    const context = super.getData();
    context.systemData = context.actor.system;
    context.enrichedBiography = await TextEditor.enrichHTML(context.systemData.biography, {async: true});
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      // this.actor.deleteEmbeddedDocuments('Item', [li.data("itemId")]);
      this.actor.deleteOneItem(li.data('itemId'));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = foundry.utils.duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      ...data,
      name: name,
      type: type,
    };

    // Finally, create the item!
    return this.actor.createEmbeddedDocuments("Item", [itemData])
      .then(items => items[0].sheet.render(true));
    // item.sheet.render(true);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.system);
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      await roll.evaluate();          
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }

  _rest() {
    let d = new Dialog({
      title: 'Rest',
      buttons: {
        short: {
          label: 'Short Rest',
          callback: () => this.actor.rest(false),
        },
        full: {
          label: 'Full Rest',
          callback: () => this.actor.rest(true),
        },
      },
      default: 'short',
      close: () => {
        this.render(false);
      },
    });
    d.render(true);
  }
}
