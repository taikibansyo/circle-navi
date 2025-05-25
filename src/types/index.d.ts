import { Settings, Dom, PrevDirection } from "./circleNavi";
declare class CircleNavi {
  DOM: Dom;
  circleDiameter: number;
  circleInterval: number;
  previousIndex: number;
  prevDirection: PrevDirection;
  constructor(settings: Settings);
  private _getElements;
  private _getElement;
  private _setMoveX;
  private _setStyleWidth;
  private _setValueAsync;
  private _toggleClass;
  private _animateIndicatorToRight;
  private _animateIndicatorToLeft;
  private _toggle;
  addEvent(): void;
}
export { CircleNavi };
