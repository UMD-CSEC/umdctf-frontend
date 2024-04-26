/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_BASE: 'https://api.umdctf.io/api/v1',
        KLODD_URL: 'https://instancer.b01lersc.tf'
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.module.rules.push({
            test: /\.(vert|frag)$/,
            type: 'asset/source'
        })
        return config
    },
    async rewrites() {
        // Rewrite attempts to call the rCTF backend to their actual destination.
        return [
            {
                source: '/api/v1/:path*',
                destination: `${this.env.API_BASE}/:path*`
            }
        ]
    }
}

module.exports = nextConfig
