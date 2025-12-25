
export const generateChaosPosition = (radius: number = 20): [number, number, number] => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = radius * Math.pow(Math.random(), 1 / 3);
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ];
};

export const generateTreePosition = (height: number = 10, maxRadius: number = 4): [number, number, number] => {
  const y = Math.random() * height;
  const normalizedY = y / height;
  const radiusAtY = maxRadius * (1 - normalizedY);
  const theta = Math.random() * Math.PI * 2;
  
  return [
    radiusAtY * Math.cos(theta),
    y - height / 2, // Center on Y
    radiusAtY * Math.sin(theta),
  ];
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
