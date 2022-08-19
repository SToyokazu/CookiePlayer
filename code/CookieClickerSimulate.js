//施設と強化のシミュレートが出来ればOK 

let SimulateObjects = [];
let SimulateUpgrades = [];

var SimulateHas = function (what) {
    var it = SimulateUpgrades[what];
    if (Game.ascensionMode == 1 && (it.pool == 'prestige' || it.tier == 'fortune')) return 0;
    return (it ? it.bought : 0);
}

var SimulateGetTieredCpsMult = function (me) {
    var mult = 1;
    for (var i in me.tieredUpgrades) {
        if (!Game.Tiers[me.tieredUpgrades[i].tier].special && SimulateHas(me.tieredUpgrades[i].name)) {
            var tierMult = 2;
            //unshackled
            if (Game.ascensionMode != 1 && Game.Has(me.unshackleUpgrade) && SimulateHas(Game.Tiers[me.tieredUpgrades[i].tier].unshackleUpgrade)) tierMult += me.id == 1 ? 0.5 : (20 - me.id) * 0.1;
            mult *= tierMult;
        }
    }
    for (var i in me.synergies) {
        var syn = me.synergies[i];
        if (SimulateHas(syn.name)) {
            if (syn.buildingTie1.name == me.name) mult *= (1 + 0.05 * syn.buildingTie2.amount);
            else if (syn.buildingTie2.name == me.name) mult *= (1 + 0.001 * syn.buildingTie1.amount);
        }
    }
    if (me.fortune && SimulateHas(me.fortune.name)) mult *= 1.07;
    if (me.grandma && SimulateHas(me.grandma.name)) mult *= (1 + SimulateObjects['Grandma'].amount * 0.01 * (1 / (me.id - 1)));
    return mult;
}

var SimulateGetHeavenlyMultiplier = function () {
    var heavenlyMult = 0;
    if (SimulateHas('Heavenly chip secret')) heavenlyMult += 0.05;
    if (SimulateHas('Heavenly cookie stand')) heavenlyMult += 0.20;
    if (SimulateHas('Heavenly bakery')) heavenlyMult += 0.25;
    if (SimulateHas('Heavenly confectionery')) heavenlyMult += 0.25;
    if (SimulateHas('Heavenly key')) heavenlyMult += 0.25;
    heavenlyMult *= 1 + Game.auraMult('Dragon God') * 0.05;
    if (SimulateHas('Lucky digit')) heavenlyMult *= 1.01;
    if (SimulateHas('Lucky number')) heavenlyMult *= 1.01;
    if (SimulateHas('Lucky payout')) heavenlyMult *= 1.01;
    if (Game.hasGod) {
        var godLvl = Game.hasGod('creation');
        if (godLvl == 1) heavenlyMult *= 0.7;
        else if (godLvl == 2) heavenlyMult *= 0.8;
        else if (godLvl == 3) heavenlyMult *= 0.9;
    }
    return heavenlyMult;
}

var SimulateGetVeilBoost = function () {
    var n = 0.5;
    if (SimulateHas('Reinforced membrane')) n += 0.1;
    if (SimulateHas('Delicate touch')) n += 0.05;
    if (SimulateHas('Steadfast murmur')) n += 0.05;
    if (SimulateHas('Glittering edge')) n += 0.05;
    return n;
}

