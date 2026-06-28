import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Search, Plus, TrainFront } from 'lucide-react';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import {
  fetchConversations,
  fetchConversationById,
  sendMessage,
  deleteConversation,
  togglePinConversation,
  setSelectedChatIndex,
  clearSelectedChat,
  addUserMessage,
} from '../../../../features/aiChat/aiChatSlice';

export default function MessagePage() {
  const dispatch = useDispatch();
  const { chats, selectedChatIndex, isLoading, loadingConversations } = useSelector((state) => state.aiChat);

  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [justSentMessage, setJustSentMessage] = useState(false);

  // Get current chat and messages from Redux state
  const currentChat = selectedChatIndex !== null ? chats[selectedChatIndex] : null;
  const currentMessages = currentChat?.messages || [];

  const filteredChats = chats.filter(chat => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    if ((chat.name || '').toLowerCase().includes(q)) return true;
    if ((chat.preview || '').toLowerCase().includes(q)) return true;
    if ((chat.messages || []).some(m => (m.text || '').toLowerCase().includes(q))) return true;
    return false;
  });

  // Fetch conversations from API
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    const tempChatId = Date.now();

    // Get current conversationId if chat is selected
    const existingChatId = selectedChatIndex !== null ? chats[selectedChatIndex]?.id : null;
    const conversationId = (existingChatId && typeof existingChatId === 'string') ? existingChatId : null;

    // Mark that user is sending a message (for typing effect)
    setJustSentMessage(true);

    // Add user message to Redux store
    dispatch(addUserMessage({ message: userMessage, tempChatId }));

    setInputValue('');

    // Send message and get AI response
    await dispatch(sendMessage({
      message: userMessage,
      conversationId,
      tempChatId
    }));
  };

  const handleSelectChat = async (chatId) => {
    // Reset justSentMessage when switching chats (loading from sidebar)
    setJustSentMessage(false);
    
    const index = chats.findIndex(c => String(c.id) === String(chatId));
    if (index === -1) return;

    dispatch(setSelectedChatIndex(index));
    setShowChat(true);
    setOpenDropdown(null);

    const selectedChat = chats[index];

    // Only fetch from API if this chat has a server-side id (string)
    if (!selectedChat || typeof selectedChat.id !== 'string') {
      return;
    }

    // Fetch individual conversation from API using Redux
    dispatch(fetchConversationById(selectedChat.id));
  };

  const handleBack = () => {
    setShowChat(false);
  };

  const handleNewChat = () => {
    // Open a fresh chat UI (no conversationId) and clear input
    dispatch(clearSelectedChat());
    setShowChat(true);
    setInputValue('');
    setOpenDropdown(null);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleDeleteChat = async (chatId) => {
    await dispatch(deleteConversation(chatId));
    setOpenDropdown(null);
  };

  const handlePinChat = async (chatId) => {
    const existing = chats.find(c => c.id === chatId);
    if (!existing) {
      return;
    }

    await dispatch(togglePinConversation({ chatId, isPinned: existing.pinned }));
    setOpenDropdown(null);
  };

  const toggleDropdown = (chatId, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === chatId ? null : chatId);
  };

  // Update current date and time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown !== null && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="flex h-full w-full  p-4 sm:p-6 lg:p-8">
      {/* Left Panel */}
      <div
        className={`${showChat ? 'hidden' : 'flex'
          } h-full w-full shrink-0 flex-col overflow-hidden border-r border-gray-200 dark:border-zinc-500 bg-white dark:bg-zinc-800 shadow-sm md:flex md:w-60 lg:w-55 xl:w-80`}
      >
        {/* Header - Fixed */}
        <div className="shrink-0 border-b border-gray-100 dark:border-zinc-500 bg-[#FFFFFF]  dark:bg-zinc-800 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-[#111851] sm:text-lg dark:text-white">Chat History</h2>
            {/* <button onClick={handleNewChat} className="rounded-full p-1 text-violet-600 transition  dark:text-violet-400">
              <Plus className="h-5 w-5" />
            </button> */}
          </div>
          <div className="mt-3">
            <div className="flex items-center rounded-md border border-gray-300 dark:border-zinc-500 bg-white dark:bg-zinc-800 px-3 py-2">
              <Search className="h-4 w-4 text-gray-400 dark:text-white" />
              <input
                type="text"
                placeholder=" Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ml-2 w-full bg-transparent text-base placeholder-gray-400 text-[#000000] dark:text-white dark:placeholder-gray-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <ChatList
          chats={filteredChats}
          selectedChatId={selectedChatIndex !== null ? chats[selectedChatIndex]?.id : null}
          searchQuery={searchQuery}
          onSelectChat={handleSelectChat}
          onToggleDropdown={toggleDropdown}
          openDropdown={openDropdown}
          onPin={handlePinChat}
          onDelete={handleDeleteChat}
        />

        {/* New Chat Button - Fixed */}
        <div className="shrink-0 border-t border-gray-100 dark:border-zinc-500 bg-white dark:bg-zinc-800 p-4">
          <button
            onClick={handleNewChat}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#9333EA] py-2.5 text-white shadow-md transition"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>
      </div>

      {/* Right Panel */}
      <div
        className={`${showChat ? 'flex' : 'hidden'
          } h-full w-full flex-1 flex-col overflow-hidden bg-white dark:bg-zinc-800 md:flex`}
      >
        {/* Chat Header - Fixed */}
        <div className="shrink-0 border-b border-gray-200 dark:border-zinc-500 bg-white dark:bg-zinc-800 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="rounded-full p-1 text-gray-600 transition hover:text-gray-900 dark:text-white dark:hover:text-white md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white shadow-md">
              <TrainFront />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#000000] dark:text-white">AI Coach</h2>
              <div className="flex items-center gap-2">
                <span className="block h-2 w-2 rounded-full bg-[#61FD73]" />
                <span className="text-xs text-gray-500 dark:text-gray-300">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Content - Scrollable */}
        <ChatWindow 
          currentChat={currentChat} 
          currentMessages={currentMessages} 
          currentDateTime={currentDateTime} 
          isLoading={isLoading}
          justSentMessage={justSentMessage}
          setJustSentMessage={setJustSentMessage}
        />

        <MessageInput inputValue={inputValue} setInputValue={setInputValue} onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}