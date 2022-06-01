function $S(selector) { return document.querySelector(selector); }

const tableHeaders = [
    "Phrase", "Output", "Notes", "Examples"
];

const phraseData = [
    //[Phrase, Output, Notes, Examples, isHeaderRow]
    ["","","All phrases are case-insensitive",""],
    ["","","Autocomplete = matches all options which start with given phrase.",""],
    ["pokemon - name",,"all in this category autocomplete",,true],
    ["{name}", "Pokemon with either name or nickname {name}", "All other phrases take priority over {name}", "'vulpix', 'vulp'"],
    ["+{name}", "All pokemon in the same evolutionary family as {name}", "Does nothing if put before any other search phrase.<br><a href='https://i.imgur.com/2nDmqnk.png'>BUG</a>: Returns no results if put before '@' or '#'", "'+vulpix', '+bidoo'"],
    ["", "\"Show Evolutionary Line\" button", "Essentially the same as putting '+' before every {name}.<br>Does not cause issues with '#'<br>BUG: See @{move}. Does work with the other @{criteria}."],
    ["", "Mid-name Search", "Pokemon whose default names include non-alphanumeric characters can be searched for with the text after those characters.<br>[English] This affects all megas, as well as <a href='https://pastebin.com/raw/y0vQCv8J'>this list</a>.<br><a href='https://i.imgur.com/EKf3oJv.png'>BUG</a>: Returns no results if + is added or Show Line enabled.<br>'BUG': Does not work with nicknames.", "'beedrill', 'koko', 'Oh'"],
    ["pokemon - ranges",,"all in this category are ranges",,true],
    ["","","{phrase}{N} find pokemon with phrase value of {N}<br>{phrase}{N}-{M} finds values between {N} and {M}, inclusive<br>{phrase}{N}- matches values ≥ {N}<br>{phrase}-{N} matches values ≤ {N}"],
    ["cp{N}", "Pokemon with CP {N}",, "'cp-1500', 'cp2500-1501', 'cp3000-'"],
    ["distance{N}", "Pokemon obtained {N} km away", "Measures against current ingame location.<br>When used without '-', matches distances less than {N}: 'distance{N}' = 'distance-{N}'.<br>Caught location is influenced by <a href='https://pokemongohub.net/post/featured/comprehensive-guide-s2-cells-pokemon-go/'>S2 shenanigans</a>.","'distance101-', 'distance1000'"],
    ["hp{N}", "Pokemon with HP {N}", "Considers maximum HP, ignores any damage taken. Use HP sort for that.", "'hp200-'"],
    ["{N}", "Pokemon with pokedex number {N}", "Uses national dex #.","'-151', '399'"],
    ["year{N}", "Pokemon caught in year {N}", "Two digit yy is assumed 20yy.", "'year16', 'year20-2021', 'year2017-'"],
    ["age{N}","Pokemon caught {N} days ago", "Age increases precisely 24 hours after catch.<br>For hatches, searches based on hatched date.<br>For trades, searches based on original caught date.", "'age0', 'age365-'"],
    ["buddy{N}", "Pokemon with buddy friendship at level {N}", "0 = never buddies, 1 = buddies, never leveled up<br>2/3/4/5=good/great/ultra/best buddies<br>'buddy1-' will find all pokemon you've previously buddied","'buddy5', 'buddy1-4'"],
    ["mega{N}", "Pokemon with mega level {N}", "0 = never mega evolved, 1/2/3 = Base/High/Max mega level.<br>'mega1-' finds all previously mega evolved pokemon.<br>'mega0' finds only pokemon capable of mega evolution.<br><a href='https://i.imgur.com/uDWvVJq.png'>Bug</a>: negated 'mega{N}' only returns pokemon capable of mega evolution, instead of all pokemon.","'mega1-', 'mega3'"],
    ["pokemon - categories",,"groups of phrases that split pokemon into categories",,true],
    ["{type}", "Pokemon with type {type}","Options: grass, water, fire, ground, ice, steel, fairy, electric, flying, poison, ghost, dark, normal, bug, rock, fighting, dragon, psychic","'water'"],
    ["{region}", "Pokemon from the {region} region", "Options: Kanto, Johto, Hoenn, Sinnoh, Unova, Galar, Alola, Kalos<br>Galar and Alola also return regional forms.<br><a href='https://redd.it/ooc47n'>BUG</a>: Regional forms excluded by !Galar and !Alola cannot be unexcluded.<br>'Bug': There is no Hisui search.", "'alola'"],
    ["{gender}", "Pokemon with gender {gender}", "Options: male, female, genderunknown",],
    ["{size}", "Pokemon with size {size}", "Options: xxs, xs, xl, xxl<br>Size is relative per species, based on <a href='https://thesilphroad.com/science/big-magikarp-tiny-rattata'>height</a>.<br>XX sizes were added Oct 2021, <a href='https://www.reddit.com/r/TheSilphRoad/comments/q6cfea/xxl_pokemon/'>very little</a> is known about them."],
    ["{N}*","Pokemon in appraisal range {N}", "Options: 0, 1, 2, 3, 4<br>Based on sum of IVs: 0 = 0-22, 1 = 23-29, 2 = 30-36, 3 = 37-44, 4 = 45", "'4*', '0*'"],
    ["pokemon - keywords",,"various qualifiers certain pokemon meet",,true],
    ["costume", "Pokemon wearing <a href='https://pokemongo.fandom.com/wiki/Event_Pokémon'>clothing</a>","Caught during certain events."],
    ["eggsonly", "<a href='https://bulbapedia.bulbagarden.net/wiki/Baby_Pokémon'>Baby</a> pokemon", "Typically only found in eggs"],
    ["{keyword}","Pokemon that are {keyword}", "Options: <a href='https://bulbapedia.bulbagarden.net/wiki/Legendary_Pokémon'>legendary</a>, <a href='https://bulbapedia.bulbagarden.net/wiki/Mythical_Pokémon'>mythical</a>, shadow, purified, shiny, lucky."],
    ["defender","Pokemon currently defending a gym"],
    ["favorite","Favorited Pokemon","Marked with a star in storage."],
    ["candyxl", "Pokemon powered beyond level 40", "BUG? Includes best buddies boosted past 40."],
    ["pokemon - encounter type","Pokemon obtained from...","various ways to obtain pokemon",,true],
    ["raid", "raids", "Only extends back to around Oct 8 2020.<br>Includes all raid types."],
    ["{raid_type}", "types of raids", "Options: remoteraid, megaraid, exraid.<br>Only extends back to around Oct 8 2020"],
    ["hatched", "eggs", "Only extends back to around July 13-20 2017"],
    ["research", "research", "Only extends back to around Oct 28 2020<br>Includes all research types (timed, field, special)."],
    ["gbl", "GO Battle League", "Only extends back to around Oct 28 2020"],
    ["rocket", "Team GO Rocket", "Only extends back to around Oct 28 2020<br>Includes all rocket encounter types.<br>'BUG': Does not include research shadows (eg Apex, GO Fest '20 Mewtwo)."],
    ["snapshot", "photobombs"],
    ["traded", "trades", "Will also show up under original encounter type search"],
    ["", "the wild", "'&!raid&!hatched&!research&!gbl&!rocket&!snapshot&!traded&'"],
    ["pokemon - evolution","Pokemon which...","phrases related to evolution",,true],
    ["evolve", "you can currently evolve", "Checks candy & item requirements.<br>Checks <a href='https://pokemongo.fandom.com/wiki/Evolution?so=search#Buddy'>quests</a> for walking, ignores other quests.<br><a href='https://imgur.com/quVvUdf.png'>BUG</a>: Includes 2019 halloween kanto starters."],
    ["evolvenew", "you've never had the evolution of", "Only considers unregistered evolutions in the main & mega pokedex.<br><a href=https://redd.it/imkedw/>BUG</a>: Includes already mega-evolved pokemon species and current mega.<br><a href='https://imgur.com/TJ2R5VD.png'>BUG</a>: Includes 2019 halloween kanto starters."],
    ["megaevolve", "can currently mega evolve", "Considers energy for each pokemon.<br> Does not include currently active mega evolution."],
    ["item", "need an <a href='https://pokemongo.fandom.com/wiki/Evolution_Items#Usage'>item</a> to evolve","Bug? Only returns pokemon which can 'evolve'"],
    ["tradeevolve","have a trade evolution","<a href='https://pokemongo.fandom.com/wiki/Evolution?so=search#Trade_evolution'>Means</a> if species is recieved in trade, final evolution is free<br><a href='https://i.imgur.com/i0iJkvW.png'>BUG</a>: Does not return traded pokemon."],
    ["pokemon - moves",,"phrases related to moves, using @",,true],
    ["@{type}","Moves with type {type}","Takes priority over {move}","'@fairy'"],
    ["@{move}","Moves with name {move}", "Autocomplete. Moves with spaces use spaces.<br> To find the move \"psychic\", use '@psychi'<br>(more correctly '@psychi&!@psychic fangs')<br><a href='https://i.imgur.com/Wc88S9L.png'>BUG</a>: With 'Show Evolutionary Line' enabled, @{move} is overridden to +{move}, which searches for pokemon name.", "'@crunch', '@hydro pump'"],
    ["@special", "Moves that can't be learnt with normal TMs","Includes <a href='https://gamepress.gg/pokemongo/elite-tm-movelist'>event</a> legacy, <a href='https://gamepress.gg/pokemongo/legacy-pokemon-move-list'>true</a> legacy, frustration, & return."],
    ["@weather", "Moves with type currently weather boosted", "BUG: In remote raid lobby, will show local weather, not remote"],
    ["@{1/2/3}{criteria}", "Moves in given slot matching criteria","1 = quick, 2 = first charge, 3 = second charge.<br>Options: {type}, {move}, special, weather.<br>Also has the @{move} bug.","'@1water', '@3meteor mash', '@2weather'"],
    ["!@mov", "Pokemon with a 2nd charged move unlocked", "Autocomplete. A default 'move_name_0000' is used for pokemon with no 2nd charge move.<br>Use at least 'mov' to avoid losing moonblast et al.", "'!@mov', '!@3move_name_0000'"],
    ["","","<a href='https://www.reddit.com/r/TheSilphRoad/comments/u3hhqt/useful_search_strings_in_different_languages/i51n7mo/'>BUG</a>: Improperly phrased @searches can return tags, ranged results, or appraisals."],
    ["pokemon - tags",,"phrases related to tags",,true],
    ["{tag}", "Pokemon <a href='https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/2800-tagging-your-pokemon-inventory/?p=all&s=finding-evolving-hatching&f=tagging-your-pokemon-inventory'>tagged</a> with {tag} tag", "BUG: Tags named the same as an existing search phrase will break that phrase. Don't do this please."],
    ["#{tag}", "Pokemon tagged with tag {tag}", "Autocomplete."],
    ["#", "All tagged pokemon", "use '!#' for all untagged pokemon", "'#', '!#'"],
    ["logical operations",,"advanced tools for combining searches",,true],
    ["& or |","AND combination", "All pokemon matching BOTH properties", "'spheal&shiny', '+vulpix&alola'"],
    [", or ; or :", "OR combination","All pokemon matching EITHER property", "'4*,shiny', "],
    ["!", "NOT operator", "All pokemon that do NOT have property.<br>Must directly prepend phrase to be negated (no spaces)", "'!shiny', '!bulbasaur'"],
    ["",,"& and , can be chained together multiple times.<br>Ambiguity is resolved by always considering ,s nested inside &s", "'0*,1*,2*', 'meowth,alola&vulpix,galar'"],
    ["miscellany",,"additional information",,true],
    ["","","Each incubated egg will count as +1 towards total pokemon count, but will always be ignored in filtered searches"],
    ["",,"The clickable search phrases are all &-combined together", ""],
    ["",,"You can see your four most recent searches by pressing \"see more\" while searching"],
    ["",,"You can save a recent search by holding down on it.<br>BUG: Holding creates many saves"],
    ["",,"You can rename your saved searches by holding down on them.<br>You <i>cannot</i> search by this name.<br>Use your phone's <a href='https://silph.gg/pages/wpPage/how-to-use-pokemon-go-search-strings'>text replacement</a> feature for that."],
]

