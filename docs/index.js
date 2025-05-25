const DEFAULT_ANIMATION_DELAY = 160;
class CircleNavi {
    constructor(settings) {
        this.previousIndex = 1;
        this.prevDirection = "fromLeft";
        const btn = this._getElements(settings.btn);
        const target = this._getElement(settings.target);
        const bgArea = this._getElement(settings.bgArea);
        if (!btn || !target || !bgArea)
            throw new Error(`必要なDOMが見つかりません。`);
        this.DOM = { btn, target, bgArea };
        this.circleDiameter = settings.diameter;
        this.circleInterval = settings.interval;
    }
    _getElements(targetElement) {
        return document.querySelectorAll(targetElement);
    }
    _getElement(targetElement) {
        return document.querySelector(targetElement);
    }
    _setMoveX(direction, index, isPrev) {
        isPrev ? (direction = -direction) : (direction = direction);
        return direction > 0
            ? (this.DOM.btn.length - index) *
                (this.circleDiameter + this.circleInterval) +
                this.circleInterval
            : (index - 1) * (this.circleDiameter + this.circleInterval) +
                this.circleInterval;
    }
    _setStyleWidth(direction, index, previousIndex) {
        return direction > 0
            ? (index - previousIndex) * (this.circleDiameter + this.circleInterval) +
                this.circleDiameter
            : (previousIndex - index) * (this.circleDiameter + this.circleInterval) +
                this.circleDiameter;
    }
    _setValueAsync(target, styles) {
        return new Promise((resolve) => {
            var _a;
            setTimeout(() => {
                ["right", "left", "width"].forEach((key) => {
                    const value = styles[key];
                    if (typeof value === "string") {
                        target.style[key] = value;
                    }
                });
                resolve();
            }, (_a = styles.delay) !== null && _a !== void 0 ? _a : 0);
        });
    }
    _toggleClass(element, className, action) {
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
    _animateIndicatorToRight(move, target) {
        // 右方向への移動
        if (this.prevDirection == "fromLeft") {
            move.ids.add(this._setValueAsync(target, {
                right: `auto`,
                left: `${move.switch}px`,
            }));
        }
        move.ids.add(this._setValueAsync(target, {
            width: `${move.width}px`,
        }));
        move.ids.add(this._setValueAsync(target, {
            right: `${move.after}px`,
            left: `auto`,
            width: `${this.circleDiameter}px`,
            delay: DEFAULT_ANIMATION_DELAY,
        }));
        this.prevDirection = "fromLeft";
    }
    _animateIndicatorToLeft(move, target) {
        // 左方向への移動
        if (this.prevDirection == "fromRight") {
            move.ids.add(this._setValueAsync(target, {
                right: `${move.switch}px`,
                left: `auto`,
            }));
        }
        move.ids.add(this._setValueAsync(target, {
            width: `${move.width}px`,
        }));
        move.ids.add(this._setValueAsync(target, {
            right: `auto`,
            left: `${move.after}px`,
            width: `${this.circleDiameter}px`,
            delay: DEFAULT_ANIMATION_DELAY,
        }));
        this.prevDirection = "fromRight";
    }
    async _toggle(dataIndex) {
        const target = this.DOM.target;
        const bgArea = this.DOM.bgArea;
        const move = {
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
            (move.width = this._setStyleWidth(move.direction, dataIndex, previousIndex));
        let nextDirection;
        if (move.direction > 0) {
            nextDirection = "toRight";
        }
        else {
            nextDirection = "toLeft";
        }
        if (nextDirection == "toRight") {
            this._animateIndicatorToRight(move, target);
        }
        else if (nextDirection == "toLeft") {
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
