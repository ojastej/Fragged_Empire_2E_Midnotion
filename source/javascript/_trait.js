/**
 * Post notes to chat
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const postNotes = async function({trigger,attributes,sections,casc})
{
	const rollObj = {
		title: 'Notes',
		description: attributes['general_notes']
		};
	const roll = await executeRoll({rollObj,attributes,sections});

	finishRoll(roll.rollId);
}
k.registerFuncs({postNotes});

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
	var name = '';

	switch (section)
	{
		case 'equipment':
			name = attributes[`repeating_${section}_${rowId}_item`];
			slots = attributes[`repeating_${section}_${rowId}_size`];
			if (slots == 'i')
			{
				slots = '0 (innate)';
			}
			else if (slots == 'n')
			{
				slots = '0 (natural)';
			}
			item_type = attributes[`repeating_${section}_${rowId}_type`];
			resources = attributes[`repeating_${section}_${rowId}_resources`];
			rollObj = {
				title: name ? name : ' ',
				source: section,
				requirements: `${item_type}, ${slots} slots, ${resources} resources`,
				description: attributes[`repeating_${section}_${rowId}_description`]
			};
			break;
		
		case 'perkcomplication':
			name = attributes[`repeating_${section}_${rowId}_perk`];
			rollObj = {
				title: name ? name : ' ',
				source: 'Perks',
				description: attributes[`repeating_${section}_${rowId}_description`]
			};
			break;

		case 'spacecraftsystems':
			// find our data
			const cargo_used = attributes[`repeating_${section}_${rowId}_cargo_used`];
			const system_name = attributes[`repeating_${section}_${rowId}_name`];
			const influence_cost = attributes[`repeating_${section}_${rowId}_influence_cost`];
			const description = attributes[`repeating_${section}_${rowId}_description`];
			// define the data to pass to the template
			rollObj = {
				title: system_name ? system_name : ' ',
				source: 'System',
				requirements: `${cargo_used} cargo, ${influence_cost} influence`,
				description: description
			};
			break;

		case 'spacecrafttradegoods':
			cargo_type = attributes[`repeating_${section}_${rowId}_type`];
			quantity = attributes[`repeating_${section}_${rowId}_quantity`];
			detail = attributes[`repeating_${section}_${rowId}_detail`];
			// define the data to pass to the template
			rollObj = {
				title: cargo_type ? cargo_type : ' ',
				source: 'Cargo',
				requirements: `${quantity} cargo`,
				description: detail
			};
			break;

		case 'specializations':
			name = attributes[`repeating_${section}_${rowId}_specialization`];
			rollObj = {
				title: name ? name : ' ',
				source: 'Specialization',
				description: '+2 to all non-Acquisition and non-Attack Rolls narratively connected to this topic.'
			};
			break;

		case 'tradegoods':
			cargo_type = attributes[`repeating_${section}_${rowId}_type`];
			quantity = attributes[`repeating_${section}_${rowId}_quantity`];
			detail = attributes[`repeating_${section}_${rowId}_detail`];
			rollObj = {
				title: cargo_type ? cargo_type : ' ',
				source: 'Acquistions',
				requirements: `${quantity} boxes (${quantity/4} cargo)`,
				description: detail
			};
			break;

		default:
			const default_name = attributes[`repeating_${section}_${rowId}_name`];
			rollObj = {
				title: default_name ? default_name : ' ',
				source: section,
				description: attributes[`repeating_${section}_${rowId}_description`]
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
