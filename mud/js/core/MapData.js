/**
 * 地图数据类
 * 管理体素地图的生成和查询
 */

class MapData {
    /**
     * 创建地图实例
     * @param {number} width - 地图宽度
     * @param {number} height - 地图高度
     */
    constructor(width, height) {
        this.size = { x: width, y: 1, z: height };
        this.voxels = new Uint8Array(width * height);
        this.ground_items = {};
        this.entities = {};
        this.rooms = [];
        this.generateCave();
    }

    /**
     * 生成洞穴地图
     * 使用随机游走算法生成自然洞穴
     */
    generateCave() {
        this.voxels.fill(GameEnums.VoxelType.WALL);
        const floorCount = Math.floor(this.size.x * this.size.z * 0.45);
        let x = Math.floor(this.size.x / 2);
        let z = Math.floor(this.size.z / 2);

        this.setVoxel({ x, y: 0, z }, GameEnums.VoxelType.FLOOR);
        let placed = 1;

        while (placed < floorCount) {
            const dir = Math.floor(Math.random() * 4);
            switch (dir) {
                case 0: z--; break;
                case 1: z++; break;
                case 2: x--; break;
                case 3: x++; break;
            }
            x = MathUtils.clamp(x, 1, this.size.x - 2);
            z = MathUtils.clamp(z, 1, this.size.z - 2);

            if (this.getVoxel({ x, y: 0, z }) === GameEnums.VoxelType.WALL) {
                this.setVoxel({ x, y: 0, z }, GameEnums.VoxelType.FLOOR);
                placed++;
            }
        }

        // 添加水域
        for (let i = 0; i < 5; i++) {
            const wx = Math.floor(Math.random() * (this.size.x - 4)) + 2;
            const wz = Math.floor(Math.random() * (this.size.z - 4)) + 2;
            if (this.getVoxel({ x: wx, y: 0, z: wz }) === GameEnums.VoxelType.FLOOR) {
                this.setVoxel({ x: wx, y: 0, z: wz }, GameEnums.VoxelType.WATER);
            }
        }

        // 设置楼梯
        this.setVoxel({ x: 2, y: 0, z: 2 }, GameEnums.VoxelType.STAIRS_UP);
        this.setVoxel(
            { x: this.size.x - 3, y: 0, z: this.size.z - 3 },
            GameEnums.VoxelType.STAIRS_DOWN
        );

        // 随机放置地面物品
        for (let i = 0; i < 10; i++) {
            const ix = Math.floor(Math.random() * this.size.x);
            const iz = Math.floor(Math.random() * this.size.z);
            if (this.getVoxel({ x: ix, y: 0, z: iz }) === GameEnums.VoxelType.FLOOR) {
                this.ground_items[`${ix},${iz}`] = { type: 'herb', name: '灵草' };
            }
        }
    }

    /**
     * 获取指定位置的体素类型
     * @param {Object} pos - 位置坐标 {x, y, z}
     * @returns {number} 体素类型
     */
    getVoxel(pos) {
        if (pos.x < 0 || pos.x >= this.size.x || pos.z < 0 || pos.z >= this.size.z) {
            return GameEnums.VoxelType.WALL;
        }
        return this.voxels[pos.z * this.size.x + pos.x];
    }

    /**
     * 设置指定位置的体素类型
     * @param {Object} pos - 位置坐标 {x, y, z}
     * @param {number} type - 体素类型
     */
    setVoxel(pos, type) {
        if (pos.x >= 0 && pos.x < this.size.x && pos.z >= 0 && pos.z < this.size.z) {
            this.voxels[pos.z * this.size.x + pos.x] = type;
        }
    }

    /**
     * 检查位置是否可行走
     * @param {Object} pos - 位置坐标 {x, y, z}
     * @returns {boolean} 是否可行走
     */
    isWalkable(pos) {
        const type = this.getVoxel(pos);
        return type === GameEnums.VoxelType.FLOOR ||
               type === GameEnums.VoxelType.GRASS ||
               type === GameEnums.VoxelType.SAND ||
               type === GameEnums.VoxelType.STAIRS_UP ||
               type === GameEnums.VoxelType.STAIRS_DOWN ||
               type === GameEnums.VoxelType.DOOR_OPEN ||
               type === GameEnums.VoxelType.WATER;
    }
}

// 兼容模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapData;
}
