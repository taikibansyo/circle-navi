export interface Settings {
    btn: string;
    target: string;
    bgArea: string;
    diameter: number;
    interval: number;
}
export interface Dom {
    btn: NodeListOf<HTMLElement>;
    target: HTMLElement;
    bgArea: HTMLElement;
}
export interface SetObjects {
    delay?: number;
    right?: string;
    left?: string;
    width?: string;
}
export interface MoveObjects {
    ids: Set<Promise<void>>;
    direction?: number;
    after?: number | false;
    switch?: number | false;
    width?: number;
}
export type NextDirection = "toRight" | "toLeft";
export type PrevDirection = "fromRight" | "fromLeft";
