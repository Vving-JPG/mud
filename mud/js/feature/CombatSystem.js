"use strict";

/**
 * 战斗系统
 * 处理战斗逻辑和伤害计算
 */

class CombatSystem {
    /**
     * 创建战斗系统
     */
    constructor() {
        this._combatLog = [];
    }

    /**
     * 执行攻击
     * @param {Entity} attacker - 攻击者
     * @param {Entity} defender - 防御者
     * @returns {Object} 战斗结果
     */
    executeAttack(attacker, defender) {
        if (!attacker.is_alive || !defender.is_alive) {
            return { success: false, reason: '目标已死亡' };
        }

        // 计算命中
        const hitChance = CombatCalculator.calculateHitChance(attacker, defender);
        if (Math.random() > hitChance) {
            return { success: false, reason: '未命中' };
        }

        // 计算伤害
        let damage = CombatCalculator.calculateDamage(attacker, defender);

        // 暴击判定
        const critChance = CombatCalculator.calculateCritChance(attacker);
        const isCrit = Math.random() < critChance;
        if (isCrit) {
            damage = Math.floor(damage * 1.5);
        }

        // 应用伤害
        const actualDamage = defender.takeDamage(damage);

        // 记录战斗日志
        const result = {
            success: true,
            damage: actualDamage,
            isCrit: isCrit,
            attacker: attacker.display_name,
            defender: defender.display_name,
            defenderDied: !defender.is_alive
        };

        this._logCombat(result);

        // 触发事件
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('combat_attack', attacker, defender, result);
            if (!defender.is_alive) {
                eventBus.emit('entity_died', defender.id, defender.grid_position);
            }
        }

        return result;
    }

    /**
     * 获取战斗日志
     * @returns {Object[]} 战斗日志数组
     */
    getCombatLog() {
        return [...this._combatLog];
    }

    /**
     * 清空战斗日志
     */
    clearCombatLog() {
        this._combatLog = [];
    }

    /**
     * 记录战斗日志
     * @param {Object} result - 战斗结果
     */
    _logCombat(result) {
        this._combatLog.push({
            ...result,
            timestamp: Date.now()
        });

        // 限制日志数量
        if (this._combatLog.length > 100) {
            this._combatLog.shift();
        }
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CombatSystem;
}
