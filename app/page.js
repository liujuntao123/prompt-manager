import Link from "next/link";

export default function Home() {
  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          <h1 className="text-7xl font-bold text-white mb-6 animate-fade-in drop-shadow-lg tracking-tight">
            ✨ PromptManager
          </h1>
          <p className="text-2xl text-gray-300 mb-16 drop-shadow-md max-w-2xl mx-auto">
            一个优雅简洁的提示词管理器
          </p>
          
          <div className="flex gap-8 justify-center">
            <Link
              href="/prompts/new"
              className="group rounded-full bg-white px-8 py-4 text-gray-900 font-medium hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <span className="flex items-center gap-2">
                创建提示词
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/prompts"
              className="rounded-full border border-white/30 backdrop-blur-sm px-8 py-4 text-white font-medium hover:bg-white/10 transform hover:scale-105 transition-all duration-200"
            >
              浏览提示词
            </Link>
          </div>
          
          <div className="mt-32 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="📝 版本控制"
              description="追踪并维护您的提示词修改历史"
            />
            <FeatureCard
              title="🗂️ 智能组织"
              description="对提示词进行标记，便于快速访问"
            />
            <FeatureCard
              title="📱 移动端支持"
              description="随时随地管理和查看您的提示词"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="group bg-white/[0.03] backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.05]">
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-100">{title}</h3>
      <p className="text-gray-400 leading-relaxed group-hover:text-gray-300">{description}</p>
    </div>
  );
}
