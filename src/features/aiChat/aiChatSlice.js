import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';

// Async Thunks
export const fetchConversations = createAsyncThunk(
  'aiChat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/ai/conversations');
      return response?.data?.data?.conversations || [];
    } catch (error) {
      toast.error('Failed to load chat history');
      return rejectWithValue(error.response?.data?.message || 'Failed to load conversations');
    }
  }
);

export const fetchConversationById = createAsyncThunk(
  'aiChat/fetchConversationById',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/ai/conversations/${conversationId}`);
      // API: { success, data: { id, title, userId, type, pinned, createdAt, updatedAt, messages? } }
      const data = response?.data?.data ?? null;
      return { conversationId, data };
    } catch (error) {
      toast.error('Failed to load conversation details');
      return rejectWithValue(error.response?.data?.message || 'Failed to load conversation');
    }
  }
);

/** PATCH /api/v1/ai/conversations/:id — update title (and other meta). Response matches GET data shape. */
export const updateConversation = createAsyncThunk(
  'aiChat/updateConversation',
  async ({ conversationId, title }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/ai/conversations/${conversationId}`, {
        title,
      });
      const data = response?.data?.data ?? null;
      return { conversationId, data };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update conversation');
      return rejectWithValue(error.response?.data?.message || 'Failed to update conversation');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'aiChat/sendMessage',
  async ({ message, conversationId, tempChatId }, { rejectWithValue }) => {
    try {
      const postBody = { message };
      if (conversationId && typeof conversationId === 'string') {
        postBody.conversationId = conversationId;
      }

      const response = await axiosInstance.post('/api/v1/ai/chat', postBody);

      const assistantMessage = response?.data?.data?.assistantMessage;
      const textResponse =
        assistantMessage?.content ||
        response?.data?.data?.content ||
        'Sorry, I could not process your request.';
      const apiConversationId = response?.data?.data?.conversationId;

      return {
        textResponse,
        apiConversationId,
        tempChatId,
        originalConversationId: conversationId,
      };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to get AI response');
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const deleteConversation = createAsyncThunk(
  'aiChat/deleteConversation',
  async (chatId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/v1/ai/conversations/${chatId}`);
      toast.success('Conversation deleted successfully');
      return chatId;
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete conversation');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete conversation');
    }
  }
);

export const togglePinConversation = createAsyncThunk(
  'aiChat/togglePinConversation',
  async ({ chatId, isPinned }, { rejectWithValue }) => {
    const pinUrl = `/api/v1/ai/conversations/${chatId}/pin`;
    const conversationUrl = `/api/v1/ai/conversations/${chatId}`;

    const isRouteMissing = (error) => {
      const status = error?.response?.status;
      const message = String(error?.response?.data?.message || error?.message || '');
      return (
        status === 404 ||
        /route not found/i.test(message) ||
        /cannot (get|post|put|patch|delete)/i.test(message)
      );
    };

    /** Unpin: backend has no DELETE /pin — try same /pin route + conversation update. */
    const unpinConversation = async () => {
      const attempts = [
        // 1) Same pin route with explicit body (most likely if only /pin is documented)
        () => axiosInstance.post(pinUrl, { pinned: false }),
        // 2) Conversation update APIs
        () => axiosInstance.patch(conversationUrl, { pinned: false }),
        () => axiosInstance.put(conversationUrl, { pinned: false }),
        // 3) Legacy DELETE (kept last)
        () => axiosInstance.delete(pinUrl),
      ];

      let lastError;
      for (const attempt of attempts) {
        try {
          return await attempt();
        } catch (error) {
          lastError = error;
          if (isRouteMissing(error)) continue;
          throw error;
        }
      }
      throw lastError;
    };

    try {
      // Pin works with POST /pin. Unpin must not use DELETE /pin (Route not found).
      const response = isPinned
        ? await unpinConversation()
        : await axiosInstance.post(pinUrl, { pinned: true });

      const updatedData = response?.data?.data;
      const apiMessage =
        response?.data?.message ||
        (isPinned ? 'Conversation unpinned successfully' : 'Conversation pinned successfully');

      toast.success(apiMessage);

      return {
        chatId: updatedData?.id || chatId,
        pinned: typeof updatedData?.pinned === 'boolean' ? updatedData.pinned : !isPinned,
        data: updatedData || null,
      };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update pin status');
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle pin');
    }
  }
);

const applyConversationMeta = (chat, data) => {
  if (!chat || !data) return chat;
  if (data.title) chat.name = data.title;
  if (typeof data.pinned === 'boolean') chat.pinned = data.pinned;
  if (data.updatedAt) {
    chat.time = new Date(data.updatedAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  if (data.id) chat.id = data.id;
  return chat;
};

const formatMessages = (messages, fallbackDate) =>
  (messages || []).map((msg, idx) => ({
    id: msg.id || idx + 1,
    text: msg.content,
    sent: msg.role === 'user',
    time: new Date(msg.timestamp || msg.createdAt || fallbackDate).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    sender: msg.role === 'user' ? 'You' : 'AI Coach',
  }));

// Helper functions
const formatConversation = (conv) => {
  const lastMessage =
    conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null;

  return {
    id: conv.id,
    name: conv.title || 'AI Coach',
    time: new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    preview: lastMessage?.content?.substring(0, 50) || 'Start a new conversation',
    avatar: 'bg-gradient-to-br from-violet-500 to-purple-600',
    initial: 'AI',
    pinned: conv.pinned || false,
    type: conv.type || 'chat',
    messages: formatMessages(conv.messages, conv.createdAt),
    senderInitial: 'AI',
  };
};

const sortChatsByPinned = (chats) => {
  return [...chats].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });
};

// Initial State
const initialState = {
  chats: [],
  selectedChatIndex: null,
  isLoading: false,
  loadingConversations: true,
  error: null,
};

// Slice
const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    setSelectedChatIndex: (state, action) => {
      state.selectedChatIndex = action.payload;
    },
    clearSelectedChat: (state) => {
      state.selectedChatIndex = null;
    },
    addUserMessage: (state, action) => {
      const { message, tempChatId } = action.payload;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const userMsg = {
        id: Date.now(),
        text: message,
        sent: true,
        time: timeStr,
        sender: 'You',
      };

      if (state.selectedChatIndex === null) {
        // Create new chat
        const newChat = {
          id: tempChatId,
          name: 'AI Coach',
          time: timeStr,
          preview: message.substring(0, 50),
          avatar: 'bg-gradient-to-br from-violet-500 to-purple-600',
          initial: 'AI',
          messages: [userMsg],
          senderInitial: 'AI',
          pinned: false,
        };

        const pinnedCount = state.chats.filter((c) => c.pinned).length;
        const pinned = state.chats.filter((c) => c.pinned);
        const others = state.chats.filter((c) => !c.pinned);

        state.chats = [...pinned, newChat, ...others];
        state.selectedChatIndex = pinnedCount;
      } else {
        // Add to existing chat
        const chat = state.chats[state.selectedChatIndex];
        chat.messages.push(userMsg);
        chat.preview = message;
        chat.time = timeStr;
      }
    },
    updateChatPreview: (state, action) => {
      const { index, preview, time } = action.payload;
      if (state.chats[index]) {
        state.chats[index].preview = preview;
        state.chats[index].time = time;
      }
    },
    /** Edit a user message and drop all messages after it (ChatGPT-style regenerate). */
    editUserMessage: (state, action) => {
      const { messageId, newText } = action.payload;
      if (state.selectedChatIndex === null) return;
      const chat = state.chats[state.selectedChatIndex];
      if (!chat?.messages?.length) return;

      const msgIndex = chat.messages.findIndex((m) => String(m.id) === String(messageId));
      if (msgIndex === -1 || !chat.messages[msgIndex].sent) return;

      const trimmed = newText.trim();
      if (!trimmed) return;

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      chat.messages = [
        ...chat.messages.slice(0, msgIndex),
        {
          ...chat.messages[msgIndex],
          text: trimmed,
          time: timeStr,
        },
      ];
      chat.preview = trimmed.substring(0, 50);
      chat.time = timeStr;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loadingConversations = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        const conversations = action.payload;
        if (conversations.length > 0) {
          const formattedChats = conversations.map(formatConversation);
          state.chats = sortChatsByPinned(formattedChats);
        }
        state.loadingConversations = false;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loadingConversations = false;
        state.error = action.payload;
      })

      // Fetch Conversation By ID — data: { id, title, pinned, type, createdAt, updatedAt, messages? }
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        const { conversationId, data } = action.payload;
        if (!data) return;

        let index = state.chats.findIndex((c) => String(c.id) === String(conversationId));
        if (index === -1 && data.id) {
          index = state.chats.findIndex((c) => String(c.id) === String(data.id));
        }

        if (index === -1) {
          state.chats = sortChatsByPinned([formatConversation(data), ...state.chats]);
          return;
        }

        applyConversationMeta(state.chats[index], data);
        if (Array.isArray(data.messages)) {
          state.chats[index].messages = formatMessages(data.messages, data.createdAt);
          const last = data.messages[data.messages.length - 1];
          if (last?.content) {
            state.chats[index].preview = last.content.substring(0, 50);
          }
        }
        state.chats = sortChatsByPinned(state.chats);
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Update Conversation (title, etc.)
      .addCase(updateConversation.fulfilled, (state, action) => {
        const { conversationId, data } = action.payload;
        if (!data) return;
        const index = state.chats.findIndex(
          (c) => String(c.id) === String(conversationId) || String(c.id) === String(data.id)
        );
        if (index === -1) return;
        applyConversationMeta(state.chats[index], data);
        state.chats = sortChatsByPinned(state.chats);
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { textResponse, apiConversationId, tempChatId, originalConversationId } =
          action.payload;
        const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const aiMsg = {
          id: Date.now() + 1,
          text: textResponse,
          sent: false,
          time: aiTime,
          sender: 'AI Coach',
        };

        // Find the chat to update - prioritize originalConversationId for existing chats
        const matchId = originalConversationId ?? tempChatId;
        let chatIndex = -1;

        // First try to find by originalConversationId (for existing conversations)
        if (originalConversationId) {
          chatIndex = state.chats.findIndex((c) => String(c.id) === String(originalConversationId));
        }

        // If not found and we have tempChatId, search by tempChatId (for new conversations)
        if (chatIndex === -1 && tempChatId) {
          chatIndex = state.chats.findIndex((c) => String(c.id) === String(tempChatId));
        }

        if (chatIndex !== -1) {
          // Update chat ID if this was a new conversation and API returned a conversation ID
          if (apiConversationId && tempChatId && state.chats[chatIndex].id === tempChatId) {
            state.chats[chatIndex].id = apiConversationId;
          }

          // Add AI message
          state.chats[chatIndex].messages = [...state.chats[chatIndex].messages, aiMsg];
          state.chats[chatIndex].preview = textResponse.substring(0, 50) + '...';
          state.chats[chatIndex].time = aiTime;

          // Get the final ID before sorting
          const finalId = state.chats[chatIndex].id;

          // Re-sort to maintain pinned order
          state.chats = sortChatsByPinned(state.chats);

          // Update selected index after sorting by finding the chat with finalId
          const newIndex = state.chats.findIndex((c) => String(c.id) === String(finalId));
          if (newIndex !== -1) {
            state.selectedChatIndex = newIndex;
          }
        }

        state.isLoading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Conversation
      .addCase(deleteConversation.fulfilled, (state, action) => {
        const chatId = action.payload;
        const newChats = state.chats.filter((chat) => chat.id !== chatId);

        if (state.selectedChatIndex !== null) {
          if (state.selectedChatIndex >= newChats.length) {
            state.selectedChatIndex = Math.max(0, newChats.length - 1);
          }
        }

        state.chats = newChats;
      })

      // Toggle Pin
      .addCase(togglePinConversation.fulfilled, (state, action) => {
        const { chatId, pinned, data } = action.payload;
        const selectedId =
          state.selectedChatIndex !== null ? state.chats[state.selectedChatIndex]?.id : null;
        const chatIndex = state.chats.findIndex((c) => String(c.id) === String(chatId));

        if (chatIndex !== -1) {
          state.chats[chatIndex].pinned = pinned;
          if (data) applyConversationMeta(state.chats[chatIndex], data);
          state.chats = sortChatsByPinned(state.chats);
          if (selectedId != null) {
            const nextIndex = state.chats.findIndex((c) => String(c.id) === String(selectedId));
            if (nextIndex !== -1) state.selectedChatIndex = nextIndex;
          }
        }
      });
  },
});

export const {
  setSelectedChatIndex,
  clearSelectedChat,
  addUserMessage,
  updateChatPreview,
  editUserMessage,
} = aiChatSlice.actions;

export default aiChatSlice.reducer;
