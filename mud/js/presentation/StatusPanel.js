"use strict";

/**
 * 状态面板
 * 显示角色详细状态
 */

class StatusPanel {
    /**
     * 创建状态面板
     */
    constructor() {
        this._container = document.getElementById('status-content');
    }

    /**
     * 更新状态显示
     * @param {Entity} player - 玩家实体
     * @param {Object} equipmentBonus - 装备加成
     */
    update(player, equipmentBonus = {}) {
        if (!this._container || !player) return;

        const bonus = equipmentBonus || {};

        const stats = [
            { label: '生命值', value: `${player.current_hp}/${player.max_hp}`, icon: '❤️' },
            { label: '法力值', value: `${player.current_mp}/${player.max_mp}`, icon: '💧' },
            { label: '等级', value: player.level, icon: '⭐' },
            { label: '力量', value: player.strength + (bonus.strength || 0), icon: '💪' },
            { label: '敏捷', value: player.dexterity + (bonus.dexterity || 0), icon: '⚡' },
            { label: '智力', value: player.intelligence + (bonus.intelligence || 0), icon: '📖' },
            { label: '体质', value: player.vitality + (bonus.vitality || 0), icon: '🛡️' }
        ];

        this._container.innerHTML = stats.map(stat => `
            <div class="status-row">
                <span class="status-icon">${stat.icon}</span>
                <span class="status-label">${stat.label}</span>
                <span class="status-value">${stat.value}</span>
            </div>
        `).join('');
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatusPanel;
}
