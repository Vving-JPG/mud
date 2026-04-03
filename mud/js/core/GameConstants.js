/**
 * 游戏常量定义
 * 集中管理所有游戏配置参数
 */

const GameConstants = {
    // 地图相关
    TILE_SIZE: 32,
    VIEW_TILES_X: 15,
    VIEW_TILES_Y: 11,
    PLAYER_VIEW_RANGE: 5,
    MINIMAP_SCALE: 3,
    MAP_WIDTH: 40,
    MAP_HEIGHT: 30,

    // 游戏数值
    MAX_FLOOR: 10,
    MIN_ENEMIES_PER_FLOOR: 3,
    MAX_ENEMIES_PER_FLOOR: 8,
    MIN_ITEMS_PER_FLOOR: 2,

    // 经验系统
    BASE_EXP: 100,
    EXP_GROWTH: 1.5
};

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameConstants;
}
