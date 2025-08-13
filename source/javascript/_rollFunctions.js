/**
 * Starts the process of rolling an attack check
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const rollAttack = async function({trigger,attributes,sections,casc}){
	console.log("rollAttack()", trigger, attributes, sections, casc);
	const [section,rowID] = k.parseTriggerName(trigger.name);
	const row = `${section}_${rowID}`;
	const rollName = attributes[`${row}_weapon`];
	const skillName = attributes[`${row}_skill`];
	const skillDetails = getSkillRollModifiers(skillName,attributes);
	const rollObj = Object.assign({
		title:rollName,
		source:skillName,
		roll: `[[(2+?{Munitions|0})d6]]`
		}, skillDetails);
	const roll = await executeRoll({rollObj,attributes,sections});
	const computedResults = {
		roll: "100"
	}
	finishRoll(roll.rollId); //, computedResults
};
k.registerFuncs({rollAttack});

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

	console.log("rollSkill()", trigger, attributes, sections, casc);

	//finishRoll(roll.rollId);
	const skillName = trigger.name.replace(/-action$/,'');
	const skillDetails = getSkillRollModifiers(skillName,attributes);
	const rollAttr = skillName.replace(/-/g,'_');
	const rollTransKey = skillName.replace(/-/g,' ');
	//${attributes[rollAttr]}[${k.capitalize(getTranslationByKey(rollTransKey))}]]]
	const rollObj = Object.assign({
		title:`${skillName}`,
		roll: `[[@{whisper} 1d6]]`,
		roll1: `[[@{whisper} 1d6]]`,
		roll2: `[[@{whisper} 1d6]]`
		}, skillDetails);
	console.log ("rollSkill()", skillName, rollAttr, rollTransKey, rollObj);
	const roll = await executeRoll({rollObj,attributes,sections});
	// see https://wiki.roll20.net/Custom_Roll_Parsing
	// replaces the 'roll' key above with "Result", where the hover shows the roll results
	const computedResults = {
		roll: "Result",
		roll1: "1",
		roll2: "2",
		roll3: "3",
		roll4: 4,
		roll5: 5,
		roll6: 6
	};
	finishRoll(roll.rollId, computedResults);
};
k.registerFuncs({rollSkill});

const getSkillRollModifiers = (skillName,attributes) => {
	return {
		trained: attributes[`${skillName}_trained`] ? 1 : attributes['untrained'],
		toolbox: attributes[`${skillName}_toolbox`],
		workshop: attributes[`${skillName}_workshop`],
		//attribute: allSkills[skillName],
		attributeModifier: attributes[`${skillName}_attribute_modifier`],
		modifier: attributes[`${skillName}_modifier`],
		total: attributes[skillName]
	};
};

const assembleRoll = (rollObj,attributes,sections) => {
	console.log ("assembleRoll()", attributes.template_start);
	return Object.entries(rollObj).reduce((str,[field,content])=>{
		return str += ` {{${field}=${content}}}`;
	},'@{template_start}');
};

/**
 * Executes the roll. Uses a callback if any computations are required.
 * @param {object} rollObj - Object describing the roll fields to be used
 * @param {object} attributes - The character attributes
 * @param {object[]} sections - The sections array
 * @returns {Promise} - Resolves to the roll results object
 */
const executeRoll = async ({rollObj,attributes,sections}) => {
	const rollString = assembleRoll(rollObj,attributes,sections);
	return startRoll(rollString);
};
