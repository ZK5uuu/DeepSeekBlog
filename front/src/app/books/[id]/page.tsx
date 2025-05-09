'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaArrowLeft, FaBookOpen, FaUser, FaCalendarAlt, FaComment, FaTag } from 'react-icons/fa';

// 使用与列表页相同的书籍数据，但添加更多的详细信息
const booksData = [
  {
    id: 1,
    title: '未来简史',
    author: '尤瓦尔·赫拉利',
    year: 2017,
    cover: 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?q=80&w=600',
    description: '探索人类未来可能面临的挑战和机遇，深入分析技术发展对人类社会的影响。',
    fullDescription: '《未来简史》是以色列历史学家尤瓦尔·赫拉利的重要著作，继《人类简史》之后的又一力作。书中探讨了在生物技术和信息技术飞速发展的背景下，人类未来可能面临的种种挑战与变革。赫拉利预测，生物技术和人工智能的发展将彻底改变人类社会，甚至可能导致人类物种的升级或替代。作者以深刻的洞察力和广阔的视野，带领读者思考技术进步、生命延长、数据革命等议题背后的伦理和哲学问题，探讨人类作为物种的未来走向。',
    rating: 4.7,
    genre: ['历史', '哲学', '科技'],
    previewUrl: 'https://book.douban.com/subject/26943161/',
    publisher: '中信出版社',
    pages: 432,
    language: '简体中文',
    reviews: [
      { user: '思考者', content: '对未来技术发展的深刻洞察，引人深思。', rating: 5 },
      { user: '科技迷', content: '关于AI和生物技术的讨论非常前瞻性，但有些观点过于悲观。', rating: 4 }
    ],
    relatedBooksIds: [3, 5, 6]
  },
  {
    id: 2,
    title: '活着',
    author: '余华',
    year: 1993,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600',
    description: '讲述了农村人福贵悲惨的人生遭遇，深刻揭示了命运的无常与生活的真谛。',
    fullDescription: '《活着》是中国作家余华的代表作，也是中国当代文学的经典之作。小说讲述了一个人穷尽一生的辛酸故事：福贵出身于地主家庭，因赌博败光家产后成为贫农，经历了战争、"大跃进"和"文化大革命"等社会动荡，先后失去了父母、妻子、儿女，最终只剩下一头老牛相伴。小说以平静而朴素的笔调，深刻展现了普通人在苦难中的生存状态，探讨了生命的意义和价值。余华通过福贵的故事，揭示了中国几十年的社会变革给普通人带来的巨大影响，以及人性的坚韧与尊严。',
    rating: 4.9,
    genre: ['小说', '文学', '中国现代'],
    previewUrl: 'https://book.douban.com/subject/4913064/',
    publisher: '作家出版社',
    pages: 191,
    language: '简体中文',
    reviews: [
      { user: '文学爱好者', content: '朴实无华的语言中蕴含着强大的力量，读完泪流满面。', rating: 5 },
      { user: '夜读者', content: '对生命意义的探索令人震撼，是中国文学的瑰宝。', rating: 5 }
    ],
    relatedBooksIds: [4, 6]
  },
  {
    id: 3,
    title: '人工智能简史',
    author: '尼克',
    year: 2019,
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600',
    description: '从图灵测试到深度学习，全面介绍人工智能的发展历程、技术原理与未来前景。',
    fullDescription: '《人工智能简史》系统地回顾了人工智能从概念提出到现在的发展历程，梳理了各个重要时期的技术突破和理论创新。书中不仅介绍了图灵测试、专家系统、机器学习、深度学习等关键概念和技术，还讨论了AI在各领域的应用现状和未来可能的发展方向。作者以通俗易懂的语言解释了复杂的技术原理，同时也不回避AI发展中的争议和伦理问题，为读者提供了全面了解人工智能的入门指南。',
    rating: 4.5,
    genre: ['科技', '计算机', '科普'],
    previewUrl: 'https://book.douban.com/subject/34836531/',
    publisher: '电子工业出版社',
    pages: 328,
    language: '简体中文',
    reviews: [
      { user: 'AI研究者', content: '内容全面，叙述清晰，适合入门学习。', rating: 4 },
      { user: '技术爱好者', content: '对历史的梳理很有价值，但对最新发展介绍不够深入。', rating: 4 }
    ],
    relatedBooksIds: [1, 5]
  },
  {
    id: 4,
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    year: 1967,
    cover: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600',
    description: '讲述了布恩迪亚家族七代人的传奇故事，是魔幻现实主义文学的代表作。',
    fullDescription: '《百年孤独》是哥伦比亚作家加西亚·马尔克斯的代表作，也是拉丁美洲魔幻现实主义文学的巅峰之作。小说以虚构的马孔多镇为背景，通过布恩迪亚家族七代人的兴衰历程，展现了拉丁美洲的历史、文化和社会变迁。作品融合了现实与幻想、历史与神话，创造出一个独特的文学世界，其中充满了神奇的事件和奇特的人物。马尔克斯以丰富的想象力和独特的叙事方式，探讨了孤独、时间、命运、爱情等永恒的主题，为读者呈现了一部史诗般的文学杰作。',
    rating: 4.8,
    genre: ['小说', '魔幻现实主义', '外国文学'],
    previewUrl: 'https://book.douban.com/subject/6082808/',
    publisher: '南海出版公司',
    pages: 360,
    language: '简体中文',
    reviews: [
      { user: '文学评论家', content: '一部关于记忆与遗忘的永恒杰作，每一章都有惊人的想象力。', rating: 5 },
      { user: '外国文学爱好者', content: '复杂的人物关系和时间线需要细读，但值得投入时间。', rating: 4 }
    ],
    relatedBooksIds: [2, 6]
  },
  {
    id: 5,
    title: '设计心理学',
    author: '唐纳德·诺曼',
    year: 2015,
    cover: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600',
    description: '探讨设计与人类心理的关系，解析如何创造出符合用户认知与情感需求的产品。',
    fullDescription: '《设计心理学》是认知心理学家唐纳德·诺曼关于产品设计的经典著作，书中深入探讨了设计如何影响人类的行为和情感体验。诺曼通过大量的实例分析，揭示了好的设计应该是符合人类认知规律和行为习惯的，强调了以用户为中心的设计理念。书中提出的"可见性"、"反馈"、"约束"、"映射"等设计原则，对现代产品设计产生了深远的影响。作者还分析了设计失误的原因，以及情感因素在设计中的重要性，为设计师、工程师和产品经理提供了实用的指导。',
    rating: 4.6,
    genre: ['设计', '心理学', '科技'],
    previewUrl: 'https://book.douban.com/subject/26742341/',
    publisher: '中信出版社',
    pages: 256,
    language: '简体中文',
    reviews: [
      { user: '设计师', content: '改变了我对设计的思考方式，很有启发性。', rating: 5 },
      { user: '产品经理', content: '理论与实践结合得很好，对工作有直接帮助。', rating: 4 }
    ],
    relatedBooksIds: [1, 3]
  },
  {
    id: 6,
    title: '三体',
    author: '刘慈欣',
    year: 2008,
    cover: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=600',
    description: '描绘了人类文明与三体文明的惊心动魄的遭遇，展现宏大的宇宙想象。',
    fullDescription: '《三体》是中国科幻作家刘慈欣的代表作，也是中国科幻文学史上的里程碑。小说以"文化大革命"时期为开端，描述了地球文明与三体文明的第一次接触，以及由此引发的一系列震撼人心的故事。作品构建了一个宏大的宇宙文明图景，探讨了技术发展、文明冲突、生存危机等深刻主题。刘慈欣以严谨的科学态度和丰富的想象力，创造了"三体世界"、"智子"、"黑暗森林法则"等经典设定，展现了人类在宇宙尺度上的渺小与伟大。《三体》三部曲获得了雨果奖等国际科幻大奖，成为向世界展示中国科幻实力的重要作品。',
    rating: 4.9,
    genre: ['科幻', '小说', '中国文学'],
    previewUrl: 'https://book.douban.com/subject/2567698/',
    publisher: '重庆出版社',
    pages: 302,
    language: '简体中文',
    reviews: [
      { user: '科幻迷', content: '宏大的宇宙想象和独特的科学概念，开创了中国硬科幻的新高度。', rating: 5 },
      { user: '物理学家', content: '对基础物理学概念的运用非常巧妙，虽有科学夸张但逻辑自洽。', rating: 5 }
    ],
    relatedBooksIds: [1, 2, 4]
  }
];

