import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { GoCopy, GoCheck } from 'react-icons/go';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Utility Functions ---
const copyToClipboard = async (text) => {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (e) {
      console.error('Unable to copy response', e);
      return false;
    }
  }
};

// --- Typing Effect Hook ---
const useTypingEffect = (text, isEnabled, speed = 15) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isEnabled || !text) {
      setDisplayedText(text || '');
      setIsComplete(true);
      return;
    }

    setIsTyping(true);
    setIsComplete(false);
    setDisplayedText('');

    let currentIndex = 0;
    const textLength = text.length;

    const typeNextChar = () => {
      if (currentIndex < textLength) {
        // Type multiple characters at once for smoother effect
        const charsToAdd = Math.min(3, textLength - currentIndex);
        setDisplayedText(text.slice(0, currentIndex + charsToAdd));
        currentIndex += charsToAdd;
        setTimeout(typeNextChar, speed);
      } else {
        setIsTyping(false);
        setIsComplete(true);
      }
    };

    const timer = setTimeout(typeNextChar, 100);

    return () => clearTimeout(timer);
  }, [text, isEnabled, speed]);

  return { displayedText, isTyping, isComplete };
};

// --- Markdown Components for Styling ---
const markdownComponents = {
  // Headings
  h1: ({ children }) => <h1 className="mt-3 mb-2 text-lg font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-3 mb-2 text-base font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-2 mb-1 text-sm font-bold">{children}</h3>,

  // Paragraphs
  p: ({ children }) => <p className="mb-2 leading-relaxed last:mb-0">{children}</p>,

  // Lists
  ul: ({ children }) => <ul className="mb-2 ml-2 list-inside list-disc space-y-1">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mb-2 ml-2 list-inside list-decimal space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,

  // Strong/Bold
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,

  // Emphasis/Italic
  em: ({ children }) => <em className="italic">{children}</em>,

  // Code blocks
  code: ({ inline, children }) => {
    if (inline) {
      return (
        <code className="rounded bg-gray-200 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-600">
          {children}
        </code>
      );
    }
    return (
      <pre className="my-2 overflow-x-auto rounded-lg bg-gray-200 p-3 dark:bg-zinc-600">
        <code className="font-mono text-sm">{children}</code>
      </pre>
    );
  },

  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-4 border-purple-500 pl-3 text-gray-600 italic dark:text-gray-300">
      {children}
    </blockquote>
  ),

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-600 underline hover:text-purple-800 dark:text-purple-400"
    >
      {children}
    </a>
  ),

  // Horizontal rule
  hr: () => <hr className="my-3 border-gray-300 dark:border-zinc-500" />,
};

// --- Sub-Components ---

