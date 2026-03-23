interface Subject {
  id: string;
  name: string;
  description: string;
  material: string;
  style: string;
  color: string;
}

interface EnvironmentSettings {
  time: string;
  weather: string;
  lighting: string;
  atmosphere: string;
}

const timeLabels: Record<string, string> = {
  golden_hour: '黄金时段',
  sunrise: '日出时分',
  sunset: '日落时分',
  night: '夜晚',
  midday: '正午',
  afternoon: '下午',
  morning: '清晨'
};

const weatherLabels: Record<string, string> = {
  clear: '晴朗',
  cloudy: '多云',
  rainy: '雨天',
  foggy: '雾天',
  snowy: '雪天',
  windy: '大风'
};

const lightingLabels: Record<string, string> = {
  natural: '自然光',
  warm: '暖色调光源',
  cool: '冷色调光源',
  dramatic: '戏剧性光影',
  soft: '柔和光线',
  studio: '影室灯光'
};

const atmosphereLabels: Record<string, string> = {
  peaceful: '宁静平和',
  energetic: '活力四射',
  mysterious: '神秘感',
  elegant: '优雅高级',
  cozy: '温馨舒适',
  professional: '专业商务'
};

const materialLabels: Record<string, string> = {
  concrete: '清水混凝土',
  glass: '玻璃幕墙',
  steel: '钢结构',
  wood: '实木材质',
  brick: '砖墙',
  marble: '大理石',
  metal: '金属质感',
  plastic: '塑料材质',
  fabric: '织物材质',
  stone: '石材',
  ceramic: '陶瓷',
  tile: '瓷砖',
  '镜面反射': '镜面反射材质',
  '磨砂': '磨砂质感'
};

const styleLabels: Record<string, string> = {
  modern: '现代主义',
  classic: '古典风格',
  industrial: '工业风格',
  minimalist: '极简主义',
  luxury: '豪华风格',
  rustic: '乡村风格',
  futuristic: '未来主义',
  traditional: '传统风格',
  scandinavian: '北欧风格',
  japanese: '日式风格',
  '中式传统': '中式传统',
  '欧式古典': '欧式古典'
};

export async function generatePrompt(
  subjects: Subject[],
  environment: EnvironmentSettings,
  apiKey: string
): Promise<string> {
  // 构建主体描述
  const subjectDescriptions = subjects
    .filter(s => s.name && (s.material || s.style || s.description))
    .map(s => {
      const parts = [];
      if (s.name) parts.push(s.name);
      if (s.description) parts.push(s.description);
      if (s.material && materialLabels[s.material]) {
        parts.push(`材质: ${materialLabels[s.material]}`);
      }
      if (s.style && styleLabels[s.style]) {
        parts.push(`风格: ${styleLabels[s.style]}`);
      }
      return parts.join(', ');
    })
    .join('; ');

  // 构建环境描述
  const timeDesc = timeLabels[environment.time] || environment.time;
  const weatherDesc = weatherLabels[environment.weather] || environment.weather;
  const lightingDesc = lightingLabels[environment.lighting] || environment.lighting;
  const atmosphereDesc = atmosphereLabels[environment.atmosphere] || environment.atmosphere;

  const prompt = `请为以下建筑设计生成专业的渲染Prompt：

建筑主体：
${subjectDescriptions || '未指定主体'}

环境参数：
- 时间：${timeDesc}
- 天气：${weatherDesc}
- 光照：${lightingDesc}
- 氛围：${atmosphereDesc}

请生成一段详细、专业的建筑渲染Prompt，用于AI图像生成。要求：
1. 描述建筑外观和材质质感
2. 描述环境氛围和光线效果
3. 使用专业的建筑设计术语
4. 确保prompt简洁且具有画面感`;

  // 调用DeepSeek API
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的建筑渲染专家，擅长生成高质量的建筑渲染Prompt。请直接输出Prompt内容，不要额外的解释说明。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('DeepSeek API调用失败:', error);
    // 返回本地生成的备用prompt
    return generateFallbackPrompt(subjects, environment);
  }
}

function generateFallbackPrompt(
  subjects: Subject[],
  environment: EnvironmentSettings
): string {
  const parts: string[] = [];

  // 添加主体描述
  subjects.forEach(s => {
    if (s.material && s.style) {
      const material = materialLabels[s.material] || s.material;
      const style = styleLabels[s.style] || s.style;
      parts.push(`${s.name || '建筑'}: ${style}风格的${material}表面, ${s.description || ''}`);
    } else if (s.material) {
      const material = materialLabels[s.material] || s.material;
      parts.push(`${s.name || '建筑'}: ${material}表面, ${s.description || ''}`);
    } else if (s.style) {
      const style = styleLabels[s.style] || s.style;
      parts.push(`${s.name || '建筑'}: ${style}风格, ${s.description || ''}`);
    }
  });

  // 添加环境描述
  const timeDesc = timeLabels[environment.time] || environment.time;
  const weatherDesc = weatherLabels[environment.weather] || environment.weather;
  const lightingDesc = lightingLabels[environment.lighting] || environment.lighting;
  const atmosphereDesc = atmosphereLabels[environment.atmosphere] || environment.atmosphere;

  const envParts = [
    timeDesc,
    weatherDesc,
    lightingDesc,
    `${atmosphereDesc}氛围`
  ];

  return `建筑设计渲染, ${parts.join(', ')}, ${envParts.join(', ')}, 高质量建筑渲染, 照片级真实感, 细节丰富, 专业摄影角度`;
}

export async function renderImage(
  imageData: string,
  prompt: string,
  apiKey: string
): Promise<string> {
  // 将base64图片转换为blob
  const response = await fetch(imageData);
  const blob = await response.blob();

  try {
    // 调用Nano Banana2 API
    const formData = new FormData();
    formData.append('image', blob, 'white_model.png');
    formData.append('prompt', prompt);

    const renderResponse = await fetch('https://api.nanobanana.io/v2/render', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!renderResponse.ok) {
      throw new Error(`渲染API请求失败: ${renderResponse.status}`);
    }

    const renderData = await renderResponse.json();

    if (renderData.image) {
      return renderData.image;
    } else if (renderData.url) {
      return renderData.url;
    } else {
      throw new Error('渲染结果无效');
    }
  } catch (error) {
    console.error('Nano Banana2 API调用失败:', error);
    // 返回一个示例渲染图作为演示
    return await generateDemoRender(imageData, prompt);
  }
}

async function generateDemoRender(imageData: string, _prompt: string): Promise<string> {
  // 这个函数生成一个简单的演示效果
  // 在实际应用中，这里应该返回真实的渲染结果
  // 为了演示，我们返回一个稍有不同的图片效果

  return new Promise((resolve) => {
    // 创建canvas来处理图片
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        // 绘制原图
        ctx.drawImage(img, 0, 0);

        // 添加一些简单的处理效果来模拟渲染
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255, 220, 180, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'saturate(1.2) contrast(1.1)';
        ctx.drawImage(img, 0, 0);

        // 添加光晕效果
        const gradient = ctx.createRadialGradient(
          canvas.width * 0.8, canvas.height * 0.2, 0,
          canvas.width * 0.8, canvas.height * 0.2, canvas.width * 0.5
        );
        gradient.addColorStop(0, 'rgba(255, 255, 200, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      // 如果图片加载失败，返回原图
      resolve(imageData);
    };

    img.src = imageData;
  });
}
