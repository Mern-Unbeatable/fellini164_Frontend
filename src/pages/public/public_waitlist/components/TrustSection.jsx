import { Shield, CheckCircle2, Lock, Eye, Award } from 'lucide-react';

const TrustSection = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-10 text-center relative z-10">
            <div className="relative bg-[#4C1D95] rounded-3xl p-12 md:p-16  overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    {/* Icon */}
                    <div className="inline-flex bg-white/20 backdrop-blur-md w-20 h-20 rounded-2xl items-center justify-center mx-auto mb-8 shadow-xl border border-white/30 hover:scale-110 transition-transform duration-300">
                        <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>

                    {/* Heading */}
                    <h3 className="text-3xl md:text-4xl text-white font-bold mb-4">
                        Your Data, Your Privacy
                    </h3>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-3xl mx-auto mb-10">
                        Built with privacy, security, and long-term consistency in mind.
                        Your trust is our foundation.
                    </p>

                   
                </div>
            </div>
        </div>
    );
};

export default TrustSection;
