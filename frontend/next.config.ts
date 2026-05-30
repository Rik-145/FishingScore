import type { NextConfig }  from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    allowedDevOrigins: ['172.19.208.1'],
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
