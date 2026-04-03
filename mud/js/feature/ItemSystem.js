"use strict";

/**
 * 物品系统
 * 管理玩家背包和物品使用
 */

class ItemSystem {
    /**
     * 创建物品系统
     */
    constructor() {
        this.playerInventory = [];
        this.playerEquipment = {};
        this._items = {};
        this._nextItemUid = 1;
    }

    /**
     * 创建物品
     * @param {Object} itemData - 物品数据
     * @returns {Object} 物品实例
     */
    createItem(itemData) {
        const uid = this._nextItemUid++;
        const item = {
            uid: uid,
            ...itemData
        };
        this._items[uid] = item;
        return item;
    }

    /**
     * 添加物品到背包
     * @param {Object} item - 物品实例
     * @returns {boolean} 是否添加成功
     */
    addToInventory(item) {
        // 检查是否可堆叠
        if (item.stackable) {
            const existing = this.playerInventory.find(i => i.name === item.name);
            if (existing && existing.quantity < existing.maxStack) {
                existing.quantity += item.quantity;
                return true;
            }
        }

        if (this.playerInventory.length < 20) {
            this.playerInventory.push(item);
            return true;
        }
        return false;
    }

    /**
     * 从背包移除物品
     * @param {number} itemUid - 物品UID
     * @returns {boolean} 是否移除成功
     */
    removeFromInventory(itemUid) {
        const index = this.playerInventory.findIndex(item => item.uid === itemUid);
        if (index >= 0) {
            this.playerInventory.splice(index, 1);
            delete this._items[itemUid];
            return true;
        }
        return false;
    }

    /**
     * 使用物品
     * @param {number} itemUid - 物品UID
     * @param {Entity} target - 使用目标
     * @returns {boolean} 是否使用成功
     */
    useItem(itemUid, target) {
        const item = this._items[itemUid];
        if (!item || item.type !== 'consumable') return false;

        // 应用效果
        if (item.healAmount > 0) {
            target.heal(item.healAmount);
        }
        if (item.mpAmount > 0) {
            target.restoreMp(item.mpAmount);
        }

        // 减少数量
        item.quantity--;
        if (item.quantity <= 0) {
            this.removeFromInventory(itemUid);
        }

        // 触发事件
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('item_used', item, target);
        }

        return true;
    }

    /**
     * 装备物品
     * @param {number} itemUid - 物品UID
     * @returns {boolean} 是否装备成功
     */
    equipItem(itemUid) {
        const item = this._items[itemUid];
        if (!item || item.type !== 'equipment') return false;

        // 卸下当前装备
        if (this.playerEquipment[item.slot]) {
            this.addToInventory(this.playerEquipment[item.slot]);
        }

        // 装备新物品
        this.playerEquipment[item.slot] = item;
        this.removeFromInventory(itemUid);

        return true;
    }

    /**
     * 获取装备总加成
     * @returns {Object} 属性加成
     */
    getTotalEquipmentBonus() {
        const bonus = {
            strength: 0,
            dexterity: 0,
            intelligence: 0,
            vitality: 0,
            attack: 0,
            defense: 0
        };

        for (const slot in this.playerEquipment) {
            const item = this.playerEquipment[slot];
            if (item) {
                bonus.attack += item.attackBonus || 0;
                bonus.defense += item.defenseBonus || 0;
                bonus.strength += item.strBonus || 0;
                bonus.dexterity += item.dexBonus || 0;
                bonus.intelligence += item.intBonus || 0;
                bonus.vitality += item.vitBonus || 0;
            }
        }

        return bonus;
    }

    /**
     * 重置系统
     */
    reset() {
        this.playerInventory = [];
        this.playerEquipment = {};
        this._items = {};
        this._nextItemUid = 1;
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ItemSystem;
}
