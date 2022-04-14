function $S(selector) { return document.querySelector(selector); }

const phraseData = [
    ["","","All phrases are case-insensitive",""],
    ["","","Autocomplete = will match all words starting with provided phrase.",""],
    ["pokemon",,,,true],
    ["{name}", "Pokemon with either name or nickname {name}", "Autocomplete. Prepending '+' matches all pokemon in the same evolutionary family as matched {name}s. The 'show evolutionary line' toggle is just '+' in the background, so only works with {name}.", "'vulpix', '+bidoof', '+Mr. Rime'"],
    ["pokemon - ranges",,"all in this category are ranges",,true],
    ["","","{phrase}{N} find pokemon with phrase value of {N}<br>{phrase}{N}-{M} finds values between {N} and {M}, inclusive<br>{phrase}{N}- matches values ≥ {N}, {phrase}-{N} matches values ≤ {N}"],
    ["cp{N}", "Pokemon with CP {N}",, "'cp-1500', cp'2500-1501', 'cp3000-'"],
    ["distance{N}", "Pokemon obtained {N} km away", "Measures against current ingame location. When used without '-', matches distances less than {N}: 'distance{N}' = 'distance-{N}'. Caught location may be influenced by S2 shenanigans.","'distance101-', 'distance1000'"],
    ["hp{N}", "Pokemon with HP {N}", "Considers maximum HP, ignores any damage taken. Use HP sort for that.", "'hp200-'"],
    ["{N}", "Pokemon with pokedex number {N}", "Uses national dex #.","'-151', '399'"],
    ["age{N}","Pokemon caught {N} days ago", "Age increases precisely 24 hours after catch", "'age0', 'age365-'"],
    ["buddy{N}", "Pokemon with buddy friendship at level {N}", "0 = never buddies, 1 = buddies, never leveled up, 2/3/4/5=good/great/ultra/best","'buddy5', 'buddy1-4'"],
    ["year{N}", "Pokemon caught in year {N}", "Two digit yy is assumed 20yy.", "'year16', 'year20-2021', 'year2017-'"],
    ["pokemon - categories",,,,true],
    ["{type}", "Pokemon with type {type}","Options: grass, water, fire, ground, ice, steel, fairy, electric, flying, poison, ghost, dark, normal, bug, rock, fighting, dragon, psychic","water"],
    ["{region}", "Pokemon from the {region} region", "Options: Kanto, Johto, Hoenn, Sinnoh, Unova, Galar, Alola, Kalos. Galar and Alola also return regional forms. <a href='https://redd.it/ooc47n'>BUG:</a> Regional forms excluded by !Galar and !Alola cannot be unexcluded. 'Bug': There is no Hisui search.", "'alola'"],
    ["{gender}", "Pokemon with gender {gender}", "Options: male, female, genderunknown",],
    ["{size}", "Pokemon with size {size}", "Options: xxs, xs, xl, xxl. Size is relative per species, based on <a href='https://thesilphroad.com/science/big-magikarp-tiny-rattata'>height</a>. The xx tiers were added Oct 2021, <a href='https://www.reddit.com/r/TheSilphRoad/comments/q6cfea/xxl_pokemon/'>very little</a> is known about them."],
    ["{N}*","Pokemon in appraisal range {N}", "Options: 0, 1, 2, 3, 4. Based on sum of IVs: 0 = 0-22, 1 = 23-29, 2 = 30-36, 3 = 37-44, 4 = 45", "'4*', '0*'"],
    ["pokemon - keywords",,,,true],
    ["costume", "Pokemon wearing <a href='https://pokemongo.fandom.com/wiki/Event_Pokémon'>clothing</a>","Caught during certain events."],
    ["eggsonly", "<a href='https://bulbapedia.bulbagarden.net/wiki/Baby_Pokémon'>Baby</a> pokemon", "Typically only found in eggs"],
    ["legendary", "<a href='https://bulbapedia.bulbagarden.net/wiki/Legendary_Pokémon'>Legendary</a>  pokemon"],
    ["mythical", "<a href='https://bulbapedia.bulbagarden.net/wiki/Mythical_Pokémon'>Mythical</a> pokemon"],
    ["shadow", "Shadow pokemon"],
    ["purified", "Purified pokemon"],
    ["shiny", "Shiny pokemon"],
    ["lucky", "Lucky pokemon"],
    ["defender","Pokemon currently defending a gym"],
    ["candyxl", "Pokemon powered beyond level 40", "BUG? Includes best buddies boosted past 40."],
    ["pokemon - encounter type",,,,true],
    ["raid", "Pokemon caught from a raid", "Only extends back to around Oct 8 2020. Includes all raid types."],
    ["{raid_type}", "Pokemon caught from a specfic type of raid", "Options: remoteraid, megaraid, exraid. Only extends back to around Oct 8 2020"],
    ["hatched", "Pokemon hatched from an egg", "Only extends back to around July 13-20 2017"],
    ["research", "Pokemon caught from any type of research", "Only extends back to around Oct 28 2020"],
    ["gbl", "Pokemon caught from GO Battle League", "Only extends back to around Oct 28 2020"],
    ["rocket", "Pokemon caught from Team GO Rocket", "Only extends back to around Oct 28 2020. Includes all rocket encounter types."],
    ["snapshot", "Pokemon caught from photobombs"],
    ["traded", "Pokemon obtained from a trade", "Will also show up under original encounter type search"],
    ["", "Pokemon caught in the wild", "&!raid&!hatched&!research&!gbl&!rocket&!snapshot&!traded&"],
    ["pokemon - evolutions",,,,true],
    ["evolve", "Pokemon which are currently able to evolve", "Checks candy & items. Checks <a href='https://pokemongo.fandom.com/wiki/Evolution?so=search#Buddy'>quests</a> for walking, ignores other quests. <a href='https://imgur.com/quVvUdf.png'>BUG:</a> Includes 2019 halloween kanto starters."],
    ["evolvenew", "Pokemon with a new evolution", "Only considers unregistered evolutions in the main & mega pokedex. <a href=https://redd.it/imkedw/>BUG:</a> Includes already mega-evolved pokemon species and current mega. <a href='https://imgur.com/TJ2R5VD.png'>BUG:</a> Includes 2019 halloween kanto starters."],
    ["megaevolve", "Pokemon able to mega evolve", "Considers energy for each pokemon. <a href='https://imgur.com/uPl29ba.png'>BUG:</a> Also includes currently mega evolved pokemon."],
    ["item", "<a href='https://pokemongo.fandom.com/wiki/Evolution_Items#Usage'>Pokemon</a> which need an item to evolve"],
    ["tradeevolve","<a href='https://pokemongo.fandom.com/wiki/Evolution?so=search#Trade_evolution'>Pokemon</a> which have a trade evolution","Means if species is recieved in trade, final evolution is free"],
    ["pokemon - moves",,,,true],
    ["@{type}","Moves with type {type}","","'@fairy'"],
    ["@{move}","Moves with name {move}", "Autocomplete. Moves with spaces use spaces. {psychic} is superseded by the type, so '@psychi' or more correctly '@psychi&!@psychic fangs' is necessary", "'@crunch', '@hydro pump'"],
    ["@special", "Moves that can't be learnt with normal TMs","Includes event legacy, true legacy, frustration, & return."],
    ["@weather", "Moves with type currently weather boosted", "BUG: In remote raid lobby, will show local weather, not remote"],
    ["@{1/2/3}{criteria}", "Moves in correct slot matching given criteria","1=quick, 2=first charge, 3=second charge. Options: {type}, {move}, special, weather. BUG: '!@3{}' does not update result count for large searches.","'@1water', '@3meteor mash', '@2weather'"],
    ["!@mov", "Pokemon with a 2nd charged move unlocked", "Autocomplete. A default 'move_name_0000' is used for pokemon with no 2nd charge move. Use at least 'mov' to avoid losing moonblast et al.", "'!@mov', '!@3move_name_0000'"],
    ["pokemon - tags",,,,true],
    ["{tag}", "Pokemon tagged with {tag} tag", "Don't name a tag after an already used search phrase please. BUG: Tag searches cannot be negated with !"],
    ["#{tag}", "Pokemon tagged with tag {tag}", "Autocomplete. `#` matches all tagged pokemon."],
    ["","workaround for tag negation","• Create tag TEMP<br>• Tag all pokemon with TEMP. You cannot select-all on an unfiltered storage, so use two phrases that cover everything such as 'age0' and 'age1-'<br>• Search 'TAG&TEMP', select-all, remove TEMP.<br>• TEMP is now a negation of TAG.<br>• To match all untagged, use '#' instead of 'TAG'"],
    ["logical operations",,,,true],
    ["& or |","AND combination", "All pokemon matching BOTH properties", "'spheal&shiny', '+vulpix&alola'"],
    [", or ; or :", "OR combination","All pokemon matching EITHER property", "'4*,shiny', "],
    ["!", "NOT operator", "All pokemon that do NOT have property. Must directly prepend phrase to be negated (no spaces)", "'!shiny', '!bulbasaur'"],
    ["",,"The clickable search phrases are all &-combined together", ""],
    ["",,"& and , can be chained together multiple times. Ambiguity is resolved by always considering ,s nested inside &s", "'0*,1*,2*', 'meowth,alola&vulpix,galar'"],
]

