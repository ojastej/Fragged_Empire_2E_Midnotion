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
	//${attributes[rollAttr]}[${k.capitalize(getTranslationByKey(rollTransKey))}]]]
	const rollObj = {
		title:`${rollName}`,
		roll_name: 'roll_name',
		description: 'description',
		roll:`[[@{whisper} 3d6]]`
		};
	console.log ("rollSkill()", rollName, rollAttr, rollTransKey, rollObj);
	const roll = await executeRoll({rollObj,attributes,sections});
	// see https://wiki.roll20.net/Custom_Roll_Parsing
	// replaces the 'roll' key above with "testing", where the hover shows the 3d6 results
	const computedResults = {
		roll: "testing"
	};
	finishRoll(roll.rollId, computedResults);
};
k.registerFuncs({rollSkill});

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
