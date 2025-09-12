# Status

## Todo

* NPC sheet
  * NPC type?
* Spacecraft sheet
* languages? workaround: racial details
* racial details? workaround: perks
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

## In progress

* acquisition modifier and checkbox to apply or not
  * fix checkbox appearance
* updater script to copy weapon hitDice to hit_dice
* Outpost sheet
  * cargo space contents
  * mass combat stuff
* hexagonal checkboxes ⬡⬢＋
  * material School, Build, Home Work/Store

## Release 3

* Outpost Wealth not calculating properly; getting confused with player skill Wealth

## Release 2

* fixed attribute trait display
* fixed weapon hit bonus not showing up in rolls

## Release 1 (2025-08-22)

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
