import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';
import { 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  EllipsisHorizontalIcon,
  XMarkIcon,
  FaceSmileIcon,
  PhoneIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

// Mock data for conversations and messages
interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: 'me' | 'other';
  read: boolean;
}

interface Conversation {
  id: number;
  user: {
    id: number;
    name: string;
    imageUrl: string;
    role: string;
    company?: string;
    lastActive: string;
  };
  messages: Message[];
  unreadCount: number;
}

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Alex Johnson",
      imageUrl: "/avatars/alex.jpg",
      role: "Full Stack Developer",
      company: "Tech Startup",
      lastActive: "5m ago"
    },
    messages: [
      { id: 1, text: "Hey! I saw your profile and I think we'd make a great founding team.", timestamp: "2023-09-15T14:30:00", sender: 'other', read: true },
      { id: 2, text: "I've been working on a similar idea in the SaaS space. Would love to chat more about your vision.", timestamp: "2023-09-15T14:32:00", sender: 'other', read: true },
      { id: 3, text: "Hi Alex, thanks for reaching out! I'd be happy to discuss my project with you.", timestamp: "2023-09-15T14:45:00", sender: 'me', read: true },
      { id: 4, text: "Are you available for a call sometime this week?", timestamp: "2023-09-15T14:46:00", sender: 'me', read: true },
      { id: 5, text: "Absolutely! How about Thursday at 2pm?", timestamp: "2023-09-15T15:00:00", sender: 'other', read: true },
      { id: 6, text: "Thursday at 2pm works for me. I'll send a calendar invite.", timestamp: "2023-09-15T15:10:00", sender: 'me', read: true },
      { id: 7, text: "Great! Looking forward to our conversation.", timestamp: "2023-09-15T15:15:00", sender: 'other', read: false }
    ],
    unreadCount: 1
  },
  {
    id: 2,
    user: {
      id: 102,
      name: "Morgan Chen",
      imageUrl: "/avatars/morgan.jpg",
      role: "Product Manager",
      company: "Growth Labs",
      lastActive: "1h ago"
    },
    messages: [
      { id: 1, text: "Hi there! I noticed you're looking for a technical co-founder. I'm actually looking for a business partner with your exact background.", timestamp: "2023-09-14T10:00:00", sender: 'other', read: true },
      { id: 2, text: "Hey Morgan! Yes, I'm definitely interested in connecting. Tell me more about your background.", timestamp: "2023-09-14T10:30:00", sender: 'me', read: true },
      { id: 3, text: "I've spent the last 5 years in product management at Growth Labs, focusing on B2B SaaS products. I have a strong network of investors and industry contacts.", timestamp: "2023-09-14T10:45:00", sender: 'other', read: true }
    ],
    unreadCount: 0
  },
  {
    id: 3,
    user: {
      id: 103,
      name: "Jamie Rivera",
      imageUrl: "/avatars/jamie.jpg",
      role: "UX Designer",
      company: "Freelance",
      lastActive: "3h ago"
    },
    messages: [
      { id: 1, text: "Hello! I saw you were looking for a UX designer for your fintech startup. I've done extensive work in financial applications and would love to contribute to your vision.", timestamp: "2023-09-13T15:20:00", sender: 'other', read: true },
      { id: 2, text: "Hi Jamie! Thanks for reaching out. I'd love to see some examples of your work in the fintech space.", timestamp: "2023-09-13T16:00:00", sender: 'me', read: true },
      { id: 3, text: "Of course! I've attached my portfolio featuring my recent projects with financial platforms. Let me know what you think.", timestamp: "2023-09-13T16:15:00", sender: 'other', read: true },
      { id: 4, text: "These look amazing! Particularly impressed with the investment dashboard design. Are you available to discuss compensation and role details?", timestamp: "2023-09-13T16:45:00", sender: 'me', read: true },
      { id: 5, text: "Thank you! Yes, I'm available tomorrow after 2pm to discuss details. Does that work for you?", timestamp: "2023-09-13T17:00:00", sender: 'other', read: false },
      { id: 6, text: "I also wanted to mention that I have experience with your target user demographic from my previous project with FinancePal.", timestamp: "2023-09-13T17:02:00", sender: 'other', read: false }
    ],
    unreadCount: 2
  },
  {
    id: 4,
    user: {
      id: 104,
      name: "Taylor Patel",
      imageUrl: "/avatars/taylor.jpg",
      role: "Marketing Specialist",
      company: "Growth Hackers",
      lastActive: "2d ago"
    },
    messages: [
      { id: 1, text: "Hi there! I'm a marketing specialist with experience in launching early-stage startups. Would love to connect about potential collaboration.", timestamp: "2023-09-10T09:30:00", sender: 'other', read: true },
      { id: 2, text: "Hey Taylor! Thanks for reaching out. We're actually looking for someone with your expertise. What kind of startups have you worked with before?", timestamp: "2023-09-10T10:00:00", sender: 'me', read: true }
    ],
    unreadCount: 0
  },
  {
    id: 5,
    user: {
      id: 105,
      name: "Jordan Lee",
      imageUrl: "/avatars/jordan.jpg",
      role: "Backend Developer",
      company: "TechCorp",
      lastActive: "1w ago"
    },
    messages: [
      { id: 1, text: "Hello! I'm interested in your posting about needing a backend developer with experience in fintech. I've built several payment processing systems and would love to chat.", timestamp: "2023-09-05T14:00:00", sender: 'other', read: true }
    ],
    unreadCount: 0
  }
];

