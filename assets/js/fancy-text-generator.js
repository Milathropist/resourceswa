/**
 * Client-side Unicode fancy text generator for the image editor page.
 */
(() => {
  const SOURCE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const alphabets = {
    serifBold: "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
    serifItalic: "𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝑨𝑩" + "0123456789",
    serifBoldItalic: "𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
    sans: "𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓𝗔𝗕𝟢𝟣𝟤𝟥𝟦𝟧𝟨𝟩𝟪𝟫",
    sansBold: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝘈𝘉𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵",
    sansItalic: "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻" + "0123456789",
    sansBoldItalic: "𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵",
    monospace: "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿",
    circled: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪⓪①②③④⑤⑥⑦⑧⑨",
    squared: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉" + "abcdefghijklmnopqrstuvwxyz0123456789",
    fullwidth: "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９",
    smallCaps: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘꞯʀꜱᴛᴜᴠᴡxʏᴢ" + "abcdefghijklmnopqrstuvwxyz0123456789"
  };

  const codePointRange = (start, length) => Array.from(
    { length },
    (_unused, index) => String.fromCodePoint(start + index)
  );

  const mathematicalAlphabet = (upperStart, lowerStart, digitStart = null, exceptions = {}) => {
    const characters = [
      ...codePointRange(upperStart, 26),
      ...codePointRange(lowerStart, 26),
      ...(digitStart === null ? Array.from("0123456789") : codePointRange(digitStart, 10))
    ];
    Object.entries(exceptions).forEach(([index, character]) => {
      characters[Number(index)] = character;
    });
    return characters.join("");
  };

  const smallCapsLetters = "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘꞯʀꜱᴛᴜᴠᴡxʏᴢ";
  Object.assign(alphabets, {
    serifBold: mathematicalAlphabet(0x1d400, 0x1d41a, 0x1d7ce),
    serifItalic: mathematicalAlphabet(0x1d434, 0x1d44e, null, { 33: "ℎ" }),
    serifBoldItalic: mathematicalAlphabet(0x1d468, 0x1d482, 0x1d7ce),
    script: mathematicalAlphabet(0x1d49c, 0x1d4b6, null, {
      1: "ℬ", 4: "ℰ", 5: "ℱ", 7: "ℋ", 8: "ℐ", 11: "ℒ", 12: "ℳ", 17: "ℛ",
      30: "ℯ", 32: "ℊ", 40: "ℴ"
    }),
    scriptBold: mathematicalAlphabet(0x1d4d0, 0x1d4ea),
    fraktur: mathematicalAlphabet(0x1d504, 0x1d51e, null, {
      2: "ℭ", 7: "ℌ", 8: "ℑ", 17: "ℜ", 25: "ℨ"
    }),
    frakturBold: mathematicalAlphabet(0x1d56c, 0x1d586),
    doubleStruck: mathematicalAlphabet(0x1d538, 0x1d552, 0x1d7d8, {
      2: "ℂ", 7: "ℍ", 13: "ℕ", 15: "ℙ", 16: "ℚ", 17: "ℝ", 25: "ℤ"
    }),
    sans: mathematicalAlphabet(0x1d5a0, 0x1d5ba, 0x1d7e2),
    sansBold: mathematicalAlphabet(0x1d5d4, 0x1d5ee, 0x1d7ec),
    sansItalic: mathematicalAlphabet(0x1d608, 0x1d622),
    sansBoldItalic: mathematicalAlphabet(0x1d63c, 0x1d656, 0x1d7ec),
    monospace: mathematicalAlphabet(0x1d670, 0x1d68a, 0x1d7f6),
    circled: [
      ...codePointRange(0x24b6, 26),
      ...codePointRange(0x24d0, 26),
      "⓪",
      ...codePointRange(0x2460, 9)
    ].join(""),
    squared: `${codePointRange(0x1f130, 26).join("")}abcdefghijklmnopqrstuvwxyz0123456789`,
    fullwidth: mathematicalAlphabet(0xff21, 0xff41, 0xff10),
    smallCaps: `${smallCapsLetters}${smallCapsLetters}0123456789`
  });

  const transform = (text, alphabet) => {
    const targets = Array.from(alphabet);
    const map = new Map(Array.from(SOURCE).map((character, index) => [character, targets[index] || character]));
    return Array.from(text).map((character) => map.get(character) || character).join("");
  };

  const decorate = (text, mark) => Array.from(text).map((character) => character.trim() ? `${character}${mark}` : character).join("");
  const spaced = (text) => Array.from(text).join(" ");
  const mirrored = (text) => Array.from(text).reverse().join("");

  const replaceCharacters = (text, replacements) => Array.from(text).map((character) => {
    const replacement = replacements[character.toLowerCase()];
    return replacement === undefined ? character : replacement;
  }).join("");

  const customStyles = [
    { w: "᭙", a: "ꪖ" },
    { w: "ᨰׁׅ", a: "ɑׁׅ֮" },
    { w: "ꉂ", a: "𓂅" },
    { w: "ꅏ", a: "ꍏ" },
    { w: "ฬ", a: "ค" },
    { w: "ɯ", a: "α" },
    { w: "ա", a: "ǟ" },
    { w: "Ꮗ", a: "Ꮧ" },
    { w: "ῳ", a: "ą" },
    { w: "ຟ", a: "ค" },
    { w: "Щ", a: "Λ" },
    { w: "ω", a: "α" },
    { w: "w", a: "å" },
    { w: "₩", a: "₳" },
    { w: "山", a: "卂" },
    { w: "W", a: "ﾑ" },
    { w: "ա", a: "ą" },
    { w: "ᗯ", a: "ᗩ" },
    { w: "ᘺ", a: "ᗩ" }
  ];

  const subscriptMap = Object.fromEntries(Array.from("aeioruvx0123456789").map((character, index) => [
    character,
    Array.from("ₐₑᵢₒᵣᵤᵥₓ₀₁₂₃₄₅₆₇₈₉")[index]
  ]));
  const superscriptMap = Object.fromEntries(Array.from("abcdefghijklmnopqrstuvwxyz0123456789").map((character, index) => [
    character,
    Array.from("ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹")[index]
  ]));
  const upsideDownMap = {
    a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ",
    k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ",
    u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z", "?": "¿", "!": "¡"
  };
  const mirrorMap = { a: "ɒ", b: "d", c: "ɔ", d: "b", e: "ɘ", f: "ʇ", g: "ǫ", j: "ꞁ", k: "ʞ", r: "ɿ", s: "ƨ", y: "ʏ" };

  const reverseTransform = (text, replacements) => replaceCharacters(text, replacements).split("").reverse().join("");
  const keycapText = (text) => Array.from(text).map((character) => character.trim() ? `${character}\u20e3` : character).join("\u00a0\u00a0\u00a0");
  const outlinedText = (text) => Array.from(text).map((character) => character.trim() ? `${character}\u20de` : character).join("\u202f\u00a0\u00a0\u202f");
  const flagText = (text) => `\u200b${Array.from(text).map((character) => {
    const code = character.toUpperCase().charCodeAt(0);
    return code >= 65 && code <= 90 ? String.fromCodePoint(0x1f1e6 + code - 65) : character;
  }).join("\u200b\u200b")}\u200b`;
  const squareText = (text, negative = false) => Array.from(text).map((character) => {
    const code = character.toUpperCase().charCodeAt(0);
    if (code < 65 || code > 90) return character;
    return String.fromCodePoint((negative ? 0x1f170 : 0x1f130) + code - 65);
  }).join("");
  const mixedFancy = (text) => Array.from(text).map((character, index) => {
    if (!/[a-z]/i.test(character)) return character;
    if (index % 4 === 0) return transform(character.toLowerCase(), alphabets.doubleStruck);
    if (index % 4 === 1) return replaceCharacters(character, { a: "ᗩ" });
    if (index % 4 === 2) return transform(character.toUpperCase(), alphabets.doubleStruck);
    return replaceCharacters(character, { a: "ά" });
  }).join("");
  const mixedGothic = (text) => Array.from(text).map((character, index) => {
    const styles = [alphabets.doubleStruck, alphabets.serifBold, alphabets.fullwidth, alphabets.fraktur];
    const styledCharacter = index % 4 < 2 ? character.toUpperCase() : character.toLowerCase();
    return transform(styledCharacter, styles[index % styles.length]);
  }).join("");
  const zalgo = (text) => {
    const above = ["\u030a", "\u0341", "\u0306", "\u030e", "\u035d", "\u0300", "\u0301"];
    const below = ["\u0329", "\u032f", "\u033c", "\u0324", "\u0330", "\u0325", "\u0332"];
    return Array.from(text).map((character, index) => {
      if (!character.trim()) return character;
      return `${character}${above[index % above.length]}${above[(index + 3) % above.length]}${below[index % below.length]}${below[(index + 2) % below.length]}`;
    }).join("");
  };

  const glitchMarks = {
    above: Array.from("̍̎̄̅̿̑̆̐͒͗͑̇̈̊͂̓̈́͊͋͌̃̂̌͐́̀̋̏̒̓̔̽̉ͣͤͥͦͧͨͩͪͫͬͭͮͯ̾͛͆̚"),
    below: Array.from("̖̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼͇͈͉͍͎͓͔͕͖͙͚̣ͅ"),
    through: ["̴", "̵", "̶", "̷", "̸"]
  };

  const denseGlitch = (text, profileIndex) => {
    const profiles = [
      { above: 4, below: 2, spread: 2, through: 4 },
      { above: 3, below: 3, spread: 1, through: 3 },
      { above: 2, below: 2, spread: 1, through: 2 },
      { above: 18, below: 22, spread: 7, through: 1 },
      { above: 8, below: 8, spread: 4, through: 3 },
      { above: 6, below: 6, spread: 3, through: 2 }
    ];
    const profile = profiles[profileIndex];

    return Array.from(text).map((character, characterIndex) => {
      if (!character.trim()) return character;
      const seed = profileIndex * 17 + characterIndex * 11 + character.codePointAt(0);
      const aboveCount = profile.above + seed % (profile.spread + 1);
      const belowCount = profile.below + (seed * 3) % (profile.spread + 1);
      const above = Array.from({ length: aboveCount }, (_unused, markIndex) => (
        glitchMarks.above[(seed + markIndex * 7) % glitchMarks.above.length]
      )).join("");
      const below = Array.from({ length: belowCount }, (_unused, markIndex) => (
        glitchMarks.below[(seed * 2 + markIndex * 5) % glitchMarks.below.length]
      )).join("");
      return `${character}${glitchMarks.through[profile.through]}${above}${below}`;
    }).join("");
  };

  const categories = [
    {
      name: "Serif",
      styles: [
        (text) => transform(text, alphabets.serifBold),
        (text) => transform(text, alphabets.serifItalic),
        (text) => transform(text, alphabets.serifBoldItalic)
      ]
    },
    {
      name: "Sans Serif",
      styles: [
        (text) => transform(text, alphabets.sans),
        (text) => transform(text, alphabets.sansBold),
        (text) => transform(text, alphabets.sansItalic),
        (text) => transform(text, alphabets.sansBoldItalic)
      ]
    },
    {
      name: "Script & Gothic",
      styles: [
        (text) => transform(text, alphabets.script),
        (text) => transform(text, alphabets.scriptBold),
        (text) => transform(text, alphabets.fraktur),
        (text) => transform(text, alphabets.frakturBold),
        (text) => transform(text, alphabets.doubleStruck)
      ]
    },
    {
      name: "Clean & Technical",
      styles: [
        (text) => transform(text, alphabets.monospace),
        (text) => transform(text, alphabets.fullwidth),
        spaced
      ]
    },
    {
      name: "Circled & Boxed",
      styles: [
        (text) => transform(text, alphabets.circled),
        (text) => transform(text.toUpperCase(), alphabets.squared),
        (text) => `【 ${text} 】`,
        (text) => `『 ${text} 』`
      ]
    },
    {
      name: "Small Text",
      styles: [
        (text) => transform(text, alphabets.smallCaps),
        (text) => transform(text.toUpperCase(), alphabets.smallCaps),
        (text) => `˚₊‧͡${replaceCharacters(text, superscriptMap)}‧₊˚`
      ]
    },
    {
      name: "Lines & Marks",
      styles: [
        (text) => decorate(text, "\u0332"),
        (text) => decorate(text, "\u0305"),
        (text) => decorate(text, "\u0336"),
        (text) => decorate(text, "\u0337"),
        (text) => decorate(text, "\u0307")
      ]
    },
    {
      name: "Decorative",
      styles: [
        (text) => `✿｡:* ☆.:*${text}*:.☆*:｡✿`,
        (text) => `•¸♡${text}♡¸•`,
        (text) => `✧·°·• ${text} •·°·✧`,
        (text) => `╭┈✩‧₊˚ ${text} ˚₊‧✩┈╮`,
        (text) => `♡ ${text} ♡`,
        (text) => `☆。*・° ${text} °・*。☆`,
        (text) => `【♥】 ${text} 【♥】`
      ]
    },
    {
      name: "Reversed & Quirky",
      styles: [
        mirrored,
        (text) => `。・:*:・゜★,${text},★。・:*:・゜`,
        (text) => Array.from(text).map((character, index) => index % 2 ? character.toUpperCase() : character.toLowerCase()).join("")
      ]
    },
    {
      name: "Decorative Mixes",
      styles: [
        (text) => `°°°·.°·..·°¯°·._.· ${mixedFancy(text)} ·._.·°¯°·.·° .·°°°`,
        (text) => `▀▄▀▄▀▄ ${mixedGothic(text)} ▄▀▄▀▄▀`,
        (text) => `🐧  🎀  ${transform(text, alphabets.script)}  🎀  🐧`,
        (text) => `(っ◔◡◔)っ ♥ ${text} ♥`,
        (text) => `˜”*°•.˜”*°• ${text} •°*”˜.•°*”˜`
      ]
    },
    {
      name: "Alternative Alphabets",
      styles: customStyles.map((replacements) => (text) => replaceCharacters(text, replacements))
    },
    {
      name: "Enclosed & Emoji",
      styles: [
        keycapText,
        flagText,
        outlinedText,
        (text) => squareText(text),
        (text) => squareText(text, true),
        (text) => Array.from(text).map((character) => `【${character}】`).join(""),
        (text) => Array.from(text).map((character) => `『${character}』`).join(""),
        (text) => Array.from(text).map((character) => `≋${character}`).join("") + "≋",
        (text) => Array.from(text).map((character) => `░${character}`).join("") + "░",
        (text) => Array.from(text).map((character) => `[̲̅${character}]`).join("")
      ]
    },
    {
      name: "Tiny & Reversed",
      styles: [
        (text) => reverseTransform(text, upsideDownMap),
        (text) => reverseTransform(text, mirrorMap),
        (text) => replaceCharacters(text, subscriptMap),
        (text) => replaceCharacters(text, superscriptMap)
      ]
    },
    {
      name: "Glitch & Symbols",
      styles: [
        zalgo,
        ...Array.from({ length: 6 }, (_unused, profileIndex) => (text) => denseGlitch(text, profileIndex)),
        (text) => decorate(text, "\u0489"),
        (text) => decorate(text, "\u0334"),
        (text) => decorate(text, "\u0333"),
        (text) => decorate(text, "\u033e"),
        (text) => decorate(text, "\u034e"),
        (text) => decorate(text, "\u033d\u0353"),
        (text) => Array.from(text).join("♥")
      ]
    },
    {
      name: "Fullwidth Decorations",
      styles: [
        (text) => `${transform(text, alphabets.fullwidth)}　゠ ゴ`,
        (text) => `${transform(text, alphabets.fullwidth)}　（゠ ゴ）`,
        (text) => `【﻿${transform(text, alphabets.fullwidth)}】`
      ]
    }
  ];

  const resizeOutput = (output) => {
    output.style.height = "auto";
    output.style.height = `${Math.max(208, output.scrollHeight + 2)}px`;
  };

  const updateResults = (root) => {
    const text = root.querySelector("[data-fancy-text-input]")?.value || "";
    root.querySelectorAll("[data-fancy-text-output]").forEach((output, index) => {
      output.value = categories[index].styles.map((style) => style(text)).join("\n\n");
      resizeOutput(output);
    });
  };

  const legacyCopy = (text) => {
    const temporary = document.createElement("textarea");
    temporary.value = text;
    temporary.setAttribute("readonly", "");
    temporary.style.position = "fixed";
    temporary.style.left = "-9999px";
    temporary.style.opacity = "0";
    document.body.appendChild(temporary);
    temporary.focus();
    temporary.select();
    temporary.setSelectionRange(0, temporary.value.length);
    let copied = false;
    try {
      copied = typeof document.execCommand === "function" && document.execCommand("copy");
    } catch (_error) {
      copied = false;
    }
    temporary.remove();
    return copied;
  };

  const copyOutput = async (button, output) => {
    let copied = legacyCopy(output.value);
    if (!copied && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(output.value);
        copied = true;
      } catch (_error) {
        copied = false;
      }
    }
    const original = button.textContent;
    button.textContent = copied ? "Copied" : "Select & copy";
    if (!copied) {
      output.focus();
      output.select();
    }
    window.setTimeout(() => { button.textContent = original; }, 1200);
  };

  const createGenerator = () => {
    const root = document.createElement("section");
    root.className = "fancy-text-generator";
    root.dataset.fancyTextGenerator = "";
    root.innerHTML = `
      <h2 class="fancy-text-heading">Fancy Text Generator</h2>
      <p class="fancy-text-description">Type once, then copy a Unicode style from any category below.</p>
      <label class="fancy-text-input-label" for="fancyTextInput">Your text</label>
      <textarea id="fancyTextInput" class="fancy-text-input" data-fancy-text-input rows="2" placeholder="Type something fancy…" spellcheck="true"></textarea>
      <div class="fancy-text-results"></div>
    `;

    const results = root.querySelector(".fancy-text-results");
    categories.forEach((category, index) => {
      const card = document.createElement("div");
      card.className = "fancy-text-category";
      card.innerHTML = `
        <div class="fancy-text-category-header">
          <label class="fancy-text-category-label" for="fancyTextOutput${index}">${category.name}</label>
          <button type="button" class="fancy-text-copy">Copy all</button>
        </div>
        <textarea id="fancyTextOutput${index}" class="fancy-text-output" data-fancy-text-output readonly aria-label="${category.name} styles"></textarea>
      `;
      card.querySelector(".fancy-text-copy").addEventListener("click", (event) => {
        copyOutput(event.currentTarget, card.querySelector("textarea"));
      });
      results.appendChild(card);
    });

    root.querySelector("[data-fancy-text-input]").addEventListener("input", () => updateResults(root));
    updateResults(root);
    return root;
  };

  const mount = () => {
    const editor = document.querySelector(".gallery-editor");
    if (!editor || editor.querySelector("[data-fancy-text-generator]")) return;
    editor.appendChild(createGenerator());
  };

  new MutationObserver(mount).observe(document.getElementById("main"), { childList: true, subtree: true });
  mount();
})();
