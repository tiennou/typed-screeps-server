declare var _: import('lodash').LoDashStatic;
declare var q: typeof import('q');
type EventEmitter = import('events').EventEmitter;
type RoomName = string;
interface RoomPosition {
    room: RoomName;
    x: number;
    y: number;
}
interface RoomTerrain {
    _id: string;
    room: RoomName;
    terrain: string;
}
type Cronjob = [number, () => void];
interface User {
    _id: string;
}
type DepositType = 'biomass' | 'metal' | 'mist' | 'silicon';
type MineralType = 'H' | 'O' | 'Z' | 'Z' | 'K' | 'U' | 'L' | 'X';
interface Room {
    _id?: string;
    name: string;
    status: 'normal' | 'out of borders';
    bus: boolean;
    openTime?: number;
    sourceKeepers: boolean;
    novice: null;
    respawnArea: null;
    depositType: DepositType;
    nextForceUpdateTime: number;
    powerBankTime: number;
}
interface RoomObject {
    _id?: string;
    x: number;
    y: number;
    room: RoomName;
    type: string;
}
interface PortalObject extends RoomObject {
    type: 'portal';
    destination: RoomPosition;
    unstableDate?: number;
    decayTime?: number;
}
interface WallObject extends RoomObject {
    type: 'constructedWall';
    newbieWall?: boolean;
    notifyWhenAttacked?: boolean;
    ticksToLive?: number;
    decayTime?: number | {
        timestamp: number;
    };
    hits?: number;
    hitsMax?: number;
}
interface ServerConfig {
    backend: {
        features?: Array<{
            name: string;
            version: number;
        }>;
        router: {
            get: (path: string, handler: (request: any, response: any) => void) => void;
        } & EventEmitter;
    } & EventEmitter;
    common: {
        constants: Record<string, any>;
        storage: {
            db: any;
            env: {
                get(key: string): Promise<string>;
                set(key: string, value: any): Promise<void>;
                keys: Record<string, string>;
            };
            pubsub: any;
            resetAllData(): Promise<void>;
        };
        bots: {
            [name: string]: string;
        };
    };
    engine: EventEmitter;
    cli: CliSandbox & EventEmitter;
    cronjobs: Record<string, Cronjob>;
}
interface CommonCli {
    _help: string;
}
interface SystemCli extends CommonCli {
    resetAllData(): Promise<void>;
    sendServerMessage(msg: string): Promise<void>;
    pauseSimulation(): Promise<void>;
    resumeSimulation(): Promise<void>;
    runCronjob(cron: string): Promise<void>;
    getTickDuration(): Promise<number>;
    setTickDuration(duration: number): Promise<void>;
}
interface MapGenerateRoomOptions {
    /**
     * An object with exit coordinates arrays, e.g. {top: [20,21,23], right: [], bottom: [27,28,29,40,41]}, default is random
     */
    exits?: Partial<Record<"top" | "right" | "bottom" | "left", number[]>>;
    /**
     * The type of generated landscape, a number from 1 to 28, default is random
     */
    terrainType?: number;
    /**
     * The type of generated swamp configuration, a number from 0 to 14, default is random
     */
    swampType?: number;
    /** The amount of sources in the room, default is random from 1 to 2 */
    sources?: number;
    /** The type of the mineral deposit in this room or false if no mineral, default is random type */
    mineral?: MineralType;
    /** Whether this room should have the controller, default is true */
    controller?: boolean;
    /** Whether this room should have source keeper lairs, default is false` */
    keeperLairs?: boolean;
}
interface MapCli extends CommonCli {
    generateRoom(name: RoomName, opts?: MapGenerateRoomOptions): Promise<void>;
    openRoom(name: RoomName, timestamp?: number): Promise<void>;
    closeRoom(name: RoomName): Promise<void>;
    removeRoom(name: RoomName): Promise<void>;
    updateRoomImageAssets(roomName: RoomName): Promise<void>;
    updateTerrainData(): Promise<void>;
}
interface CliSandbox {
    print: (...args: any[]) => void;
    system: SystemCli;
    storage: {};
    map: MapCli;
    bots: {};
    strongholds: {};
}
interface ServerConfig {
    utils?: ConfigAdminUtils & EventEmitter;
}
/** AdminUtils mod */
interface ConfigAdminUtils {
    /**
     * The `serverConfig` block from config.yml
     */
    config: Record<string, any>;
    addNPCTerminals(interval?: number): Promise<string>;
    removeNPCTerminals(): Promise<string>;
    removeBots(): Promise<string>;
    setSocketUpdateRate(value: number): Promise<string>;
    getSocketUpdateRate(): Promise<string>;
    setShardName(name: string): Promise<string>;
    reloadConfig(): Promise<string>;
}
/** AutoSpawn service */
interface ConfigAdminUtils {
    spawnBot(botAIName: string, room: RoomName, opts?: {
        auto: boolean;
    }): Promise<string>;
}
/** GCL-to-CPU service */
interface ConfigAdminUtils {
    getCPULimit(user: string): Promise<string>;
    setCPULimit(user: string): Promise<string>;
    resetCPULimit(user: string): Promise<string>;
    enableGCLToCPU(maxCPU: number, baseCPU: number, stepCPU: number): Promise<string>;
    disableGCLToCPU(): Promise<string>;
}
/** ImportMap service */
interface ConfigAdminUtils {
    importMap(urlOrMapId: string): Promise<string>;
    importMapFile(filePath: string): Promise<string>;
}
/** Stats service */
interface ConfigAdminUtils {
    getStats(): Promise<any>;
}
/** Warpath service */
interface ConfigAdminUtils {
    warpath: {
        getCurrentBattles(gameTime: number, interval?: number, start?: number): Promise<string>;
    };
}
/** Whitelist service */
interface ConfigAdminUtils {
    getWhitelist(): Promise<string>;
    addWhitelistUser(user: string): Promise<string>;
    removeWhitelistUser(user: string): Promise<string>;
}
declare module '@screeps/backend/lib/utils.js' {
    function roomNameFromXY(x: number, y: number): string;
    function roomNameToXY(name: string): [x: number, y: number];
    function translateModulesFromDb(modules: object): any;
    function translateModulesToDb(modules: object): any;
    function getUserWorldStatus(user: User): any;
    function respawnUser(userId: string): Promise<void>;
    function withHelp<T extends (...args: any[]) => void>(spec: [desc: string, fn: T]): T;
    function generateCliHelp(prefix: string, obj: object): string;
    function writePng(colors: any, width: number, height: number, filename: string): any;
    function createTerrainColorsMap(terrain: any, zoomIn: any): {};
    function writeTerrainToPng(terrain: any, filename: any, zoomIn: any): any;
    function loadBot(name: string): any;
    function reloadBotUsers(name: string): any;
    function isBus(coord: number): boolean;
    function isCenter(x: number, y: number): boolean;
    function isVeryCenter(x: number, y: number): boolean;
    function activateRoom(room: RoomName): any;
    function getActiveRooms(): any;
    function findFreePos(roomName: RoomName, distance: number, rect?: {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    }, exclude?: {
        x: number;
        y: number;
    }): Promise<RoomPosition>;
}
declare module '@screeps/common' {
    function findPort(port: any): any;
    function encodeTerrain(terrain: any): string;
    function decodeTerrain(str: any, room: any): {
        room: any;
        x: number;
        y: number;
        type: string;
    }[];
    function checkTerrain(terrain: Uint8Array | string, x: number, y: number, mask: any): boolean;
    function getGametime(): Promise<number>;
    function getDiff(oldData: any, newData: any): {};
    function qSequence(collection: any, fn: any): any;
    function roomNameToXY(name: RoomName): [x: number, y: number];
    function getRoomNameFromXY(x: number, y: number): string;
    function calcWorldSize(rooms: Room[]): number;
}
