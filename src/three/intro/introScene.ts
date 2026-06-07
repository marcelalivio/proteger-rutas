function loadPlayfairFont() {
  if (document.querySelector('link[data-intro-font="playfair"]')) return;

  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.dataset.introFont = "playfair";
  fontLink.href =
 "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap";

  document.head.appendChild(fontLink);
}

export function createIntroScene() {
  loadPlayfairFont();

  const intro = document.createElement("div");

  intro.style.position = "fixed";
  intro.style.inset = "0";
  intro.style.zIndex = "999999";
  intro.style.overflow = "hidden";
  intro.style.background = "black";

  // VIDEO

  const video = document.createElement("video");

  video.src = "/videos/intro-clouds.mp4";
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;

  video.style.position = "absolute";
  video.style.inset = "0";
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";

  intro.appendChild(video);

  // OVERLAY

  const overlay = document.createElement("div");

  overlay.style.position = "absolute";
  overlay.style.inset = "0";

  overlay.style.background = `
    linear-gradient(
      to bottom,
      rgba(0,0,0,0.05),
      rgba(0,0,0,0.45)
    )
  `;

  overlay.style.zIndex = "1";

  intro.appendChild(overlay);

  // TEXT WRAPPER

  const titleWrap = document.createElement("div");

  titleWrap.style.position = "absolute";
  titleWrap.style.top = "50%";
  titleWrap.style.left = "50%";
  titleWrap.style.transform = "translateX(-50%)";
  titleWrap.style.textAlign = "center";
  titleWrap.style.pointerEvents = "auto";
  titleWrap.style.zIndex = "2";

  const enterButton = document.createElement("button");

enterButton.textContent = "INGRESAR";

enterButton.style.marginTop = "40px";
enterButton.style.padding = "14px 42px";
enterButton.style.fontSize = "18px";
enterButton.style.letterSpacing = "3px";
enterButton.style.border = "1px solid rgba(255,255,255,0.5)";
enterButton.style.background = "rgba(255,255,255,0.08)";
enterButton.style.color = "#f5e8d3";
enterButton.style.cursor = "pointer";
enterButton.style.backdropFilter = "blur(8px)";
enterButton.style.borderRadius = "999px";
enterButton.style.transition = "all .3s ease";

enterButton.onmouseenter = () => {
  enterButton.style.background = "rgba(255,255,255,0.18)";
  enterButton.style.transform = "scale(1.05)";
};

enterButton.onmouseleave = () => {
  enterButton.style.background = "rgba(255,255,255,0.08)";
  enterButton.style.transform = "scale(1)";
};

  // SUBTITLE

  const subtitle = document.createElement("div");

  subtitle.textContent = "";

  subtitle.style.fontFamily =
    "'Playfair Display', serif";

  subtitle.style.fontSize = "42px";

  subtitle.style.fontWeight = "500";

  subtitle.style.color = "#ffffff";

  subtitle.style.marginBottom = "10px";

  subtitle.style.textShadow =
    "0 2px 12px rgba(0,0,0,.5)";

  // TITLE

  const title = document.createElement("div");

  title.textContent = "Café de día";

  title.style.fontFamily =
 "'Great Vibes', cursive";

  title.style.fontSize = "130px";

  title.style.fontWeight = "800";

  title.style.lineHeight = "1";

  title.style.color = "#ffffff";

  title.style.textShadow =
    "0 4px 30px rgba(0,0,0,.45)";

  title.style.opacity = "0";

  title.style.transform = "translateY(20px)";

  title.style.transition =
    "all 1.6s cubic-bezier(.22,.61,.36,1)";

  titleWrap.appendChild(subtitle);
  titleWrap.appendChild(title);
  titleWrap.appendChild(enterButton);

  intro.appendChild(titleWrap);

  document.body.appendChild(intro);

  // TYPEWRITER EFFECT

  const text = "Bienvenidos a";

  let index = 0;

  const typing = setInterval(() => {
    subtitle.textContent += text[index];

    index++;

    if (index >= text.length) {
      clearInterval(typing);

      setTimeout(() => {
        title.style.opacity = "1";
        title.style.transform = "translateY(0)";
      }, 500);
    }
  }, 90);

  // VIDEO ZOOM CINEMATOGRÁFICO

  video.animate(
    [
      {
        transform: "scale(1)"
      },
      {
        transform: "scale(1.08)"
      }
    ],
    {
      duration: 12000,
      iterations: Infinity,
      direction: "alternate",
      easing: "ease-in-out"
    }
  );

 function closeIntro() {
  intro.style.transition = "opacity 1.2s ease";
  intro.style.opacity = "0";

  setTimeout(() => {
    intro.remove();
  }, 1200);
}
  enterButton.addEventListener("click", closeIntro);
}