import React from 'react';

export type CharacterId =
  | 'hoang_minh'
  | 'minh_khoa'
  | 'chu_ba'
  | 'player_detective'
  | 'detective_female'
  | 'detective_cyber'
  | 'detective_scholar';
export type CharacterExpression = 'neutral' | 'friendly' | 'thoughtful' | 'explaining' | 'encouraging';

interface CharacterAvatarProps {
  id: CharacterId;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  expression?: CharacterExpression;
  className?: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  id,
  size = 'md',
  expression = 'neutral',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    hero: 'w-44 h-44',
  };

  const renderCharacterSvg = () => {
    switch (id) {
      case 'hoang_minh':
        // Trưởng văn phòng Hoàng Minh: Mature, calm, neat dark hair, glasses, navy suit, tie
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            {/* Background circle badge */}
            <circle cx="60" cy="60" r="56" fill="#082856" stroke="#2786C5" strokeWidth="3" />
            
            {/* Body / Suit */}
            <path d="M25 116 C25 88 40 82 60 82 C80 82 95 88 95 116 Z" fill="#071E40" />
            <path d="M48 83 L60 116 L72 83 Z" fill="#F5F8FC" /> {/* White collar */}
            <path d="M57 88 L63 88 L61 112 L59 112 Z" fill="#2786C5" /> {/* Tie */}
            <path d="M36 90 L52 116 L32 116 Z" fill="#0B2E61" /> {/* Suit lapel */}
            <path d="M84 90 L68 116 L88 116 Z" fill="#0B2E61" />

            {/* Neck */}
            <rect x="52" y="70" width="16" height="15" fill="#E8B595" rx="3" />

            {/* Head */}
            <ellipse cx="60" cy="54" rx="22" ry="24" fill="#F8CBB1" />

            {/* Hair back */}
            <path d="M37 50 C37 32 45 24 60 24 C75 24 83 32 83 50 C83 56 80 50 78 44 C72 38 48 38 42 44 C40 50 37 56 37 50 Z" fill="#1C2430" />

            {/* Ears */}
            <circle cx="38" cy="55" r="4.5" fill="#F8CBB1" />
            <circle cx="82" cy="55" r="4.5" fill="#F8CBB1" />

            {/* Eyebrows */}
            <path d="M46 45 Q52 43 56 46" stroke="#1C2430" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M64 46 Q68 43 74 45" stroke="#1C2430" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Eyes */}
            <circle cx="51" cy="51" r="2.5" fill="#1C2430" />
            <circle cx="69" cy="51" r="2.5" fill="#1C2430" />
            <circle cx="52" cy="50" r="0.8" fill="#FFFFFF" />
            <circle cx="70" cy="50" r="0.8" fill="#FFFFFF" />

            {/* Glasses */}
            <rect x="44" y="46" width="14" height="11" rx="3" fill="none" stroke="#2786C5" strokeWidth="1.8" />
            <rect x="62" y="46" width="14" height="11" rx="3" fill="none" stroke="#2786C5" strokeWidth="1.8" />
            <line x1="58" y1="51" x2="62" y2="51" stroke="#2786C5" strokeWidth="1.8" />

            {/* Nose */}
            <path d="M60 54 L59 58 L62 58" stroke="#D89D7B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Mouth */}
            {expression === 'friendly' || expression === 'encouraging' ? (
              <path d="M54 64 Q60 69 66 64" stroke="#8C4A3A" strokeWidth="2" strokeLinecap="round" fill="none" />
            ) : (
              <path d="M55 64 Q60 66 65 64" stroke="#8C4A3A" strokeWidth="2" strokeLinecap="round" fill="none" />
            )}
          </svg>
        );

      case 'minh_khoa':
        // Senior Detective Minh Khoa: Friendly mentor, brown styled hair, teal-blue jacket over cream turtleneck
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <circle cx="60" cy="60" r="56" fill="#0B2E61" stroke="#3B5783" strokeWidth="3" />

            {/* Body / Cardigan & Turtleneck */}
            <path d="M26 116 C26 88 40 80 60 80 C80 80 94 88 94 116 Z" fill="#184A8E" />
            <path d="M46 80 Q60 90 74 80 L72 116 L48 116 Z" fill="#E8F0F8" /> {/* Turtleneck */}
            <path d="M38 90 L50 116 L32 116 Z" fill="#2786C5" />
            <path d="M82 90 L70 116 L88 116 Z" fill="#2786C5" />

            {/* Neck */}
            <rect x="52" y="68" width="16" height="14" fill="#EFA987" rx="3" />

            {/* Head */}
            <ellipse cx="60" cy="52" rx="21" ry="23" fill="#FCD0B7" />

            {/* Hair */}
            <path d="M38 48 C36 30 46 22 60 22 C76 22 84 30 82 48 C80 40 74 34 66 32 C56 30 46 36 38 48 Z" fill="#4A3022" />
            <path d="M42 34 Q52 26 65 30" stroke="#684530" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Ears */}
            <circle cx="39" cy="53" r="4.5" fill="#FCD0B7" />
            <circle cx="81" cy="53" r="4.5" fill="#FCD0B7" />

            {/* Eyebrows */}
            <path d="M46 44 Q51 41 55 43" stroke="#4A3022" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M65 43 Q69 41 74 44" stroke="#4A3022" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Eyes - warm and friendly */}
            <ellipse cx="50" cy="50" rx="3" ry="3" fill="#2E1B10" />
            <ellipse cx="70" cy="50" rx="3" ry="3" fill="#2E1B10" />
            <circle cx="51.5" cy="48.5" r="1.2" fill="#FFFFFF" />
            <circle cx="71.5" cy="48.5" r="1.2" fill="#FFFFFF" />

            {/* Cheeks */}
            <circle cx="45" cy="56" r="3" fill="#FFB5A7" opacity="0.6" />
            <circle cx="75" cy="56" r="3" fill="#FFB5A7" opacity="0.6" />

            {/* Nose */}
            <path d="M60 52 L59 56 L62 56" stroke="#D49377" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Mouth */}
            <path d="M53 62 Q60 68 67 62" stroke="#9E4A3B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'chu_ba':
        // Client: Chú Ba - Quản lý Căn tin (Canteen Manager)
        // Apron, friendly face, short hair, chef bandana / work collar
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <circle cx="60" cy="60" r="56" fill="#071E40" stroke="#3B5783" strokeWidth="3" />

            {/* Body with Canteen Apron */}
            <path d="M26 116 C26 90 40 82 60 82 C80 82 94 90 94 116 Z" fill="#F5F8FC" /> {/* White shirt */}
            {/* Greenish-blue Apron bib */}
            <path d="M42 88 L46 116 L74 116 L78 88 Z" fill="#2786C5" />
            {/* Apron straps */}
            <line x1="42" y1="88" x2="35" y2="105" stroke="#184A8E" strokeWidth="3" />
            <line x1="78" y1="88" x2="85" y2="105" stroke="#184A8E" strokeWidth="3" />
            {/* Little canteen badge */}
            <rect x="52" y="94" width="16" height="8" rx="2" fill="#DEEAEE" />
            <line x1="55" y1="98" x2="65" y2="98" stroke="#082856" strokeWidth="1.5" />

            {/* Neck */}
            <rect x="52" y="70" width="16" height="14" fill="#E8A882" rx="3" />

            {/* Head */}
            <ellipse cx="60" cy="54" rx="22" ry="24" fill="#F7BF9F" />

            {/* Hair */}
            <path d="M38 52 C37 34 45 25 60 25 C75 25 83 34 82 52 C78 44 72 38 60 38 C48 38 42 44 38 52 Z" fill="#3D4046" />

            {/* Ears */}
            <circle cx="38" cy="56" r="4.5" fill="#F7BF9F" />
            <circle cx="82" cy="56" r="4.5" fill="#F7BF9F" />

            {/* Eyebrows - slightly concerned but friendly */}
            <path d="M46 45 Q51 43 55 45" stroke="#3D4046" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M65 45 Q69 43 74 45" stroke="#3D4046" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Eyes */}
            <circle cx="51" cy="52" r="2.5" fill="#25282A" />
            <circle cx="69" cy="52" r="2.5" fill="#25282A" />
            <circle cx="52" cy="51" r="0.8" fill="#FFFFFF" />
            <circle cx="70" cy="51" r="0.8" fill="#FFFFFF" />

            {/* Cheeks */}
            <circle cx="45" cy="58" r="3" fill="#E08B73" opacity="0.4" />
            <circle cx="75" cy="58" r="3" fill="#E08B73" opacity="0.4" />

            {/* Nose */}
            <path d="M60 54 L58 59 L62 59" stroke="#CF8767" strokeWidth="1.8" strokeLinecap="round" fill="none" />

            {/* Mouth */}
            <path d="M54 65 Q60 68 66 65" stroke="#873E2F" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'detective_female':
        // Female Detective: Sharp ponytail, crimson scarf, deep navy coat, keen eyes
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <circle cx="60" cy="60" r="56" fill="#182A4A" stroke="#E5A93C" strokeWidth="3" />
            {/* Coat */}
            <path d="M28 116 C28 88 42 80 60 80 C78 80 92 88 92 116 Z" fill="#0E1A2D" />
            <path d="M46 80 L60 102 L74 80 Z" fill="#F8FAFC" />
            <path d="M48 88 Q60 98 72 88 L68 116 L52 116 Z" fill="#C93B2B" /> {/* Crimson Scarf */}
            {/* Neck */}
            <rect x="53" y="68" width="14" height="14" fill="#F4BAA2" rx="3" />
            {/* Head */}
            <ellipse cx="60" cy="52" rx="20" ry="22" fill="#FCD7C5" />
            {/* Ponytail Hair */}
            <path d="M34 50 C34 26 46 18 60 18 C74 18 86 26 86 50 C82 36 74 30 60 30 C46 30 38 36 34 50 Z" fill="#241B18" />
            <path d="M82 38 C94 42 98 56 94 68 C90 60 86 52 82 46 Z" fill="#241B18" /> {/* Ponytail swing */}
            {/* Ears */}
            <circle cx="40" cy="53" r="4" fill="#FCD7C5" />
            <circle cx="80" cy="53" r="4" fill="#FCD7C5" />
            {/* Pearl Earring */}
            <circle cx="40" cy="56" r="1.5" fill="#E5A93C" />
            <circle cx="80" cy="56" r="1.5" fill="#E5A93C" />
            {/* Eyes - keen & focused */}
            <path d="M46 43 Q52 40 56 42" stroke="#241B18" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M64 42 Q68 40 74 43" stroke="#241B18" strokeWidth="2" strokeLinecap="round" fill="none" />
            <ellipse cx="51" cy="49" rx="2.8" ry="2.8" fill="#1C1412" />
            <ellipse cx="69" cy="49" rx="2.8" ry="2.8" fill="#1C1412" />
            <circle cx="52" cy="48" r="0.9" fill="#FFFFFF" />
            <circle cx="70" cy="48" r="0.9" fill="#FFFFFF" />
            {/* Cheeks & Smile */}
            <circle cx="46" cy="56" r="3" fill="#FDA4AF" opacity="0.6" />
            <circle cx="74" cy="56" r="3" fill="#FDA4AF" opacity="0.6" />
            <path d="M55 62 Q60 66 65 62" stroke="#BE123C" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'detective_cyber':
        // Cyber Data Analyst: Neon teal glasses visor, futuristic tactical jacket, headset
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <circle cx="60" cy="60" r="56" fill="#0A1828" stroke="#00E5FF" strokeWidth="3" />
            {/* Cyber Tactical Jacket */}
            <path d="M26 116 C26 88 40 80 60 80 C80 80 94 88 94 116 Z" fill="#111D2D" />
            <path d="M46 80 L60 100 L74 80 Z" fill="#00E5FF" opacity="0.8" />
            <path d="M58 84 L62 84 L62 116 L58 116 Z" fill="#00E5FF" />
            {/* Neck */}
            <rect x="52" y="68" width="16" height="14" fill="#DDB19A" rx="3" />
            {/* Head */}
            <ellipse cx="60" cy="52" rx="21" ry="23" fill="#FAD1BC" />
            {/* Spiky Tech Hair */}
            <path d="M36 44 C34 26 44 18 60 18 C76 18 86 26 84 44 C80 34 72 26 60 26 C48 26 40 34 36 44 Z" fill="#1C2638" />
            {/* Cyber Visor / Neon Glasses */}
            <rect x="42" y="44" width="36" height="12" rx="4" fill="#00E5FF" fillOpacity="0.85" stroke="#FFFFFF" strokeWidth="1.2" />
            <line x1="44" y1="50" x2="76" y2="50" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 2" />
            {/* Headset Mic */}
            <path d="M38 52 C35 52 35 68 48 70" stroke="#9BA3AF" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="48" cy="70" r="2.5" fill="#00E5FF" />
            {/* Smile */}
            <path d="M55 64 Q60 67 65 64" stroke="#8A4533" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'detective_scholar':
        // Academic Data Sleuth: Tweed blazer, argyle, classic round scholarly glasses
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <circle cx="60" cy="60" r="56" fill="#2E1D14" stroke="#D4AF37" strokeWidth="3" />
            {/* Tweed Blazer */}
            <path d="M26 116 C26 88 40 80 60 80 C80 80 94 88 94 116 Z" fill="#422C1D" />
            <path d="M46 80 L60 104 L74 80 Z" fill="#E8DEC8" />
            <path d="M58 84 L62 84 L60 114 Z" fill="#8C3A27" /> {/* Brown tie */}
            {/* Neck */}
            <rect x="52" y="68" width="16" height="14" fill="#E8B598" rx="3" />
            {/* Head */}
            <ellipse cx="60" cy="52" rx="21" ry="23" fill="#F8C7AB" />
            {/* Scholarly side-part hair */}
            <path d="M38 48 C36 30 46 22 60 22 C76 22 84 30 82 48 C76 38 70 32 60 32 C50 32 42 38 38 48 Z" fill="#3E2C22" />
            {/* Round Scholar Glasses */}
            <circle cx="50" cy="50" r="7.5" fill="none" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="70" cy="50" r="7.5" fill="none" stroke="#D4AF37" strokeWidth="2" />
            <line x1="57.5" y1="50" x2="62.5" y2="50" stroke="#D4AF37" strokeWidth="2" />
            <circle cx="50" cy="50" r="2.5" fill="#1A120E" />
            <circle cx="70" cy="50" r="2.5" fill="#1A120E" />
            {/* Smile */}
            <path d="M55 64 Q60 67 65 64" stroke="#8C4A3A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'player_detective':
      default:
        // Player: Junior Data Detective (Young, energetic, detective badge & collar)
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            <circle cx="60" cy="60" r="56" fill="#082856" stroke="#2786C5" strokeWidth="3" />

            {/* Trench Coat / Detective Jacket */}
            <path d="M26 116 C26 88 40 80 60 80 C80 80 94 88 94 116 Z" fill="#0B2E61" />
            <path d="M46 80 L60 105 L74 80 Z" fill="#F5F8FC" />
            {/* Lapels */}
            <path d="M38 86 L56 116 L30 116 Z" fill="#184A8E" />
            <path d="M82 86 L64 116 L90 116 Z" fill="#184A8E" />
            {/* Golden detective badge pin */}
            <polygon points="68,98 72,106 64,106" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />

            {/* Neck */}
            <rect x="52" y="68" width="16" height="14" fill="#F0B599" rx="3" />

            {/* Head */}
            <ellipse cx="60" cy="52" rx="21" ry="23" fill="#FCD3BD" />

            {/* Hair - modern stylish cut */}
            <path d="M37 46 C36 28 46 20 60 20 C76 20 84 28 83 46 C77 36 68 32 58 32 C48 32 42 38 37 46 Z" fill="#1E293B" />
            {/* Bangs */}
            <path d="M42 36 Q52 28 62 34 Q52 38 46 42 Z" fill="#1E293B" />

            {/* Ears */}
            <circle cx="39" cy="53" r="4.5" fill="#FCD3BD" />
            <circle cx="81" cy="53" r="4.5" fill="#FCD3BD" />

            {/* Eyebrows */}
            <path d="M47 43 Q52 40 56 42" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M64 42 Q68 40 73 43" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Eyes - bright and curious */}
            <ellipse cx="51" cy="49" rx="2.8" ry="2.8" fill="#0F172A" />
            <ellipse cx="69" cy="49" rx="2.8" ry="2.8" fill="#0F172A" />
            <circle cx="52" cy="48" r="1" fill="#FFFFFF" />
            <circle cx="70" cy="48" r="1" fill="#FFFFFF" />

            {/* Cheeks */}
            <circle cx="45" cy="55" r="3" fill="#FDA4AF" opacity="0.6" />
            <circle cx="75" cy="55" r="3" fill="#FDA4AF" opacity="0.6" />

            {/* Nose */}
            <path d="M60 52 L59 55 L61 55" stroke="#D18F73" strokeWidth="1.5" strokeLinecap="round" fill="none" />

            {/* Smile */}
            <path d="M54 61 Q60 66 66 61" stroke="#9F1239" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      {renderCharacterSvg()}
    </div>
  );
};
