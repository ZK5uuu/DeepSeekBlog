/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com', 
      'localhost', 
      'm.media-amazon.com', 
      'image.tmdb.org',
      'i.scdn.co',                  // Spotify图片域名
      'p2.music.126.net',           // 网易云音乐图片域名
      'p3.music.126.net',
      'p4.music.126.net',
      'p1.music.126.net'
    ],
  },
};

module.exports = nextConfig; 