/**
 * 数学工具类
 * 提供游戏所需的基础数学运算
 */

class MathUtils {
    /**
     * 计算曼哈顿距离
     * @param {Object} a - 起点坐标 {x, y, z}
     * @param {Object} b - 终点坐标 {x, y, z}
     * @returns {number} 曼哈顿距离
     */
    static manhattanDistance(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
    }

    /**
     * 将值限制在指定范围内
     * @param {number} value - 输入值
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number} 限制后的值
     */
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * 生成指定范围内的随机整数
     * @param {number} min - 最小值（包含）
     * @param {number} max - 最大值（包含）
     * @returns {number} 随机整数
     */
    static randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathUtils;
}
