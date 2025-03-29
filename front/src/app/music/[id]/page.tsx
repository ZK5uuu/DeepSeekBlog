'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaCalendarAlt, FaUser, FaArrowLeft, FaHeadphones, FaCompactDisc, FaMusic } from 'react-icons/fa';

// 音乐数据
const musicData = [
  {
    id: 1,
    title: '爱爱爱',
    artist: '方大同',
    year: 2007,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600',
    description: '温暖动人的情歌，诠释了爱情最纯粹的状态，方大同标志性的温柔嗓音令人陶醉。',
    fullDescription: '《爱爱爱》是方大同2007年专辑《橙月》中的一首经典情歌，以简单直接的歌词表达了对爱情最纯粹的理解与追求。方大同温暖细腻的声线与简约中不失层次感的编曲完美结合，营造出一种温馨浪漫的氛围。歌曲通过"爱爱爱"的重复咏叹，表达了对爱情执着而真挚的态度，被誉为华语乐坛最动人的情歌之一。',
    rating: 4.8,
    genre: ['R&B', '情歌', '流行'],
    duration: '4:05',
    album: '橙月',
    instruments: ['钢琴', '吉他', '贝斯', '鼓'],
    sampleUrl: 'https://music.163.com/song?id=66463',
    relatedMusicIds: [4, 6]
  },
  {
    id: 2,
    title: '小小的太阳',
    artist: '陶喆',
    year: 2001,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600',
    description: '充满阳光感的正能量歌曲，陶喆以明亮的旋律和积极的歌词传递希望和温暖。',
    fullDescription: '《小小的太阳》是陶喆2001年推出的励志歌曲，收录于专辑《太平盛世》。歌曲以充满活力的旋律和温暖的歌词，传递积极乐观的生活态度。陶喆通过"小小的太阳"比喻每个人心中那份永不熄灭的希望与热情，鼓励人们在面对困难时保持乐观向上的心态。歌曲融合了流行和轻爵士元素，陶喆独特的声线和编曲才华在这首歌中展露无遗，成为华语乐坛经典的励志歌曲。',
    rating: 4.9,
    genre: ['流行', '励志', '华语'],
    duration: '3:57',
    album: '太平盛世',
    instruments: ['钢琴', '吉他', '萨克斯', '鼓'],
    sampleUrl: 'https://music.163.com/song?id=277822',
    relatedMusicIds: [3, 5]
  },
  {
    id: 3,
    title: '独家记忆',
    artist: '陶喆',
    year: 2006,
    cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600',
    description: '深情款款的经典情歌，陶喆以细腻的情感表达和精妙的编曲诠释爱的记忆。',
    fullDescription: '《独家记忆》是陶喆2006年推出的经典情歌，收录于专辑《太美丽》。这首歌以委婉动人的旋律和深情的歌词，讲述了一段刻骨铭心的爱情记忆。陶喆以其特有的声线和情感表达，将爱情中的甜蜜与苦涩、留恋与不舍完美融合。歌曲中"回忆是折叠的日记，打开就有一阵清香扑鼻"等诗意歌词，加上精心编排的弦乐和钢琴伴奏，营造出一种浓郁的怀旧氛围，让听众沉浸在对过往感情的回忆中。',
    rating: 4.7,
    genre: ['流行', '情歌', '华语'],
    duration: '4:32',
    album: '太美丽',
    instruments: ['钢琴', '弦乐', '吉他', '鼓'],
    sampleUrl: 'https://music.163.com/song?id=277827',
    relatedMusicIds: [2, 5]
  },
  {
    id: 4,
    title: '黑白灰',
    artist: '方大同',
    year: 2012,
    cover: 'https://images.unsplash.com/photo-1477233534935-f5e6fe7c1159?q=80&w=600',
    description: '融合爵士与R&B元素的都市情歌，方大同以独特的音乐风格展现内心的复杂情感。',
    fullDescription: '《黑白灰》是方大同2012年专辑《JTW 西游记》中的一首代表作，歌曲以爵士和R&B元素为基础，融合了urban风格的编曲。方大同通过"黑白灰"三种色调的比喻，深入探讨了现代都市关系中的复杂情感和模糊地带。歌曲展现了方大同作为音乐人的成熟与深度，他以独特的嗓音和音乐风格，将抽象的情感具象化，让听众能够产生强烈的共鸣。整首歌曲旋律丰富，层次分明，是方大同音乐创作生涯中一个重要的里程碑。',
    rating: 4.6,
    genre: ['R&B', '爵士', '都市'],
    duration: '4:27',
    album: 'JTW 西游记',
    instruments: ['钢琴', '萨克斯', '电子合成器', '鼓'],
    sampleUrl: 'https://music.163.com/song?id=22463811',
    relatedMusicIds: [1, 6]
  },
  {
    id: 5,
    title: '寻找爱的起点',
    artist: '陶喆',
    year: 2004,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600',
    description: '陶喆早期代表作，温暖的旋律和富有共鸣的歌词打动了无数聆听者的心。',
    fullDescription: '《寻找爱的起点》是陶喆2004年专辑《陶喆》中的一首经典作品，也是他早期的代表作之一。这首歌以温暖柔和的旋律和富有哲理的歌词，探讨了爱情的本质和意义。陶喆在歌中用"寻找爱的起点"这一主题，引导听众思考爱情最初的纯粹状态，以及在关系中保持真诚和尊重的重要性。歌曲融合了流行、爵士和R&B元素，陶喆标志性的嗓音和精心设计的和声编排，使这首歌成为华语乐坛经久不衰的经典。',
    rating: 4.5,
    genre: ['流行', '情歌', '都市'],
    duration: '4:15',
    album: '陶喆',
    instruments: ['钢琴', '吉他', '贝斯', '鼓'],
    sampleUrl: 'https://music.163.com/song?id=277814',
    relatedMusicIds: [2, 3]
  },
  {
    id: 6,
    title: '微凉',
    artist: '方大同',
    year: 2015,
    cover: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=600',
    description: '轻柔抒情的都市情歌，方大同以细腻的嗓音和深沉的情感诠释成熟爱情的微妙变化。',
    fullDescription: '《微凉》是方大同2015年专辑《异类》中的一首抒情歌曲，以温柔细腻的旋律和耐人寻味的歌词，描绘了一段情感从热烈到微凉的变化过程。方大同以其标志性的柔和声线和细腻的情感表达，精准捕捉了现代都市爱情中的细微情绪变化。歌曲的编曲简约而不简单，钢琴和弦乐的配合营造出一种略带忧伤的氛围，同时又不失温柔与美好。《微凉》展现了方大同作为创作歌手的深度和成熟，被认为是他音乐风格的一次深化和升华。',
    rating: 4.9,
    genre: ['R&B', '情歌', '都市'],
    duration: '4:38',
    album: '异类',
    instruments: ['钢琴', '弦乐', '电子合成器', '吉他'],
    sampleUrl: 'https://music.163.com/song?id=29764562',
    relatedMusicIds: [1, 4]
  }
];

