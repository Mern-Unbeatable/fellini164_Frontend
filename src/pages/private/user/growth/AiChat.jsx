import { useState, useRef, useEffect } from 'react';
import { Send, MoreVertical, ArrowLeft, Search, Plus, TrainFront, SendHorizontal, Trash2, Pin } from 'lucide-react';

const initialChatData = [
  {
    id: 1,
    name: 'TechPrint Hub',
    time: '17 min',
    preview: 'Goo, its been good news all day.',
    avatar: 'bg-gradient-to-br from-slate-400 to-slate-600',
    initial: 'T',
    messages: [
      {
        id: 1,
        text: 'Hi team, the new printer is ready.',
        sent: false,
        time: '6:21 PM',
        sender: 'T. Admin',
      },
      {
        id: 2,
        text: 'Goo, its been good news all day.',
        sent: false,
        time: '6:21 PM',
        sender: 'T. Admin',
      },
      {
        id: 3,
        text: 'Great! I will update the inventory.',
        sent: true,
        time: '6:22 PM',
        sender: 'You',
      },
    ],
    senderInitial: 'T',
  },
  {
    id: 2,
    name: '3D Maker Store',
    time: '1 hr',
    preview: 'Are you coming to class tomorrow?',
    avatar: 'bg-gradient-to-br from-green-600 to-green-800',
    initial: '3',
    messages: [
      {
        id: 1,
        text: 'Are you coming to class tomorrow?',
        sent: false,
        time: '5:00 PM',
        sender: 'Alex',
      },
      {
        id: 2,
        text: 'Yes, around 10 AM. See you there.',
        sent: true,
        time: '5:05 PM',
        sender: 'You',
      },
    ],
    senderInitial: 'A',
  },
  {
    id: 3,
    name: 'Printify Zone',
    time: '2 hrs',
    preview: 'I miss you dude, when are you coming?',
    avatar: 'bg-gradient-to-br from-orange-400 to-orange-600',
    initial: 'P',
    messages: [
      {
        id: 1,
        text: 'I miss you dude, when are you coming?',
        sent: false,
        time: '4:00 PM',
        sender: 'PZ Admin',
      },
      { id: 2, text: 'Next week, for sure!', sent: true, time: '4:15 PM', sender: 'You' },
    ],
    senderInitial: 'P',
  },
  {
    id: 4,
    name: 'GadgetForge',
    time: '3 hrs',
    preview: 'Baba what sup na, you still de Lagos?',
    avatar: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
    initial: 'G',
    messages: [
      {
        id: 1,
        text: 'Baba what sup na, you still de Lagos?',
        sent: false,
        time: '3:00 PM',
        sender: 'GF Buddy',
      },
      { id: 2, text: 'Just landed yesterday!', sent: true, time: '3:10 PM', sender: 'You' },
    ],
    senderInitial: 'B',
  },
  {
    id: 5,
    name: 'GadgetForge',
    time: '3 hrs',
    preview: 'Baba what sup na, you still de Lagos?',
    avatar: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
    initial: 'G',
    messages: [
      {
        id: 1,
        text: 'Baba what sup na, you still de Lagos?',
        sent: false,
        time: '3:00 PM',
        sender: 'GF Buddy',
      },
      { id: 2, text: 'Just landed yesterday!', sent: true, time: '3:10 PM', sender: 'You' },
    ],
    senderInitial: 'B',
  },
];

const defaultChat = {
  id: 99,
  name: 'Ope',
  time: '6:23 PM',
  preview: 'You dey hung dier you kai say house dey',
  avatar: 'bg-gradient-to-br from-blue-400 to-blue-600',
  initial: 'O',
  messages: [
    { id: 1, text: 'Yo mandem', sent: false, time: '6:21 PM', sender: 'Ope' },
    { id: 2, text: 'Cho dey house?', sent: false, time: '6:21 PM', sender: 'Ope' },
    { id: 3, text: 'Kwasia ', sent: true, time: '6:22 PM', sender: 'You' },
    {
      id: 4,
      text: 'You dey hung dier you kai say house dey',
      sent: true,
      time: '6:23 PM',
      sender: 'You',
    },
  ],
  senderInitial: 'O',
};

