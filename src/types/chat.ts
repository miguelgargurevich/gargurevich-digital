// Chat types and interfaces

export interface ConversationMemory {
  sessionId: string;
  userId?: string;
  clientInfo: {
    name?: string;
    email?: string;
    company?: string;
    projectType?: string;
    budget?: string;
    industry?: string;
  };
  conversationHistory: Message[];
  sentiment: SentimentAnalysis;
  preferences: UserPreferences;
  lastInteraction: Date;
  conversationStats: ConversationStats;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sentiment?: SentimentScore;
  keywords?: string[];
  category?: MessageCategory;
}

export interface SentimentAnalysis {
  overall: SentimentScore;
  history: SentimentScore[];
  trend: 'improving' | 'declining' | 'stable';
  lastUpdated: Date;
}

export interface SentimentScore {
  score: number; // -1 to 1 (-1 = very negative, 0 = neutral, 1 = very positive)
  label: 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
  confidence: number; // 0 to 1
  keywords: string[];
}

export interface UserPreferences {
  preferredCommunicationStyle: 'formal' | 'casual' | 'technical';
  projectInterests: string[];
  budgetRange: string;
  timeframe: string;
  communicationMethod: 'chat' | 'email' | 'whatsapp' | 'phone';
}

export interface ConversationStats {
  totalMessages: number;
  totalSessions: number;
  averageSessionLength: number;
  mostDiscussedTopics: string[];
  conversionProbability: number; // 0 to 1
  engagementLevel: 'low' | 'medium' | 'high';
}

export type MessageCategory = 
  | 'greeting'
  | 'project_inquiry'
  | 'pricing_question'
  | 'technical_question'
  | 'timeline_question'
  | 'portfolio_request'
  | 'contact_info'
  | 'complaint'
  | 'compliment'
  | 'other';

export interface ChatAnalytics {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  messageCount: number;
  averageResponseTime: number;
  topicsDiscussed: string[];
  sentimentJourney: SentimentScore[];
  outcome: 'lead_generated' | 'info_provided' | 'abandoned' | 'ongoing';
}

