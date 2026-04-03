"use strict";

/**
 * 地图渲染器
 * 负责Canvas地图渲染和小地图显示
 */

class MapRenderer {
    /**
     * 创建地图渲染器
     */
    constructor() {
        this.canvas = document.getElementById('map-canvas');
        this.minimapCanvas = document.getElementById('minimap-canvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.minimapCtx = this.minimapCanvas ? this.minimapCanvas.getContext('2d') : null;

        this.tileSize = GameConstants.TILE_SIZE;
        this.viewTilesX = GameConstants.VIEW_TILES_X;
        this.viewTilesY = GameConstants.VIEW_TILES_Y;
        this.viewRange = GameConstants.PLAYER_VIEW_RANGE;

        this.colors = {
            [GameEnums.VoxelType.AIR]: '#0a0a0f',
            [GameEnums.VoxelType.WALL]: '#2a2a3a',
            [GameEnums.VoxelType.FLOOR]: '#1a1a25',
            [GameEnums.VoxelType.WATER]: '#1e3a5f',
            [GameEnums.VoxelType.LAVA]: '#8b2635',
            [GameEnums.VoxelType.STAIRS_DOWN]: '#2d5a3d',
            [GameEnums.VoxelType.STAIRS_UP]: '#3d3d6a',
            [GameEnums.VoxelType.DOOR_CLOSED]: '#4a4030',
            [GameEnums.VoxelType.DOOR_OPEN]: '#3a3530',
            [GameEnums.VoxelType.GRASS]: '#1a2a1a',
            [GameEnums.VoxelType.SAND]: '#3a3530'
        };

        this.gridColor = 'rgba(0, 212, 200, 0.08)';
        this.explored = new Set();

        this._resizeCanvas();
        window.addEventListener('resize', () => this._resizeCanvas());
    }

    /**
     * 调整Canvas尺寸
     */
    _resizeCanvas() {
        if (!this.canvas) return;

        const container = this.canvas.parentElement;
        if (!container) return;

        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.viewTilesX = Math.ceil(this.canvas.width / this.tileSize) + 2;
        this.viewTilesY = Math.ceil(this.canvas.height / this.tileSize) + 2;

        if (this.minimapCanvas) {
            this.minimapCanvas.width = 120;
            this.minimapCanvas.height = 90;
        }
    }

    /**
     * 渲染地图
     * @param {MapData} mapData - 地图数据
     * @param {Object} entities - 实体字典
     * @param {Object} playerPos - 玩家位置
     */
    render(mapData, entities, playerPos) {
        if (!mapData || !this.ctx) return;

        const ctx = this.ctx;
        const ts = this.tileSize;
        const cw = this.canvas.width;
        const ch = this.canvas.height;

        // 清空画布
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, cw, ch);

        // 计算相机位置
        const camX = playerPos.x - Math.floor(this.viewTilesX / 2);
        const camZ = playerPos.z - Math.floor(this.viewTilesY / 2);

        // 更新已探索区域
        this._updateExplored(mapData, playerPos);

        // 渲染地图
        this._renderMapTiles(ctx, mapData, camX, camZ, ts, cw, ch, playerPos);

        // 渲染实体
        this._renderEntities(ctx, entities, camX, camZ, ts, cw, ch, playerPos);

        // 渲染视野遮罩
        this._renderVisionOverlay(ctx, cw, ch, ts);

        // 渲染小地图
        this._renderMinimap(mapData, entities, playerPos);
    }