export default function MessagePage() {
  const [chats, setChats] = useState([defaultChat, ...initialChatData]);
  const [selectedChatIndex, setSelectedChatIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const messagesEndRef = useRef(null);

  const currentChat = chats[selectedChatIndex];
  const currentMessages = currentChat.messages;

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      id: currentMessages.length + 1,
      text: inputValue,
      sent: true,
      time: timeStr,
      sender: 'You',
    };

    const updatedChats = chats.map((chat, index) => {
      if (index === selectedChatIndex) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          preview: inputValue,
          time: timeStr,
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setInputValue('');

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSelectChat = (index) => {
    setSelectedChatIndex(index);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  const handleDeleteChat = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    setOpenDropdown(null);
    if (selectedChatIndex >= chats.length - 1) {
      setSelectedChatIndex(Math.max(0, chats.length - 2));
    }
  };

  const handlePinChat = (chatId) => {
    // Add pin functionality here
    console.log('Pin chat:', chatId);
    setOpenDropdown(null);
  };

  const toggleDropdown = (chatId, e) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === chatId ? null : chatId);
  };

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
            <button className="rounded-full p-1 text-violet-600 transition  dark:text-violet-400">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3">
            <div className="flex items-center rounded-md border border-gray-300 dark:border-zinc-500 bg-white dark:bg-zinc-800 px-3 py-2">
              <Search className="h-4 w-4 text-gray-400 dark:text-white" />
              <input
                type="text"
                placeholder="Global Search"
                className="ml-2 w-full bg-transparent text-base text-[#9CA3AF] dark:text-white placeholder-gray-400 dark:placeholder-gray-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Chat List - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-[#FFFFFF] dark:bg-zinc-800">
          {chats.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(index)}
              className={`relative cursor-pointer px-3 py-3 transition-all duration-200 sm:px-4 ${selectedChatIndex === index
                ? ' border-l-4 border-[#7C3AED] bg-[#FAF5FF] dark:border-[#A78BFA] dark:bg-[#1F1433] pl-3'
                : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
                }`}
            >
              <button
                onClick={(e) => toggleDropdown(chat.id, e)}
                className="absolute top-3 right-3 rounded-full p-1 text-gray-400 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-600 dropdown-container"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {openDropdown === chat.id && (
                <div className="absolute top-10 right-3 z-50 w-40 rounded-lg border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 shadow-lg dropdown-container">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePinChat(chat.id);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-t-lg"
                  >
                    <Pin className="h-4 w-4" />
                    <span>Pin</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-b-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}

              <div className="flex gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[#000000] dark:text-white">{chat.name}</h3>
                  <p className="mt-1 line-clamp-1 text-xs text-[#6B7280] dark:text-gray-200">{chat.preview}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-[#B2B2B2] dark:text-gray-300">{chat.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Chat Button - Fixed */}
        <div className="shrink-0 border-t border-gray-100 dark:border-zinc-500 bg-white dark:bg-zinc-800 p-4">
          <button
            onClick={() => {
              setSelectedChatIndex(0);
              setShowChat(true);
            }}
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
        <div className="flex-1 overflow-y-auto bg-[#F8FBFE] dark:bg-zinc-800 p-3 sm:p-4 md:px-10 lg:px-12 xl:px-30">
          <div className="py-2 text-center">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-300 sm:text-sm">
              Thursday, Jan 4 • 6:21 PM
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sent ? 'justify-end' : 'justify-start'} gap-2 sm:gap-3`}
              >

                <div
                  className={`max-w-[70%] rounded-xl px-3 py-2 shadow-sm sm:max-w-sm sm:rounded-br-xl sm:px-4 sm:py-2.5 ${msg.sent ? 'rounded-tr-none bg-[#7C3AED] ' : 'rounded-tl-none bg-[#EDEDED] dark:bg-zinc-500 text-[#000000] dark:text-white'}`}
                >
                  <p className={`text-xs wrap-break-word ${msg.sent ? 'text-white' : 'text-[#000000] dark:text-white'} sm:text-sm`}>{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input - Fixed */}
        <div className="shrink-0 border-t border-gray-200 dark:border-zinc-500 bg-white dark:bg-zinc-800 px-3 py-3 sm:px-4 md:px-6 md:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-gray-200 bg-[#FFFFFF] dark:bg-zinc-800 px-3 py-2 focus-within:border-purple-400 focus-within:ring-1 focus-within:ring-purple-400 sm:gap-3 sm:px-4">
              <input
                type="text"
                placeholder="Ask anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="h-8 flex-1 bg-transparent text-xs text-gray-900 dark:text-white focus:outline-none sm:text-sm dark:placeholder-gray-200"
              />
            </div>
            <button
              onClick={handleSend}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-md sm:h-10 sm:w-10 md:h-12 md:w-12"
            >
              <SendHorizontal className="h-6 w-6" />
            </button>
          </div>
          <p className="text-xs text-[#616161] dark:text-white mt-2 text-center sm:text-sm md:text-base">AI can make mistakes. Verify important info.</p>
        </div>
      </div>
    </div>
  );
}
