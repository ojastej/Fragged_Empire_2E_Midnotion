# Status

## Todo

* languages? workaround: racial details
* racial details? workaround: perks
* outfit/weapon variations and mods? workaround: description
* default values missing (skill total, blue)
* send perk to chat
* send equipment to chat
* calculate bulk used
* calculate max secondaries with mod (final = calc + mod)
  * equipment slots= 6+str
  * armour= (outfit)
  * perks= influence/5
* level/session not intuitive
* clean up Character section UI; maybe collapse the calculations with a button?

## In progress

* acquisition modifier and checkbox to apply or not
  * layout needs to be cleaned up
  * fix checkbox appearance
  * update rollSkill() to refer to the field
* updater script to copy weapon hitDice to hit_dice

## Release 1 (TBD)

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
* showing numerical bulk in dropdown
* added calculation outline to attribute modifiers
* shortened attribute modifier column heading and added tooltip

## Release 0 (2025-08-15)
