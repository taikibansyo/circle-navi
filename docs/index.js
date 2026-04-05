import { CircleNavi } from "circle-navi";

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
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const copyButton = document.getElementById("copyButton");
  const carousel = document.querySelector(".demo-carousel");
  const carouselTrack = document.getElementById("demoCarouselTrack");
  const navButtons = Array.from(document.querySelectorAll(".navi__inner button[data-index]"));
  const mobileMenuLinks = Array.from(document.querySelectorAll(".mobile-menu a"));
  const installCommand = "npm install circle-navi";
  const swipeThreshold = 56;
  const dragIntentThreshold = 10;
  let activeIndex = 0;
  let dragStartY = 0;
  let dragStartX = 0;
  let dragOffsetX = 0;
  let isPointerDown = false;
  let isDragging = false;

  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("scrolled", window.scrollY > 24);
    },
    { passive: true }
  );

  const closeMobileMenu = () => {
    if (!menuToggle || !mobileMenu) {
      return;
    }

    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
    mobileMenu.classList.remove("is-open");
  };

  const openMobileMenu = () => {
    if (!menuToggle || !mobileMenu) {
      return;
    }

    menuToggle.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.hidden = false;
    mobileMenu.classList.add("is-open");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 640) {
      closeMobileMenu();
    }

    updateCarousel(activeIndex);
  });

  const getCarouselWidth = () => {
    return carousel?.clientWidth || 1;
  };

  const updateCarousel = (index) => {
    activeIndex = index;

    if (carouselTrack) {
      carouselTrack.style.transform = `translateX(${-index * getCarouselWidth()}px)`;
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
    if (!carouselTrack || !carousel) {
      return;
    }

    isPointerDown = true;
    isDragging = false;
    dragStartX = getClientX(event);
    dragStartY = "touches" in event && event.touches.length > 0 ? event.touches[0].clientY : event.clientY;
    dragOffsetX = 0;
  };

  const moveDrag = (event) => {
    if (!isPointerDown || !carouselTrack || !carousel) {
      return;
    }

    const currentX = getClientX(event);
    const currentY =
      "touches" in event && event.touches.length > 0
        ? event.touches[0].clientY
        : "clientY" in event
          ? event.clientY
          : dragStartY;
    const deltaX = currentX - dragStartX;
    const deltaY = currentY - dragStartY;

    if (!isDragging) {
      if (Math.abs(deltaY) > dragIntentThreshold && Math.abs(deltaY) > Math.abs(deltaX)) {
        isPointerDown = false;
        dragOffsetX = 0;
        updateCarousel(activeIndex);
        return;
      }

      if (Math.abs(deltaX) < dragIntentThreshold || Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }

      isDragging = true;
      carouselTrack.classList.add("is-dragging");
    }

    if ("cancelable" in event && event.cancelable) {
      event.preventDefault();
    }

    dragOffsetX = deltaX;
    const width = getCarouselWidth();
    const translate = -activeIndex * width + dragOffsetX;
    carouselTrack.style.transform = `translateX(${translate}px)`;
  };

  const endDrag = () => {
    if (!isPointerDown && !isDragging) {
      return;
    }

    isPointerDown = false;

    if (!carouselTrack) {
      return;
    }

    if (!isDragging) {
      dragOffsetX = 0;
      updateCarousel(activeIndex);
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

  const beginPointerDrag = (event) => {
    if ("pointerType" in event && event.pointerType === "touch") {
      return;
    }

    beginDrag(event);
  };

  const movePointerDrag = (event) => {
    if ("pointerType" in event && event.pointerType === "touch") {
      return;
    }

    moveDrag(event);
  };

  const endPointerDrag = (event) => {
    if ("pointerType" in event && event.pointerType === "touch") {
      return;
    }

    endDrag();
  };

  carousel?.addEventListener("pointerdown", beginPointerDrag);
  window.addEventListener("pointermove", movePointerDrag);
  window.addEventListener("pointerup", endPointerDrag);
  window.addEventListener("pointercancel", endPointerDrag);
  window.addEventListener("lostpointercapture", endPointerDrag);
  carousel?.addEventListener("touchstart", beginDrag, { passive: true });
  window.addEventListener("touchmove", moveDrag, { passive: false });
  window.addEventListener("touchend", endDrag);
  window.addEventListener("touchcancel", endDrag);

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
