function $S(selector) { return document.querySelector(selector); }

const phraseData = [
    ["pokemon properties",,,,true],
    ["cp{N}", "Pokemon with CP {N}", "Range.", "'cp-1500', cp'2500-1501', 'cp3000-'"],
    ["distance{N}", "Pokemon obtained {N} km away", "Range. Measures against current ingame location. Caught location may be influenced by S2 shenanigans.","'distance101-', 'distance-1000'"],
    ["hp{N}", "Pokemon with HP {N}", "Range. Considers maximum HP, ignores any damage taken. Use HP sort for that.", "'hp200-'"],
    ["{N}", "Pokemon with pokedex number {N}", "Range. Uses national dex #.","'-151', '399'"],
    ["age{N}","Pokemon caught {N} days ago", "Range. Age increases precisely 24 hours after catch", "'age0', 'age365-'"],
    ["buddy{N}", "Pokemon with buddy friendship at level {N}", "Range. 0 = never buddies, 1 = buddies, never leveled up, 2/3/4/5=good/great/ultra/best","'buddy5', 'buddy1-4'"],
    ["year{N}", "Pokemon caught in year {N}", "Range. Accepts both 20XX and XX.", "'year16', 'year20-21', 'year17-1'"],
    ["{N}*","Pokemon in appraisal range {N}", "{N} is either 0/1/2/3/4, based on sum of IVs. 0 = 0-22, 1 = 23-29, 2 = 30-36, 3 = 37-44, 4 = 45", "'4*', '0*'"],
    ["defender","Pokemon currently defending a gym"],
    ["{name}", "Pokemon with either name or nickname {name}", "Autocomplete. Prepending '+' matches all pokemon in the same evolutionary family as matched {name}s", "'vulpix', '+bidoof', '+Mr. Rime'"],
    ["{type}", "Pokemon with type {type}",,"water"],
    ["{region}", "Pokemon from the {region} region", "Options: Kanto, Johto, Hoenn, Sinnoh, Unova, Galar, Alola, Kalos. Galar and Alola also return regional formes. <a href='https://redd.it/ooc47n'>BUG:</a> Regional formes excluded by !Galar and !Alola cannot be unexcluded.", "'alola'"],
    ["eggsonly", "<a href='https://bulbapedia.bulbagarden.net/wiki/Baby_Pokémon'>Baby</a> pokemon", "Typically only found in eggs"],
    ["legendary", "<a href='https://bulbapedia.bulbagarden.net/wiki/Legendary_Pokémon'>Legendary</a>  pokemon"],
    ["mythical", "<a href='https://bulbapedia.bulbagarden.net/wiki/Mythical_Pokémon'>Mythical</a> pokemon"],
    ["shadow", "Shadow pokemon"],
    ["purified", "Purified pokemon"],
    ["shiny", "Shiny pokemon"],
    ["lucky", "Lucky pokemon"],
    ["costume", "Pokemon wearing clothing","Caught during certain events. <a href='https://redd.it/rt91ye/'>BUG:</a> Excludes 2022 slowking"],
    ["candyxl", "Pokemon powered beyond level 40", "Includes best buddies boosted past 40."],
    ["encounter type",,,,true],
    ["raid", "Pokemon caught from a raid", "Only extends back to Oct 2020"],
    ["hatched", "Pokemon hatched from an egg", "Only extends back to July 2017"],
    ["research", "Pokemon caught from any research", "Only extends back to Oct 2020"],
    ["gbl", "Pokemon caught from GO Battle League", "Only extends back to Oct 2020"],
    ["rocket", "Pokemon caught from Team GO Rocket", "Only extends back to Oct 2020. Includes all rocket encounter types."],
    ["traded", "Pokemon obtained from a trade", "Will also show up under original encounter type search"],
    ["", "Pokemon caught in the wild", "&!raid&!hatched&!research&!gbl&!rocket&!traded&"],
    ["evolutions",,,,true],
    ["evolve", "Pokemon which are currently able to evolve", "Checks candy & items. Checks quests for walking: happiny, bonsly, mime jr, woobat. BUG: Ignores other quests: spritzee, swirlix, pancham, galarian yamask / farfetch'd / slowpoke. <a href='https://imgur.com/quVvUdf.png'>BUG:</a> Includes 2019 halloween kanto starters."],
    ["evolvenew", "Pokemon with a new evolution", "Only considers unregistered evolutions in the main & mega pokedex. <a href=https://redd.it/imkedw/>BUG:</a> Includes already mega-evolved pokemon species and current mega. <a href='https://imgur.com/TJ2R5VD.png'>BUG:</a> Includes 2019 halloween kanto starters."],
    ["megaevolve", "Pokemon able to mega evolve", "Considers energy for each pokemon. <a href='https://imgur.com/uPl29ba.png'>BUG:</a> Also includes currently mega evolved pokemon."],
    ["item", "Pokemon which need an item to evolve"],
    ["tradeevolve","Pokemon which have a trade evolution","Means if species is recieved in trade, evolution is free"],
    ["moves",,,,true],
    ["@{type}","Moves with type {type}","","'@fairy'"],
    ["@{move}","Moves with name {move}", "Autocomplete. Moves with spaces use spaces. {psychic} is superseded by the type, so '@psychi' or more correctly '@psychic&!@psychic fangs' is necessary", "'@crunch', '@hydro pump'"],
    ["@special", "Moves that can't be learnt with normal TMs","Includes legacy/event/true legacy/frustration & return"],
    ["@weather", "Moves with type currently weather boosted", "In remote raid lobby, will show local weather, not remote"],
    ["@{1/2/3}{criteria}", "Moves in correct slot matching given criteria","1=quick, 2=first charge, 3=second charge. Criteria can be any of: {type}, {move}, special, weather. BUG: '!@3{}' does not update result count for large searches.","'@1water', '@3meteor mash', '@2weather'"],
    ["!@move_name", "Pokemon with a 3rd move unlocked", "Autocomplete. The 3rd move when not unlocked has this name. Use at least 'mov' to avoid losing meteor mash & moonblast", "'!@move_name', '!@3mov'"],
    ["tags",,,,true],
    ["{tag}", "Pokemon tagged with {tag} tag", "Don't name a tag after an already used search phrase please. BUG: Tag searches cannot be negated with !"],
    ["#{tag}", "Pokemon tagged with tag {tag}", "Autocomplete. `#` matches all tagged pokemon."],
    ["","workaround for tag negation","• Create tag TEMP<br>• Tag all pokemon with TEMP. You cannot select-all on an unfiltered storage, so use two phrases that cover everything such as 'age0' and 'age1-'<br>• Search 'TAG&TEMP', select-all, remove TEMP.<br>• TEMP is now a negation of TAG.<br>• To match all untagged, use '#' instead of 'TAG'"],
    ["logical operations",,,,true],
    ["& or |","AND combination", "All pokemon matching BOTH properties", "'spheal&shiny', '+vulpix&alola'"],
    [", or ; or :", "OR combination","All pokemon matching EITHER property", "'4*,shiny', "],
    ["!", "NOT operator", "All pokemon that do NOT have property. Must directly prepended phrase to be negated with no spaces.", "'!shiny', '!bulbasaur'"],
    ["",,"& and , can be chained together multiple times. Ambiguity is resolved by always considering ,s nested inside &s", "'0*,1*,2*', 'meowth,alola&vulpix,galar'"],
]

