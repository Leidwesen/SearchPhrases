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
    ["","workaround for tag negation","GOAL: A search for all pokemon without tag TAG<br>• Create tag TEMP<br>• Tag all pokemon with TEMP. You cannot select-all on an unfiltered storage, so use two phrases that cover everything such as 'age0' and 'age1-'<br>• Search 'TAG&TEMP', select-all, remove TEMP.<br>• TEMP is now a negation of TAG.<br>• To match all untagged, use '#' instead of 'TAG'"],
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
    'ENGLISH':{'CP':'CP','distance':'distance','HP':'HP','age':'age','Buddy':'Buddy','year':'year','Bug':'Bug','Dark':'Dark','Dragon':'Dragon','Electric':'Electric','Fairy':'Fairy','Fighting':'Fighting','Fire':'Fire','Flying':'Flying','Ghost':'Ghost','Grass':'Grass','Ground':'Ground','Ice':'Ice','Normal':'Normal','Poison':'Poison','Psychic':'Psychic','Rock':'Rock','Steel':'Steel','Water':'Water','Kanto':'Kanto','Johto':'Johto','Hoenn':'Hoenn','Sinnoh':'Sinnoh','Unova':'Unova','Kalos':'Kalos','Alola':'Alola','alola':'alola','Galar':'Galar','Male':'Male','Female':'Female','Genderunknown':'Genderunknown','XXS':'XXS','XS':'XS','XL':'XL','XXL':'XXL','costume':'costume','eggsonly':'eggsonly','legendary':'legendary','mythical':'mythical','shadow':'shadow','purified':'purified','shiny':'shiny','lucky':'lucky','defender':'defender','candyxl':'candyxl','raid':'raid','remoteraid':'remoteraid','megaraid':'megaraid','exraid':'exraid','hatched':'hatched','research':'research','gbl':'gbl','rocket':'rocket','snapshot':'snapshot','traded':'traded','Evolve':'Evolve','Evolve':'Evolve','evolvenew':'evolvenew','megaevolve':'megaevolve','megaevolve':'megaevolve','item':'item','tradeevolve':'tradeevolve','special':'special','Weather':'Weather','interactable':'interactable'},
    'BRAZILIAN PORTUGUESE':{'CP':'PC','distance':'distância','HP':'PS','age':'idade','Buddy':'Companheiro','year':'ano','Bug':'Inseto','Dark':'Sombrio','Dragon':'Dragão','Electric':'Elétrico','Fairy':'Fada','Fighting':'Lutador','Fire':'Fogo','Flying':'Voador','Ghost':'Fantasma','Grass':'Planta','Ground':'Terrestre','Ice':'Gelo','Normal':'Normal','Poison':'Venenoso','Psychic':'Psíquico','Rock':'Pedra','Steel':'Aço','Water':'Água','Kanto':'Kanto','Johto':'Johto','Hoenn':'Hoenn','Sinnoh':'Sinnoh','Unova':'Unova','Kalos':'Kalos','Alola':'Alola','alola':'Alola','Galar':'Galar','Male':'Macho','Female':'Fêmea','Genderunknown':'gênerodesconhecido','XXS':'XXS','XS':'XS','XL':'XL','XXL':'XXL','costume':'traje','eggsonly':'apenasovos','legendary':'lendário','mythical':'Mítico','shadow':'Sombroso','purified':'purificado','shiny':'Brilhante','lucky':'sortudo','defender':'defensor','candyxl':'doce GG','raid':'Reide','remoteraid':'reideadistância','megaraid':'megarreide','exraid':'reideex','hatched':'chocado','research':'pesquisa','gbl':'lbg','rocket':'rocket','snapshot':'retrato','traded':'Trocado','Evolve':'Evoluir','Evolve':'Evoluir','evolvenew':'evoluirnovo','megaevolve':'megaevolui','megaevolve':'megaevolui','item':'item','tradeevolve':'evoluirportroca','special':'especial','Weather':'Clima','interactable':'interagir'},
    'CHINESE TRADITIONAL':{'CP':'CP','distance':'距離','HP':'HP','age':'日數','Buddy':'夥伴','year':'年','Bug':'蟲','Dark':'惡','Dragon':'龍','Electric':'電','Fairy':'妖精','Fighting':'格鬥','Fire':'火','Flying':'飛行','Ghost':'幽靈','Grass':'草','Ground':'地面','Ice':'冰','Normal':'一般','Poison':'毒','Psychic':'超能力','Rock':'岩石','Steel':'鋼','Water':'水','Kanto':'關都','Johto':'城都','Hoenn':'豐緣','Sinnoh':'神奧','Unova':'合眾','Kalos':'卡洛斯','Alola':'阿羅拉','alola':'阿羅拉','Galar':'伽勒爾','Male':'雄性','Female':'雌性','Genderunknown':'性別不明','XXS':'XXS','XS':'XS','XL':'XL','XXL':'XXL','costume':'特殊','eggsonly':'只限蛋','legendary':'傳說的寶可夢','mythical':'幻','shadow':'暗影','purified':'淨化','shiny':'異色','lucky':'亮晶晶','defender':'防禦者','candyxl':'糖果XL','raid':'團體戰','remoteraid':'遠距團體戰','megaraid':'超級團體戰','exraid':'VIP團體戰','hatched':'孵化','research':'調查','gbl':'GO對戰聯盟','rocket':'火箭','snapshot':'Snapshot','traded':'交換','Evolve':'進化','Evolve':'進化','evolvenew':'未登錄','megaevolve':'超級進化','megaevolve':'超級進化','item':'道具','tradeevolve':'交換進化','special':'特別','Weather':'天氣','interactable':'互動'},
    'FRENCH':{'CP':'PC','distance':'distance','HP':'PV','age':'âge','Buddy':'Copain','year':'année','Bug':'Insecte','Dark':'Ténèbres','Dragon':'Dragon','Electric':'Électrik','Fairy':'Fée','Fighting':'Combat','Fire':'Feu','Flying':'Vol','Ghost':'Spectre','Grass':'Plante','Ground':'Sol','Ice':'Glace','Normal':'Normal','Poison':'Poison','Psychic':'Psy','Rock':'Roche','Steel':'Acier','Water':'Eau','Kanto':'Kanto','Johto':'Johto','Hoenn':'Hoenn','Sinnoh':'Sinnoh','Unova':'Unys','Kalos':'Kalos','Alola':'Alola','alola':'Alola','Galar':'Galar','Male':'mâle','Female':'femelle','Genderunknown':'sexeinconnu','XXS':'XXS','XS':'XS','XL':'XL','XXL':'XXL','costume':'costume','eggsonly':'oeufseulement','legendary':'légendaire','mythical':'fabuleux','shadow':'obscur','purified':'purifié','shiny':'chromatique','lucky':'chanceux','defender':'défenseur','candyxl':'bonbonL','raid':'Raid','remoteraid':'raidàdistance','megaraid':'mégaraid','exraid':'raidex','hatched':'éclos','research':'étude','gbl':'lgc','rocket':'rocket','snapshot':'photo','traded':'échangé','Evolve':'Évolution','Evolve':'Évoluer','evolvenew':'nouvelleévolution','megaevolve':'mégaévolue','megaevolve':'mégaévolue','item':'objet','tradeevolve':'évolutionparéchange','special':'spécial','Weather':'Météo','interactable':'interaction'},
    'GERMAN':{'CP':'WP','distance':'Entfernung','HP':'KP','age':'Alter','Buddy':'Kumpel','year':'Jahr','Bug':'Käfer','Dark':'Unlicht','Dragon':'Drache','Electric':'Elektro','Fairy':'Fee','Fighting':'Kampf','Fire':'Feuer','Flying':'Flug','Ghost':'Geist','Grass':'Pflanze','Ground':'Boden','Ice':'Eis','Normal':'Normal','Poison':'Gift','Psychic':'Psycho','Rock':'Gestein','Steel':'Stahl','Water':'Wasser','Kanto':'Kanto','Johto':'Johto','Hoenn':'Hoenn','Sinnoh':'Sinnoh','Unova':'Einall','Kalos':'Kalos','Alola':'Alola','alola':'Alola','Galar':'Galar','Male':'Männlich','Female':'Weiblich','Genderunknown':'Geschlechtunbekannt','XXS':'XXS','XS':'XS','XL':'XL','XXL':'XXL','costume':'kostümiert','eggsonly':'nurausEiern','legendary':'Legendär','mythical':'Mysteriös','shadow':'Crypto','purified':'erlöst','shiny':'Schillernd','lucky':'Glücks','defender':'Verteidiger','candyxl':'bonbonxl','raid':'Raid','remoteraid':'FernRaid','megaraid':'MegaRaid','exraid':'ExRaid','hatched':'ausgebrütet','research':'Forschung','gbl':'GBL','rocket':'Rocket','snapshot':'Schnappschuss','traded':'Getauscht','Evolve':'Entwickeln','Evolve':'Entwickeln','evolvenew':'NeueEntwicklung','megaevolve':'MegaEntwicklung','megaevolve':'MegaEntwicklung','item':'Item','tradeevolve':'Tauschentwicklung','special':'spezial','Weather':'Wetter','interactable':'interaktionsfähig'},
    'ITALIAN':{'CP':'PL','distance':'distanza','HP':'PS','age':'età','Buddy':'Compagno','year':'anno','Bug':'Coleottero','Dark':'Buio','Dragon':'Drago','Electric':'Elettro','Fairy':'Folletto','Fighting':'Lotta','Fire':'Fuoco','Flying':'Volante','Ghost':'Spettro','Grass':'Erba','Ground':'Terra','Ice':'Ghiaccio','Normal':'Normale','Poison':'Veleno','Psychic':'Psico','Rock':'Roccia','Steel':'Acciaio','Water':'Acqua','Kanto':'Kanto','Johto':'Johto','Hoenn':'Hoenn','Sinnoh':'Sinnoh','Unova':'Unima','Kalos':'Kalos','Alola':'Alola','alola':'dialola','Galar':'Galar','Male':'Maschio','Female':'Femmina','Genderunknown':'sessosconosciuto','XXS':'XXS','XS':'XS','XL':'XL','XXL':'XXL','costume':'costume','eggsonly':'solouovo','legendary':'leggendario','mythical':'misterioso','shadow':'Ombra','purified':'purificati','shiny':'cromatico','lucky':'fortunato','defender':'difensore','candyxl':'caramellaL','raid':'raid','remoteraid':'raidremoto','megaraid':'megaraid','exraid':'raidex','hatched':'dauovo','research':'ricerca','gbl':'llg','rocket':'rocket','snapshot':'foto','traded':'Scambiato','Evolve':'Da far evolvere','Evolve':'Fai evolvere','evolvenew':'nuovaevoluzione','megaevolve':'megaevoluzione','megaevolve':'megaevoluzione','item':'Strumento','tradeevolve':'evoluzionescambio','special':'speciale','Weather':'Condizioni atmosferiche','interactable':'interagisci'},
    'JAPANESE':{'CP':'CP','distance':'きょり','HP':'HP','age':'日数','Buddy':'相棒','year':'年','Bug':'むし','Dark':'あく','Dragon':'ドラゴン','Electric':'でんき','Fairy':'フェアリー','Fighting':'かくとう','Fire':'ほのお','Flying':'ひこう','Ghost':'ゴースト','Grass':'くさ','Ground':'じめん','Ice':'こおり','Normal':'ノーマル','Poison':'どく','Psychic':'エスパー','Rock':'いわ','Steel':'はがね','Water':'みず','Kanto':'カントー','Johto':'ジョウト','Hoenn':'ホウエン','Sinnoh':'シンオウ','Unova':'イッシュ','Kalos':'カロス','Alola':'アローラ','alola':'あろーら','Galar':'ガラル','Male':'おす','Female':'めす','Genderunknown':'性別不明','XXS':'XXL','XS':'XS','XL':'XL','XXL':'XXL','costume':'とくべつ','eggsonly':'たまごのみ','legendary':'伝説のポケモン','mythical':'まぼろし','shadow':'しゃどう','purified':'らいと','shiny':'色違い','lucky':'キラ','defender':'ジムを守るポケモン','candyxl':'アメXL','raid':'レイド','remoteraid':'リモートレイド','megaraid':'メガレイド','exraid':'EXレイド','hatched':'ふか','research':'リサーチ','gbl':'バトルリーグ','rocket':'ロケット','snapshot':'スナップショット','traded':'こうかん','Evolve':'進化','Evolve':'進化','evolvenew':'みとうろく','megaevolve':'めがしんか','megaevolve':'めがしんか','item':'どうぐ','tradeevolve':'こうかんしんか','special':'わざ','Weather':'天候','interactable':'インタラクト'},
    'KOREAN':{'CP':'CP','distance':'거리','HP':'HP','age':'일수','Buddy':'파트너 포켓몬','year':'연도','Bug':'벌레','Dark':'악','Dragon':'드래곤','Electric':'전기','Fairy':'페어리','Fighting':'격투','Fire':'불꽃','Flying':'비행','Ghost':'고스트','Grass':'풀','Ground':'땅','Ice':'얼음','Normal':'노말','Poison':'독','Psychic':'에스퍼','Rock':'바위','Steel':'강철','Water':'물','Kanto':'관동','Johto':'성도','Hoenn':'호연','Sinnoh':'신오','Unova':'하나','Kalos':'칼로스','Alola':'알로라','alola':'알로라','Galar':'가라르','Male':'수컷','Female':'암컷','Genderunknown':'성별불명','XXS':'XXS','XS':'XS','XL':'XL','XXL':'XXL','costume':'특별','eggsonly':'알','legendary':'전설의 포켓몬','mythical':'환상','shadow':'그림자','purified':'정화','shiny':'색이 다른','lucky':'반짝반짝','defender':'방어 포켓몬','candyxl':'사탕XL','raid':'레이드','remoteraid':'리모트 레이드','megaraid':'메가 레이드','exraid':'EX레이드','hatched':'부화','research':'리서치','gbl':'gbl','rocket':'로켓','snapshot':'스냅샷','traded':'교환','Evolve':'진화','Evolve':'진화','evolvenew':'미등록','megaevolve':'메가진화','megaevolve':'메가진화','item':'도구','tradeevolve':'교환진화','special':'기술','Weather':'날씨','interactable':'상호작용'},
    'RUSSIAN':{'CP':'БС','distance':'удалённый','HP':'ОЖ','age':'возраст','Buddy':'Приятель','year':'год','Bug':'Насекомое','Dark':'Темнота','Dragon':'Дракон','Electric':'Электро','Fairy':'Фея','Fighting':'Сражение','Fire':'Огонь','Flying':'Летающий','Ghost':'Привидение','Grass':'Трава','Ground':'Земля','Ice':'Лёд','Normal':'Обычный','Poison':'Яд','Psychic':'Психо','Rock':'Камень','Steel':'Сталь','Water':'Вода','Kanto':'Канто','Johto':'Джото','Hoenn':'Хоэнн','Sinnoh':'Синно','Unova':'Юнова','Kalos':'Калос','Alola':'Алола','alola':'алола','Galar':'Галар','Male':'Мужской','Female':'Женский','Genderunknown':'Полнеизвестен','XXS':'XXS','XS':'XS','XL':'XL','XXL':'XXL','costume':'костюмы','eggsonly':'толькояйца','legendary':'легендарный','mythical':'мифический','shadow':'теневой','purified':'очищенный','shiny':'сияющий','lucky':'удачливый','defender':'защитник','candyxl':' конфеты XL','raid':'рейд','remoteraid':'удалённыйрейд','megaraid':'мегарейд','exraid':'EX-рейд','hatched':'вылупился','research':'квест','gbl':'боеваялигаGO','rocket':'ракета','snapshot':'фото','traded':'обменян','Evolve':'Эволюция','Evolve':'Эволюция','evolvenew':'новаяэволюция','megaevolve':'мегаэволюция','megaevolve':'мегаэволюционировать','item':'предмет','tradeevolve':'обменэволюция','special':'особый','Weather':'Погода','interactable':'общающиеся'},
    'SPANISH':{'CP':'PC','distance':'distancia','HP':'PS','age':'edad','Buddy':'Compañero','year':'año','Bug':'Bicho','Dark':'Siniestro','Dragon':'Dragón','Electric':'Eléctrico','Fairy':'Hada','Fighting':'Lucha','Fire':'Fuego','Flying':'Volador','Ghost':'Fantasma','Grass':'Planta','Ground':'Tierra','Ice':'Hielo','Normal':'Normal','Poison':'Veneno','Psychic':'Psíquico','Rock':'Roca','Steel':'Acero','Water':'Agua','Kanto':'Kanto','Johto':'Johto','Hoenn':'Hoenn','Sinnoh':'Sinnoh','Unova':'Teselia','Kalos':'Kalos','Alola':'Alola','alola':'alola','Galar':'Galar','Male':'macho','Female':'hembra','Genderunknown':'génerodesconocido','XXS':'XXS','XS':'XS','XL':'XL','XXL':'XXL','costume':'disfraz','eggsonly':'huevosolo','legendary':'legendario','mythical':'singular','shadow':'oscuro','purified':'purificado','shiny':'variocolor','lucky':'suerte','defender':'defensor','candyxl':'caramelo++','raid':'Incursión','remoteraid':'incursiónremota','megaraid':'megaincursión','exraid':'incursiónex','hatched':'eclosionado','research':'investigación','gbl':'lcg','rocket':'rocket','snapshot':'instantánea','traded':'intercambiados','Evolve':'Evolucionados','Evolve':'Evolucionar','evolvenew':'nuevaevolución','megaevolve':'megaevoluciona','megaevolve':'megaevoluciona','item':'objeto','tradeevolve':'evoluciónintercambio','special':'especial','Weather':'Tiempo atmosférico','interactable':'interacción'},
    'TURKISH':{'CP':'DG','distance':'mesafe','HP':'SP','age':'yaş','Buddy':'Yoldaş','year':'yıl','Bug':'Böcek','Dark':'Karanlık','Dragon':'Ejderha','Electric':'Elektrik','Fairy':'Peri','Fighting':'Dövüşçü','Fire':'Ateş','Flying':'Uçan','Ghost':'Hayalet','Grass':'Bitki','Ground':'Yer','Ice':'Buz','Normal':'Normal','Poison':'Zehir','Psychic':'Psişik','Rock':'Kaya','Steel':'Çelik','Water':'Su','Kanto':'Kanto','Johto':'Johto','Hoenn':'Hoenn','Sinnoh':'Sinnoh','Unova':'Unova','Kalos':'Kalos','Alola':'Alola','alola':'alola','Galar':'Galar','Male':'Erkek','Female':'Dişi','Genderunknown':'Cinsiyetbilinmiyor','XXS':'XXS','XS':'XS','XL':'XL','XXL':'XXL','costume':'kostüm','eggsonly':'sadeceyumurta','legendary':'efsanevi','mythical':'mitolojik','shadow':'gölge','purified':'arınmış','shiny':'parlak','lucky':'şanslı','defender':'savunan','candyxl':'büyükşeker','raid':'akın','remoteraid':'uzakakın','megaraid':'megaakın','exraid':'özelakın','hatched':'çatladı','research':'araştırma','gbl':'gml','rocket':'roket','snapshot':'Fotoğraf','traded':'takasla gelen','Evolve':'Evrimleştir','Evolve':'Evrimleştir','evolvenew':'yenievrim','megaevolve':'megaevrim','megaevolve':'megaevrim','item':'eşya','tradeevolve':'takasevrimi','special':'özel','Weather':'Hava Durumu','interactable':'etkileşimli'},
    'THAI':{'CP':'CP','distance':'ระยะทาง','HP':'HP','age':'อายุ','Buddy':'คูหู','year':'ป','Bug':'แมลง','Dark':'ความมืด','Dragon':'มังกร','Electric':'ไฟฟา','Fairy':'แฟรี่','Fighting':'ตอสู','Fire':'ไฟ','Flying':'บิน','Ghost':'ผี','Grass':'หญา','Ground':'ดิน','Ice':'น้ำแข็ง','Normal':'ปกติ','Poison':'พิษ','Psychic':'พลังจิต','Rock':'หิน','Steel':'โลหะ','Water':'น้ำ','Kanto':'คันโต','Johto':'โจโตะ','Hoenn':'โฮเอ็น','Sinnoh':'ชินโอ','Unova':'อิชชู','Kalos':'คาลอส','Alola':'อโลลา','alola':'อโลลา','Galar':'กาลาร','Male':'ตัวผู','Female':'ตัวเมีย','Genderunknown':'เพศไมแนชัด','XXS':'XXS','XS':'XS','XL':'XL','XXL':'XXL','costume':'เครื่องแตงกาย','eggsonly':'รางเบบี้','legendary':'ตำนาน','mythical':'มายา','shadow':'ชาโดว','purified':'ชำระลาง','shiny':'สีแตกตาง','lucky':'นำโชค','defender':'ปองกันยิม','candyxl':'ลูกอม XL','raid':'ตีบอส','remoteraid':'ตีบอสระยะไกล','megaraid':'ตีบอสเมกา','exraid':'ตีบอส EX','hatched':'ฟกจากไข','research':'งานวิจัย','gbl':'โกแบตเทิลลีก','rocket':'ร็อกเกต','snapshot':'ถายภาพ','traded':'แลกเปลี่ยน','Evolve':'วิวัฒนาการ','Evolve':'วิวัฒนาการ','evolvenew':'วิวัฒนาการใหม','megaevolve':'วิวัฒนาการเมกา','megaevolve':'วิวัฒนาการเมกา','item':'ไอเทม','tradeevolve':'แลกเปลี่ยนกลายราง','special':'พิเศษ','Weather':'สภาพอากาศ','interactable':'เพิ่มระดับได'}}
