"use strict";

/**
 * 角色系统
 * 管理所有实体的注册、移动和状态
 */

class ActorSystem {
    /**
     * 创建角色系统
     */
    constructor() {
        this.entities = {};
        this.positionIndex = {};
        this._nextId = 1;
        this.playerId = null;
    }

    /**
     * 注册实体
     * @param {Entity} entity - 实体对象
     * @returns {string} 实体ID
     */
    registerEntity(entity) {
        const id = entity.id || `entity_${this._nextId++}`;
        entity.id = id;
        this.entities[id] = entity;

        if (entity.entity_type === GameEnums.EntityType.PLAYER) {
            this.playerId = id;
        }

        this._updatePositionIndex(entity);
        return id;
    }

    /**
     * 移除实体
     * @param {string} entityId - 实体ID
     */
    removeEntity(entityId) {
        const entity = this.entities[entityId];
        if (entity) {
            this._removeFromPositionIndex(entity);
            delete this.entities[entityId];
        }
    }

    /**
     * 获取实体
     * @param {string} entityId - 实体ID
     * @returns {Entity|null} 实体对象
     */
    getEntity(entityId) {
        return this.entities[entityId] || null;
    }

    /**
     * 获取玩家实体
     * @returns {Entity|null} 玩家实体
     */
    getPlayer() {
        return this.playerId ? this.entities[this.playerId] : null;
    }

    /**
     * 移动实体到指定位置
     * @param {string} entityId - 实体ID
     * @param {Object} newPos - 新位置 {x, y, z}
     */
    moveEntityTo(entityId, newPos) {
        const entity = this.entities[entityId];
        if (!entity) return;

        this._removeFromPositionIndex(entity);
        entity.grid_position = { ...newPos };
        this._updatePositionIndex(entity);
    }

    /**
     * 获取指定位置的所有实体
     * @param {Object} pos - 位置坐标 {x, y, z}
     * @returns {Entity[]} 实体数组
     */
    getEntitiesAt(pos) {
        const key = `${pos.x},${pos.z}`;
        const entityIds = this.positionIndex[key] || [];
        return entityIds.map(id => this.entities[id]).filter(e => e);
    }

    /**
     * 获取所有敌人ID
     * @returns {string[]} 敌人ID数组
     */
    getEnemyIds() {
        return Object.keys(this.entities).filter(id => {
            const entity = this.entities[id];
            return entity.entity_type === GameEnums.EntityType.ENEMY;
        });
    }

    /**
     * 更新位置索引
     * @param {Entity} entity - 实体对象
     */
    _updatePositionIndex(entity) {
        const pos = entity.grid_position;
        const key = `${pos.x},${pos.z}`;
        if (!this.positionIndex[key]) {
            this.positionIndex[key] = [];
        }
        this.positionIndex[key].push(entity.id);
    }

    /**
     * 从位置索引中移除
     * @param {Entity} entity - 实体对象
     */
    _removeFromPositionIndex(entity) {
        const pos = entity.grid_position;
        const key = `${pos.x},${pos.z}`;
        if (this.positionIndex[key]) {
            this.positionIndex[key] = this.positionIndex[key].filter(id => id !== entity.id);
            if (this.positionIndex[key].length === 0) {
                delete this.positionIndex[key];
            }
        }
    }

    /**
     * 重置系统
     */
    reset() {
        this.entities = {};
        this.positionIndex = {};
        this._nextId = 1;
        this.playerId = null;
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ActorSystem;
}
