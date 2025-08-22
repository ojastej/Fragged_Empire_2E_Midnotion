// rename weapon_$X_hitDice to weapon_$X_hit_dice
const updateTo1 = function({trigger,attributes,sections,casc}){
  console.warn("Updating sheet data to version 1", attributes);
  //attributes['hit_dice'] = attributes['hitDice'];
};
k.registerFuncs({'1':updateTo1},{type:['updater']});

console.log ("updaters init", k.sheetName, k.version, k);
