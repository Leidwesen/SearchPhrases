function $S(selector) { return document.querySelector(selector); }

const tableHeaders = [
    "Phrase", "Output", "Notes", "Examples"
];

const phraseData = [
    //[Phrase, Output, Notes, Examples, isHeaderRow]
    ["","","All phrases are case-insensitive.",""],
    ["","","Autocomplete = matches all options which start with given phrase.",""],
    ["pokemon - name",,"all in this category autocomplete.",,true],
    ["{name}", "Pokemon with either name or nickname {name}", "All other phrases take priority over {name}.", "'vulpix', 'vulp'"],
    ["+{name}", "All pokemon in the same evolutionary family as {name}", "Does nothing if put before any other search phrase.<br><a href='https://i.imgur.com/2nDmqnk.png'>BUG</a>: Returns no results if put before '@' or '#'.<br><a href='https://redd.it/1beu3m9'>BUG</a>: +{nickname} fails for ditto.", "'+vulpix', '+bidoo'"],
    // BUG: +Name search can fail based on order of operations: https://www.reddit.com/r/TheSilphRoad/comments/1e02fec/comment/ld8uc9c/
    // BUG: (show evolutionary line)-Name search can fail based on order of operations *and* show-evolutionary-line state: TODO
    ["", "\"Show Evolutionary Line\" button", "Essentially the same as putting '+' before every {name}.<br>Does not cause issues with '#'.<br>BUG: See @{move}. Does work with the other @{criteria}."],
    ["", "Mid-name Search", "Pokemon whose default names include non-alphanumeric characters can be searched for with the text after those characters.<br>[English] This affects Megas, as well as <a href='https://pastebin.com/raw/y0vQCv8J'>this list</a>.<br><a href='https://i.imgur.com/EKf3oJv.png'>BUG</a>: Returns no results with + or 'Show Evolutionary Line'.<br>NOTE: Does not work with nicknames.<br>It is unknown how this functions with non-latin alphabets.", "'beedrill', 'koko', 'Oh'"],
    ["pokemon - ranges",,"all in this category are ranges",,true],
    ["","","{phrase}{N} find Pokemon with phrase value of {N}<br>{phrase}{N}-{M} finds values between {N} and {M}, inclusive<br>If {M} is 0, the search is treated as {phrase}{N}- instead.<br>{phrase}{N}- matches values ≥ {N}<br>{phrase}-{N} matches values ≤ {N}"],
    ["cp{N}", "Pokemon with CP {N}",, "'cp-1500', 'cp2500-1501', 'cp3000-'"],
    ["distance{N}", "Pokemon obtained {N} km away", "Measures against current ingame location.<br>When used without '-', matches distances less than {N}: 'distance{N}' = 'distance-{N}'.<br>Caught location is influenced by <a href='https://pokemongohub.net/post/featured/comprehensive-guide-s2-cells-pokemon-go/'>S2 shenanigans</a>.","'distance101-', 'distance1000'"],
    ["hp{N}", "Pokemon with HP {N}", "Considers maximum HP, ignores any damage taken. Use HP sort for that.", "'hp200-'"],
    ["{N}", "Pokemon with pokedex number {N}", "Uses national dex #.","'-151', '399'"],
    ["year{N}", "Pokemon caught in year {N}", "Two digit yy is assumed 20yy.", "'year16', 'year20-2021', 'year2017-'"],
    ["age{N}","Pokemon caught {N} days ago", "Age increases precisely 24 hours after catch.<br>For hatches, searches based on hatched date.<br>For trades, searches based on original caught date.", "'age0', 'age365-'"],
    ["buddy{N}", "Pokemon with buddy friendship at level {N}", "0 = never buddies, 1 = buddies, never leveled up<br>2/3/4/5 = good/great/ultra/best buddies<br>'buddy1-' will find all pokemon you've previously buddied.<br><a href='https://redd.it/1hdfboq'>BUG</a>: If the game fails to load properly, will only return current buddy.","'buddy5', 'buddy1-4'"],
    ["mega{N}", "Pokemon with mega level {N}", "0 = never mega evolved, 1/2/3 = Base/High/Max mega level.<br>'mega1-' finds all previously mega evolved pokemon.<br><a href='https://i.imgur.com/uDWvVJq.png'>Bug</a>: negated 'mega{N}' only returns pokemon capable of mega evolution, instead of all pokemon.","'mega1-', 'mega3'"],
    ["{N}hp,<br>{N}attack,<br>{N}defense","Pokemon with IVs in range {N}","Options: 0, 1, 2, 3, 4<br>Based on IV value: 0=0, 1=1-5, 2=6-10, 3=11-14, 4=15<br><a href='https://i.imgur.com/HFVfIGd.png'>BUG</a>: Negation is ignored for these terms (eg '!1HP' = '1HP').","'-1attack', '4HP', '3-defense'"],
    ["candykm{N}","Pokemon which need {N} km of distance per buddy candy", "<a href='https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1tkzj0Y25euwEXCA1y-S9fNtI_Xp7ifbff4YIqQ-C9UNBlc-Jg_yyXzmu3q2-I3cgRBrcyIPFqVKA/pubhtml?gid=782471874&single=true'>Currently used</a> km distances: 1, 3, 5, 20<br>Buddy excitement and other distance modifiers do not change results.<br>Highly correlated to purification cost (1000x), with a <a href='https://www.reddit.com/r/TheSilphRoad/comments/1j3f8e4/comment/mg0jesg/'>few exceptions</a>.<br>'candykm20' is a shorter equivalent to 'legendary,mythical,ultrabeast'.", "'candykm1', 'candykm3-5'"],
    ["pokemon - categories",,"groups of phrases that split pokemon into categories",,true],
    ["{type}", "Pokemon with type {type}","Options: grass, water, fire, ground, ice, steel, fairy, electric, flying, poison, ghost, dark, normal, bug, rock, fighting, dragon, psychic","'water'"],
    ["{region}", "Pokemon from the {region} region", "Options: Kanto, Johto, Hoenn, Sinnoh, Unova, Galar, Alola, Kalos, Hisui, Paldea<br>Alola, Galar, Hisui, and Paldea  also return <a href='https://bulbapedia.bulbagarden.net/wiki/Regional_form'>regional forms</a>, and are not included in the search for the non-regional form's region.<br><a href='https://redd.it/ooc47n'>BUG</a>: Regional forms excluded by !Alola, !Galar, !Hisui, and !Paldea cannot be unexcluded. <a href='https://pastebin.com/raw/frAHpCDm'>[Workaround]</a><br><a href='https://reddit.com/comments/1ga2x4v/comment/ltb3tiz/'>BUG</a>: Early generations (Kanto — Unova) also now permanently exclude regional forms. This also makes Hisuian Decidueye the only pokemon which can be found by searching for two regions together.<br><a href='https://bulbapedia.bulbagarden.net/wiki/Hisuian_form#White-Striped_Basculin'>NOTE</a>: White-Striped Basculin is not classified as 'Hisui'.<br><a href='https://i.imgur.com/pxkNuFd.jpeg'>BUG</a>: Paldean Tauros is not classified as 'Paldea'.", "'alola'"],
    ["{gender}", "Pokemon with gender {gender}", "Options: male, female, genderunknown",],
    ["{size}", "Pokemon with size {size}", "Options: xxs, xs, xl, xxl<br>Size is relative per species, based on <a href='https://web.archive.org/web/20220811210838/https://thesilphroad.com/science/big-magikarp-tiny-rattata'>height</a>.<br>XX sizes were added Oct 2021, and were <a href='https://www.reddit.com/comments/ynczwx/_/iv88zoc/'>very rare</a>.<br><a href='https://pokemongolive.com/post/more-xxs-xxl-pokemon-in-pokemon-go'>Updated</a> in January 2023, they are now <a href='http://redd.it/106602y'>more common</a>."],
    ["{N}*","Pokemon in appraisal range {N}", "Options: 0, 1, 2, 3, 4<br>Based on sum of IVs: 0=0-22, 1=23-29, 2=30-36, 3=37-44, 4=45", "'4*', '0*'"],
    ["<{type}","Pokemon weak to {type}ed damage","Will return species whose overall typing takes super effective damage from {type} moves.","<Fire"],
    [">{type}","Pokemon with moves effective against {type}","Will return Pokemon with at least one attack dealing super effective damage to {type}.<br><a href='https://i.imgur.com/3Qyr3x8.png'>BUG</a>: Ignores 2nd charge move.",">Fire"],
    ["pokemon - keywords","Pokemon which are...","various qualifiers certain pokemon meet",,true],
    ["costume", "wearing <a href='https://pokemongo.fandom.com/wiki/Event_Pokémon'>clothing</a>","Caught during certain events."],
    ["{location_card}","having a <a href='https://pokemongo.fandom.com/wiki/Backgrounds'>special catch card</a>","Options:<br>'locationbackground': Caught during certain in-person events</a><br>'specialbackground': Caught during certain global events<br>'background': Both location and special cards"],
    ["eggsonly", "<a href='https://bulbapedia.bulbagarden.net/wiki/Baby_Pokémon'>Baby</a> species", "Typically only found in eggs."],
    ["{keyword}","{keyword}", "Options: legendary, mythical, ultrabeast, 'ultra beasts', shadow, purified, shiny, lucky, dynamax, gigantamax."],
    ["defender","currently defending a gym","NOTE: This does not include Pokemon currently defending a Power Spot. There is no known search for those."],
    ["favorite","favorited","Marked with a star in storage.<br>NOTE: 'favourite' also works in english."],
    ["candyxl", "powered up past level 40", "NOTE: Does not include best buddies boosted past 40."],
    ["party", "caught while in a Party", "Only extends back to Nov 1 2023<br>Includes any type of encounter."],
    ["'maxmove1-'","Max-battle eligible Pokemon","Includes both dynamax and gigantamax species"],
    // ["'hypertraining'","Pokemon currently being hyper trained", "Entered using bottle caps."],
    ["pokemon - encounter type","Pokemon obtained from...","various ways to obtain pokemon",,true],
    ["raid", "raids", "Only extends back to Oct 28 2020<br>Includes all raid types."],
    ["{raid_type}", "types of raids", "Options: remoteraid, megaraid, exraid, primalraid.<br>Only extends back to Oct 8 2020<br>Remote and Mega raids caught before Oct 28 2020 also count as 'raid'.<br>Due to date restrictions, 'exraid' currently returns nothing.<br><a href='https://i.imgur.com/kXs8UZq.png'>BUG</a>: Primalraid is currently not functional."],
    ["hatched", "eggs", "Only extends back to around July 17 2017"],
    ["research", "research", "Only extends back to Oct 28 2020<br>Includes all research types (field, timed, special, collection challenges, pass), and party play encounters.<br>"],
    ["gbl", "GO Battle League", "Only extends back to around Oct 28 2020"],
    ["rocket", "Team GO Rocket", "Only extends back to Oct 28 2020<br>Counts all types of rocket battles.<br>\"BUG\": Does not include shadows from raids or research.<br>Workaround: 'shadow,purified'"],
    //Research Shadows:  Apex Ho-Oh & Lugia, GO Fest '20 Mewtwo, Sinnoh Tour Gible, Dual Destiny Leader Researches (Diglettx2, Vulpix, Machop)
    ["snapshot", "photobombs", "Only extends back to around October 28 2020"],
    ["traded", "trades", "Will also show up under original encounter type search."],
    ["", "the wild", "'&!raid&!hatched&!research&!gbl&!rocket&!snapshot&!traded&'"],
    ["pokemon - evolution","Pokemon which...","phrases related to evolution",,true],
    ["evolve", "you can currently evolve", "Checks candy, item, and gender requirements.<br>Checks <a href='https://pokemongo.fandom.com/wiki/Evolution?so=search#Buddy'>quests</a> for walking, ignores other quests."],
    ["evolvenew", "you've never had the evolution of", "Only considers direct evolutions with an unregistered entry in the main & mega pokedex.<br><a href='https://i.imgur.com/aJPDH6A.png'>BUG</a>: Includes pokemon with restrictions making their evolution impossible."],
    ["megaevolve", "can currently mega evolve", "Considers energy for each pokemon.<br> Does not include currently active mega evolution."],
    ["item", "need an <a href='https://pokemongo.fandom.com/wiki/Evolution_Items#Usage'>item</a> to evolve","BUG (Untested in recent versions): Only returns pokemon which have enough candy/item to evolve."],
    ["tradeevolve","have a trade evolution","<a href='https://pokemongo.fandom.com/wiki/Evolution?so=search#Trade_evolution'>Pokemon</a> which are free to evolve if recieved from a trade.<br><a href='https://i.imgur.com/i0iJkvW.png'>BUG</a>: Does not return traded pokemon."],
    ["evolvequest","have an evolution task","Pokemon which have buddy <a href='https://pokemongo.fandom.com/wiki/Evolution?so=search#Buddy'>quest</a> evolution requirements."],
    ["fusion","have a fusion form","Pokemon that can <a href='https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_fusion#Pok%C3%A9mon_that_can_fuse_via_form_change'>fuse</a> (Necrozma, Kyurem).<br>Includes already fused forms, does not include the secondary fusion species.<br>Likely to include Calyrex eventually."],
    ["pokemon - moves",,"phrases related to moves, using @",,true],
    ["@{type}","Moves with type {type}","Takes priority over {move}.","'@fairy'"],
    ["@{move}","Moves with name {move}", "Autocomplete. Moves with spaces use spaces.<br> To find the move \"psychic\", use '@psychi' or '@psychi&!@psychic fangs'.<br><a href='https://i.imgur.com/Wc88S9L.png'>BUG</a>: With 'Show Evolutionary Line' enabled, @{move} is overridden to +{move}, which searches for pokemon name.", "'@crunch', '@hydro pump'"],
    ["@special", "Moves that can't be learnt with normal TMs","Includes <a href='https://pokemongo.fandom.com/wiki/List_of_exclusive_moves'>Elite TM exclusive</a> moves, <a href='https://www.p337.info/pokemongo/pages/legacy-moves/'>true legacy</a> moves, frustration, and return."],
    ["@weather", "Moves with type currently weather boosted", "BUG (Untested in recent versions): In remote raid lobby, will use local weather, not remote."],
    ["@{1/2/3}{criteria}", "Moves in given slot matching criteria","1 = fast, 2 = first charged, 3 = second charged.<br>Options: {type}, {move}, special, weather.<br>Also affected by the @{move} bug.","'@1water', '@3meteor mash', '@2weather'"],
    ["!@mov", "Pokemon with a 2nd charge move unlocked", "Autocomplete. A default 'move_name_0000' is used for pokemon with no 2nd charge move.<br>Use at least 'mov' to avoid losing moonblast et al.<br>Also affected by the @{move} bug.", "'!@mov', '!@3move_name_0000'"],
    ["adventureeffect","Pokemon whose moves have an <a href='https://pokemongo.fandom.com/wiki/Adventure_Effects'>Adventure Effect</a>",'"BUG": Is not preceded by @.'],
    ["'dynamax{N}' or 'gigantamax{N}'","Max Pokemon with {N} max moves unlocked","{N} is a range, with 1/2/3 being the number of moves unlocked.<br>Dynamax returns only dynamax species, and Gigantamax returns only gigantamax species.<br>Max Species start with 1 move (the attack) unlocked.","'dynamax3', 'gigantamax2-'"],
    ["max{move}{N}","Max Pokemon with max move {move} at level{N}","{N} is a range, with 1/2/3 being the level of the max move.<br>Options: maxmove, maxguard, maxspirit<br>NOTE: maxmove is a generic term for all the <a href='https://bulbapedia.bulbagarden.net/wiki/Max_Move#Pok%C3%A9mon_GO'>typed Max Attacks</a>.<br>Use '!max{move}1-' to find species which haven't unlocked those moves yet.","'maxmove2', 'maxspirit1-'"],
    ["pokemon - tags",,"phrases related to tags",,true],
    ["{tag}", "Pokemon <a href='https://niantic.helpshift.com/hc/en/6/faq/2800'>tagged</a> with {tag} tag", "BUG: Tags named the same as an existing search phrase will break that phrase. Don't do this please."],
    ["#{tag}", "Pokemon tagged with tag {tag}", "Autocomplete"],
    ["#", "All tagged pokemon", "Use '!#' for all untagged pokemon.", "'#', '!#'"],
    ["logical operations",,"advanced tools for combining searches",,true],
    ["& or |","AND combination", "All pokemon matching BOTH properties.", "'spheal&shiny', '+vulpix&alola'"],
    [", or ; or :", "OR combination","All pokemon matching EITHER property.", "'4*,shiny', "],
    ["!", "NOT operator", "All pokemon that do NOT have property.<br>Must directly prepend phrase to be negated (no spaces).", "'!shiny', '!bulbasaur'"],
    ["",,"& and , can be used multiple times in one search.<br>Ambiguity is resolved by always considering ,s nested inside &s.", "'0*,1*,2*', 'meowth,alola&vulpix,galar'"],
    ["saving searches",,"how to save searches for later reuse",,true],
    ["",,"You can see your four most recent searches by pressing \"see more\" while searching.<br>NOTE: If you haven't yet saved any searches, the recent searches will also appear before pressing \"see more\"."],
    ["",,"You can save a recent search to your favorites by holding down on it."],
    ["",,"You can delete and rename your saved searches by holding down on them.<br>You <i>cannot</i> search by this name."],
    ["",,"Alternatively, use your phone's <a href='https://web.archive.org/web/20220521132556/https://silph.gg/pages/wpPage/how-to-use-pokemon-go-search-strings'>text replacement</a> feature to create string shortcuts."],
    ["miscellany",,"additional information and minutiae",,true],
    ["",,"The clickable search phrases are all &-combined together.", ""],
    ["",,"Every clickable has an accompanying search phrase.", ""],
    ["","","Each incubated egg will count as +1 towards total pokemon count, but will always be ignored in filtered searches."],
    ["","","The 'Select All' button will only show up in searches which do NOT return your whole storage."],
    ["","","'Dynamax' and 'Gigantamax' are technically shortcuts for 'Dynamax1-' and 'Gigantamax1-', respectively."],
    ["","","BUG: Improperly written searches can return confusing results. <a href='https://www.reddit.com/comments/u3hhqt/_/i51n7mo/'>[1]</a> <a href='https://www.reddit.com/comments/1as71rx/_/kqp7jr9/'>[2]</a>"],
    //["","","The {N} in ranges is parsed as a 32-bit signed integer (ranging from 0 to 2147483647)"],
]

