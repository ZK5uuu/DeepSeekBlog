import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// 这是一个示例的API处理函数，您需要替换为实际的API密钥和端点
export async function POST(req: NextRequest) {
  try {
    const { content, title, model } = await req.json();

    // 验证输入
    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: '未提供内容' },
        { status: 400 }
      );
    }

    // 构建提示词
    const prompt = `请对以下标题为"${title}"的内容进行总结：\n\n${content}\n\n请提供一个简洁、全面的总结，包括主要观点和关键信息。`;

    // 实际项目中，这里应该调用DeepSeek API
    // 以下是模拟响应
    let summary;
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 在实际项目中，您会使用类似下面的代码调用DeepSeek API
    /*
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "你是一个专业的内容摘要助手，善于提取文本的核心内容和要点。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    summary = response.data.choices[0].message.content;
    */

    // 生成模拟响应
    summary = `《${title}》内容摘要：\n\n这篇内容主要探讨了${title}相关的核心观点。作者从多个角度分析了主题的重要性，并提供了具体的例子和见解。\n\n关键要点包括：\n1. 主题的背景和意义\n2. 核心论点和支持证据\n3. 实际应用案例\n4. 未来发展趋势\n\n总的来说，这是一篇内容丰富、见解深刻的作品，为读者提供了关于${title}的全面理解。`;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('AI摘要生成错误:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
} 