export default function MusicDetail({ params }: { params: { id: string } }) {
  const [music, setMusic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedMusic, setRelatedMusic] = useState<any[]>([]);

  useEffect(() => {
    // 在实际项目中，这里应该是API请求
    const musicId = parseInt(params.id);
    const foundMusic = musicData.find(m => m.id === musicId);
    
    if (foundMusic) {
      setMusic(foundMusic);
      
      // 获取相关音乐
      if (foundMusic.relatedMusicIds && foundMusic.relatedMusicIds.length > 0) {
        const related = musicData.filter(m => foundMusic.relatedMusicIds.includes(m.id));
        setRelatedMusic(related);
      }
    }
    
    setLoading(false);
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-content">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!music) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-content">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">音乐未找到</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">抱歉，我们无法找到您请求的音乐。</p>
      <Link href="/music">
        <span className="btn-primary inline-flex items-center bg-purple-600 hover:bg-purple-700">
          <FaArrowLeft className="mr-2" /> 返回音乐列表
        </span>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-content">
      {/* 音乐封面背景 */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={music.cover}
            alt={music.title}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white dark:to-content"></div>
        </div>
        <div className="container-custom relative h-full flex flex-col justify-end pb-10">
          <Link href="/music" className="text-white hover:text-gray-300 transition-colors mb-4 inline-flex items-center">
            <FaArrowLeft className="mr-2" /> 返回音乐列表
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{music.title}</h1>
          <div className="flex flex-wrap items-center text-white gap-4 mb-4">
            <span className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" /> {music.rating.toFixed(1)}
            </span>
            <span className="flex items-center">
              <FaCalendarAlt className="mr-1" /> {music.year}
            </span>
            <span className="flex items-center">
              <FaUser className="mr-1" /> {music.artist}
            </span>
            <div className="flex gap-2">
              {music.genre.map((genre: string) => (
                <span key={genre} className="px-2 py-1 text-xs bg-purple-600/80 rounded-full">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 音乐详情 */}
      <section className="py-12 bg-white dark:bg-content">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 左侧信息栏 */}
            <div className="md:w-1/3">
              {/* 如果有试听链接，显示试听按钮 */}
              {music.sampleUrl && (
                <a 
                  href={music.sampleUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block mb-6 relative group"
                >
                  <div className="relative h-48 rounded-xl overflow-hidden">
                    <Image
                      src={music.cover}
                      alt={`${music.title} 试听`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="w-16 h-16 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full mb-2 group-hover:scale-110 transition-transform duration-300">
                        <FaHeadphones className="text-xl" />
                      </span>
                      <span className="text-white font-medium flex items-center">
                        <FaMusic className="text-2xl mr-2" /> 立即试听
                      </span>
                    </div>
                  </div>
                </a>
              )}

              <div className="bg-gray-50 dark:bg-card rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">音乐信息</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">艺术家</p>
                    <p className="text-gray-900 dark:text-white">{music.artist}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">发行年份</p>
                    <p className="text-gray-900 dark:text-white">{music.year}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">时长</p>
                    <p className="text-gray-900 dark:text-white">{music.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">类型</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {music.genre.map((genre: string) => (
                        <span key={genre} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {music.instruments && (
                <div className="bg-gray-50 dark:bg-card rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">乐器配置</h3>
                  <ul className="space-y-2">
                    {music.instruments.map((instrument: string, index: number) => (
                      <li key={index} className="text-gray-800 dark:text-gray-200 flex items-center">
                        <FaCompactDisc className="mr-2 text-purple-600 dark:text-purple-400" /> {instrument}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 右侧内容区 */}
            <div className="md:w-2/3">
              <div className="bg-white dark:bg-content rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">作品介绍</h2>
                <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
                  {music.fullDescription ? (
                    music.fullDescription.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))
                  ) : (
                    <p>{music.description}</p>
                  )}
                </div>
              </div>

              {/* 音乐品评 */}
              <div className="bg-white dark:bg-content rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">音乐品评</h2>
                <div className="flex flex-col gap-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    本作品是{music.artist}于{music.year}年创作的{music.genre.join('、')}风格的音乐作品，
                    以{music.description.replace(/。$/, '')}为主题，通过{music.instruments ? music.instruments.join('、') : '多种乐器'}
                    的配合，展现了独特的音乐风格和艺术魅力。
                  </p>
                  
                  <div className="bg-gray-50 dark:bg-card/50 p-4 rounded-lg border-l-4 border-purple-500 mt-2">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">编辑推荐理由</h4>
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      "《{music.title}》是{music.artist}创作生涯中的代表作，在保持其一贯音乐风格的同时，
                      也展现了音乐创作的新尝试。这首作品无论是在旋律编排、情感表达还是技术呈现上，
                      都达到了相当高的水准，值得反复聆听。"
                    </p>
                  </div>
                  
                  <button className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    写评论
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 相关音乐推荐 */}
      {relatedMusic.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-card">
          <div className="container-custom">
            <h2 className="section-title text-center mb-8">相关推荐</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedMusic.map(relatedItem => (
                <Link key={relatedItem.id} href={`/music/${relatedItem.id}`}>
                  <motion.div 
                    className="bg-white dark:bg-content rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={relatedItem.cover}
                        alt={relatedItem.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="absolute bottom-0 left-0 p-4 w-full">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-white">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>{relatedItem.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-800/60 rounded text-white">
                            {relatedItem.year}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{relatedItem.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{relatedItem.artist}</p>
                      <div className="flex flex-wrap gap-1">
                        {relatedItem.genre.slice(0, 2).map((g: string) => (
                          <span key={g} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 