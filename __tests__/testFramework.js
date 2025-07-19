// This code adapted from Nic Bradley's R20 test framework from the WFRP4e official sheet.
import { vi } from 'vitest';
import { _ } from 'underscore';
import translation from './translation.json' assert {type:'json'}

/**
 * @namespace {object} mock20
 */
/**
 * @memberof mock20
 * @var
 * A mock environment variable for keeping track of triggers, other character information, and predefined query results.
 * @property {array} triggers - The triggers that have been registered by `on`
 * @property {object} queryResponses - Pre defined results you want the roll parser to use for a given roll query. Keys in the objects are roll query prompts. Values are what the user input should be for that query.
 */
const environment = {
  attributes:{"sheet_version":"0","FE2_tab":"nav-tabs-fe2--settings","character_name":"","species":"","strength":"","strength_max":"","strength_skill_modifier":"0","strength_limit":"5","strength_trait":"","reflexes":"","reflexes_max":"","reflexes_skill_modifier":"0","reflexes_limit":"5","reflexes_trait":"","mobility":"","mobility_max":"","mobility_skill_modifier":"0","mobility_limit":"5","mobility_trait":"","focus":"","focus_max":"","focus_skill_modifier":"0","focus_limit":"5","focus_trait":"","intelligence":"","intelligence_max":"","intelligence_skill_modifier":"0","intelligence_limit":"5","intelligence_trait":"","grit":"","grit_max":"","grit_skill_modifier":"0","grit_limit":"5","grit_trait":"","untrained":"-2","wealth_action":"","wealth_attribute_modifier":"","wealth":"","wealth_trained":0,"wealth_toolbox":0,"wealth_workshop":0,"wealth_modifier":"","wealth_trait":"","persuasion_action":"","persuasion_attribute_modifier":"","persuasion":"","persuasion_trained":0,"persuasion_toolbox":0,"persuasion_workshop":0,"persuasion_modifier":"","persuasion_trait":"","leadership_action":"","leadership_attribute_modifier":"","leadership":"","leadership_trained":0,"leadership_toolbox":0,"leadership_workshop":0,"leadership_modifier":"","leadership_trait":"","psychology_action":"","psychology_attribute_modifier":"","psychology":"","psychology_trained":0,"psychology_toolbox":0,"psychology_workshop":0,"psychology_modifier":"","psychology_trait":"","culture_action":"","culture_attribute_modifier":"","culture":"","culture_trained":0,"culture_toolbox":0,"culture_workshop":0,"culture_modifier":"","culture_trait":"","physical_action":"","physical_attribute_modifier":"","physical":"","physical_trained":0,"physical_toolbox":0,"physical_workshop":0,"physical_modifier":"","physical_trait":"","resolve_action":"","resolve_attribute_modifier":"","resolve":"","resolve_trained":0,"resolve_toolbox":0,"resolve_workshop":0,"resolve_modifier":"","resolve_trait":"","awareness_action":"","awareness_attribute_modifier":"","awareness":"","awareness_trained":0,"awareness_toolbox":0,"awareness_workshop":0,"awareness_modifier":"","awareness_trait":"","stealth_action":"","stealth_attribute_modifier":"","stealth":"","stealth_trained":0,"stealth_toolbox":0,"stealth_workshop":0,"stealth_modifier":"","stealth_trait":"","mechanics_action":"","mechanics_attribute_modifier":"","mechanics":"","mechanics_trained":0,"mechanics_toolbox":0,"mechanics_workshop":0,"mechanics_modifier":"","mechanics_trait":"","electronics_action":"","electronics_attribute_modifier":"","electronics":"","electronics_trained":0,"electronics_toolbox":0,"electronics_workshop":0,"electronics_modifier":"","electronics_trait":"","computers_action":"","computers_attribute_modifier":"","computers":"","computers_trained":0,"computers_toolbox":0,"computers_workshop":0,"computers_modifier":"","computers_trait":"","biotech_action":"","biotech_attribute_modifier":"","biotech":"","biotech_trained":0,"biotech_toolbox":0,"biotech_workshop":0,"biotech_modifier":"","biotech_trait":"","medicine_action":"","medicine_attribute_modifier":"","medicine":"","medicine_trained":0,"medicine_toolbox":0,"medicine_workshop":0,"medicine_modifier":"","medicine_trait":"","astronomy_action":"","astronomy_attribute_modifier":"","astronomy":"","astronomy_trained":0,"astronomy_toolbox":0,"astronomy_workshop":0,"astronomy_modifier":"","astronomy_trait":"","planets_action":"","planets_attribute_modifier":"","planets":"","planets_trained":0,"planets_toolbox":0,"planets_workshop":0,"planets_modifier":"","planets_trait":"","template_start":"@{whisper}&{template:FE2} {{character_name=@{character_name}}} {{character_id=@{character_id}}}"},
  triggers: [],
  translation,
  otherCharacters: {
    // Attribute information of other test characters indexed by character name
  },
  queryResponses:{
    // object defining which value to use for roll queries, indexed by prompt text
  }
};
global.environment = environment;

const on = vi.fn((trigger, func) => {
  environment.triggers.push({ trigger, func });
});
global.on = on;
const getAttrs = vi.fn((query, callback) => {
  let values = {};
  for (const attr of query) {
    if (attr in environment.attributes) values[attr] = environment.attributes[attr];
  }
  if (typeof callback === "function") callback(values);
});
global.getAttrs = getAttrs;
const setAttrs = vi.fn((submit, params, callback) => {
  if (!callback && typeof params === "function") callback = params;
  for (const attr in submit) {
    environment.attributes[attr] = submit[attr];
  }
  if (typeof callback === "function") callback();
});
global.setAttrs = setAttrs;
const getSectionIDs = vi.fn((section, callback) => {
  const ids = [];
  const sectionName = section.indexOf("repeating_") === 0 ? section : `repeating_${section}`;
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(sectionName) === 0) ids.push(attr.split("_")[2]);
  }
  const idMap = [...new Set(ids)];
  if (typeof callback === "function") callback(idMap);
});
global.getSectionIDs = getSectionIDs;
const getSectionIDsSync = vi.fn((section) => {
  const ids = [];
  const sectionName = section.indexOf("repeating_") === 0 ? section : `repeating_${section}`;
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(sectionName) === 0) ids.push(attr.split("_")[2]);
  }
  const idMap = [...new Set(ids)];
  return idMap;
});
global.getSectionIDsSync = getSectionIDsSync;
const removeRepeatingRow = vi.fn((id) => {
  const attributes = environment.attributes;
  for (const attr in attributes) {
    if (attr.indexOf(id) > -1) delete environment.attributes[attr];
  }
});
global.removeRepeatingRow = removeRepeatingRow;
const getCompendiumPage = vi.fn((request, callback) => {
  const pages = compendiumData;
  if (!pages)
    throw new Error(
      "Tried to use getCompendiumPage, but testing environment does not contain compendiumData."
    );
  if (typeof request === "string") {
    const [category, pageName] = request.split(":");
    const response = {
      Name: pageName,
      Category: category,
      data: {},
    };
    if (pages[request]) response.data = pages[request].data;
    if (typeof callback === "function") callback(response);
  } else if (Array.isArray(request)) {
    const pageArray = [];
    for (const page of request) {
      if (pages[request] && pages[request].Category === category) pageArray.push(pages[pageName]);
    }
    if (typeof callback === "function") callback(pageArray);
  }
});
global.getCompendiumPage = getCompendiumPage;
const generateUUID = vi.fn(() => {
  var a = 0,
    b = [];
  return (function () {
    var c = new Date().getTime() + 0,
      d = c === a;
    a = c;
    for (var e = Array(8), f = 7; 0 <= f; f--)
      (e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64)),
      (c = Math.floor(c / 64));
    c = e.join("");
    if (d) {
      for (f = 11; 0 <= f && 63 === b[f]; f--) b[f] = 0;
      b[f]++;
    } else for (f = 0; 12 > f; f++) b[f] = Math.floor(64 * Math.random());
    for (f = 0; 12 > f; f++)
      c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
    return c.replace(/_/g, "z");
  })();
});
global.generateUUID = generateUUID;
const generateRowID = vi.fn(() => {
  return generateUUID().replace(/_/g, "Z");
});
global.generateRowID = generateRowID;
const simulateEvent = vi.fn((event) => {
  environment.triggers.forEach((trigger) => {
    const splitTriggers = trigger.trigger.split(" ") || [trigger.trigger];
    splitTriggers.forEach((singleTrigger) => {
      if (event === singleTrigger) {
        trigger.func({
          sourceAttribute: "test",
        });
      }
    });
  });
});
global.simulateEvent = simulateEvent;
const getTranslationByKey = vi.fn((key) => environment.translation?.[key] || false);
global.getTranslationByKey = getTranslationByKey;
// Roll Handlingglobal.getTranslationByKey = getTranslationByKey;

const extractRollTemplate = (rollString) => {
  const rollTemplate = rollString.match(/&\{template:(.*?)\}/)?.[1];
  environment.attributes.__rolltemplate = rollTemplate;
};

