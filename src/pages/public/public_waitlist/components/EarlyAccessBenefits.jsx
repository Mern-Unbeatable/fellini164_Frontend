import { CheckCircle2, Shield, Users, Zap, Gift, Mail } from 'lucide-react';

const EarlyAccessBenefits = () => {
    const benefits = [
        {
            icon: Zap,
            title: "Adaptive Daily Planning",
            description: "Plans that adjust based on your energy, priorities, and real-time changes.",
            gradientFrom: "from-purple-500",
            gradientTo: "to-violet-600",
            borderColor: "border-purple-100",
            hoverBorderColor: "hover:border-purple-300"
        },
        {
            icon: CheckCircle2,
            title: "Weekly & Monthly Goals",
            description: "Break down big goals into achievable steps that fit your life.",
            gradientFrom: "from-green-500",
            gradientTo: "to-emerald-600",
            borderColor: "border-green-100",
            hoverBorderColor: "hover:border-green-300"
        },
        {
            icon: Users,
            title: "AI Habit Tracking",
            description: "Intelligent tracking that learns from your patterns and suggests improvements.",
            gradientFrom: "from-blue-500",
            gradientTo: "to-indigo-600",
            borderColor: "border-blue-100",
            hoverBorderColor: "hover:border-blue-300"
        },
        {
            icon: Gift,
            title: "Personalized Insights",
            description: "AI-powered insights tailored to your goals and lifestyle.",
            gradientFrom: "from-pink-500",
            gradientTo: "to-rose-600",
            borderColor: "border-pink-100",
            hoverBorderColor: "hover:border-pink-300"
        },
        {
            icon: Mail,
            title: "Early Feature Access",
            description: "Be the first to try new features before public launch.",
            gradientFrom: "from-orange-500",
            gradientTo: "to-amber-600",
            borderColor: "border-orange-100",
            hoverBorderColor: "hover:border-orange-300"
        },
        {
            icon: Shield,
            title: "Priority Support",
            description: "Direct access to our team for feedback and assistance.",
            gradientFrom: "from-violet-500",
            gradientTo: "to-purple-600",
            borderColor: "border-violet-100",
            hoverBorderColor: "hover:border-violet-300"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                What You'll Get With Early Access
            </h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                Join now and unlock exclusive features before anyone else
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                        <div
                            key={index}
                            className={`bg-white/80 backdrop-blur-sm rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 border ${benefit.borderColor} ${benefit.hoverBorderColor} hover:scale-[1.02] group`}
                        >
                            <div className={`w-14 h-14 bg-gradient-to-br ${benefit.gradientFrom} ${benefit.gradientTo} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-7 h-7 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h4>
                            <p className="text-gray-600 leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EarlyAccessBenefits;
