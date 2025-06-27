// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    // Add externals only for client-side builds
    if (!isServer) {
      config.externals = [
        ...(config.externals || []),
        'ws',
        'bufferutil',
        'utf-8-validate'
      ];
    }
    
    // Keep the watchOptions from before
    config.watchOptions = {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        'C:/**'
      ]
    };
    
    return config;
  },
  // Add experimental edge support
  experimental: {
    serverActions: true,
    edge: true
  }
}