const cleanRollElements = (value) => {
  const cleanText = value
    .replace(/\{\{|\}}(?=$|\s|\{)/g, "")
    .replace(/=/,'===SPLITHERE===');
  const splitText = cleanText.split("===SPLITHERE===");
  return splitText;
};

const extractRollElements = (rollString) => {
  const rollElements = rollString.match(/\{\{(.*?)\}{2,}(?=$|\s|\{)/g);
  if (!rollElements || rollElements.length < 1) return {}
  return  Object.fromEntries(rollElements.map(cleanRollElements));
};

const getExpression = (element) => element.replace(/(\[\[|\]\])/gi, "");

const getDiceOrHalf = (size) => {
  const diceStack = environment.diceStack;
  if (!diceStack?.[size] || diceStack[size].length < 0) return size / 2;
  return environment.diceStack[size].pop();
};

const getDiceRolls = (expression) => {
  const rolls = expression.match(/([0-9]+)?d([0-9]+)/gi);
  if (!rolls) return [];
  const allRolls = [];
  rolls.forEach((roll) => {
    const [number, size] = roll.split(/d/i);
    for (let i = 1; i <= number; i++) {
      const dice = getDiceOrHalf(size);
      allRolls.push(dice);
    }
  });
  return allRolls;
};

const calculateResult = (startExpression, dice) => {
  let expression = startExpression.replace(/\[.+?\]/g,'')

  const rolls = expression.match(/([0-9]+)?d([0-9]+)/gi);
  if (!rolls) return eval(expression);
  rolls.forEach((roll, index) => {
    const [number, size] = roll.split(/d/i);
    let total = 0;
    for (let i = 1; i <= number; i++) {
      total += +dice.shift();
    }
    expression = expression.replace(/([0-9]+d[0-9]+([+\-*/][0-9]+)?)(.*?)$/gi, "$1");
    const regex = new RegExp(roll, "gi");
    expression = expression.replace(regex, total);
  });

  return eval(expression);
};

const replaceAttributes = (element) => {
  const test = /@\{(.*?)\}/i;
  while (test.test(element)) {
    element = element.replace(/@\{(.*?)\}/gi, (sub, ...args) => {
      const attributeName = args[0];
      const attributeValue = environment.attributes[attributeName];
      const attributeExists = typeof attributeValue !== "undefined";
      const possibleAttributes = Object.keys(environment.attributes);
      if (attributeExists) return attributeValue;
      else
        throw new Error(
          `Roll called ${sub} but no corresponding attribute "${attributeName}" was found. Attributes are: ${possibleAttributes.join(
            ", "
          )}`
        );
    });
  }
  return element;
};

const replaceQueries = (element) => {
  return element.replace(/\?\{(.+?)[|}]([^}]+?\})?/g,(match,p,a) => {
    a = a?.split(/\s*\|\s*/) || [];
    return environment.queryResponses[p] || a[0] || '';
  });
};

const calculateRollResult = (rollElements) => {
  const results = {};
  for (const key in rollElements) {
    const element = rollElements[key];
    if (element.indexOf("[[") === -1) continue;
    const attributeFilled = replaceAttributes(element);
    const queryAnswered = replaceQueries(attributeFilled);
    const expression = getExpression(queryAnswered);
    const dice = getDiceRolls(expression);
    const result = calculateResult(expression, [...dice]);
    results[key] = {
      result,
      dice,
      expression,
    };
  }
  return results;
};

const startRoll = vi.fn(async (rollString) => {
  if (!rollString) throw new Error("startRoll expected a Roll String but none was provided.");
  const rollResult = { results: {} };
  extractRollTemplate(rollString);
  const rollElements = extractRollElements(rollString);
  rollResult.results = calculateRollResult(rollElements);
  rollResult.rollId = generateUUID();
  return rollResult;
});
global.startRoll = startRoll;
const finishRoll = vi.fn(() => {});
global.finishRoll = finishRoll;
//# sourceURL=FE2.js
    
    const k = (function(){
    const kFuncs = {};
    
    const cascades = {"attr_character_name":{"name":"character_name","type":"text","defaultValue":"","affects":[],"triggeredFuncs":["setActionCalls"],"listenerFunc":"accessSheet","listener":"change:character_name"},"act_k-network-call":{"name":"k-network-call","type":"action","triggeredFuncs":["kReceive"],"affects":[],"addFuncs":[],"listener":"clicked:k-network-call","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_sheet_version":{"name":"sheet_version","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:sheet_version","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_fe2_tab":{"name":"fe2_tab","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:fe2_tab","listenerFunc":"accessSheet","defaultValue":"nav-tabs-fe2--settings","calculation":"","initialFunc":"","formula":""},"act_nav-tabs-fe2--pc":{"name":"nav-tabs-fe2--pc","type":"action","triggeredFuncs":["kSwitchTab"],"affects":[],"addFuncs":[],"listener":"clicked:nav-tabs-fe2--pc","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_nav-tabs-fe2--npc":{"name":"nav-tabs-fe2--npc","type":"action","triggeredFuncs":["kSwitchTab"],"affects":[],"addFuncs":[],"listener":"clicked:nav-tabs-fe2--npc","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_nav-tabs-fe2--spacecraft":{"name":"nav-tabs-fe2--spacecraft","type":"action","triggeredFuncs":["kSwitchTab"],"affects":[],"addFuncs":[],"listener":"clicked:nav-tabs-fe2--spacecraft","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_nav-tabs-fe2--settings":{"name":"nav-tabs-fe2--settings","type":"action","triggeredFuncs":["kSwitchTab"],"affects":[],"addFuncs":[],"listener":"clicked:nav-tabs-fe2--settings","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_species":{"name":"species","type":"select","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:species","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_strength":{"name":"strength","type":"number","triggeredFuncs":[],"affects":["strength_skill_modifier"],"addFuncs":[],"listener":"change:strength","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_strength_max":{"name":"strength_max","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:strength_max","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_strength_skill_modifier":{"name":"strength_skill_modifier","type":"hidden","triggeredFuncs":[],"affects":["leadership","mechanics"],"addFuncs":[],"listener":"change:strength_skill_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcAttributeSkillMod","initialFunc":"","formula":""},"attr_strength_limit":{"name":"strength_limit","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:strength_limit","listenerFunc":"accessSheet","defaultValue":5,"calculation":"","initialFunc":"","formula":""},"attr_strength_trait":{"name":"strength_trait","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:strength_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_reflexes":{"name":"reflexes","type":"number","triggeredFuncs":[],"affects":["reflexes_skill_modifier"],"addFuncs":[],"listener":"change:reflexes","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_reflexes_max":{"name":"reflexes_max","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:reflexes_max","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_reflexes_skill_modifier":{"name":"reflexes_skill_modifier","type":"hidden","triggeredFuncs":[],"affects":["medicine","planets"],"addFuncs":[],"listener":"change:reflexes_skill_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcAttributeSkillMod","initialFunc":"","formula":""},"attr_reflexes_limit":{"name":"reflexes_limit","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:reflexes_limit","listenerFunc":"accessSheet","defaultValue":5,"calculation":"","initialFunc":"","formula":""},"attr_reflexes_trait":{"name":"reflexes_trait","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:reflexes_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_mobility":{"name":"mobility","type":"number","triggeredFuncs":[],"affects":["mobility_skill_modifier"],"addFuncs":[],"listener":"change:mobility","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_mobility_max":{"name":"mobility_max","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:mobility_max","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_mobility_skill_modifier":{"name":"mobility_skill_modifier","type":"hidden","triggeredFuncs":[],"affects":["physical","stealth"],"addFuncs":[],"listener":"change:mobility_skill_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcAttributeSkillMod","initialFunc":"","formula":""},"attr_mobility_limit":{"name":"mobility_limit","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:mobility_limit","listenerFunc":"accessSheet","defaultValue":5,"calculation":"","initialFunc":"","formula":""},"attr_mobility_trait":{"name":"mobility_trait","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:mobility_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_focus":{"name":"focus","type":"number","triggeredFuncs":[],"affects":["focus_skill_modifier"],"addFuncs":[],"listener":"change:focus","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_focus_max":{"name":"focus_max","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:focus_max","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_focus_skill_modifier":{"name":"focus_skill_modifier","type":"hidden","triggeredFuncs":[],"affects":["persuasion","awareness","electronics"],"addFuncs":[],"listener":"change:focus_skill_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcAttributeSkillMod","initialFunc":"","formula":""},"attr_focus_limit":{"name":"focus_limit","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:focus_limit","listenerFunc":"accessSheet","defaultValue":5,"calculation":"","initialFunc":"","formula":""},"attr_focus_trait":{"name":"focus_trait","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:focus_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_intelligence":{"name":"intelligence","type":"number","triggeredFuncs":[],"affects":["intelligence_skill_modifier"],"addFuncs":[],"listener":"change:intelligence","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_intelligence_max":{"name":"intelligence_max","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:intelligence_max","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_intelligence_skill_modifier":{"name":"intelligence_skill_modifier","type":"hidden","triggeredFuncs":[],"affects":["psychology","computers","astronomy"],"addFuncs":[],"listener":"change:intelligence_skill_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcAttributeSkillMod","initialFunc":"","formula":""},"attr_intelligence_limit":{"name":"intelligence_limit","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:intelligence_limit","listenerFunc":"accessSheet","defaultValue":5,"calculation":"","initialFunc":"","formula":""},"attr_intelligence_trait":{"name":"intelligence_trait","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:intelligence_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_grit":{"name":"grit","type":"number","triggeredFuncs":[],"affects":["grit_skill_modifier"],"addFuncs":[],"listener":"change:grit","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_grit_max":{"name":"grit_max","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:grit_max","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_grit_skill_modifier":{"name":"grit_skill_modifier","type":"hidden","triggeredFuncs":[],"affects":["culture","resolve","biotech"],"addFuncs":[],"listener":"change:grit_skill_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcAttributeSkillMod","initialFunc":"","formula":""},"attr_grit_limit":{"name":"grit_limit","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:grit_limit","listenerFunc":"accessSheet","defaultValue":5,"calculation":"","initialFunc":"","formula":""},"attr_grit_trait":{"name":"grit_trait","type":"text","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:grit_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_untrained":{"name":"untrained","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:untrained","listenerFunc":"accessSheet","defaultValue":-2,"calculation":"","initialFunc":"","formula":""},"act_wealth-action":{"name":"wealth-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:wealth-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_wealth_action":{"name":"wealth_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:wealth_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_wealth_attribute_modifier":{"name":"wealth_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:wealth_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_wealth":{"name":"wealth","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:wealth","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_wealth_trained":{"name":"wealth_trained","type":"checkbox","triggeredFuncs":[],"affects":["wealth"],"addFuncs":[],"listener":"change:wealth_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_wealth_toolbox":{"name":"wealth_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["wealth"],"addFuncs":[],"listener":"change:wealth_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_wealth_workshop":{"name":"wealth_workshop","type":"checkbox","triggeredFuncs":[],"affects":["wealth"],"addFuncs":[],"listener":"change:wealth_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_wealth_modifier":{"name":"wealth_modifier","type":"number","triggeredFuncs":[],"affects":["wealth"],"addFuncs":[],"listener":"change:wealth_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_wealth_trait":{"name":"wealth_trait","type":"text","triggeredFuncs":[],"affects":["wealth"],"addFuncs":[],"listener":"change:wealth_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_persuasion-action":{"name":"persuasion-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:persuasion-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_persuasion_action":{"name":"persuasion_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:persuasion_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_persuasion_attribute_modifier":{"name":"persuasion_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:persuasion_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_persuasion":{"name":"persuasion","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:persuasion","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_persuasion_trained":{"name":"persuasion_trained","type":"checkbox","triggeredFuncs":[],"affects":["persuasion"],"addFuncs":[],"listener":"change:persuasion_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_persuasion_toolbox":{"name":"persuasion_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["persuasion"],"addFuncs":[],"listener":"change:persuasion_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_persuasion_workshop":{"name":"persuasion_workshop","type":"checkbox","triggeredFuncs":[],"affects":["persuasion"],"addFuncs":[],"listener":"change:persuasion_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_persuasion_modifier":{"name":"persuasion_modifier","type":"number","triggeredFuncs":[],"affects":["persuasion"],"addFuncs":[],"listener":"change:persuasion_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_persuasion_trait":{"name":"persuasion_trait","type":"text","triggeredFuncs":[],"affects":["persuasion"],"addFuncs":[],"listener":"change:persuasion_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_leadership-action":{"name":"leadership-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:leadership-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_leadership_action":{"name":"leadership_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:leadership_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_leadership_attribute_modifier":{"name":"leadership_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:leadership_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_leadership":{"name":"leadership","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:leadership","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_leadership_trained":{"name":"leadership_trained","type":"checkbox","triggeredFuncs":[],"affects":["leadership"],"addFuncs":[],"listener":"change:leadership_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_leadership_toolbox":{"name":"leadership_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["leadership"],"addFuncs":[],"listener":"change:leadership_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_leadership_workshop":{"name":"leadership_workshop","type":"checkbox","triggeredFuncs":[],"affects":["leadership"],"addFuncs":[],"listener":"change:leadership_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_leadership_modifier":{"name":"leadership_modifier","type":"number","triggeredFuncs":[],"affects":["leadership"],"addFuncs":[],"listener":"change:leadership_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_leadership_trait":{"name":"leadership_trait","type":"text","triggeredFuncs":[],"affects":["leadership"],"addFuncs":[],"listener":"change:leadership_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_psychology-action":{"name":"psychology-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:psychology-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_psychology_action":{"name":"psychology_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:psychology_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_psychology_attribute_modifier":{"name":"psychology_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:psychology_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_psychology":{"name":"psychology","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:psychology","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_psychology_trained":{"name":"psychology_trained","type":"checkbox","triggeredFuncs":[],"affects":["psychology"],"addFuncs":[],"listener":"change:psychology_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_psychology_toolbox":{"name":"psychology_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["psychology"],"addFuncs":[],"listener":"change:psychology_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_psychology_workshop":{"name":"psychology_workshop","type":"checkbox","triggeredFuncs":[],"affects":["psychology"],"addFuncs":[],"listener":"change:psychology_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_psychology_modifier":{"name":"psychology_modifier","type":"number","triggeredFuncs":[],"affects":["psychology"],"addFuncs":[],"listener":"change:psychology_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_psychology_trait":{"name":"psychology_trait","type":"text","triggeredFuncs":[],"affects":["psychology"],"addFuncs":[],"listener":"change:psychology_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_culture-action":{"name":"culture-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:culture-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_culture_action":{"name":"culture_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:culture_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_culture_attribute_modifier":{"name":"culture_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:culture_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_culture":{"name":"culture","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:culture","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_culture_trained":{"name":"culture_trained","type":"checkbox","triggeredFuncs":[],"affects":["culture"],"addFuncs":[],"listener":"change:culture_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_culture_toolbox":{"name":"culture_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["culture"],"addFuncs":[],"listener":"change:culture_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_culture_workshop":{"name":"culture_workshop","type":"checkbox","triggeredFuncs":[],"affects":["culture"],"addFuncs":[],"listener":"change:culture_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_culture_modifier":{"name":"culture_modifier","type":"number","triggeredFuncs":[],"affects":["culture"],"addFuncs":[],"listener":"change:culture_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_culture_trait":{"name":"culture_trait","type":"text","triggeredFuncs":[],"affects":["culture"],"addFuncs":[],"listener":"change:culture_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_physical-action":{"name":"physical-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:physical-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_physical_action":{"name":"physical_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:physical_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_physical_attribute_modifier":{"name":"physical_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:physical_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_physical":{"name":"physical","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:physical","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_physical_trained":{"name":"physical_trained","type":"checkbox","triggeredFuncs":[],"affects":["physical"],"addFuncs":[],"listener":"change:physical_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_physical_toolbox":{"name":"physical_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["physical"],"addFuncs":[],"listener":"change:physical_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_physical_workshop":{"name":"physical_workshop","type":"checkbox","triggeredFuncs":[],"affects":["physical"],"addFuncs":[],"listener":"change:physical_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_physical_modifier":{"name":"physical_modifier","type":"number","triggeredFuncs":[],"affects":["physical"],"addFuncs":[],"listener":"change:physical_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_physical_trait":{"name":"physical_trait","type":"text","triggeredFuncs":[],"affects":["physical"],"addFuncs":[],"listener":"change:physical_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_resolve-action":{"name":"resolve-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:resolve-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_resolve_action":{"name":"resolve_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:resolve_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_resolve_attribute_modifier":{"name":"resolve_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:resolve_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_resolve":{"name":"resolve","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:resolve","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_resolve_trained":{"name":"resolve_trained","type":"checkbox","triggeredFuncs":[],"affects":["resolve"],"addFuncs":[],"listener":"change:resolve_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_resolve_toolbox":{"name":"resolve_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["resolve"],"addFuncs":[],"listener":"change:resolve_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_resolve_workshop":{"name":"resolve_workshop","type":"checkbox","triggeredFuncs":[],"affects":["resolve"],"addFuncs":[],"listener":"change:resolve_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_resolve_modifier":{"name":"resolve_modifier","type":"number","triggeredFuncs":[],"affects":["resolve"],"addFuncs":[],"listener":"change:resolve_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_resolve_trait":{"name":"resolve_trait","type":"text","triggeredFuncs":[],"affects":["resolve"],"addFuncs":[],"listener":"change:resolve_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_awareness-action":{"name":"awareness-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:awareness-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_awareness_action":{"name":"awareness_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:awareness_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_awareness_attribute_modifier":{"name":"awareness_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:awareness_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_awareness":{"name":"awareness","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:awareness","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_awareness_trained":{"name":"awareness_trained","type":"checkbox","triggeredFuncs":[],"affects":["awareness"],"addFuncs":[],"listener":"change:awareness_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_awareness_toolbox":{"name":"awareness_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["awareness"],"addFuncs":[],"listener":"change:awareness_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_awareness_workshop":{"name":"awareness_workshop","type":"checkbox","triggeredFuncs":[],"affects":["awareness"],"addFuncs":[],"listener":"change:awareness_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_awareness_modifier":{"name":"awareness_modifier","type":"number","triggeredFuncs":[],"affects":["awareness"],"addFuncs":[],"listener":"change:awareness_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_awareness_trait":{"name":"awareness_trait","type":"text","triggeredFuncs":[],"affects":["awareness"],"addFuncs":[],"listener":"change:awareness_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_stealth-action":{"name":"stealth-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:stealth-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_stealth_action":{"name":"stealth_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:stealth_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_stealth_attribute_modifier":{"name":"stealth_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:stealth_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_stealth":{"name":"stealth","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:stealth","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_stealth_trained":{"name":"stealth_trained","type":"checkbox","triggeredFuncs":[],"affects":["stealth"],"addFuncs":[],"listener":"change:stealth_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_stealth_toolbox":{"name":"stealth_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["stealth"],"addFuncs":[],"listener":"change:stealth_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_stealth_workshop":{"name":"stealth_workshop","type":"checkbox","triggeredFuncs":[],"affects":["stealth"],"addFuncs":[],"listener":"change:stealth_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_stealth_modifier":{"name":"stealth_modifier","type":"number","triggeredFuncs":[],"affects":["stealth"],"addFuncs":[],"listener":"change:stealth_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_stealth_trait":{"name":"stealth_trait","type":"text","triggeredFuncs":[],"affects":["stealth"],"addFuncs":[],"listener":"change:stealth_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_mechanics-action":{"name":"mechanics-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:mechanics-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_mechanics_action":{"name":"mechanics_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:mechanics_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_mechanics_attribute_modifier":{"name":"mechanics_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:mechanics_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_mechanics":{"name":"mechanics","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:mechanics","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_mechanics_trained":{"name":"mechanics_trained","type":"checkbox","triggeredFuncs":[],"affects":["mechanics"],"addFuncs":[],"listener":"change:mechanics_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_mechanics_toolbox":{"name":"mechanics_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["mechanics"],"addFuncs":[],"listener":"change:mechanics_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_mechanics_workshop":{"name":"mechanics_workshop","type":"checkbox","triggeredFuncs":[],"affects":["mechanics"],"addFuncs":[],"listener":"change:mechanics_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_mechanics_modifier":{"name":"mechanics_modifier","type":"number","triggeredFuncs":[],"affects":["mechanics"],"addFuncs":[],"listener":"change:mechanics_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_mechanics_trait":{"name":"mechanics_trait","type":"text","triggeredFuncs":[],"affects":["mechanics"],"addFuncs":[],"listener":"change:mechanics_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_electronics-action":{"name":"electronics-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:electronics-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_electronics_action":{"name":"electronics_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:electronics_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_electronics_attribute_modifier":{"name":"electronics_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:electronics_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_electronics":{"name":"electronics","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:electronics","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_electronics_trained":{"name":"electronics_trained","type":"checkbox","triggeredFuncs":[],"affects":["electronics"],"addFuncs":[],"listener":"change:electronics_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_electronics_toolbox":{"name":"electronics_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["electronics"],"addFuncs":[],"listener":"change:electronics_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_electronics_workshop":{"name":"electronics_workshop","type":"checkbox","triggeredFuncs":[],"affects":["electronics"],"addFuncs":[],"listener":"change:electronics_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_electronics_modifier":{"name":"electronics_modifier","type":"number","triggeredFuncs":[],"affects":["electronics"],"addFuncs":[],"listener":"change:electronics_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_electronics_trait":{"name":"electronics_trait","type":"text","triggeredFuncs":[],"affects":["electronics"],"addFuncs":[],"listener":"change:electronics_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_computers-action":{"name":"computers-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:computers-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_computers_action":{"name":"computers_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:computers_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_computers_attribute_modifier":{"name":"computers_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:computers_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_computers":{"name":"computers","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:computers","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_computers_trained":{"name":"computers_trained","type":"checkbox","triggeredFuncs":[],"affects":["computers"],"addFuncs":[],"listener":"change:computers_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_computers_toolbox":{"name":"computers_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["computers"],"addFuncs":[],"listener":"change:computers_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_computers_workshop":{"name":"computers_workshop","type":"checkbox","triggeredFuncs":[],"affects":["computers"],"addFuncs":[],"listener":"change:computers_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_computers_modifier":{"name":"computers_modifier","type":"number","triggeredFuncs":[],"affects":["computers"],"addFuncs":[],"listener":"change:computers_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_computers_trait":{"name":"computers_trait","type":"text","triggeredFuncs":[],"affects":["computers"],"addFuncs":[],"listener":"change:computers_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_biotech-action":{"name":"biotech-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:biotech-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_biotech_action":{"name":"biotech_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:biotech_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_biotech_attribute_modifier":{"name":"biotech_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:biotech_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_biotech":{"name":"biotech","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:biotech","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_biotech_trained":{"name":"biotech_trained","type":"checkbox","triggeredFuncs":[],"affects":["biotech"],"addFuncs":[],"listener":"change:biotech_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_biotech_toolbox":{"name":"biotech_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["biotech"],"addFuncs":[],"listener":"change:biotech_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_biotech_workshop":{"name":"biotech_workshop","type":"checkbox","triggeredFuncs":[],"affects":["biotech"],"addFuncs":[],"listener":"change:biotech_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_biotech_modifier":{"name":"biotech_modifier","type":"number","triggeredFuncs":[],"affects":["biotech"],"addFuncs":[],"listener":"change:biotech_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_biotech_trait":{"name":"biotech_trait","type":"text","triggeredFuncs":[],"affects":["biotech"],"addFuncs":[],"listener":"change:biotech_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_medicine-action":{"name":"medicine-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:medicine-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_medicine_action":{"name":"medicine_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:medicine_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_medicine_attribute_modifier":{"name":"medicine_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:medicine_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_medicine":{"name":"medicine","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:medicine","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_medicine_trained":{"name":"medicine_trained","type":"checkbox","triggeredFuncs":[],"affects":["medicine"],"addFuncs":[],"listener":"change:medicine_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_medicine_toolbox":{"name":"medicine_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["medicine"],"addFuncs":[],"listener":"change:medicine_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_medicine_workshop":{"name":"medicine_workshop","type":"checkbox","triggeredFuncs":[],"affects":["medicine"],"addFuncs":[],"listener":"change:medicine_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_medicine_modifier":{"name":"medicine_modifier","type":"number","triggeredFuncs":[],"affects":["medicine"],"addFuncs":[],"listener":"change:medicine_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_medicine_trait":{"name":"medicine_trait","type":"text","triggeredFuncs":[],"affects":["medicine"],"addFuncs":[],"listener":"change:medicine_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_astronomy-action":{"name":"astronomy-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:astronomy-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_astronomy_action":{"name":"astronomy_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:astronomy_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_astronomy_attribute_modifier":{"name":"astronomy_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:astronomy_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_astronomy":{"name":"astronomy","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:astronomy","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_astronomy_trained":{"name":"astronomy_trained","type":"checkbox","triggeredFuncs":[],"affects":["astronomy"],"addFuncs":[],"listener":"change:astronomy_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_astronomy_toolbox":{"name":"astronomy_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["astronomy"],"addFuncs":[],"listener":"change:astronomy_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_astronomy_workshop":{"name":"astronomy_workshop","type":"checkbox","triggeredFuncs":[],"affects":["astronomy"],"addFuncs":[],"listener":"change:astronomy_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_astronomy_modifier":{"name":"astronomy_modifier","type":"number","triggeredFuncs":[],"affects":["astronomy"],"addFuncs":[],"listener":"change:astronomy_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_astronomy_trait":{"name":"astronomy_trait","type":"text","triggeredFuncs":[],"affects":["astronomy"],"addFuncs":[],"listener":"change:astronomy_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"act_planets-action":{"name":"planets-action","type":"action","triggeredFuncs":["rollSkill"],"affects":[],"addFuncs":[],"listener":"clicked:planets-action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_planets_action":{"name":"planets_action","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:planets_action","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_planets_attribute_modifier":{"name":"planets_attribute_modifier","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:planets_attribute_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":"@{skillAttribute}"},"attr_planets":{"name":"planets","type":"number","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:planets","listenerFunc":"accessSheet","defaultValue":0,"calculation":"calcSkill","initialFunc":"","formula":""},"attr_planets_trained":{"name":"planets_trained","type":"checkbox","triggeredFuncs":[],"affects":["planets"],"addFuncs":[],"listener":"change:planets_trained","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_planets_toolbox":{"name":"planets_toolbox","type":"checkbox","triggeredFuncs":[],"affects":["planets"],"addFuncs":[],"listener":"change:planets_toolbox","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_planets_workshop":{"name":"planets_workshop","type":"checkbox","triggeredFuncs":[],"affects":["planets"],"addFuncs":[],"listener":"change:planets_workshop","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_planets_modifier":{"name":"planets_modifier","type":"number","triggeredFuncs":[],"affects":["planets"],"addFuncs":[],"listener":"change:planets_modifier","listenerFunc":"accessSheet","defaultValue":0,"calculation":"","initialFunc":"","formula":""},"attr_planets_trait":{"name":"planets_trait","type":"text","triggeredFuncs":[],"affects":["planets"],"addFuncs":[],"listener":"change:planets_trait","listenerFunc":"accessSheet","defaultValue":"","calculation":"","initialFunc":"","formula":""},"attr_template_start":{"name":"template_start","type":"hidden","triggeredFuncs":[],"affects":[],"addFuncs":[],"listener":"change:template_start","listenerFunc":"accessSheet","defaultValue":"@{whisper}&{template:FE2} {{character_name=@{character_name}}} {{character_id=@{character_id}}}","calculation":"","initialFunc":"","formula":""}};
    
    kFuncs.cascades = cascades;
    
    const repeatingSectionDetails = [];
    
    kFuncs.repeatingSectionDetails = repeatingSectionDetails;
    
    const persistentTabs = ["FE2_tab"];
    
    kFuncs.persistentTabs = persistentTabs;
    /**
 * The K-scaffold provides several variables to allow your scripts to tap into its information flow.
 * @namespace Sheetworkers.Variables
 */
/**
 * This stores the name of your sheet for use in the logging functions {@link log} and {@link debug}. Accessible by `k.sheetName`
 * @memberof Variables
 * @var
 * @type {string}
 */
let sheetName = 'kScaffold Powered Sheet';
kFuncs.sheetName = sheetName;
/**
	* This stores the version of your sheet for use in the logging functions{@link log} and {@link debug}. It is also stored in the sheet_version attribute on your character sheet. Accessible via `k.version`
 * @memberof Variables
	* @var
	* @type {number}
	*/
let version = 0;
kFuncs.version = version;
/**
	* A boolean flag that tells the script whether to enable or disable {@link debug} calls. If the version of the sheet is `0`, or an attribute named `debug_mode` is found on opening this is set to true for your entire session. Otherwise, it remains false.
 * @memberof Variables
	* @var
	* @type {boolean}
	*/
let debugMode = false;
kFuncs.debugMode = debugMode;
/**
	* A boolean flag that tells the script whether to output verbose logs of what is being done or not when {@link debugMode} is enabled.
 * @memberof Variables
	* @var
	* @type {boolean}
	*/
let verboseMode = false;
kFuncs.verboseMode = verboseMode;
const funcs = {};
kFuncs.funcs = funcs;
const updateHandlers = {};
const openHandlers = {};
const initialSetups = {};
const allHandlers = {};
const addFuncs = {};

const kscaffoldJSVersion = '2.7.2';
const kscaffoldPUGVersion = '2.7.0';
/**
 * Defines the rollstring that rolls made using k.startRoll begin with. Defaults to "&{template:default}".
 * @memberof Variables
 * @var
 * @type {string}
 */
let defaultRollStart = '&{template:default}';
kFuncs.defaultRollStart = defaultRollStart;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * These are utility functions that are not directly related to Roll20 systems. They provide easy methods for everything from processing text and numbers to querying the user for input.
 * @namespace Sheetworkers.Utilities
 * @alias Utilities
 */
/**
 * Replaces problem characters to use a string as a regex
 * @memberof Utilities
 * @param {string} text - The text to replace characters in
 * @returns {string}
 * @example
 * const textForRegex = k.sanitizeForRegex('.some thing[with characters]');
 * console.log(textForRegex);// => "\.some thing\[with characters\]"
 */
const sanitizeForRegex = function(text){
  return text.replace(/\.|\||\(|\)|\[|\]|\-|\+|\?|\/|\{|\}|\^|\$|\*/g,'\\$&');
};
kFuncs.sanitizeForRegex = sanitizeForRegex;

/**
 * Converts a value to a number, it\'s default value, or `0` if no default value passed.
 * @memberof Utilities
 * @param {string|number} val - Value to convert to a number
 * @param {number} def - The default value, uses 0 if not passed
 * @returns {number|undefined}
 * @example
 * const num = k.value('100');
 * console.log(num);// => 100
 */
const value = function(val,def){
  const convertVal = +val;
  if(def !== undefined && isNaN(def)){
    throw(`K-scaffold Error: invalid default for value(). Default: ${def}`);
  }
  return convertVal === 0 ?
    convertVal :
    (+val||def||0);
};
kFuncs.value = value;

/**
 * Extracts the section (e.g. `repeating_equipment`), rowID (e.g `-;lkj098J:LKj`), and field name (e.g. `bulk`) from a repeating attribute name.
 * @memberof Utilities
 * @param {string} string - The string to parse
 * @returns {array} - Array of matches. Index 0: the section name, e.g. repeating_equipment | Index 1:the row ID | index 2: The name of the attribute
 * @returns {string[]}
 * @example
 * //Extract info from a full repeating name
 * const [section,rowID,attrName] = k.parseRepeatName('repeating_equipment_-8908asdflkjZlkj23_name');
 * console.log(section);// => "repeating_equipment"
 * console.log(rowID);// => "-8908asdflkjZlkj23"
 * console.log(attrName);// => "name"
 * 
 * //Extract info from just a row name
 * const [section,rowID,attrName] = k.parseRepeatName('repeating_equipment_-8908asdflkjZlkj23');
 * console.log(section);// => "repeating_equipment"
 * console.log(rowID);// => "-8908asdflkjZlkj23"
 * console.log(attrName);// => undefined
 */
const parseRepeatName = function(string){
  let match = string.match(/(repeating_[^_]+)_([^_]+)(?:_(.+))?/);
  match.shift();
  return match;
};
kFuncs.parseRepeatName = parseRepeatName;

/**
 * Parses out the components of a trigger name similar to [parseRepeatName](#parserepeatname). Aliases: parseClickTrigger.
 * 
 * Aliases: `k.parseClickTrigger`
 * @memberof Utilities
 * @param {string} string The triggerName property of the
 * @returns {array} - For a repeating button named `repeating_equipment_-LKJhpoi98;lj_roll`, the array will be `['repeating_equipment','-LKJhpoi98;lj','roll']`. For a non repeating button named `roll`, the array will be `[undefined,undefined,'roll']`
 * @returns {string[]}
 * @example
 * //Parse a non repeating trigger
 * const [section,rowID,attrName] = k.parseTriggerName('clicked:some-button');
 * console.log(section);// => undefined
 * console.log(rowID);// => undefined
 * console.log(attrName);// => "some-button"
 * 
 * //Parse a repeating trigger
 * const [section,rowID,attrName] = k.parseTriggerName('clicked:repeating_attack_-234lkjpd8fu8usadf_some-button');
 * console.log(section);// => "repeating_attack"
 * console.log(rowID);// => "-234lkjpd8fu8usadf"
 * console.log(attrName);// => "some-button"
 * 
 * //Parse a repeating name
 * const [section,rowID,attrName] = k.parseTriggerName('repeating_attack_-234lkjpd8fu8usadf_some-button');
 * console.log(section);// => "repeating_attack"
 * console.log(rowID);// => "-234lkjpd8fu8usadf"
 * console.log(attrName);// => "some-button"
 */
const parseTriggerName = function(string){
  let match = string.replace(/^clicked:/,'').match(/(?:(repeating_[^_]+)_([^_]+)_)?(.+)/);
  match.shift();
  return match;
};
kFuncs.parseTriggerName = parseTriggerName;
const parseClickTrigger = parseTriggerName;
kFuncs.parseClickTrigger = parseClickTrigger;

/**
 * Parses out the attribute name from the htmlattribute name.
 * @memberof Utilities
 * @param {string} string - The triggerName property of the [event](https://wiki.roll20.net/Sheet_Worker_Scripts#eventInfo_Object).
 * @returns {string}
 * @example
 * //Parse a name
 * const attrName = k.parseHtmlName('attr_attribute_1');
 * console.log(attrName);// => "attribute_1"
 */
const parseHTMLName = function(string){
  let match = string.match(/(?:attr|act|roll)_(.+)/);
  match.shift();
  return match[0];
};
kFuncs.parseHTMLName = parseHTMLName;

/**
 * Capitalize each word in a string
 * @memberof Utilities
 * @param {string} string - The string to capitalize
 * @returns {string}
 * @example
 * const capitalized = k.capitalize('a word');
 * console.log(capitalized);// => "A Word"
 */
const capitalize = function(string){
  return string.replace(/(?:^|\s+|\/)[a-z]/ig,(letter)=>letter.toUpperCase());
};
kFuncs.capitalize = capitalize;

/**
 * Extracts a roll query result for use in later functions. Must be awaited as per [startRoll documentation](https://wiki.roll20.net/Sheet_Worker_Scripts#Roll_Parsing.28NEW.29). Stolen from [Oosh\'s Adventures with Startroll thread](https://app.roll20.net/forum/post/10346883/adventures-with-startroll).
 * @memberof Utilities
 * @param {string} query - The query should be just the text as the `?{` and `}` at the start/end of the query are added by the function.
 * @returns {Promise} - Resolves to the selected value from the roll query
 * @example
 * const rollFunction = async function(){
 *  //Get the result of a choose from list query
 *  const queryResult = await extractQueryResult('Prompt Text Here|Option 1|Option 2');
 *  console.log(queryResult);//=> "Option 1" or "Option 2" depending on what the user selects
 * 
 *  //Get free form input from the user
 *  const freeResult = await extractQueryResult('Prompt Text Here');
 *  consoel.log(freeResult);// => Whatever the user entered
 * }
 */
const extractQueryResult = async function(query){
  const rollObj = {
    query:`[[0[response=?{${query}}]]]`
  };
	let {roll} = await _startRoll(rollObj,'!');
  roll.finish();
	return roll.results.query.expression.replace(/^.+?response=|\]$/g,'');
};
kFuncs.extractQueryResult = extractQueryResult;

/**
 * Simulates a query for ensuring that async/await works correctly in the sheetworker environment when doing conditional startRolls. E.g. if you have an if/else and only one of the conditions results in `startRoll` being called (and thus an `await`), the sheetworker environment would normally crash. Awaiting this in the condition that does not actually need to call `startRoll` will keep the environment in sync.
 * @memberof Utilities
 * @param {string|number} [value] - The value to return. Optional.
 * @returns {Promise} - Resolves to the value passed to the function
 * @example
 * const rollFunction = async function(){
 *  //Get the result of a choose from list query
 *  const queryResult = await pseudoQuery('a value');
 *  console.log(queryResult);//=> "a value"
 * }
 */
const pseudoQuery = async function(value){  
  const rollObj = {
    query:`[[0[response=${value}]]]`
  };
	let {roll} = await _startRoll(rollObj,'!');
  roll.finish();
	return roll.results.query.expression.replace(/^.+?response=|\]$/g,'');
};
kFuncs.pseudoQuery = pseudoQuery;

/**
 * An alias for console.log.
 * @memberof Utilities
 * @param {any} msg - The message can be a straight string, an object, or an array. If it is an object or array, the object will be broken down so that each key is used as a label to output followed by the value of that key. If the value of the key is an object or array, it will be output via `console.table`.
 */
const log = function(msg){
  if(typeof msg === 'string'){
    console.log(`%c${kFuncs.sheetName} log| ${msg}`,"background-color:#159ccf");
  }else if(typeof msg === 'object'){
    Object.keys(msg).forEach((m)=>{
      if(typeof msg[m] === 'string'){
        console.log(`%c${kFuncs.sheetName} log| ${m}: ${msg[m]}`,"background-color:#159ccf");
      }else{
        console.log(`%c${kFuncs.sheetName} log| ${typeof msg[m]} ${m}`,"background-color:#159ccf");
        console.table(msg[m]);
      }
    });
  }
};
kFuncs.log = log;

/**
 * Alias for console.log that only triggers when debug mode is enabled or when the sheet\'s version is `0`. Useful for entering test logs that will not pollute the console on the live sheet.
 * @memberof Utilities
 * @param {any} msg - 'See {@link k.log}
 * @param {boolean} force - Pass as a truthy value to force the debug output to be output to the console regardless of debug mode.
 * @returns {void}
 */
const debug = function(msg,force){
  if(!kFuncs.debugMode && !force && kFuncs.version > 0) return;
  if(typeof msg === 'string'){
    console.warn(`%c${kFuncs.sheetName} DEBUG| ${msg}`,"background-color:tan;color:red;");
  }else if(typeof msg === 'object'){
    Object.keys(msg).forEach((m)=>{
      if(typeof msg[m] === 'string'){
        console.warn(`%c${kFuncs.sheetName} DEBUG| ${m}: ${msg[m]}`,"background-color:tan;color:red;");
      }else{
        console.warn(`%c${kFuncs.sheetName} DEBUG| ${typeof msg[m]} ${m}`,"background-color:tan;color:red;font-weight:bold;");
        console.table(msg[m]);
      }
    });
  }
};
kFuncs.debug = debug;

/**
 * Orders the section id arrays for all sections in the `sections` object to match the repOrder attribute.
 * @memberof Utilities
 * @param {attributesProxy} attributes - The attributes object that must have a value for the reporder for each section.
 * @param {object[]} sections - Object containing the IDs for the repeating sections, indexed by repeating section name.
 */
const orderSections = function(attributes,sections,casc){
  Object.keys(sections).forEach((section)=>{
    attributes.attributes[`_reporder_${section}`] = commaArray(attributes[`_reporder_${section}`]);
    sections[section] = orderSection(attributes.attributes[`_reporder_${section}`],sections[section],attributes,section,casc);
  });
};
kFuncs.orderSections = orderSections;

/**
 * Orders a single ID array.
 * @memberof Utilities
 * @param {string[]} repOrder - Array of IDs in the order they are in on the sheet.
 * @param {string[]} IDs - Array of IDs to be ordered. Aka the default ID Array passed to the getSectionIDs callback
 * @param {AttributesProxy} [attributes] - The Kscaffold attributes object
 * @param {string} [section] - the name of the section being ordered. If section and attributes are passed, will return an ordered array that does not include IDs for rows that do not exist.
 * @param {object} [casc] - the object describing the default state of the sheet.
 * @returns {string[]} - The ordered id array
 */
const orderSection = function(repOrder,IDs=[], attributes, section,casc){
  const idArr = [...repOrder.filter(v => v),...IDs.filter(id => !repOrder.includes(id.toLowerCase()))]
    .filter(id => {
      const testAttr = Object.keys(casc).find(a => a.toLowerCase().startsWith(`attr_${section}_${id}`));
      const testName = testAttr?.replace(/attr_/,'');
      const idName = testName?.replace(/\$x/,id);
      return (!section && !casc) ||
        (
          idName && 
          (
            attributes.attributes.hasOwnProperty(idName) ||
            attributes.updates.hasOwnProperty(idName)
          )
        );
    });
  return idArr;
};
kFuncs.orderSection = orderSection;

/**
 * Splits a comma delimited string into an array
 * @memberof Utilities
 * @param {string} string - The string to split.
 * @returns {array} - The string segments of the comma delimited list.
 */
const commaArray = function(string=''){
  return string.toLowerCase().split(/\s*,\s*/);
};
kFuncs.commaArray = commaArray;

// Roll escape functions for passing data in action button calls. Base64 encodes/decodes the data.
const RE = {
  chars: {
      '"': '%quot;',
      ',': '%comma;',
      ':': '%colon;',
      '}': '%rcub;',
      '{': '%lcub;',
  },
  escape(data) {
    return typeof data === 'object' ?
      `KDATA${btoa(JSON.stringify(data))}` :
      `KSTRING${btoa(data)}`;
  },
  unescape(string) {
    const isData = typeof string === 'string' &&
      (
        string.startsWith('KDATA') ||
        string.startsWith('KSTRING')
      );
    return isData ?
      (
        string.startsWith('KDATA') ?
          JSON.parse(atob(string.replace(/^KDATA/,''))) :
          atob(string.replace(/^KSTRING/,''))
      ) :
      string;
  }
};


/**
 * Encodes data in Base64. This is useful for passing roll information to action buttons called from roll buttons.
 * @function
 * @param {string|object|any[]} data - The data that you want to Base64 encode
 * @returns {string} - The encoded data
 * @memberof! Utilities
 */
const escape = RE.escape;
/**
 * Decodes Base64 encoded strings that were created by the K-scaffold
 * @function
 * @param {string|object|any[]} string - The string of encoded data to decode. If this is not a string, or is not a string that was encoded by the K-scaffold, it will be returned as is.
 * @returns {string|object|any[]}
 * @memberof! Utilities
 */
const unescape = RE.unescape;

Object.assign(kFuncs,{escape,unescape});

/**
 * Parses a macro so that it is reduced to the final values of all attributes contained in the macro. Will drill down up to 99 levels deep. If the string was not parseable, string will be returned with as much parsed as possible.
 * @memberof Utilities
 * @param {string} mutStr - The string macro to parse
 * @param {AttributesProxy} attributes - The K-scaffold Attributes Proxy
 * @param {Object} sections - The K-scaffold sections object
 * @returns {string} - The string with all attributes replaced by their values (if possible).
 */
const parseMacro = (str,attributes,sections) => {
  let iter = 0;
  let mutStr = str;
  while(mutStr.match(/@{.+?}/) && iter < 99){
    mutStr = mutStr.replace(/@{(.+?)}/g,(match,name) => {
      name = name.replace(/\|/,'_');
      return attributes[name] !== null && attributes[name] !== undefined ?
        attributes[name] :
        `@(${name})`;
    })
    iter++;
  }
  mutStr = mutStr.replace(/@\((.+?)\)/g,'@{$1}');
  return mutStr;
}
kFuncs.parseMacro = parseMacro;

/**
 * Sends data to another character sheet to cause a change on that sheet. WARNING, this function should not be used in response to an attribute change to avoid spamming the chat with api messages.
 * 
 * ![k.send.gif](/k-scaffold/k.send.gif)
 * @memberof Utilities
 * @param {string} characterName - The character to connect to
 * @param {string} funcName - Name of the function to call similar to function name used in {@link callFunc}.
 * @param  {...any} args - The arguments to pass to the function call no the other sheet. These are passed after the normal destructure object for a K-scaffold function call.
 * @example
 * //Function that is called by the source sheet
 * const dispatchPartner = async function({trigger,attributes,sections,casc}){
 *  const partnerName = await (
 *    attributes.partner_name ?
 *      k.pseudoQuery(attributes.partner_name) :
 *      k.extractQueryResult('Partner name')
 *  );
 *  attributes.partner_name = partnerName;
 *  //passing the attributes of the source sheet
 *  k.send(partnerName,'receivePartner',attributes);
 *  attributes.set();
 * };
 * k.registerFuncs({dispatchPartner});
 * 
 * //Function called on target sheet. Partner is the attributes from the source sheet
 * const receivePartner  = function({trigger,attributes,sections,casc},partner){
 *   attributes.from_partner = partner.for_partner;
 *   attributes.partner_name = partner.character_name;
 * };
 * k.registerFuncs({receivePartner });
 */
const send = async function(characterName,funcName,...args){
  const data = RE.escape({
    funcName,
    args
  });
  const roll = await startRoll(`!@{${characterName}|character_name}%{${characterName}|k-network-call||${data}}&{noerror}`);
  finishRoll(roll.rollId);
};
kFuncs.send = send;

const kReceive = function({trigger,attributes,sections,casc}) {
  const data = trigger.rollData;
  callFunc(data.funcName,{attributes,sections,casc},...data.args);
};
funcs.kReceive = kReceive;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * Detailed descriptions of the arguments that are passed to functions registered with the K-scaffold.
 * @namespace Sheetworkers.Function Arguments
 */
/**
 * An object that stores the rowID information for each repeating section on the sheet.
 * @name sections
 * @memberof Function Arguments
 * @var
 * @property {string[]} repeating_section_name - The row IDs of a given repeating section. The repeating section name is used **with** the `repeating_` prefix (e.g. `sections['repeating_weapons']`).
 */
/**
 * Object that stores the default trigger information for all attributes. Indexed by attribute, button name, or fieldset name prefixed with `attr_`, `act_`, or `fieldset_` respectively.
 * @name casc
 * @memberof Function Arguments
 * @var
 */
/**
 * Object describing the attribute that is currently being worked on. In addition to the properties described here, the properties from the Roll20 event will also be present if the attribute was the original event. Additional properties may be present if you specified them when creating the input for the attribute.
 * @name trigger
 * @memberof Function Arguments
 * @var
 * @property {string} name - The full name of the attribute.
 * @property {string[]} triggeredFuncs - Array of function names that will be called when this attribute is worked on.
 * @property {string} calculation - The name of the function that is used to calculate the value of this attribute.
 * @property {string} formula - The macro syntax formula to use to calculate this attributes value.
 * @property {string[]} affects - Array of attribute names that this attribute might affect.
 * @property {string[]} addFuncs - Functions that are called when the add row button is clicked for a customControlFieldset.
 * @property {string} listener - What function was used to listen for changes to this attribute. Unless you have decided to implement your own event handling, this should always be `"accessSheet"`.
 * @property {string} type - What type of thing this trigger is for (e.g. number, action).
 */
//# Attribute Obj Proxy handler
/**
	* A representation of the sheet's attributes. This is a proxy for the actual object and will keep track of original values and updates that have been applied. Calling an attribute directly on the attributes value will return it's current value coerced into a number if it is numeric. Setting a property on the attributes object will add it the list of updates which will be applied the next time the `set()` method is called on attributes.
  * @name attributes
  * @memberof Function Arguments
  * @var
  * @property {object} attributes - The raw original data of the character sheet.
  * @property {object} updates - The raw data that will be saved to the character sheet once all operations have been completed.
  * @property {function} set - Method to apply changes to the character sheet. This is called automatically at the end of the scaffold's event handling. Needs to be called manually if inside an asynchronous function, such as when using the startRoll sheetworker (or any of the scaffold aliases for startRoll). The method uses object destructuring syntax for the arguments it takes.
  * @property {boolean} [set.vocal=false] - Whether the set is done silently or not. Should almost always be left at false. `attributes.set({vocal:true})`
  * @property {function} [set.callback] - Callback function to be invoked once the setAttrs is complete. `attributes.set({callback(){/*do a thing}})`
  * @property {any} attribute_name - Name of any attribute whose data from the character sheet you want to access. Will only return a value if the attribute was defined using the scaffold's pug mixins (e.g. +input). If the value of the attribute is numerical (e.g. `"5"`), it will be returned as a number. You can also apply changes by simply assigning a value to an attribute name (e.g. `attributes.character_name = 'New Character'`).
  * @property {object} repOrders - Object showing the ordered arrays for the _reporder_ attributes for each repeating section. Indexed by repeating section name
  * @property {object[]} repeating_section_name - Name of a repeating section whose data you want to access (e.g. `attributes.repeating_weapons`). The data will be returned as an array with objects describing each row in the order they are on the sheet. Objects are indexed by rowID as well. Mutating array methods are replaced by the `sort` and `move` methods. Non mutating array methods can be used as normal.
  * @property {string} repeating_section_name._section - the name of the repeating section. Used internally by the scaffold. Readonly.
  * @property {function} move - Method for reordering rows.
  * @property {number|string} move.startingPosition - the row id or position index for the row you want to move.
  * @property {number} move.destination - The position in the section where you want the row to be moved to. If the position is greater than the length of the section, the row will be moved to the last position. If the position is negative, it will be moved to the start of the section.
  * @property {boolean} [move.silent=false] - Whether the reordering should trigger setSectionOrder or not.
  * @property {function} sort - Alias for the default Array.sort method. Functions as the default sort method, but has an optional second argument.
  * @property {function} sort.callback - The function to use for determining the sort order. See the [Array.sort documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) for details.
  * @property {boolean} [sort.silent=false] - Whether to apply the sort to the display of the repeating section.
  * @property {function} create - Method for creating a new row in a repeating section. Arguments for this method can be in any order. A row will not actually be created unless data is assigned to at least one attribute of the row, either at creation or later. Returns the object representing the new row.
  * @property {string} [create.custom] - Custom text that replaces the starting characters of the rowID
  * @property {object} [create.data] - what to set the attribute values of the row to. If not provided, the row object will be created, but no row will be created on the sheet until data is specified.
  * @property {object} repeating_section_name.rowID_or_Index - Returns the object describing a row in a repeating section specified by row ID or indexed position. (e.g. `attributes.repeating_weapons[0]` returns the data for the first row in the weapons section)
  * * @property {object} repeating_section_name.rowID_or_Index._id - The id of the row. Readonly.
  * * @property {object} repeating_section_name.rowID_or_Index._section - The repeating section the row belongs to. Readonly.
  * @property {any} repeating_section_name.rowID_or_Index.attribute_name - functions as an attribute_name call on the base attributes object. (e.g. `attributes['repeating_weapons_-jJ2soils_name']` is equivalent to `attributes.repeating_weapons['-jJ2soils'].name`).
  * @type {object}
	*/
  const createAttrProxy = function(attrs,sections,casc){
    //creates a proxy for the attributes object so that values can be worked with more easily.
    const getCascObj = function(event){
      const eventName = event.triggerName || event.sourceAttribute;
      let typePrefix = eventName.startsWith('clicked:') ?
        'act_' :
        event.removedInfo ?
        'fieldset_' :
        'attr_';
      let cascName = `${typePrefix}${eventName.replace(/(?:removed?|clicked):/,'')}`;
      let cascObj = casc[cascName];
      if(kFuncs.verboseMode){
        debug({[cascName]:cascObj});
      }
      if(event && cascObj){
        Object.assign(cascObj,event);
        if(event.originalRollId){
          cascObj.rollData = RE.unescape(event.originalRollId);
        }
      }
      return cascObj || {};
    };
    
    const triggerFunctions = function(obj){
      if(obj.triggeredFuncs && obj.triggeredFuncs.length){
        if(kFuncs.verboseMode){
          debug(`triggering functions for ${obj.name}`);
        }
        obj.triggeredFuncs && obj.triggeredFuncs.forEach(func=>funcs[func] ? 
          funcs[func]({trigger:obj,attributes,sections,casc}) :
          debug(`!!!Warning!!! no function named ${func} found. Triggered function not called for ${obj.name}`,true));
      }
    };
    
    const initialFunction = function(obj){
      if(obj.initialFunc){
        if(kFuncs.verboseMode){
          debug(`initial functions for ${obj.name}`);
        }
        funcs[obj.initialFunc] ?
          funcs[obj.initialFunc]({trigger:obj,attributes,sections}) :
          debug(`!!!Warning!!! no function named ${obj.initialFunc} found. Initial function not called for ${obj.name}`,true);
      }
    };
    const alwaysFunctions = function(trigger){
      Object.values(allHandlers).forEach((handler)=>{
        handler({trigger,attributes,sections,casc});
      });
    };
    const processChange = function({event,trigger}){
      if(event && !trigger){
        debug(`${event.sourceAttribute} change detected. No trigger found`);
        return;
      }
      if(!attributes || !sections || !casc){
        debug(`!!! Insufficient arguments || attributes > ${!!attributes} | sections > ${!!sections} | casc > ${!!casc} !!!`);
        return;
      }
      if(kFuncs.verboseMode){
        debug({trigger});
      }
      if(event){
        if(Array.isArray(trigger.affects)){
          attributes.queue.push(...trigger.affects);
        }
        alwaysFunctions(trigger,attributes,sections,casc);//Functions that should be run for all events.
        initialFunction(trigger,attributes,sections,casc);//functions that should only be run if the attribute was the thing changed by the user
  
      }
      if(trigger){
        triggerFunctions(trigger,attributes,sections,casc);
        if(!event){
          // Handle autocalc formula
          if(trigger.formula){
            attributes[trigger.name] = parseKFormula({trigger,attributes,sections,casc});
          }
          // handle calculation of element
          if(
            trigger.calculation &&
            funcs[trigger.calculation]
          ){
            attributes[trigger.name] = funcs[trigger.calculation]({trigger,attributes,sections,casc});
          }else if(trigger.calculation && !funcs[trigger.calculation]){
            debug(`K-Scaffold Error: No function named ${trigger.calculation} found`);
          }
        }
      }
      attributes.set();
    };
    const attrTarget = {
      updates:{},
      attributes:{...attrs},
      repOrders:{},
      queue: [],
      casc:{},
      alwaysFunctions,
      processChange,
      triggerFunctions,
      initialFunction,
      getCascObj
    };
    const repeatObjects = {};
    const repeatTargetObjects = {};
    const repeatHandler = {
      get:function(obj,prop){
        const row = `${obj._section}_${obj._id}`;
        if(prop === '_isProxy'){
          return true;
        }
        if(prop === 'toJSON'){
          return () => {
            return Object.keys(obj).reduce((o,k) => {
              o[k] = attributes[`${row}_${k}`];
              return o;
            },{_id: obj._id,_section: obj._section});
          }
        }
        if(prop === 'remove'){
          return function(){
            delete attributes[obj._section][obj._id];
          }
        }
        return obj[prop];
      },
      set: function(obj,prop,value){
        if(prop === '_id' || prop === '_section'){
          throw new Error(`!!!Warning: cannot change the id or section of a repeating object!!!`);
        }else if( prop === '_index'){
          throw new Error(`!!!Warning: Cannot reorder sections by setting the _index. Sort the repeating array or use k.setSectionOrder!!!`);
        }
        const fullRef = `${obj._section}_${obj._id}_${prop}`;
        attributes[fullRef] = value;
        obj[prop] = value;
      }
    };
    const repeatArrHandler = {
      get(arr,prop){
        prop = typeof prop === 'string' ?
          prop.replace(/^\$/,'') :
          prop;
        if(prop === '_isProxy'){
          return true;
        }
        if(
          prop === 'fill' ||
          prop === 'shift' ||
          prop === 'pop' ||
          prop === 'unshift' ||
          prop === 'splice'
        ){
          throw new Error(`The ${prop} method is not allowed on section arrays`);
        }
        if(prop === 'create'){
          return function(){
            const argArray = [...arguments];
            const custom = argArray.find(e => typeof e === 'string');
            const data = argArray.find(e => typeof e === 'object' && !Array.isArray(e));
  
            const row = _generateRowID(arr._section,sections,custom);
            const id = row.replace(/repeating_[^_]+_/,'');
            arr[id] = createRepeatObj(arr._section,id);
            arr.push(arr[id]);
            if(data){
              Object.entries(data).forEach(([key,value]) => {
                if(arr[id].hasOwnProperty(key)){
                  arr[id][key] = value;
                }else{
                  debug(`!!!Warning: no input exists in ${obj._section} for the attribute "${key}"!!!`);
                }
              });
            }
            return arr[id];
          }
        }
        if(prop === 'move'){
          return function(){
            const ref = arguments[0];
            const targ = arguments[1];
            const vocal = !arguments[2]
            // TODO: add protection for missing arguments
            let id;
            let index;
            if(sections[arr._section].includes(ref)){
              id = ref;
              index = sections[arr._section].indexOf(id);
            }else if(!Number.isNaN(ref)){
              index = ref;
              id = sections[arr._section][index];
            }
            if(
              !Number.isNaN(index) &&
              id &&
              !Number.isNaN(targ)
            ){
              const obj = arr.splice(index,1);
              arr.splice(targ,0,obj);
              sections[arr._section].splice(index,1);
              sections[arr._section].splice(targ,0,id);
              if(vocal){
                _setSectionOrder(arr._section,sections[arr._section]);
              }
            }
          }
        }
        if(prop === 'sort'){
          return function(){
            const callback = arguments[0];
            const vocal = !arguments[1];
            sections[arr._section].sort((a,b) => {
              const aObj = arr[a];
              const bObj = arr[b];
              const sortResult = callback(aObj,bObj);
              return sortResult;
            });
            arr.sort((a,b) => {
              const aIndex = sections[arr._section].indexOf(a._id);
              const bIndex = sections[arr._section].indexOf(b._id);
              return aIndex - bIndex;
            });
            // if not a silent sort, then apply the reordered section to the sheet via setSectionOrder
            if(vocal){
              _setSectionOrder(arr._section,sections[arr._section]);
            }
            return arr;
          }
        }
        if(arr[prop] || Number.isNaN(prop)){
          return Reflect.get(...arguments);
        }
        if(sections[arr._section].includes(prop)){
          arr[prop] = createRepeatObj(arr._section,prop);
          arr.push(arr[prop]);
          return arr[prop];
        }
      },
      set(obj,prop,value){
        if(prop === 'section'){
          throw new Error('!!!Warning: Section property of a repeating section is readonly!!!')
        }
      },
      deleteProperty(arr,prop){
        if(
          !prop.startsWith('_') &&
          arr[prop] &&
          arr[prop]._isProxy
        ){
          let id;
          let index;
          if(typeof prop === 'string' && prop.startsWith('-')){
            id = prop;
            index = sections[arr._section].indexOf(id);
          }else{
            index = prop;
            id = arr[index]._id;
          }
          delete arr[id];
          arr.splice(index,1);
          sections[arr._section].splice(index,1);
          const row = `${arr._section}_${id}`;
          removeRepeatingRow(row);
        }
      }
    };
    const createRepeatObj = (prop,id) => {
      const row = `${prop}_${id}`;
      const fields = repeatingSectionDetails.find(o => o.section === prop).fields;
      const retObj = fields.reduce((o,field) => {
        o[field] = attributes[`${row}_${field}`];
        return o;
      },{_id:id,_section: prop})
      repeatTargetObjects[prop] = repeatTargetObjects[prop] || {};
      repeatTargetObjects[prop][id] = retObj;
      return new Proxy(retObj,repeatHandler);
    }
    const attrHandler = {
      get:function(obj,prop){//gets the most value of the attribute.
        if(prop === '_isProxy'){
          return true;
        }
        if(prop === 'toJSON'){
          return () => ({...obj.attributes,...obj.updates});
        }else if(prop === 'set'){
          return function(){
            let {callback,vocal} = arguments[0] ? arguments[0] : {};
            if(sections && casc && attributes.queue.length){
              const triggerName = attributes.queue.shift();
              const trigger = getCascObj({sourceAttribute:triggerName});
              processChange({trigger,attributes,sections,casc});
            }else{
              if(kFuncs.verboseMode){
                debug({updates:obj.updates});
              }
              const trueCallback = Object.keys(obj.repOrders).length ?
                function(){
                  Object.entries(obj.repOrders).forEach(([section,order])=>{
                    _setSectionOrder(section,order)
                  });
                  callback && callback();
                }:
                callback;
              Object.keys(obj.updates).forEach((key)=>obj.attributes[key] = obj.updates[key]);
              const update = obj.updates;
              obj.updates = {};
              set(update,vocal,trueCallback);
            }
          }
        }else if(/^repeating_[^_]+$/.test(prop)){
          // if it's been lazy loaded, use it
          if(!repeatObjects[prop]){
            // otherwise lazy load it
            const baseArr = [];
            baseArr._section = prop;
            repeatObjects[prop] = new Proxy(sections[prop].reduce((arr,id,i) => {
              const rowObj = createRepeatObj(prop,id,i);
              arr.push(rowObj);
              arr[id] = rowObj;
              return arr;
            },baseArr),repeatArrHandler);
          }
          return repeatObjects[prop];
        }else if(Object.keys(obj).some(key=>key===prop)){ 
          return Reflect.get(...arguments)
        }else{
          let retValue;
          switch(true){
            case obj.repOrders.hasOwnProperty(prop):
              retValue = obj.repOrders[prop];
              break;
            case obj.updates.hasOwnProperty(prop):
              retValue = obj.updates[prop];
              break;
            default:
              retValue = obj.attributes[prop];
              break;
          }
          let cascRef = `attr_${prop.replace(/(repeating_[^_]+_)[^_]+/,'$1\$X')}`.toLowerCase();
          let numRetVal = +retValue;
          if(!Number.isNaN(numRetVal) && retValue !== ''){
            retValue = numRetVal;
          }else if(cascades[cascRef] && (typeof cascades[cascRef].defaultValue === 'number' || cascades[cascRef].type === 'number')){
            retValue = cascades[cascRef].defaultValue;
          }
          return retValue;
        }
      },
      set:function(obj,prop,value){
        //Sets the value. Also verifies that the value is a valid attribute value
        //e.g. not undefined, null, or NaN
        if(value || value===0 || value===''){
          if(/reporder/.test(prop)){
            let section = prop.replace(/_reporder_/,'');
            obj.repOrders[section] = value;
          }else if(`${obj.attributes}` !== `${value}` || 
            (obj.updates[prop] && `${obj.updates}` !== `${value}`)
          ){
            if(sections && casc){
              let trigger = getCascObj({sourceAttribute:prop});
              if(!trigger.name){
                Object.assign(casc,expandCascade(cascades,sections));
                trigger = getCascObj({sourceAttribute:prop});
              }
              if(Array.isArray(trigger.affects)){
                attributes.queue.push(...trigger.affects);
              }
            }
            const repRx = /^(repeating_[^_]+)_([^_]+)_(.+)$/;
            if(repRx.test(prop)){
              const [,section,rowID,field] = prop.match(repRx);
              if(repeatObjects[section]){
                repeatObjects[section][rowID] = repeatObjects[section][rowID] || createRepeatObj(section,rowID);
                repeatTargetObjects[section][rowID][field] = value;
              }
            }
            obj.updates[prop] = value;
          }
        }else{
          debug(`!!!Warning: Attempted to set ${prop} to an invalid value:${value}; value not stored!!!`);
        }
        return true;
      },
      deleteProperty(obj,prop){
        //removes the property from the original attributes, updates, and the reporders
        Object.keys(obj).forEach((key)=>{
          delete obj[key][prop.toLowerCase()];
        });
      }
    };
    const attributes = new Proxy(attrTarget,attrHandler);
    return attributes;
  };
  
  /**
   * Function that registers a function for being called via the funcs object. Returns true if the function was successfully registered, and false if it could not be registered for any reason.
   * @memberof Utilities
   * @param {object} funcObj - Object with keys that are names to register functions under and values that are functions.
   * @param {object} optionsObj - Object that contains options to use for this registration.
   * @param {string[]} optionsObj.type - Array that contains the types of specialized functions that apply to the functions being registered. Valid types are `"opener"`, `"updater"`, and `"default"`. `"default"` is always used, and never needs to be passed.
   * @returns {boolean} - True if the registration succeeded, false if it failed.
   * @example
   * //Basic Registration
   * const myFunc = function({trigger,attributes,sections,casc}){};
   * k.registerFuncs({myFunc});
   * 
   * //Register a function to run on sheet open
   * const openFunc = function({trigger,attributes,sections,casc}){};
   * k.registerFuncs({openFunc},{type:['opener']})
   * 
   * //Register a function to run on all events
   * const allFunc = function({trigger,attributes,sections,casc}){};
   * k.registerFuncs({allFunc},{type:['all']})
   */
  const registerFuncs = function(funcObj,optionsObj = {}){
    if(typeof funcObj !== 'object' || typeof optionsObj !== 'object'){
      debug(`!!!! K-scaffold error: Improper arguments to register functions !!!!`);
      return false;
    }
    const typeArr = optionsObj.type ? ['default',...optionsObj.type] : ['default'];
    const typeSwitch = {
      'opener':openHandlers,
      'updater':updateHandlers,
      'new':initialSetups,
      'all':allHandlers,
      'default':funcs
    };
    let setState;
    Object.entries(funcObj).map(([prop,value])=>{
      typeArr.forEach((type)=>{
        if(typeSwitch[type][prop]){
          debug(`!!! Duplicate function name for ${prop} as ${type}!!!`);
          setState = false;
        }else if(typeof value === 'function'){
          typeSwitch[type][prop] = value;
          setState = setState !== false ? true : false;
        }else{
          debug(`!!! K-scaffold error: Function registration requires a function. Invalid value to register as ${type} !!!`);
          setState = false;
        }
      });
    });
    return setState;
  };
  kFuncs.registerFuncs = registerFuncs;
  
  /**
   * Function that sets up the action calls used in the roller mixin.
   * @memberof Sheetworkers
   * @param {object} attributes - The attribute values of the character
   * @param {object[]} sections - All the repeating section IDs
   */
  const setActionCalls = function({attributes,sections}){
    actionAttributes.forEach((base)=>{
      let [section,,field] = k.parseTriggerName(base);
      let fieldAction = field.replace(/_/g,'-');
      if(section){
        sections[section].forEach((id)=>{
          attributes[`${section}_${id}_${field}`] = `%{${attributes.character_name}|${section}_${id}_${fieldAction}}`;
        });
      }else{
        attributes[`${field}`] = `%{${attributes.character_name}|${fieldAction}}`;
      }
    });
  };
  funcs.setActionCalls = setActionCalls;
  kFuncs.setActionCalls = setActionCalls;
  
  
  /**
   * Function that reduces Roll20 macro syntax formulas down to their calculated value.
   * @memberof Sheetworkers
   * @param {object} attributes - The attribute values of the character
   * @param {object[]} sections - All the repeating section IDs
   */
  const parseKFormula = ({trigger,attributes,sections,casc}) => {
    const [baseSection,rowID,attrName] = parseTriggerName(trigger.name);
    const repeatBlockRx = baseSection ?
      /(@{repeating_.+?_\$X_.+?})/g :
      /={([^)]*repeating_[^_]+[^)]*)}=/g;
    let mutFormula = trigger.formula;
    mutFormula = mutFormula.replace(repeatBlockRx,(match,repeatMacro) => {
      const [section] = repeatMacro.match(/repeating_[^_]+/);
      const idArray = baseSection ?
        [rowID] :
        sections[section];
      return idArray.map(id => {
          return `(${repeatMacro.replace(/repeating_[^_]+?_[^_]+?_([^}]+)/g,`${section}_${id}_$1`)})`;
        }).join(
          trigger.type === 'number' ?
            ' + ' :
            ''
        );
    });
    mutFormula = parseMacro(mutFormula,attributes)
      .replace(/@{.+?}/g,'0');
    const mathKeys = ['floor','ceil','round','abs'];
    mathKeys.forEach(func => mutFormula = mutFormula.replace(new RegExp(`${func}\\(`,'g'),`Math.${func}(`));
    const mathRx = new RegExp(`Math\\.(?:${mathKeys.join('|')})`,'g');
    let noAlphaStr = mutFormula
      .replace(mathRx,'');
    return trigger.type !== 'text' ?
      (
        !noAlphaStr.match(/[a-z]/i) ?
          eval(mutFormula) :
          undefined
      ) :
      mutFormula;
  };
  funcs.parseKFormula = parseKFormula;
  kFuncs.parseKFormula = parseKFormula;
  
  /**
   * Function to call a function previously registered to the funcs object. May not be used that much in actual sheets, but very useful when writing unit tests for your sheet. Either returns the function or null if no function exists.
   * @memberof Sheetworkers
   * @param {string} funcName - The name of the function to invoke.
   * @param {...any} args - The arguments to call the function with.
   * @returns {function|null}
   * @example
   * //Call myFunc with two arguments
   * k.callFunc('myFunc','an argument','another argument');
   */
  const callFunc = function(funcName,...args){
    if(funcs[funcName]){
      if(kFuncs.verboseMode){
        debug(`calling ${funcName}`);
      }
      return funcs[funcName](...args);
    }else{
      debug(`Invalid function name: ${funcName}`);
      return null;
    }
  };
  kFuncs.callFunc = callFunc;/**@namespace Sheetworkers */
/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
//Sheet Updaters and styling functions
/**
 * Function that calls the K-scaffold's update and sheet initialization routines.
 */
const updateSheet = function(){
  log('updating sheet');
  getAllAttrs({props:['debug_mode',...baseGet],callback:(attributes,sections,casc)=>{
    kFuncs.debugMode = kFuncs.debugMode || !!attributes.debug_mode;
    if(kFuncs.verboseMode){
      debug({sheet_version:attributes.sheet_version});
    }
    if(!attributes.sheet_version){
      Object.entries(initialSetups).forEach(([funcName,handler])=>{
        if(typeof funcs[funcName] === 'function'){
          if(kFuncs.verboseMode){
            debug(`running ${funcName}`);
          }
          funcs[funcName]({attributes,sections,casc});
        }else{
          if(kFuncs.verboseMode){
            debug(`!!!Warning!!! no function named ${funcName} found. Initial sheet setup not performed.`);
          }
        }
      });
    }else{
      Object.entries(updateHandlers).forEach(([ver,handler])=>{
        if(attributes.sheet_version < +ver){
          handler({attributes,sections,casc});
        }
      });
    }
    if(kFuncs.verboseMode){
      debug({openHandlers});
    }
    Object.entries(openHandlers).forEach(([funcName,func])=>{
      if(typeof funcs[funcName] === 'function'){
        if(kFuncs.verboseMode){
          debug(`running ${funcName}`);
        }
        funcs[funcName]({attributes,sections,casc});
      }else{
        if(kFuncs.verboseMode){
          debug(`!!!Warning!!! no function named ${funcName} found. Sheet open handling not performed.`);
        }
      }
    });
    setActionCalls({attributes,sections});
    attributes.sheet_version = kFuncs.version;
    log(`Sheet Update applied. Current Sheet Version ${kFuncs.version}`);
    attributes.set();
    log('Sheet ready for use');
  }});
};
kFuncs.updateSheet = updateSheet;

const initialSetup = function(attributes,sections){
  if(kFuncs.verboseMode){
    debug('Initial sheet setup');
  }
};

/**
 * This is the default listener function for attributes that the K-Scaffold uses. It utilizes the `triggerFuncs`, `listenerFunc`, `calculation`, and `affects` properties of the K-scaffold trigger object (see the Pug section of the scaffold for more details).
 * @memberof Sheetworkers
 * @param {Roll20Event} event - The Roll20 event object
 * @returns {void}
 * @example
 * //Call from an attribute change
 * on('change:an_attribute',k.accessSheet);
 */
const accessSheet = function(event){
  if(kFuncs.verboseMode){
    debug({funcs:Object.keys(funcs)});
    debug({event});
  }
  getAllAttrs({callback:(attributes,sections,casc)=>{
    let trigger = attributes.getCascObj(event,casc);
    attributes.processChange({event,trigger,attributes,sections,casc});
  }});
};
funcs.accessSheet = accessSheet;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/*
Cascade Expansion functions
*/
//Expands the repeating section templates in cascades to reflect the rows actually available
const expandCascade = function(cascade,sections){
  return _.keys(cascade).reduce((memo,key)=>{//iterate through cascades and replace references to repeating attributes with correct row ids.
    if(/^(?:act|attr)_repeating_/.test(key)){//If the attribute is a repeating attribute, do special logic
      expandRepeating(memo,key,cascade,sections);
    }else if(key){//for non repeating attributes do this logic
      expandNormal(memo,key,cascade,sections);
    }
    return memo;
  },{});
};
kFuncs.expandCascade = (sections) => expandCascade(cascades,sections);

const expandRepeating = function(memo,key,cascade,sections){
  key.replace(/((?:attr|act)_)(repeating_[^_]+)_[^_]+?_(.+)/,(match,type,section,field)=>{
    (sections[section]||[]).forEach((id)=>{
      memo[`${type}${section}_${id}_${field}`]=_.clone(cascade[key]);//clone the details so that each row's attributes have correct ids
      memo[`${type}${section}_${id}_${field}`].name = `${section}_${id}_${field}`;
      if(key.startsWith('attr_')){
        memo[`${type}${section}_${id}_${field}`].affects = memo[`${type}${section}_${id}_${field}`].affects.reduce((m,affected)=>{
          if(affected.startsWith(section)){//otherwise if the affected attribute is in the same section, simply set the affected attribute to have the same row id.
            m.push(applyID(affected,id));
          }else if(/repeating/.test(affected)){//If the affected attribute isn't in the same repeating section but is still a repeating attribute, add all the rows of that section
            addAllRows(affected,m,sections);
          }else{//otherwise the affected attribute is a non repeating attribute. Simply add it to the computed affected array
            m.push(affected);
          }
          return m;
        },[]);
      }
    });
  });
};

const applyID = function(affected,id){
  return affected.replace(/(repeating_[^_]+_)[^_]+(.+)/,`$1${id}$2`);
};

const expandNormal = function(memo,key,cascade,sections){
  memo[key] = _.clone(cascade[key]);
  if(key.startsWith('attr_')){
    memo[key].affects = memo[key].affects || [];
    memo[key].affects = memo[key].affects.reduce((m,a)=>{
      if(/^repeating/.test(a)){
        addAllRows(a,m,sections);
      }else{
        m.push(a);
      }
      return m;
    },[]);
  }
};

const addAllRows = function(affected,memo,sections){
  affected.replace(/(repeating_[^_]+?)_[^_]+?_(.+)/,(match,section,field)=>{
    sections[section].forEach(id=>memo.push(`${section}_${id}_${field}`));
  });
};/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
/**
 * These are functions that provide K-scaffold aliases for the basic Roll20 sheetworker functions. These functions also provide many additional features on top of the standard Roll20 sheetworkers.
 * @namespace Sheetworkers.Sheetworker Aliases
 */
/**
 * Alias for [setSectionOrder()](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) that allows you to use the section name in either `repeating_section` or `section` formats. Note that the Roll20 sheetworker [setSectionOrder](https://wiki.roll20.net/Sheet_Worker_Scripts#setSectionOrder.28.3CRepeating_Section_Name.3E.2C_.3CSection_Array.3E.2C_.3CCallback.3E.29) currently causes some display issues on sheets.
 * @memberof Sheetworker Aliases
 * @name setSectionOrder
 * @param {string} section - The name of the section, with or without `repeating_`
 * @param {string[]} order - Array of ids describing the desired order of the section.
 * @returns {void}
 * @example
 * //Set the order of a repeating_weapon section
 * k.setSectionOrder('repeating_equipment',['id1','id2','id3']);
 * //Can also specify the section name without the repeating_ prefix
 * k.setSectionOrder('equipment',['id1','id2','id3']);
 */
const _setSectionOrder = function(section,order){
  let trueSection = section.replace(/repeating_/,'');
  setSectionOrder(trueSection,order);
};
// deprecation warning added to setSectionOrder
kFuncs.setSectionOrder = (section,order) => {
  debug('###Deprecation: It is recommended to use the "move" method of the nested section info feature of the attributes object instead of setSectionOrder');
  _setSectionOrder(section,order);
};

/**
 * Alias for [removeRepeatingRow](https://wiki.roll20.net/Sheet_Worker_Scripts#removeRepeatingRow.28_RowID_.29) that also removes the row from the current object of attribute values and array of section IDs to ensure that erroneous updates are not issued.
 * @memberof Sheetworker Aliases
 * @name removeRepeatingRow
 * @param {string} row - The row id to be removed
 * @param {attributesProxy} attributes - The attribute values currently in memory
 * @param {object} sections - Object that contains arrays of all the IDs in sections on the sheet indexed by repeating name.
 * @returns {void}
 * @example
 * //Remove a repeating Row
 * k.getAllAttrs({
 *  callback:(attributes,sections)=>{
 *    const rowID = sections.repeating_equipment[0];
 *    k.removeRepeatingRow(`repeating_equipment_${rowID}`,attributes,sections);
 *    console.log(sections.repeating_equipment); // => rowID no longer exists in the array.
 *    console.log(attributes[`repeating_equipment_${rowID}_name`]); // => undefined
 *  }
 * })
 */
const _removeRepeatingRow = function(row,attributes,sections){
  Object.keys(attributes.attributes).forEach((key)=>{
    if(key.startsWith(row)){
      delete attributes[key];
    }
  });
  let [,section,rowID] = row.match(/(repeating_[^_]+)_(.+)/,'');
  sections[section] = sections[section].filter((id)=>id!==rowID);
  delete attributes[section][rowID];
  removeRepeatingRow(row);
};
kFuncs.removeRepeatingRow = _removeRepeatingRow;

/**
 * Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) that converts the default object of attribute values into an {@link attributesProxy} and passes that back to the callback function.
 * @memberof Sheetworker Aliases
 * @name getAttrs
 * @param {string[]} [props=baseGet] - Array of attribute names to get the value of. Defaults to {@link baseGet} if not passed.
 * @param {function(attributesProxy)} callback - The function to call after the attribute values have been gotten. An {@link attributesProxy} is passed to the callback.
 * @example
 * //Gets the attributes named in props.
 * k.getAttrs({
 *  props:['attribute_1','attribute_2'],
 *  callback:(attributes)=>{
 *    //Work with the attributes as you would in a normal getAttrs, or use the superpowers of the K-scaffold attributes object like so:
 *    attributes.attribute_1 = 'new value';
 *    attributes.set();
 *  }
 * })
 */
const _getAttrs = function({props=baseGet,callback}){
  getAttrs(props,(values)=>{
    const attributes = createAttrProxy(values);
    callback(attributes);
  });
};
kFuncs.getAttrs = _getAttrs;

/**
 * Alias for [getAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getAttrs.28attributeNameArray.2C_callback.29) and [getSectionIDs](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that combines the actions of both sheetworker functions and converts the default object of attribute values into an {@link attributesProxy}. Also gets the details on how to handle all attributes from the master {@link cascades} object and.
 * @memberof Sheetworker Aliases
 * @param {Object} args
 * @param {string[]} [args.props=baseGet] - Array of attribute names to get the value of. Defaults to {@link baseGet} if not passed.
 * @param {repeatingSectionDetails} sectionDetails - Array of details about a section to get the IDs for and attributes that need to be gotten. 
 * @param {function(attributesProxy,sectionObj,expandedCascade):void} args.callback - The function to call after the attribute values have been gotten. An {@link attributesProxy} is passed to the callback along with a {@link sectionObj} and {@link expandedCascade}.
 * @example
 * //Get every K-scaffold linked attribute on the sheet
 * k.getAllAttrs({
 *  callback:(attributes,sections,casc)=>{
 *    //Work with the attributes as you please.
 *    attributes.some_attribute = 'a value';
 *    attributes.set();//Apply our change
 *  }
 * })
 */
const getAllAttrs = function({props=baseGet,sectionDetails=repeatingSectionDetails,callback}){
  getSections(sectionDetails,(repeats,sections)=>{
    getAttrs([...props,...repeats],(values)=>{
      const casc = expandCascade(cascades,sections);
      const attributes = createAttrProxy(values,sections,casc);
      orderSections(attributes,sections,casc);
      callback(attributes,sections,casc);
    })
  });
};
kFuncs.getAllAttrs = getAllAttrs;

/**
 * Alias for [getSectionIDs()](https://wiki.roll20.net/Sheet_Worker_Scripts#getSectionIDs.28section_name.2Ccallback.29) that allows you to iterate through several functions at once. Also assembles an array of repeating attributes to get.
 * @memberof Sheetworker Aliases
 * @param {object[]} sectionDetails - Array of details about a section to get the IDs for and attributes that need to be gotten.
 * @param {string} sectionDetails.section - The full name of the repeating section including the `repeating_` prefix.
 * @param {string[]} sectionDetails.fields - Array of field names that need to be gotten from the repeating section
 * @param {function(string[],sectionObj)} callback - The function to call once all IDs have been gotten and the array of repating attributes to get has been assembled. The callback is passed the array of repating attributes to get and a {@link sectionObj}.
 * @example
 * // Get some section details
 * const sectionDetails = {
 *  {section:'repeating_equipment',fields:['name','weight','cost']},
 *  {section:'repeating_weapon',fields:['name','attack','damage']}
 * };
 * k.getSections(sectionDetails,(attributeNames,sections)=>{
 *  console.log(attributeNames);// => Array containing all row specific attribute names
 *  console.log(sections);// => Object with arrays containing the row ids. Indexed by section name (e.g. repeating_eqiupment)
 * })
 */
const getSections = function(sectionDetails,callback){
  let queueClone = _.clone(sectionDetails);
  const worker = (queue,repeatAttrs=[],sections={})=>{
    let detail = queue.shift();
    getSectionIDs(detail.section,(IDs)=>{
      sections[detail.section] = IDs;
      IDs.forEach((id)=>{
        detail.fields.forEach((f)=>{
          repeatAttrs.push(`${detail.section}_${id}_${f}`);
        });
      });
      repeatAttrs.push(`_reporder_${detail.section}`);
      if(queue.length){
        worker(queue,repeatAttrs,sections);
      }else{
        callback(repeatAttrs,sections);
      }
    });
  };
  if(!queueClone[0]){
    callback([],{});
  }else{
    worker(queueClone);
  }
};
kFuncs.getSections = getSections;

// Sets the attributes while always calling with {silent:true}
// Can be awaited to get the values returned from _setAttrs
/**
 * Alias for [setAttrs()](https://wiki.roll20.net/Sheet_Worker_Scripts#setAttrs.28values.2Coptions.2Ccallback.29) that sets silently by default.
 * @memberof Sheetworker Aliases
 * @alias setAttrs
 * @param {object} obj - The object containting attributes to set
 * @param {boolean} [vocal=false] - Whether to set silently (default value) or not.
 * @param {function()} [callback] - The callback function to invoke after the setting has been completed. No arguments are passed to the callback function.
 * @example
 * //Set some attributes silently
 * k.setAttrs({attribute_1:'new value'})
 * //Set some attributes and triggers listeners
 * k.setAttrs({attribute_1:'new value',true})
 * //Set some attributes and call a callback function
 * k.setAttrs({attribute_1:'new value'},null,()=>{
 *  //Do something after the attribute is set
 * })
 */
const set = function(obj,vocal=false,callback){
  setAttrs(obj,{silent:!vocal},callback);
};
kFuncs.setAttrs = set;

const generateCustomID = function(string){
  if(!string.startsWith('-')){
    string = `-${string}`;
  }
  rowID = generateRowID();
  let re = new RegExp(`^.{${string.length}}`);
  return `${string}${rowID.replace(re,'')}`;
};


/**
 * Alias for generateRowID that adds the new id to the {@link sectionObj}. Also allows for creation of custom IDs that conform to the section ID requirements.
 * @memberof Sheetworker Aliases
 * @name generateRowID
 * @param {sectionObj} sections
 * @param {string} [customText] - Custom text to start the ID with. This text should not be longer than the standard repeating section ID format.
 * @returns {string} - The created ID
 * @example
 * k.getAllAttrs({
 *  callback:(attributes,sections,casc)=>{
 *    //Create a new row ID
 *    const rowID = k.generateRowID('repeating_equipment',sections);
 *    console.log(rowID);// => repeating_equipment_-p8rg908ug0suzz
 *    //Create a custom row ID
 *    const customID = k.generateRowID('repeating_equipment',sections,'custom');
 *    console.log(customID);// => repeating_equipment_-custom98uadj89kj
 *  }
 * });
 */
const _generateRowID = function(section,sections,customText){
  let rowID = customText ?
    generateCustomID(customText) :
    generateRowID();
  section = section.match(/^repeating_[^_]+$/) ?
    section :
    `repeating_${section}`;
  sections[section] = sections[section] || [];
  sections[section].push(rowID);
  return `${section}_${rowID}`;
};
kFuncs.generateRowID = (section,sections,customText) => {
  debug('###Deprecation: It is recommended to use the "create" method of the nested section info feature of the attributes object instead of k.generateRowID');
  return _generateRowID(section,sections,customText);
};

/**
 * An alias for [Roll20's getTranslationByKey](https://wiki.roll20.net/Sheet_Worker_Scripts#getTranslationByKey.28.5Bkey.5D.29) that also supports data-i18n-vars syntax replacement and returns the translation key if no value is found instead of `false`.
 * @memberof Sheetworker Aliases
 * @name getTranslationByKey
 * @param {string} key - The translation key to look up.
 * @param {string[]} [variables = []] - An array of variable values to replace variable indexes with.
 * @returns {string}
 */
const _getTranslationByKey = (key,variables = []) => {
  let translate = getTranslationByKey(key) || key;
  console.warn('getTranslationByKey',getTranslationByKey(key));
  console.warn('translate:',translate);
  variables.forEach((v,i) => {
    translate = translate.replace(new RegExp(`\\{\\{${i}\\}\\}`,'g'),v);
  });
  return translate;
}
kFuncs.getTranslationByKey = _getTranslationByKey;

/**
 * Assembles the roll string from the roll object
 * @param {object} rollObj - object describing the roll
 * @param {string} [rollStart = '@{template_start}'] - The string to start the roll with.
 * @returns {string}
 */
const assembleRoll = (rollObj,rollStart = kFuncs.defaultRollStart) => {
  return Object.entries(rollObj).reduce((str,[field,content])=>{
    return str += ` {{${field}=${content ?? ''}}}`;
  },`${rollStart}`);
};


/**
 * @typedef {Object} kRoll
 * @property {Object} roll - The roll object returned by [Roll20's startRoll](https://wiki.roll20.net/Custom_Roll_Parsing#Sheetworker_Functions).
 * @property {Function} roll.finish - Finishes the associated roll passing it the computeObj and rollId.
 * @property {Object} computeObj - object for storing manipulations to the roll. Assign manipulations to this, DO NOT reassign it to a new object.
 */

/**
 * 
 * @param {object} rollObj - Object specifying the fields to pass to the rolltemplate. Object keys are field names. Object values are the field values.
 * @param {string} [startString = '@{template_start}'] - Text that should be prepended to the roll string that results from rollObj.
 * @returns {kRoll} 
 */
const _startRoll = async (rollObj,startString) => {
  const rollString = assembleRoll(rollObj,startString);
  const roll = await startRoll(rollString);
  const computeObj = {};
  roll.finish = () => {
    finishRoll(roll.rollId,computeObj);
  };
  return {roll, computeObj};
};
kFuncs.startRoll = _startRoll;/*jshint esversion: 11, laxcomma:true, eqeqeq:true*/
/*jshint -W014,-W084,-W030,-W033*/
const listeners = {};

/**
 * The array of attribute names that the k-scaffold gets by default. Does not incude repeating attributes.
 * @memberof Variables
 * @var
 * @type {array}
 */
const baseGet = Object.entries(cascades).reduce((memo,[attrName,detailObj])=>{
  if(!/repeating/.test(attrName) && detailObj.type !== 'action'){
    memo.push(detailObj.name);
  }
  if(detailObj.listener){
    listeners[detailObj.listener] = detailObj.listenerFunc;
  }
  return memo;
},[]);
kFuncs.baseGet = baseGet;

const registerEventHandlers = function(){
  on('sheet:opened',updateSheet);
  if(kFuncs.verboseMode){
    debug({funcKeys:Object.keys(funcs),funcs});
  }
  //Roll20 change and click listeners
  Object.entries(listeners).forEach(([event,funcName])=>{
    if(funcs[funcName]){
      on(event,funcs[funcName]);
    }else{
      debug(`!!!Warning!!! no function named ${funcName} found. No listener created for ${event}`,true);
    }
  });
  log(`kScaffold Loaded`);
};
setTimeout(registerEventHandlers,0);//Delay the execution of event registration to ensure all event properties are present.

/**
 * Function to add a repeating section when the add button of a customControlFieldset or inlineFieldset is clicked.
 * @memberof Sheetworkers
 * @param {object} event - The R20 event object
 */
const addItem = function(event){
  let [,,section] = parseClickTrigger(event.triggerName);
  section = section.replace(/add-/,'');
  getAllAttrs({
    callback:(attributes,sections,casc) => {
      let row = _generateRowID(section,sections);
      attributes[`${row}_name`] = '';
      setActionCalls({attributes,sections});
      const trigger = cascades[`fieldset_repeating_${section}`];
      if(trigger){
        if(trigger.addFuncs){
          trigger.addFuncs.forEach((funcName) => {
            if(funcs[funcName]){
              funcs[funcName]({attributes,sections,casc,trigger,newRow:row});
            }
          });
        }
        if(Array.isArray(trigger.affects)){
          attributes.queue.push(...trigger.affects);
        }
      }
      attributes.set({attributes,sections,casc});
    }
  });
};
funcs.addItem = addItem;/**
 * The default tab navigation function of the K-scaffold. Courtesy of Riernar. It will add `k-active-tab` to the active tab-container and `k-active-button` to the active button. You can either write your own CSS to control display of these, or use the default CSS included in `scaffold/_k.scss`. Note that `k-active-button` has no default CSS as it is assumed that you will want to style the active button to match your system.
 * @memberof Sheetworkers
 * @param {Object} trigger - The trigger object
 * @param {object} attributes - The attribute values of the character
 */
const kSwitchTab = function ({ trigger, attributes }) {
  const [container, tab] = (
    trigger.name.match(/nav-tabs-(.+)--(.+)/) ||
    []
  ).slice(1);
  $20(`[data-container-tab="${container}"]`).removeClass('k-active-tab');
  $20(`[data-container-tab="${container}"][data-tab="${tab}"]`).addClass('k-active-tab');
  $20(`[data-container-button="${container}"]`).removeClass('k-active-button');
  $20(`[data-container-button="${container}"][data-button="${tab}"]`).addClass('k-active-button');
  const tabInputName = `${container.replace(/\-/g,'_')}_tab`;
  if(persistentTabs.indexOf(tabInputName) > -1){
    attributes[tabInputName] = trigger.name;
  }
}

registerFuncs({ kSwitchTab });

/**
 * Sets persistent tabs to their last active state
 * @memberof Sheetworkers
 * @param {object} attributes - The attribute values of the character
 */
const kTabOnOpen = function({trigger,attributes,sections,casc}){
  if(typeof persistentTabs === 'undefined') return;
  persistentTabs.forEach((tabInput) => {
    const pseudoTrigger = {name:attributes[tabInput]};
    kSwitchTab({trigger:pseudoTrigger, attributes});
  });
};
registerFuncs({ kTabOnOpen },{type:['opener']});
    return kFuncs;
    }());
    const actionAttributes = ["wealth_action","persuasion_action","leadership_action","psychology_action","culture_action","physical_action","resolve_action","awareness_action","stealth_action","mechanics_action","electronics_action","computers_action","biotech_action","medicine_action","astronomy_action","planets_action"];/**
 * Function to calculate the attribute modifier
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcAttributeSkillMod = function({trigger,attributes,sections,casc}){
	// baseName == "intelligence_skill_mod", so split off first part
	const baseName = `${trigger.name}`.split("_")[0];
	console.log ('calcAttributeSkillMod()', trigger, attributes, sections, casc);

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

/**
 * Function to calculate the attribute modifier
 * @param {object} trigger - The trigger that caused the function to be called
 * @param {object} attributes - The attribute values of the character
 * @param {object[]} sections - All the repeating section IDs
 * @param {object} casc - Expanded cascade object
 */
const calcSkill = function({trigger,attributes,sections,casc}){
	console.log ('calcSkill()', trigger, attributes, sections, casc);
	const skillName = trigger.name;

	// attributeSkillMod + trained/untrained + toolbox + workshop + mod

	return (attributes[`${skillName}_trained`] ? 1 : attributes['untrained']) +
		attributes[`${skillName}_toolbox`] +
		attributes[`${skillName}_workshop`] +
		attributes[`${skillName}_modifier`] +
		attributes[`${skillName}_attribute_modifier`];
};
k.registerFuncs({calcSkill});

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
};
k.registerFuncs({rollSkill});

console.log ("calculations workers registered");

  
console.debug = vi.fn(a => null);
console.log = vi.fn(a => null);
console.table = vi.fn(a => null);
module.exports = {k,...global};