const friendsData = [
    ["{name}", "Friends with name or nickname {name}", "Autocomplete."],
    ["interactable", "Friends who have not been interacted with today", "Interaction times are based on interactee's local time."],
    ["giftable", "Friends who you have not sent a gift to today", "Gift opened times are based on opener's local time."],
    ["lucky", "Lucky friends"],
    ["friendlevel{N}", "Friends with friendship level {N}", "Range. 0 = no interaction, 1/2/3/4 = good/great/ultra/best", "'friendlevel4', 'friendlevel2-3'"],
    ["logical operations",,,,true],
    ["",,"Same as  storage search"],
];

const pages = {
    'phraseBTN' : 'phrasePage',
    'linkBTN' : 'linkPage',
    'friendBTN' : 'friendsPage',
};

function updateTable(id, data) {
    let curTable = $S(`#${id}`).innerHTML;
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

window.addEventListener('load', function() {
    /*$S('#phraseBTN').addEventListener('click', (e)=>{
	$S('#phrasePage').classList.remove('hide');
	$S('#linkPage').classList.add('hide');
    });
    $S('#linkBTN').addEventListener('click', (e)=>{
	$S('#linkPage').classList.remove('hide');
	$S('#phrasePage').classList.add('hide');
    });*/
    for (let [key, val] of Object.entries(pages)) {
	$S(`#${key}`).addEventListener('click', (e)=>{
	    $S(`#${val}`).classList.remove('hide');
	    for (let altPages of Object.values(pages).filter(e=>e!=val)) {
		$S(`#${altPages}`).classList.add('hide');
	    }
	});
    }
    updateTable('phraseTable', phraseData);
    updateTable('friendsTable', friendsData);
});