// 创建类型映射（用于路由）
const genreMapping: Record<string, { en: string, icon: string }> = {
  '历史': { en: 'history', icon: '📜' },
  '哲学': { en: 'philosophy', icon: '🧠' },
  '科技': { en: 'technology', icon: '💻' },
  '小说': { en: 'fiction', icon: '📚' },
  '文学': { en: 'literature', icon: '📖' },
  '中国现代': { en: 'modern-chinese', icon: '🇨🇳' },
  '计算机': { en: 'computer', icon: '🖥️' },
  '科普': { en: 'popular-science', icon: '🔬' },
  '魔幻现实主义': { en: 'magical-realism', icon: '✨' },
  '外国文学': { en: 'foreign-literature', icon: '🌍' },
  '设计': { en: 'design', icon: '🎨' },
  '心理学': { en: 'psychology', icon: '🧩' },
  '科幻': { en: 'science-fiction', icon: '🚀' },
  '中国文学': { en: 'chinese-literature', icon: '🏮' }
};

export default function BookDetail({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [book, setBook] = useState<any | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<any[]>([]);

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      const bookId = parseInt(params.id);
      const foundBook = booksData.find(b => b.id === bookId);
      
      if (foundBook) {
        setBook(foundBook);
        
        // 获取相关书籍
        if (foundBook.relatedBooksIds) {
          const related = booksData.filter(b => 
            foundBook.relatedBooksIds.includes(b.id)
          );
          setRelatedBooks(related);
        }
      }
      
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-content">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-content">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">书籍未找到</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">抱歉，我们无法找到您请求的书籍。</p>
        <Link href="/books">
          <span className="btn-primary inline-flex items-center bg-blue-600 hover:bg-blue-700">
            <FaArrowLeft className="mr-2" /> 返回书籍列表
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-content">
      {/* 书籍详情头部 */}
      <header className="bg-blue-700 dark:bg-blue-900 text-white py-12">
        <div className="container-custom">
          <Link href="/books" className="text-white/80 hover:text-white transition-colors mb-4 inline-flex items-center">
            <FaArrowLeft className="mr-2" /> 返回书籍列表
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="relative h-80 md:h-96 w-full max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
                <Image
                  src={book.cover}
                  alt={book.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              </div>
              
              {book.previewUrl && (
                <a 
                  href={book.previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md w-full max-w-xs mx-auto flex items-center justify-center"
                >
                  <FaBookOpen className="mr-2" /> 在线预览
                </a>
              )}
            </div>
            
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-6">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-medium">{book.rating.toFixed(1)}</span>
                </div>
                <span className="text-white/80">
                  <FaUser className="inline mr-2" /> {book.author}
                </span>
              </div>
              
              <p className="text-white/90 mb-6 text-lg">{book.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-white/80 text-sm">
                <div>
                  <span className="block font-semibold">出版年份</span>
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-2" /> {book.year}
                  </span>
                </div>
                <div>
                  <span className="block font-semibold">出版社</span>
                  <span>{book.publisher}</span>
                </div>
                <div>
                  <span className="block font-semibold">页数</span>
                  <span>{book.pages} 页</span>
                </div>
                <div>
                  <span className="block font-semibold">语言</span>
                  <span>{book.language}</span>
                </div>
                <div className="col-span-2">
                  <span className="block font-semibold">分类</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {book.genre.map((genre: string) => (
                      <Link key={genre} href={`/books/genre/${genreMapping[genre]?.en || genre}`}>
                        <span className="inline-flex items-center text-xs px-2 py-1 bg-blue-600/30 hover:bg-blue-600/50 rounded-full">
                          {genreMapping[genre]?.icon || '📚'} {genre}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:w-2/3">
            {/* 书籍详细介绍 */}
            <section className="mb-12">
              <h2 className="section-title mb-6">关于本书</h2>
              <div className="bg-white dark:bg-card rounded-lg p-6 shadow border border-gray-100 dark:border-gray-800">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {book.fullDescription}
                </p>
              </div>
            </section>
            
            {/* 读者评论 */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-title">读者评论</h2>
                <button className="btn-secondary flex items-center">
                  <FaComment className="mr-2" /> 写评论
                </button>
              </div>
              
              {book.reviews && book.reviews.length > 0 ? (
                <div className="space-y-4">
                  {book.reviews.map((review: any, index: number) => (
                    <motion.div 
                      key={index}
                      className="bg-white dark:bg-card rounded-lg p-4 shadow border border-gray-100 dark:border-gray-800"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900 dark:text-white">{review.user}</div>
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < review.rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{review.content}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-card rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">暂无评论，成为第一个评论者吧！</p>
                </div>
              )}
            </section>
          </div>
          
          {/* 右侧边栏 */}
          <div className="lg:w-1/3">
            {/* 相关书籍推荐 */}
            <section className="sticky top-24">
              <h2 className="section-title mb-6">相关推荐</h2>
              
              {relatedBooks.length > 0 ? (
                <div className="space-y-4">
                  {relatedBooks.map(relatedBook => (
                    <Link key={relatedBook.id} href={`/books/${relatedBook.id}`}>
                      <motion.div 
                        className="flex bg-white dark:bg-card rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800"
                        whileHover={{ x: 5 }}
                      >
                        <div className="w-20 h-28 relative flex-shrink-0">
                          <Image
                            src={relatedBook.cover}
                            alt={relatedBook.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div className="p-3 flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{relatedBook.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">{relatedBook.author}</p>
                          <div className="flex items-center">
                            <FaStar className="text-yellow-500 text-xs mr-1" />
                            <span className="text-xs text-gray-700 dark:text-gray-300">{relatedBook.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-card rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">暂无相关推荐</p>
                </div>
              )}
              
              {/* 标签云 */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FaTag className="mr-2" /> 热门标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['小说', '科幻', '历史', '哲学', '经典', '外国文学', '中国文学', '科技', '心理学', '设计', '科普', '社会学', '经济', '政治', '艺术'].map(tag => (
                    <Link key={tag} href={`/books/genre/${genreMapping[tag]?.en || tag}`} className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 