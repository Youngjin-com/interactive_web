import { TIMEOUT } from './config.js';

export class VideoBackground {
  constructor($containerElement) {
    this.$container = $containerElement;
    this.currentVideo = null;
    this.videoSources = new Map();
  }

  preloadVideo(videoSrc) {
    return new Promise((resolve, reject) => {
      const $video = document.createElement('video');
      $video.preload = 'metadata';

      const onLoadedMetadata = () => {
        this.cleanupVideoListeners($video, timeoutId, resolve);
      };

      const onError = () => {
        this.cleanupVideoListeners($video, timeoutId, () => reject(new Error(`비디오 preload 실패: ${videoSrc}`)));
      };

      $video.addEventListener('loadedmetadata', onLoadedMetadata);
      $video.addEventListener('error', onError);

      const timeoutId = setTimeout(() => {
        this.cleanupVideoListeners($video, timeoutId, () => reject(new Error(`비디오 preload 시간 초과: ${videoSrc}`)));
      }, TIMEOUT.VIDEO_PRELOAD_TIMEOUT);

      $video.src = videoSrc;
    });
  }

  cleanupVideoListeners($video, timeoutId, callback) {
    $video.removeEventListener('loadedmetadata', this.cleanupVideoListeners);
    $video.removeEventListener('error', this.cleanupVideoListeners);
    clearTimeout(timeoutId);
    callback();
  }

  createVideoElement(src, weatherClass) {
    const $video = document.createElement('video');
    $video.src = src;
    $video.muted = true;
    $video.autoplay = true;
    $video.loop = true;
    $video.playsInline = true;
    $video.dataset.weatherClass = weatherClass;
    return $video;
  }

  buildVideoSrc(weatherClass) {
    return `../public/video/weather_${weatherClass}.mp4`;
  }

  async getVideoSource(weatherClass) {
    if (!this.videoSources.has(weatherClass)) {
      const videoSrc = this.buildVideoSrc(weatherClass);
      await this.preloadVideo(videoSrc);
      this.videoSources.set(weatherClass, videoSrc);
    }
    return this.videoSources.get(weatherClass);
  }

  async switchToNewVideo(src, weatherClass) {
    const newVideo = this.createVideoElement(src, weatherClass);

    try {
      this.$container.appendChild(newVideo);
      await newVideo.play();

      if (this.currentVideo) {
        this.currentVideo.remove();
      }

      this.currentVideo = newVideo;
    } catch (error) {
      console.error('비디오 전환 실패:', error.message);
      newVideo.remove();
    }
  }

  async changeBackground(weatherClass) {
    if (this.currentVideo?.dataset.weatherClass === weatherClass) return;

    try {
      const videoSrc = await this.getVideoSource(weatherClass);
      await this.switchToNewVideo(videoSrc, weatherClass);
    } catch (error) {
      console.error('비디오 전환 실패:', error.message);
    }
  }
}
