// helpers/image.js

import { Canvas } from 'canvas';

export function applyText(canvas: Canvas, text: string, font?: string): string;

// helpers/log.js

export function log(type: 'success' | 'info' | 'error' | 'warning', message: string | number): void;

// helpers/numbers.js

export function isNegativeNumber(number: number): boolean;