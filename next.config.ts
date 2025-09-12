// next.config.ts
import type { NextConfig } from 'next';
import path from 'path';

const config: NextConfig = {
  // fixes the “multiple lockfiles” root guess warning
  outputFileTracingRoot: path.join(__dirname),

  // don’t fail the build on ESLint right now
  eslint: { ignoreDuringBuilds: true },

  // let us use <img> for now without image optimization
  images: { unoptimized: true },
};

export default config;