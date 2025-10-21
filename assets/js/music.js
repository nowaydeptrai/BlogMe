// 🎵 Persistent Music System
class MusicPlayer {
  constructor() {
    this.audio = document.getElementById('background-music');
    this.toggleBtn = document.getElementById('music-toggle');
    this.musicIcon = document.getElementById('music-icon');
    this.volumeSlider = document.getElementById('volume-slider');
    this.volumeIcon = document.getElementById('volume-icon');
    this.currentTimeEl = document.getElementById('current-time');
    this.totalTimeEl = document.getElementById('total-time');
    this.musicPlayer = document.getElementById('music-player');
    this.musicBubble = document.getElementById('music-bubble');
    this.bubbleIcon = document.getElementById('bubble-icon');
    
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.5;
    this.isPlayerVisible = false;
    
    // Persistent state
    this.persistentState = {
      isPlaying: false,
      volume: 0.5,
      currentTime: 0,
      isPlayerVisible: false
    };
    
    this.init();
  }
  
  init() {
    // Load persistent state
    this.loadPersistentState();
    
    // Set initial volume
    this.audio.volume = this.volume;
    this.volumeSlider.value = this.volume * 100;
    
    // Event listeners
    this.toggleBtn.addEventListener('click', () => this.togglePlayPause());
    this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
    this.musicBubble.addEventListener('click', () => this.togglePlayer());
    
    // Audio events
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio.addEventListener('timeupdate', () => this.updateTime());
    this.audio.addEventListener('ended', () => this.onEnded());
    this.audio.addEventListener('play', () => this.onPlay());
    this.audio.addEventListener('pause', () => this.onPause());
    
    // Auto-play with user interaction
    this.setupAutoPlay();
    
    // Initialize visualizer
    this.initVisualizer();
    
    // Initialize player visibility
    this.updatePlayerVisibility();
    
    // Handle page visibility changes
    this.setupPageVisibilityHandlers();
    
    // Try to auto-resume music if it was playing
    this.autoResumeMusic();
    
    // Additional attempt after a longer delay
    setTimeout(() => {
      this.attemptAutoPlay();
    }, 2000);
  }
  
  // Persistent state management
  loadPersistentState() {
    const savedState = localStorage.getItem('musicPlayerState');
    if (savedState) {
      this.persistentState = JSON.parse(savedState);
      this.isPlaying = this.persistentState.isPlaying;
      this.volume = this.persistentState.volume;
      this.isPlayerVisible = this.persistentState.isPlayerVisible;
      
      // Restore audio time if available
      if (this.persistentState.currentTime > 0) {
        this.audio.currentTime = this.persistentState.currentTime;
      }
      
      // Apply volume immediately
      this.audio.volume = this.volume;
      this.volumeSlider.value = this.volume * 100;
      
      // Try to resume playing if it was playing
      if (this.isPlaying) {
        this.audio.play().then(() => {
          console.log('Music resumed from saved state');
          this.updateUI();
        }).catch(e => {
          console.log('Auto-play prevented, will retry on user interaction:', e);
          // Store that we want to play but couldn't due to browser policy
          this.pendingPlay = true;
        });
      }
    }
  }
  
  savePersistentState() {
    this.persistentState = {
      isPlaying: this.isPlaying,
      volume: this.volume,
      currentTime: this.audio.currentTime,
      isPlayerVisible: this.isPlayerVisible
    };
    localStorage.setItem('musicPlayerState', JSON.stringify(this.persistentState));
  }
  
  // Player visibility toggle - click once to show, click again to hide completely
  togglePlayer() {
    this.isPlayerVisible = !this.isPlayerVisible;
    this.updatePlayerVisibility();
    this.savePersistentState();
  }
  
  
  updatePlayerVisibility() {
    if (this.isPlayerVisible) {
      this.musicPlayer.classList.remove('hide');
      this.musicPlayer.classList.add('show');
      this.musicBubble.classList.remove('player-hidden');
      this.musicBubble.classList.add('player-visible');
    } else {
      this.musicPlayer.classList.remove('show');
      this.musicPlayer.classList.add('hide');
      this.musicBubble.classList.remove('player-visible');
      this.musicBubble.classList.add('player-hidden');
    }
  }
  
  setupPageVisibilityHandlers() {
    // Save state when page is about to unload
    window.addEventListener('beforeunload', () => {
      this.savePersistentState();
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.savePersistentState();
      } else {
        // Restore state when page becomes visible
        this.loadPersistentState();
        this.updateUI();
        this.updatePlayerVisibility();
      }
    });
    
