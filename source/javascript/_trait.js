/**
 * Post a trait to chat using a template
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const postTrait = async function({trigger,attributes,sections,casc}) {
	console.log ('postTrait()', trigger, attributes, sections, casc);

	const rollName = trigger.name.replace(/-action$/,'');
	const rollSource = rollName.split('-')[0];
	const rollAttr = rollName.replace(/-/g,'_');
	const rollTransKey = rollName.replace(/-/g,' ');
	const rollObj = {
		title: attributes[rollAttr],
		source: rollSource,
		requirements: attributes[`${rollAttr}_requirements`],
		description: attributes[`${rollAttr}_text`]
		};
	console.log ("executeRoll()", rollName, rollAttr, rollTransKey, rollObj);
	const roll = await executeRoll({rollObj,attributes,sections});

	finishRoll(roll.rollId);
}
k.registerFuncs({postTrait});
