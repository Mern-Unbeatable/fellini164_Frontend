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
      return { conversationId, data: response?.data?.data };
    } catch (error) {
      toast.error('Failed to load conversation details');
      return rejectWithValue(error.response?.data?.message || 'Failed to load conversation');
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
    try {
      let response;
      if (isPinned) {
        response = await axiosInstance.delete(`/api/v1/ai/conversations/${chatId}/pin`);
      } else {
        response = await axiosInstance.post(`/api/v1/ai/conversations/${chatId}/pin`);
      }

      const apiMessage =
        response?.data?.message || (isPinned ? 'Conversation unpinned' : 'Conversation pinned');
      const updatedData = response?.data?.data;

      toast.success(apiMessage);

      return {
        chatId,
        pinned: typeof updatedData?.pinned === 'boolean' ? updatedData.pinned : !isPinned,
      };
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update pin status');
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle pin');
    }
  }
);

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
    messages:
      conv.messages?.map((msg, idx) => ({
        id: idx + 1,
        text: msg.content,
        sent: msg.role === 'user',
        time: new Date(msg.createdAt || conv.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        sender: msg.role === 'user' ? 'You' : 'AI Coach',
      })) || [],
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

      // Fetch Conversation By ID
      .addCase(fetchConversationById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        const { conversationId, data } = action.payload;
        const index = state.chats.findIndex((c) => String(c.id) === String(conversationId));

        if (index !== -1 && data && data.messages) {
          const formattedMessages = data.messages.map((msg, idx) => ({
            id: idx + 1,
            text: msg.content,
            sent: msg.role === 'user',
            time: new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            sender: msg.role === 'user' ? 'You' : 'AI Coach',
          }));

          state.chats[index].messages = formattedMessages;
          state.chats[index].name = data.title || state.chats[index].name;
        }
        state.isLoading = false;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
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
        const { chatId, pinned } = action.payload;
        const chatIndex = state.chats.findIndex((c) => c.id === chatId);

        if (chatIndex !== -1) {
          state.chats[chatIndex].pinned = pinned;
          state.chats = sortChatsByPinned(state.chats);
        }
      });
  },
});

export const { setSelectedChatIndex, clearSelectedChat, addUserMessage, updateChatPreview } =
  aiChatSlice.actions;

export default aiChatSlice.reducer;
