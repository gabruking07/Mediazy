const hostedApiBaseUrl = 'https://mediazy.onrender.com';
const configuredApiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || hostedApiBaseUrl;
const apiBaseUrl = configuredApiBaseUrl.replace(/\/$/, '');
const shouldProxyApi = apiBaseUrl && !/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(apiBaseUrl);

const nextConfig = {
  distDir: 'dist',
  async rewrites() {
    if (!shouldProxyApi) {
      return [];
    }

    return [
      {
        source: '/api/:path*',
        destination: `${apiBaseUrl}/api/:path*`
      },
      {
        source: '/health',
        destination: `${apiBaseUrl}/health`
      }
    ];
  }
};

export default nextConfig;