// 1. Date Header Component
const DateHeader = ({ date }) => (
  <div className="py-2 text-center">
    <p className="text-xs font-medium text-gray-400 sm:text-sm dark:text-gray-300">
      {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} •{' '}
      {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
    </p>
  </div>
);

// 2. AI Message Content with Typing Effect
const AIMessageContent = ({ text, isNewMessage }) => {
  const { displayedText, isTyping } = useTypingEffect(text, isNewMessage, 12);

  return (
    <div className="ai-message-content text-base sm:text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {displayedText}
      </ReactMarkdown>
      {isTyping && (
        <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-gray-500 dark:bg-gray-300" />
      )}
    </div>
  );
};

// 3. Message Item Component (Memoized for Performance)
const MessageItem = memo(({ msg, onCopy, copiedId, isLastAIMessage }) => {
  const isUser = msg.sent;
  const isCopied = copiedId === msg.id;

  // Determine Bubble Styles - wider for AI messages to show formatted content
  const bubbleClass = `relative w-full rounded-xl px-3 py-2 sm:rounded-br-xl sm:px-4 sm:py-2.5 
        ${
          isUser
            ? 'rounded-tr-none bg-[#7C3AED] text-white shadow-sm'
            : 'rounded-tl-none border border-[#f2f2f2] bg-[#fcfcfc] text-[#181818] dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200'
        }`;

  // Check if this message is newly added (for typing effect)
  const isNewAIMessage = !isUser && isLastAIMessage && msg.isNew;

  return (
    <div className={`group flex ${isUser ? 'justify-end' : 'justify-start'} gap-2 sm:gap-3`}>
      <div
        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} ${isUser ? 'max-w-[70%] sm:max-w-sm' : 'max-w-[85%] sm:max-w-xl'}`}
      >
        {/* Message Bubble */}
        <div className={bubbleClass}>
          {msg.image ? (
            <img
              src={msg.image}
              alt="AI generated"
              className="h-auto max-w-full rounded-md object-contain"
            />
          ) : isUser ? (
            <p className="text-base wrap-break-word sm:text-sm">{msg.text}</p>
          ) : (
            <AIMessageContent text={msg.text} isNewMessage={isNewAIMessage} />
          )}
        </div>

        {/* Copy only */}
        {!msg.image && (
          <div
            className={`mt-1.5 flex items-center gap-2 opacity-0 transition-opacity select-none group-hover:opacity-100 ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCopy(msg.id, msg.text);
              }}
              className="flex size-7 items-center justify-center rounded-md text-[#5d5d5d] transition-colors hover:bg-[#f2f2f2] hover:text-[#181818] dark:text-gray-300 dark:hover:bg-zinc-700 dark:hover:text-white"
              title="Copy message"
              aria-label="Copy message"
            >
              {isCopied ? <GoCheck size={18} /> : <GoCopy size={18} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

// --- Main Component ---
export default function ChatWindow({
  currentChat,
  currentMessages,
  currentDateTime,
  isLoading,
  justSentMessage,
  setJustSentMessage,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [shouldTypeMessage, setShouldTypeMessage] = useState(false);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const wasLoadingRef = useRef(false);
  const messagesEndRef = useRef(null);
  const currentChatIdRef = useRef(null);

  // Find the last AI message index
  const lastAIMessageIndex = currentMessages.reduce((lastIdx, msg, idx) => {
    return !msg.sent ? idx : lastIdx;
  }, -1);

  // Reset typing effect when chat changes
  useEffect(() => {
    const currentChatId = currentChat?.id;
    if (currentChatIdRef.current !== currentChatId) {
      setShouldTypeMessage(false);
      setTypingMessageId(null);
      currentChatIdRef.current = currentChatId;
    }
  }, [currentChat?.id]);

  // Track when AI response arrives after user sent a message
  useEffect(() => {
    // Only trigger typing when:
    // 1. User actually sent a message (justSentMessage is true)
    // 2. Loading just completed (was loading, now not loading)
    // 3. There's an AI message at the end
    if (justSentMessage && wasLoadingRef.current && !isLoading && currentMessages.length > 0) {
      const lastMessage = currentMessages[currentMessages.length - 1];
      if (lastMessage && !lastMessage.sent) {
        setShouldTypeMessage(true);
        setTypingMessageId(lastMessage.id);
        // Reset the flag after triggering typing
        setJustSentMessage(false);

        // Auto-reset typing flag after typing completes
        setTimeout(
          () => {
            setShouldTypeMessage(false);
            setTypingMessageId(null);
          },
          lastMessage.text.length * 15 + 500
        );
      }
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading, currentMessages, justSentMessage, setJustSentMessage]);

  // Auto-scroll hook
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Handlers
  const handleCopy = useCallback(async (id, text) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FBFE] p-3 sm:p-4 md:px-10 lg:px-12 xl:px-30 dark:bg-zinc-800">
      <DateHeader date={currentDateTime} />

      <div className="flex flex-col gap-3 sm:gap-4">
        {currentMessages.map((msg, index) => {
          const isLastAI = index === lastAIMessageIndex;
          // Only show typing effect if:
          // 1. This is the last AI message
          // 2. shouldTypeMessage is true
          // 3. This message ID matches the typingMessageId
          const shouldType =
            isLastAI && !msg.sent && shouldTypeMessage && msg.id === typingMessageId;

          return (
            <MessageItem
              key={msg.id}
              msg={{ ...msg, isNew: shouldType }}
              onCopy={handleCopy}
              copiedId={copiedId}
              isLastAIMessage={isLastAI}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
