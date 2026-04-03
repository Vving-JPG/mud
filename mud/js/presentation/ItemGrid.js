"use strict";

/**
 * 物品网格UI
 * 显示和管理物品栏
 */

class ItemGrid {
    /**
     * 创建物品网格
     */
    constructor() {
        this._grid = document.getElementById('item-grid');
        this._currentTab = 'medicine';
        this._selectedIndex = -1;

        // 示例物品数据
        this._itemData = {
            medicine: ['💊 聚灵丹', '🌿 回春草', '⚗️ 清心散', '🩸 补血丸', '💎 灵石', '📜 丹方'],
            food: ['🍎 灵果', '🍖 妖兽肉', '🍚 灵米饭', '🍵 悟道茶', '🍶 仙酿', '🥟 灵饺'],
            material: ['🪨 玄铁矿', '🪵 灵木', '🧵 天蚕丝', '🔥 地心火', '💧 灵泉水', '⚡ 雷晶石'],
            magic: ['🗡️ 飞剑', '🛡️ 灵盾', '📿 念珠', '🔔 摄魂铃', '💍 储物戒', '📖 功法']
        };
    }

    /**
     * 获取当前选中的索引
     * @returns {number} 选中索引
     */
    get selectedIndex() {
        return this._selectedIndex;
    }

    /**
     * 渲染物品网格
     * @param {string} tab - 当前标签
     */
    render(tab = this._currentTab) {
        this._currentTab = tab;
        this._selectedIndex = -1;

        if (!this._grid) return;

        this._grid.innerHTML = '';

        const items = this._itemData[tab] || this._itemData.medicine;

        items.forEach((item, index) => {
            const [icon, name] = item.split(' ');
            const cell = document.createElement('div');
            cell.className = 'item-cell';
            cell.innerHTML = `
                <div class="item-icon">${icon}</div>
                <span class="item-name">${name}</span>
            `;

            cell.addEventListener('click', () => {
                this._selectedIndex = index;
                this._updateSelection();
                this._onItemClick(name);
            });

            this._grid.appendChild(cell);
        });
    }

    /**
     * 更新选中状态
     */
    _updateSelection() {
        const cells = this._grid.querySelectorAll('.item-cell');
        cells.forEach((cell, index) => {
            cell.classList.toggle('selected', index === this._selectedIndex);
        });
    }

    /**
     * 物品点击处理
     * @param {string} itemName - 物品名称
     */
    _onItemClick(itemName) {
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('item_selected', itemName, this._currentTab);
        }
    }

    /**
     * 切换标签
     * @param {string} tab - 标签名称
     */
    switchTab(tab) {
        this.render(tab);
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ItemGrid;
}
