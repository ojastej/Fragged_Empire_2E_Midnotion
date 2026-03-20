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
	//console.log ('postRepeating()', trigger, attributes, sections, casc);
	const rollName = trigger.name.replace(/-action$/,'');
	const [section,rowID] = k.parseTriggerName(trigger.name);
	const row = `${section}_${rowID}`;
	///const [repeating, section, rowId, button] = rollName.split('_');
	//console.log ("executeRoll()", rollName, repeating, section, rowId, button);

	var rollObj = {};

	switch (section)
	{
		case 'equipment':
			rollObj = postEquipment (attributes, section, rowId);
			break;
		
		case 'perkcomplication':
			rollObj = postPerk (attributes, section, rowId);
			break;

		case 'spacecraftsystems':
			rollObj = postSpacecraftSystem (attributes, section, rowId);
			break;

		case 'spacecrafttradegoods':
			rollObj = postSpacecraftCargo (attributes, section, rowId);
			break;

		case 'specializations':
			rollObj = postSpecialization (attributes, section, rowId);
			break;

		case 'tradegoods':
			rollObj = postAcquisition (attributes, section, rowId);
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
	//const rollTransKey = rollName.replace(/-/g,' ');
	const rollObj = {
		title: attributes[rollAttr],
		source: rollSource,
		requirements: attributes[`${rollAttr}_requirements`],
		description: attributes[`${rollAttr}_text`]
		};
	//console.log ("executeRoll()", rollName, rollAttr, rollTransKey, rollObj);
	const roll = await executeRoll({rollObj,attributes,sections});

	finishRoll(roll.rollId);
}
k.registerFuncs({postTrait});

function postAcquisition (attributes, section, rowId)
{
	cargo_type = attributes[`repeating_${section}_${rowId}_type`];
	quantity = attributes[`repeating_${section}_${rowId}_quantity`];
	subheading = null;
	switch (cargo_type)
	{
		case 'knowledge':
		case 'network':
		case 'research':
			subheading = `${quantity} units`;
			break;
		default:
			subheading = `${quantity} boxes (${quantity/4} cargo)`;
	}
	detail = attributes[`repeating_${section}_${rowId}_detail`];
	return {
		title: cargo_type ? cargo_type : ' ',
		source: 'Acquisitions',
		subheading: subheading,
		description: detail
	};
}

function postEquipment (attributes, section, rowId)
{
	name = attributes[`repeating_${section}_${rowId}_item`];
	item_type = attributes[`repeating_${section}_${rowId}_type`];
	resources = attributes[`repeating_${section}_${rowId}_resources`];

	slots = attributes[`repeating_${section}_${rowId}_size`];
	if (slots == 'i')
	{
		slots = '0 slots (innate)';
	}
	else if (slots == 'n')
	{
		slots = '0 slots (natural)';
	}
	else
	{
		slots = `${slots} slots`;
	}

	return {
		title: name ? name : ' ',
		source: section,
		subheading: `${item_type}, ${slots}, ${resources} resources`,
		description: attributes[`repeating_${section}_${rowId}_description`]
	};
}

function postPerk (attributes, section, rowId)
{
	name = attributes[`repeating_${section}_${rowId}_perk`];
	return {
		title: name ? name : ' ',
		source: 'Perks',
		description: attributes[`repeating_${section}_${rowId}_description`]
	};
}

function postSpacecraftCargo (attributes, section, rowId)
{
	cargo_type = attributes[`repeating_${section}_${rowId}_type`];
	quantity = attributes[`repeating_${section}_${rowId}_quantity`];
	detail = attributes[`repeating_${section}_${rowId}_detail`];

	return {
		title: cargo_type ? cargo_type : ' ',
		source: 'Cargo',
		requirements: `${quantity} cargo`,
		description: detail
	};
}

function postSpacecraftSystem (attributes, section, rowId)
{
	const cargo_used = attributes[`repeating_${section}_${rowId}_cargo_used`];
	const system_name = attributes[`repeating_${section}_${rowId}_name`];
	const influence_cost = attributes[`repeating_${section}_${rowId}_influence_cost`];
	const description = attributes[`repeating_${section}_${rowId}_description`];

	return {
		title: system_name ? system_name : ' ',
		source: 'System',
		subheading: `${cargo_used} cargo, ${influence_cost} influence`,
		description: description
	};
}

function postSpecialization (attributes, section, rowId)
{
	name = attributes[`repeating_${section}_${rowId}_specialization`];
	return {
		title: name ? name : ' ',
		source: 'Specialization',
		description: '+2 to all non-Acquisition and non-Attack Rolls narratively connected to this topic.'
	};
}
