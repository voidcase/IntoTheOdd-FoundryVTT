export default class IntoTheOddChat {

    /**
     * 
     * @param {*} actor The emitter of the chat message
     */
    constructor(actor) {
        this.actor = actor;
        this.chat = null;
        this.content = null;
        this.template = null;
        this.data = null;
        this.chatData = null;
        this.flags = null;
        this.rolls = null;
    }

    /**
     * @description Sets the specified message content
     * @param {*} content 
     * @returns the instance
     */
    withContent(content) {
        this.content = content;
        return this;
    }

    /**
     * @description Sets the specified template used to create the message content
     * @param {*} template The path of the file template to set
     * @returns the instance
     */    
    withTemplate(template) {
        this.template = template;
        return this;
    }

    /**
     * @description Sets the specified data used to create the message content
     * @param {*} data The data of the file template to set
     * @returns the instance
     */
    withData(data) {
        this.data = data;
        return this;
    }

    /**
     * @description Sets the flags parameter
     * @param {*} flags 
     * @returns the instance
     */
    withFlags(flags) {
        this.flags = flags;
        return this;
    }

    /**
     * Indicates if the chat is a roll
     * @param rolls all the rolls
     * @returns the instance.
     */
    withRolls(rolls) {
        this.rolls = rolls;
        return this;
    }

    /**
     * @description Creates the chat message
     * @returns this instance
     */
    async create() {
        // Retrieve the message content
        if (!this.content && this.template && this.data) {
            this.content = await this._createContent();
        }

        // Exit if message content can't be created
        if (!this.content) {
            return null;
        }

        // Create the chat data
        const messageData = {
            user: game.user.id,
            speaker: {
                actor: this.actor.id,
                alias: this.actor.name,
                scene: null,
                token: null,
            },
            content: this.content,
            rolls: []
        }

        // Set the roll parameter if necessary
        if (this.rolls) {
            messageData.style = CONST.CHAT_MESSAGE_STYLES.OTHER;;
            const pool = foundry.dice.terms.PoolTerm.fromRolls(this.rolls);
            messageData.rolls.push(Roll.defaultImplementation.fromTerms([pool]));
        }
        // Set the flags parameter if necessary
        if (this.flags) {
            messageData.flags = this.flags;
        }

        // Set the whisper and blind parameters according to the player roll mode settings
        switch (game.settings.get('core', 'rollMode')) {
            case 'gmroll':
                messageData.whisper = ChatMessage.getWhisperRecipients('GM').map((u) => u.id);
                break;
            case 'blindroll':
                messageData.whisper = ChatMessage.getWhisperRecipients('GM').map((u) => u.id);
                messageData.blind = true;
                break;
            case 'selfroll':
                messageData.whisper = [game.user.id];
                break;
        }
       
        this.chatData = messageData;

        return this;

    }

    /**
     * @description Creates the message content from the registered template
     * @returns the message content or null i an error occurs
     * @private
     */
    async _createContent() {

        // Update the data to provide to the template
        const d =  foundry.utils.duplicate(this.data);
        d.owner = this.actor.id;

        // Call the template renderer.
        return await renderTemplate(this.template, d);

    }

    /**
    * @description Displays the chat message
    * @returns this instance
    */
    async display() {
        // Create the chat
        this.chat = await ChatMessage.implementation.create(this.chatData);
        return this;
    }

}