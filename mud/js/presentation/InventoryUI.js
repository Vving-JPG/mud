"use strict";

/**
 * 背包UI
 * 管理背包界面显示
 */

class InventoryUI {
    /**
     * 创建背包UI
     */
    constructor() {
        this._container = document.getElementById('view-items');
        this._tabs = document.querySelectorAll('.side-tab');
        this._currentTab = 'medicine';

        this._bindTabs();
    }

    /**
     * 绑定标签切换
     */
    _bindTabs() {
        this._tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this._tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this._currentTab = tab.getAttribute('data-tab');

                if (typeof eventBus !== 'undefined') {
                    eventBus.emit('inventory_tab_changed', this._currentTab);
                }
            });
        });
    }

    /**
     * 显示背包
     */
    show() {
        if (this._container) {
            this._container.classList.add('active');
        }
    }

    /**
     * 隐藏背包
     */
    hide() {
        if (this._container) {
            this._container.classList.remove('active');
        }
    }

    /**
     * 切换显示状态
     */
    toggle() {
        if (this._container) {
            this._container.classList.toggle('active');
        }
    }

    /**
     * 获取当前标签
     * @returns {string} 当前标签
     */
    getCurrentTab() {
        return this._currentTab;
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryUI;
}
