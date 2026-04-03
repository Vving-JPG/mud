/**
 * 物品数据类
 * 定义游戏中物品的基础数据结构
 */

class Item {
    /**
     * 创建物品
     * @param {string} id - 物品ID
     * @param {string} name - 物品名称
     * @param {string} type - 物品类型
     */
    constructor(id, name, type) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.description = '';
        this.stackable = false;
        this.maxStack = 1;
        this.quantity = 1;
    }
}

/**
 * 消耗品类
 */
class Consumable extends Item {
    /**
     * 创建消耗品
     * @param {string} id - 物品ID
     * @param {string} name - 物品名称
     * @param {number} healAmount - 恢复生命值
     * @param {number} mpAmount - 恢复法力值
     * @param {string} description - 物品描述
     */
    constructor(id, name, healAmount = 0, mpAmount = 0, description = '') {
        super(id, name, 'consumable');
        this.healAmount = healAmount;
        this.mpAmount = mpAmount;
        this.description = description;
        this.stackable = true;
        this.maxStack = 99;
    }
}

/**
 * 装备类
 */
class Equipment extends Item {
    /**
     * 创建装备
     * @param {string} id - 物品ID
     * @param {string} name - 物品名称
     * @param {string} slot - 装备槽位
     */
    constructor(id, name, slot) {
        super(id, name, 'equipment');
        this.slot = slot;
        this.attackBonus = 0;
        this.defenseBonus = 0;
        this.hpBonus = 0;
        this.mpBonus = 0;
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Item, Consumable, Equipment };
}
