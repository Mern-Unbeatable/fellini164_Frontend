import { ArrowRight, Sparkles } from 'lucide-react';

const EarlyAccessHero = ({ onJoinClick }) => {
    return (
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10 py-2 md:py-6">
            <div className="mb-12 space-y-6">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm text-violet-600 rounded-full text-sm font-semibold mb-4 shadow-lg border border-violet-200">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-600"></span>
                    </span>
                    Limited Early Access
                </div>
                <h1 className="text-2xl md:text-5xl  font-bold text-gray-900 mb-6 leading-tight">
                    Get Early Access to{' '}
                    <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Elyxa
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    An adaptive AI that builds daily, weekly, and monthly plans around{' '}
                    <span className="font-semibold text-violet-600">how you actually live.</span>
                </p>
            </div>

            {/* Call to Action Button */}
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={onJoinClick}
                    className="group relative px-10 py-5 bg-gradient-to-r from-violet-600 via-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-[1.05] transition-all duration-300 flex items-center gap-3"
                >
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Join the Waitlist
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
               
            </div>
        </div>
    );
};

export default EarlyAccessHero;
