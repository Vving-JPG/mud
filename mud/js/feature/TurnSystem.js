"use strict";

/**
 * 回合系统
 * 管理游戏回合流程
 */

class TurnSystem {
    /**
     * 创建回合系统
     */
    constructor() {
        this.turnNumber = 0;
        this._processing = false;
    }

    /**
     * 获取当前回合数
     * @returns {number} 回合数
     */
    getTurnNumber() {
        return this.turnNumber;
    }

    /**
     * 开始新回合
     */
    startTurn() {
        this.turnNumber++;
        this._processing = true;

        // 触发回合开始事件
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('turn_started', this.turnNumber);
        }
    }

    /**
     * 结束当前回合
     */
    endTurn() {
        this._processing = false;

        // 触发回合结束事件
        if (typeof eventBus !== 'undefined') {
            eventBus.emit('turn_ended', this.turnNumber);
        }
    }

    /**
     * 处理NPC回合
     * @param {ActorSystem} actorSystem - 角色系统
     * @param {CombatSystem} combatSystem - 战斗系统
     * @param {Entity} player - 玩家实体
     */
    processNpcTurns(actorSystem, combatSystem, player) {
        const enemyIds = actorSystem.getEnemyIds();

        for (const enemyId of enemyIds) {
            const enemy = actorSystem.getEntity(enemyId);
            if (!enemy || !enemy.is_alive) continue;

            const dist = MathUtils.manhattanDistance(
                enemy.grid_position,
                player.grid_position
            );

            if (dist === 1) {
                // 攻击玩家
                combatSystem.executeAttack(enemy, player);
            } else if (dist <= 6) {
                // 向玩家移动
                const dx = Math.sign(player.grid_position.x - enemy.grid_position.x);
                const dz = Math.sign(player.grid_position.z - enemy.grid_position.z);
                const newPos = {
                    x: enemy.grid_position.x + dx,
                    y: 0,
                    z: enemy.grid_position.z + dz
                };

                // 检查是否可以移动
                const entitiesAtPos = actorSystem.getEntitiesAt(newPos);
                const blocked = entitiesAtPos.some(e => e.is_alive && e.id !== enemy.id);

                if (!blocked) {
                    actorSystem.moveEntityTo(enemyId, newPos);
                }
            }
        }
    }

    /**
     * 重置系统
     */
    reset() {
        this.turnNumber = 0;
        this._processing = false;
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TurnSystem;
}
