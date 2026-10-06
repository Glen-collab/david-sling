# David: The Shepherd's Sling — Story & Level Bible

> Working document. Each world gets locked before anything for it is built.
> **Look:** 16-bit-era pixel art (Super Nintendo era: richer colour and detail), **not** 8-bit NES art. **Controls:** NES-style (D-pad, A, B, Select, Start).

> Status: **Worlds 1–6 drafted for review; sprite checklist in [SPRITES.md](SPRITES.md); creatures & Field Guide added; The One and The Song threads, and the SMB3-style map, added. Art prompts in [ART_PROMPTS.md](ART_PROMPTS.md).** Worlds 2–8 are outlines only.

---

## 1. The heart of the game

**Theme:** God prepares David in the quiet places long before the world sees him.

**The education promise:** the player learns *what David learned, while doing what David did*. Every lesson the game teaches is one the player is about to use. A mentor says "a shepherd counts his flock every evening," and the next stretch of level is about finding the sheep that are missing. Scripture and facts are never a wall of text before the fun. They are the reason the next thing works.

**Tone:** warm, brave, a little funny (the brothers), never preachy. Violence stays clean, like classic Nintendo games: enemies are knocked out, run off, or fade away. No blood.

---

## 2. Rules that keep the game fair

These rules come straight from what went wrong in Rainbow Unicorn Quest.

1. **Damage never takes a move away.** David has hearts, not a small and big form. A hit costs a heart. It never costs a jump height or an ability. If you can reach a ledge when you enter a stage, you can still reach it after any number of hits.
2. **No soft-locks.** Every stage can be finished using only the moves David has when he enters it. Moves learned later only open *optional* secrets, seen when you replay a stage.
3. **Required jumps have slack.** No required jump uses more than about 85% of David's real jump. Pixel-perfect jumps belong in optional secret routes only.
4. **No dead ends without a way back.** If a drop can't be climbed back up, either the route goes forward or there's a ladder, vine, or rope.
5. **Campfire checkpoints** in the middle of every stage, plus one before every boss.
6. **The plain stone never runs out.** Special stones are bonuses, never required.
7. **Build check:** the game will ship with a script that checks every required gap and ledge against David's physics, so rule 3 is tested and not just hoped for.

---

## 3. How the teaching works

Five layers, from always-on to fully optional:

| Layer | What it is | Can you skip it? |
|---|---|---|
| **Campfires** | Checkpoints. At some of them the **Sage** (or a brother) is sitting by the fire. Walk up and press A to hear 2–4 short lines. | Yes. Just walk past. |
| **Family & people** | Brothers, Jesse, villagers say one or two lines as you pass. Helping someone gives a reward (a shortcut, a heart, a hidden cache). | Mostly |
| **Scrolls** | One hidden scroll per stage. Each holds an NIV verse that ties to that stage. | Yes. They're collectibles. |
| **Shepherd's Journal** | Pause menu. Every scroll, fact and lesson you've found, plus your sheep count. It's the game's "museum". | Yes |
| **End-of-world reflection** | A short scene: one verse and one sentence on what David learned. | Can be skipped after you've seen it once |

### The Sage

> **Old Hanan, the shepherd of the hills** *(placeholder name; a made-up character, not from the Bible)*

An old shepherd who has kept sheep around Bethlehem all his life. He is the player's teacher, the way David was taught by the hills themselves. He doesn't preach. He tells you how things work, and the Bible lines up behind what he says.

- He appears at campfires through Worlds 1–3, then sends David off.
- He knows practical shepherd craft: slings, counting, predators, weather, water.
- He speaks the faith truths plainly but briefly, like a grandfather.
- In World 7, when Saul doubts David, David's answer repeats what Hanan taught and what David lived in World 1. The player hears it come full circle.

The made-up characters are always *labelled* as made up in the Journal. Bible facts are always given with their reference, so a kid never confuses the two.

### The brothers (from the Bible)

Jesse had eight sons. David was the youngest (1 Samuel 16:10–11, 17:12–14). The three eldest are named:

- **Eliab** (eldest): tall, proud, quick to mock. He scolds David at the battle in 1 Sam 17:28, so his attitude here is true to who he is. Teaches *humility* by being the opposite of it.
- **Abinadab** (second): steady, a bit of a joker. Gives practical tips.
- **Shammah** (third): kind, encouraging. The brother who believes in David.

The other four brothers aren't named in Samuel. They appear only as background family.

---

## 3b. Two threads through every world

### Thread 1 — The One (the lost sheep)

> "Suppose one of you has a hundred sheep and loses one of them. Doesn't he leave the ninety-nine in the open country and go after the lost sheep until he finds it?" — **Luke 15:4** (NIV)

Jesus told this parable about a thousand years after David. The game connects them honestly, through history:
- Jesus was born in **Bethlehem**, David's town (Luke 2:4). He was called the **Son of David** (Matthew 1:1).
- The shepherds who heard the angels at his birth were keeping watch over flocks in the **fields near Bethlehem** (Luke 2:8). These could be the same hills David is running across.
- Jesus called himself **the good shepherd** (John 10:11).
- Long after David, God promised: "I will place over them one shepherd, my servant David, and he will tend them" (Ezekiel 34:23). Christians read that as pointing to Jesus.

**In gameplay:**
- **Every one of the 32 stages hides "The One":** a single lamb, separate from the 5 normal lost sheep, always the hardest to reach. It's always optional (rule 2).
- Finding it plays a short sparkle and a tune, and adds one line to the Journal's **"The One" page**. Those lines read like a story told in pieces: from Bethlehem's fields, to David, to the good shepherd.
- **Every world also has a lost *person*,** someone overlooked or afraid, so the parable is about people, not just sheep:

| World | The lost one | Why it fits |
|---|---|---|
| 1 | a single lamb taken by the lion | David leaves the flock to go after the one (1 Sam 17:34–35) |
| 2 | the boy from Tekoa (made up), lost in a flash flood | David gets him out and takes him home |
| 3 | **David himself** | Not even invited. Samuel refuses to sit down until the overlooked youngest son arrives (1 Sam 16:11) |
| 4 | **King Saul** | Troubled and tormented; David's music reaches him (1 Sam 16:23) |
| 5 | Tobi, a frightened young scout (made up) | Hiding in a cave after hearing the giant; David gets him back to camp, and Tobi teaches him the double jump |
| 6 | the whole army | "all the Israelites…ran from him in great fear" (1 Sam 17:24) |
| 7 | (to decide) | |
| 8 | Israel | God saves the people through the least likely one |

- **Secret ending:** find all 32 of The One and, after the credits, a new scene unlocks: the same Bethlehem hills from World 1, **a thousand years later**, at night. Shepherds keep watch over their flocks, and the sky fills with light (Luke 2:8–14). Last line on screen: *"He will be called the Son of David."* It closes the whole thread without a single extra word of preaching.

**About real preachers and pastors:** there's a lot of great teaching on this parable, but **we can't put real pastors' sermons, names, voices or likenesses in the game without their written permission.** Two safe ways to bring that voice in:
1. **Our own words.** Hanan and the end-of-world reflections say it in the spirit of that teaching. (Most common points: the shepherd *goes* himself; he doesn't wait; he *rejoices* when it's found; every single one matters.)
2. **With permission.** If a pastor you know is willing, record a short reflection for the Journal's "The One" page, with their written OK and a credit.

### Thread 2 — The Song (David's harp)

David was a musician *before* he was a warrior or a king. The servant who recommends him to Saul lists music first: "a son of Jesse of Bethlehem who knows how to play the lyre. He is a brave man and a warrior…And the LORD is with him" (1 Sam 16:18).
- **Fact for the Journal:** the NIV says **lyre**, a small hand-held harp. Older Bibles say "harp". The game calls it **David's harp** with a Journal note. (Kids know the word "harp".)
- **Fact:** 73 of the Psalms are titled "of David". Psalm 23 sounds like it was written by someone who kept sheep, because it was.

**In gameplay:**
- **Select = play the harp.** One button, and what the song does grows with the story. It's never magic: it works the way music works on people and animals.