function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { id } = router.query;

  // Scroll to bottom of messages when active conversation changes or new message is added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation]);

  // Set active conversation based on URL id or default to first conversation
  useEffect(() => {
    if (id) {
      const conversation = conversations.find(c => c.id === Number(id));
      if (conversation) {
        setActiveConversation(conversation);
      }
    } else if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [id, conversations, activeConversation]);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    conversation => 
      conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conversation.user.company && conversation.user.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    const updatedMessage: Message = {
      id: Date.now(),
      text: newMessage,
      timestamp: new Date().toISOString(),
      sender: 'me',
      read: true
    };

    const updatedConversations = conversations.map(conversation => {
      if (conversation.id === activeConversation.id) {
        return {
          ...conversation,
          messages: [...conversation.messages, updatedMessage]
        };
      }
      return conversation;
    });

    setConversations(updatedConversations);
    setActiveConversation(prevState => {
      if (!prevState) return null;
      return {
        ...prevState,
        messages: [...prevState.messages, updatedMessage]
      };
    });
    setNewMessage('');
  };

  // Format timestamp to a readable format
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for message groups
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  };

  // Close profile popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showProfilePopup && !target.closest('.profile-popup') && !target.closest('.profile-toggle')) {
        setShowProfilePopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfilePopup]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Complete overhaul of the messaging layout to ensure full-width/height coverage */}
        <div className="fixed inset-0 lg:left-64 top-16 lg:top-0 flex overflow-hidden">
          <div className="flex flex-row w-full h-full">
            {/* Conversation List - adjusted for better responsive behavior */}
            <div className="w-1/3 md:w-1/3 lg:w-1/3 border-r border-gray-200 overflow-y-auto bg-white">
              <div className="p-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <div className="mt-4 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-md border-0 py-2 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm"
                    placeholder="Search messages"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {filteredConversations.length} conversations
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      activeConversation?.id === conversation.id ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => {
                      setActiveConversation(conversation);
                      router.push(`/messages?id=${conversation.id}`, undefined, { shallow: true });
                    }}
                  >
                    <div className="flex items-start">
                      <div className="relative flex-shrink-0">
                        <Image
                          src={conversation.user.imageUrl}
                          alt={conversation.user.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/avatars/placeholder.jpg';
                          }}
                        />
                        {conversation.user.lastActive.includes('ago') && conversation.user.lastActive.includes('m') && (
                          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm font-medium text-gray-900 truncate">{conversation.user.name}</h2>
                          <p className="text-xs text-gray-500">{
                            conversation.messages.length > 0 
                              ? formatMessageTime(conversation.messages[conversation.messages.length - 1].timestamp)
                              : ''
                          }</p>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{conversation.user.role}{conversation.user.company ? ` at ${conversation.user.company}` : ''}</p>
                        {conversation.messages.length > 0 && (
                          <p className="mt-1 text-sm text-gray-600 truncate">
                            {conversation.messages[conversation.messages.length - 1].text}
                          </p>
                        )}
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-xs text-gray-500">{conversation.user.lastActive}</p>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-xs">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredConversations.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No conversations found
                  </div>
                )}
              </div>
            </div>

            {/* Message Area - adjusted for better responsive behavior */}
            {activeConversation ? (
              <div className="flex flex-col w-2/3 md:w-2/3 lg:w-2/3 bg-white">
                {/* Header */}
                <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <Image
                        src={activeConversation.user.imageUrl}
                        alt={activeConversation.user.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/avatars/placeholder.jpg';
                        }}
                      />
                      {activeConversation.user.lastActive.includes('ago') && activeConversation.user.lastActive.includes('m') && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h2 className="text-sm font-medium text-gray-900">{activeConversation.user.name}</h2>
                      <p className="text-xs text-gray-500">
                        {activeConversation.user.role}{activeConversation.user.company ? ` at ${activeConversation.user.company}` : ''}
                        {activeConversation.user.lastActive && (
                          <span className="mx-1">•</span>
                        )}
                        {activeConversation.user.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 relative">
                    <button 
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors profile-toggle"
                      onClick={() => setShowProfilePopup(!showProfilePopup)}
                    >
                      <EllipsisHorizontalIcon className="h-5 w-5 text-gray-600" />
                    </button>
                    
                    {/* Profile Popup */}
                    {showProfilePopup && (
                      <div className="absolute right-0 top-10 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 profile-popup">
                        <div className="p-4">
                          <div className="flex items-center">
                            <Image
                              src={activeConversation.user.imageUrl}
                              alt={activeConversation.user.name}
                              width={60}
                              height={60}
                              className="rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/avatars/placeholder.jpg';
                              }}
                            />
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-900">{activeConversation.user.name}</h3>
                              <p className="text-xs text-gray-500">{activeConversation.user.role}</p>
                              {activeConversation.user.company && (
                                <p className="text-xs text-gray-500">{activeConversation.user.company}</p>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <button 
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                              onClick={() => {
                                router.push(`/profile/${activeConversation.user.id}`);
                                setShowProfilePopup(false);
                              }}
                            >
                              <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                              View full profile
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {groupMessagesByDate(activeConversation.messages).map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-4">
                      <div className="flex justify-center">
                        <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                          {formatMessageDate(group.messages[0].timestamp)}
                        </span>
                      </div>
                      {group.messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.sender === 'other' && (
                            <div className="flex-shrink-0 mr-2">
                              <Image
                                src={activeConversation.user.imageUrl}
                                alt={activeConversation.user.name}
                                width={36}
                                height={36}
                                className="rounded-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/avatars/placeholder.jpg';
                                }}
                              />
                            </div>
                          )}
                          <div 
                            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
                              message.sender === 'me' 
                                ? 'bg-black text-white rounded-tr-none' 
                                : 'bg-gray-100 text-gray-800 rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <div 
                              className={`mt-1 text-xs ${
                                message.sender === 'me' ? 'text-gray-300' : 'text-gray-500'
                              } flex items-center justify-end`}
                            >
                              {formatMessageTime(message.timestamp)}
                              {message.sender === 'me' && (
                                <span className="ml-1">{message.read ? '• Read' : ''}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex">
                    <div className="flex-1 min-w-0 relative rounded-md shadow-sm overflow-hidden">
                      <input
                        type="text"
                        className="block w-full rounded-md border-0 py-3 pl-4 pr-12 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 flex py-1 pr-1.5">
                        <div className="flex space-x-1 items-center">
                          <button 
                            type="button" 
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Attach a file"
                          >
                            <PaperClipIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </button>
                          <button 
                            type="button" 
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Add emoji"
                          >
                            <FaceSmileIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-2 inline-flex items-center justify-center rounded-full bg-black p-3 text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-2/3 md:w-2/3 lg:w-2/3 bg-white text-center">
                <div className="max-w-md py-12 px-4">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Select a conversation</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose a conversation from the sidebar to start messaging.
                  </p>
                  {filteredConversations.length === 0 && (
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default MessagesPage; 