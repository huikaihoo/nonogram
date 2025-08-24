import type { Preset } from '@vite-pwa/assets-generator/config';
import { defineConfig } from '@vite-pwa/assets-generator/config';

const preset: Preset = {
  transparent: {
    sizes: [],
    favicons: [],
  },
  maskable: {
    sizes: [],
  },
  apple: {
    sizes: [180],
    padding: 0,
  },
  assetName: () => {
    return 'icon.png';
  },
};

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset,
  images: ['public/icon.svg'],
});
