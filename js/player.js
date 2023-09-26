class Player {
  constructor(playerElement) {
    this.iconPlay = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M320-200v-560l440 280-440 280Z"/></svg>`;
    this.iconPause = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>`;

    this.playerElement = playerElement;
    this.playerVideo = playerElement.querySelector('video');
    this.playerHandle = this.generatePlayerHandle();
    this.playerIsland = this.generatePlayerIsland();
    this.playerCurrentTime = this.playerIsland.querySelector(
      '.player__currentTime'
    );
    this.playerTotalTime = this.playerIsland.querySelector('.player__duration');
    this.playerSeekbar = this.playerIsland.querySelector('.player__seekbar');
    this.playerProgressbar = this.playerIsland.querySelector(
      '.player__progressbar'
    );
    this.initialize();
  }

  initialize() {
    this.playerElement.append(this.playerHandle, this.playerIsland);
    this.updateTimeInformation(
      this.playerVideo.currentTime,
      this.playerVideo.duration
    );

    this.playerElement.addEventListener('mousemove', () => {
      if (!this.playerVideo.paused) {
        this.showControls();
        this.hideControlsWithDelay();
      }
    });

    this.playerElement.addEventListener('mouseenter', () => {
      if (!this.playerVideo.paused) {
        this.showControls();
      }
    });

    this.playerElement.addEventListener('mouseleave', () => {
      if (!this.playerVideo.paused) {
        this.hideControls();
      }
    });

    this.playerVideo.addEventListener('durationchange', ({ target }) => {
      const { currentTime, duration } = target;
      this.updateTimeInformation(currentTime, duration);
    });

    this.playerVideo.addEventListener('timeupdate', ({ target }) => {
      const { currentTime, duration } = target;
      this.updateTimeInformation(currentTime, duration);
    });

    this.playerVideo.addEventListener('ended', () => {
      this.pauseVideo();
    });

    this.playerVideo.addEventListener('click', () => {
      if (this.playerVideo.paused) {
        this.playVideo();
        return;
      }

      this.pauseVideo();
    });

    this.playerProgressbar.addEventListener('mousedown', () => {
      this.pauseVideo();
    });

    this.playerProgressbar.addEventListener('mouseup', () => {
      this.playVideo();
    });

    this.playerProgressbar.addEventListener('input', () => {
      const { value, max } = this.playerProgressbar;
      this.playerVideo.currentTime = value;
      this.updateProgressbarProgress(value, max);
    });
  }

  generatePlayerHandle() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'player__handle';
    button.innerHTML = this.iconPlay;
    return button;
  }

  generatePlayerTime() {
    const block = document.createElement('div');
    block.className = 'player__time';
    block.innerHTML = `<span class="player__currentTime"></span>/<span class="player__duration"></span>`;
    return block;
  }

  generatePlayerSeekbar() {
    const block = document.createElement('div');
    block.className = 'player__seekbar';
    block.innerHTML = `<input type="range" class="player__progressbar" min="0" value="0" step="0.01">`;
    return block;
  }

  generatePlayerIsland() {
    const block = document.createElement('div');
    block.className = 'player__island';
    block.append(this.generatePlayerTime(), this.generatePlayerSeekbar());
    return block;
  }

  secondsToMinutesAndSeconds(totalSeconds) {
    if (isNaN(totalSeconds)) {
      totalSeconds = 0;
    }

    const minutes = Math.floor(Number(totalSeconds) / 60);
    const seconds = Math.round(Number(totalSeconds) % 60);
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${minutes}:${formattedSeconds}`;
  }

  updateProgressbarProgress(currentValue, max) {
    const progress = (currentValue / max) * 100;

    this.playerSeekbar.style.setProperty(
      '--playerProgressbarComplete',
      `${progress}%`
    );
  }

  updateTimeInformation(currentTime, duration) {
    this.playerCurrentTime.textContent =
      this.secondsToMinutesAndSeconds(currentTime);
    this.playerTotalTime.textContent =
      this.secondsToMinutesAndSeconds(duration);
    this.playerProgressbar.value = currentTime;
    this.playerProgressbar.max = duration;
    this.updateProgressbarProgress(currentTime, duration);
  }

  playVideo() {
    this.playerVideo.play();
    this.playerHandle.innerHTML = this.iconPause;
    this.hideControlsWithDelay();
  }

  pauseVideo() {
    this.playerVideo.pause();
    this.playerHandle.innerHTML = this.iconPlay;
    this.showControls();
  }

  showControls() {
    this.playerHandle.style.opacity = 1;
    this.playerHandle.style.visibility = 'visible';
    this.playerIsland.style.opacity = 1;
    this.playerIsland.style.visibility = 'visible';
    this.playerIsland.style.transform = 'translateY(0)';
  }

  hideControls() {
    this.playerHandle.style.opacity = 0;
    this.playerHandle.style.visibility = 'hidden';
    this.playerIsland.style.opacity = 0;
    this.playerIsland.style.visibility = 'hidden';
    this.playerIsland.style.transform = 'translateY(10px)';
  }

  hideControlsWithDelay() {
    clearTimeout(this.playerHideControlsTimeoutId);
    this.playerHideControlsTimeoutId = setTimeout(() => {
      if (!this.playerVideo.paused) {
        this.hideControls();
      }
    }, 1000);
  }
}
