/**
 * Starts the process of rolling an attack check
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const rollAttack = async function({trigger,attributes,sections,casc}){
	console.group("rollAttack()");
	console.log("rollAttack()", trigger, attributes, sections, casc);
	const [section,rowID] = k.parseTriggerName(trigger.name);
	const row = `${section}_${rowID}`;
	const rollName = attributes[`${row}_weapon`];
	const skillName = attributes[`${row}_skill`];
	const skillDetails = getSkillRollModifiers(skillName,attributes);
	console.log (skillDetails);
	const rollObj = Object.assign({
		title:rollName,
		source:skillName,
		roll: `[[(2+?{Munitions|0})d6 + ${skillDetails.total}]]`,
		roll1: '[[0]]'
		}, skillDetails);

	const roll = await executeRoll({rollObj,attributes,sections});

	const strongHits = countStrongHits(roll);
	console.log("rollAttack().roll", roll);
	const computedResults = {
		roll: "100",
		roll1: strongHits
	}
	finishRoll(roll.rollId, computedResults); //, computedResults
	console.groupEnd();
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

const countStrongHits = (roll) => {
	const strongHits = roll.results.roll.dice.reduce(
		(accumulator, current) => accumulator + (current == 6 ? 1 : 0),
		0
	);
	console.log ("countStrongHits()", roll, strongHits);
	return strongHits;
}

const getSkillRollModifiers = (skillName,attributes) => {
	const primary = {
		toolbox: attributes[`${skillName}_toolbox`],
		workshop: attributes[`${skillName}_workshop`]
	};
	const value = Object.assign({
		trained: attributes[`${skillName}_trained`] ? 1 : attributes['untrained'],
		attributeModifier: attributes[`${skillName}_attribute_modifier`],
		modifier: attributes[`${skillName}_modifier`],
		total: attributes[skillName]
	}, attributes[`${skillName}_toolbox`] === undefined ? {} : primary);
	// console.log ("getSkillRollModifiers()", skillName, attributes[`${skillName}_toolbox`], value);
	return value;
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
