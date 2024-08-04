export default class IntoTheOddItemData extends foundry.abstract.TypeDataModel {
    /** @override */
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            subType: new fields.StringField(
                {
                    required: true, nullable: false, initial: "weapon", choices: {
                        equipment: { label: "INTOTHEODD.Item.SubType.equipment" },
                        armour: { label: "INTOTHEODD.Item.SubType.armour" },
                        weapon: { label: "INTOTHEODD.Item.SubType.weapon" }
                    }
                }),
            description: new fields.HTMLField({ required: false, blank: true, initial: "", textSearch: true }),
            armour: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
            quantity: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
            damageFormula: new fields.StringField({ required: false, nullable: true }),
            equipped: new fields.BooleanField({ required: true, nullable: false, initial: false }),
            bulky: new fields.BooleanField({ required: true, nullable: false, initial: false }),
            blast: new fields.BooleanField({ required: true, nullable: false, initial: false }),
            arcana: new fields.BooleanField({ required: true, nullable: false, initial: false })
        };
    }

    /** @override */
    static LOCALIZATION_PREFIXES = ["INTOTHEODD.Item"];

    get isArmor() {
        return this.subType === "armour";
    }

    get isWeapon() {
        return this.subType === "weapon";
    }

    get isEquipped() {
        return this.equipped;
    }

    get isBulky() {
        return this.bulky;
    }

    get isBlast() {
        return this.blast;
    }

    get isArcana() {
        return this.arcana;
    }

    get hasQuantity() {
        return this.quantity > 1;
    }

    get hasDamage() {
        return !!this.damageFormula;
    }
}