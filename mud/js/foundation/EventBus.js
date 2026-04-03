/**
 * 事件总线
 * 实现模块间的解耦通信
 */

class EventBus {
    constructor() {
        this._events = {};
    }

    /**
     * 订阅事件
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    on(event, callback) {
        if (!this._events[event]) {
            this._events[event] = [];
        }
        this._events[event].push(callback);
    }

    /**
     * 取消订阅
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    off(event, callback) {
        if (!this._events[event]) return;
        this._events[event] = this._events[event].filter(cb => cb !== callback);
    }

    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {...any} args - 传递参数
     */
    emit(event, ...args) {
        if (!this._events[event]) return;
        this._events[event].forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`EventBus error in ${event}:`, error);
            }
        });
    }

    /**
     * 安全连接（自动处理异常）
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     */
    safeConnect(event, callback) {
        this.on(event, (...args) => {
            try {
                callback(...args);
            } catch (error) {
                console.error(`Event handler error for ${event}:`, error);
            }
        });
    }
}

// 创建全局实例
const eventBus = new EventBus();

// 兼容浏览器和模块环境
if (typeof window !== 'undefined') {
    window.EventBus = eventBus;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventBus, eventBus };
}
