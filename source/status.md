# Status

## Todo

* NPC sheet
  * NPC type?
* Spacecraft sheet
* languages? workaround: racial details
* species details? workaround: perks
* outfit/weapon variations and mods? workaround: description
* default values missing (skill total, blue)
* send perk to chat
* send equipment to chat
* calculate bulk used
* calculate max secondaries with mod (final = calc + mod)
  * armour= (outfit) + mod
  * perks= influence/5
* expanding a trait box also extends some but not all controls vertically
* placeholder text for Trait box
* when setting a currentMax control, default the other part to the same value if empty
* trait details for outpost population
* no place to put in stats for outfit
  * def mod
  * endurance
  * armour
  * at 0 endurance
  * type
* hide Bodies field for PCs
* Need an Other species with text box
* hexagonal checkboxes ⬡⬢＋ ?
  * material School, Build, Home Work/Store ?

## Up next

* Outpost sheet
  * cargo space contents
  * mass combat stuff
  * buildings
  * calculate cargo space used: trade boxes/4 + buildings
  * calculate influence cost: sum over attributes of n*(n+1)/2, +2*traits

## Release 5 2025-10-11+

* fixed Equipment Slots calculation
* moved all PC calculations into constants file
* fixed misaligned dropdown chevrons
* fixed column headers for Outpost attributes

## Release 4 2025-09-19

* always display acquisition bonus instead of conditionally adding it in
* added a Bodies field to the character bits
* if Bodies > 0, prompt for number of attacking bodies when making an attack roll

## Release 3 2025-09-12

* Outpost Wealth not calculating properly; getting confused with player skill Wealth

## Release 2

* fixed attribute trait display
* fixed weapon hit bonus not showing up in rolls

## Release 1 2025-08-22

* fixed munitions per weapon instead of per-char
* renamed weapon hitDice to hit_dice for consistency
* added hover on Tr/TB/WS labels to show tooltip
* fixed combat skill rolls with undefined tb/ws in roll template
* fixed blue borders for auto-calculated fields in light mode
* fixed illegible dropdown colours in dark mode
* added calculations for
  * resources max= level+3
  * influence max= level+3
  * combat order= int + ref/10
  * defence= 10 + ref
  * endurance= 10+(str*5)
  * recovery= grit
  * equipment slots= 6+str
* showing numerical bulk in dropdown
* added calculation outline to attribute modifiers
* shortened attribute modifier column heading and added tooltip
* Outpost sheet
  * attributes
  * calculated stats
  * production
  * trade goods
  * notes
* moved combat-related calculated stats to a separate section
* added acquisition modifier and checkbox
* clarified level and session inputs

## Release 0 (2025-08-15)
