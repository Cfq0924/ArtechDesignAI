import { useState } from 'react';
import { X } from 'lucide-react';

interface ApiKeyModalProps {
  onClose: () => void;
  onSave: (keys: { deepseek?: string; nanoBanana?: string }) => void;
  initialKeys: { deepseek?: string; nanoBanana?: string };
}

export function ApiKeyModal({ onClose, onSave, initialKeys }: ApiKeyModalProps) {
  const [deepseekKey, setDeepseekKey] = useState(initialKeys.deepseek || '');
  const [nanoBananaKey, setNanoBananaKey] = useState(initialKeys.nanoBanana || '');

  const handleSave = () => {
    onSave({
      deepseek: deepseekKey.trim() || undefined,
      nanoBanana: nanoBananaKey.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">API 配置</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DeepSeek API Key
            </label>
            <input
              type="password"
              value={deepseekKey}
              onChange={(e) => setDeepseekKey(e.target.value)}
              placeholder="请输入 DeepSeek API Key"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              用于生成渲染Prompt
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nano Banana2 API Key
            </label>
            <input
              type="password"
              value={nanoBananaKey}
              onChange={(e) => setNanoBananaKey(e.target.value)}
              placeholder="请输入 Nano Banana2 API Key"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              用于调用图像渲染服务
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">提示</h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• API密钥将仅保存在本地浏览器中</li>
              <li>• 请确保API密钥有效且有足够的调用额度</li>
              <li>• 如未配置密钥，将使用演示模式</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700 font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition-colors"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
}
