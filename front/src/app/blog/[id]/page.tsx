'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FaHeart, FaBookmark, FaShare, FaComment, FaTag, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';

// 模拟博客数据
const blogPosts = [
  {
    id: '1',
    title: '深度探索 DeepSeek 大语言模型的技术创新与应用前景',
    author: '张岩',
    date: '2024-05-28',
    cover: '/images/blog/deepseek-cover.jpg',
    summary: 'DeepSeek 大语言模型在技术架构和应用场景上的创新点分析，以及其在未来AI领域的潜力展望。',
    tags: ['人工智能', '深度学习', 'DeepSeek'],
    content: `<h2>引言：DeepSeek模型的技术背景</h2>
<p>在当前大语言模型百花齐放的时代，DeepSeek作为新晋的开源模型，凭借其独特的技术路线和优异的性能，正在吸引越来越多研究者和开发者的关注。本文将深入剖析DeepSeek模型的技术创新点、架构设计以及其在各领域的应用潜力。</p>

<h2>DeepSeek的核心技术架构</h2>
<p>DeepSeek采用了基于Transformer的架构，但在多个关键方面进行了创新优化：</p>
<ul>
  <li>改进的注意力机制，提高了长文本理解能力</li>
  <li>优化的位置编码方案，增强了模型对上下文的感知</li>
  <li>创新的预训练策略，平衡了通用能力与专业领域知识</li>
</ul>

<h2>与主流大语言模型的比较</h2>
<p>相比GPT系列、LLaMA等主流模型，DeepSeek在以下方面展现出独特优势：</p>
<table>
  <thead>
    <tr>
      <th>模型</th>
      <th>参数规模</th>
      <th>训练数据</th>
      <th>推理效率</th>
      <th>开源程度</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>DeepSeek</td>
      <td>7B/67B</td>
      <td>多语言、代码、科学文献</td>
      <td>高</td>
      <td>完全开源</td>
    </tr>
    <tr>
      <td>GPT-4</td>
      <td>未公开</td>
      <td>未公开</td>
      <td>中</td>
      <td>闭源</td>
    </tr>
    <tr>
      <td>LLaMA 2</td>
      <td>7B/13B/70B</td>
      <td>互联网、书籍</td>
      <td>中高</td>
      <td>部分开源</td>
    </tr>
  </tbody>
</table>

<h2>DeepSeek在编程与软件开发中的应用</h2>
<p>DeepSeek模型在代码生成、理解与修复方面表现出色，这主要得益于：</p>
<ol>
  <li>大规模代码数据集的训练，覆盖多种编程语言</li>
  <li>对编程语法与逻辑的深入理解</li>
  <li>上下文学习能力强，能够根据需求生成符合项目风格的代码</li>
</ol>

<p>以下是DeepSeek在实际编程任务中的示例应用：</p>
<pre><code>// 使用DeepSeek辅助生成React组件示例
const BlogCard = ({ title, summary, date, author, tags }) => {
  return (
    &lt;div className="border rounded-lg p-4 hover:shadow-lg transition-shadow"&gt;
      &lt;h3 className="text-xl font-bold mb-2"&gt;{title}&lt;/h3&gt;
      &lt;p className="text-gray-600 mb-4"&gt;{summary}&lt;/p&gt;
      &lt;div className="flex justify-between items-center"&gt;
        &lt;span className="text-sm text-gray-500"&gt;{date} · {author}&lt;/span&gt;
        &lt;div className="flex gap-2"&gt;
          {tags.map(tag => (
            &lt;span key={tag} className="bg-gray-100 text-xs px-2 py-1 rounded"&gt;{tag}&lt;/span&gt;
          ))}
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};
</code></pre>

<h2>在自然语言处理中的优势</h2>
<p>DeepSeek在多语言处理、文本生成和语义理解方面展现出强大能力，特别是在中文内容的处理上有着独特优势。模型能够生成连贯、逻辑清晰且富有创意的文本，同时保持对事实的准确把握。</p>

<h2>DeepSeek的未来发展方向</h2>
<p>随着技术的不断迭代，DeepSeek未来可能在以下方向持续发力：</p>
<ul>
  <li>更深入的多模态融合，实现文本、图像、音频等多种数据类型的统一理解</li>
  <li>更高效的推理优化，降低部署与应用门槛</li>
  <li>更专业的垂直领域适配，如医疗、法律、金融等专业领域知识的深度集成</li>
</ul>

<h2>结论</h2>
<p>DeepSeek作为一个充满潜力的开源大语言模型，正在通过其独特的技术优势和开放的生态策略，为AI领域带来新的可能性。无论是对研究人员还是实际应用开发者，DeepSeek都提供了一个值得深入探索的平台。随着技术的不断演进和社区的持续贡献，我们有理由期待DeepSeek在未来能够发挥更加重要的作用。</p>`,
    comments: [
      {
        id: 'c1',
        user: '李明',
        date: '2024-05-29',
        content: 'DeepSeek的代码生成能力确实很强，我最近在项目中就用它帮我重构了一些复杂的函数，效果不错！'
      },
      {
        id: 'c2',
        user: '王芳',
        date: '2024-05-30',
        content: '文章分析得很到位，特别是与其他模型的对比部分很有参考价值。希望作者能继续分享DeepSeek在特定领域应用的案例研究。'
      }
    ],
    relatedPostsIds: ['2', '3', '5']
  },
  {
    id: '2',
    title: '如何利用React和Next.js构建现代化Web应用',
    author: '李浩',
    date: '2024-05-25',
    cover: '/images/blog/react-nextjs.jpg',
    summary: '深入探讨React与Next.js的最佳实践，包括性能优化、状态管理和服务器组件的应用。',
    tags: ['前端开发', 'React', 'Next.js'],
    content: '文章内容...',
    comments: [],
    relatedPostsIds: ['1', '4']
  },
  {
    id: '3',
    title: '人工智能在医疗领域的伦理思考',
    author: '赵燕',
    date: '2024-05-20',
    cover: '/images/blog/ai-medical.jpg',
    summary: '当AI深入医疗决策过程，我们需要正视哪些伦理问题？本文从多个角度探讨AI医疗的边界与责任。',
    tags: ['人工智能', '医疗科技', '伦理学'],
    content: '文章内容...',
    comments: [],
    relatedPostsIds: ['1', '5']
  },
  {
    id: '4',
    title: 'TypeScript高级类型系统详解',
    author: '孙伟',
    date: '2024-05-18',
    cover: '/images/blog/typescript.jpg',
    summary: '深入TypeScript的类型系统，掌握条件类型、映射类型和类型推断等高级特性，提升代码的健壮性。',
    tags: ['前端开发', 'TypeScript', '编程语言'],
    content: '文章内容...',
    comments: [],
    relatedPostsIds: ['2']
  },
  {
    id: '5',
    title: '大模型时代的隐私保护技术',
    author: '张岩',
    date: '2024-05-15',
    cover: '/images/blog/privacy-llm.jpg',
    summary: '探讨在大语言模型广泛应用的背景下，如何通过技术手段保护用户数据隐私，包括联邦学习和差分隐私等方法。',
    tags: ['人工智能', '数据隐私', '信息安全'],
    content: '文章内容...',
    comments: [],
    relatedPostsIds: ['1', '3']
  }
];

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [comment, setComment] = useState('');
  
  // 模拟获取博客文章数据
  useEffect(() => {
    const fetchPost = async () => {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const postId = Array.isArray(params.id) ? params.id[0] : params.id;
      const foundPost = blogPosts.find(p => p.id === postId);
      
      if (foundPost) {
        setPost(foundPost);
        
        // 获取相关文章
        if (foundPost.relatedPostsIds) {
          const related = blogPosts.filter(p => 
            foundPost.relatedPostsIds.includes(p.id) && p.id !== foundPost.id
          );
          setRelatedPosts(related);
        }
      }
      
      setLoading(false);
    };
    
    fetchPost();
  }, [params.id]);
  
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };
  
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // 这里应该有保存评论的逻辑
    // 模拟添加评论
    const newComment = {
      id: `c${Date.now()}`,
      user: '游客',
      date: new Date().toISOString().split('T')[0],
      content: comment
    };
    
    setPost({
      ...post,
      comments: [...post.comments, newComment]
    });
    
    setComment('');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container-custom min-h-screen py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">文章未找到</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">抱歉，您请求的博客文章不存在或已被删除。</p>
          <Link href="/blog" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline">
            <FaArrowLeft className="mr-2" /> 返回博客列表
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* 博客文章头部 */}
      <div className="relative">
        <div className="w-full h-80 relative">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="brightness-[0.6]"
          />
        </div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom text-white">
            <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
              <FaArrowLeft className="mr-2" /> 返回博客列表
            </Link>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string) => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
            
            <div className="flex items-center text-white/80">
              <span>{post.author}</span>
              <span className="mx-2">•</span>
              <span>{post.date}</span>
            </div>
            
            <p className="mt-4 text-lg text-white/90 max-w-2xl backdrop-blur-sm bg-black/10 p-4 rounded-lg">
              {post.summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 