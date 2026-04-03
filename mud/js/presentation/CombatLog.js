"use strict";

/**
 * 战斗日志UI
 * 显示战斗信息
 */

class CombatLog {
    /**
     * 创建战斗日志UI
     */
    constructor() {
        this._container = document.getElementById('combat-log');
        this._maxEntries = 5;
        this._displayTime = 3000;
    }

    /**
     * 添加日志条目
     * @param {string} text - 日志文本
     * @param {string} type - 日志类型 (damage/heal/loot/warning/system)
     */
    add(text, type = '') {
        if (!this._container) return;

        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = text;

        this._container.appendChild(entry);

        // 限制条目数量
        while (this._container.children.length > this._maxEntries) {
            this._container.removeChild(this._container.firstChild);
        }

        // 自动淡出
        setTimeout(() => {
            entry.style.opacity = '0';
            setTimeout(() => {
                if (entry.parentNode) {
                    entry.remove();
                }
            }, 300);
        }, this._displayTime);
    }

    /**
     * 清空日志
     */
    clear() {
        if (this._container) {
            this._container.innerHTML = '';
        }
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CombatLog;
}
