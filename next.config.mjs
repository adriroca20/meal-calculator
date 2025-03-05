/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Solo si estamos en el cliente (navegador)
    if (!isServer) {
      // Evitar que los módulos de Node.js se incluyan en el bundle del cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        crypto: false,
        stream: false,
        zlib: false,
        path: false,
        os: false,
        util: false,
      };
    }
    return config;
  },
};

export default nextConfig; 