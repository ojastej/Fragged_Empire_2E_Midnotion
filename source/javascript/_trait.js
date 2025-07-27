// post the trait to chat using a template
const postTrait = (trigger,attributes,sections,casc) => {
	console.log ('postTrait()', trigger, attributes, sections, casc);
}
K.registerFuncs({toggleTrait});

// collapse/expand the trait section
const toggleTrait = (trigger,attributes,sections,casc) => {
	console.log ('toggleTrait()', trigger, attributes, sections, casc);
}
k.registerFuncs({toggleTrait});
