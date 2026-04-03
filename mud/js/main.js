"use strict";

/**
 * 游戏主协调器
 * 初始化所有系统并协调游戏循环
 */

class Game {
    /**
     * 创建游戏实例
     */
    constructor() {
        // 初始化基础层
        this._initFoundation();

        // 初始化核心层
        this._initCore();

        // 初始化功能层
        this._initFeature();

        // 初始化表现层
        this._initPresentation();

        // 绑定事件
        this._bindEvents();

        // 初始化UI交互
        this._initUI();

        // 游戏状态
        this._player = null;
        this._floorLevel = 1;
        this._totalKills = 0;
        this._isRunning = false;
    }

    /**
     * 初始化基础层
     */
    _initFoundation() {
        // EventBus 和 Logger 已在全局创建
        Logger.info('Foundation layer initialized', 'Game');
    }

    /**
     * 初始化核心层
     */
    _initCore() {
        // 核心数据类已在全局定义
        Logger.info('Core layer initialized', 'Game');
    }

    /**
     * 初始化功能层
     */
    _initFeature() {
        this.actorSystem = new ActorSystem();
        this.combatSystem = new CombatSystem();
        this.turnSystem = new TurnSystem();
        this.voxelSystem = new VoxelSystem();
        this.itemSystem = new ItemSystem();
        this.skillSystem = new SkillSystem();
        this.stateMachine = new GameStateMachine();

        Logger.info('Feature layer initialized', 'Game');
    }

    /**
     * 初始化表现层
     */
    _initPresentation() {
        this.mapRenderer = new MapRenderer();
        this.inputHandler = new InputHandler();
        this.combatLog = new CombatLog();
        this.hud = new HUD();
        this.itemGrid = new ItemGrid();
        this.inventoryUI = new InventoryUI();
        this.locationInfo = new LocationInfo();
        this.messageLog = new MessageLog();
        this.narrativeRenderer = new NarrativeRenderer();
        this.statusPanel = new StatusPanel();

        this.inputHandler.setGame(this);

        Logger.info('Presentation layer initialized', 'Game');
    }

    /**
     * 绑定系统事件
     */
    _bindEvents() {
        // 玩家移动请求
        eventBus.on('player_move_requested', (direction) => {
            this._handlePlayerMove(direction);
        });

        // 玩家等待请求
        eventBus.on('player_wait_requested', () => {
            this._handlePlayerWait();
        });

        // 回合结束
        eventBus.on('turn_ended', () => {
            this._processTurn();
        });

        // 实体死亡
        eventBus.on('entity_died', (entityId, pos) => {
            this._handleEntityDeath(entityId, pos);
        });

        // 战斗攻击
        eventBus.on('combat_attack', (attacker, defender, result) => {
            this._handleCombatResult(result);
        });

        Logger.info('Events bound', 'Game');
    }

