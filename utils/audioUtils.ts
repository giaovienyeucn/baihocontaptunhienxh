let voices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

// Hàm tải danh sách giọng đọc từ trình duyệt
const loadVoices = () => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        voicesLoaded = true;
    }
  }
};

// Khởi tạo và lắng nghe sự kiện thay đổi giọng đọc
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export const checkVietnameseVoice = (): Promise<boolean> => {
    return new Promise((resolve) => {
        // Nếu giọng đã load rồi thì check luôn
        if (voicesLoaded && voices.length > 0) {
            const hasVi = voices.some(v => v.lang.includes('vi'));
            resolve(hasVi);
            return;
        }

        // Nếu chưa load (Chrome lần đầu mở), đợi sự kiện
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            // Check ngay lần đầu (trường hợp browser sync)
            const currentVoices = window.speechSynthesis.getVoices();
            if (currentVoices.length > 0) {
                 voices = currentVoices;
                 resolve(currentVoices.some(v => v.lang.includes('vi')));
                 return;
            }

            // Đặt timeout 2s, nếu không thấy gì thì trả về false (để UI không bị treo)
            const timeout = setTimeout(() => resolve(false), 2000);

            window.speechSynthesis.onvoiceschanged = () => {
                clearTimeout(timeout);
                voices = window.speechSynthesis.getVoices();
                voicesLoaded = true;
                resolve(voices.some(v => v.lang.includes('vi')));
            };
        } else {
            resolve(false);
        }
    });
};

export const speak = (text: string) => {
  if (!window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  
  if (voices.length === 0) {
    loadVoices();
  }

  const vnVoice = 
    voices.find(v => v.name.includes('Google') && v.lang.includes('vi')) ||
    voices.find(v => v.lang === 'vi-VN') ||
    voices.find(v => v.lang.includes('vi'));

  if (vnVoice) {
    utterance.voice = vnVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const playSound = (type: 'correct' | 'wrong' | 'click' | 'victory') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;

  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'correct') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  } else if (type === 'wrong') {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(150, now);
    oscillator.frequency.linearRampToValueAtTime(100, now + 0.2);
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  } else if (type === 'click') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    oscillator.start(now);
    oscillator.stop(now + 0.08);
  } else if (type === 'victory') {
    const frequencies = [523.25, 659.25, 783.99, 1046.50];
    frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gn = ctx.createGain();
        osc.connect(gn);
        gn.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gn.gain.setValueAtTime(0.2, now + i * 0.12);
        gn.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.4);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
    });
  }
};