//export function SimulateObjectsInitialize(id, additionalAmount) {
function SimulateObjectsInitialize(id, additionalAmount) {
    for (var i in Game.Objects) {
        let objects = {};
        objects.name = Game.Objects[i].name;
        objects.id = Game.Objects[i].id;
        objects.amount = Game.Objects[i].amount;
        objects.cps = Game.Objects[i].cps;
        objects.level = Game.Objects[i].level;

        if (Game.Objects[i].id == id) {
            objects[i].amount += additionalAmount;
        }

        SimulateObjects[i] = objects;
    }

    SimulateObjects['Cursor'].cps = function (me) {
        var add = 0;
        if (SimulateHas('Thousand fingers')) add += 0.1;
        if (SimulateHas('Million fingers')) add *= 5;
        if (SimulateHas('Billion fingers')) add *= 10;
        if (SimulateHas('Trillion fingers')) add *= 20;
        if (SimulateHas('Quadrillion fingers')) add *= 20;
        if (SimulateHas('Quintillion fingers')) add *= 20;
        if (SimulateHas('Sextillion fingers')) add *= 20;
        if (SimulateHas('Septillion fingers')) add *= 20;
        if (SimulateHas('Octillion fingers')) add *= 20;
        if (SimulateHas('Nonillion fingers')) add *= 20;
        if (SimulateHas('Decillion fingers')) add *= 20;
        if (SimulateHas('Unshackled cursors')) add *= 25;
        var mult = 1;
        var num = 0;
        for (var i in SimulateObjects) { if (SimulateObjects[i].name != 'Cursor') num += SimulateObjects[i].amount; }
        add = add * num;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS('Cursor');
        mult *= Game.eff('cursorCps');
        return Game.ComputeCps(0.1, SimulateHas('Reinforced index finger') + SimulateHas('Carpal tunnel prevention cream') + SimulateHas('Ambidextrous'), add) * mult;
    }

    SimulateObjects['Grandma'].cps = function (me) {
        var mult = 1;
        for (var i in Game.GrandmaSynergies) {
            if (SimulateHas(Game.GrandmaSynergies[i])) mult *= 2;
        }
        if (SimulateHas('Bingo center/Research facility')) mult *= 4;
        if (SimulateHas('Ritual rolling pins')) mult *= 2;
        if (SimulateHas('Naughty list')) mult *= 2;

        if (SimulateHas('Elderwort biscuits')) mult *= 1.02;

        mult *= Game.eff('grandmaCps');

        if (SimulateHas('Cat ladies')) {
            for (var i = 0; i < Game.UpgradesByPool['kitten'].length; i++) {
                if (SimulateHas(Game.UpgradesByPool['kitten'][i].name)) mult *= 1.29;
            }
        }

        mult *= SimulateGetTieredCpsMult(me);

        var add = 0;
        if (SimulateHas('One mind')) add += SimulateObjects['Grandma'].amount * 0.02;
        if (SimulateHas('Communal brainsweep')) add += SimulateObjects['Grandma'].amount * 0.02;
        if (SimulateHas('Elder Pact')) add += SimulateObjects['Portal'].amount * 0.05;

        var num = 0;
        for (var i in SimulateObjects) { if (SimulateObjects[i].name != 'Grandma') num += SimulateObjects[i].amount; }
        //if (Game.hasAura('Elder Battalion')) mult*=1+0.01*num;
        mult *= 1 + Game.auraMult('Elder Battalion') * 0.01 * num;

        mult *= Game.magicCpS(me.name);

        return (me.baseCps + add) * mult;
    }

    SimulateObjects['Farm'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Mine'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Factory'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Bank'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Temple'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Wizard tower'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Shipment'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Alchemy lab'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Portal'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Time machine'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Antimatter condenser'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Prism'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Chancemaker'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Fractal engine'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Javascript console'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Idleverse'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

    SimulateObjects['Cortex baker'].cps = function (me) {
        var mult = 1;
        mult *= SimulateGetTieredCpsMult(me);
        mult *= Game.magicCpS(me.name);
        return me.baseCps * mult;
    }

}

//export function SimulateUpgradesInitialize(id) {
function SimulateUpgradesInitialize(id) {
    for (var i in Game.Upgrades) {
        SimulateUpgrades[i] = Game.Upgrades[i];

        if (Game.Upgrades[i].id == id) {
            SimulateUpgrades[i].bought = 1;
        }
    }

    SimulateUpgrades['Pure heart biscuits'].power = function () {
        var pow = 2;
        if (SimulateHas('Starlove')) pow = 3;
        if (Game.hasGod) {
            var godLvl = Game.hasGod('seasons');
            if (godLvl == 1) pow *= 1.3;
            else if (godLvl == 2) pow *= 1.2;
            else if (godLvl == 3) pow *= 1.1;
        }
        return pow;
    }

    SimulateUpgrades['Ardent heart biscuits'].power = function () {
        var pow = 2;
        if (SimulateHas('Starlove')) pow = 3;
        if (Game.hasGod) {
            var godLvl = Game.hasGod('seasons');
            if (godLvl == 1) pow *= 1.3;
            else if (godLvl == 2) pow *= 1.2;
            else if (godLvl == 3) pow *= 1.1;
        }
        return pow;
    }

    SimulateUpgrades['Sour heart biscuits'].power = function () {
        var pow = 2;
        if (SimulateHas('Starlove')) pow = 3;
        if (Game.hasGod) {
            var godLvl = Game.hasGod('seasons');
            if (godLvl == 1) pow *= 1.3;
            else if (godLvl == 2) pow *= 1.2;
            else if (godLvl == 3) pow *= 1.1;
        }
        return pow;
    }

    SimulateUpgrades['Weeping heart biscuits'].power = function () {
        var pow = 2;
        if (SimulateHas('Starlove')) pow = 3;
        if (Game.hasGod) {
            var godLvl = Game.hasGod('seasons');
            if (godLvl == 1) pow *= 1.3;
            else if (godLvl == 2) pow *= 1.2;
            else if (godLvl == 3) pow *= 1.1;
        }
        return pow;
    }

    SimulateUpgrades['Golden heart biscuits'].power = function () {
        var pow = 2;
        if (SimulateHas('Starlove')) pow = 3;
        if (Game.hasGod) {
            var godLvl = Game.hasGod('seasons');
            if (godLvl == 1) pow *= 1.3;
            else if (godLvl == 2) pow *= 1.2;
            else if (godLvl == 3) pow *= 1.1;
        }
        return pow;
    }

    SimulateUpgrades['Eternal heart biscuits'].power = function () {
        var pow = 2;
        if (SimulateHas('Starlove')) pow = 3;
        if (Game.hasGod) {
            var godLvl = Game.hasGod('seasons');
            if (godLvl == 1) pow *= 1.3;
            else if (godLvl == 2) pow *= 1.2;
            else if (godLvl == 3) pow *= 1.1;
        }
        return pow;
    }

    SimulateUpgrades['Prism heart biscuits'].power = function () {
        var pow = 2;
        if (SimulateHas('Starlove')) pow = 3;
        if (Game.hasGod) {
            var godLvl = Game.hasGod('seasons');
            if (godLvl == 1) pow *= 1.3;
            else if (godLvl == 2) pow *= 1.2;
            else if (godLvl == 3) pow *= 1.1;
        }
        return pow;
    }

    SimulateUpgrades['Sugar crystal cookies'].power = function () {
        var n = 5;
        for (var i in SimulateObjects) {
            if (SimulateObjects[i].level >= 10) n++;
        }
        return n;
    }
}

//export function SimulateGains() {
function SimulateGains() {
    let cookiesPs = 0;
    var mult = 1;

    if (Game.ascensionMode != 1) mult += parseFloat(Game.prestige) * 0.01 * Game.heavenlyPower * SimulateGetHeavenlyMultiplier();

    mult *= Game.eff('cps');

    if (SimulateHas('Heralds') && Game.ascensionMode != 1) mult *= (1 + 0.01 * Game.heralds);

    for (var i in Game.cookieUpgrades) {
        var me = Game.cookieUpgrades[i];
        if (SimulateHas(me.name)) {
            mult *= (1 + (typeof (me.power) === 'function' ? me.power(me) : me.power) * 0.01);
        }
    }

    if (SimulateHas('Specialized chocolate chips')) mult *= 1.01;
    if (SimulateHas('Designer cocoa beans')) mult *= 1.02;
    if (SimulateHas('Underworld ovens')) mult *= 1.03;
    if (SimulateHas('Exotic nuts')) mult *= 1.04;
    if (SimulateHas('Arcane sugar')) mult *= 1.05;

    if (SimulateHas('Increased merriness')) mult *= 1.15;
    if (SimulateHas('Improved jolliness')) mult *= 1.15;
    if (SimulateHas('A lump of coal')) mult *= 1.01;
    if (SimulateHas('An itchy sweater')) mult *= 1.01;
    if (SimulateHas('Santa\'s dominion')) mult *= 1.2;

    if (SimulateHas('Fortune #100')) mult *= 1.01;
    if (SimulateHas('Fortune #101')) mult *= 1.07;

    if (SimulateHas('Dragon scale')) mult *= 1.03;

    var buildMult = 1;
    if (Game.hasGod) {
        var godLvl = Game.hasGod('asceticism');
        if (godLvl == 1) mult *= 1.15;
        else if (godLvl == 2) mult *= 1.1;
        else if (godLvl == 3) mult *= 1.05;

        var godLvl = Game.hasGod('ages');
        if (godLvl == 1) mult *= 1 + 0.15 * Math.sin((Date.now() / 1000 / (60 * 60 * 3)) * Math.PI * 2);
        else if (godLvl == 2) mult *= 1 + 0.15 * Math.sin((Date.now() / 1000 / (60 * 60 * 12)) * Math.PI * 2);
        else if (godLvl == 3) mult *= 1 + 0.15 * Math.sin((Date.now() / 1000 / (60 * 60 * 24)) * Math.PI * 2);

        var godLvl = Game.hasGod('decadence');
        if (godLvl == 1) buildMult *= 0.93;
        else if (godLvl == 2) buildMult *= 0.95;
        else if (godLvl == 3) buildMult *= 0.98;

        var godLvl = Game.hasGod('industry');
        if (godLvl == 1) buildMult *= 1.1;
        else if (godLvl == 2) buildMult *= 1.06;
        else if (godLvl == 3) buildMult *= 1.03;

        var godLvl = Game.hasGod('labor');
        if (godLvl == 1) buildMult *= 0.97;
        else if (godLvl == 2) buildMult *= 0.98;
        else if (godLvl == 3) buildMult *= 0.99;
    }

    if (SimulateHas('Santa\'s legacy')) mult *= 1 + (Game.santaLevel + 1) * 0.03;


    var milkProgress = Game.AchievementsOwned / 25;
    var milkMult = 1;
    if (SimulateHas('Santa\'s milk and cookies')) milkMult *= 1.05;

    milkMult *= 1 + Game.auraMult('Breath of Milk') * 0.05;
    if (Game.hasGod) {
        var godLvl = Game.hasGod('mother');
        if (godLvl == 1) milkMult *= 1.1;
        else if (godLvl == 2) milkMult *= 1.05;
        else if (godLvl == 3) milkMult *= 1.03;
    }
    milkMult *= Game.eff('milk');

    var catMult = 1;

    if (SimulateHas('Kitten helpers')) catMult *= (1 + milkProgress * 0.1 * milkMult);
    if (SimulateHas('Kitten workers')) catMult *= (1 + milkProgress * 0.125 * milkMult);
    if (SimulateHas('Kitten engineers')) catMult *= (1 + milkProgress * 0.15 * milkMult);
    if (SimulateHas('Kitten overseers')) catMult *= (1 + milkProgress * 0.175 * milkMult);
    if (SimulateHas('Kitten managers')) catMult *= (1 + milkProgress * 0.2 * milkMult);
    if (SimulateHas('Kitten accountants')) catMult *= (1 + milkProgress * 0.2 * milkMult);
    if (SimulateHas('Kitten specialists')) catMult *= (1 + milkProgress * 0.2 * milkMult);
    if (SimulateHas('Kitten experts')) catMult *= (1 + milkProgress * 0.2 * milkMult);
    if (SimulateHas('Kitten consultants')) catMult *= (1 + milkProgress * 0.2 * milkMult);
    if (SimulateHas('Kitten assistants to the regional manager')) catMult *= (1 + milkProgress * 0.175 * milkMult);
    if (SimulateHas('Kitten marketeers')) catMult *= (1 + milkProgress * 0.15 * milkMult);
    if (SimulateHas('Kitten analysts')) catMult *= (1 + milkProgress * 0.125 * milkMult);
    if (SimulateHas('Kitten executives')) catMult *= (1 + milkProgress * 0.115 * milkMult);
    if (SimulateHas('Kitten admins')) catMult *= (1 + milkProgress * 0.11 * milkMult);
    if (SimulateHas('Kitten angels')) catMult *= (1 + milkProgress * 0.1 * milkMult);
    if (SimulateHas('Fortune #103')) catMult *= (1 + milkProgress * 0.05 * milkMult);

    for (var i in SimulateObjects) {
        var me = SimulateObjects[i];
        me.storedCps = me.cps(me);
        if (Game.ascensionMode != 1) me.storedCps *= (1 + me.level * 0.01) * buildMult;
        if (me.id == 1 && SimulateHas('Milkhelp&reg; lactose intolerance relief tablets')) me.storedCps *= 1 + 0.05 * milkProgress * milkMult;//this used to be "me.storedCps*=1+0.1*Math.pow(catMult-1,0.5)" which was. hmm
        me.storedTotalCps = me.amount * me.storedCps;
        cookiesPs += me.storedTotalCps;
    }

    if (SimulateHas('"egg"')) { cookiesPs += 9; }//"egg"

    mult *= catMult;

    var eggMult = 1;
    if (SimulateHas('Chicken egg')) eggMult *= 1.01;
    if (SimulateHas('Duck egg')) eggMult *= 1.01;
    if (SimulateHas('Turkey egg')) eggMult *= 1.01;
    if (SimulateHas('Quail egg')) eggMult *= 1.01;
    if (SimulateHas('Robin egg')) eggMult *= 1.01;
    if (SimulateHas('Ostrich egg')) eggMult *= 1.01;
    if (SimulateHas('Cassowary egg')) eggMult *= 1.01;
    if (SimulateHas('Salmon roe')) eggMult *= 1.01;
    if (SimulateHas('Frogspawn')) eggMult *= 1.01;
    if (SimulateHas('Shark egg')) eggMult *= 1.01;
    if (SimulateHas('Turtle egg')) eggMult *= 1.01;
    if (SimulateHas('Ant larva')) eggMult *= 1.01;
    if (SimulateHas('Century egg')) {
        //the boost increases a little every day, with diminishing returns up to +10% on the 100th day
        var day = Math.floor((Date.now() - Game.startDate) / 1000 / 10) * 10 / 60 / 60 / 24;
        day = Math.min(day, 100);
        eggMult *= 1 + (1 - Math.pow(1 - day / 100, 3)) * 0.1;
    }

    mult *= eggMult;

    if (SimulateHas('Sugar baking')) mult *= (1 + Math.min(100, Game.lumps) * 0.01);

    mult *= 1 + Game.auraMult('Radiant Appetite');

    var n = Game.shimmerTypes['golden'].n;
    var auraMult = Game.auraMult('Dragon\'s Fortune');
    for (var i = 0; i < n; i++) { mult *= 1 + auraMult * 1.23; }

    name = Game.bakeryName.toLowerCase();
    if (name == 'orteil') mult *= 0.99;
    else if (name == 'ortiel') mult *= 0.98;//or so help me

    if (SimulateHas('Elder Covenant')) mult *= 0.95;

    if (SimulateHas('Golden switch [off]')) {
        var goldenSwitchMult = 1.5;
        if (SimulateHas('Residual luck')) {
            var upgrades = Game.goldenCookieUpgrades;
            for (var i in upgrades) { if (SimulateHas(upgrades[i])) goldenSwitchMult += 0.1; }
        }
        mult *= goldenSwitchMult;
    }
    if (SimulateHas('Shimmering veil [off]')) {
        mult *= 1 + SimulateGetVeilBoost();
    }
    if (SimulateHas('Magic shenanigans')) mult *= 1000;
    if (SimulateHas('Occult obstruction')) mult *= 0;


    cookiesPs = Game.runModHookOnValue('cps', cookiesPs);

    for (var i in Game.buffs) {
        if (typeof Game.buffs[i].multCpS !== 'undefined') mult *= Game.buffs[i].multCpS;
    }

    cookiesPs *= mult;

    return cookiesPs;
}