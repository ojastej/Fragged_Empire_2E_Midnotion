/**
 * Function to calculate the attribute modifier
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcAttributeSkillMod = function({trigger,attributes,sections,casc}){
	// baseName == "intelligence_skill_mod", so split off first part
	const baseName = `${trigger.name}`.split("_")[0];
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
 * Function to calculate the attribute modifier
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcSkill = function({trigger,attributes,sections,casc}){
	console.log ('calcSkill()', trigger, attributes, sections, casc);
	const skillName = trigger.name;

	// attributeSkillMod + trained/untrained + toolbox + workshop + mod

	return (attributes[`${skillName}_trained`] ? 1 : attributes['untrained']) +
		attributes[`${skillName}_toolbox`] +
		attributes[`${skillName}_workshop`] +
		attributes[`${skillName}_modifier`] +
		attributes[`${skillName}_attribute_modifier`];
};
k.registerFuncs({calcSkill});

/**
 * Starts the process of rolling a basic skill check
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const rollSkill = async function({trigger,attributes,sections,casc}){
	// const [section,rowID,button] = k.parseTriggerName(trigger.name);
	// const row = section ?
	// 	`${section}_${rowID}` :
	// 	'';
	// const rollName = button.replace(/-?action$/,'');
	// const [modifier,,rollTransKey] = getSkillRollModifier(rollName,attributes,row);
	// const rollObj = {
	// 	title:section ?
	// 		attributes[`${row}_name`]:
	// 		`^{${rollTransKey}}`,
	// 	roll:`[[@{roll_state}${modifier}]]]`
	// 	};
	// const roll = await executeRoll({rollObj,attributes,sections});

	//console.log("rollSkill()", trigger, attributes, sections, casc);

	//finishRoll(roll.rollId);
	const rollName = trigger.name.replace(/-action$/,'');
	const rollAttr = rollName.replace(/-/g,'_');
	const rollTransKey = rollName.replace(/-/g,' ');
	const rollObj = {
		title:`^{${rollName}}`,
		roll:`[[@{roll_state} + ${attributes[rollAttr]}[${k.capitalize(getTranslationByKey(rollTransKey))}]]]`
		};
	const roll = await executeRoll({rollObj,attributes,sections});
	finishRoll(roll.rollId);
};
k.registerFuncs({rollSkill});

console.log ("calculations workers registered");
