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
	console.log ('calcAttributeSkillMod()', trigger, attributes, sections, casc);

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
 * Function to calculate the attribute modifier
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcSkill = function({trigger,attributes,sections,casc}){
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

console.log ("calculations workers registered");
