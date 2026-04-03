"use strict";

/**
 * 技能系统
 * 管理技能的学习、冷却和施放
 */

class SkillSystem {
    /**
     * 创建技能系统
     */
    constructor() {
        this._skills = {};
        this._cooldowns = {};
        this._playerSkills = [];

        // 初始化基础技能
        this._initBaseSkills();
    }

    /**
     * 初始化基础技能
     */
    _initBaseSkills() {
        this._skills = {
            'fireball': {
                id: 'fireball',
                name: '火球术',
                description: '发射火球攻击敌人',
                mpCost: 10,
                damage: 25,
                cooldown: 3,
                range: 5
            },
            'heal': {
                id: 'heal',
                name: '治愈术',
                description: '恢复生命值',
                mpCost: 15,
                healAmount: 30,
                cooldown: 5,
                range: 0
            },
            'ice_shard': {
                id: 'ice_shard',
                name: '冰锥术',
                description: '发射冰锥攻击敌人',
                mpCost: 8,
                damage: 18,
                cooldown: 2,
                range: 4
            }
        };
    }

    /**
     * 学习技能
     * @param {string} skillId - 技能ID
     * @returns {boolean} 是否学习成功
     */
    learnSkill(skillId) {
        if (!this._skills[skillId]) return false;
        if (this._playerSkills.includes(skillId)) return false;

        this._playerSkills.push(skillId);

        if (typeof eventBus !== 'undefined') {
            eventBus.emit('skill_learned', skillId);
        }

        return true;
    }

    /**
     * 获取技能列表
     * @returns {string[]} 技能ID数组
     */
    getSkillList() {
        return [...this._playerSkills];
    }

    /**
     * 获取技能信息
     * @param {string} skillId - 技能ID
     * @returns {Object|null} 技能信息
     */
    getSkill(skillId) {
        return this._skills[skillId] || null;
    }

    /**
     * 检查技能是否在冷却中
     * @param {string} skillId - 技能ID
     * @returns {boolean} 是否在冷却
     */
    isOnCooldown(skillId) {
        const cooldownEnd = this._cooldowns[skillId];
        if (!cooldownEnd) return false;
        return Date.now() < cooldownEnd;
    }

    /**
     * 获取剩余冷却时间
     * @param {string} skillId - 技能ID
     * @returns {number} 剩余冷却时间（毫秒）
     */
    getCooldownRemaining(skillId) {
        const cooldownEnd = this._cooldowns[skillId];
        if (!cooldownEnd) return 0;
        return Math.max(0, cooldownEnd - Date.now());
    }

    /**
     * 检查是否可以施放技能
     * @param {string} skillId - 技能ID
     * @param {Entity} caster - 施法者
     * @returns {boolean} 是否可以施放
     */
    canCast(skillId, caster) {
        const skill = this._skills[skillId];
        if (!skill) return false;
        if (!this._playerSkills.includes(skillId)) return false;
        if (this.isOnCooldown(skillId)) return false;
        if (caster.current_mp < skill.mpCost) return false;

        return true;
    }

    /**
     * 施放技能
     * @param {string} skillId - 技能ID
     * @param {Entity} caster - 施法者
     * @param {Entity} target - 目标
     * @returns {Object} 施放结果
     */
    castSkill(skillId, caster, target) {
        if (!this.canCast(skillId, caster)) {
            return { success: false, reason: '无法施放技能' };
        }

        const skill = this._skills[skillId];

        // 消耗法力
        caster.current_mp -= skill.mpCost;

        // 设置冷却
        this._cooldowns[skillId] = Date.now() + skill.cooldown * 1000;

        // 应用效果
        let result = { success: true, skill: skill };

        if (skill.damage > 0 && target) {
            const damage = skill.damage + Math.floor(caster.intelligence * 0.5);
            target.takeDamage(damage);
            result.damage = damage;
            result.targetDied = !target.is_alive;
        }

        if (skill.healAmount > 0) {
            const healAmount = skill.healAmount + Math.floor(caster.intelligence * 0.3);
            caster.heal(healAmount);
            result.healAmount = healAmount;
        }

        // 触发事件
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('skill_cast', skillId, caster, target, result);
        }

        return result;
    }

    /**
     * 更新冷却时间
     */
    updateCooldowns() {
        const now = Date.now();
        for (const skillId in this._cooldowns) {
            if (this._cooldowns[skillId] <= now) {
                delete this._cooldowns[skillId];
            }
        }
    }

    /**
     * 重置系统
     */
    reset() {
        this._cooldowns = {};
        this._playerSkills = [];
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillSystem;
}
