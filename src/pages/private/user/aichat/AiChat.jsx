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
  editUserMessage,
} from '../../../../features/aiChat/aiChatSlice';

export default function MessagePage() {
  const dispatch = useDispatch();
  const { chats, selectedChatIndex, isLoading, loadingConversations } = useSelector(
    (state) => state.aiChat
  );

  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [justSentMessage, setJustSentMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Get current chat and messages from Redux state
  const currentChat = selectedChatIndex !== null ? chats[selectedChatIndex] : null;
  const currentMessages = currentChat?.messages || [];

  const filteredChats = chats.filter((chat) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    if ((chat.name || '').toLowerCase().includes(q)) return true;
    if ((chat.preview || '').toLowerCase().includes(q)) return true;
    if ((chat.messages || []).some((m) => (m.text || '').toLowerCase().includes(q))) return true;
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
    const conversationId =
      existingChatId && typeof existingChatId === 'string' ? existingChatId : null;

    // Mark that user is sending a message (for typing effect)
    setJustSentMessage(true);

    // Add user message to Redux store
    dispatch(addUserMessage({ message: userMessage, tempChatId }));

    setInputValue('');

    // Send message and get AI response, then refresh conversation meta (title, pinned, …)
    const result = await dispatch(
      sendMessage({
        message: userMessage,
        conversationId,
        tempChatId,
      })
    );

    if (sendMessage.fulfilled.match(result)) {
      const id = result.payload.apiConversationId || conversationId;
      if (id && typeof id === 'string') {
        dispatch(fetchConversationById(id));
      }
    }
  };

  const handleSelectChat = async (chatId) => {
    // Reset justSentMessage when switching chats (loading from sidebar)
    setJustSentMessage(false);

    const index = chats.findIndex((c) => String(c.id) === String(chatId));
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

  const handleEditMessage = async (messageId, newText) => {
    if (!newText.trim() || isLoading || selectedChatIndex === null) return;

    const chat = chats[selectedChatIndex];
    if (!chat) return;

    dispatch(editUserMessage({ messageId, newText }));

    const conversationId = typeof chat.id === 'string' ? chat.id : null;

    await dispatch(
      sendMessage({
        message: newText.trim(),
        conversationId,
        tempChatId: chat.id,
      })
    );
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
    const existing = chats.find((c) => c.id === chatId);
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
    <div className="flex h-full w-full flex-col py-7.5 max-lg:py-4 max-lg:sm:py-6">
      <div className="flex flex-1 w-full overflow-hidden rounded-2xl border border-[#f2f2f2] bg-[#fcfcfc] dark:border-zinc-700 dark:bg-zinc-800">
        {/* Left Panel */}
        <div
          className={`${
            showChat ? 'hidden' : 'flex'
          } h-full w-full shrink-0 flex-col overflow-hidden border-r border-[#f2f2f2] bg-[#fcfcfc] md:flex md:w-60 lg:w-55 xl:w-80 dark:border-zinc-700 dark:bg-zinc-800`}
        >
          {/* Header - Fixed */}
          <div className="shrink-0 border-b border-[#f2f2f2] bg-[#fcfcfc] p-3 sm:p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-medium text-[#181818] dark:text-white">Chat History</p>
            </div>
            <div className="mt-3">
              <div className="flex items-center rounded-lg border border-[#f2f2f2] bg-white px-3 py-1.75 dark:border-zinc-700 dark:bg-zinc-900">
                <Search className="h-3.5 w-3.5 text-[#c2c2c2] dark:text-white" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ml-2 w-full bg-transparent text-[12px] font-medium text-[#181818] outline-none placeholder:text-[#c2c2c2] dark:text-white dark:placeholder-gray-400"
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
          <div className="h-[76px] flex items-center shrink-0 border-t border-[#f2f2f2] bg-[#fcfcfc] p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <button
              onClick={handleNewChat}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#8022fe] py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5 text-white" />
              <span className="text-white">New Chat</span>
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div
          className={`${
            showChat ? 'flex' : 'hidden'
          } h-full w-full flex-1 flex-col overflow-hidden bg-white md:flex dark:bg-zinc-800`}
        >
          {/* Chat Header - Fixed */}
          <div className="shrink-0 border-b border-[#f2f2f2] bg-[#fcfcfc] px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="rounded-full p-1 text-[#5d5d5d] transition hover:bg-[#fcfcfc] md:hidden dark:text-white dark:hover:bg-zinc-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(128,34,254,0.05)] text-[#8022fe] dark:bg-purple-950/40 dark:text-purple-300">
                <TrainFront className="h-5 w-5" />
              </div> */}
              <div>
                <p className="text-[16px] font-medium text-[#181818] dark:text-white">AI Coach</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="block h-2 w-2 rounded-full bg-[#10b981]" />
                  <span className="text-[10px] font-medium text-[#c2c2c2] dark:text-gray-400">Online</span>
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
            onEditMessage={handleEditMessage}
          />

          <MessageInput
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      </div>
      <p className="mt-2 text-center text-sm text-[#c2c2c2] dark:text-zinc-500">
        AI can make mistakes. Verify important info.
      </p>
    </div>
  );
}
