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
  });

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