const friendsData = [
    ["friendslist phrases",,,,true],
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
    updateTable('phraseTable', phraseData);
    updateTable('friendsTable', friendsData);
});

const TRANSLATION_TABLE = {
    "ENGLISH":{"CP":"CP","HP":"HP","Buddy":"Buddy","XXS":"XXS","XS":"XS","XL":"XL","XXL":"XXL","Weather":"Weather","age":"age","alola":"alola","eggsonly":"eggsonly","tradeevolve":"tradeevolve","candyxl":"candyxl","costume":"costume","defender":"defender","distance":"distance","megaevolve":"megaevolve","evolvenew":"evolvenew","item":"item","megaevolve":"megaevolve","gbl":"gbl","Female":"Female","Male":"Male","Genderunknown":"Genderunknown","hatched":"hatched","legendary":"legendary","lucky":"lucky","mythical":"mythical","snapshot":"snapshot","purified":"purified","raid":"raid","exraid":"exraid","megaraid":"megaraid","remoteraid":"remoteraid","research":"research","rocket":"rocket","shadow":"shadow","shiny":"shiny","special":"special","traded":"traded","year":"year","Bug":"Bug","Dark":"Dark","Dragon":"Dragon","Electric":"Electric","Fairy":"Fairy","Fighting":"Fighting","Fire":"Fire","Flying":"Flying","Ghost":"Ghost","Grass":"Grass","Ground":"Ground","Ice":"Ice","Normal":"Normal","Poison":"Poison","Psychic":"Psychic","Rock":"Rock","Steel":"Steel","Water":"Water","Johto":"Johto","Hoenn":"Hoenn","Sinnoh":"Sinnoh","Unova":"Unova","Kalos":"Kalos","Alola":"Alola","Galar":"Galar","giftable":"giftable","interactable":"interactable","lucky":"lucky","friendlevel":"friendlevel"},
    "BRAZILIAN PORTUGUESE":{"CP":"PC","HP":"PS","Buddy":"Companheiro","XXS":"XXS","XS":"XS","XL":"XL","XXL":"XXL","Weather":"Clima","age":"idade","alola":"Alola","eggsonly":"apenasovos","tradeevolve":"evoluirportroca","candyxl":"doce GG","costume":"traje","defender":"defensor","distance":"distância","megaevolve":"megaevolui","evolvenew":"evoluirnovo","item":"item","megaevolve":"megaevolui","gbl":"lbg","Female":"Fêmea","Male":"Macho","Genderunknown":"gênerodesconhecido","hatched":"chocado","legendary":"lendário","lucky":"sortudo","mythical":"Mítico","snapshot":"retrato","purified":"purificado","raid":"Reide","exraid":"reideex","megaraid":"megarreide","remoteraid":"reideadistância","research":"pesquisa","rocket":"rocket","shadow":"Sombroso","shiny":"Brilhante","special":"especial","traded":"Trocado","year":"ano","Bug":"Inseto","Dark":"Sombrio","Dragon":"Dragão","Electric":"Elétrico","Fairy":"Fada","Fighting":"Lutador","Fire":"Fogo","Flying":"Voador","Ghost":"Fantasma","Grass":"Planta","Ground":"Terrestre","Ice":"Gelo","Normal":"Normal","Poison":"Venenoso","Psychic":"Psíquico","Rock":"Pedra","Steel":"Aço","Water":"Água","Johto":"Johto","Hoenn":"Hoenn","Sinnoh":"Sinnoh","Unova":"Unova","Kalos":"Kalos","Alola":"Alola","Galar":"Galar","giftable":"presenteável","interactable":"interagir","lucky":"sortudo","friendlevel":"níveldeamizade"},
    "CHINESE TRADITIONAL (MANUAL)":{"CP":"CP","HP":"HP","Buddy":"夥伴","XXS":"XXS","XS":"XS","XL":"XL","XXL":"XXL","Weather":"天氣","age":"日數","alola":"阿羅拉","eggsonly":"只限蛋","tradeevolve":"交換進化","candyxl":"糖果XL","costume":"特殊","defender":"防禦者","distance":"距離","megaevolve":"超級進化","evolvenew":"未登錄","item":"道具","megaevolve":"超級進化","gbl":"GO對戰聯盟","Female":"雌性","Male":"雄性","Genderunknown":"性別不明","hatched":"孵化","legendary":"傳說的寶可夢","lucky":"亮晶晶","mythical":"幻","snapshot":"Snapshot","purified":"淨化","raid":"團體戰","exraid":"VIP團體戰","megaraid":"超級團體戰","remoteraid":"遠距團體戰","research":"調查","rocket":"火箭","shadow":"暗影","shiny":"異色","special":"特別","traded":"交換","year":"年","Bug":"蟲","Dark":"惡","Dragon":"龍","Electric":"電","Fairy":"妖精","Fighting":"格鬥","Fire":"火","Flying":"飛行","Ghost":"幽靈","Grass":"草","Ground":"地面","Ice":"冰","Normal":"一般","Poison":"毒","Psychic":"超能力","Rock":"岩石","Steel":"鋼","Water":"水","Johto":"城都","Hoenn":"豐緣","Sinnoh":"神奧","Unova":"合眾","Kalos":"卡洛斯","Alola":"阿羅拉","Galar":"伽勒爾","giftable":"禮物","interactable":"互動","lucky":"亮晶晶","friendlevel":"友誼等級"},
    "FRENCH":{"CP":"PC","HP":"PV","Buddy":"Copain","XXS":"XXS","XS":"XS","XL":"XL","XXL":"XXL","Weather":"Météo","age":"âge","alola":"Alola","eggsonly":"oeufseulement","tradeevolve":"évolutionparéchange","candyxl":"bonbonL","costume":"costume","defender":"défenseur","distance":"distance","megaevolve":"mégaévolue","evolvenew":"nouvelleévolution","item":"objet","megaevolve":"mégaévolue","gbl":"lgc","Female":"femelle","Male":"mâle","Genderunknown":"sexeinconnu","hatched":"éclos","legendary":"légendaire","lucky":"chanceux","mythical":"fabuleux","snapshot":"photo","purified":"purifié","raid":"Raid","exraid":"raidex","megaraid":"mégaraid","remoteraid":"raidàdistance","research":"étude","rocket":"rocket","shadow":"obscur","shiny":"chromatique","special":"spécial","traded":"échangé","year":"année","Bug":"Insecte","Dark":"Ténèbres","Dragon":"Dragon","Electric":"Électrik","Fairy":"Fée","Fighting":"Combat","Fire":"Feu","Flying":"Vol","Ghost":"Spectre","Grass":"Plante","Ground":"Sol","Ice":"Glace","Normal":"Normal","Poison":"Poison","Psychic":"Psy","Rock":"Roche","Steel":"Acier","Water":"Eau","Johto":"Johto","Hoenn":"Hoenn","Sinnoh":"Sinnoh","Unova":"Unys","Kalos":"Kalos","Alola":"Alola","Galar":"Galar","giftable":"cadeau","interactable":"interaction","lucky":"chanceux","friendlevel":"niveauamitié"},
    "GERMAN":{"CP":"WP","HP":"KP","Buddy":"Kumpel","XXS":"XXS","XS":"XS","XL":"XL","XXL":"XXL","Weather":"Wetter","age":"Alter","alola":"Alola","eggsonly":"nurausEiern","tradeevolve":"Tauschentwicklung","candyxl":"bonbonxl","costume":"kostümiert","defender":"Verteidiger","distance":"Entfernung","megaevolve":"MegaEntwicklung","evolvenew":"NeueEntwicklung","item":"Item","megaevolve":"MegaEntwicklung","gbl":"GBL","Female":"Weiblich","Male":"Männlich","Genderunknown":"Geschlechtunbekannt","hatched":"ausgebrütet","legendary":"Legendär","lucky":"Glücks","mythical":"Mysteriös","snapshot":"Schnappschuss","purified":"erlöst","raid":"Raid","exraid":"ExRaid","megaraid":"MegaRaid","remoteraid":"FernRaid","research":"Forschung","rocket":"Rocket","shadow":"Crypto","shiny":"Schillernd","special":"spezial","traded":"Getauscht","year":"Jahr","Bug":"Käfer","Dark":"Unlicht","Dragon":"Drache","Electric":"Elektro","Fairy":"Fee","Fighting":"Kampf","Fire":"Feuer","Flying":"Flug","Ghost":"Geist","Grass":"Pflanze","Ground":"Boden","Ice":"Eis","Normal":"Normal","Poison":"Gift","Psychic":"Psycho","Rock":"Gestein","Steel":"Stahl","Water":"Wasser","Johto":"Johto","Hoenn":"Hoenn","Sinnoh":"Sinnoh","Unova":"Einall","Kalos":"Kalos","Alola":"Alola","Galar":"Galar","giftable":"schenkbar","interactable":"interaktionsfähig","lucky":"Glücks","friendlevel":"Freundeslevel"},
    "ITALIAN":{"CP":"PL","HP":"PS","Buddy":"Compagno","XXS":"XXS","XS":"XS","XL":"XL","XXL":"XXL","Weather":"Condizioni atmosferiche","age":"età","alola":"dialola","eggsonly":"solouovo","tradeevolve":"evoluzionescambio","candyxl":"caramellaL","costume":"costume","defender":"difensore","distance":"distanza","megaevolve":"megaevoluzione","evolvenew":"nuovaevoluzione","item":"Strumento","megaevolve":"megaevoluzione","gbl":"llg","Female":"Femmina","Male":"Maschio","Genderunknown":"sessosconosciuto","hatched":"dauovo","legendary":"leggendario","lucky":"fortunato","mythical":"misterioso","snapshot":"foto","purified":"purificati","raid":"raid","exraid":"raidex","megaraid":"megaraid","remoteraid":"raidremoto","research":"ricerca","rocket":"rocket","shadow":"Ombra","shiny":"cromatico","special":"speciale","traded":"Scambiato","year":"anno","Bug":"Coleottero","Dark":"Buio","Dragon":"Drago","Electric":"Elettro","Fairy":"Folletto","Fighting":"Lotta","Fire":"Fuoco","Flying":"Volante","Ghost":"Spettro","Grass":"Erba","Ground":"Terra","Ice":"Ghiaccio","Normal":"Normale","Poison":"Veleno","Psychic":"Psico","Rock":"Roccia","Steel":"Acciaio","Water":"Acqua","Johto":"Johto","Hoenn":"Hoenn","Sinnoh":"Sinnoh","Unova":"Unima","Kalos":"Kalos","Alola":"Alola","Galar":"Galar","giftable":"regala","interactable":"interagisci","lucky":"fortunato","friendlevel":"livelloamicizia"},
    "JAPANESE":{"CP":"CP","HP":"HP","Buddy":"相棒","XXS":"XXL","XS":"XS","XL":"XL","XXL":"XXL","Weather":"天候","age":"日数","alola":"あろーら","eggsonly":"たまごのみ","tradeevolve":"こうかんしんか","candyxl":"アメXL","costume":"とくべつ","defender":"ジムを守るポケモン","distance":"きょり","megaevolve":"めがしんか","evolvenew":"みとうろく","item":"どうぐ","megaevolve":"めがしんか","gbl":"バトルリーグ","Female":"めす","Male":"おす","Genderunknown":"性別不明","hatched":"ふか","legendary":"伝説のポケモン","lucky":"キラ","mythical":"まぼろし","snapshot":"スナップショット","purified":"らいと","raid":"レイド","exraid":"EXレイド","megaraid":"メガレイド","remoteraid":"リモートレイド","research":"リサーチ","rocket":"ロケット","shadow":"しゃどう","shiny":"色違い","special":"わざ","traded":"こうかん","year":"年","Bug":"むし","Dark":"あく","Dragon":"ドラゴン","Electric":"でんき","Fairy":"フェアリー","Fighting":"かくとう","Fire":"ほのお","Flying":"ひこう","Ghost":"ゴースト","Grass":"くさ","Ground":"じめん","Ice":"こおり","Normal":"ノーマル","Poison":"どく","Psychic":"エスパー","Rock":"いわ","Steel":"はがね","Water":"みず","Johto":"ジョウト","Hoenn":"ホウエン","Sinnoh":"シンオウ","Unova":"イッシュ","Kalos":"カロス","Alola":"アローラ","Galar":"ガラル","giftable":"ギフト","interactable":"インタラクト","lucky":"キラ","friendlevel":"仲良し度"},
    "KOREAN":{"CP":"CP","HP":"HP","Buddy":"파트너 포켓몬","XXS":"XXS","XS":"XS","XL":"XL","XXL":"XXL","Weather":"날씨","age":"일수","alola":"알로라","eggsonly":"알","tradeevolve":"교환진화","candyxl":"사탕XL","costume":"특별","defender":"방어 포켓몬","distance":"거리","megaevolve":"메가진화","evolvenew":"미등록","item":"도구","megaevolve":"메가진화","gbl":"gbl","Female":"암컷","Male":"수컷","Genderunknown":"성별불명","hatched":"부화","legendary":"전설의 포켓몬","lucky":"반짝반짝","mythical":"환상","snapshot":"스냅샷","purified":"정화","raid":"레이드","exraid":"EX레이드","megaraid":"메가 레이드","remoteraid":"리모트 레이드","research":"리서치","rocket":"로켓","shadow":"그림자","shiny":"색이 다른","special":"기술","traded":"교환","year":"연도","Bug":"벌레","Dark":"악","Dragon":"드래곤","Electric":"전기","Fairy":"페어리","Fighting":"격투","Fire":"불꽃","Flying":"비행","Ghost":"고스트","Grass":"풀","Ground":"땅","Ice":"얼음","Normal":"노말","Poison":"독","Psychic":"에스퍼","Rock":"바위","Steel":"강철","Water":"물","Johto":"성도","Hoenn":"호연","Sinnoh":"신오","Unova":"하나","Kalos":"칼로스","Alola":"알로라","Galar":"가라르","giftable":"선물","interactable":"상호작용","lucky":"반짝반짝","friendlevel":"우정레벨"},
    "RUSSIAN":{"CP":"БС","HP":"ОЖ","Buddy":"Приятель","XXS":"XXS","XS":"XS","XL":"XL","XXL":"XXL","Weather":"Погода","age":"возраст","alola":"алола","eggsonly":"толькояйца","tradeevolve":"обменэволюция","candyxl":" конфеты XL","costume":"костюмы","defender":"защитник","distance":"удалённый","megaevolve":"мегаэволюция","evolvenew":"новаяэволюция","item":"предмет","megaevolve":"мегаэволюционировать","gbl":"боеваялигаGO","Female":"Женский","Male":"Мужской","Genderunknown":"Полнеизвестен","hatched":"вылупился","legendary":"легендарный","lucky":"удачливый","mythical":"мифический","snapshot":"фото","purified":"очищенный","raid":"рейд","exraid":"EX-рейд","megaraid":"мегарейд","remoteraid":"удалённыйрейд","research":"квест","rocket":"ракета","shadow":"теневой","shiny":"сияющий","special":"особый","traded":"обменян","year":"год","Bug":"Насекомое","Dark":"Темнота","Dragon":"Дракон","Electric":"Электро","Fairy":"Фея","Fighting":"Сражение","Fire":"Огонь","Flying":"Летающий","Ghost":"Привидение","Grass":"Трава","Ground":"Земля","Ice":"Лёд","Normal":"Обычный","Poison":"Яд","Psychic":"Психо","Rock":"Камень","Steel":"Сталь","Water":"Вода","Johto":"Джото","Hoenn":"Хоэнн","Sinnoh":"Синно","Unova":"Юнова","Kalos":"Калос","Alola":"Алола","Galar":"Галар","giftable":"подарочный","interactable":"общающиеся","lucky":"удачливый","friendlevel":"уровеньдружбы"},
    "SPANISH":{"CP":"PC","HP":"PS","Buddy":"Compañero","XXS":"XXS","XS":"XS","XL":"XL","XXL":"XXL","Weather":"Semana Meteorológica","age":"edad","alola":"alola","eggsonly":"huevosolo","tradeevolve":"evoluciónintercambio","candyxl":"caramelo++","costume":"disfraz","defender":"defensor","distance":"distancia","megaevolve":"megaevoluciona","evolvenew":"nuevaevolución","item":"objeto","megaevolve":"megaevoluciona","gbl":"lcg","Female":"hembra","Male":"macho","Genderunknown":"génerodesconocido","hatched":"eclosionado","legendary":"legendario","lucky":"suerte","mythical":"singular","snapshot":"instantánea","purified":"purificado","raid":"Incursión","exraid":"incursiónex","megaraid":"megaincursión","remoteraid":"incursiónremota","research":"investigación","rocket":"rocket","shadow":"oscuro","shiny":"variocolor","special":"especial","traded":"intercambiados","year":"año","Bug":"Bicho","Dark":"Siniestro","Dragon":"Dragón","Electric":"Eléctrico","Fairy":"Hada","Fighting":"Lucha","Fire":"Fuego","Flying":"Volador","Ghost":"Fantasma","Grass":"Planta","Ground":"Tierra","Ice":"Hielo","Normal":"Normal","Poison":"Veneno","Psychic":"Psíquico","Rock":"Roca","Steel":"Acero","Water":"Agua","Johto":"Johto","Hoenn":"Hoenn","Sinnoh":"Sinnoh","Unova":"Teselia","Kalos":"Kalos","Alola":"Alola","Galar":"Galar","giftable":"regalo","interactable":"interacción","lucky":"suerte","friendlevel":"nivelamistad"},
    "TURKISH":{"CP":"DG","HP":"SP","Buddy":"Yoldaş","XXS":"XXS","XS":"XS","XL":"XL","XXL":"XXL","Weather":"Hava Durumu","age":"yaş","alola":"alola","eggsonly":"sadeceyumurta","tradeevolve":"takasevrimi","candyxl":"büyükşeker","costume":"kostüm","defender":"savunan","distance":"mesafe","megaevolve":"megaevrim","evolvenew":"yenievrim","item":"eşya","megaevolve":"megaevrim","gbl":"gml","Female":"Dişi","Male":"Erkek","Genderunknown":"Cinsiyetbilinmiyor","hatched":"çatladı","legendary":"efsanevi","lucky":"şanslı","mythical":"mitolojik","snapshot":"Fotoğraf","purified":"arınmış","raid":"akın","exraid":"özelakın","megaraid":"megaakın","remoteraid":"uzakakın","research":"araştırma","rocket":"roket","shadow":"gölge","shiny":"parlak","special":"özel","traded":"takasla gelen","year":"yıl","Bug":"Böcek","Dark":"Karanlık","Dragon":"Ejderha","Electric":"Elektrik","Fairy":"Peri","Fighting":"Dövüşçü","Fire":"Ateş","Flying":"Uçan","Ghost":"Hayalet","Grass":"Bitki","Ground":"Yer","Ice":"Buz","Normal":"Normal","Poison":"Zehir","Psychic":"Psişik","Rock":"Kaya","Steel":"Çelik","Water":"Su","Johto":"Johto","Hoenn":"Hoenn","Sinnoh":"Sinnoh","Unova":"Unova","Kalos":"Kalos","Alola":"Alola","Galar":"Galar","giftable":"hediyeedilebilir","interactable":"etkileşimli","lucky":"şanslı","friendlevel":"arkadaşseviyesi"},
    "THAI":{"CP":"CP","HP":"HP","Buddy":"คูหู","XXS":"XXS","XS":"XS","XL":"XL","XXL":"XXL","Weather":"ลมแรง","age":"อายุ","alola":"อโลลา","eggsonly":"รางเบบี้","tradeevolve":"แลกเปลี่ยนกลายราง","candyxl":"ลูกอม XL","costume":"เครื่องแตงกาย","defender":"ปองกันยิม","distance":"ระยะทาง","megaevolve":"วิวัฒนาการเมกา","evolvenew":"วิวัฒนาการใหม","item":"ไอเทม","megaevolve":"วิวัฒนาการเมกา","gbl":"โกแบตเทิลลีก","Female":"ตัวเมีย","Male":"ตัวผู","Genderunknown":"เพศไมแนชัด","hatched":"ฟกจากไข","legendary":"ตำนาน","lucky":"นำโชค","mythical":"มายา","snapshot":"ถายภาพ","purified":"ชำระลาง","raid":"ตีบอส","exraid":"ตีบอส EX","megaraid":"ตีบอสเมกา","remoteraid":"ตีบอสระยะไกล","research":"งานวิจัย","rocket":"ร็อกเกต","shadow":"ชาโดว","shiny":"สีแตกตาง","special":"พิเศษ","traded":"แลกเปลี่ยน","year":"ป","Bug":"ความมืด","Dark":"มังกร","Dragon":"ไฟฟา","Electric":"แฟรี่","Fairy":"ตอสู","Fighting":"ไฟ","Fire":"บิน","Flying":"ผี","Ghost":"หญา","Grass":"ดิน","Ground":"น้ำแข็ง","Ice":"ปกติ","Normal":"พิษ","Poison":"พลังจิต","Psychic":"หิน","Rock":"โลหะ","Steel":"น้ำ","Water":"การลบโปเกมอนออกจากรายการโปรดลมเหลว","Johto":"โจโตะ","Hoenn":"โฮเอ็น","Sinnoh":"ชินโอ","Unova":"อิชชู","Kalos":"คาลอส","Alola":"อโลลา","Galar":"กาลาร","giftable":"ใหของได","interactable":"เพิ่มระดับได","lucky":"นำโชค","friendlevel":"ระดับเพื่อน"}}
