const DEFAULT_ANIMATION_DELAY = 160;

class CircleNavi {
  constructor(settings) {
    this.previousIndex = 1;
    this.prevDirection = "fromLeft";
    this.isAnimating = false;

    const btn = this._getElements(settings.btn);
    const target = this._getElement(settings.target);
    const bgArea = this._getElement(settings.bgArea);

    if (!btn.length || !target || !bgArea) {
      throw new Error("必要なDOMが見つかりません。");
    }

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
      ? (this.DOM.btn.length - index) * (this.circleDiameter + this.circleInterval) + this.circleInterval
      : (index - 1) * (this.circleDiameter + this.circleInterval) + this.circleInterval;
  }

  _setStyleWidth(direction, index, previousIndex) {
    return direction > 0
      ? (index - previousIndex) * (this.circleDiameter + this.circleInterval) + this.circleDiameter
      : (previousIndex - index) * (this.circleDiameter + this.circleInterval) + this.circleDiameter;
  }

  _setValueAsync(target, styles) {
    return new Promise((resolve) => {
      setTimeout(() => {
        ["right", "left", "width"].forEach((key) => {
          const value = styles[key];

          if (typeof value === "string") {
            target.style[key] = value;
          }
        });

        resolve();
      }, styles.delay ?? 0);
    });
  }

  _toggleClass(element, className, action) {
    switch (action) {
      case "add":
        element.classList.add(className);
        break;
      case "remove":
        element.classList.remove(className);
        break;
      case "removeAll":
        element.classList.remove(...element.classList);
        break;
      case "toggle":
        element.classList.toggle(className);
        break;
      default:
        console.warn(`Invalid action: ${action}`);
    }
  }

  _animateIndicatorToRight(move, target) {
    if (this.prevDirection === "fromLeft") {
      move.ids.add(
        this._setValueAsync(target, {
          right: "auto",
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
        left: "auto",
        width: `${this.circleDiameter}px`,
        delay: DEFAULT_ANIMATION_DELAY,
      })
    );

    this.prevDirection = "fromLeft";
  }

  _animateIndicatorToLeft(move, target) {
    if (this.prevDirection === "fromRight") {
      move.ids.add(
        this._setValueAsync(target, {
          right: `${move.switch}px`,
          left: "auto",
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
        right: "auto",
        left: `${move.after}px`,
        width: `${this.circleDiameter}px`,
        delay: DEFAULT_ANIMATION_DELAY,
      })
    );

    this.prevDirection = "fromRight";
  }

  async _toggle(dataIndex) {
    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;

    const target = this.DOM.target;
    const bgArea = this.DOM.bgArea;
    const move = {
      ids: new Set(),
    };
    const previousIndex = this.previousIndex;

    this._toggleClass(target, `bg-color-${previousIndex}`, "remove");
    this._toggleClass(target, `bg-color-${dataIndex}`, "toggle");
    this._toggleClass(bgArea, `bg-color-${previousIndex}`, "remove");
    this._toggleClass(bgArea, `bg-color-${dataIndex}`, "toggle");

    move.direction = dataIndex - previousIndex;
    move.after = this._setMoveX(move.direction, dataIndex);
    move.switch = this._setMoveX(move.direction, previousIndex, "prev");
    move.width = this._setStyleWidth(move.direction, dataIndex, previousIndex);

    const nextDirection = move.direction > 0 ? "toRight" : "toLeft";

    if (nextDirection === "toRight") {
      this._animateIndicatorToRight(move, target);
    } else if (nextDirection === "toLeft") {
      this._animateIndicatorToLeft(move, target);
    }

    await Promise.all(move.ids);

    this.DOM.btn.forEach((btn) => {
      this._toggleClass(btn, "inview", "remove");
    });

    this._toggleClass(this.DOM.btn[dataIndex - 1], "inview", "add");
    this.previousIndex = dataIndex;
    this.isAnimating = false;
  }

  addEvent() {
    this.DOM.btn.forEach((button) => {
      const dataIndex = button.getAttribute("data-index");

      if (dataIndex !== null) {
        const setDataIndex = Number.parseInt(dataIndex, 10) + 1;
        button.addEventListener("click", this._toggle.bind(this, setDataIndex));
      }
    });
  }
}

const initializeDemoPage = () => {
  const settings = {
    btn: ".navi__inner button",
    target: ".circle",
    bgArea: "body",
    diameter: 40,
    interval: 5,
  };

  try {
    const menu = new CircleNavi(settings);
    menu.addEvent();
  } catch (error) {
    console.error(error);
  }

  const header = document.getElementById("siteHeader");
  const copyButton = document.getElementById("copyButton");
  const carousel = document.querySelector(".demo-carousel");
  const carouselTrack = document.getElementById("demoCarouselTrack");
  const navButtons = Array.from(document.querySelectorAll(".navi__inner button[data-index]"));
  const installCommand = "npm install circle-navi";
  const swipeThreshold = 56;
  let activeIndex = 0;
  let dragStartX = 0;
  let dragOffsetX = 0;
  let isDragging = false;

  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("scrolled", window.scrollY > 24);
    },
    { passive: true }
  );