const friendData = [
    ["friends - phrases",,"phrases for searching the friends list",,true],
    ["{name}", "Friends with name or nickname {name}", "Autocomplete."],
    ["interactable", "Friends you have not interacted with today", "Also noted by the lack of a blue aura around the trainer icon."],
    ["giftable", "Friends you can currently send a gift to", "Gift opening day is based on opener's local time."],
    ["lucky", "Lucky friends"],
    ["friendlevel{N}", "Friends with friendship level {N}", "Range. 0 = no interaction<br>1/2/3/4 = good/great/ultra/best friends.", "'friendlevel4', 'friendlevel2-3'"],
    ["logical operations",,"Same as storage search",,true],
];

const dexData = [
    ["pokedex - phrases",,"phrases for searching in the pokedex<br>Search applies to the dex variant currently open",,true],
    ["{name}","Pokemon with name {name}","Can also search starting from anywhere in the species name","'Bidoof', 'pix', 'z'"],
    ["{N}","Pokemon with pokedex number {N}","does <b>NOT</b> work as a range","'1', '151'"],
    ["{type}","Pokemon with type {type}","Options: grass, water, fire, ground, ice, steel, fairy, electric, flying, poison, ghost, dark, normal, bug, rock, fighting, dragon, psychic"],
    ["","Caught/Seen","There are no phrases for these, but they are clickable options.<br>Caught: Pokemon registered to the current dex<br>Seen: Pokemon that have been observed in a gym or the wild, but not caught"],
    ["Quirks",,"What makes dex searching different from the other searches?",,true],
    [,,"<a href='https://www.reddit.com/r/TheSilphRoad/comments/zgdb2f/trainers_the_pokédex_has_been_updated_to_allow/izgnwfn/'>BUG</a>: The clickable search phrases are not properly cleared when directly exiting the search."],
    [,,"No logical operations. Cannot use AND, OR, or NOT"],
    [,,"{N} search does not work as a range"],
    [,,"Searches are whitespace sensitive. ' seel ' will work in storage but not pokedex."],
    [,,"Searches only look at the base form of species<br>eg 'dark' cannot find Meowth<br>This also applies to the species in the Mega dex<br>- the search treats them as the non-mega form<br>(eg 'dark' cannot find Mega Gyarados, and 'X' cannot find Mega Charizard X)"],
    [,,"{name} search will search anywhere in a pokemon name"],
    [,,"<a href='https://redd.it/1e5uhuv'>BUG?</a>: Searches do not take priority over each other"],
];

