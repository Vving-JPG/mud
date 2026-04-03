/**
 * 游戏枚举定义
 * 集中管理所有枚举类型
 */

const GameEnums = {
    /**
     * 体素类型枚举
     */
    VoxelType: {
        AIR: 0,
        WALL: 1,
        FLOOR: 2,
        WATER: 3,
        LAVA: 4,
        STAIRS_DOWN: 5,
        STAIRS_UP: 6,
        DOOR_CLOSED: 7,
        DOOR_OPEN: 8,
        GRASS: 9,
        SAND: 10
    },

    /**
     * 实体类型枚举
     */
    EntityType: {
        PLAYER: 0,
        ENEMY: 1,
        NPC: 2
    },

    /**
     * 游戏状态枚举
     */
    GameState: {
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'game_over',
        VICTORY: 'victory'
    },

    /**
     * 消息类型枚举
     */
    MessageType: {
        INFO: 'info',
        DAMAGE: 'damage',
        HEAL: 'heal',
        LOOT: 'loot',
        WARNING: 'warning',
        SYSTEM: 'system'
    }
};

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEnums;
}
