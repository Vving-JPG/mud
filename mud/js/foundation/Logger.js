/**
 * 日志系统
 * 提供分级日志记录功能
 */

class Logger {
    static LEVELS = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    };

    static currentLevel = Logger.LEVELS.DEBUG;

    /**
     * 设置日志级别
     * @param {number} level - 日志级别
     */
    static setLevel(level) {
        Logger.currentLevel = level;
    }

    /**
     * 输出调试日志
     * @param {string} message - 日志消息
     * @param {string} module - 模块名称
     */
    static debug(message, module = '') {
        if (Logger.currentLevel <= Logger.LEVELS.DEBUG) {
            console.log(`[DEBUG${module ? ` ${module}` : ''}] ${message}`);
        }
    }

    /**
     * 输出信息日志
     * @param {string} message - 日志消息
     * @param {string} module - 模块名称
     */
    static info(message, module = '') {
        if (Logger.currentLevel <= Logger.LEVELS.INFO) {
            console.info(`[INFO${module ? ` ${module}` : ''}] ${message}`);
        }
    }

    /**
     * 输出警告日志
     * @param {string} message - 日志消息
     * @param {string} module - 模块名称
     */
    static warn(message, module = '') {
        if (Logger.currentLevel <= Logger.LEVELS.WARN) {
            console.warn(`[WARN${module ? ` ${module}` : ''}] ${message}`);
        }
    }

    /**
     * 输出错误日志
     * @param {string} message - 日志消息
     * @param {string} module - 模块名称
     */
    static error(message, module = '') {
        if (Logger.currentLevel <= Logger.LEVELS.ERROR) {
            console.error(`[ERROR${module ? ` ${module}` : ''}] ${message}`);
        }
    }
}

// 兼容浏览器和模块环境
if (typeof window !== 'undefined') {
    window.Logger = Logger;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
}