const friendData = [
    ["friends - phrases",,"phrases for searching the friends list",,true],
    ["{name}", "Friends with name or nickname {name}", "Autocomplete."],
    ["interactable", "Friends you have not interacted with today", ""],
    ["giftable", "Friends you can currently send a gift to", "Gift opening time is based on opener's local time."],
    ["lucky", "Lucky friends"],
    ["friendlevel{N}", "Friends with friendship level {N}", "Range. 0 = no interaction<br>1/2/3/4 = good/great/ultra/best friends.", "'friendlevel4', 'friendlevel2-3'"],
    ["logical operations",,"Same as storage search",,true],
];

const pages = { // buttonId : linkedPageId
    'phraseBTN' : 'phrasePage',
    'friendBTN' : 'friendPage',
    'linkBTN' : 'linkPage',
    'creditBTN' : 'creditPage',
    'aboutBTN' : 'aboutPage',
};

function doGet(map, key, dft) {
    let val = map[key];
    if (map[key] == null) {
	console.error(`key ${key} has no value, defaulting to english`);
	val = dft
    }
    return val;
}

function buildPage() {
    let lang = $S('#languageModal').value;
    let strs = doGet(LANGUAGE_MAP, lang, LANGUAGE_MAP["English"]);
    let lang_tableHeaders = doGet(strs, 'tableHeaders', tableHeaders);
    let lang_phraseData = doGet(strs, 'phraseData', phraseData);
    let lang_friendData = doGet(strs, 'friendData', friendData);
    buildTable('phraseTable', lang_phraseData, lang_tableHeaders );
    buildTable('friendTable', lang_friendData, lang_tableHeaders );
}