  const updateCarousel = (index) => {
    activeIndex = index;

    if (carouselTrack) {
      carouselTrack.style.transform = `translateX(-${index * 100}%)`;
    }
  };

  const getClientX = (event) => {
    if ("touches" in event && event.touches.length > 0) {
      return event.touches[0].clientX;
    }

    if ("changedTouches" in event && event.changedTouches.length > 0) {
      return event.changedTouches[0].clientX;
    }

    return event.clientX;
  };

  const beginDrag = (event) => {
    if (!carouselTrack) {
      return;
    }

    isDragging = true;
    dragStartX = getClientX(event);
    dragOffsetX = 0;
    carouselTrack.classList.add("is-dragging");
  };

  const moveDrag = (event) => {
    if (!isDragging || !carouselTrack || !carousel) {
      return;
    }

    dragOffsetX = getClientX(event) - dragStartX;
    const width = carousel.clientWidth || 1;
    const translate = -activeIndex * width + dragOffsetX;
    carouselTrack.style.transform = `translateX(${translate}px)`;
  };

  const endDrag = () => {
    if (!isDragging || !carouselTrack) {
      return;
    }

    isDragging = false;
    carouselTrack.classList.remove("is-dragging");

    if (Math.abs(dragOffsetX) > swipeThreshold) {
      const nextIndex =
        dragOffsetX < 0
          ? Math.min(activeIndex + 1, navButtons.length - 1)
          : Math.max(activeIndex - 1, 0);

      if (nextIndex !== activeIndex) {
        navButtons[nextIndex]?.click();
        dragOffsetX = 0;
        return;
      }
    }

    dragOffsetX = 0;
    updateCarousel(activeIndex);
  };

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const rawIndex = button.getAttribute("data-index");
      const index = Number.parseInt(rawIndex ?? "0", 10);
      updateCarousel(index);
    });
  });

  updateCarousel(0);

  carouselTrack?.addEventListener("pointerdown", beginDrag);
  carouselTrack?.addEventListener("pointermove", moveDrag);
  carouselTrack?.addEventListener("pointerup", endDrag);
  carouselTrack?.addEventListener("pointercancel", endDrag);
  carouselTrack?.addEventListener("lostpointercapture", endDrag);
  carouselTrack?.addEventListener("touchstart", beginDrag, { passive: true });
  carouselTrack?.addEventListener("touchmove", moveDrag, { passive: true });
  carouselTrack?.addEventListener("touchend", endDrag);

  carouselTrack?.addEventListener("pointerdown", (event) => {
    if ("pointerId" in event) {
      carouselTrack.setPointerCapture(event.pointerId);
    }
  });

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = installCommand;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    copyButton.textContent = "コピーしました";
    copyButton.classList.add("copied");

    window.setTimeout(() => {
      copyButton.textContent = "コピー";
      copyButton.classList.remove("copied");
    }, 1800);
  });
};

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initializeDemoPage);
}

export { CircleNavi };