| From | What playing does |
|---|---|
| World 1 | **Gathers the flock.** Lost sheep within hearing come to David. (Replaces the whistle.) |
| World 1 | **Campfires:** sit and play to rest. Refills hearts. A small, quiet moment every stage. |
| World 2 | Calms nervous animals (a skittish donkey or goat that's blocking a path) |
| World 4 | **Soothes Saul.** The harp stage is a rhythm segment, B and A in time with the tune (1 Sam 16:23) |
| World 6 | Lifts the frightened soldiers. Afraid NPCs who block a path or hide will follow or help. |

- **"Psalm pieces":** a few stages hide a page of music. Each one adds a verse to Psalm 23 in the Journal and a new phrase to David's tune. Collect them all and David's full song plays over the **ending credits**.
- **The soundtrack** is built around one short melody, "David's song", heard first when he plays to the sheep in 1-1. It grows across the worlds and is the last thing you hear.

---

## 3c. Counsel & the Journal — wisdom is the power-up

> "Plans fail for lack of counsel, but with many advisers they succeed." — Proverbs 15:22
> "The way of fools seems right to them, but the wise listen to advice." — Proverbs 12:15

David doesn't get stronger from magic pickups. He gets **wiser** because he listens to the people around him, and in the game wisdom works like a key. The loop is **Listen → Learn → Use → Remember**.

### Listen
People give **counsel** at map spots, campfires and inside stages. Each person says **1–3 short lines**. A skips ahead, but the **key line is always shown**, so skimming never costs you the card.

### Learn: Counsel cards
Everything worth keeping goes into the Journal as a card:

| Card | What it does | Example |
|---|---|---|
| 📜 **Verse** | Journal entry; counts toward the world's page | Psalm 23:4, from Hanan's campfire |
| 🗝️ **Secret** | Puts a **?** on a stage's map dot and a faint marker in the stage | Abinadab: "Sheep like to hide by the old fig tree in 1-3." |
| 👁️ **Warning** | Makes a boss or tough enemy **easier to read** (see "Counsel softens the fight") | Hanan: "A lion crouches and flicks its tail twice before it pounces." |
| 🧭 **Story key** | Opens a story gate | Jesse's grain, bread and cheese for the brothers (1 Sam 17:17–18) gets you into the army camp in World 5 |
| 🎓 **Skill** | A new move, *taught by someone* | Shammah teaches the roll in 1-3 |

### Use: counsel softens the fight
**Ignoring advice makes the game harder. Listening makes it gentler. A skilled player can still beat everything with no counsel at all.**

The game's base difficulty is the *skilled* version: fair, readable, beatable with good timing. Counsel layers help on top:

| Counsel heard | What changes in the boss fight (Lion example) |
|---|---|
| **None** | Base fight. Tells are there but subtle (tail flicks twice, 0.5 s before the pounce). Fair for skilled players. |
| **Tier 1:** the Warning card | The tell **glows** (the tail-flick flashes gold) and lasts a bit longer (+0.15 s). |
| **Tier 2:** go back after losing | Only given *after you've lost to that boss at least once* and go back to ask. The dazed window lasts +0.5 s, the roar shockwave is shorter, and you get **+1 heart for this fight**, a "word of encouragement". |

**Tier 2 is the heart of it:** humbling yourself to go back and ask for help after failing. Hanan's tier-2 line starts with *"Sit down. Tell me what happened."*

**Making "go back" easy, not a chore:**
- After a boss loss, the retry screen has two choices: **Try again** / **Go to Hanan** (or whoever holds the advice). One button press, no long walk.
- After **3 losses** to the same boss, that person's map dot **pulses**, a gentle nudge, never a forced stop.
- For bosses whose counsellor isn't at the campfire just before the arena, "Go to …" drops you at that person's map spot, and the return trip is one press too.

**For experts:** a post-game **"Shepherd's Trial"** replays every boss with no counsel bonuses. (Name to be decided.)

All counsel numbers live in one tuning table in the code, so "make the lion easier for listeners" is a one-number change.

### Remember: the Journal
- **After every stage:** David writes 2–3 lines in his Journal about what happened, plus the verse that fits. (Labelled *David's Journal, imagined*. Verses and references stay exact.)
- **After every world:** a longer entry, and a **gift from someone** (below).
- **Journal pages:** Verses · Secrets · Warnings · People met · The One · Psalm pieces · Real map.

### Gifts from people, not superpowers
| Kind | Example | Effect |
|---|---|---|
| A skill someone teaches | Hanan / Shammah teach the roll, the long-shot wind-up (charged sling), the flip | Moves exist, but someone taught them to David. No magic. |
| A gift of gear | Jesse's water skin; Shammah's sling pouch | Small, believable boosts: +1 heart, a slightly faster reload |
| Trust | The shepherd girl's shortcut; a soldier opens the back way into camp | New routes on the map |

**The message: David didn't become David alone.**

### The payoff at Goliath
Everyone you helped or listened to **appears on the Israelite hillside** in the final fight: Hanan, Shammah, the shepherd girl, the soldier you got home. More people met = a bigger crowd. It doesn't make the fight easier. But when Goliath taunts, short lines from them flash up: *"Remember the lion."* *"The battle is the LORD's."*

---

## 3d. Creatures & dangers — what a shepherd watches for

Every enemy and hazard is something a real shepherd in ancient Judah had to deal with. Most predators are **driven off**, not killed: hit a wolf and it yelps and runs. That keeps the game kid-friendly and true to the job: a shepherd's goal is a safe flock, not a body count.

### 1. Predators that go after the flock
| Animal | Real behaviour | Game role | First seen |
|---|---|---|---|
| **Fox** | Small, quick, opportunistic | Fast nuisance; runs at the sheep in your line | 1-2 |
| **Raven** | Bold, steals food | Dives at you on open ground | 1-3 |
| **Jackal** | Scavenger, steals lambs | Darts in, grabs a lamb and runs. Chase it down and hit it to make it drop the lamb. | 1-4 |
| **Wolf** | Hunts in packs at dusk | Packs circle and try to cut a sheep off from the line. Hit = yelp and run off. | 2-4 |
| **Eagle** | Large eagles can carry off a lamb | Circles, then dives at the back of your line. Hit it before it lifts off, or chase the shadow. | 2-3 |
| **Wild boar** | Charges; the Bible mentions "boars from the forest" (Psalm 80:13) | Tap shots bounce off; a charged shot stops it | 2-1 |
| **Striped hyena** | Real in Israel; comes out at night | Night stages only. **Laughs before it attacks**, a built-in warning sound. | World 5 |
| **Leopard** | Lived in Judah; the prophets mention it (Jeremiah 5:6, Hosea 13:7) | A **mini-boss stalker** that climbs trees and drops from above | World 5 |
| Lion · Bear · Wild ox | | World bosses | 1, 2, 3 |

### 2. Shepherd's Judgment — dangerous or harmless?
**Some creatures look scary but are harmless, or even helpful. A good shepherd looks before he throws.**

| Dangerous: sling it | Harmless: leave it alone | Why leaving it pays off |
|---|---|---|
| 🐍 **Palestine viper**, the real venomous snake of the region: fat body, **wide triangle head**, tan with a dark zigzag, coils and puffs up before striking | 🐍 **Whip snake**: long, slim, plain dark, narrow head, fast. Harmless to people. | It **eats the rats**. A whip snake left alone clears a rat-blocked path or granary. |
| 🦂 **Yellow scorpion**, one of the most dangerous scorpions in the world | 🦔 **Hedgehog**: slow, round, harmless | It **eats scorpions**. Leave it, and a scorpion nest ahead is cleared. |
| 🐝 **Hornet nest**: grey papery ball, angry buzz. Knock it down and it scatters. | 🐝 **Honeybee hive**: in a rock crack or hollow tree, golden comb, calm hum | Leave it and you can **collect honey** at the end (+1 heart). Knock it down and that's gone. |
| | 🐢 Tortoise · 🦎 chameleon · ibex · rock hyrax · gazelle · stork · owl · sheepdogs · other people's sheep | A tortoise you didn't hit becomes a **stepping stone** across a stream. Others just add to your Care score. |

**Scoring:** sparing harmless creatures earns points. Hitting one **never costs a life**. It lowers that stage's **Shepherd's Care** rating. Keep doing it and Hanan has a word with you: the righteous care for the needs of their animals (**Proverbs 12:10**).

**They must look clearly different in pixel art.** Each dangerous/harmless pair is designed side by side so the difference reads at a glance (shape first, colour second, a behaviour tell third, e.g. the viper coils and puffs up, the whip snake just slides past). The first time you meet each one, someone points out how to tell them apart.

### 3. The Field Guide (Journal page)
The first time you see any creature, it's added to the Journal's **Field Guide** with its pixel portrait, its real name, whether it's dangerous, how to tell it apart, and one real fact. Example:

> **Whip snake** · *harmless* · Long, thin, dark, narrow head. Fast. Eats rats and mice, so farmers were glad to have one around the barn. Don't confuse it with the viper: look at the head.

Filling in every creature is a collection goal of its own.

### 4. Dangers to the sheep themselves (shepherd chores)
| Chore | What happens | How you fix it | Why it's real |
|---|---|---|---|
| **Cast sheep** | A sheep rolls onto its back and can't get up. It can die if nobody helps. | Walk to it, press ↓ to roll it back onto its feet. | A real danger for heavy sheep. Pastors often connect it to "Why, my soul, are you downcast?" (Psalm 42:5), from Phillip Keller's book *A Shepherd Looks at Psalm 23*. |
| **Flies** | A swarm pesters some sheep; they shake their heads and slow the whole line. | Rub **oil** on their heads (pick up an oil flask, press ↓ at the sheep). | Shepherds put oil on sheep's heads to keep insects off. Keller ties it to "you anoint my head with oil" (Psalm 23:5). An echo of David's own anointing in World 3. |
| **Poisonous plants** | Oleander grows along dry riverbeds and is toxic to livestock. Sheep wander toward it. | Steer the line around it; play the harp to call them off. | True: oleander is poisonous to animals. |
| **Thorns** | A sheep's wool catches in a thorn bush and it's stuck. | Clear the thorns with the sling. | |
| **Pits and crevices** | A sheep falls in. | Find a way down or lower a rope. | Jesus mentions a sheep fallen into a pit (Matthew 12:11). |

### 5. Thieves and raiders
- **Rustlers** sneak in to steal sheep. Jesus speaks of the thief who comes to steal (John 10:10). Hit them and they drop the sheep and run. They're scared off, never "killed."
- **Philistine raiders** in Worlds 5–6.

### 6. Helpers
- **Sheepdogs** (the Bible mentions dogs guarding flocks, Job 30:1). In some stages a dog helps keep your line together and barks when a predator is near.
- **Other shepherds** who need a hand: helping them is counsel and trust (§3c).

### 7. Stage score (shown at the fold)
| Score line | |
|---|---|
| Sheep saved | out of 5 |
| The One | found or not |
| Predators driven off | |
| Creatures spared | harmless animals left alone |
| Chores done | cast sheep righted, flies oiled, thorns cleared |
| **Shepherd's Care** | a rating (★ to ★★★), built from the lines above |

The score gives skilled players something to chase on replays. It never blocks progress.

### Where creatures appear
| World | New creatures and chores |
|---|---|
| 1 Fields | viper vs **whip snake**, fox, raven, jackal, **cast sheep**, thorns |
| 2 Wilderness | boar, wolves, eagle, scorpion vs **hedgehog**, hornets vs **bees**, oleander, tortoise |
| 3 Bethlehem | rats (whip snake helps), crows, stray dogs, **rustlers**, **flies (oil the sheep)** |
| 4 Court | few animals; palace dogs, guards |
| 5 Road | **hyena** (night), **leopard** stalker, raiders |
| 6–8 Elah | Philistine soldiers, plus vipers and scorpions in the streambed |

---

## 4. Controls & moves

NES layout: **D-pad, A, B, Select, Start.**

| Input | Move | Learned |
|---|---|---|
| ← → | Walk / run (run builds up with momentum, Mario style) | 1-1 |
| A | Jump (hold for higher) | 1-1 |
| B | Sling throw: forward, **↑ = up, ↗ = diagonal** | 1-1 |
| ↓ + A while running | **Roll:** short dodge, passes under low gaps, brief no-damage window | 1-3 |
| Select | **Play the harp:** lost sheep within hearing come to David; at campfires, rest and refill hearts (see Thread 2) | 1-2 |
| Hold B, release | **Charged sling** | World 2 |
| A at the top of a jump, after a roll | **Aerial flip** | World 3 |
| A in mid-air | **Double jump** | World 5 |

**Lost sheep:** each stage hides 5 lost sheep. Found sheep follow behind David in a line. If David gets hit, they scatter a few tiles and wait (they never vanish). Bring them to the fold at the end of the stage. The running total is shown in the Journal. Finding all of them in every stage is the 100% goal. (They do not cost you anything if you skip them.)

---

## 4b. The overworld map (Super Mario Bros. 3 style)

Between stages, David walks a small map, one per world. The map is how the player sees the journey from Bethlehem to the Valley of Elah.

- **Controls on the map:** D-pad moves David along the path; **A** enters a dot; **Start** opens the Shepherd's Journal.
- **Each map has:** 4 stage dots, 2–3 story or rest dots, and the boss (inside the last stage dot, like SMB3's castle).
- **Cleared stages stay open.** Walk back to any cleared stage to replay it. That's how you fetch The One lambs that need a later move (rule 2).
- **Map dots that aren't stages:**
  - 🏠 **Home / story spot:** a short scene (Jesse's house, Samuel's arrival, the palace gate).
  - 🔥 **Hanan's campfire:** rest, play the harp (refill hearts), read the Journal, hear an optional teaching.
  - 🙋 **Someone who needs help:** a small favour; the reward is a heart, a shortcut, or a hint.
  - ✨ **Bonus spot:** opens when you've found every lost sheep in that world. A short bonus area with a Psalm piece.
- **A path in the map opens with each cleared stage,** drawn as a dotted line filling in, as in SMB3.
- **The Journal's "real map" page** shows the true places (Bethlehem, the wilderness of Judah, Gibeah, the Valley of Elah). Distances will be checked before they go in.

### World 1 map — The Shepherd's Fields
Golden grass hills, olive trees, stone walls, the village of Bethlehem on its hill in the top-left corner.

```
 [🏠 Jesse's house] ──> (1-1) ──> [🔥 Hanan] ──> (1-2)
                                                   │
 [✨ Hidden meadow] <── (1-3) <── [🙋 Shepherd girl]┘
        │                 │
        └─────────────> (1-4 🦁 Lion's den)
```

| Dot | What's there |
|---|---|
| 🏠 Jesse's house | Start. Opening scene. Later: brothers' lines change as you progress. |
| 1-1 | The Hills of Bethlehem |
| 🔥 Hanan | Hanan's camp. Rest and Journal. |
| 1-2 | The Wandering Flock |
| 🙋 Shepherd girl | *(made up)* Her goat is stuck up a rock. Knock down the thornbush with your sling → she shows you the shortcut to 1-4. |
| 1-3 | The Rocky Pastures |
| ✨ Hidden meadow | Opens when all of World 1's sheep are found. Bonus area + a Psalm 23 piece. |
| 1-4 🦁 | The Lion's Territory, with the Lion at the end. The dot is a cave mouth with two eyes glowing in it. |

---

## 5. World 1 — The Shepherd's Fields *(DRAFT FOR REVIEW)*

**Bible:** 1 Samuel 16:11 (David "tending the sheep"), 17:34–37 (the lion and the bear), Psalm 23.
**Setting:** the hills around Bethlehem in Judah. Dry grass, limestone, olive trees, stone sheepfolds. Day → evening → night across the four stages.
**David learns:** to move, to sling, to care for the flock, and that faithfulness in small things matters.
**Enemies:** viper (pops out of rocks), fox (runs at the flock), raven (dives at you), jackal (stage 4 only). **Harmless:** whip snake. **Chores:** cast sheep, thorns. (See §3d.)

### Opening scene (before 1-1)
Four short screens, no more:

1. *Bethlehem. A small town in the hills of Judah.*
2. Jesse's house at dawn. Seven older brothers sit at breakfast. A small figure is already out the door with a sling on his belt and a harp on his back.
3. A hillside. David sits on a rock playing to the flock. **First time we hear David's song.**
4. *The youngest son of Jesse kept his father's sheep.* Title card: **WORLD 1 — THE SHEPHERD'S FIELDS**

### 1-1 · The Hills of Bethlehem — *learn to move and sling*
- **Level teaches:** run, jump, hold-to-jump-higher, then the sling. No text tutorials. The layout teaches. The first gap is so small you can't fail it. Then a ledge needs a held jump. Then a rock wall with a gourd on top you can only knock down with B.
- **Eliab** is leaning on a wall at the first slope: *"Still playing with that sling, little brother? Sheep don't need a warrior. They need a babysitter."* (Sets up his character. The joke's on him later.)
- **Shammah** at the gourd wall: *"Ignore him. Watch — aim with Up and you can hit the high ones."* That's the aiming tutorial, delivered by a brother.
- **Campfire (checkpoint):** **Old Hanan, first meeting.**
  > "You're Jesse's youngest? I've seen you practice with that sling. Good. A shepherd who can't defend his sheep is just a man standing in a field."
  > "Did you know the men of Benjamin could sling a stone at a hair and not miss? Seven hundred of them. It's in the Book of Judges."
  > "That doesn't happen by luck. It happens one stone at a time."
  - *Journal fact unlocked:* **Judges 20:16** — the slingers of Benjamin. (NIV: "...each of whom could sling a stone at a hair and not miss.")
- **Second half:** first vipers. Learn to sling them from a distance instead of jumping over them.
- **First Shepherd's Judgment:** a **whip snake** slides across the path right after the first viper. Shammah: *"Not that one! The thin dark ones don't hurt anybody. They eat the rats. Look at the head."* Hitting it lowers your Care score; leaving it alone, it slides into a rat hole and the rats blocking a ledge scatter. Both snakes go into the **Field Guide**.
- **Scroll:** behind a bush on a high ledge → **Psalm 23:1** "The LORD is my shepherd, I lack nothing."
- **End of stage:** the family sheepfold. Sheep counted in.

### 1-2 · The Wandering Flock — *learn to care for the flock*
- **Story:** morning count. Five sheep are missing.
- **Campfire at the start: Old Hanan:**
  > "First thing every morning and last thing every night — count them. A good shepherd knows every one."
  > "Sheep know their shepherd's voice. And they know your song — I hear you playing to them every evening."
  > "Play. The lost ones will come to it."
  - Teaches the **harp (Select)** right before you need it.
  - *Journal fact:* shepherds counted the flock as it passed "under the rod" (Leviticus 27:32). *Proverbs 27:23*: "Be sure you know the condition of your flocks."
- **Level:** wider, more open hills with branching paths. Each lost sheep is stuck somewhere: on a ledge, behind a thornbush you clear with the sling, across a gully. Playing the harp nearby brings it to you.
- **Foxes** run at the sheep behind you. Your job is to protect the line, not just yourself.
- **First chore: a cast sheep.** One sheep is stuck on its back, legs in the air. Hanan, at the start-of-stage fire: *"A sheep on its back can't get up by itself. Leave it and it dies. Roll it over."* Press ↓ next to it. (Journal: cast sheep and Psalm 42:5.)
- **Abinadab** is resting at the midpoint: *"You're actually going after all of them? For one sheep? ...Huh. Dad would do the same."*
- **End of stage, Hanan at the fold:** introduces The One (Thread 1).
  > "Ninety-nine safe in the fold, and you'd still go back out for one. Good."
  > "Some day someone from this very town will tell a story about that. Mark my words — every one matters."
  - Journal: the **"The One" page** opens with Luke 15:4, clearly labelled *Jesus' parable, told about a thousand years after David.*
- **Scroll:** **Luke 16:10** "Whoever can be trusted with very little can also be trusted with much."
- **The One:** this stage's hidden lamb is in a cave you can only reach by rolling. You come back for it after 1-3 teaches the roll, so the player learns early that The One sometimes needs a return trip. (Optional. Rule 2.)

### 1-3 · The Rocky Pastures — *learn the roll; cliffs and hidden paths*
- **Level:** limestone ridges and caves. Crumbling ledges (they shake, then fall), **rope bridges** that sway, low cave passages.
- **The roll is taught by need:** a cave mouth too low to walk through, with a sheep on the far side. Shammah is nearby: *"Get low and tuck — like when we were kids rolling down the hill."*
- **New threat: a wild ram** charging along a ledge. It can't be stopped with stones. You roll under its charge. (Teaches the roll as a *dodge*, which the lion fight needs.)
- **Ravens** dive at you on open cliff tops. A diagonal shot is practical here.
- **Campfire: Old Hanan:**
  > "The hills are full of caves. David — some day, you may need to hide in one."
  - (Quiet foreshadowing of David hiding from Saul later in life: 1 Samuel 22 & 24. The Journal notes this when found.)
  > "Water is life out here. Know where every spring is."
- **Hidden path:** a fake rock wall leads to a cave shortcut with a heart refill. Shown first by a small crack and a bird flying out of it, which teaches "look for secrets."
- **Scroll:** **Psalm 121:1–2** "I lift up my eyes to the mountains — where does my help come from? My help comes from the LORD, the Maker of heaven and earth."

### 1-4 · The Lion's Territory — *everything so far, at night*
- **Mood:** dusk into night. Music drops to a low pulse. Moonlit blue palette.
- **Foreshadowing:** the **lion is visible in the background layer**, padding along the far ridge, stopping, watching. Never touchable. Every so often a distant roar, and the sheep in your line bunch together.
- **Enemies:** jackal packs (2–3 come in fast, one at a time), vipers in the dark (they flash when their eyes catch the moonlight), ravens.
- **Darkness mechanic (light):** sections lit only by moonlight through clouds. Clouds pass and some platforms go dark for a few seconds. The timing is always readable. It's never pitch-black on a required jump (rule 3).
- **Campfire: Old Hanan, last fire of World 1:**
  > "You hear it? He's been following the flock for three nights."
  > "When I was young I ran from a lion once. I lost a lamb that night. I've never forgotten it."
  > "You don't have to be the strongest thing in the hills, David. You have to trust the One who made the hills."
  - *Journal:* **Psalm 23:4** "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me."
- **Scroll:** **Joshua 1:9** "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go."
- **Stage ending:** David reaches the fold. A scream from the flock — **the lion has taken a lamb** and runs off into the rocks. David goes after it (this is exactly 1 Sam 17:34–35). A last campfire, then the boss arena, **still inside stage 1-4** (like Mario's castle in 1-4). The boss is not a separate stage.

### BOSS · The Lion (end of 1-4)
**Faithful to the text:** a lion took a sheep, David went after it and rescued the sheep from its mouth, and when it turned on him he struck it down (1 Samuel 17:34–35). The fight follows that order: **rescue first, then defend.**

**Arena:** a rocky moonlit hollow, about 1½ screens wide, with two raised rocks for high ground and a low overhang only rollable under.

**Phase 1 — The Chase.** The lion has the lamb in its mouth and keeps away from you, leaping between rocks.
- Hit it 3 times with the sling. On the third hit it drops the lamb, which runs to the safe side of the arena.
- The lion doesn't attack yet. It only runs and snarls. This is the player learning to hit a moving target.

**Phase 2 — The Lion Turns.** It roars: the screen shakes and the music kicks in. Now it hunts *you*.
- **Pounce:** tell = it crouches low and its tail flicks twice. → **Roll** under it or jump to the high rock. After it lands it's **dazed for a moment**: the window to hit it.
- **Swipe:** tell = it raises a paw. Short range. → back off or jump.
- **Roar:** tell = it rears up its head. A shockwave ripples along the ground. → be in the air when it hits.
- 5 hits during dazed windows end the phase. Hits at other times are blocked/shrugged off: you see the stone bounce.

**Phase 3 — Last Stand (short).** Faster pounces, back to back, and a double swipe. 3 more hits. The final hit plays a slow-motion freeze frame, a white flash, and the lion slumps and fades. (No gore. The text says David killed it, and it is clearly beaten, but it's kid-clean.)

**Fairness notes:** the lamb is never in danger during phases 2–3 (it's safe on its side), so the player never feels punished twice. A campfire checkpoint is right before the arena. Phase 1 restarts if you die, but it's short.

### End of World 1 — reflection scene
1. David carries the lamb home on his shoulders under the stars (the way the shepherd in Luke 15:5 carries the found sheep home). The flock follows.
2. Old Hanan at the gate of the fold, sees the lamb, says one line:
   > "The lion was bigger than you. It always will be. Remember who stood with you tonight."
3. Verse on screen: **1 Samuel 17:37** "The LORD who rescued me from the paw of the lion and the paw of the bear will rescue me from the hand of this Philistine."
   Caption: *David will say these words to King Saul years from now. Tonight is where they begin.*
4. David sits at the fold's gate and plays. David's song, a little fuller than in 1-1.
5. World code shown (as in Unicorn). **Unlock:** a 4th heart ("a shepherd's courage").

> **World 6 callback:** when David tells Saul about the lion (1 Sam 17:34–37, end of World 6), the game shows a pixel replay of *this exact fight* the player won.

### World 1 — summary table
| Stage | New thing | Sheep | People | Scroll |
|---|---|---|---|---|
| 1-1 | run, jump, sling, aim up | 5 + The One | Eliab, Shammah, **Hanan** | Psalm 23:1 |
| 1-2 | Harp (Select), protecting the line, The One introduced | 5 + The One | **Hanan**, Abinadab | Luke 16:10 |
| 1-3 | Roll, crumbling ledges, rope bridges, secrets | 5 + The One | Shammah, **Hanan** | Psalm 121:1–2 |
| 1-4 | Darkness, jackal packs, the lion watching | 5 + The One | **Hanan** | Joshua 1:9 |
| 1-4 end | **Boss:** the Lion: rescue, then defend | lamb | — | (reflection: 1 Sam 17:37) |

### World 1 — who gives what
| Where | Person | Card | Gift / effect |
|---|---|---|---|
| 1-1 | Shammah | 🎓 Skill: aiming up | |
| 1-1 campfire | Hanan | 📜 Judges 20:16 (the slingers of Benjamin) | |
| Map: 🔥 Hanan | Hanan | 🗝️ Secret: "There's a lamb in a low cave in 1-2. You'll need to get low to reach it." | Rest + harp |
| 1-2 | Hanan | 🎓 Skill: the harp gathers sheep · 📜 Proverbs 27:23 | |
| 1-2 | Abinadab | 🗝️ Secret: the old fig tree in 1-3 | |
| Map: 🙋 Shepherd girl | Shepherd girl *(made up)* | 🗝️ Secret: the dry cave below the cliff in 1-4 (The One) | Trust: shortcut to 1-4 |
| 1-3 | Shammah | 🎓 Skill: the roll | |
| 1-3 campfire | Hanan | 👁️ Warning: the wild ram charges in a straight line, so roll under it · 📜 Psalm 121:1–2 | |
| 1-4 campfire | Hanan | 👁️ Warning (tier 1): the lion's tail-flick · 📜 Psalm 23:4 | Tier 2 after a loss: +1 heart for the fight, longer dazed window |
| End of World 1 | Jesse | | **Gift:** Jesse's own old sling, a family heirloom (slightly faster reload) |


**Sprite list for this world:** [SPRITES.md](SPRITES.md#world-1--the-shepherds-fields)

---

## 5b. World 2 — The Wilderness *(DRAFT FOR REVIEW)*

**Bible:** 1 Samuel 17:34–36 (the bear). Also 17:28, where Eliab sneers, "with whom did you leave those few sheep in the wilderness?" David really did keep the flock out in the wilderness.
**Why David is out here:** in the dry summer the grass near Bethlehem runs out, so shepherds moved their flocks to find pasture and water. Hanan leads David and the flock east and up into the wild country.
**Setting:** the real wilderness of Judah is not a jungle. It's wooded hill country that gives way to dry ravines (*wadis*), cliffs and hidden springs. The four stages follow that: woods → dry riverbed → cliffs and springs → a wooded ravine where the bear lives.
**David learns:** the **charged sling** (taught by Hanan), patience, and how to read the land.
**Enemies:** wild boar (Psalm 80:13 mentions "boars from the forest"), wolves, eagles, hornet nests, yellow scorpions in the dry stretches. **Harmless:** hedgehog, honeybees, tortoise, ibex (wild goats), rock hyraxes. **Hazard:** oleander. (See §3d.)

### World 2 map
Wooded hills in the west, a dry wadi cutting through the middle, cliffs and a waterfall spring in the east, a dark wooded ravine at the end.

```
 [🏠 Summer camp] ──> (2-1) ──> [🔥 Hanan] ──> (2-2)
                                                 │
 [✨ Spring pool] <── (2-3) <── [🙋 Tekoa road]──┘
        │               │
        └───────────> (2-4 🐻 Bear's ravine)
```

| Dot | What's there |
|---|---|
| 🏠 Summer camp | Start. Tents, stone pens, the flock. Opening scene. Abinadab is here. |
| 2-1 | The Forest Trail |
| 🔥 Hanan | Rest, Journal, counsel |
| 2-2 | The Dry Riverbed (flash flood) |
| 🙋 Tekoa road | Take the lost boy home to his father. Trust: shortcut to 2-4. |
| 2-3 | The High Cliffs |
| ✨ Spring pool | Opens when all World 2 sheep are found. A bonus stage at a waterfall pool, plus a Psalm piece. |
| 2-4 🐻 | The Bear's Ravine, with the Bear at the end |

### Opening scene
1. *Summer. The grass around Bethlehem has dried up.*
2. Hanan, David and the flock walking east into the hills at dawn. Hanan: *"The flock goes where the grass is. So do we."*
3. Title card: **WORLD 2 — THE WILDERNESS**

### 2-1 · The Forest Trail — *learn the charged sling*
- **Level:** oak and pine woods on steep hills. Higher platforms in the branches, fallen logs, **swinging vines** over ravines (grab with ↑, jump off with A).
- **The charged sling is taught by need:** a **dead branch** across the path is too thick to break with tap shots. Stones just bounce off.
- **Campfire, Hanan teaches it:**
  > "You throw like a boy in a hurry. Let it swing. Longer. Feel it pull."
  > "Patience puts the power in the stone."
  - 🎓 **Skill: charged sling** (hold B, release). A full charge flies flatter and farther, breaks dead branches and cracked rocks, and stuns big animals.
- **Wild boars** charge along the ground. Tap shots bounce off their heads; one charged shot stops them. This teaches *when* to charge, not just how.
- **Hornet nests** hang from branches. Knock one down onto a boar to clear the path, or just steer clear.
- **Hornets vs bees:** a **honeybee hive** sits in a hollow oak near a hornet nest. Abinadab: *"Grey paper ball, knock it down. Golden comb, leave it. Honey later."* Leave the hive and you collect honey at the end of the stage (+1 heart).
- **Abinadab** at the start of the stage: *"Wild pigs out here. Don't try to out-run them — they're faster than you look."* plus 🗝️ Secret: *"There's a cave behind the falls in 2-3. Found it when I was your age."*
- **Scroll:** **Psalm 1:3** "That person is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither — whatever they do prospers."
- **The One:** a lamb up in the treetops, reached by chaining two vine swings. It's out of reach unless you ride the swing to full height.

### 2-2 · The Dry Riverbed — *the flash flood*
- **Level:** a dry, rocky wadi in the sun. Scorpions under rocks, vultures circling. Halfway through, the sky darkens far away and a low rumble starts.
- **Scorpion vs hedgehog:** a nest of yellow scorpions blocks a low passage. A **hedgehog** trundles toward it. Leave the hedgehog alone and it clears the nest; hit it and you have to deal with the scorpions yourself.
- **Oleander:** pink-flowered bushes along the riverbed. Sheep in your line drift toward them; steer around, or play the harp to call them back. (Journal: oleander is poisonous to livestock.)
- **Tortoise:** sitting in a shallow pool. Leave it and it becomes a stepping stone.
- **Campfire (midway), Hanan:**
  > "Rain in the hills miles away can fill this riverbed in moments. When you hear it, climb. Don't stop to look."
  - 📜 Journal fact: wadis are dry valleys that flood suddenly after rain falls far away. A real danger in the wilderness, even under a clear sky.
- **Set piece: the flood.** The second half is an **auto-scrolling escape**. Water rises behind you from the left, and you run and climb to the right on boulders, logs and ledges. The scroll speed is generous (rule 3). This is the world's "run for your life" moment.
- **The lost one — the boy from Tekoa** *(made up; Tekoa is a real town a few miles south of Bethlehem)*. He's stranded on a rock in the riverbed, separated from his family. You reach him just before the water. After that he **follows you like a sheep** until the end of the stage.
  > "I was taking our donkey to market and the water came out of nowhere."
- **The harp, new use:** his **donkey** stands frozen in fear in a narrow gap, blocking the only way up. Play the harp (Select) to calm it, and it moves.
- **Scroll:** **Psalm 18:16** "He reached down from on high and took hold of me; he drew me out of deep waters." (Psalm 18 is a psalm of David.)
- **The One:** in a side cave in the first half, *before* the flood. If you miss it, it's a replay find.

### 2-3 · The High Cliffs — *distance, angles and heights*
- **Level:** a vertical climbing stage up desert cliffs to a hidden spring with a waterfall (like the real springs of En Gedi in the Judean wilderness). Narrow ledges, crumbling rock, wind gusts at the top.
- **Charged shots at a distance:** cut rope ladders down, knock loose hanging rocks to make stepping stones, hit **eagles** diving at the back of your sheep line from far off with diagonal shots before they can lift a lamb.
- **Ibex** leap between ledges. They're neutral and never hurt you. **Hanan's counsel:**
  > "Watch the wild goats. They know every safe path on these cliffs."
  - 🗝️ Secret: follow an ibex and it leads to a hidden ledge route with a heart and The One.
  - 📜 **Psalm 104:18** "The high mountains belong to the wild goats; the crags are a refuge for the hyrax." (Rock hyraxes sit on the ledges. Kids will want to know what they are, and the Journal has a picture.)
- **Behind the waterfall:** Abinadab's cave (his Secret card from 2-1). A heart, a Psalm piece, and the way to the bonus spring pool.
- **Scroll:** **Psalm 18:33** "He makes my feet like the feet of a deer; he causes me to stand on the heights."
- **The One:** at the very top, on the ibex route.

### 2-4 · The Bear's Ravine — *everything so far, at dusk*
- **Level:** a deep wooded ravine at dusk. Signs of the bear everywhere: **claw marks** on trees, torn-up logs, overturned rocks. Wolves hunt in pairs in the half-light.
- **Foreshadowing:** halfway through, a tree crashes down somewhere off screen.
- **Campfire, Hanan, the last fire of World 2:**
  > "A lion is quick. A bear is strong and slow to turn. Never fight it up close — keep your distance."
  > "When it stands up on its back legs, it's about to bring its paws down. Be off the ground."
  - 👁️ **Warning (tier 1):** the bear's stand-up slam and its slow turn.
  - 📜 Journal: **Proverbs 17:12** "Better to meet a bear robbed of her cubs than a fool bent on folly." (Hanan adds, dryly: *"And Eliab, some days."*)
- **Scroll:** **Psalm 46:1** "God is our refuge and strength, an ever-present help in trouble."
- **Stage ending:** David gets back to the flock's night pen at the mouth of the ravine. **The bear is tearing at the stone wall of the pen** and has pinned a sheep. This follows the Bible's words: "a lion or a bear came and carried off a sheep from the flock" (1 Sam 17:34).

### BOSS · The Bear (end of 2-4)
**How it differs from the Lion:** the lion was about **close-up dodging and quick timing**. The bear is about **distance, patience and charged shots.** World 2's lesson is the same as its new skill: patience puts the power in the stone.

**Arena:** the ravine in front of the pen. Three levels: the ground, a middle ledge and a high ledge, joined by a **log bridge**.

**Phase 1 — Draw it away.** The bear is at the pen wall with a sheep pinned. It ignores tap shots. **Charged shots** to its back make it turn, let go of the sheep (which runs into the pen) and come after you.

**Phase 2 — The Bear Fights.**
- **Charge:** tell = it lowers its head and scrapes the ground. It's slow to turn, so jump over it or get above it and hit it while it turns around.
- **Stand and slam:** tell = it rises up on its back legs (with tier-1 counsel, its shadow flashes). It slams down, shaking the ground and making rocks fall from above. Be in the air, then dodge the rocks.
- **Throw:** it rips up a boulder or a log and hurls it in an arc. Roll under it or jump over it.
- **Weak point:** when it stands up to roar, a **full charged shot** staggers it and knocks it onto its back for a few seconds. Tap shots do small damage only while it's down.
- 4 charged hits end the phase.

**Phase 3 — The bridge.** The bear slams the log bridge and it breaks. Now the arena is just the ground and the high ledge. The bear climbs after you onto the ledge, slowly, so you can see it coming. Stay one level away and keep firing charged shots. 3 more. On the last one: slow-motion freeze, flash, and the bear slumps and fades (kid-clean, as with the lion).

**Counsel tier 2** (after a loss, go back to Hanan: *"Sit down. Tell me what happened."*): the bear turns even slower, its stand-up lasts +0.4 s, and you get +1 heart for this fight.

### End of World 2 — reflection scene
1. The flock is safe in the pen. David sits on the wall under the stars, sling in his lap.
2. **The boy from Tekoa and his father**, a leatherworker, arrive. The father gives David something he made: **a new leather sling pouch.** *"For the one who brought my son home."*
3. Hanan, watching:
   > "A lion, and now a bear. People will call you brave. Remember who gave you the strength."
4. Verse: **Psalm 18:1–2** "I love you, LORD, my strength. The LORD is my rock, my fortress and my deliverer; my God is my rock, in whom I take refuge."
5. David plays. David's song, now with a second part added.
6. World code.

### World 2 — summary table
| Stage | New thing | Sheep | People | Scroll |
|---|---|---|---|---|
| 2-1 | Charged sling, vine swings, boars, hornets | 5 + The One | Abinadab, **Hanan** | Psalm 1:3 |
| 2-2 | Flash-flood escape, harp calms the donkey | 5 + The One | **Hanan**, the boy from Tekoa | Psalm 18:16 |
| 2-3 | Vertical cliffs, long-range shots, follow the ibex | 5 + The One | **Hanan** | Psalm 18:33 |
| 2-4 end | Dusk ravine, wolves; **Boss:** the Bear, distance and patience | 5 + The One | **Hanan** | Psalm 46:1 |

### World 2 — who gives what
| Where | Person | Card | Gift / effect |
|---|---|---|---|
| 2-1 | Abinadab | 🗝️ Secret: the cave behind the falls in 2-3 | |
| 2-1 campfire | Hanan | 🎓 Skill: charged sling | |
| Map: 🔥 Hanan | Hanan | 📜 Journal: why shepherds move to summer pasture | Rest + harp |
| 2-2 campfire | Hanan | 📜 Fact: flash floods in the wadis | |
| 2-2 | The boy from Tekoa *(made up)* | 🧭 Story: get him home | Map: Tekoa road opens |
| Map: 🙋 Tekoa road | The boy's father | | Trust: shortcut to 2-4 |
| 2-3 | Hanan | 🗝️ Secret: follow the ibex · 📜 Psalm 104:18 | |
| 2-4 campfire | Hanan | 👁️ Warning (tier 1): the slow turn and the stand-up slam · 📜 Proverbs 17:12 | Tier 2 after a loss: slower turn, longer stand-up, +1 heart |
| End of World 2 | The boy's father | | **Gift:** a leather sling pouch, so the charged shot charges a little faster |


**Sprite list for this world:** [SPRITES.md](SPRITES.md#world-2--the-wilderness)

---

## 5c. World 3 — The Anointing *(DRAFT FOR REVIEW)*

**Bible:** 1 Samuel 16:1–13.
**Verse text note:** from World 3 on, this doc gives the **reference plus a short phrase**. The exact NIV wording is pasted in from Bible Gateway at build time.
**The big idea:** David is **this world's lost one.** The prophet comes to Bethlehem to anoint a king, every brother is presented, and David isn't even invited. He's out with the sheep. Samuel refuses to sit down until the overlooked youngest son is brought in (16:11). The player lives that: you're out in the far hills while the town gathers without you.
**Key verse:** **1 Samuel 16:7**: people look at the outward appearance, but the LORD looks at the heart.
**David learns:** the **aerial flip** (taught by Shammah); that God sees what people don't; and humility, because after he's anointed he goes straight back to the sheep.
**Enemies:** crows in the barley, stray dogs, rats in the granary, hornets, **rustlers**, and in the storm, the wild ox. **Harmless:** whip snake (in the granary). **Chores:** oiling sheep pestered by flies. (See §3d.)

### World 3 map
Bethlehem up close: the village on its hill, barley fields and a threshing floor, olive groves, and open grassland under storm clouds at the far end.

```
 [🏠 Jesse's house] ──> (3-1) ──> [🙋 The gleaner] ──> (3-2)
                                                         │
 [✨ Well by the gate] <── (3-4) <── [⭐ The Anointing] <── (3-3)
                            │
                         (🐂 in the storm)
```

| Dot | What's there |
|---|---|
| 🏠 Jesse's house | Start. Family scene. News that the prophet is coming. |
| 3-1 | The Day Before |
| 🙋 The gleaner | *(made up)* An old widow gathering leftover barley at the field's edge, as the Law allowed the poor to do (Leviticus 19:9–10). Help her and she tells you a Secret. |
| 3-2 | The Far Pasture |
| 3-3 | We Will Not Sit Down |
| ⭐ The Anointing | A story spot, not a stage. The anointing scene plays here. |
| 3-4 | The Chosen Shepherd, with the Wild Ox at the end |
| ✨ Well by the gate | Opens when all World 3 sheep are found. Bonus stage plus a Psalm piece. Years later, David would long for a drink from this exact well (2 Samuel 23:15). |

### Opening scene
1. Jesse's house at evening. A messenger runs in: *"The prophet Samuel is coming to Bethlehem!"*
2. The town elders look worried. The Bible says they trembled when Samuel arrived (16:4), because a prophet's visit could mean trouble.
3. Eliab stands up straight, adjusts his cloak and smiles.
4. Title card: **WORLD 3 — THE ANOINTING**

### 3-1 · The Day Before — *village life and the rooftops*
- **Story:** the whole town is getting ready for Samuel. Jesse's family is busy, and David is given the jobs nobody else wants.
- **Level:** Bethlehem itself. Narrow lanes, **flat rooftops** to run and jump across, ladders, courtyards, the barley fields and the threshing floor.
- **Jobs that are the level:** chase **crows** out of the barley with the sling, clear **rats** from the granary (or spot the whip snake in the rafters and let it do the job for you: a Shepherd's Judgment callback to 1-1), and bring a stray goat home through the lanes.
- **Eliab** at the house: *"When the prophet sees me, he'll know. Look at me."* (Sets up 16:6–7.)
- **Shammah:** *"Don't mind him. Somebody has to keep the sheep alive while he's being admired."*
- **Journal fact:** **Ruth and Boaz**, David's great-grandparents, lived here, and Ruth gathered barley in these very fields (Ruth 2 and 4:17). The threshing floor in this stage is a nod to their story.
- **Journal fact:** the name Bethlehem is usually taken to mean "house of bread".
- **Scroll:** **Micah 5:2**, a prophecy that a ruler would come out of little Bethlehem. (Ties into Thread 1: the Son of David.)
- **The One:** on the highest rooftop, reached by a long chain of roof jumps.
- **End of stage:** Jesse: *"David, the flock still needs you. Take them to the far pasture tomorrow."* David goes. Nobody thinks to invite him.

### 3-2 · The Far Pasture — *the one who wasn't invited*
- **Level:** wide open hills far from town, with long sightlines back to Bethlehem in the background. **You can see the crowd gathering on the town hill** while you work.
- **Gameplay:** a classic shepherd stage: find the 5 sheep, keep foxes and stray dogs off the line, cross a stream on stepping stones.
- **Rustlers:** with the town busy, two sheep thieves sneak in to steal from the unguarded flock. Hit them and they drop the sheep and run.
- **Oil for the flies:** fly swarms pester the sheep and slow the line. You find an oil flask at the campfire; press ↓ at a sheep to oil its head. This is the stage just before David himself is anointed with oil. The Journal makes the link (Psalm 23:5).
- **Cut-in scenes at each checkpoint (5–6 seconds each, skippable):** back in town, the sons of Jesse pass before Samuel one at a time.
  - Eliab first. Samuel thinks *surely this is the one.* Then: *not this one* (16:6–7).
  - Abinadab: *not this one.* Shammah: *not this one* (16:8–9).
  - The other brothers: *not these* (16:10).
  - Then you're back in the hills with the sheep. It's lonely on purpose.
- **Hanan isn't at this campfire.** He's in town for the gathering. The campfire is just David's. Playing the harp here adds a quiet phrase to David's song.
- **Scroll:** **Psalm 139:1**: you have searched me, LORD, and you know me.
- **The One:** across the stream in a thorny thicket; clear the thorns with charged shots.
- **End of stage:** Shammah comes running over the hill, out of breath.

### 3-3 · We Will Not Sit Down — *the run back to town; learn the flip*
- **Story:** Samuel has asked Jesse, *"Are these all the sons you have?"* Jesse: there is still the youngest, tending the sheep. Samuel: *"Send for him; we will not sit down until he arrives"* (16:11). Shammah has come to get you.
- **Shammah teaches the aerial flip** at the start, so you can keep up:
  > "Remember rolling down the hills when we were little? Do it in the air. Jump, then roll."
  - 🎓 **Skill: aerial flip** (A again at the top of a jump, after a roll or a run). A little extra height and air control.
- **Level:** a fast, joyful run from the hills, through the fields and up into town: stone walls, fences, barley rows, then the rooftops again with the flip opening new routes. **Shammah runs alongside** and points out the way. **No timer.** The whole town is waiting, and the music speeds up as you get close.
- **The flock comes too,** following you into town.
- **Scroll:** **Psalm 78:70**: he chose David his servant and took him from the sheep pens.
- **The One:** a flip-only route over the town wall.

### ⭐ The Anointing — a story scene, not a fight
1. David walks into the gathering, dusty from the fields. Everyone turns. The Bible describes him as glowing with health, with a fine appearance (16:12).
2. **Samuel hears the LORD: this is the one; rise and anoint him** (16:12).
3. Samuel pours oil from a **horn** over David's head, in front of his brothers (16:13).
4. **The Spirit of the LORD came powerfully upon David from that day on** (16:13). Shown simply: a warm light, the music swells, and David's song plays with a new third part. No glowing powers and no new stats. Something changed in David, not in his sling.
5. Eliab looks away.
6. **Journal:** "Anointing" explained for kids: pouring oil on someone's head was how Israel set apart a king or a priest. The word *Messiah* means "anointed one." (Ties into Thread 1.)

### 3-4 · The Chosen Shepherd — *back to work, then the storm*
- **Story:** what does the newly anointed king do the next morning? **He goes back to the sheep.** Later, when Saul sends for him, David is still "with the sheep" (16:19). That's the lesson of the world.
- **Hanan's campfire, his last in World 3:**
  > "So. The prophet poured oil on your head."
  > "And tomorrow the sheep still need water. Kings are made in the small things, David."
  - 👁️ **Warning (tier 1):** *"Storm coming. In a storm the wild oxen panic and charge at anything that moves. If one charges, put a tree between you."*
  - 📜 **Proverbs 22:4** (humility).
- **Level:** open grassland as a storm rolls in. Wind gusts push you, rain makes the ground slippery (a little slide on landing), and lightning lights up dark sections. Required jumps leave room for the slide (rule 3).
- **Scroll:** **Psalm 29:3–4**, a psalm of David about the voice of the LORD over the storm.
- **The One:** in a hollow under a fallen oak, reached by rolling.
- **Stage ending:** a huge **wild ox** bursts out of the rain and charges straight at the flock.

### BOSS · The Wild Ox (end of 3-4)
**Not killed: driven off.** The Bible doesn't describe this fight; it's invented, so the game can choose. Not every animal needs to die. The ox gives up and runs off into the storm. Kids will notice that difference.

**How it plays:** the Lion was dodging, the Bear was distance, and the Ox is **using the arena and the new flip.**

**Arena:** a muddy hillside in the rain with **three big trees**, a low stone wall and the flock huddled on the far left.

**Phase 1 — Turn it from the flock.** The ox is charging at the flock. Hit it with charged shots to make it turn toward you instead.

**Phase 2 — Use the trees.**
- **Charge:** tell = it paws the ground three times and lowers its horns (with tier-1 counsel, its eyes flash). Stand in front of a tree and **flip over the ox** at the last second. Its **horns stick in the trunk** and it's stuck for a few seconds. Hit it then.
- **Lightning:** a strike hits a tree, and a branch falls; move.
- **Mud slide:** it skids if it misses you on wet ground, so the next charge comes from a strange angle.
- 3 trees, 3 good stuck-in-a-tree hits. Each time a tree splits and falls.

**Phase 3 — No trees left.** It charges back and forth along the open slope, faster. Flip over every charge; hit it while it skids to turn. 3 hits. Then it stops, shakes its head, snorts, and **runs off into the rain.**

**Counsel tier 2** (Hanan: *"Sit down. Tell me what happened."*): the ox paws one extra time before each charge, horns stay stuck +0.5 s, and you get +1 heart.

### End of World 3 — reflection scene
1. The storm clears. Sunset over Bethlehem. The flock is safe.
2. Hanan by the fire. He gives David **his own old shepherd's staff:**
   > "I won't always be on these hills with you. Take this. When the path is hard, lean on it, and remember who leads you."
   - Ties to **Psalm 23:4** (the rod and the staff).
3. Verse on screen: **1 Samuel 16:7**: the LORD looks at the heart.
4. A messenger on horseback in the distance, riding toward Bethlehem from the king (sets up World 4).
5. David plays. World code.

### World 3 — summary table
| Stage | New thing | Sheep | People | Scroll |
|---|---|---|---|---|
| 3-1 | Village rooftops, chores as level goals | 5 + The One | Jesse, Eliab, Shammah | Micah 5:2 |
| 3-2 | Being left out, cut-in scenes of the brothers before Samuel | 5 + The One | (cut-ins) | Psalm 139:1 |
| 3-3 | **Aerial flip**, joyful run back to town with Shammah | 5 + The One | Shammah | Psalm 78:70 |
| ⭐ | **The Anointing** (story scene) | | Samuel, Jesse, all the brothers | |
| 3-4 end | Storm: wind, mud, lightning; **Boss:** the Wild Ox, driven off | 5 + The One | **Hanan** | Psalm 29:3–4 |

### World 3 — who gives what
| Where | Person | Card | Gift / effect |
|---|---|---|---|
| 3-1 | Jesse | 🧭 Story: take the flock to the far pasture | |
| Map: 🙋 The gleaner | Old widow *(made up)* | 🗝️ Secret: the hollow under the fallen oak in 3-4 (The One) · 📜 Leviticus 19:9–10 | Trust: a heart refill whenever you pass |
| 3-2 campfire | (David alone) | 📜 Psalm 139:1 | Harp adds a phrase to David's song |
| 3-3 | Shammah | 🎓 Skill: aerial flip | |
| ⭐ | Samuel | 📜 1 Samuel 16:7 · Journal: what "anointing" means | |
| 3-4 campfire | Hanan | 👁️ Warning (tier 1): the ox's charge and the trees · 📜 Proverbs 22:4 | Tier 2 after a loss: longer tell, horns stuck longer, +1 heart |
| End of World 3 | Hanan | | **Gift:** Hanan's shepherd's staff, +1 max heart |


**Sprite list for this world:** [SPRITES.md](SPRITES.md#world-3--the-anointing)

---

## 5d. World 4 — The King's Court *(DRAFT FOR REVIEW)*

**Bible:** 1 Samuel 16:14–23.
**What happens:** King Saul is tormented and troubled (16:14). His servants suggest finding someone who can play the lyre to bring him relief. One servant names David: a son of Jesse who plays well, is brave, speaks well, and the LORD is with him (16:18). Saul sends for "David your son, who is with the sheep" (16:19). Jesse sends him with a donkey loaded with bread, a skin of wine and a young goat (16:20). Saul likes David very much and makes him one of his armor-bearers (16:21). Whenever Saul is troubled, David plays, and Saul finds relief (16:23).
**The lost one:** **King Saul.** Powerful, tall, and suffering. The game never makes Saul the villain. His trouble is the enemy, not him.
**Note on the text:** the Bible says the trouble came on Saul as a spirit. The game shows it as storm-like shadows (no monsters, no faces) and the Journal gives the reference so families can read it themselves.
**David learns:** **quick release** (fast double shots), taught by a Benjamite slinger; that skill opens doors ("serve before kings", Proverbs 22:29); and that his music can help someone who is hurting.
**Where:** **Gibeah**, Saul's hilltop home town and fortress (1 Sam 10:26), north of Jerusalem. Roughly 10 miles from Bethlehem (to be checked).
**Enemies:** bandits on the road (driven off), wild boar in the vineyards (Psalm 80:13 again), crows, palace guard dogs (they bark and chase, then lose interest), rats in the storerooms. **Harmless:** doves, sparrows, market goats, the whip snake in the storeroom (callback). **Not in this world:** Jonathan. He's Saul's son, but his friendship with David starts after Goliath, which is Part 2.

### World 4 map
The road north from Bethlehem through vineyards and villages, past the walled city of Jebus (Jerusalem) seen from a distance, up to the fortress of Gibeah on its hill.

```
 [🏠 Bethlehem gate] ──> (4-1) ──> [🙋 Vineyard keeper] ──> (4-2)
                                                              │
 [✨ Rooftop garden] <── (4-3) <── [🔥 Servants' fire] <──────┘
          │                │
          └──────────> (4-4 👑 The King's Hall)
```

| Dot | What's there |
|---|---|
| 🏠 Bethlehem gate | Start. Hanan's farewell. Jesse loads the donkey. |
| 4-1 | The Road to Gibeah |
| 🙋 Vineyard keeper | *(made up)* Wild boars are wrecking his vines. Help and he gives you a Secret and a shortcut. |
| 4-2 | The Training Yard |
| 🔥 Servants' fire | The palace kitchen hearth. Rest, Journal, counsel from the Steward. |
| 4-3 | The Broken String |
| ✨ Rooftop garden | Opens when all of World 4's lost items are found. Bonus stage plus a Psalm piece. |
| 4-4 👑 | The King's Hall, with Saul's Torment at the end |

**Sheep in this world:** David is away from the flock, so the "5 lost sheep" become **5 lost things** in each stage: the donkey's dropped gifts in 4-1, stray palace goats in 4-2, harp-string materials in 4-3, scattered lamps in 4-4. **The One is still a lamb**: one lost lamb hidden somewhere in every stage, even in the palace. (In 4-2, the lamb was meant for the king's table. Bring it back and the Steward lets it go to the palace flock instead.)

### Opening scene
1. A royal messenger at Jesse's door: *"The king asks for your son David, who is with the sheep."*
2. The brothers stare. Eliab: *"Him? For the king?"*
3. Jesse loads a donkey with bread, a skin of wine and a young goat for the king (16:20).
4. **Hanan at the Bethlehem gate:**
   > "You're going where I can't follow, David. Palaces are full of people who will tell you what you want to hear. Find the one who tells you the truth, and listen to him."
   > "I'll be here when you come home."
5. Title card: **WORLD 4 — THE KING'S COURT**

### 4-1 · The Road to Gibeah — *escort the donkey*
- **Level:** a long road north through vineyards, terraced hills, small villages and a stream crossing. The walls of Jebus (Jerusalem) are visible in the background. **Journal fact:** in David's youth, Jerusalem was still a Jebusite city. He would take it many years later (2 Samuel 5).
- **The donkey** follows behind you like the sheep line, carrying the gifts for Saul. If it's hit, gifts drop on the ground: pick them back up. It gets spooked by barking dogs; play the harp to calm it (callback to 2-2).
- **Bandits** jump out on the lonely stretches to grab the gifts. Hit them and they drop the goods and run.
- **Wild boars** in the vineyards, as the psalm describes (Psalm 80:13).
- **Shepherd's Judgment:** doves on the road are harmless; crows stealing grapes are fair game.
- **Scroll:** **Psalm 121:8**: the LORD will watch over your coming and going.
- **The One:** a lamb that strayed from a village flock, on a vineyard terrace above the road.

### 4-2 · The Training Yard — *learn quick release*
- **Story:** David arrives at Gibeah. Before he plays for the king, the captain of the yard wants to see what this shepherd boy can do. David is now one of Saul's **armor-bearers** (16:21), so he trains with the king's men.
- **Gera the slinger** *(made up)*, an old soldier from **Saul's own tribe, Benjamin**:
  > "So you're the shepherd with the sling. You know Benjamin's slingers are famous? We can hit a hair and not miss."
  - (A callback to Hanan's story in 1-1. **Judges 20:16** is the same verse.)
  > "You throw well. But slow. Let me show you how we do it — release, reload, release."
  - 🎓 **Skill: quick release.** Tap B twice quickly for two fast shots. Not stronger, just faster.
- **Level:** a sling course across the training yard and the walls: **moving targets** on ropes, swinging targets, targets behind gaps you have to jump to see, clay jars on the battlements. A **guard dog** chases you across part of it.
- **Score:** an optional par time and accuracy rating. It never stops you finishing.
- **Scroll:** **Proverbs 22:29**: someone skilled in their work will serve before kings.
- **The One:** the lamb meant for the king's table, hidden in a feed shed on the wall.

### 4-3 · The Broken String — *across the town of Gibeah*
- **Story:** David is called to play for the king for the first time, and a **string on his harp snaps.** The Steward sends him into town to find what he needs before nightfall: a gut string from the market, a new tuning peg from the carpenter, and beeswax for the wood.
- **The Steward** *(made up; the palace's old head servant, and the "one who tells you the truth" Hanan told you to find)*:
  > "The king is not well. Everyone here pretends he is. I won't."
  > "Most nights he's quiet. Some nights it's like a storm in him. That's when they'll want you."
  - 👁️ **Warning (tier 1)** for the boss: *"When the dark comes on him, don't rush. Play steady. Rushing makes it worse."*
- **Level:** the town of Gibeah: market stalls with awnings to bounce on, crowded lanes, a well, flat rooftops, the carpenter's yard (stacks of beams), the beekeeper's hives. **Three items to collect** and bring back.
- **Shepherd's Judgment:** the beekeeper's **bees** are calm if you leave them; the **hornets** in the old wall are not (callback to 2-1).
- **Scroll:** **Psalm 33:3**: sing a new song; play skilfully.
- **The One:** a lamb hiding in the market under a cloth stall; it only comes out if you play the harp nearby (once your harp is fixed, so this is a replay find or for players who come back after the items).

### 4-4 · The King's Hall — *the palace at night*
- **Story:** night. A storm outside. Servants run past with lamps, whispering. The king is troubled again. The Steward: *"Now, David."*
- **Level:** the palace interior at night: corridors, staircases, balconies and the great hall. **The shadows** begin to drift through the halls: dark, cloud-like wisps that slowly follow you. Touching one doesn't hurt but makes you shiver to a stop for a moment. Lamps keep them back: light the hall lamps as you go (the 5 "lost things" of this stage).
- **No enemies to hit here.** The sling can't help. That's the point. (Palace dogs bark, servants are in the way, but nobody to fight.)
- **Servants' fire (checkpoint):** the Steward's tier-2 counsel waits here after a loss.
- **Scroll:** **Psalm 34:18**: the LORD is close to the brokenhearted.
- **The One:** a lamb from the palace flock that wandered inside during the storm, hiding under the great staircase.

### BOSS · Saul's Torment (end of 4-4) — *won with music, not the sling*
**The only boss in the game you can't hit.** The sling is put away. David sits at the side of the king's chair and plays.

**How it plays:** a rhythm fight with the same buttons. Notes come in time with **David's song**, the melody that's been growing since 1-1, so the player already knows the tune.
- Notes arrive in **four lanes: ↑ ↓ A B.** Hit them in time.
- **Shadows** gather around Saul's chair. Every steady phrase you play **pushes them back.** Missed notes let them creep closer.
- **No hearts are lost.** Instead there's a **calm meter** for Saul. If the shadows reach Saul, he sends you out of the room. You go back to the Servants' fire and try again.

**Phase 1 — The quiet part.** The first part of David's song (from World 1). Slow, simple. The shadows drift back.
**Phase 2 — The storm.** Thunder outside; Saul cries out. The tempo picks up with the second part of the song (from World 2). The Steward's tier-1 warning matters here: **steady beats beat fast ones.** Rushing (pressing early) makes the shadows surge. With tier-1 counsel, the beat marker glows on every fourth note.
**Phase 3 — The new part.** The third part of the song (from the anointing). Longer held notes. The shadows thin and fade one by one.

**Ending:** the hall goes quiet. Saul leans back, calm, and sleeps. The Bible says relief would come to Saul; he would feel better (16:23). Saul is shown as a tired man at peace, not a defeated enemy.

**Counsel tier 2** (the Steward: *"Sit down. Tell me what happened."*): wider timing window on every note, and missed notes push the calm meter back less.

**Easy option:** a "follow the beat" assist that slows the song (kids, or anyone who finds rhythm games hard). It never changes what happens in the story.

### End of World 4 — reflection scene
1. Morning at Gibeah. Saul, rested, talks to David. He sends word to Jesse: *let David stay in my service, for I am pleased with him* (16:22).
2. **Gift: the King's Favour.** David may come and go between Gibeah and Bethlehem. In fact, he went back and forth to tend his father's sheep (17:15).
   - **In the game:** this unlocks **fast travel** between all world maps you've visited, so going back for The One lambs and secrets becomes quick.
3. The Steward:
   > "You didn't fix him, boy. Only God can. But you gave him rest tonight. That's a gift too."
4. Verse: **1 Samuel 16:23**: relief came to Saul.
5. David goes home to the sheep. Hanan is at the gate, as promised.
6. World code.

### World 4 — summary table
| Stage | New thing | Lost things | People | Scroll |
|---|---|---|---|---|
| 4-1 | Escort the donkey, bandits, vineyard boars | 5 dropped gifts + The One | Hanan (farewell), Jesse | Psalm 121:8 |
| 4-2 | **Quick release**, target course, guard dog | 5 stray goats + The One | Gera the slinger | Proverbs 22:29 |
| 4-3 | Town of Gibeah, collect 3 harp parts | 5 + The One | **the Steward**, beekeeper | Psalm 33:3 |
| 4-4 end | Night palace, shadows and lamps; **Boss:** Saul's Torment (rhythm) | 5 lamps + The One | **the Steward**, Saul | Psalm 34:18 |

### World 4 — who gives what
| Where | Person | Card | Gift / effect |
|---|---|---|---|
| Map: 🏠 Bethlehem gate | Hanan | 🧭 "Find the one who tells you the truth" | |
| Map: 🙋 Vineyard keeper | Vineyard keeper *(made up)* | 🗝️ Secret: the feed shed on the wall in 4-2 (The One) | Trust: shortcut to 4-3 |
| 4-2 | Gera the slinger *(made up)* | 🎓 Skill: quick release · 📜 Judges 20:16 (callback) | |
| 4-3 | The Steward *(made up)* | 👁️ Warning (tier 1): play steady, don't rush | |
| Map: 🔥 Servants' fire | The Steward | 📜 Journal: who Saul was (1 Sam 9:1–2, 10:1) | Rest + harp |
| 4-4 | The Steward | Tier 2 after a loss: wider timing, slower calm loss | |
| End of World 4 | King Saul | | **Gift: the King's Favour** = fast travel between world maps |


**Sprite list for this world:** [SPRITES.md](SPRITES.md#world-4--the-kings-court)

---

## 5e. World 5 — The Road to the Valley *(DRAFT FOR REVIEW)*

**Bible:** 1 Samuel 17:1–24.
**What happens:** the Philistines gather for war at Sokoh in Judah, and Saul's army camps in the Valley of Elah (17:1–2). Jesse's three oldest sons, Eliab, Abinadab and Shammah, have gone with Saul (17:13). Every morning and evening for forty days, a Philistine champion comes out and shouts a challenge (17:16). Jesse sends David with roasted grain and ten loaves for his brothers, and ten cheeses for their commander, to see how they are (17:17–18). David leaves the flock with a shepherd (17:20), reaches the camp as the armies take up their battle lines, and hears the giant for the first time. The army runs in fear (17:23–24).
**The big idea:** **fear.** Everyone in this world is afraid: fleeing villagers, a scout who's lost his nerve, a whole army. David is walking toward the thing everyone else is running from.
**The lost one:** **Tobi** *(made up)*, a young Israelite scout who froze with fear on the mountain trail and has been hiding in a cave for two days.
**David learns:** the **double jump** (Tobi's "scout's leap"), and to keep going toward a hard thing because he was sent.
**Enemies:** Philistine raiders and lookouts (driven off), striped hyena at night (laughs before it lunges), a **leopard** stalker (mini-boss), vultures following the armies, vipers and scorpions. **Harmless:** gazelles, tortoises, and the **chariot horses** (never hit the horses).
**Hanan:** keeps the flock while David is gone. He's the shepherd David leaves them with (17:20).

### World 5 map
West from Bethlehem through dry hills, down a mountain trail, along a ridge watched by Philistine lookouts, and into the Valley of Elah with two camps facing each other.

```
 [🏠 Jesse's house] ──> (5-1) ──> [🙋 Fleeing family] ──> (5-2)
                                                            │
 [✨ Terebinth grove] <── (5-3) <── [🔥 Tobi's cave] <──────┘
          │                │
          └───────────> (5-4 🐎 Valley road)
                           │
                   [⛺ Israelite camp]  (end scene)
```

| Dot | What's there |
|---|---|
| 🏠 Jesse's house | Start. Jesse gives the provisions. Hanan takes the flock. |
| 5-1 | The Supply Road |
| 🙋 Fleeing family | *(made up)* A village family running from the Philistines with their scattered flock. Help gather it (5-1) and they give you a Secret. |
| 5-2 | The Mountain Trail (night) |
| 🔥 Tobi's cave | Tobi's campfire. Rest, Journal, counsel. |
| 5-3 | The Lookouts' Ridge |
| ✨ Terebinth grove | Opens when all World 5 sheep are found. Bonus stage plus a Psalm piece. The Valley of Elah is named after these trees: *elah* is the Hebrew word for terebinth. |
| 5-4 🐎 | Down to Elah, with the Philistine Chariot at the end |
| ⛺ Israelite camp | The end scene (David hears Goliath). This dot becomes the start of World 6. |

### Opening scene
1. Jesse, older now, at the table. Three empty places where Eliab, Abinadab and Shammah sit. *"Forty days, and no word."*
2. He gives David the roasted grain, the ten loaves and the ten cheeses (17:17–18). *"See how your brothers are, and bring me back some news."*
3. Hanan takes the flock: *"Go. I've kept sheep longer than you've been alive. They'll be here."*
4. Title card: **WORLD 5 — THE ROAD TO THE VALLEY**

### Carrying the provisions
David carries the provisions through every stage. **If he's hit, a loaf or a cheese drops** and bounces nearby (like coins spilling): grab it back before it's gone. How much arrives at the camp is shown in the stage score and in the end scene. **Carrying never slows David's movement** (rule 1). It's a score you protect, not a weight.

### 5-1 · The Supply Road — *fear on the road*
- **Level:** a long dusty road west through dry hills, a crumbling watchtower, dry stone walls, olive terraces. Villagers **coming the other way**, fleeing the Philistines.
- **Lost sheep (5):** the fleeing family's flock has scattered across the hills in their panic. Gather them with the harp and lead them back to the family on the road.
- **Philistine raiders** have come up into the hills to grab livestock and grain. Hit them and they drop what they took and run.
- **Vultures** circle overhead. They follow armies, a grim hint of what's ahead.
- **The fleeing father** *(made up)*:
  > "You're going *that* way? Boy, there's a giant in that valley. Turn around."
  - 🗝️ Secret: *"There's a cave on the mountain trail. I saw a soldier hiding up there."* (Leads to Tobi.)
- **Scroll:** **Exodus 20:12**: honor your father and your mother. (David is doing what Jesse asked, even on a hard road.)
- **The One:** a lamb that ran into the abandoned watchtower; climb the broken stairs.

### 5-2 · The Mountain Trail — *night; meet Tobi; learn the double jump*
- **Level:** a narrow trail along cliffs at night, under a big moon and stars. Rock shelves, narrow ledges, gaps, loose stones.
- **Striped hyenas** come out at night. **They laugh before they lunge,** a warning you can hear before you see it. (Journal fact: the striped hyena is real and still lives in Israel.)
- **Mid-stage mini-boss: the leopard.** It stalks you along the trail from the trees above. The leopard is real, and the prophets describe one lying in wait by the road (Jeremiah 5:6, Hosea 13:7).
  - Tell: leaves rustle, and two eyes shine in the branches. It drops on you from above. Roll away, then hit it on the ground. After 3 hits it retreats up the tree and leaves.
- **Tobi's cave (checkpoint):** behind the fleeing father's Secret. Tobi is a young scout curled up by a cold fire.
  > "I'm a scout. I'm supposed to be fast. I heard him — the giant — and I just ran. I've been here two days."
  - David lights the fire and plays the harp. Tobi calms down and teaches what he knows:
  > "Scouts learn to push off anything — a rock, a branch, even a bit of nothing. Jump, then jump again. Like this."
  - 🎓 **Skill: double jump** (A again in mid-air: a sharp tuck-and-kick).
  - Tobi follows you for the rest of the stage, so you're getting him back to camp.
- **Scroll:** **Psalm 4:8**: in peace I will lie down and sleep.
- **The One:** on a high shelf above the trail that needs the new double jump. It's the first lamb the double jump is for.

### 5-3 · The Lookouts' Ridge — *don't be seen*
- **Level:** the high ridge above the Valley of Elah. Philistine **lookouts** with torches stand on rocks and towers.
- **Lookouts (light stealth):** each one watches a stretch of ridge with a torchlight cone. If he sees you, he shouts and lights a **signal fire**, and a few extra raiders come. **Being seen is never a fail state**, just a harder few seconds. Sneaking past (or knocking the torch out of his hand with a quick shot) earns a "Not seen" bonus.
- **Tobi** knows the ridge:
  > "The lookouts change every time the moon moves behind a cloud. That's your moment."
  - 👁️ Warning for the boss: *"Down in the valley there's a Philistine chariot that hunts scouts on the road. A chariot can't turn on rough ground. Get to the rocks."*
- **Shepherd's Judgment:** gazelles bound across the ridge. Leave them be.
- **Scroll:** **Psalm 27:1**: the LORD is my light and my salvation; whom shall I fear? (A psalm of David.)
- **The One:** in a crevice under a lookout's tower; you have to get past him unseen to reach it.

### 5-4 · Down to Elah — *the valley road*
- **Level:** the descent into the Valley of Elah at dawn. Terebinth trees, a dry streambed (seen for the first time; World 6 begins here), **chariot wheel ruts** in the dust. Both camps are visible on the hills across the valley in the background. Every so often a **distant booming voice** echoes across the valley. You can't make out the words yet.
- **Scroll:** **Psalm 20:7**: some trust in chariots and some in horses, but we trust in the name of the LORD our God. (A psalm of David, placed right before the chariot.)
- **The One:** among the terebinths, behind a fallen trunk.
- **Stage ending:** wheels thunder behind you. A **Philistine chariot** comes over the rise, hunting scouts on the road.

### BOSS · The Philistine Chariot (end of 5-4)
**Faithful to history:** the Philistines had chariots (1 Sam 13:5). This chase is invented. It uses **everything learned so far:** quick release for the archer, charged shots for the wheel, double jump over the horses, and roll under the arrows.

**The arena:** the open valley road, **auto-scrolling to the right**. Smooth road on the left half, **rough rocky ground** on the right edge. Terebinth trees and boulders along the way.

**Phase 1 — The archer.** The chariot rides alongside you. The **archer** draws and fires (tell: he raises his bow and it glints). Roll or jump the arrows. He ducks behind his shield, but when he rises to draw, a **quick-release double shot** knocks his bow aside. 3 hits and he drops his bow.
**Phase 2 — The ram.** The driver tries to run you down. Tell: the horses toss their heads and the driver whips the reins. **Double jump over the horses** as they pass. **Don't hit the horses**: they're animals pulling a cart, and hitting them lowers your Care score. Hit the **cracked wheel** with **charged shots** as the chariot passes. 3 hits and the wheel wobbles.
**Phase 3 — Rough ground.** With tier-1 counsel (Tobi's warning), the rocky ground on the right flashes. Lure the chariot onto the rocks. It can't turn there, and the wheel breaks. The chariot stops, the horses rear, and **the crew jump down and run back to the Philistine lines.** The horses trot off free. Nobody is killed.

**Counsel tier 2** (Tobi: *"Sit down. Tell me what happened."*): the archer's tell lasts longer, the cracked wheel takes 2 hits instead of 3, and +1 heart.

### End of World 5 — the camp, and the giant (reflection scene)
1. David walks into the Israelite camp with Tobi behind him. Tobi's commander runs over and grabs him: he thought Tobi was dead.
2. David leaves the provisions with the **keeper of supplies** (17:22) and gives the cheeses to the commander (17:18).
3. He runs to the battle line to find his brothers, just as both armies go out shouting the war cry (17:20–22). He finds them. Shammah grins; Eliab frowns.
4. Then **the voice.** Across the valley, a huge figure steps out of the Philistine line (shown only as a dark silhouette for now) and shouts his challenge (17:23).
5. **The whole Israelite army turns and runs** in fear (17:24). Soldiers rush past David on both sides. **David doesn't move.** The camera holds on him, standing still in the middle of the running crowd.
6. **Gift:** Tobi gives David his **scout's cloak**, +1 max heart. *"You walked toward it. I'll never forget that."*
7. Verse: **Psalm 56:3**: when I am afraid, I put my trust in you. (A psalm of David.)
8. World code. *To be continued in World 6: The Valley of Elah.*

### World 5 — summary table
| Stage | New thing | Sheep | People | Scroll |
|---|---|---|---|---|
| 5-1 | Carrying the provisions, raiders, fleeing villagers | 5 (the fleeing family's) + The One | Jesse, Hanan, the fleeing father | Exodus 20:12 |
| 5-2 | Night trail, hyenas, **leopard mini-boss**, **double jump** | 5 + The One | **Tobi** | Psalm 4:8 |
| 5-3 | Light stealth past the lookouts, signal fires | 5 + The One | **Tobi** | Psalm 27:1 |
| 5-4 end | The valley road; **Boss:** the Philistine Chariot | 5 + The One | **Tobi** | Psalm 20:7 |

### World 5 — who gives what
| Where | Person | Card | Gift / effect |
|---|---|---|---|
| Map: 🏠 Jesse's house | Jesse | 🧭 Story: take the provisions to your brothers | |
| 5-1 / Map: 🙋 | The fleeing father *(made up)* | 🗝️ Secret: a soldier hiding in a cave on the trail | Trust: his family's flock is returned |
| 5-2 | Tobi *(made up)* | 🎓 Skill: double jump | |
| Map: 🔥 Tobi's cave | Tobi | 📜 Journal: the Philistines and their five cities, including Gath, Goliath's home town | Rest + harp |
| 5-3 | Tobi | 🗝️ Lookouts and the moon · 👁️ Warning (tier 1): chariots can't turn on rough ground | |
| 5-4 | Tobi | Tier 2 after a loss: longer archer tell, weaker wheel, +1 heart | |
| End of World 5 | Tobi | | **Gift:** Tobi's scout cloak, +1 max heart |

**Sprite list for this world:** [SPRITES.md → World 5](SPRITES.md#world-5--the-road-to-the-valley)

---

## 5f. World 6 — The Valley of Elah *(DRAFT FOR REVIEW)*

**Bible:** 1 Samuel 17:25–37.
**What happens:** the soldiers talk about the reward Saul has promised to whoever defeats the giant (17:25). David asks about it, and asks who this Philistine is to defy the armies of the living God (17:26). **Eliab** hears him and burns with anger: why has David come, who is looking after "those few sheep in the wilderness," and David only came to watch the battle (17:28). David answers, *"Now what have I done? Can't I even speak?"* and turns to ask someone else (17:29–30). His words reach Saul, who sends for him (17:31). David says no one should lose heart; he will go and fight (17:32). Saul says he's only a young man and the giant has been a warrior since his youth (17:33). David tells him about the lion and the bear (17:34–37). Saul: *"Go, and the LORD be with you"* (17:37).
**The lost one:** **the whole army.** For forty days they've heard the giant morning and evening (17:16), and they've lost heart.
**The big idea:** courage is catching. David's harp and his words lift frightened soldiers, and soldiers who've been lifted help in return.
**Invented, and labelled so:** the Philistine watchtower and the water carriers. The Bible goes straight from Eliab's rebuke to Saul sending for David. The game puts a few hours of camp life in between, then picks the story back up at 17:31.
**David learns:** no new move this world. The new thing is **encouraging soldiers** with the harp (Thread 2), and the game now expects you to **combine** everything: roll, flip, double jump, quick release, charged shots.
**Enemies:** Philistine archers and slingers on the far slope (driven off), Philistine skirmishers, vipers and scorpions in the streambed, vultures. **Harmless:** camp donkeys and oxen, hedgehog (callback), the soldiers' dogs.

### World 6 map
The Valley of Elah: the Israelite camp on the left hill, the Philistine camp on the right, the dry streambed between them, and a tall wooden tower moving at the edge of the Philistine lines.

```
 [⛺ Israelite camp] ──> (6-1) ──> [🙋 Water captain] ──> (6-2)
                                                           │
 [✨ The quiet spring] <── (6-3) <── [🔥 Brothers' fire] <─┘
          │                 │
          └────────────> (6-4 🗼 The Tower)
                            │
                    [👑 Saul's tent]  (end scene)
```

| Dot | What's there |
|---|---|
| ⛺ Israelite camp | Start. Continues straight from the end of World 5. |
| 6-1 | The Camp of Fear |
| 🙋 Water captain | *(made up)* In charge of the men who fetch water from the streambed. The tower's archers have pinned them down for days. |
| 6-2 | No-Man's Land |
| 🔥 Brothers' fire | Shammah and Abinadab's campfire. Rest, Journal, counsel. |
| 6-3 | The Water Carriers |
| ✨ The quiet spring | Opens when every frightened soldier in World 6 has been lifted. Bonus stage plus a Psalm piece. |
| 6-4 🗼 | The Tower's Shadow, with the Philistine Watchtower at the end |
| 👑 Saul's tent | The end scene: David before Saul |

**Lost things in this world:** each stage hides **5 frightened soldiers** instead of 5 sheep: hiding in supply wagons, under carts, behind rocks, curled up in tents. Find them and **play the harp**. Each one stands up, picks up his spear, and goes back to his post. (The One is still a lamb: the camp keeps a small flock for food, and one is always loose.)

**Encouraged soldiers help back:** every soldier you lift in Worlds 6 adds to your **Courage count**. In the watchtower fight, lifted soldiers on the Israelite slope throw stones at the tower's archers to cover you: more courage, more cover. It's like counsel: it makes the fight gentler, never easier than fair, and skilled players can win with zero. All of them appear in the crowd in World 8.

### Opening scene
1. Straight on from World 5: the army has run back up the hill. David is standing alone on the slope.
2. Soldiers around a cooking fire, muttering:
   > "Forty days."
   > "The king will make rich the man who kills him. And give him his daughter."
   > "And free his father's family from taxes." (17:25)
   > "Nobody's going to do it."
3. Title card: **WORLD 6 — THE VALLEY OF ELAH**

### 6-1 · The Camp of Fear — *lift the soldiers; face Eliab*
- **Level:** the Israelite camp: tents to bounce on, supply wagons, rope lines, cooking fires, watch platforms, the commanders' tents at the top of the hill.
- **5 frightened soldiers** hidden around the camp. Lift each one with the harp.
- **Asking questions:** David goes from soldier to soldier asking about the reward and about the giant. Each answer is a short line and a Journal card. One of them:
  > "Who is he, that he should defy the armies of the living God?" — David, to the men (17:26)
- **Eliab, at the end of the stage.** A cut-scene, not a fight:
  - Eliab, red-faced: *"Why have you come down here? And who's looking after those few sheep in the wilderness? You came down just to watch the battle."* (17:28. The Journal links back to World 2: David really *was* out in the wilderness with them.)
  - David: *"Now what have I done? Can't I even speak?"* (17:29)
  - **David doesn't argue. He just turns and keeps asking** (17:30). The player sees what David didn't do.
  - Shammah, quietly, after Eliab stomps off: *"He's afraid too. He just shows it by being angry."*
- **Scroll:** **Proverbs 15:1**: a gentle answer turns away wrath.
- **The One:** a lamb from the army's food flock, loose on top of the supply wagons.

### 6-2 · No-Man's Land — *see the giant*
- **Story:** David wants to see this Philistine for himself.
- **Level:** the slope down to the valley floor, and out into the open ground between the armies. Rocks and dips for cover. **Philistine archers and slingers** on the far slope fire **volleys**: a shout, then a rain of arrows or stones in a pattern you can read. Get behind cover or roll through gaps.
- **The giant, seen in full for the first time,** far across the valley on the morning shout (17:16). He's small in the distance, but you can see the size of him next to the men around him. His voice booms. He mocks the army. **You can't reach him, and the game doesn't let you try.**
- **Goliath's Field Guide card** fills in as you watch: his height of "six cubits and a span" (about 9 feet 9 inches), bronze helmet, scale armor weighing about 125 pounds, bronze greaves, a bronze javelin, and a spear with an iron point of about 15 pounds (17:4–7). **Honest note in the card:** some ancient copies of the text give his height as four cubits and a span (about 6 feet 9 inches). Either way, a huge, heavily armed warrior.
- **Shepherd's Judgment:** vipers in the rocks. Hedgehogs too.
- **5 frightened soldiers** pinned behind rocks out in no-man's land. Lift them and they run back up the hill.
- **Scroll:** **Psalm 3:6**: I will not fear though tens of thousands assail me. (A psalm of David.)
- **The One:** a lamb that wandered right out into the open ground. Grab it between volleys.

### 6-3 · The Water Carriers — *the streambed*
- **Story:** the camp is running out of water. The water carriers have to go down to the stream, but a **Philistine watchtower** has been rolled up to the edge of the valley, and its archers fire on anyone who goes near the water.
- **The Water captain** *(made up)*:
  > "My men won't go down there. I don't blame them."
  - 🧭 Story: lead the water carriers down to the pools and back.
- **Level:** down into the streambed: smooth stones, dry pools, a few deep pools still holding water, reeds, terebinth roots. **Escort the water carriers** (3 of them, each carrying a jar) like the sheep line. The tower's archers fire from the far side. Vipers and scorpions under the stones.
- **Shammah comes along** and fills a jar too. At the brothers' fire before the stage:
  > "The streambed's full of good stones, you know. Round ones."
  - (Foreshadowing the five smooth stones in World 7.)
- **Abinadab's counsel** (👁️ tier 1, for the boss):
  > "Those towers are top-heavy. Knock the pins out of the front wheels and it'll lean. Lean it far enough and it goes over."
- **5 frightened soldiers:** the water carriers who refused to go. Lift them and they join the line.
- **Scroll:** **Psalm 23:2**: he leads me beside quiet waters.
- **The One:** in the reeds at the deepest pool, reached by a flip across the water.

### 6-4 · The Tower's Shadow — *toward the tower*
- **Level:** along the streambed toward the tower, then up the bank under it. The tower **rolls forward slowly** along the edge of the valley as you go, and its shadow falls across the level. Archers' volleys get tighter. Philistine skirmishers come down to block the path.
- **5 frightened soldiers** in a forward trench, too scared to move. Lift them, and they're the ones who cover you in the boss fight.
- **Scroll:** **Deuteronomy 31:6**: be strong and courageous; the LORD your God goes with you.
- **The One:** under the tower's ramp, at the very end of the stage.

### BOSS · The Philistine Watchtower (end of 6-4)
**Invented:** siege towers are a real ancient weapon; this one, in this valley, is made up. It's a **structure**, not another big soldier, and **nobody dies**: when it goes over, the crew climb down the back and run.

**The tower:** three floors of rough planks on four big wheels, a leather-covered front, rope ladders down the sides. Archers on the first two floors, **slingers** on the top floor.

**Phase 1 — The archers.** Archers lean out of the windows on floors 1 and 2 to fire. Tell: a window's shutter swings open. **Quick-release** shots into an open window knock that archer's bow away. 4 windows. Meanwhile, **lifted soldiers** throw stones from the Israelite slope to draw the archers' fire (more Courage, more cover).
**Phase 2 — The wheels.** With tier-1 counsel (Abinadab), the **wheel pins** on the front wheels glint. Each pin takes a **charged shot**. The tower jolts and leans a bit after each one. Philistine skirmishers run out to block you; drive them off.
**Phase 3 — The top.** The tower is leaning but still standing. Climb the **rope ladder** on the side (double jump between rungs that have been cut) to the top floor, where the slingers are. **Their stones and yours:** a charged shot knocks an incoming stone out of the air. Fire at the top beam; the lean grows; the crew jump down the back and run. **The tower goes over with a huge crash and a cloud of dust.**

**Counsel tier 2** (Abinadab: *"Sit down. Tell me what happened."*): shutters stay open longer, the wheel pins take 2 charged shots instead of 3 total, and +1 heart.

### End of World 6 — before Saul (reflection scene)
1. The water carriers come up the hill with full jars. The soldiers who were hiding are cheering. **Word of what David has been saying reaches Saul, and Saul sends for him** (17:31).
2. **Saul's tent.** Saul, tall and grey-bearded, with his commanders. David: *"Let no one lose heart on account of this Philistine. Your servant will go and fight him."* (17:32)
3. Saul: *you are not able; you're only a young man, and he has been a warrior from his youth* (17:33).
4. **David answers with what the player has lived** (17:34–37):
   - *"When a lion or a bear came and carried off a sheep…"* The screen shows a **replay of the player's own lion fight from World 1**, in pixel flashback.
   - *"…I went after it, struck it and rescued the sheep."* The **bear fight from World 2** flashes in.
   - *"The LORD who rescued me from the paw of the lion and the paw of the bear will rescue me from the hand of this Philistine."* (17:37: the verse World 1 ended on.)
5. Saul, after a long pause: *"Go, and the LORD be with you."* (17:37)
6. **Gift:** outside the tent, Shammah gives David a **new shepherd's bag** with a pouch in it. *"For your stones."* (Sets up 17:40 in World 7. Effect: carries the special stones found from now on.)
7. David plays. David's song, now with a fourth part.
8. World code.

### World 6 — summary table
| Stage | New thing | Lost things | People | Scroll |
|---|---|---|---|---|
| 6-1 | Lifting soldiers with the harp; asking questions; Eliab's rebuke | 5 soldiers + The One | soldiers, **Eliab**, Shammah | Proverbs 15:1 |
| 6-2 | Volley dodging; Goliath seen in full; Goliath's Field Guide card | 5 soldiers + The One | — | Psalm 3:6 |
| 6-3 | Escort the water carriers through the streambed | 5 soldiers + The One | Water captain, **Shammah**, **Abinadab** | Psalm 23:2 |
| 6-4 end | The rolling tower's shadow; **Boss:** the Philistine Watchtower | 5 soldiers + The One | **Abinadab** | Deuteronomy 31:6 |

### World 6 — who gives what
| Where | Person | Card | Gift / effect |
|---|---|---|---|
| 6-1 | Soldiers | 📜 Journal: the king's reward (17:25) | |
| 6-1 | Shammah | 📜 Journal: why Eliab is angry | |
| 6-2 | (watching Goliath) | 📜 Goliath's Field Guide card (17:4–7) | |
| Map: 🙋 Water captain | Water captain *(made up)* | 🧭 Story: lead the water carriers | Trust: a shortcut path down to 6-4 |
| Map: 🔥 Brothers' fire | Shammah | 🗝️ "The streambed's full of good stones" | Rest + harp |
| 6-3 | Abinadab | 👁️ Warning (tier 1): knock out the wheel pins | |
| 6-4 | Abinadab | Tier 2 after a loss: longer shutter windows, weaker pins, +1 heart | |
| All of World 6 | Lifted soldiers | | Cover fire in the tower fight; they appear in the crowd in World 8 |
| End of World 6 | Shammah | | **Gift:** a shepherd's bag for the stones |

**Sprite list for this world:** [SPRITES.md](SPRITES.md#world-6--the-valley-of-elah)

---

## 6. Worlds 7–8 (outline only — to be detailed one at a time)

| # | World | Bible | Unlock | Boss (draft) |
|---|---|---|---|---|
| 2 | The Wilderness | 1 Sam 17:34–36 | Charged sling | The Bear. **Detailed in §5b.** |
| 3 | The Anointing | 1 Sam 16:1–13 | Aerial flip | **The Wild Ox. Detailed in §5c.** A charging wild ox in a storm on the way home. A real animal of the region; "save me from the horns of the wild oxen" (Psalm 22:21). |
| 4 | The King's Court | 1 Sam 16:14–23 | Quick release | **Saul's Torment. Detailed in §5d.** The only boss you win with music, not the sling: a harp rhythm fight while dodging the shadows of Saul's distress. Saul is never the enemy; his torment is. |
| 5 | The Road to the Valley | 1 Sam 17:1–24 | Double jump | **The Philistine Chariot. Detailed in §5e.** A chase along the supply road. The Philistines had chariots (1 Sam 13:5). A vehicle fight, not another big soldier. |
| 6 | The Valley of Elah | 1 Sam 17:25–37 | — (harp lifts soldiers) | **The Philistine Watchtower. Detailed in §5f.** Climb a wooden siege tower while archers and slingers fire from it. Eliab's rebuke (17:28) happens in this world. |
| 7 | The Giant's Shadow | 1 Sam 17:38–40 | — | **Proposed: Goliath's Shield-Bearer.** He's in the text: "his shield bearer went ahead of him" (1 Sam 17:7, 41). A huge shield wall you have to get around. Also the Saul's armor stage (you *win* by taking it off) and the five smooth stones. |
| 8 | David & Goliath | 1 Sam 17:41–50 | — | **Goliath:** dodge and survive; the final hit is one charged stone (you carry 5). |

**Story order check:** Saul throwing his spear at David (1 Sam 18–19) and Jonathan's friendship (1 Sam 18:1) happen **after** Goliath. They stay out of this game (they're sequel material).

---

## 7. Open questions
- [ ] Sage's name: "Old Hanan" is a placeholder.
- [ ] Hearts: start with 3, 4th from World 1? Max hearts?
- [ ] Lives and continues: classic lives, or infinite retries from the campfire (kinder for kids)?
- [ ] Screen size and sprite scale: decide after seeing Glen's GPT sprite sheets.
- [ ] World 7's lost one.
- [ ] Is there a pastor willing to record a short reflection on the parable (with written permission)?
- [ ] Verify every NIV quotation word-for-word before it ships, and keep the total well inside Biblica's free-use limit.

## 8. Sprite sheet rules (for Photoshop)

The full list of sprites needed, world by world, is in [SPRITES.md](SPRITES.md).
- One animation per PNG, frames in a **single row**, no gaps.
- Every frame of David is the **same cell size** (decide once, never change).
- **Feet on the same pixel row** in every frame; body centred on the same spot.
- **Faces right only.** The game mirrors him.
- **Real transparency:** delete any fake grey checkerboard GPT paints in. Easiest: have GPT draw on solid magenta #FF00FF, then Select > Color Range > Delete (see ART_PROMPTS.md).
- Resize only with **Nearest Neighbor (hard edges)**.
- File names: `david_run.png`, `david_throw.png`, `lion_pounce.png`, …
