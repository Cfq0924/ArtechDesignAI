import { useState, useCallback } from 'react';
import { Upload, RefreshCw, Sparkles, Download, Trash2, ZoomIn, ZoomOut, Plus, Sun, Cloud, Lightbulb, Sparkle, Clock, CloudRain, SunMedium } from 'lucide-react';
import { ImageCompare } from './components/ImageCompare';
import { generatePrompt, renderImage } from './services/api';

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

const defaultEnvironment: EnvironmentSettings = {
  time: 'golden_hour',
  weather: 'clear',
  lighting: 'natural',
  atmosphere: 'peaceful'
};

const materialOptions = [
  'concrete', 'glass', 'steel', 'wood', 'brick', 'marble', 'metal',
  'plastic', 'fabric', 'stone', 'ceramic', 'tile', '镜面反射', '磨砂'
];

const styleOptions = [
  'modern', 'classic', 'industrial', 'minimalist', 'luxury', 'rustic',
  'futuristic', 'traditional', 'scandinavian', 'japanese', '中式传统', '欧式古典'
];

function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [environment, setEnvironment] = useState<EnvironmentSettings>(defaultEnvironment);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [fileName, setFileName] = useState<string>('');
  const [fileResolution, setFileResolution] = useState<string>('');

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setFileName(file.name);

      const img = new Image();
      img.onload = () => {
        setFileResolution(`${img.width}*${img.height}`);
        setIsRecognizing(true);

        setTimeout(() => {
          const mockSubjects: Subject[] = [
            { id: '1', name: '主建筑', description: '左侧高层建筑', material: 'glass', style: 'modern', color: '#4A90D9' },
            { id: '2', name: '副建筑', description: '右侧低层建筑', material: 'concrete', style: 'minimalist', color: '#D94A6B' },
            { id: '3', name: '地面', description: '道路和人行道', material: 'stone', style: 'traditional', color: '#6BD94A' },
            { id: '4', name: '天空', description: '背景天空', material: '', style: '', color: '#9A6BD9' },
          ];
          setSubjects(mockSubjects);
          setIsRecognizing(false);
        }, 2000);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const updateSubject = useCallback((id: string, field: keyof Subject, value: string) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }, []);

  const addSubject = useCallback(() => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: '新主体',
      description: '',
      material: 'concrete',
      style: 'modern',
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    setSubjects(prev => [...prev, newSubject]);
  }, []);

  const removeSubject = useCallback((id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleGeneratePrompt = useCallback(async () => {
    setIsLoading(true);
    try {
      const prompt = await generatePrompt(subjects, environment);
      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error('生成Prompt失败:', error);
      alert('生成Prompt失败，请检查API配置');
    }
    setIsLoading(false);
  }, [subjects, environment]);

  const handleRender = useCallback(async () => {
    if (!uploadedImage || !generatedPrompt) {
      alert('请先上传图片并生成Prompt');
      return;
    }

    setIsLoading(true);
    try {
      const result = await renderImage(uploadedImage, generatedPrompt);
      setRenderedImage(result);
    } catch (error) {
      console.error('渲染失败:', error);
      alert('渲染失败，请检查API配置');
    }
    setIsLoading(false);
  }, [uploadedImage, generatedPrompt]);

  const handleSaveRenderedImage = useCallback(() => {
    if (!renderedImage) return;

    const link = document.createElement('a');
    link.href = renderedImage;
    link.download = `rendered_${fileName || 'output'}.png`;
    link.click();
  }, [renderedImage, fileName]);

  const handleReset = useCallback(() => {
    setSubjects([]);
    setEnvironment(defaultEnvironment);
    setGeneratedPrompt('');
    setRenderedImage(null);
  }, []);

  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'golden_hour': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'night': return <Sparkle className="w-4 h-4 text-blue-500" />;
      case 'sunrise': return <SunMedium className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'clear': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-4 h-4 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-4 h-4 text-blue-500" />;
      default: return <Cloud className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">白模图转渲染工具</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Image Area */}
        <div className="flex-1 p-6 overflow-hidden">
          <div
            className="h-full bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-col"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {!uploadedImage ? (
              <label className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors rounded-xl">
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-2">拖放 / 点击上传白模图</p>
                <p className="text-sm text-gray-400">支持 PNG / JPG / WEBP 格式</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            ) : (
              <>
                <div className="flex-1 overflow-hidden relative rounded-t-xl">
                  {renderedImage ? (
                    <ImageCompare
                      before={uploadedImage}
                      after={renderedImage}
                      zoom={zoom}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ transform: `scale(${zoom})` }}
                    >
                      <img
                        src={uploadedImage}
                        alt="白模图"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}

                  {isRecognizing && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-t-xl">
                      <div className="bg-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                        <span className="text-gray-700">AI正在识别建筑主体...</span>
                      </div>
                    </div>
                  )}

                  {isLoading && !isRecognizing && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-t-xl">
                      <div className="bg-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                        <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                        <span className="text-gray-700">正在处理...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Toolbar */}
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50 rounded-b-xl">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{fileName}</span>
                    {fileResolution && (
                      <span className="text-sm text-gray-400">({fileResolution})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="缩小"
                    >
                      <ZoomOut className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="text-sm text-gray-600 min-w-[50px] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="放大"
                    >
                      <ZoomIn className="w-4 h-4 text-gray-600" />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    <button
                      onClick={handleReset}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Configuration */}
        <div className="w-[420px] border-l border-gray-200 bg-white overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Subject List */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">主体识别</h2>

              {subjects.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="mb-2">暂无识别主体</p>
                  <p className="text-sm">请上传白模图进行识别</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          <span className="font-medium text-gray-800">{subject.name}</span>
                        </div>
                        <button
                          onClick={() => removeSubject(subject.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">主体描述</label>
                          <input
                            type="text"
                            value={subject.description}
                            onChange={(e) => updateSubject(subject.id, 'description', e.target.value)}
                            placeholder="描述该主体"
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">材质</label>
                          <select
                            value={subject.material}
                            onChange={(e) => updateSubject(subject.id, 'material', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          >
                            <option value="">选择材质</option>
                            {materialOptions.map((mat) => (
                              <option key={mat} value={mat}>{mat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">风格</label>
                          <select
                            value={subject.style}
                            onChange={(e) => updateSubject(subject.id, 'style', e.target.value)}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          >
                            <option value="">选择风格</option>
                            {styleOptions.map((style) => (
                              <option key={style} value={style}>{style}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={addSubject}
                className="w-full mt-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                添加主体
              </button>
            </section>

            {/* Environment Settings */}
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">全局环境参数</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">时间</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEnvironment(prev => ({ ...prev, time: 'golden_hour' }))}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        environment.time === 'golden_hour'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {getTimeIcon('golden_hour')}
                      黄金时段
                    </button>
                    <button
                      onClick={() => setEnvironment(prev => ({ ...prev, time: 'sunrise' }))}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        environment.time === 'sunrise'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {getTimeIcon('sunrise')}
                      日出
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setEnvironment(prev => ({ ...prev, time: 'night' }))}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        environment.time === 'night'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {getTimeIcon('night')}
                      夜晚
                    </button>
                    <button
                      onClick={() => setEnvironment(prev => ({ ...prev, time: 'midday' }))}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        environment.time === 'midday'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {getTimeIcon('midday')}
                      正午
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">天气</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEnvironment(prev => ({ ...prev, weather: 'clear' }))}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        environment.weather === 'clear'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {getWeatherIcon('clear')}
                      晴天
                    </button>
                    <button
                      onClick={() => setEnvironment(prev => ({ ...prev, weather: 'cloudy' }))}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        environment.weather === 'cloudy'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {getWeatherIcon('cloudy')}
                      多云
                    </button>
                    <button
                      onClick={() => setEnvironment(prev => ({ ...prev, weather: 'rainy' }))}
                      className={`flex-1 py-2 px-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                        environment.weather === 'rainy'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {getWeatherIcon('rainy')}
                      雨天
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">光照</label>
                  <select
                    value={environment.lighting}
                    onChange={(e) => setEnvironment(prev => ({ ...prev, lighting: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="natural">自然光</option>
                    <option value="warm">暖色调</option>
                    <option value="cool">冷色调</option>
                    <option value="dramatic">戏剧性光影</option>
                    <option value="soft">柔和光线</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">氛围</label>
                  <select
                    value={environment.atmosphere}
                    onChange={(e) => setEnvironment(prev => ({ ...prev, atmosphere: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="peaceful">宁静平和</option>
                    <option value="energetic">活力四射</option>
                    <option value="mysterious">神秘感</option>
                    <option value="elegant">优雅高级</option>
                    <option value="cozy">温馨舒适</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Generated Prompt */}
            {generatedPrompt && (
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">生成的Prompt</h2>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <textarea
                    value={generatedPrompt}
                    onChange={(e) => setGeneratedPrompt(e.target.value)}
                    className="w-full h-32 bg-transparent text-sm text-gray-700 whitespace-pre-wrap leading-relaxed outline-none resize-none"
                  />
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                  className="w-full mt-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  复制Prompt
                </button>
                <button
                  onClick={() => setGeneratedPrompt('')}
                  className="w-full mt-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  清空
                </button>
              </section>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleGeneratePrompt}
                disabled={subjects.length === 0 || isLoading}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                生成 Prompt
              </button>

              <button
                onClick={handleRender}
                disabled={!uploadedImage || !generatedPrompt || isLoading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                <Lightbulb className="w-5 h-5" />
                开始渲染
              </button>

              {renderedImage && (
                <button
                  onClick={handleSaveRenderedImage}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  保存渲染结果
                </button>
              )}

              <button
                onClick={handleReset}
                className="w-full py-3 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-600 font-medium transition-colors"
              >
                重置修改
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
