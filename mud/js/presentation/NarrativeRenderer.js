"use strict";

/**
 * 叙述渲染器
 * 显示游戏叙述文本
 */

class NarrativeRenderer {
    /**
     * 创建叙述渲染器
     */
    constructor() {
        this._container = null;
        this._currentText = '';
    }

    /**
     * 显示开场叙述
     * @param {number} floorLevel - 楼层数
     */
    showOpening(floorLevel) {
        const text = `你来到了洞天第 ${floorLevel} 层...`;
        this._showText(text);
    }

    /**
     * 显示楼层变更叙述
     * @param {number} floorLevel - 楼层数
     * @param {string} direction - 方向 (up/down)
     */
    showFloorChange(floorLevel, direction) {
        const directionText = direction === 'down' ? '向下' : '向上';
        const text = `${directionText}进入了洞天第 ${floorLevel} 层...`;
        this._showText(text);
    }

    /**
     * 显示战斗叙述
     * @param {Object} combatResult - 战斗结果
     */
    showCombat(combatResult) {
        if (!combatResult.success) return;

        let text = `${combatResult.attacker} 对 ${combatResult.defender} 造成了 ${combatResult.damage} 点伤害`;
        if (combatResult.isCrit) {
            text += '（暴击！）';
        }
        if (combatResult.defenderDied) {
            text += `，${combatResult.defender} 被击败了！`;
        }

        this._showText(text);
    }

    /**
     * 显示文本
     * @param {string} text - 文本内容
     */
    _showText(text) {
        this._currentText = text;

        if (typeof eventBus !== 'undefined') {
            eventBus.emit('narrative_text', text);
        }
    }

    /**
     * 清除叙述
     */
    clear() {
        this._currentText = '';
    }

    /**
     * 获取当前文本
     * @returns {string} 当前文本
     */
    getCurrentText() {
        return this._currentText;
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NarrativeRenderer;
}
