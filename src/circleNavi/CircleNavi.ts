import {
  Settings,
  Dom,
  SetObjects,
  MoveObjects,
  NextDirection,
  PrevDirection,
} from "../types/circleNavi";

const DEFAULT_ANIMATION_DELAY: number = 160;

class CircleNavi {
  DOM: Dom;
  circleDiameter: number;
  circleInterval: number;
  previousIndex: number = 1;
  prevDirection: PrevDirection = "fromLeft";

  constructor(settings: Settings) {
    const btn = this._getElements(settings.btn);
    const target = this._getElement(settings.target);
    const bgArea = this._getElement(settings.bgArea);
    if (!btn || !target || !bgArea)
      throw new Error(`必要なDOMが見つかりません。`);
    this.DOM = { btn, target, bgArea };
    this.circleDiameter = settings.diameter;
    this.circleInterval = settings.interval;
  }

  private _getElements(targetElement: string) {
    return document.querySelectorAll<HTMLElement>(targetElement);
  }

  private _getElement(targetElement: string) {
    return document.querySelector<HTMLElement>(targetElement);
  }

  private _setMoveX(direction: number, index: number, isPrev?: string) {
    isPrev ? (direction = -direction) : (direction = direction);
    return direction > 0
      ? (this.DOM.btn.length - index) *
          (this.circleDiameter + this.circleInterval) +
          this.circleInterval
      : (index - 1) * (this.circleDiameter + this.circleInterval) +
          this.circleInterval;
  }

  private _setStyleWidth(
    direction: number,
    index: number,
    previousIndex: number
  ) {
    return direction > 0
      ? (index - previousIndex) * (this.circleDiameter + this.circleInterval) +
          this.circleDiameter
      : (previousIndex - index) * (this.circleDiameter + this.circleInterval) +
          this.circleDiameter;
  }

  private _setValueAsync(
    target: HTMLElement,
    styles: SetObjects
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        (["right", "left", "width"] as const).forEach((key) => {
          const value = styles[key];
          if (typeof value === "string") {
            target.style[key] = value;
          }
        });
        resolve();
      }, styles.delay ?? 0);
    });
  }

  private _toggleClass(
    element: HTMLElement,
    className: string,
    action: string
  ) {
    switch (action) {
      case "add":
        {
          element.classList.add(className);
        }
        break;
      case "remove":
        {
          element.classList.remove(className);
        }
        break;
      case "removeAll":
        {
          element.classList.remove(...element.classList);
        }
        break;
      case "toggle":
        {
          element.classList.toggle(className);
        }
        break;
      default:
        console.warn(`Invalid action: ${action}`);
    }
  }

  private _animateIndicatorToRight(move: MoveObjects, target: HTMLElement) {
    // 右方向への移動
    if (this.prevDirection == "fromLeft") {
      move.ids.add(
        this._setValueAsync(target, {
          right: `auto`,
          left: `${move.switch}px`,
        })
      );
    }

    move.ids.add(
      this._setValueAsync(target, {
        width: `${move.width}px`,
      })
    );

    move.ids.add(
      this._setValueAsync(target, {
        right: `${move.after}px`,
        left: `auto`,
        width: `${this.circleDiameter}px`,
        delay: DEFAULT_ANIMATION_DELAY,
      })
    );

    this.prevDirection = "fromLeft";
  }

  private _animateIndicatorToLeft(move: MoveObjects, target: HTMLElement) {
    // 左方向への移動
    if (this.prevDirection == "fromRight") {
      move.ids.add(
        this._setValueAsync(target, {
          right: `${move.switch}px`,
          left: `auto`,
        })
      );
    }

    move.ids.add(
      this._setValueAsync(target, {
        width: `${move.width}px`,
      })
    );

    move.ids.add(
      this._setValueAsync(target, {
        right: `auto`,
        left: `${move.after}px`,
        width: `${this.circleDiameter}px`,
        delay: DEFAULT_ANIMATION_DELAY,
      })
    );

    this.prevDirection = "fromRight";
  }

  private async _toggle(dataIndex: number) {
    const target = this.DOM.target;
    const bgArea = this.DOM.bgArea;
    const move: MoveObjects = {
      ids: new Set(),
    };
    const previousIndex = this.previousIndex;

    console.log(`previousIndex: ${previousIndex}`);
    this._toggleClass(target, `bg-color-${previousIndex}`, "remove");
    this._toggleClass(target, `bg-color-${dataIndex}`, "toggle");

    this._toggleClass(bgArea, `bg-color-${previousIndex}`, "remove");
    this._toggleClass(bgArea, `bg-color-${dataIndex}`, "toggle");

    move.direction = dataIndex - previousIndex;
    (move.after = this._setMoveX(move.direction, dataIndex)),
      (move.switch = this._setMoveX(move.direction, previousIndex, "prev")),
      (move.width = this._setStyleWidth(
        move.direction,
        dataIndex,
        previousIndex
      ));

    let nextDirection: NextDirection;
    if (move.direction > 0) {
      nextDirection = "toRight";
    } else {
      nextDirection = "toLeft";
    }

    if (nextDirection == "toRight") {
      this._animateIndicatorToRight(move, target);
    } else if (nextDirection == "toLeft") {
      this._animateIndicatorToLeft(move, target);
    }

    await Promise.all(move.ids);

    this.DOM.btn.forEach((btn) => {
      this._toggleClass(btn, "inview", "remove");
    });
    this._toggleClass(this.DOM.btn[dataIndex - 1], "inview", "add");

    this.previousIndex = dataIndex;
  }

  addEvent() {
    this.DOM.btn.forEach((e) => {
      const getDataIndex = e.getAttribute("data-index");
      if (getDataIndex !== null) {
        const setDataIndex = parseInt(getDataIndex, 10) + 1;
        e.addEventListener("click", this._toggle.bind(this, setDataIndex));
      }
    });
  }
}

export { CircleNavi };
