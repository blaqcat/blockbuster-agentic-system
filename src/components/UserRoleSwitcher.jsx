import React, { useState } from 'react';
import { 
  ShieldCheck, Film, Sparkles, Eye, UserCheck, ChevronDown, Check,
  Sliders, Info, Zap, AlertCircle
} from 'lucide-react';
import { USER_ROLES } from '../services/userRoles';

export default function UserRoleSwitcher({ 
  currentRoleKey, 
  onSelectRole, 
  onOpenRoleMatrix 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentRole = USER_ROLES[currentRoleKey] || USER_ROLES.EXECUTIVE_DIRECTOR;

  const getRoleIcon = (roleId) => {
    switch(roleId) {
      case 'EXECUTIVE_DIRECTOR':
        return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
      case 'LEAD_EDITOR':
        return <Film className="w-4 h-4 text-amber-400" />;
      case 'CRAFT_SUPERVISOR':
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'CLIENT_REVIEWER':
        return <Eye className="w-4 h-4 text-sky-400" />;
      default:
        return <UserCheck className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative z-30">
      <div className="flex items-center space-x-2 bg-[#0B0D13] border border-[#1E2333] hover:border-[#2C344B] p-1.5 rounded-xl transition">
        {/* Quick Click Dropdown Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2.5 px-2.5 py-1 rounded-lg hover:bg-[#161B29] transition text-left"
        >
          <img 
            src={currentRole.defaultUser.avatar} 
            alt={currentRole.defaultUser.name}
            className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30 shrink-0" 
          />
          <div className="leading-tight">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border bg-[#141824] text-white">
                Level {currentRole.level}
              </span>
              <span className="text-xs font-bold text-gray-200">
                {currentRole.shortTitle}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono block truncate max-w-[140px]">
              {currentRole.defaultUser.name.split(' ')[0]} &bull; {currentRole.department}
            </span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Quick Info Matrix Button */}
        <button
          onClick={onOpenRoleMatrix}
          title="Compare 4 User Levels & Permissions"
          className="p-1.5 rounded-lg bg-[#141721] hover:bg-[#1E2333] text-gray-400 hover:text-indigo-400 border border-[#1E2333] transition"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Role Picker Dropdown Modal */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-[#11141E] border border-[#222B40] rounded-2xl shadow-2xl p-3 z-30 space-y-2 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-2 py-1.5 border-b border-[#1E2436] flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-300 uppercase">
                Select Interactive User Level
              </span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                4 Active Tiers
              </span>
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto">
              {Object.values(USER_ROLES).map((role) => {
                const isSelected = role.id === currentRoleKey;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      onSelectRole(role.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-start space-x-3 border ${
                      isSelected 
                        ? 'bg-[#181E30] border-indigo-500/50 shadow-md shadow-indigo-900/20' 
                        : 'bg-[#0B0D13]/60 border-[#1E2436] hover:bg-[#141824] hover:border-[#2C344B]'
                    }`}
                  >
                    <img 
                      src={role.defaultUser.avatar} 
                      alt={role.defaultUser.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-white/10" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${role.badgeColor}`}>
                            L{role.level}
                          </span>
                          <span className="text-xs font-bold text-white truncate">
                            {role.title}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                      </div>

                      <p className="text-[11px] text-gray-400 font-mono truncate mt-0.5">
                        {role.defaultUser.name} &bull; {role.defaultUser.organization}
                      </p>

                      <p className="text-[10px] text-gray-300 line-clamp-2 mt-1 leading-snug">
                        {role.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#1E2436]">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenRoleMatrix();
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-[#161B29] hover:bg-[#1E2436] text-[11px] font-semibold text-indigo-300 flex items-center justify-center space-x-2 transition border border-[#222B40]"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>View Full Permissions &amp; Capabilities Matrix</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
