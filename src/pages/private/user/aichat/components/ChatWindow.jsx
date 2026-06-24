import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Copy, Check, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
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
    h1: ({ children }) => <h1 className="text-lg font-bold mt-3 mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-1">{children}</h3>,
    
    // Paragraphs
    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
    
    // Lists
    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>,
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    
    // Strong/Bold
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    
    // Emphasis/Italic
    em: ({ children }) => <em className="italic">{children}</em>,
    
    // Code blocks
    code: ({ inline, children }) => {
        if (inline) {
            return <code className="bg-gray-200 dark:bg-zinc-600 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>;
        }
        return (
            <pre className="bg-gray-200 dark:bg-zinc-600 p-3 rounded-lg overflow-x-auto my-2">
                <code className="text-sm font-mono">{children}</code>
            </pre>
        );
    },
    
    // Blockquotes
    blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-purple-500 pl-3 my-2 italic text-gray-600 dark:text-gray-300">
            {children}
        </blockquote>
    ),
    
    // Links
    a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 underline hover:text-purple-800">
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
        <p className="text-xs font-medium text-gray-400 dark:text-gray-300 sm:text-sm">
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} • {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
        </p>
    </div>
);

// 2. Inline Edit Composer Component
const EditComposer = ({ initialText, onCancel, onSave }) => {
    const [text, setText] = useState(initialText);

    return (
        <div className="w-full flex justify-end px-3">
            <div className="w-full max-w-sm rounded-lg bg-gray-100 dark:bg-zinc-800 p-3 border border-gray-200 dark:border-zinc-700">
                <textarea
                    className="w-full min-h-[60px] rounded bg-white dark:bg-zinc-900 p-2 text-sm text-black dark:text-white focus:outline-none resize-none border border-transparent focus:border-purple-500"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    autoFocus
                />
                <div className="mt-2 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="rounded-md px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-zinc-700 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(text)}
                        className="rounded-md bg-[#7C3AED] text-white px-3 py-1 text-xs font-medium hover:bg-[#6D28D9] transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

// 3. AI Message Content with Typing Effect
const AIMessageContent = ({ text, isNewMessage }) => {
    const { displayedText, isTyping } = useTypingEffect(text, isNewMessage, 12);
    
    return (
        <div className="ai-message-content text-base sm:text-sm">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
            >
                {displayedText}
            </ReactMarkdown>
            {isTyping && (
                <span className="inline-block w-1.5 h-4 bg-gray-500 dark:bg-gray-300 ml-0.5 animate-pulse" />
            )}
        </div>
    );
};

// 4. Message Item Component (Memoized for Performance)
const MessageItem = memo(({ msg, onCopy, copiedId, onEditStart, isEditing, onEditCancel, onEditSave, isLastAIMessage }) => {
    const isUser = msg.sent;
    const isCopied = copiedId === msg.id;

    // Determine Bubble Styles - wider for AI messages to show formatted content
    const bubbleClass = `relative w-full rounded-xl px-3 py-2 shadow-sm sm:rounded-br-xl sm:px-4 sm:py-2.5 
        ${isUser 
            ? 'rounded-tr-none bg-[#7C3AED] text-white' 
            : 'rounded-tl-none bg-[#EDEDED] dark:bg-zinc-700 text-[#000000] dark:text-white'}`;

    // Check if this message is newly added (for typing effect)
    const isNewAIMessage = !isUser && isLastAIMessage && msg.isNew;

    return (
        <React.Fragment>
            <div className={`group flex ${isUser ? 'justify-end' : 'justify-start'} gap-2 sm:gap-3`}>
                <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} ${isUser ? 'max-w-[70%] sm:max-w-sm' : 'max-w-[85%] sm:max-w-xl'}`}>
                    
                    {/* Message Bubble */}
                    <div className={bubbleClass}>
                        {msg.image ? (
                            <img src={msg.image} alt="AI generated" className="rounded-md max-w-full h-auto object-contain" />
                        ) : isUser ? (
                            <p className="text-base wrap-break-word sm:text-sm">{msg.text}</p>
                        ) : (
                            <AIMessageContent text={msg.text} isNewMessage={isNewAIMessage} />
                        )}
                    </div>

                    {/* Action Buttons (Copy/Edit) - Positioned in whitespace */}
                    <div className={`flex items-center gap-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity select-none ${isUser ? 'justify-end' : 'justify-start'}`}>
                        {/* Edit Button Placeholder (User only) */}
                        {isUser && (
                            
                            /* <button onClick={() => onEditStart(msg)}><Edit2 className="h-3 w-3 text-gray-400" /></button> */
                            null
                        )}

                        {/* Copy Button */}
                        {!msg.image && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onCopy(msg.id, msg.text); }}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                                title="Copy message"
                                aria-label="Copy message"
                            >
                                {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-4 w-4" />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Inline Editor */}
            {isEditing && (
                <EditComposer 
                    initialText={msg.text} 
                    onCancel={onEditCancel} 
                    onSave={(newText) => onEditSave(msg.id, newText)} 
                />
            )}
        </React.Fragment>
    );
});

// --- Main Component ---
export default function ChatWindow({ currentChat, currentMessages, currentDateTime, isLoading, justSentMessage, setJustSentMessage }) {
    const [copiedId, setCopiedId] = useState(null);
    const [editingId, setEditingId] = useState(null);
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
                setTimeout(() => {
                    setShouldTypeMessage(false);
                    setTypingMessageId(null);
                }, lastMessage.text.length * 15 + 500);
            }
        }
        wasLoadingRef.current = isLoading;
    }, [isLoading, currentMessages, justSentMessage, setJustSentMessage]);

    // Auto-scroll hook
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages, editingId]);

    // Handlers
    const handleCopy = useCallback(async (id, text) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 3000);
        }
    }, []);

    const handleEditStart = useCallback((msg) => {
        setEditingId(msg.id);
    }, []);

    const handleEditCancel = useCallback(() => {
        setEditingId(null);
    }, []);

    const handleEditSave = useCallback((id, newText) => {
        toast.info('Message edit feature coming soon');
        // Logic to update message in parent state/redux would go here
        setEditingId(null);
    }, []);

    return (
        <div className="flex-1 overflow-y-auto bg-[#F8FBFE] dark:bg-zinc-800 p-3 sm:p-4 md:px-10 lg:px-12 xl:px-30">
            
            <DateHeader date={currentDateTime} />

            <div className="flex flex-col gap-3 sm:gap-4">
                {currentMessages.map((msg, index) => {
                    const isLastAI = index === lastAIMessageIndex;
                    // Only show typing effect if:
                    // 1. This is the last AI message
                    // 2. shouldTypeMessage is true
                    // 3. This message ID matches the typingMessageId
                    const shouldType = isLastAI && !msg.sent && shouldTypeMessage && msg.id === typingMessageId;
                    
                    return (
                        <MessageItem
                            key={msg.id}
                            msg={{ ...msg, isNew: shouldType }}
                            onCopy={handleCopy}
                            copiedId={copiedId}
                            onEditStart={handleEditStart}
                            isEditing={editingId === msg.id}
                            onEditCancel={handleEditCancel}
                            onEditSave={handleEditSave}
                            isLastAIMessage={isLastAI}
                        />
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}