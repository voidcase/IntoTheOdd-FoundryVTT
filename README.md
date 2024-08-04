# Into the Odd for Foundry VTT

This project enables you to play [this game](https://www.drivethrurpg.com/product/145536/Into-the-Odd) on [this virtual tabletop software](https://foundryvtt.com/).

![](screenshot.png)
Map in the background made by [Dyson Logos](https://dysonlogos.blog/).

## Installation

Follow [this guide](https://foundryvtt.com/article/installation/#system) to install game systems in Foundry VTT.

Manifest URL: https://raw.githubusercontent.com/voidcase/IntoTheOdd-FoundryVTT/master/system.json

## Development philosophy of this project

You will still need the book to play.
The goal of the project is only to make Into the Odd playable in Foundry VTT.
One of the core mottos of the OSR is "Rulings, not rules".
It is important that the game system implementation does not get in the way of the GM when they want to make a ruling.

The version is now the Remastered Version

## Features

### Character Sheet
- Strength, Dexterity and Willpower
- Hitpoints
- Armor : calculated automatically based on Item with the subType Armour
- Experience level
- Deprived and Critical statuses
- In the menu : Short rest and Full rest implemented (if not deprived)
- Biography : Text editor
- Inventory : List of all the items, with for each item a menu (Roll damage, Equip, Unequip, Edit, Delete)

### Encounter Sheet

### Item Sheet
- SubType : Armour, Weapon or Equipment
- Arcana, Bulky and Equipped information
