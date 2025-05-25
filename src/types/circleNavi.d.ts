interface Settings {
  btn: string;
  target: string;
  bgArea: string;
  diameter: number;
  interval: number;
}

interface Dom {
  btn: NodeListOf<HTMLElement>;
  target: HTMLElement;
  bgArea: HTMLElement;
}

interface Window {
  DocumentTouch: any;
  navigator: any;
}
declare var window: Window;

interface SetObjects {
  delay?: number;
  right?: string;
  left?: string;
  width?: string;
}

interface MoveObjects {
  ids: Set<Promise<void>>;
  direction?: number;
  after?: number | false;
  switch?: number | false;
  width?: number;
}

type NextDirection = "toRight" | "toLeft";
type PrevDirection = "fromRight" | "fromLeft";

export {
  Settings,
  Dom,
  Window,
  SetObjects,
  MoveObjects,
  NextDirection,
  PrevDirection,
  window,
};