function buildTable(id, data, headers) {
    let curTable = "<tr>";
    for (let row of headers) {
	curTable += `<th id=phraseHead>${row}</th>`;
    }
    curTable += "</tr>";
    for (let row of data) {
	let doID = row[4] || false;
	let addtd = `<td${doID?' class=phraseRow':''}>`
	curTable += `<tr>${addtd}${row[0]||""}</td>` +
	    `${addtd}${row[1]||""}</td>` +
	    `${addtd}${row[2]||""}</td>` +
	    `${addtd}${row[3]||""}</td></tr>`;
    }
    $S(`#${id}`).innerHTML = curTable;
}

function pageShift(btn, page, altPages) {
    $S(`#${btn}`).addEventListener('click', (e)=>{
	$S(`#${page}`).classList.remove('hide');
	for (let altPage of altPages) {
	    $S(`#${altPage}`).classList.add('hide');
	}
    });
}

window.addEventListener('load', () => {
    for (let [key, val] of Object.entries(pages)) {
	pageShift(key, val, Object.values(pages).filter(e=>e!=val));
    }
    let curLangs = '';
    for (let lang of Object.keys(LANGUAGE_MAP)) {
	curLangs += `<option val="${lang}">${lang}</option>`
    }
    $S('#languageModal').innerHTML = curLangs;
    $S('#languageModal').addEventListener('change', buildPage);
    buildPage();
});

const LANGUAGE_MAP = {
    "English" : {
	"tableHeaders" : tableHeaders,
	"phraseData" : phraseData,
	"friendData" : friendData,
    },
    /*"Test": {
	"tableHeaders" : ["A","B","C","D"],
	"phraseData" : [["T1","T2","T3","T4",true]],
	"friendData" : [["T1","T2","T3","T4",false]],
    }*/
}