    // Save state periodically to ensure persistence
    setInterval(() => {
      if (this.isPlaying || this.audio.currentTime > 0) {
        this.savePersistentState();
      }
    }, 1000); // Save every second
  }
  
  autoResumeMusic() {
    // Check if music was playing and try to resume
    if (this.persistentState && this.persistentState.isPlaying) {
      // Wait a bit for page to fully load
      setTimeout(() => {
        this.audio.play().then(() => {
          this.isPlaying = true;
          this.updateUI();
          console.log('Music auto-resumed successfully');
        }).catch(e => {
          console.log('Auto-resume prevented, will retry on user interaction:', e);
          this.pendingPlay = true;
          // Show user that music is ready to play
          this.showPlayMessage();
        });
      }, 500); // Wait 500ms for page to load
    }
  }
  
  attemptAutoPlay() {
    // Try to play music if it was playing before
    if (this.persistentState && this.persistentState.isPlaying && !this.isPlaying) {
      this.audio.play().then(() => {
        this.isPlaying = true;
        this.updateUI();
        console.log('Music auto-played after delay');
      }).catch(e => {
        console.log('Auto-play still prevented:', e);
        this.pendingPlay = true;
      });
    }
  }

  setupAutoPlay() {
    // Try to play on first user interaction
    const playOnInteraction = (e) => {
      if (this.pendingPlay || (!this.isPlaying && this.persistentState.isPlaying)) {
        this.play();
        this.pendingPlay = false;
        // Remove listeners after successful play
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('keydown', playOnInteraction);
      }
    };
    
    // Add multiple event listeners for better coverage
    document.addEventListener('click', playOnInteraction);
    document.addEventListener('touchstart', playOnInteraction);
    document.addEventListener('keydown', playOnInteraction);
    
    // Also try to play on scroll (user interaction)
    let scrollAttempted = false;
    window.addEventListener('scroll', () => {
      if (!scrollAttempted && (this.pendingPlay || (!this.isPlaying && this.persistentState.isPlaying))) {
        scrollAttempted = true;
        this.play();
        this.pendingPlay = false;
      }
    });
  }
  
  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  
  play() {
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updateUI();
      this.savePersistentState();
    }).catch(error => {
      console.log('Auto-play was prevented:', error);
      // Show user interaction required message
      this.showPlayMessage();
    });
  }
  
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updateUI();
    this.savePersistentState();
  }
  
  setVolume(volume) {
    this.volume = volume;
    this.audio.volume = volume;
    this.updateVolumeIcon();
    this.savePersistentState();
  }
  
  updateVolumeIcon() {
    if (this.volume === 0) {
      this.volumeIcon.className = 'bi bi-volume-mute';
    } else if (this.volume < 0.5) {
      this.volumeIcon.className = 'bi bi-volume-down';
    } else {
      this.volumeIcon.className = 'bi bi-volume-up';
    }
  }
  
  updateUI() {
    if (this.isPlaying) {
      this.musicIcon.className = 'bi bi-pause-fill';
      this.musicPlayer.classList.add('playing');
      this.musicBubble.classList.add('playing');
      this.bubbleIcon.className = 'bi bi-pause-fill';
    } else {
      this.musicIcon.className = 'bi bi-play-fill';
      this.musicPlayer.classList.remove('playing');
      this.musicBubble.classList.remove('playing');
      this.bubbleIcon.className = 'bi bi-music-note';
    }
  }
  
  updateTime() {
    const current = this.formatTime(this.audio.currentTime);
    const total = this.formatTime(this.audio.duration);
    
    this.currentTimeEl.textContent = current;
    this.totalTimeEl.textContent = total;
    
    // Save state periodically
    if (this.audio.currentTime % 5 < 0.1) { // Every 5 seconds
      this.savePersistentState();
    }
  }
  
  updateDuration() {
    const total = this.formatTime(this.audio.duration);
    this.totalTimeEl.textContent = total;
  }
  
  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  onPlay() {
    this.isPlaying = true;
    this.updateUI();
  }
  
  onPause() {
    this.isPlaying = false;
    this.updateUI();
  }
  
  onEnded() {
    this.isPlaying = false;
    this.updateUI();
  }
  
  initVisualizer() {
    // Create audio context for visualizer
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.animationId = null;
    
    this.setupAudioContext();
  }
  
  setupAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.source = this.audioContext.createMediaElementSource(this.audio);
      
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      
      this.analyser.fftSize = 256;
      this.bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(this.bufferLength);
      
      this.animateVisualizer();
    } catch (error) {
      console.log('Audio context not supported:', error);
    }
  }
  
  animateVisualizer() {
    if (!this.analyser || !this.isPlaying) {
      this.animationId = requestAnimationFrame(() => this.animateVisualizer());
      return;
    }
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    const bars = document.querySelectorAll('.visualizer-bar');
    const step = Math.floor(this.dataArray.length / bars.length);
    
    bars.forEach((bar, index) => {
      const value = this.dataArray[index * step];
      const height = (value / 255) * 20 + 4;
      bar.style.height = `${height}px`;
    });
    
    this.animationId = requestAnimationFrame(() => this.animateVisualizer());
  }
  
  showPlayMessage() {
    // Create a temporary message
    const message = document.createElement('div');
    message.innerHTML = '🎵 Nhạc đã sẵn sàng - Click để phát';
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      z-index: 1001;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      animation: slideInRight 0.5s ease-out, fadeOut 2.5s ease-in 0.5s;
      cursor: pointer;
      border: 2px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Make it clickable to start music
    message.addEventListener('click', () => {
      this.play();
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    });
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 3000);
  }
}

// Initialize music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if music player elements exist
  if (document.getElementById('music-player')) {
    window.musicPlayer = new MusicPlayer();
  }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    20%, 80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  
  @keyframes slideInRight {
    0% { transform: translateX(100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }
`;
document.head.appendChild(style);
