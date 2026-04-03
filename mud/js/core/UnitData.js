/**
 * 单位数据类
 * 定义玩家和敌人的基础数据结构
 */

class Entity {
    /**
     * 创建实体
     * @param {string} id - 实体ID
     * @param {number} type - 实体类型 (EntityType)
     * @param {string} name - 显示名称
     * @param {number} x - X坐标
     * @param {number} z - Z坐标
     */
    constructor(id, type, name, x, z) {
        this.id = id;
        this.entity_type = type;
        this.display_name = name;
        this.grid_position = { x, y: 0, z };
        this.is_alive = true;

        // 基础属性
        this.max_hp = 100;
        this.current_hp = 100;
        this.max_mp = 50;
        this.current_mp = 50;
        this.level = 1;

        // 战斗属性
        this.strength = 59;
        this.dexterity = 126;
        this.intelligence = 88;
        this.vitality = 42;
    }

    /**
     * 移动实体
     * @param {number} dx - X方向位移
     * @param {number} dz - Z方向位移
     */
    move(dx, dz) {
        this.grid_position.x += dx;
        this.grid_position.z += dz;
    }

    /**
     * 受到伤害
     * @param {number} amount - 伤害数值
     * @returns {number} 实际伤害
     */
    takeDamage(amount) {
        this.current_hp = Math.max(0, this.current_hp - amount);
        if (this.current_hp <= 0) {
            this.is_alive = false;
        }
        return amount;
    }

    /**
     * 恢复生命值
     * @param {number} amount - 恢复数值
     */
    heal(amount) {
        this.current_hp = Math.min(this.max_hp, this.current_hp + amount);
    }

    /**
     * 恢复法力值
     * @param {number} amount - 恢复数值
     */
    restoreMp(amount) {
        this.current_mp = Math.min(this.max_mp, this.current_mp + amount);
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Entity;
}
