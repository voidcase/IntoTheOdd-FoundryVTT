const { HandlebarsApplicationMixin } = foundry.applications.api

export default class IntoTheOddEncounterSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
    constructor(options = {}) {
        super(options);
        this.#dragDrop = this.#createDragDropHandlers();
    }

    #dragDrop;

    /** @override */
    static DEFAULT_OPTIONS = {
        classes: ["intotheodd", "actor", "encounter"],
        position: {
            width: 870,
            height: 500
        },
        form: {
            submitOnChange: true
        },
        window: {
            resizable: true
        },
        dragDrop: [{ dragSelector: '[data-drag]', dropSelector: null }],
        actions: {
            edit: IntoTheOddEncounterSheet.#onItemEdit,
            delete: IntoTheOddEncounterSheet.#onItemDelete,
            rollSave: IntoTheOddEncounterSheet.#onItemRollSave,
            rollDamage: IntoTheOddEncounterSheet.#onAttackRollDamage,
            editImage: IntoTheOddEncounterSheet.#onEditImage
        }
    };


    /** @override */
    static PARTS = {
        main: {
            template: "systems/intotheodd/templates/encounter-main.hbs"
        }
    }

    /** @override */
    async _prepareContext() {
        const context = {
            fields: this.document.schema.fields,
            systemFields: this.document.system.schema.fields,
            actor: this.document,
            system: this.document.system,
            source: this.document.toObject(),
            enrichedDescription: await TextEditor.enrichHTML(this.document.system.description, { async: true })
        }

        context.attacks = [];
        const attacksRaw = this.actor.itemTypes.attack;
        for (const item of attacksRaw) {
            item.enrichedDescription = await TextEditor.enrichHTML(item.system.description, { async: true });
            context.attacks.push(item);
        }

        //console.log('encounter context', context);
        return context;
    }

    /** @override */
    _onRender(context, options) {
        this.#dragDrop.forEach((d) => d.bind(this.element));
    }

    //#region Drag-and-Drop Workflow
    /**
    * Create drag-and-drop workflow handlers for this Application
    * @returns {DragDrop[]}     An array of DragDrop handlers
    * @private
    */
    #createDragDropHandlers() {
        return this.options.dragDrop.map((d) => {
            d.permissions = {
                dragstart: this._canDragStart.bind(this),
                drop: this._canDragDrop.bind(this),
            };
            d.callbacks = {
                dragstart: this._onDragStart.bind(this),
                dragover: this._onDragOver.bind(this),
                drop: this._onDrop.bind(this),
            };
            return new DragDrop(d);
        });
    }

    /**
     * Define whether a user is able to begin a dragstart workflow for a given drag selector
     * @param {string} selector       The candidate HTML selector for dragging
     * @returns {boolean}             Can the current user drag this selector?
     * @protected
     */
    _canDragStart(selector) {
        return this.isEditable;
    }

    /**
     * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector
     * @param {string} selector       The candidate HTML selector for the drop target
     * @returns {boolean}             Can the current user drop on this selector?
     * @protected
     */
    _canDragDrop(selector) {
        return this.isEditable;
    }

    /**
     * Callback actions which occur at the beginning of a drag start workflow.
     * @param {DragEvent} event       The originating DragEvent
     * @protected
     */
    _onDragStart(event) {
        const el = event.currentTarget;
        if ('link' in event.target.dataset) return;

        // Extract the data you need
        let dragData = null;

        if (!dragData) return;

        // Set data transfer
        event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    }

    /**
     * Callback actions which occur when a dragged element is over a drop target.
     * @param {DragEvent} event       The originating DragEvent
     * @protected
     */
    _onDragOver(event) { }

    /**
     * Callback actions which occur when a dragged element is dropped on a target.
     * @param {DragEvent} event       The originating DragEvent
     * @protected
     */
    async _onDrop(event) {
        const data = TextEditor.getDragEventData(event);

        // Handle different data types
        switch (data.type) {
            case "Item":
                const item = await fromUuid(data.uuid);
                if (item.type !== "attack") return;
                return await this.actor.createEmbeddedDocuments("Item", [item], { renderSheet: false });
        }
    }

    //#endregion

    //#region Actions    
    /**
    * @param {PointerEvent} event - The originating click event
    * @param {HTMLElement} target - the capturing HTML element which defined a [data-action]
    */
    static #onItemEdit(event, target) {
        const itemId = target.getAttribute('data-item-id');
        const item = this.actor.items.get(itemId);
        item.sheet.render(true);
    }

    /**
     * @param {PointerEvent} event - The originating click event
     * @param {HTMLElement} target - the capturing HTML element which defined a [data-action]
     */
    static async #onItemDelete(event, target) {
        const itemId = target.getAttribute('data-item-id');
        const item = this.actor.items.get(itemId);
        if (item.system.quantity > 1) {
            await item.update({ "system.quantity": item.system.quantity - 1 });
        } else {
            item.delete();
        }
    }

    /**
     * @param {PointerEvent} event - The originating click event
     * @param {HTMLElement} target - the capturing HTML element which defined a [data-action]
     */
    static async #onItemRollSave(event, target) {
        const ability = target.getAttribute('data-ability');
        const roll = await this.actor.rollSave(ability);
        //console.log('roll', roll);
    }

    /**
     * @param {PointerEvent} event - The originating click event
     * @param {HTMLElement} target - the capturing HTML element which defined a [data-action]
     */
    static async #onAttackRollDamage(event, target) {
        const itemName = target.getAttribute('data-name');
        const formula = target.getAttribute('data-formula');
        const roll = await this.actor.rollDamage(itemName, formula);
        //console.log('roll', roll);
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

    //#endregion
}