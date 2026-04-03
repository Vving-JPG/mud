"use strict";

/**
 * 体素数据类
 * 管理体素类型和属性
 */

class VoxelData {
    /**
     * 体素属性定义
     */
    static PROPERTIES = {
        [GameEnums.VoxelType.AIR]: {
            name: '空气',
            walkable: false,
            color: '#0a0a0f'
        },
        [GameEnums.VoxelType.WALL]: {
            name: '墙壁',
            walkable: false,
            color: '#2a2a3a'
        },
        [GameEnums.VoxelType.FLOOR]: {
            name: '地板',
            walkable: true,
            color: '#1a1a25'
        },
        [GameEnums.VoxelType.WATER]: {
            name: '水域',
            walkable: true,
            color: '#1e3a5f'
        },
        [GameEnums.VoxelType.LAVA]: {
            name: '岩浆',
            walkable: false,
            color: '#8b2635'
        },
        [GameEnums.VoxelType.STAIRS_DOWN]: {
            name: '下楼',
            walkable: true,
            color: '#2d5a3d'
        },
        [GameEnums.VoxelType.STAIRS_UP]: {
            name: '上楼',
            walkable: true,
            color: '#3d3d6a'
        },
        [GameEnums.VoxelType.DOOR_CLOSED]: {
            name: '关闭的门',
            walkable: false,
            color: '#4a4030'
        },
        [GameEnums.VoxelType.DOOR_OPEN]: {
            name: '打开的门',
            walkable: true,
            color: '#3a3530'
        },
        [GameEnums.VoxelType.GRASS]: {
            name: '草地',
            walkable: true,
            color: '#1a2a1a'
        },
        [GameEnums.VoxelType.SAND]: {
            name: '沙地',
            walkable: true,
            color: '#3a3530'
        }
    };

    /**
     * 获取体素属性
     * @param {number} voxelType - 体素类型
     * @returns {Object} 体素属性
     */
    static getProperties(voxelType) {
        return VoxelData.PROPERTIES[voxelType] || VoxelData.PROPERTIES[GameEnums.VoxelType.AIR];
    }

    /**
     * 检查体素是否可行走
     * @param {number} voxelType - 体素类型
     * @returns {boolean} 是否可行走
     */
    static isWalkable(voxelType) {
        const props = VoxelData.getProperties(voxelType);
        return props.walkable;
    }

    /**
     * 获取体素颜色
     * @param {number} voxelType - 体素类型
     * @returns {string} 颜色值
     */
    static getColor(voxelType) {
        const props = VoxelData.getProperties(voxelType);
        return props.color;
    }

    /**
     * 获取体素名称
     * @param {number} voxelType - 体素类型
     * @returns {string} 体素名称
     */
    static getName(voxelType) {
        const props = VoxelData.getProperties(voxelType);
        return props.name;
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoxelData;
}
