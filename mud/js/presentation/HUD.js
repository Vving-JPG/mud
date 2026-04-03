"use strict";

/**
 * HUD界面
 * 显示角色状态信息
 */

class HUD {
    /**
     * 创建HUD
     */
    constructor() {
        this._elements = {
            playerName: document.getElementById('player-name'),
            playerLevel: document.getElementById('player-level'),
            playerMp: document.getElementById('player-mp'),
            playerGold: document.getElementById('player-gold'),
            statStr: document.getElementById('stat-str'),
            statDex: document.getElementById('stat-dex'),
            statInt: document.getElementById('stat-int'),
            statVit: document.getElementById('stat-vit'),
            lifeBar: document.getElementById('life-bar'),
            lifeValue: document.getElementById('life-value'),
            floorIndicator: document.getElementById('floor-indicator')
        };
    }

    /**
     * 更新角色信息
     * @param {Entity} player - 玩家实体
     * @param {number} floorLevel - 当前楼层
     * @param {number} turnNumber - 回合数
     */
    update(player, floorLevel, turnNumber) {
        if (!player) return;

        // 更新顶部信息
        if (this._elements.playerName) {
            this._elements.playerName.textContent = player.display_name;
        }
        if (this._elements.playerLevel) {
            this._elements.playerLevel.textContent = `炼气期 · 第${player.level}层`;
        }
        if (this._elements.playerMp) {
            this._elements.playerMp.textContent = player.current_mp;
        }

        // 更新属性
        if (this._elements.statStr) {
            this._elements.statStr.textContent = player.strength;
        }
        if (this._elements.statDex) {
            this._elements.statDex.textContent = player.dexterity;
        }
        if (this._elements.statInt) {
            this._elements.statInt.textContent = player.intelligence;
        }
        if (this._elements.statVit) {
            this._elements.statVit.textContent = player.vitality;
        }

        // 更新生命条
        if (this._elements.lifeBar && this._elements.lifeValue) {
            const hpPercent = (player.current_hp / player.max_hp) * 100;
            this._elements.lifeBar.style.width = `${hpPercent}%`;
            this._elements.lifeValue.textContent = `${player.current_hp} / ${player.max_hp}`;
        }

        // 更新楼层指示
        if (this._elements.floorIndicator) {
            this._elements.floorIndicator.textContent = `洞天第 ${floorLevel} 层`;
        }
    }

    /**
     * 更新金币显示
     * @param {number} gold - 金币数量
     */
    updateGold(gold) {
        if (this._elements.playerGold) {
            this._elements.playerGold.textContent = gold;
        }
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HUD;
}
