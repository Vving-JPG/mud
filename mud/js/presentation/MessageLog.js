"use strict";

/**
 * 消息日志UI
 * 显示系统消息
 */

class MessageLog {
    /**
     * 创建消息日志
     */
    constructor() {
        this._container = document.getElementById('message-content');
        this._maxEntries = 50;
        this._messages = [];
    }

    /**
     * 添加消息
     * @param {string} text - 消息文本
     * @param {string} type - 消息类型
     */
    add(text, type = 'info') {
        const message = {
            text,
            type,
            timestamp: Date.now()
        };

        this._messages.push(message);

        // 限制消息数量
        if (this._messages.length > this._maxEntries) {
            this._messages.shift();
        }

        this._render();
    }

    /**
     * 渲染消息
     */
    _render() {
        if (!this._container) return;

        this._container.innerHTML = '';

        this._messages.forEach(msg => {
            const entry = document.createElement('div');
            entry.className = `message-entry ${msg.type}`;
            entry.textContent = msg.text;
            this._container.appendChild(entry);
        });

        // 滚动到底部
        this._container.scrollTop = this._container.scrollHeight;
    }

    /**
     * 清空日志
     */
    clear() {
        this._messages = [];
        if (this._container) {
            this._container.innerHTML = '';
        }
    }

    /**
     * 获取所有消息
     * @returns {Object[]} 消息数组
     */
    getMessages() {
        return [...this._messages];
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessageLog;
}
