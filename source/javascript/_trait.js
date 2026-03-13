/**
 * Post a repeating item to chat
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const postRepeating = async function({trigger,attributes,sections,casc}) {
	console.log ('postRepeating()', trigger, attributes, sections, casc);
	const rollName = trigger.name.replace(/-action$/,'');
	const [repeating, section, rowId, button] = rollName.split('_');
	console.log ("executeRoll()", rollName, repeating, section, rowId, button);

	// setup a default, blank post
	var rollObj = {
		title: 'Blank'
	};

	if (section == 'spacecraftsystems')
	{
		// find our data
		const cargo_used = attributes[`repeating_${section}_${rowId}_cargo_used`];
		const name = attributes[`repeating_${section}_${rowId}_name`];
		const influence_cost = attributes[`repeating_${section}_${rowId}_influence_cost`];
		const description = attributes[`repeating_${section}_${rowId}_description`];
		// define the data to pass to the template
		rollObj = {
			title: name ? name : ' ',
			source: 'System',
			requirements: `${cargo_used} cargo, ${influence_cost} influence`,
			description: description
			};
	}

	// console.log ("executeRoll()", rollName, rollAttr, rollTransKey, rollObj);
	const roll = await executeRoll({rollObj,attributes,sections});

	finishRoll(roll.rollId);
}
k.registerFuncs({postRepeating});

/**
 * Post a trait to chat using a template
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const postTrait = async function({trigger,attributes,sections,casc}) {
	//console.log ('postTrait()', trigger, attributes, sections, casc);

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
