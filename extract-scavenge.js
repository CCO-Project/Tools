// This script can execute on browser devtools.

/**
 * @typedef LocationOperationRewardCostLevel
 * @property {number} level
 */

/**
 * @typedef LocationOperationRewardItem
 * @property {string} itemType
 * @property {number} amount
 * @property {number} chance
 */

/**
 * @typedef LocationOperationReward
 * @property {{levels: LocationOperationRewardCostLevel[]}} costs
 * @property {{items: LocationOperationRewardItem[]}} reward
 */

/**
 * @typedef LocationOperationOption
 * @property {string} name
 * @property {LocationOperationReward} rewardConfig
 */

/**
 * @typedef LocationOperation
 * @property {LocationOperationOption} options
 */

/**
 * Extract all scavenge data to tsv string.
 * @param {LocationOperation[]} locationData
 * @returns {string}
 */
function extractScavengeList(locationData) {
    let result = "Scavenge Level\tAmmunition Part\t%\tMilitary Ammunition Part\t%\tMedical Tech Part\t%\tGC\t%\tLC\t%\tLRC\t%\tLLC\t%\tFactory Reset\t%\tGC\t%\tGIOT\t%\n";

    locationData.forEach(each => {
        if(each.options.name.startsWith("SCAVENGE")) {
            // require scavenge level
            const lvl = each.options.rewardConfig.costs.levels[0].level;

            // Basic
            const ap = each.options.rewardConfig.reward.items.filter(e => e.itemType === "AMMO_TECH_PART_1")[0];
            const map = each.options.rewardConfig.reward.items.filter(e => e.itemType === "AMMO_TECH_PART_2")[0];
            const mtp = each.options.rewardConfig.reward.items.filter(e => e.itemType === "MEDICAL_TECH_PARTS")[0];
            const gc = each.options.rewardConfig.reward.items.filter(e => e.itemType === "CLAN_RESOURCE")[0];
            
            // level 50 required
            // lootboxes' weight: 1000, 50, 5
            const lb1 = lvl > 50 ? [1, 0.02*1000/1055] : [0, 0];
            const lb2 = lvl > 50 ? [1, 0.02*50/1055] : [0, 0];
            const lb3 = lvl > 50 ? [1, 0.02*5/1055] : [0, 0];

            // level 50 required
            // other miscs' weight: 10, 100, 50
            const misc1 = lvl > 50 ? [1, 0.05*10/160] : [0, 0];
            const misc2 = lvl > 50 ? [1, 0.05*100/160] : [0, 0];
            const misc3 = lvl > 50 ? [1, 0.05*50/160] : [0, 0];

            result += `${lvl}\t${ap.amount}\t${ap.chance}\t${map.amount}\t${map.chance}\t${mtp.amount}\t${mtp.chance}\t${gc.amount}\t${gc.chance}\t${lb1[0]}\t${lb1[1]}\t${lb2[0]}\t${lb2[1]}\t${lb3[0]}\t${lb3[1]}\t${misc1[0]}\t${misc1[1]}\t${misc2[0]}\t${misc2[1]}\t${misc3[0]}\t${misc3[1]}\n`;
        }
    });

    return result;
}