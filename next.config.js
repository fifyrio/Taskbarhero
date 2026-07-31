const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // Enable SWC minification for faster builds and smaller bundles
  swcMinify: true,

  // Enable gzip compression
  compress: true,

  // Optimize for production deployment
  output: 'standalone',

  images: {
    unoptimized: true,
  },

  // Optimize package imports to reduce bundle size
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', 'react-hot-toast'],
    // Bundle the game database JSON with the serverless functions (read via fs at
    // runtime, so not auto-traced). Required for /database routes on Vercel.
    outputFileTracingIncludes: {
      '/[locale]/database/**': ['./data/taskbarhero-database/**'],
    },
  },
}

module.exports = withNextIntl(nextConfig);