    /**
     * 渲染地图格子
     */
    _renderMapTiles(ctx, mapData, camX, camZ, ts, cw, ch, playerPos) {
        const startCol = Math.max(0, camX);
        const endCol = Math.min(mapData.size.x, camX + this.viewTilesX);
        const startRow = Math.max(0, camZ);
        const endRow = Math.min(mapData.size.z, camZ + this.viewTilesY);

        for (let x = startCol; x < endCol; x++) {
            for (let z = startRow; z < endRow; z++) {
                const screenX = (x - camX) * ts;
                const screenY = (z - camZ) * ts;

                if (screenX < -ts || screenX > cw || screenY < -ts || screenY > ch) continue;

                const pos = { x, y: 0, z };
                const key = `${x},${z}`;
                const inView = this._isInView(x, z, playerPos);
                const wasExplored = this.explored.has(key);

                if (!inView && !wasExplored) continue;

                const vtype = mapData.getVoxel(pos);
                const color = this.colors[vtype] || '#0a0a0f';

                // 绘制格子
                ctx.fillStyle = inView ? color : this._dimColor(color, 0.4);
                ctx.fillRect(screenX, screenY, ts, ts);

                // 绘制网格线
                if (inView && vtype !== GameEnums.VoxelType.AIR) {
                    ctx.strokeStyle = this.gridColor;
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(screenX, screenY, ts, ts);
                }

                // 绘制墙壁高光
                if (vtype === GameEnums.VoxelType.WALL && inView) {
                    ctx.fillStyle = 'rgba(0, 212, 200, 0.05)';
                    ctx.fillRect(screenX, screenY, ts, 2);
                    ctx.fillRect(screenX, screenY, 2, ts);
                }

                // 绘制水波动画
                if (vtype === GameEnums.VoxelType.WATER && inView) {
                    const wave = Math.sin(Date.now() / 500 + x * 0.5 + z * 0.3) * 0.1 + 0.9;
                    ctx.fillStyle = `rgba(30, 58, 95, ${wave})`;
                    ctx.fillRect(screenX + 2, screenY + 2, ts - 4, ts - 4);
                }

                // 绘制楼梯标记
                if ((vtype === GameEnums.VoxelType.STAIRS_DOWN || vtype === GameEnums.VoxelType.STAIRS_UP) && inView) {
                    ctx.fillStyle = vtype === GameEnums.VoxelType.STAIRS_DOWN ? '#4ade80' : '#60a5fa';
                    ctx.font = `${ts * 0.6}px monospace`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(
                        vtype === GameEnums.VoxelType.STAIRS_DOWN ? '▼' : '▲',
                        screenX + ts / 2,
                        screenY + ts / 2
                    );
                }

                // 绘制地面物品
                if (mapData.ground_items[key] && inView) {
                    ctx.fillStyle = '#d4a84b';
                    ctx.font = `${ts * 0.5}px monospace`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('●', screenX + ts / 2, screenY + ts / 2);
                }
            }
        }
    }

    /**
     * 渲染实体
     */
    _renderEntities(ctx, entities, camX, camZ, ts, cw, ch, playerPos) {
        for (const eid in entities) {
            const entity = entities[eid];
            if (!entity.is_alive) continue;

            const ex = (entity.grid_position.x - camX) * ts;
            const ez = (entity.grid_position.z - camZ) * ts;

            if (ex < -ts || ex > cw || ez < -ts || ez > ch) continue;

            const inView = this._isInView(entity.grid_position.x, entity.grid_position.z, playerPos);
            if (!inView) continue;

            if (entity.entity_type === GameEnums.EntityType.PLAYER) {
                this._renderPlayer(ctx, ex, ez, ts);
            } else if (entity.entity_type === GameEnums.EntityType.ENEMY) {
                this._renderEnemy(ctx, entity, ex, ez, ts);
            }
        }
    }

    /**
     * 渲染玩家
     */
    _renderPlayer(ctx, x, y, ts) {
        ctx.fillStyle = '#00d4c8';
        ctx.font = `bold ${ts * 0.8}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚔', x + ts / 2, y + ts / 2);

        // 绘制视野范围
        ctx.strokeStyle = 'rgba(0, 212, 200, 0.08)';
        ctx.beginPath();
        ctx.arc(x + ts / 2, y + ts / 2, this.viewRange * ts, 0, Math.PI * 2);
        ctx.stroke();
    }

    /**
     * 渲染敌人
     */
    _renderEnemy(ctx, entity, x, y, ts) {
        ctx.fillStyle = '#e74c3c';
        ctx.font = `bold ${ts * 0.7}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const letter = this._getEnemyLetter(entity);
        ctx.fillText(letter, x + ts / 2, y + ts / 2);

        // 绘制血条
        if (entity.current_hp < entity.max_hp) {
            const barW = ts - 4;
            const barH = 3;
            const barX = x + 2;
            const barY = y - 4;

            ctx.fillStyle = '#330000';
            ctx.fillRect(barX, barY, barW, barH);

            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(barX, barY, barW * (entity.current_hp / entity.max_hp), barH);
        }
    }

