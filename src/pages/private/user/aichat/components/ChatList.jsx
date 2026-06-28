import React from 'react';
import { MoreVertical, Pin, Trash2 } from 'lucide-react';

export default function ChatList({
  chats,
  selectedChatId,
  onSelectChat,
  onToggleDropdown,
  openDropdown,
  onPin,
  onDelete,
  searchQuery,
}) {
  // Show empty state when there are no chats to display
  if (!chats || chats.length === 0) {
    const q = (searchQuery || '').toString().trim();
    return (
      <div className="flex h-full items-center justify-center bg-[#FFFFFF] p-4 text-center dark:bg-zinc-800">
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            No chat history{q ? ` matching "${q}"` : ''}
          </p>
          {q && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Try a different search term.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#FFFFFF] dark:bg-zinc-800">
      {chats.map((chat, index) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`group relative cursor-pointer px-3 py-3 transition-all duration-200 sm:px-4 ${
            selectedChatId === chat.id
              ? ' border-l-4 border-[#7C3AED] bg-[#FAF5FF] pl-3 dark:border-[#A78BFA] dark:bg-[#1F1433]'
              : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
          }`}
        >
          {chat.pinned && (
            <div className="absolute top-3 right-3 group-hover:hidden">
              <Pin className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
          )}

          <button
            onClick={(e) => onToggleDropdown(chat.id, e)}
            className={`dropdown-container absolute top-3 right-3 rounded-full p-1 text-gray-400 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-zinc-600 ${chat.pinned ? 'hidden group-hover:block' : ''}`}
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {openDropdown === chat.id && (
            <div className="dropdown-container absolute top-10 right-3 z-50 w-40 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-zinc-600 dark:bg-zinc-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPin(chat.id);
                }}
                className="flex w-full items-center gap-3 rounded-t-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-zinc-600"
              >
                <Pin className="h-4 w-4" />
                <span>{chat.pinned ? 'Unpin' : 'Pin'}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(chat.id);
                }}
                className="flex w-full items-center gap-3 rounded-b-lg px-4 py-2.5 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-zinc-600"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}

          <div className="flex gap-3 pr-8">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-[#000000] dark:text-white">{chat.name}</h3>
              <p className="mt-1 line-clamp-1 text-xs text-[#6B7280] dark:text-gray-200">
                {chat.preview}
              </p>
              <p className="mt-1 line-clamp-1 text-xs text-[#B2B2B2] dark:text-gray-300">
                {chat.time}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
