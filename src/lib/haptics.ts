function vibrate(pattern: number | number[]) {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

export function hapticTap() {
  vibrate(10);
}

export function hapticResult(tierName: string | null) {
  if (!tierName) {
    vibrate(30);
    return;
  }

  switch (tierName) {
    case '満貫':
    case '跳満':
      vibrate(80);
      break;
    case '倍満':
    case '三倍満':
      vibrate(120);
      break;
    case '役満':
      vibrate([100, 50, 100, 50, 200]);
      break;
    default:
      vibrate(50);
  }
}
