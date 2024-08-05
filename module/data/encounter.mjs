export default class IntoTheOddEncounterData extends foundry.abstract.TypeDataModel {
    /** @override */
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            description: new fields.HTMLField({ required: false, blank: true, initial: "", textSearch: true }),
            hp: new fields.SchemaField({
                value: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
                max: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 10, min: 0 }),
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
                })
            }),
            armour: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 })
        };
    }

    /** @override */
    static LOCALIZATION_PREFIXES = ["INTOTHEODD.Encounter"];  
}