"use strict";

/**
 * 体素系统
 * 管理地图生成和体素操作
 */

class VoxelSystem {
    /**
     * 创建体素系统
     */
    constructor() {
        this.currentMap = null;
        this._floorLevel = 1;
    }

    /**
     * 生成地图
     * @param {string} mapId - 地图ID
     * @param {number} floorLevel - 楼层等级
     * @returns {MapData} 生成的地图
     */
    generateMap(mapId, floorLevel) {
        this._floorLevel = floorLevel;
        this.currentMap = new MapData(
            GameConstants.MAP_WIDTH,
            GameConstants.MAP_HEIGHT
        );

        // 触发地图生成事件
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('map_generated', mapId, this.currentMap);
        }

        return this.currentMap;
    }

    /**
     * 获取当前楼层
     * @returns {number} 楼层数
     */
    getFloorLevel() {
        return this._floorLevel;
    }

    /**
     * 获取指定位置的体素类型
     * @param {Object} pos - 位置坐标 {x, y, z}
     * @returns {number} 体素类型
     */
    getVoxelType(pos) {
        if (!this.currentMap) return GameEnums.VoxelType.AIR;
        return this.currentMap.getVoxel(pos);
    }

    /**
     * 设置指定位置的体素类型
     * @param {Object} pos - 位置坐标 {x, y, z}
     * @param {number} type - 体素类型
     */
    setVoxelType(pos, type) {
        if (!this.currentMap) return;
        this.currentMap.setVoxel(pos, type);
    }

    /**
     * 检查位置是否可行走
     * @param {Object} pos - 位置坐标 {x, y, z}
     * @returns {boolean} 是否可行走
     */
    isWalkable(pos) {
        if (!this.currentMap) return false;
        return this.currentMap.isWalkable(pos);
    }

    /**
     * 获取出生位置
     * @returns {Object} 出生位置 {x, y, z}
     */
    getSpawnPosition() {
        if (!this.currentMap) return { x: 0, y: 0, z: 0 };
        return WorldGenerator.findSpawnPosition(this.currentMap);
    }

    /**
     * 获取地面物品
     * @param {Object} pos - 位置坐标 {x, y, z}
     * @returns {Object|null} 地面物品
     */
    getGroundItem(pos) {
        if (!this.currentMap) return null;
        const key = `${pos.x},${pos.z}`;
        return this.currentMap.ground_items[key] || null;
    }

    /**
     * 放置地面物品
     * @param {Object} pos - 位置坐标 {x, y, z}
     * @param {Object} item - 物品数据
     */
    placeGroundItem(pos, item) {
        if (!this.currentMap) return;
        const key = `${pos.x},${pos.z}`;
        this.currentMap.ground_items[key] = item;
    }

    /**
     * 移除地面物品
     * @param {Object} pos - 位置坐标 {x, y, z}
     */
    removeGroundItem(pos) {
        if (!this.currentMap) return;
        const key = `${pos.x},${pos.z}`;
        delete this.currentMap.ground_items[key];
    }

    /**
     * 重置系统
     */
    reset() {
        this.currentMap = null;
        this._floorLevel = 1;
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoxelSystem;
}
