import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { HeaderNav, PageId } from './components/navigation/HeaderNav';
import { WelcomePage } from './pages/WelcomePage';
import { OfficePage } from './pages/OfficePage';
import { CaseFilesPage } from './pages/CaseFilesPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { DatasetWorkspacePage } from './pages/DatasetWorkspacePage';
import { DetectiveBoardPage } from './pages/DetectiveBoardPage';
import { DataArchivePage } from './pages/DataArchivePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ChatbotPage } from './pages/ChatbotPage';
import { InventoryBubble } from './components/common/InventoryBubble';
import { AuthAndOnboardingModal } from './components/auth/AuthAndOnboardingModal';
import { CustomAiNamingModal } from './components/ai/CustomAiNamingModal';

function MainApp() {
  const {
    activeCaseId,
    setActiveCaseId,
    tutorialSeen,
    showAuthModal,
    setShowAuthModal,
    showCharacterCreation,
    setShowCharacterCreation,
    showAiNamingModal,
    setShowAiNamingModal,
  } = useGame();

  // Page state with hash routing synchronization
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autostart') === '1') {
      return 'office';
    }

    const hash = window.location.hash.replace('#', '') as PageId;
    if (hash === ('progress' as any)) {
      return 'profile';
    }

    const validPages: PageId[] = [
      'welcome',
      'office',
      'case-files',
      'case-detail',
      'workspace',
      'detective-board',
      'archive',
      'achievements',
      'profile',
      'chatbot',
    ];
    if (validPages.includes(hash)) {
      return hash;
    }
    return tutorialSeen ? 'office' : 'welcome';
  });

  const [selectedCaseId, setSelectedCaseId] = useState<string>(activeCaseId || 'case-00');

  useEffect(() => {
    window.location.hash = currentPage;
  }, [currentPage]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      if (hash === ('progress' as any)) {
        setCurrentPage('profile');
        return;
      }
      if (hash && hash !== currentPage) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    setSelectedCaseId(caseId);
    setCurrentPage('case-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#121820] text-[#EDE8DF] selection:bg-[#E5A93C] selection:text-[#121820]">
      {/* Top Horizontal Navigation */}
      <HeaderNav currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentPage === 'welcome' && (
          <WelcomePage onStartInvestigation={() => handleNavigate('office')} />
        )}
        {currentPage === 'office' && (
          <OfficePage
            onNavigate={handleNavigate}
            onOpenCase={handleOpenCase}
          />
        )}
        {currentPage === 'case-files' && (
          <CaseFilesPage onOpenCase={handleOpenCase} onNavigate={handleNavigate} />
        )}
        {currentPage === 'case-detail' && (
          <CaseDetailPage
            caseId={selectedCaseId}
            onNavigate={handleNavigate}
          />
        )}
        {currentPage === 'workspace' && <DatasetWorkspacePage />}
        {currentPage === 'detective-board' && <DetectiveBoardPage />}
        {currentPage === 'archive' && (
          <CaseFilesPage
            onOpenCase={handleOpenCase}
            onNavigate={handleNavigate}
            initialView="datasets"
          />
        )}
        {currentPage === 'achievements' && <AchievementsPage />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'chatbot' && <ChatbotPage />}
      </main>

      {/* Floating Inventory Bubble Action Button (Visible on all pages) */}
      <InventoryBubble />

      {/* Global Authentication & Character Creation Modal */}
      <AuthAndOnboardingModal
        isOpen={showAuthModal || showCharacterCreation}
        initialStep={showCharacterCreation ? 'character' : 'login'}
        onClose={() => {
          setShowAuthModal(false);
          setShowCharacterCreation(false);
        }}
      />

      {/* Global Custom AI Companion Naming Modal */}
      <CustomAiNamingModal
        isOpen={showAiNamingModal}
        onClose={() => setShowAiNamingModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}
