let audioContext: AudioContext | null = null;

export function enableNotificationSound() {
  try {
    if (typeof window === "undefined" || !window.AudioContext) return;

    audioContext ??= new window.AudioContext();

    if (audioContext.state !== "running") {
      void audioContext.resume().catch(() => {
        // Browser may block audio until the user interacts.
      });
    }
  } catch {
    // Sound is optional.
  }
}

export function playNotificationSound() {
  const context = audioContext;

  if (!context || context.state === "closed") return;

  void (async () => {
    try {
      if (context.state !== "running") {
        await context.resume();
      }

      if (context.state !== "running") return;

      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, context.currentTime);

      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.7, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.25,
      );

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.27);

      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    } catch {
      // Sound is optional.
    }
  })();
}

export function cleanupNotificationSound() {
  const context = audioContext;

  audioContext = null;

  if (context && context.state !== "closed") {
    void context.close().catch(() => {});
  }
}