    /**
     * 渲染视野遮罩
     */
    _renderVisionOverlay(ctx, cw, ch, ts) {
        const gradient = ctx.createRadialGradient(
            cw / 2, ch / 2, ts * 2,
            cw / 2, ch / 2, this.viewRange * ts
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.8, 'rgba(0,0,0,0.3)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, cw, ch);
    }

    /**
     * 渲染小地图
     */
    _renderMinimap(mapData, entities, playerPos) {
        if (!this.minimapCtx) return;

        const ctx = this.minimapCtx;
        const scale = GameConstants.MINIMAP_SCALE;
        const w = mapData.size.x;
        const h = mapData.size.z;

        this.minimapCanvas.width = w * scale;
        this.minimapCanvas.height = h * scale;

        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);

        // 绘制地图
        for (let x = 0; x < w; x++) {
            for (let z = 0; z < h; z++) {
                const key = `${x},${z}`;
                if (!this.explored.has(key)) continue;

                const vtype = mapData.getVoxel({ x, y: 0, z });
                if (vtype === GameEnums.VoxelType.FLOOR) ctx.fillStyle = '#1a1a25';
                else if (vtype === GameEnums.VoxelType.WALL) ctx.fillStyle = '#3a3a4a';
                else if (vtype === GameEnums.VoxelType.WATER) ctx.fillStyle = '#1e3a5f';
                else if (vtype === GameEnums.VoxelType.STAIRS_DOWN) ctx.fillStyle = '#2d5a3d';
                else if (vtype === GameEnums.VoxelType.STAIRS_UP) ctx.fillStyle = '#3d3d6a';
                else continue;

                ctx.fillRect(x * scale, z * scale, scale, scale);
            }
        }

        // 绘制实体
        for (const eid in entities) {
            const entity = entities[eid];
            if (!entity.is_alive) continue;

            const inView = this._isInView(entity.grid_position.x, entity.grid_position.z, playerPos);
            if (!inView && entity.entity_type !== GameEnums.EntityType.PLAYER) continue;

            ctx.fillStyle = entity.entity_type === GameEnums.EntityType.PLAYER ? '#00d4c8' : '#e74c3c';
            ctx.fillRect(
                entity.grid_position.x * scale,
                entity.grid_position.z * scale,
                scale,
                scale
            );
        }

        // 绘制视野范围框
        ctx.strokeStyle = 'rgba(0, 212, 200, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            (playerPos.x - this.viewRange) * scale,
            (playerPos.z - this.viewRange) * scale,
            (this.viewRange * 2 + 1) * scale,
            (this.viewRange * 2 + 1) * scale
        );
    }

    /**
     * 获取敌人显示字符
     */
    _getEnemyLetter(entity) {
        const name = entity.display_name;
        if (name.includes('狼')) return '狼';
        if (name.includes('蛇')) return '蛇';
        if (name.includes('蛛')) return '蛛';
        if (name.includes('蝠')) return '蝠';
        if (name.includes('傀')) return '傀';
        return '妖';
    }

    /**
     * 检查位置是否在视野内
     */
    _isInView(x, z, playerPos) {
        return MathUtils.manhattanDistance({ x, y: 0, z }, playerPos) <= this.viewRange;
    }

    /**
     * 更新已探索区域
     */
    _updateExplored(mapData, playerPos) {
        for (let dx = -this.viewRange; dx <= this.viewRange; dx++) {
            for (let dz = -this.viewRange; dz <= this.viewRange; dz++) {
                if (Math.abs(dx) + Math.abs(dz) <= this.viewRange) {
                    const x = playerPos.x + dx;
                    const z = playerPos.z + dz;

                    if (x >= 0 && x < mapData.size.x && z >= 0 && z < mapData.size.z) {
                        if (this._hasLineOfSight(mapData, playerPos, { x, y: 0, z })) {
                            this.explored.add(`${x},${z}`);
                        }
                    }
                }
            }
        }
    }

    /**
     * 检查视线是否通畅
     */
    _hasLineOfSight(mapData, from, to) {
        const dx = Math.abs(to.x - from.x);
        const dz = Math.abs(to.z - from.z);
        const sx = from.x < to.x ? 1 : -1;
        const sz = from.z < to.z ? 1 : -1;
        let err = dx - dz;
        let cx = from.x, cz = from.z;

        while (cx !== to.x || cz !== to.z) {
            const e2 = 2 * err;
            if (e2 > -dz) { err -= dz; cx += sx; }
            if (e2 < dx) { err += dx; cz += sz; }
            if (cx === to.x && cz === to.z) break;
            if (mapData.getVoxel({ x: cx, y: 0, z: cz }) === GameEnums.VoxelType.WALL) {
                return false;
            }
        }
        return true;
    }

    /**
     * 调暗颜色
     */
    _dimColor(hex, factor) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${Math.floor(r * factor)},${Math.floor(g * factor)},${Math.floor(b * factor)})`;
    }

    /**
     * 清除已探索区域
     */
    clearExplored() {
        this.explored.clear();
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapRenderer;
}