    /**
     * 初始化UI交互
     */
    _initUI() {
        // 底部导航切换
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const viewName = item.getAttribute('data-view');
                this._switchView(viewName);

                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // 方向键控制
        const dpadBtns = document.querySelectorAll('.d-btn');
        dpadBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const dir = btn.getAttribute('data-dir');
                this._handleDpadPress(dir);
            });
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            if (this.mapRenderer) {
                this.mapRenderer._resizeCanvas();
            }
        });
    }

    /**
     * 切换视图
     * @param {string} viewName - 视图名称
     */
    _switchView(viewName) {
        document.querySelectorAll('.game-view').forEach(view => {
            view.classList.remove('active');
        });

        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.add('active');
        }

        // 切换到地图视图时重新计算canvas尺寸
        if (viewName === 'map' && this.mapRenderer) {
            setTimeout(() => {
                this.mapRenderer._resizeCanvas();
                this._render();
            }, 50);
        }

        // 切换到物品视图时渲染物品网格
        if (viewName === 'items' && this.itemGrid) {
            this.itemGrid.render();
        }
    }

    /**
     * 处理方向键按下
     * @param {string} dir - 方向
     */
    _handleDpadPress(dir) {
        console.log('[Game] Dpad pressed:', dir, 'Player:', !!this._player, 'State:', this.stateMachine?.current_state);
        if (!this._player || this.stateMachine.current_state !== GameEnums.GameState.PLAYING) {
            console.log('[Game] Cannot move - player or state invalid');
            return;
        }

        switch (dir) {
            case 'up':
                this._handlePlayerMove({ x: 0, y: 0, z: -1 });
                break;
            case 'down':
                this._handlePlayerMove({ x: 0, y: 0, z: 1 });
                break;
            case 'left':
                this._handlePlayerMove({ x: -1, y: 0, z: 0 });
                break;
            case 'right':
                this._handlePlayerMove({ x: 1, y: 0, z: 0 });
                break;
            case 'wait':
                this._handlePlayerWait();
                break;
        }
    }

    /**
     * 处理玩家移动
     * @param {Object} direction - 移动方向
     */
    _handlePlayerMove(direction) {
        if (!this._player || this.stateMachine.current_state !== GameEnums.GameState.PLAYING) {
            return;
        }

        const newPos = {
            x: this._player.grid_position.x + direction.x,
            y: 0,
            z: this._player.grid_position.z + direction.z
        };

        // 检查是否可以移动
        if (!this.voxelSystem.isWalkable(newPos)) {
            return;
        }

        // 检查是否有敌人
        const entitiesAtPos = this.actorSystem.getEntitiesAt(newPos);
        const enemy = entitiesAtPos.find(e => e.entity_type === GameEnums.EntityType.ENEMY && e.is_alive);

        if (enemy) {
            // 攻击敌人
            const result = this.combatSystem.executeAttack(this._player, enemy);
            if (result.success) {
                this.combatLog.add(
                    `你对${enemy.display_name}造成 ${result.damage} 点伤害`,
                    'damage'
                );
                if (result.defenderDied) {
                    this.combatLog.add(`${enemy.display_name} 被击败了！`, 'loot');
                    this._totalKills++;
                }
            }
        } else {
            // 移动玩家
            this.actorSystem.moveEntityTo(this._player.id, newPos);
            this._checkTileEvents();
        }

        // 结束回合
        this._processTurn();
    }

    /**
     * 处理玩家等待
     */
    _handlePlayerWait() {
        if (!this._player || this.stateMachine.current_state !== GameEnums.GameState.PLAYING) {
            return;
        }

        this._processTurn();
    }

    /**
     * 处理回合
     */
    _processTurn() {
        this.turnSystem.startTurn();

        // NPC行动
        this.turnSystem.processNpcTurns(
            this.actorSystem,
            this.combatSystem,
            this._player
        );

        this.turnSystem.endTurn();

        // 更新UI
        this._updateUI();
        this._render();

        // 检查游戏结束
        if (!this._player.is_alive) {
            this._gameOver();
        }
    }

    /**
     * 检查格子事件
     */
    _checkTileEvents() {
        const pos = this._player.grid_position;
        const voxelType = this.voxelSystem.getVoxelType(pos);

        // 楼梯事件
        if (voxelType === GameEnums.VoxelType.STAIRS_DOWN) {
            this._nextFloor();
        } else if (voxelType === GameEnums.VoxelType.STAIRS_UP && this._floorLevel > 1) {
            this._prevFloor();
        }

        // 地面物品
        const groundItem = this.voxelSystem.getGroundItem(pos);
        if (groundItem) {
            this.combatLog.add(`发现了 ${groundItem.name}`, 'loot');
        }
    }

    /**
     * 处理战斗结果
     * @param {Object} result - 战斗结果
     */
    _handleCombatResult(result) {
        if (result.defender === this._player.display_name && result.success) {
            this.combatLog.add(
                `${result.attacker} 对你造成 ${result.damage} 点伤害`,
                'damage'
            );
        }
    }

    /**
     * 处理实体死亡
     * @param {string} entityId - 实体ID
     * @param {Object} pos - 位置
     */
    _handleEntityDeath(entityId, pos) {
        if (entityId === this._player.id) {
            this._gameOver();
        } else {
            // 掉落物品
            this.voxelSystem.placeGroundItem(pos, {
                type: 'material',
                name: '妖兽材料'
            });
        }
    }

    /**
     * 下一层
     */
    _nextFloor() {
        if (this._floorLevel >= GameConstants.MAX_FLOOR) return;

        this._floorLevel++;
        this._changeFloor('down');
        this.narrativeRenderer.showFloorChange(this._floorLevel, 'down');
    }

    /**
     * 上一层
     */
    _prevFloor() {
        if (this._floorLevel <= 1) return;

        this._floorLevel--;
        this._changeFloor('up');
        this.narrativeRenderer.showFloorChange(this._floorLevel, 'up');
    }

    /**
     * 变更楼层
     * @param {string} direction - 方向
     */
    _changeFloor(direction) {
        // 清除旧敌人
        const enemyIds = this.actorSystem.getEnemyIds();
        enemyIds.forEach(id => this.actorSystem.removeEntity(id));

        // 生成新地图
        this.mapRenderer.clearExplored();
        this.voxelSystem.generateMap(`floor_${this._floorLevel}`, this._floorLevel);

        // 放置玩家
        const spawnPos = this.voxelSystem.getSpawnPosition();
        this.actorSystem.moveEntityTo(this._player.id, spawnPos);

        // 生成敌人
        this._spawnEnemies();

        this._updateUI();
    }

    /**
     * 生成敌人
     */
    _spawnEnemies() {
        const count = MathUtils.randInt(
            GameConstants.MIN_ENEMIES_PER_FLOOR,
            GameConstants.MAX_ENEMIES_PER_FLOOR
        );

        for (let i = 0; i < count; i++) {
            const config = WorldGenerator.generateEnemyConfig(this._floorLevel);
            const pos = WorldGenerator.findSpawnPosition(this.voxelSystem.currentMap);

            // 确保不在玩家附近
            const dist = MathUtils.manhattanDistance(pos, this._player.grid_position);
            if (dist < 5) continue;

            const enemy = new Entity(
                `enemy_${i}`,
                GameEnums.EntityType.ENEMY,
                config.name,
                pos.x,
                pos.z
            );

            enemy.level = config.level;
            enemy.strength = config.str;
            enemy.dexterity = config.dex;
            enemy.intelligence = config.int;
            enemy.vitality = config.vit;

            this.actorSystem.registerEntity(enemy);
        }
    }

    /**
     * 更新UI
     */
    _updateUI() {
        this.hud.update(this._player, this._floorLevel, this.turnSystem.getTurnNumber());
        this.locationInfo.update(
            this.voxelSystem.currentMap,
            this._player.grid_position,
            this._floorLevel
        );
        this.statusPanel.update(this._player, this.itemSystem.getTotalEquipmentBonus());
    }

    /**
     * 渲染游戏画面
     */
    _render() {
        if (this.voxelSystem.currentMap) {
            this.mapRenderer.render(
                this.voxelSystem.currentMap,
                this.actorSystem.entities,
                this._player.grid_position
            );
        }
    }

    /**
     * 游戏结束
     */
    _gameOver() {
        this.stateMachine.transitionTo(GameEnums.GameState.GAME_OVER);
        this._isRunning = false;

        // 显示游戏结束画面
        const gameOverScreen = document.getElementById('gameover-screen');
        if (gameOverScreen) {
            gameOverScreen.classList.add('active');
        }

        Logger.info('Game Over', 'Game');
    }

    /**
     * 开始游戏
     */
    start() {
        // 创建玩家
        this._player = new Entity(
            'player',
            GameEnums.EntityType.PLAYER,
            '陈平安',
            2,
            2
        );
        this.actorSystem.registerEntity(this._player);

        // 生成初始地图
        this._floorLevel = 1;
        this.voxelSystem.generateMap('floor_1', this._floorLevel);

        // 放置玩家
        const spawnPos = this.voxelSystem.getSpawnPosition();
        this.actorSystem.moveEntityTo(this._player.id, spawnPos);

        // 生成敌人
        this._spawnEnemies();

        // 切换到游戏状态
        const transitionResult = this.stateMachine.transitionTo(GameEnums.GameState.PLAYING);
        console.log('[Game] State transition to PLAYING:', transitionResult);
        this._isRunning = true;

        // 初始渲染
        this._updateUI();
        this._render();

        // 开始游戏循环
        this._gameLoop();

        Logger.info('Game started', 'Game');
    }

    /**
     * 游戏循环
     */
    _gameLoop() {
        if (!this._isRunning) return;

        this._render();
        requestAnimationFrame(() => this._gameLoop());
    }

    /**
     * 重置游戏
     */
    reset() {
        this.actorSystem.reset();
        this.combatSystem.clearCombatLog();
        this.turnSystem.reset();
        this.voxelSystem.reset();
        this.itemSystem.reset();
        this.skillSystem.reset();
        this.stateMachine.reset();

        this._player = null;
        this._floorLevel = 1;
        this._totalKills = 0;
        this._isRunning = false;

        Logger.info('Game reset', 'Game');
    }
}

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('[Game] Starting initialization...');
        window.game = new Game();
        window.game.start();
        console.log('[Game] Initialization complete!');
        Logger.info('Game initialized', 'Main');
    } catch (error) {
        console.error('[Game] FATAL: Initialization failed!', error);
    }
});
