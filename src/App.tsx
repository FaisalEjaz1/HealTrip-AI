import React, { useState } from 'react';
import { Header } from './components/Header.js';
import { ChatInterface } from './components/ChatInterface.js';
import { ProviderDirectory } from './components/ProviderDirectory.js';
import { ArchitectureModal } from './components/ArchitectureModal.js';
import { TelemetryDrawer } from './components/TelemetryDrawer.js';
import { BookingModal } from './components/BookingModal.js';
import { MessageItem, AgentResponse } from './types/index.js';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [activeTab, setActiveTab] = useState<'chat' | 'directory' | 'architecture'>('chat');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initial welcome message from the assistant
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: language === 'ar'
        ? 'مرحباً بك في منصة HealTrip للمساعدة السريرية واتخاذ القرار الطبي. كيف يمكنني مساعدتك اليوم؟ يمكنك وصف أي أعراض تقلقك أو السؤال عن الخيارات المناسبة بين الطوارئ، مراجعة الطبيب، أو طلب رأي طبي ثانٍ.'
        : 'Welcome to the HealTrip AI Patient Decision Assistant. I am here to help you navigate clinical uncertainty, evaluate red-flag symptoms, and match you with verified specialists or 24/7 cardiac emergency centers. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ]);

  // Booking modal state
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    provider: any;
  }>({
    isOpen: false,
    provider: null
  });

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          language
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const agentData: AgentResponse = await response.json();

      const assistantMessage: MessageItem = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: agentData.reply,
        timestamp: new Date().toISOString(),
        agentData
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      // Graceful error display in chat
      const errorMessage: MessageItem = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: language === 'ar'
          ? 'عذراً، حدث خطأ أثناء معالجة الاستشارة. يرجى المحاولة مرة أخرى أو مراجعة أقرب مركز صحي إذا كانت الحالة طارئة.'
          : 'I encountered an issue processing your request. Please try again. If experiencing acute distress, call local emergency services immediately.',
        timestamp: new Date().toISOString()
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-init-${Date.now()}`,
        role: 'assistant',
        content: language === 'ar'
          ? 'تم بدء جلسة استشارة جديدة. تفضل بوصف حالتك أو اختيار أحد السيناريوهات المقترحة أعلاه.'
          : 'Consultation reset. Please describe your symptoms or choose one of the clinical scenarios above to begin.',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const handleOpenBooking = (provider: any) => {
    setBookingModal({
      isOpen: true,
      provider
    });
  };

  const handleCloseBooking = () => {
    setBookingModal({
      isOpen: false,
      provider: null
    });
  };

  // Count active tool executions across all messages
  const totalToolExecutions = messages.reduce((acc, m) => {
    return acc + (m.agentData?.toolExecutions?.length || 0);
  }, 0);

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-slate-50 flex flex-col font-sans ${
        language === 'ar' ? 'font-[Tajawal]' : 'font-[Plus_Jakarta_Sans]'
      }`}
    >
      <Header
        language={language}
        setLanguage={setLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeToolExecutionsCount={totalToolExecutions}
      />

      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatInterface
            language={language}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onResetChat={handleResetChat}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {activeTab === 'directory' && (
          <ProviderDirectory
            language={language}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureModal language={language} messages={messages} />
        )}
      </main>

      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={handleCloseBooking}
        provider={bookingModal.provider}
        language={language}
      />
    </div>
  );
}
