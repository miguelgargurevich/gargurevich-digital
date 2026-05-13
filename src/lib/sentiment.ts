import { SentimentScore, MessageCategory } from '@/types/chat';

// Simple sentiment analysis using keyword-based approach
// In production, you'd want to use a proper NLP API like OpenAI or Google Cloud Natural Language

const SENTIMENT_KEYWORDS = {
  very_positive: [
    'excelente', 'perfecto', 'increíble', 'fantástico', 'maravilloso', 'genial', 'espectacular',
    'excellent', 'perfect', 'amazing', 'fantastic', 'wonderful', 'great', 'spectacular',
    'love', 'amo', 'encanta', 'fascina'
  ],
  positive: [
    'bueno', 'bien', 'me gusta', 'interesante', 'útil', 'helpful', 'good', 'nice', 'like',
    'gracias', 'thank you', 'thanks', 'appreciate', 'agradezco'
  ],
  negative: [
    'malo', 'no me gusta', 'problema', 'error', 'confuso', 'difícil', 'complicado',
    'bad', 'dislike', 'problem', 'issue', 'error', 'confusing', 'difficult', 'complicated',
    'disappointed', 'frustrado', 'molesto'
  ],
  very_negative: [
    'terrible', 'horrible', 'awful', 'hate', 'odio', 'detesto', 'pésimo', 'inaceptable',
    'disgusting', 'worst', 'never', 'nunca más'
  ]
};

const CATEGORY_KEYWORDS = {
  greeting: ['hola', 'hello', 'hi', 'buenos días', 'buenas tardes', 'good morning', 'good afternoon'],
  project_inquiry: ['proyecto', 'project', 'website', 'web', 'sitio', 'aplicación', 'app', 'desarrollo'],
  pricing_question: ['precio', 'cost', 'costo', 'cuánto', 'how much', 'budget', 'presupuesto'],
  technical_question: ['tecnología', 'technology', 'framework', 'database', 'hosting', 'domain'],
  timeline_question: ['tiempo', 'when', 'cuándo', 'deadline', 'entrega', 'delivery'],
  portfolio_request: ['portfolio', 'ejemplos', 'examples', 'trabajos', 'projects', 'obras'],
  contact_info: ['contacto', 'contact', 'email', 'teléfono', 'phone', 'WhatsApp'],
  complaint: ['queja', 'complaint', 'problema', 'issue', 'error', 'bug'],
  compliment: ['felicidades', 'congratulations', 'excelente trabajo', 'great work']
};

export function analyzeSentiment(text: string): SentimentScore {
  const lowerText = text.toLowerCase();
  let score = 0;
  let totalMatches = 0;
  const foundKeywords: string[] = [];

  // Check for sentiment keywords
  Object.entries(SENTIMENT_KEYWORDS).forEach(([sentiment, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
        totalMatches++;
        
        switch (sentiment) {
          case 'very_positive':
            score += 1;
            break;
          case 'positive':
            score += 0.5;
            break;
          case 'negative':
            score -= 0.5;
            break;
          case 'very_negative':
            score -= 1;
            break;
        }
      }
    });
  });

  // Normalize score
  const normalizedScore = totalMatches > 0 ? Math.max(-1, Math.min(1, score / totalMatches)) : 0;
  
  // Determine label
  let label: SentimentScore['label'];
  if (normalizedScore >= 0.6) label = 'very_positive';
  else if (normalizedScore >= 0.2) label = 'positive';
  else if (normalizedScore >= -0.2) label = 'neutral';
  else if (normalizedScore >= -0.6) label = 'negative';
  else label = 'very_negative';

  // Calculate confidence based on number of matches and score magnitude
  const confidence = Math.min(1, (totalMatches * 0.3) + Math.abs(normalizedScore) * 0.7);

  return {
    score: normalizedScore,
    label,
    confidence,
    keywords: foundKeywords
  };
}

export function categorizeMessage(text: string): MessageCategory {
  const lowerText = text.toLowerCase();
  let maxMatches = 0;
  let category: MessageCategory = 'other';

  Object.entries(CATEGORY_KEYWORDS).forEach(([cat, keywords]) => {
    const matches = keywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    ).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      category = cat as MessageCategory;
    }
  });

  return category;
}

export function generatePersonalizedResponse(
  sentiment: SentimentScore
): string {
  // This would integrate with your AI API to generate more personalized responses
  // For now, we'll return suggestions for tone adjustment
  
  let toneAdjustment = '';
  
  switch (sentiment.label) {
    case 'very_negative':
    case 'negative':
      toneAdjustment = 'Use empathetic and solution-focused language. Acknowledge concerns and offer specific help.';
      break;
    case 'very_positive':
    case 'positive':
      toneAdjustment = 'Match the enthusiasm. Use encouraging language and show appreciation for their interest.';
      break;
    default:
      toneAdjustment = 'Maintain professional and helpful tone.';
  }

  return toneAdjustment;
}

// Advanced sentiment analysis using context and conversation history
export function analyzeConversationSentiment(messages: Array<{ type: string; content: string }>): {
  trend: 'improving' | 'declining' | 'stable';
  overall: SentimentScore;
  recentTrend: number[];
} {
  if (messages.length === 0) {
    return {
      trend: 'stable',
      overall: { score: 0, label: 'neutral', confidence: 0, keywords: [] },
      recentTrend: []
    };
  }

  const sentiments = messages
    .filter(m => m.type === 'user')
    .map(m => analyzeSentiment(m.content));

  // Calculate overall sentiment
  const avgScore = sentiments.reduce((sum, s) => sum + s.score, 0) / sentiments.length;
  const overall = {
    score: avgScore,
    label: avgScore >= 0.6 ? 'very_positive' as const :
           avgScore >= 0.2 ? 'positive' as const :
           avgScore >= -0.2 ? 'neutral' as const :
           avgScore >= -0.6 ? 'negative' as const : 'very_negative' as const,
    confidence: sentiments.reduce((sum, s) => sum + s.confidence, 0) / sentiments.length,
    keywords: sentiments.flatMap(s => s.keywords)
  };

  // Analyze trend (last 5 messages vs first 5 messages)
  const recentTrend = sentiments.slice(-3).map(s => s.score);
  const earlyScores = sentiments.slice(0, 3).map(s => s.score);
  
  const recentAvg = recentTrend.reduce((sum, score) => sum + score, 0) / recentTrend.length;
  const earlyAvg = earlyScores.reduce((sum, score) => sum + score, 0) / earlyScores.length;
  
  const trendDiff = recentAvg - earlyAvg;
  const trend = trendDiff > 0.1 ? 'improving' : trendDiff < -0.1 ? 'declining' : 'stable';

  return { trend, overall, recentTrend };
}
