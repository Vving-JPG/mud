"use strict";

/**
 * 战斗计算器
 * 负责战斗数值计算
 */

class CombatCalculator {
    /**
     * 计算基础攻击力
     * @param {Entity} attacker - 攻击者
     * @returns {number} 基础攻击力
     */
    static calculateAttackPower(attacker) {
        return attacker.strength * 2 + attacker.level * 3;
    }

    /**
     * 计算基础防御力
     * @param {Entity} defender - 防御者
     * @returns {number} 基础防御力
     */
    static calculateDefense(defender) {
        return defender.vitality + defender.level * 2;
    }

    /**
     * 计算伤害值
     * @param {Entity} attacker - 攻击者
     * @param {Entity} defender - 防御者
     * @returns {number} 最终伤害
     */
    static calculateDamage(attacker, defender) {
        const attackPower = CombatCalculator.calculateAttackPower(attacker);
        const defense = CombatCalculator.calculateDefense(defender);
        const baseDamage = Math.max(1, attackPower - defense);
        const variance = MathUtils.randInt(-2, 2);
        return Math.max(1, baseDamage + variance);
    }

    /**
     * 计算命中率
     * @param {Entity} attacker - 攻击者
     * @param {Entity} defender - 防御者
     * @returns {number} 命中率 (0-1)
     */
    static calculateHitChance(attacker, defender) {
        const hitRate = 0.8 + (attacker.dexterity - defender.dexterity) * 0.01;
        return MathUtils.clamp(hitRate, 0.3, 0.95);
    }

    /**
     * 计算暴击率
     * @param {Entity} attacker - 攻击者
     * @returns {number} 暴击率 (0-1)
     */
    static calculateCritChance(attacker) {
        return MathUtils.clamp(attacker.luck * 0.02, 0.05, 0.3);
    }

    /**
     * 计算升级所需经验
     * @param {number} targetLevel - 目标等级
     * @param {number} baseExp - 基础经验
     * @param {number} growthRate - 成长率
     * @returns {number} 所需经验
     */
    static calculateExpRequired(targetLevel, baseExp, growthRate) {
        return Math.floor(baseExp * Math.pow(growthRate, targetLevel - 1));
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CombatCalculator;
}
