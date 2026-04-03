"use strict";

/**
 * 游戏状态机
 * 管理游戏状态的转换和验证
 */

class GameStateMachine {
    /**
     * 创建状态机实例
     */
    constructor() {
        this._currentState = GameEnums.GameState.MENU;
        this._stateHistory = [];
        this._transitions = {
            [GameEnums.GameState.MENU]: [GameEnums.GameState.PLAYING],
            [GameEnums.GameState.PLAYING]: [GameEnums.GameState.PAUSED, GameEnums.GameState.GAME_OVER, GameEnums.GameState.VICTORY],
            [GameEnums.GameState.PAUSED]: [GameEnums.GameState.PLAYING, GameEnums.GameState.MENU],
            [GameEnums.GameState.GAME_OVER]: [GameEnums.GameState.MENU],
            [GameEnums.GameState.VICTORY]: [GameEnums.GameState.MENU]
        };
    }

    /**
     * 获取当前状态
     * @returns {string} 当前状态
     */
    get current_state() {
        return this._currentState;
    }

    /**
     * 设置当前状态（内部使用）
     * @param {string} state - 新状态
     */
    set current_state(state) {
        this._currentState = state;
    }

    /**
     * 检查状态转换是否有效
     * @param {string} newState - 目标状态
     * @returns {boolean} 是否允许转换
     */
    canTransitionTo(newState) {
        const allowedStates = this._transitions[this._currentState];
        return allowedStates && allowedStates.includes(newState);
    }

    /**
     * 执行状态转换
     * @param {string} newState - 目标状态
     * @returns {boolean} 转换是否成功
     */
    transitionTo(newState) {
        if (!this.canTransitionTo(newState)) {
            console.warn(`Invalid state transition: ${this._currentState} -> ${newState}`);
            return false;
        }

        const oldState = this._currentState;
        this._stateHistory.push(oldState);
        this._currentState = newState;

        // 触发状态变更事件
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('game_state_changed', oldState, newState);
        }

        return true;
    }

    /**
     * 获取状态历史
     * @returns {string[]} 状态历史数组
     */
    getStateHistory() {
        return [...this._stateHistory];
    }

    /**
     * 重置状态机
     */
    reset() {
        this._currentState = GameEnums.GameState.MENU;
        this._stateHistory = [];
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameStateMachine;
}
