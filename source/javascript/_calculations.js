/**
 * Calculate a triangular number
 * @param {integer} num 
 * @returns integer
 */
function triangle (num)
{
	const result = num * (num + 1) / 2;
	return result;
}

/**
 * Function to calculate the attribute modifier
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcAttributeSkillMod = function({trigger,attributes,sections,casc}){
	// baseName == "intelligence_skill_mod", so split off first part
	const baseName = `${trigger.name}`.split("_")[0] + '_max';
	//console.log ('calcAttributeSkillMod()', trigger, attributes, sections, casc);

	// An Attribute value of 1 or less gives -1 to specific Skills.
	// An Attribute value of 4 or more gives +1 to specific Skills.
	if (attributes[baseName] <= 1)
	{
		return -1;
	}
	else if (attributes[baseName] >= 4)
	{
		return 1;
	}
	return 0;
};
k.registerFuncs({calcAttributeSkillMod});

/**
 * Function to calculate total equipment bulk
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcBulk = function({trigger,attributes,sections,casc}){
	console.log ('calcBulk()', trigger, attributes, sections, casc);
	// loop over equipment
};
k.registerFuncs({calcBulk});

/**
 * Function to calculate total influence cost
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcInfluenceCost = function({trigger,attributes,sections,casc}){
	// switch on character type
	switch (attributes.character_type)
	{
		case 'outpost':
			return calcOutpostInfluence({trigger,attributes,sections,casc});
		case 'spacecraft':
			return calcSpacecraftInfluence({trigger,attributes,sections,casc});
	}
}
k.registerFuncs({calcInfluenceCost});

/**
 * Function to calculate total cargo space used
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcCargoUsed = function({trigger,attributes,sections,casc}){
	// switch on character type
	switch (attributes.character_type)
	{
		case 'outpost':
			return calcOutpostCargo({trigger,attributes,sections,casc});
		case 'spacecraft':
			return calcSpacecraftCargo({trigger,attributes,sections,casc});
	}
}
k.registerFuncs({calcCargoUsed});

/**
 * Function to calculate total cargo space available
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcCargoSpaceMax = function({trigger,attributes,sections,casc}){
	// switch on character type
	switch (attributes.character_type)
	{
		case 'outpost':
			return calcOutpostCargoSpaceMax({trigger,attributes,sections,casc});
		case 'spacecraft':
			return calcSpacecraftCargoSpaceMax({trigger,attributes,sections,casc});
	}
}
k.registerFuncs({calcCargoSpaceMax});

/**
 * Function to calculate total outpost cargo space used
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcOutpostCargo = function({trigger,attributes,sections,casc}){
	let tradeGoods = attributes.repeating_outposttradegoods.reduce((total,row) => {
		return total + row.quantity;
	},0);
	return Math.ceil(tradeGoods / 4);
};
k.registerFuncs({calcOutpostCargo});

// Workaround
const calcOutpostCargoSpaceMax = function({trigger,attributes,sections,casc}){
	let total = 2 * attributes.prosperity + attributes.cargo_space_max_modifier;
	return total;
};
k.registerFuncs({calcOutpostCargoSpaceMax});

/**
 * Function to calculate total outpost influence cost
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcOutpostInfluence = function({trigger,attributes,sections,casc}){
	// loop over outpost attributes
	// cost is triangular, +2 per trait
	let cost = 0;
	const fields = ['farms','mines','industry','prosperity','security','order'];
	for (const value of fields)
	{
		cost += triangle(attributes[value]) +
			(attributes[`${value}_trait`] == '' ? 0 : 2);
	}
	return cost;
};
k.registerFuncs({calcOutpostInfluence});

/**
 * Function to calculate total spacecraft cargo space used, based on cargo + systems
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcSpacecraftCargo = function({trigger,attributes,sections,casc}){
	let tradeGoods = attributes.repeating_spacecrafttradegoods.reduce((total,row) => {
		return total + row.quantity;
	},0);
	let systemsSpace = attributes.repeating_spacecraftsystems.reduce((total,row) => {
		return total + row.cargo_used;
	},0);
	return Math.ceil(tradeGoods / 4) + systemsSpace;
};
k.registerFuncs({calcSpacecraftCargo});

const calcSpacecraftCargoSpaceMax = function({trigger,attributes,sections,casc}){
	let total = 2 + attributes.hull + attributes.cargo_space_max_modifier;
	return total;
};
k.registerFuncs({calcSpacecraftCargoSpaceMax});

/**
 * Function to calculate total spacecraft influence cost payable by all PCs
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcSpacecraftInfluence = function({trigger,attributes,sections,casc}){
	// cost is build + traits, where each trait has its own cost [-1..2], grr.
	// for now, just use the build and manually adjust
	console.log ("calcSpacecraftInfluence()", attributes.build_cost);
	let cost = attributes.build_cost;
	// loop over weapons and add in those costs
	cost += attributes.repeating_spacecraftweapons.reduce((total,row) => {
		return total + row.influence_cost;
	},0);
	return cost;
};
k.registerFuncs({calcSpacecraftInfluence});

/**
 * Function to calculate total spacecraft sytems influence cost payable, split by PCs
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcSpacecraftSystemsInfluence = function({trigger,attributes,sections,casc}){
	// loop over spacecraft systems
	let systemsCost = attributes.repeating_spacecraftsystems.reduce((total,row) => {
		return total + row.influence_cost;
	},0);
	return systemsCost;
};
k.registerFuncs({calcSpacecraftSystemsInfluence});

/**
 * Function to calculate the attribute modifier
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcSkill = function({trigger,attributes,sections,casc}){
	//console.log ("calcSkill()", trigger, attributes['character_type']);
	if (attributes['character_type'] != 'pc' && attributes['character_type'] != 'npc')
	{
		// quick hack to fix outpost wealth calculation
		if (trigger.name == 'wealth')
		{
			return attributes['prosperity'] + attributes['order'] + attributes['wealth_modifier'];
		}
		return attributes[trigger.name];
	}
	//console.log ('calcSkill()', trigger, attributes, sections, casc);
	const skillName = trigger.name;

	// attributeSkillMod + trained/untrained + toolbox + workshop + mod
	const primaryModifiers =
		(attributes[`${skillName}_attribute_modifier`] ? attributes[`${skillName}_attribute_modifier`] : 0) +
		(attributes[`${skillName}_toolbox`] ? attributes[`${skillName}_toolbox`] : 0) +
		(attributes[`${skillName}_workshop`] ? attributes[`${skillName}_workshop`] : 0);

	return (attributes[`${skillName}_trained`] ? 1 : attributes['untrained']) +
		primaryModifiers +
		attributes[`${skillName}_modifier`];
};
k.registerFuncs({calcSkill});

console.log ("FE2 calculations workers registered");
