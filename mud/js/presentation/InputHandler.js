"use strict";

/**
 * 输入处理器
 * 管理键盘和触摸输入
 */

class InputHandler {
    /**
     * 创建输入处理器
     */
    constructor() {
        this._game = null;
        this._touchStartX = 0;
        this._touchStartY = 0;
        this._minSwipeDistance = 30;

        this._bindKeyboard();
        this._bindTouch();
    }

    /**
     * 设置游戏引用
     * @param {Object} game - 游戏主类
     */
    setGame(game) {
        this._game = game;
    }

    /**
     * 绑定键盘事件
     */
    _bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (!this._game) return;

            // 只在地图视图响应
            const mapView = document.getElementById('view-map');
            if (!mapView || !mapView.classList.contains('active')) return;

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this._emitMove(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this._emitMove(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this._emitMove(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this._emitMove(1, 0);
                    break;
                case ' ':
                    e.preventDefault();
                    this._emitWait();
                    break;
                case 'i':
                case 'I':
                    e.preventDefault();
                    this._emitOpenInventory();
                    break;
            }
        });
    }

    /**
     * 绑定触摸事件
     */
    _bindTouch() {
        const canvas = document.getElementById('map-canvas');
        if (!canvas) return;

        canvas.addEventListener('touchstart', (e) => {
            this._touchStartX = e.touches[0].clientX;
            this._touchStartY = e.touches[0].clientY;
        }, { passive: true });

        canvas.addEventListener('touchend', (e) => {
            if (!this._game) return;

            const mapView = document.getElementById('view-map');
            if (!mapView || !mapView.classList.contains('active')) return;

            const dx = e.changedTouches[0].clientX - this._touchStartX;
            const dy = e.changedTouches[0].clientY - this._touchStartY;

            if (Math.abs(dx) < this._minSwipeDistance && Math.abs(dy) < this._minSwipeDistance) {
                return;
            }

            if (Math.abs(dx) > Math.abs(dy)) {
                // 水平滑动
                if (dx > this._minSwipeDistance) {
                    this._emitMove(1, 0);
                } else if (dx < -this._minSwipeDistance) {
                    this._emitMove(-1, 0);
                }
            } else {
                // 垂直滑动
                if (dy > this._minSwipeDistance) {
                    this._emitMove(0, 1);
                } else if (dy < -this._minSwipeDistance) {
                    this._emitMove(0, -1);
                }
            }
        }, { passive: true });
    }

    /**
     * 发射移动事件
     */
    _emitMove(dx, dz) {
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('player_move_requested', { x: dx, y: 0, z: dz });
        }
    }

    /**
     * 发射等待事件
     */
    _emitWait() {
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('player_wait_requested');
        }
    }

    /**
     * 发射打开背包事件
     */
    _emitOpenInventory() {
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('open_inventory_requested');
        }
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputHandler;
}
