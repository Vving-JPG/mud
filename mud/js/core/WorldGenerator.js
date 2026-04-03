"use strict";

/**
     * 世界生成器
     * 负责生成游戏世界内容
     */
class WorldGenerator {
    /**
     * 查找有效的出生位置
     * @param {MapData} mapData - 地图数据
     * @returns {Object} 出生位置坐标 {x, y, z}
     */
    static findSpawnPosition(mapData) {
        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            const x = Math.floor(Math.random() * mapData.size.x);
            const z = Math.floor(Math.random() * mapData.size.z);
            const pos = { x, y: 0, z };

            if (mapData.isWalkable(pos)) {
                return pos;
            }
            attempts++;
        }

        // 默认返回中心位置
        return {
            x: Math.floor(mapData.size.x / 2),
            y: 0,
            z: Math.floor(mapData.size.z / 2)
        };
    }

    /**
     * 生成敌人配置
     * @param {number} floorLevel - 当前楼层
     * @returns {Object} 敌人配置
     */
    static generateEnemyConfig(floorLevel) {
        const enemyTypes = [
            { name: '野狼', str: 8, dex: 6, int: 3, vit: 8, luk: 3 },
            { name: '毒蛇', str: 5, dex: 4, int: 2, vit: 12, luk: 2 },
            { name: '蜘蛛', str: 4, dex: 12, int: 2, vit: 4, luk: 5 },
            { name: '妖蝠', str: 7, dex: 8, int: 4, vit: 6, luk: 4 },
            { name: '傀儡', str: 12, dex: 5, int: 3, vit: 10, luk: 3 }
        ];

        const template = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const level = Math.max(1, floorLevel + MathUtils.randInt(-1, 2));

        return {
            ...template,
            level
        };
    }

    /**
     * 生成物品配置
     * @param {number} floorLevel - 当前楼层
     * @returns {Object} 物品配置
     */
    static generateItemConfig(floorLevel) {
        const itemTypes = [
            { name: '灵草', type: 'herb', value: 10 },
            { name: '妖兽材料', type: 'material', value: 20 },
            { name: '灵石', type: 'currency', value: 50 },
            { name: '丹药', type: 'consumable', value: 30 }
        ];

        return itemTypes[Math.floor(Math.random() * itemTypes.length)];
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorldGenerator;
}