const pages = [ // [buttonId, linkedPageId, loadLinkPhrase]
    ['phraseBTN',  'phrasePage', 'phrase'],
    ['friendBTN',  'friendPage', 'friend'],
    ['dexBTN',     'dexPage',    'dex'],
    ['linkBTN',    'linkPage',   'link'],
    ['creditBTN',  'creditPage', 'credit'],
    ['aboutBTN',   'aboutPage',  'about'],
];

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
    let lang_dexData = doGet(strs, 'dexData', dexData);
    buildTable('phraseTable', lang_phraseData, lang_tableHeaders );
    buildTable('friendTable', lang_friendData, lang_tableHeaders );
    buildTable('dexTable', lang_dexData, lang_tableHeaders );
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
    let loadLink = document.URL.split('#')[1];
    for (let [btn, page, linker] of pages) {
	pageShift(btn, page, pages.map(e=>e[1]).filter(e=>e!=page));
	if (linker && loadLink && loadLink.toLowerCase().includes(linker)) {
	    $S(`#${btn}`).click();
	}
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
	"phraseData"   : phraseData,
	"friendData"   : friendData,
	"dexData"      : dexData,
    },
    /*"Test": {
	"tableHeaders" : ["A","B","C","D"],
	"phraseData" : [["T1","T2","T3","T4",true]],
	"friendData" : [["T1","T2","T3","T4",false]],
    }*/
}
