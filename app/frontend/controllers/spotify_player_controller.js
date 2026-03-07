import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = [
    "status",
    "device",
    "toggle",
    "trackName",
    "artist",
    "elapsed",
    "duration",
    "progress",
    "volume",
    "transfer",
    "artwork",
    "artworkPlaceholder",
    "spotifyLink"
  ];

  static values = {
    token: String,
    scopes: String
  };

  connect() {
    this.deviceId = null;
    this.player = null;
    this.token = this.tokenValue?.trim();

    if (!this.token) {
      this.setStatus("Missing access token. Login again to Spotify.", true);
      this.disableControls();
      return;
    }

    const missingScopes = this.missingRequiredScopes();
    if (missingScopes.length > 0) {
      this.setStatus(`Missing scopes: ${missingScopes.join(", ")}. Re-login at /login.`, true);
      this.disableControls();
      return;
    }

    this.setStatus("Loading Spotify SDK...");
    this.loadSDK();
  }

  disconnect() {
    if (this.player) {
      this.player.disconnect();
      this.player = null;
    }
  }

  requiredScopes() {
    return [
      "streaming",
      "user-read-email",
      "user-read-private",
      "user-read-playback-state",
      "user-modify-playback-state"
    ];
  }

  grantedScopes() {
    return new Set((this.scopesValue || "").split(" ").filter(Boolean));
  }

  missingRequiredScopes() {
    const granted = this.grantedScopes();
    return this.requiredScopes().filter((scope) => !granted.has(scope));
  }

  async togglePlay() {
    if (!this.player) return;

    try {
      await this.player.togglePlay();
    } catch (error) {
      console.error(error);
      this.setStatus("Failed to toggle playback.", true);
    }
  }

  activateElement() {
    if (!this.player) return;

    try {
      this.player.activateElement();
      this.setStatus("Player activated for mobile playback transfer.");
    } catch (error) {
      console.error(error);
      this.setStatus("Unable to activate element.", true);
    }
  }

  async transferPlayback() {
    if (!this.deviceId || !this.token) return;

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`
        },
        body: JSON.stringify({
          device_ids: [this.deviceId],
          play: true
        })
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || "Transfer failed");
      }

      this.setStatus("Playback transferred to this browser.");
    } catch (error) {
      console.error(error);
      this.setStatus("Could not transfer playback.", true);
    }
  }

  async setVolume(event) {
    if (!this.player) return;

    const input = event.target;
    const value = Number(input.value) / 100;

    try {
      await this.player.setVolume(value);
    } catch (error) {
      console.error(error);
      this.setStatus("Could not change volume.", true);
    }
  }

  loadSDK() {
    if (window.Spotify) {
      this.initPlayer();
      return;
    }

    const previousReady = window.onSpotifyWebPlaybackSDKReady;
    window.onSpotifyWebPlaybackSDKReady = () => {
      if (typeof previousReady === "function") previousReady();
      this.initPlayer();
    };

    const existingScript = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
    if (existingScript) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
  }

  initPlayer() {
    if (!window.Spotify || this.player) return;

    this.player = new window.Spotify.Player({
      name: "Spotify Client Web Player",
      getOAuthToken: (cb) => cb(this.token),
      volume: this.hasVolumeTarget ? Number(this.volumeTarget.value) / 100 : 0.5
    });

    this.player.addListener("ready", ({ device_id }) => {
      this.deviceId = device_id;
      this.enableControls();
      this.setStatus("Ready. Transfer playback to start listening.");
      if (this.hasDeviceTarget) this.deviceTarget.textContent = device_id;
      if (this.hasTransferTarget) this.transferTarget.disabled = false;
      console.log("Ready with Device ID", device_id);
    });

    this.player.addListener("not_ready", ({ device_id }) => {
      this.setStatus("Player went offline.", true);
      console.log("Device ID offline", device_id);
    });

    this.player.addListener("player_state_changed", (state) => {
      this.renderState(state);
    });

    this.player.addListener("initialization_error", ({ message }) => {
      console.error(message);
      this.setStatus(`Initialization error: ${message}`, true);
    });

    this.player.addListener("authentication_error", ({ message }) => {
      console.error(message);
      this.setStatus(`Authentication error: ${message}. Re-login at /login.`, true);
    });

    this.player.addListener("account_error", ({ message }) => {
      console.error(message);
      this.setStatus(`Account error: ${message}. Spotify Premium is required.`, true);
    });

    this.player.addListener("playback_error", ({ message }) => {
      console.error(message);
      this.setStatus(`Playback error: ${message}`, true);
    });

    this.player.connect().then((connected) => {
      if (!connected) {
        this.setStatus("Could not connect player.", true);
      }
    });
  }

  renderState(state) {
    if (!state) {
      this.setStatus("Connected. Open Spotify and transfer playback to this device.");
      this.clearNowPlaying();
      return;
    }

    const track = state.track_window?.current_track;
    const name = track?.name || "Nothing playing";
    const artists = (track?.artists || []).map((a) => a.name).join(", ") || "-";

    if (this.hasTrackNameTarget) {
      this.trackNameTarget.textContent = name;
      this.trackNameTarget.title = name;
    }
    if (this.hasArtistTarget) this.artistTarget.textContent = artists;

    const elapsedMs = state.position || 0;
    const durationMs = track?.duration_ms || 0;

    if (this.hasElapsedTarget) this.elapsedTarget.textContent = this.formatTime(elapsedMs);
    if (this.hasDurationTarget) this.durationTarget.textContent = this.formatTime(durationMs);

    if (this.hasProgressTarget) {
      const percentage = durationMs > 0 ? (elapsedMs / durationMs) * 100 : 0;
      this.progressTarget.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    }

    if (this.hasToggleTarget) {
      this.toggleTarget.textContent = state.paused ? "Play" : "Pause";
    }

    // Artwork: Spotify guideline — original form, no overlay; 4px/8px radius handled in HTML
    if (this.hasArtworkTarget && this.hasArtworkPlaceholderTarget) {
      const imgUrl = track?.album?.images?.[0]?.url;
      if (imgUrl) {
        this.artworkTarget.src = imgUrl;
        this.artworkTarget.alt = track.album.name || name;
        this.artworkTarget.classList.remove("hidden");
        this.artworkPlaceholderTarget.classList.add("hidden");
      } else {
        this.artworkTarget.removeAttribute("src");
        this.artworkTarget.classList.add("hidden");
        this.artworkPlaceholderTarget.classList.remove("hidden");
      }
    }

    // Link to Spotify (LISTEN ON SPOTIFY / OPEN SPOTIFY when app available)
    if (this.hasSpotifyLinkTarget) {
      const url = track?.external_urls?.spotify || track?.uri?.replace("spotify:", "https://open.spotify.com/").replace(":", "/") || "https://open.spotify.com";
      this.spotifyLinkTarget.href = url;
      this.spotifyLinkTarget.classList.toggle("hidden", !track);
    }
  }

  clearNowPlaying() {
    if (this.hasArtworkTarget && this.hasArtworkPlaceholderTarget) {
      this.artworkTarget.removeAttribute("src");
      this.artworkTarget.classList.add("hidden");
      this.artworkPlaceholderTarget.classList.remove("hidden");
    }
    if (this.hasSpotifyLinkTarget) {
      this.spotifyLinkTarget.href = "https://open.spotify.com";
      this.spotifyLinkTarget.classList.add("hidden");
    }
  }

  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  setStatus(text, isError = false) {
    if (!this.hasStatusTarget) return;

    this.statusTarget.textContent = text;
    this.statusTarget.classList.toggle("text-rose-300", isError);
    this.statusTarget.classList.toggle("text-slate-300/80", !isError);
  }

  disableControls() {
    if (this.hasToggleTarget) this.toggleTarget.disabled = true;
    if (this.hasTransferTarget) this.transferTarget.disabled = true;
  }

  enableControls() {
    if (this.hasToggleTarget) this.toggleTarget.disabled = false;
  }
}
