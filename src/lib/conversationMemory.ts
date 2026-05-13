import { ConversationMemory, Message } from '@/types/chat';
import { analyzeSentiment, analyzeConversationSentiment, categorizeMessage } from './sentiment';

const STORAGE_KEY = 'chat_memory';
const PERSISTENT_SESSION_KEY = 'chat_persistent_session_id';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export class ConversationMemoryManager {
  private memory: Map<string, ConversationMemory> = new Map();

  constructor() {
    this.loadFromStorage();
    this.startCleanupTimer();
  }

  // Generate a unique session ID
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get or create a persistent session ID stored in localStorage.
  // Returns the same ID across page reloads and return visits.
  getPersistentSessionId(): string {
    if (typeof window === 'undefined' || !window.localStorage) {
      return this.generateSessionId();
    }
    let sessionId = localStorage.getItem(PERSISTENT_SESSION_KEY);
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem(PERSISTENT_SESSION_KEY, sessionId);
    }
    return sessionId;
  }

  // Reset the persistent session ID (used when the user clears the chat)
  resetPersistentSessionId(): string {
    const newId = this.generateSessionId();
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(PERSISTENT_SESSION_KEY, newId);
    }
    return newId;
  }

  // Get or create conversation memory for a session
  getOrCreateMemory(sessionId: string): ConversationMemory {
    let memory = this.memory.get(sessionId);
    
    if (!memory) {
      memory = {
        sessionId,
        clientInfo: {},
        conversationHistory: [],
        sentiment: {
          overall: { score: 0, label: 'neutral', confidence: 0, keywords: [] },
          history: [],
          trend: 'stable',
          lastUpdated: new Date()
        },
        preferences: {
          preferredCommunicationStyle: 'formal',
          projectInterests: [],
          budgetRange: '',
          timeframe: '',
          communicationMethod: 'chat'
        },
        lastInteraction: new Date(),
        conversationStats: {
          totalMessages: 0,
          totalSessions: 1,
          averageSessionLength: 0,
          mostDiscussedTopics: [],
          conversionProbability: 0.1, // Base probability
          engagementLevel: 'medium'
        }
      };
      
      this.memory.set(sessionId, memory);
      this.saveToStorage();
    }
    
    return memory;
  }

  // Add a message to conversation memory
  addMessage(sessionId: string, message: Omit<Message, 'sentiment' | 'keywords' | 'category'>): Message {
    const memory = this.getOrCreateMemory(sessionId);
    
    // Analyze message if it's from user
    const enhancedMessage: Message = {
      ...message,
      sentiment: message.type === 'user' ? analyzeSentiment(message.content) : undefined,
      keywords: this.extractKeywords(message.content),
      category: message.type === 'user' ? categorizeMessage(message.content) : undefined
    };

    memory.conversationHistory.push(enhancedMessage);
    memory.lastInteraction = new Date();
    memory.conversationStats.totalMessages++;

    // Update sentiment analysis
    if (message.type === 'user') {
      this.updateSentimentAnalysis(memory);
      this.updateUserPreferences(memory, enhancedMessage);
      this.updateConversationStats(memory);
    }

    this.saveToStorage();
    return enhancedMessage;
  }

  // Update sentiment analysis based on conversation history
  private updateSentimentAnalysis(memory: ConversationMemory): void {
    const analysis = analyzeConversationSentiment(memory.conversationHistory);
    
    memory.sentiment = {
      overall: analysis.overall,
      history: [...memory.sentiment.history, analysis.overall].slice(-10), // Keep last 10
      trend: analysis.trend,
      lastUpdated: new Date()
    };
  }

  // Extract and update user preferences based on conversation
  private updateUserPreferences(memory: ConversationMemory, message: Message): void {
    const content = message.content.toLowerCase();
    
    // Detect communication style preference
    if (content.includes('formal') || content.includes('profesional')) {
      memory.preferences.preferredCommunicationStyle = 'formal';
    } else if (content.includes('casual') || content.includes('informal')) {
      memory.preferences.preferredCommunicationStyle = 'casual';
    } else if (content.includes('técnico') || content.includes('technical')) {
      memory.preferences.preferredCommunicationStyle = 'technical';
    }

    // Extract budget information
    const budgetRegex = /\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:usd|dollars?|dólares?)/i;
    const budgetMatch = content.match(budgetRegex);
    if (budgetMatch) {
      memory.preferences.budgetRange = budgetMatch[0];
    }

    // Extract project interests
    const projectTypes = ['ecommerce', 'landing page', 'app', 'website', 'web', 'blog', 'portfolio'];
    projectTypes.forEach(type => {
      if (content.includes(type) && !memory.preferences.projectInterests.includes(type)) {
        memory.preferences.projectInterests.push(type);
      }
    });

    // Extract preferred communication method
    if (content.includes('whatsapp')) {
      memory.preferences.communicationMethod = 'whatsapp';
    } else if (content.includes('email')) {
      memory.preferences.communicationMethod = 'email';
    } else if (content.includes('phone') || content.includes('teléfono')) {
      memory.preferences.communicationMethod = 'phone';
    }
  }

  // Update conversation statistics
  private updateConversationStats(memory: ConversationMemory): void {
    const stats = memory.conversationStats;
    const messages = memory.conversationHistory;
    
    // Calculate engagement level based on message count and length
    const messageCount = messages.filter(m => m.type === 'user').length;
    const avgMessageLength = messageCount > 0 
      ? messages.filter(m => m.type === 'user').reduce((sum, m) => sum + m.content.length, 0) / messageCount
      : 0;
    
    if (avgMessageLength > 100 && messageCount > 5) {
      stats.engagementLevel = 'high';
    } else if (avgMessageLength > 50 && messageCount > 2) {
      stats.engagementLevel = 'medium';
    } else {
      stats.engagementLevel = 'low';
    }

    // Update most discussed topics
    const keywords = messages.flatMap(m => m.keywords || []);
    const keywordCounts = keywords.reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    stats.mostDiscussedTopics = Object.entries(keywordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([keyword]) => keyword);

    // Calculate conversion probability
    let probability = 0.1; // Base probability
    
    // Positive sentiment increases probability
    if (memory.sentiment.overall.score > 0.5) probability += 0.3;
    else if (memory.sentiment.overall.score > 0) probability += 0.1;
    
    // High engagement increases probability
    if (stats.engagementLevel === 'high') probability += 0.2;
    else if (stats.engagementLevel === 'medium') probability += 0.1;
    
    // Budget discussion increases probability
    if (memory.preferences.budgetRange) probability += 0.2;
    
    // Project type discussion increases probability
    if (memory.preferences.projectInterests.length > 0) probability += 0.15;
    
    stats.conversionProbability = Math.min(0.95, probability);
  }

  // Extract keywords from message content
  private extractKeywords(content: string): string[] {
    const keywords: string[] = [];
    const words = content.toLowerCase().split(/\s+/);
    
    // Define important keywords to track
    const importantKeywords = [
      'website', 'web', 'landing page', 'ecommerce', 'app', 'móvil', 'mobile',
      'precio', 'cost', 'budget', 'presupuesto', 'seo', 'hosting', 'domain',
      'design', 'diseño', 'responsive', 'cms', 'wordpress', 'react', 'nextjs'
    ];
    
    words.forEach(word => {
      if (importantKeywords.some(keyword => keyword.includes(word) || word.includes(keyword))) {
        keywords.push(word);
      }
    });
    
    return [...new Set(keywords)]; // Remove duplicates
  }

  // Get conversation memory for a session
  getMemory(sessionId: string): ConversationMemory | undefined {
    return this.memory.get(sessionId);
  }

  // Get conversation summary for context
  getConversationSummary(sessionId: string): string {
    const memory = this.getMemory(sessionId);
    if (!memory || memory.conversationHistory.length === 0) {
      return '';
    }

    // Get user messages for potential future analysis
    // const userMessages = memory.conversationHistory.filter(m => m.type === 'user');
    const topics = memory.conversationStats.mostDiscussedTopics.join(', ');
    const sentiment = memory.sentiment.overall.label;
    
    return `Previous conversation context:
- Topics discussed: ${topics}
- Client sentiment: ${sentiment}
- Project interests: ${memory.preferences.projectInterests.join(', ')}
- Budget mentioned: ${memory.preferences.budgetRange || 'Not specified'}
- Communication style: ${memory.preferences.preferredCommunicationStyle}
- Engagement level: ${memory.conversationStats.engagementLevel}
- Conversion probability: ${Math.round(memory.conversationStats.conversionProbability * 100)}%`;
  }

  // Check if session is still active
  isSessionActive(sessionId: string): boolean {
    const memory = this.getMemory(sessionId);
    if (!memory) return false;
    
    const timeSinceLastInteraction = Date.now() - memory.lastInteraction.getTime();
    return timeSinceLastInteraction < SESSION_DURATION;
  }

  // Clean up old sessions
  private startCleanupTimer(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [sessionId, memory] of this.memory.entries()) {
        const timeSinceLastInteraction = now - memory.lastInteraction.getTime();
        if (timeSinceLastInteraction > SESSION_DURATION * 3) { // Clean up after 90 days
          this.memory.delete(sessionId);
        }
      }
      this.saveToStorage();
    }, 60 * 60 * 1000); // Check every hour
  }

  // Save to localStorage
  private saveToStorage(): void {
    // Check if we're in the browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    
    try {
      const data = Array.from(this.memory.entries()).map(([, memory]) => ({
        ...memory,
        lastInteraction: memory.lastInteraction.toISOString(),
        sentiment: {
          ...memory.sentiment,
          lastUpdated: memory.sentiment.lastUpdated.toISOString()
        }
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save conversation memory to storage:', error);
    }
  }

  // Load from localStorage
  private loadFromStorage(): void {
    // Check if we're in the browser environment
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        parsed.forEach((item: ConversationMemory & { 
          lastInteraction: string; 
          sentiment: { lastUpdated: string } & Record<string, unknown>
        }) => {
          this.memory.set(item.sessionId, {
            ...item,
            lastInteraction: new Date(item.lastInteraction),
            sentiment: {
              ...item.sentiment,
              lastUpdated: new Date(item.sentiment.lastUpdated)
            }
          });
        });
      }
    } catch (error) {
      console.warn('Failed to load conversation memory from storage:', error);
    }
  }

  // Export conversation data (for analytics)
  exportConversationData(sessionId: string): Record<string, unknown> | null {
    const memory = this.getMemory(sessionId);
    if (!memory) return null;

    return {
      sessionId,
      duration: Date.now() - new Date(memory.conversationHistory[0]?.timestamp || Date.now()).getTime(),
      messageCount: memory.conversationStats.totalMessages,
      sentiment: memory.sentiment,
      topics: memory.conversationStats.mostDiscussedTopics,
      conversionProbability: memory.conversationStats.conversionProbability,
      engagementLevel: memory.conversationStats.engagementLevel,
      preferences: memory.preferences
    };
  }

  // Get conversation history for a session
  getConversationHistory(sessionId: string): Message[] {
    const memory = this.getMemory(sessionId);
    return memory ? memory.conversationHistory : [];
  }

  // Clear conversation memory for a session
  clearMemory(sessionId: string): void {
    this.memory.delete(sessionId);
    this.saveToStorage();
  }
}

// Singleton instance
export const conversationMemory = new ConversationMemoryManager();
