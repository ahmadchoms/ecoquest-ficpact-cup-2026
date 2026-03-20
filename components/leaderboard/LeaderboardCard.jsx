import { motion } from "framer-motion";
import { Coins, Crown, Medal } from "lucide-react";

const AVATARS = ["🧑‍🚀", "👩‍🌾", "🦸", "🧝‍♀️", "🧙‍♂️"];

function getRankConfig(index) {
  if (index === 0)
    return {
      bg: "bg-yellow",
      icon: <Crown size={24} className="text-black" strokeWidth={2.5} />,
    };
  if (index === 1)
    return {
      bg: "bg-white",
      icon: <Medal size={24} className="text-black" strokeWidth={2.5} />,
    };
  if (index === 2)
    return {
      bg: "bg-orange",
      icon: <Medal size={24} className="text-black" strokeWidth={2.5} />,
    };
  return { bg: "bg-pink", icon: `#${index + 1}` };
}

export default function LeaderboardCard({ user, index, isCurrentUser }) {
  const { bg, icon } = getRankConfig(index);
  const cardBg = isCurrentUser ? "bg-green" : "bg-white";

  const renderAvatar = () => {
    if (user.profileImage) {
      return (
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    return AVATARS[index % AVATARS.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${cardBg} border-3 border-black rounded-3xl p-4 shadow-hard hover:-translate-y-1 hover:shadow-hard-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-default`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 ${bg} border-3 border-black rounded-xl flex items-center justify-center font-display font-black text-2xl text-black shadow-[3px_3px_0_#0f0f0f] -rotate-6 group-hover:rotate-0 transition-transform duration-300 shrink-0`}
        >
          {icon}
        </div>
        <div className="w-14 h-14 rounded-full bg-white border-3 border-black flex items-center justify-center text-2xl shadow-inner shrink-0">
          {renderAvatar()}
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-black text-xl text-black uppercase tracking-wide truncate group-hover:translate-x-1 transition-transform">
            {user.name} {isCurrentUser && " ✨"}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="bg-white border-2 border-black px-2 py-0.5 rounded-md text-[10px] font-bold text-black uppercase">
              Level {user.level || 1}
            </span>
            <span className="bg-white border-2 border-black px-2 py-0.5 rounded-md text-[10px] font-bold text-black uppercase flex items-center gap-1">
              <Coins size={10} />
              {user.username || "User"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border-3 border-black px-4 py-2 rounded-2xl shadow-[3px_3px_0_#0f0f0f] flex items-baseline justify-center sm:justify-end gap-1.5 shrink-0 transform group-hover:rotate-2 transition-transform">
        <span className="font-display font-black text-2xl text-black">
          {(user.xp || 0).toLocaleString()}
        </span>
        <span className="text-xs font-black text-black uppercase tracking-widest">
          XP
        </span>
      </div>
    </motion.div>
  );
}
