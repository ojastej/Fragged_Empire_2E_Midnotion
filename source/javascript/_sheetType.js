/**
 * Sets the pc/npc specific button displays
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const sheetTypeDisplay = function({trigger,attributes,sections,casc}){
	console.log ("sheetTypeDisplay()", attributes.character_type);
	switch (attributes.character_type)
	{
		case 'npc':
			$20('.tabs--sheet-tabs__button--pc').addClass('inactive');
			$20('.tabs--sheet-tabs__button--npc').removeClass('inactive');
			$20('.tabs--sheet-tabs__button--outpost').addClass('inactive');
			$20('.tabs--sheet-tabs__button--spacecraft').addClass('inactive');
			break;
		case 'outpost':
			$20('.tabs--sheet-tabs__button--pc').addClass('inactive');
			$20('.tabs--sheet-tabs__button--npc').addClass('inactive');
			$20('.tabs--sheet-tabs__button--outpost').removeClass('inactive');
			$20('.tabs--sheet-tabs__button--spacecraft').addClass('inactive');
			break;
		case 'spacecraft':
			$20('.tabs--sheet-tabs__button--pc').addClass('inactive');
			$20('.tabs--sheet-tabs__button--npc').addClass('inactive');
			$20('.tabs--sheet-tabs__button--outpost').addClass('inactive');
			$20('.tabs--sheet-tabs__button--spacecraft').removeClass('inactive');
			break;
		default:	// pc
			$20('.tabs--sheet-tabs__button--pc').removeClass('inactive');
			$20('.tabs--sheet-tabs__button--npc').addClass('inactive');
			$20('.tabs--sheet-tabs__button--outpost').addClass('inactive');
			$20('.tabs--sheet-tabs__button--spacecraft').addClass('inactive');
	}
};
k.registerFuncs({sheetTypeDisplay},{type:['opener']});
