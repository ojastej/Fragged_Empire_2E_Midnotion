/**
 * Function to calculate the attribute modifier
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcAttributeSkillMod = function({trigger,attributes,sections,casc}){
	const baseName = `${trigger.name}_goal`;
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
