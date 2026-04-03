"use strict";

/**
 * 位置信息UI
 * 显示当前位置描述
 */

class LocationInfo {
    /**
     * 创建位置信息UI
     */
    constructor() {
        this._nameEl = document.getElementById('location-name');
        this._descEl = document.getElementById('location-desc');
        this._coordsEl = document.getElementById('location-coords');

        this._locationNames = {
            [GameEnums.VoxelType.FLOOR]: '古洞通道',
            [GameEnums.VoxelType.WALL]: '岩壁',
            [GameEnums.VoxelType.WATER]: '灵泉',
            [GameEnums.VoxelType.STAIRS_DOWN]: '深入地底',
            [GameEnums.VoxelType.STAIRS_UP]: '返回上层'
        };

        this._locationDescs = {
            [GameEnums.VoxelType.FLOOR]: '阴森潮湿的洞穴通道，四周传来滴水的回声。',
            [GameEnums.VoxelType.WALL]: '坚硬的岩壁，上面刻满了古老的符文。',
            [GameEnums.VoxelType.WATER]: '一汪清澈的灵泉，散发着淡淡的灵气。',
            [GameEnums.VoxelType.STAIRS_DOWN]: '通往更深层的石阶，黑暗中似乎有什么在窥视。',
            [GameEnums.VoxelType.STAIRS_UP]: '返回上层的石阶，空气中弥漫着安全的气息。'
        };
    }

    /**
     * 更新位置信息
     * @param {MapData} mapData - 地图数据
     * @param {Object} pos - 当前位置
     * @param {number} floorLevel - 当前楼层
     */
    update(mapData, pos, floorLevel) {
        if (!mapData) return;

        const voxelType = mapData.getVoxel(pos);

        if (this._nameEl) {
            this._nameEl.textContent = this._locationNames[voxelType] || '未知之地';
        }

        if (this._descEl) {
            this._descEl.textContent = this._locationDescs[voxelType] || '此处神秘莫测。';
        }

        if (this._coordsEl) {
            this._coordsEl.textContent = `坐标: (${pos.x}, ${pos.z}) | 层级: ${floorLevel}`;
        }
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocationInfo;
}
