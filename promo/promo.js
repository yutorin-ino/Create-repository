(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const totalDuration = slides.reduce(
    (sum, slide) => sum + Number(slide.dataset.duration || 5),
    0
  );

  let currentIndex = 0;
  let elapsed = 0;
  let playing = true;
  let rafId = null;
  let lastTimestamp = null;

  const playBtn = document.getElementById("playBtn");
  const restartBtn = document.getElementById("restartBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const recordBtn = document.getElementById("recordBtn");
  const progressBar = document.getElementById("progressBar");
  const timeDisplay = document.getElementById("timeDisplay");
  const viewport = document.querySelector(".promo-viewport");

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    currentIndex = index;
  }

  function getSlideDuration(index) {
    return Number(slides[index].dataset.duration || 5) * 1000;
  }

  function getElapsedBeforeSlide(index) {
    let sum = 0;
    for (let i = 0; i < index; i++) {
      sum += Number(slides[i].dataset.duration || 5);
    }
    return sum;
  }

  function updateUI() {
    const progress = Math.min((elapsed / totalDuration) * 100, 100);
    progressBar.style.width = `${progress}%`;
    timeDisplay.textContent = `${formatTime(elapsed)} / ${formatTime(totalDuration)}`;
    playBtn.textContent = playing ? "⏸" : "▶";
    playBtn.setAttribute("aria-label", playing ? "一時停止" : "再生");
  }

  function tick(timestamp) {
    if (lastTimestamp === null) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (playing) {
      elapsed += delta;

      const slideStart = getElapsedBeforeSlide(currentIndex);
      const slideEnd = slideStart + Number(slides[currentIndex].dataset.duration || 5);

      if (elapsed >= slideEnd && currentIndex < slides.length - 1) {
        showSlide(currentIndex + 1);
      } else if (elapsed >= totalDuration) {
        elapsed = totalDuration;
        playing = false;
      }
    }

    updateUI();
    rafId = requestAnimationFrame(tick);
  }

  function play() {
    playing = true;
    lastTimestamp = null;
  }

  function pause() {
    playing = false;
    lastTimestamp = null;
  }

  function togglePlay() {
    if (playing) pause();
    else play();
  }

  function restart() {
    elapsed = 0;
    showSlide(0);
    play();
  }

  function goFullscreen() {
    const target = viewport;
    if (!document.fullscreenElement) {
      target.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function onFullscreenChange() {
    viewport.classList.toggle("is-fullscreen", !!document.fullscreenElement);
  }

  async function toggleRecording() {
    if (viewport.classList.contains("is-recording")) return;

    if (!navigator.mediaDevices?.getDisplayMedia) {
      alert(
        "画面録画に対応していないブラウザです。\n" +
          "Windows: Win+G（ゲームバー）\n" +
          "Mac: QuickTime Player の画面収録\n" +
          "をご利用ください。"
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false,
        preferCurrentTab: true,
      });

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sumaiplus-promo.webm";
        a.click();
        URL.revokeObjectURL(url);
        viewport.classList.remove("is-recording");
        recordBtn.textContent = "⏺";
        recordBtn.setAttribute("aria-label", "画面録画");
        stream.getTracks().forEach((t) => t.stop());
      };

      viewport.classList.add("is-recording");
      recordBtn.textContent = "■";
      recordBtn.setAttribute("aria-label", "録画中");
      restart();
      recorder.start();

      setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, totalDuration * 1000 + 500);
    } catch {
      /* ユーザーがキャンセル */
    }
  }

  playBtn.addEventListener("click", togglePlay);
  restartBtn.addEventListener("click", restart);
  fullscreenBtn.addEventListener("click", goFullscreen);
  recordBtn.addEventListener("click", toggleRecording);
  document.addEventListener("fullscreenchange", onFullscreenChange);

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      togglePlay();
    }
    if (e.code === "KeyR") restart();
    if (e.code === "KeyF") goFullscreen();
  });

  showSlide(0);
  updateUI();
  rafId = requestAnimationFrame(tick);

  window.addEventListener("beforeunload", () => {
    if (rafId) cancelAnimationFrame(rafId);
  });
})();
