/**
 * Unified topic extractor for hackathons
 * Provides consistent topic parsing across all data sources
 */

import type { HackathonTopic } from "@/lib/constants/topics";

export interface TopicConfig {
  name: HackathonTopic;
  keywords: string[];
  priority: number; // Higher priority topics will be preferred in case of conflicts
  pattern?: RegExp; // Pre-compiled regex pattern for performance
}

// Centralized topic configuration
export const TOPIC_CONFIGS: TopicConfig[] = [
  {
    name: "AI",
    keywords: [
      "ai",
      "artificial intelligence",
      "machine learning",
      "ml model",
      "ml algorithm",
      "neural network",
      "deep learning",
      "llm",
      "large language model",
      "gpt",
      "chatgpt",
      "openai",
      "vibe coding",
      "agent",
      "agents",
      "ai agent",
      "ai agents",
      "computer vision",
      "cv",
      "nlp",
      "natural language processing",
      "tensorflow",
      "pytorch",
      "transformers",
      "generative ai",
      "ai model",
      "ai algorithm",
      "predictive analytics",
    ],
    priority: 10,
  },
  {
    name: "Crypto",
    keywords: [
      "crypto",
      "cryptocurrency",
      "blockchain",
      "bitcoin",
      "ethereum",
      "defi",
      "nft",
      "web3",
      "smart contract",
      "solidity",
      "token",
      "dao",
      "dapp",
      "polygon",
      "solana",
      "cardano",
      "binance",
    ],
    priority: 9,
  },
  {
    name: "Web3",
    keywords: [
      "web3",
      "dapp",
      "decentralized",
      "ipfs",
      "metamask",
      "wallet",
      "consensus",
      "proof of stake",
      "proof of work",
      "layer 2",
    ],
    priority: 8,
  },
  {
    name: "Fintech",
    keywords: [
      "fintech",
      "finance",
      "banking",
      "payment",
      "financial",
      "trading",
      "investment",
      "insurance",
      "lending",
      "neobank",
      "digital payment",
      "mobile banking",
      "regtech",
    ],
    priority: 7,
  },
  {
    name: "Healthcare",
    keywords: [
      "health",
      "healthcare",
      "medical",
      "biotech",
      "pharma",
      "telemedicine",
      "medtech",
      "digital health",
      "wellness",
      "diagnostics",
      "therapeutics",
      "clinical",
      "patient",
    ],
    priority: 6,
  },
  {
    name: "Sustainability",
    keywords: [
      "climate",
      "sustainability",
      "green",
      "environment",
      "renewable",
      "carbon",
      "energy",
      "solar",
      "wind",
      "cleantech",
      "esg",
      "circular economy",
      "sustainable",
      "eco",
    ],
    priority: 5,
  },
  {
    name: "Gaming",
    keywords: [
      "game dev",
      "gamedev",
      "game development",
      "unity engine",
      "unreal engine",
      "metaverse",
      "vr gaming",
      "virtual reality gaming",
      "ar gaming",
      "augmented reality gaming",
      "esports",
      "mobile game",
      "indie game",
      "steam",
      "game studio",
      "video game",
      "gaming platform",
    ],
    priority: 4,
  },
  {
    name: "Defense",
    keywords: [
      "defense",
      "defence",
      "military",
      "security",
      "aerospace",
      "drone",
      "surveillance",
      "intel",
    ],
    priority: 3,
  },
  {
    name: "IoT",
    keywords: [
      "iot",
      "internet of things",
      "embedded",
      "sensors",
      "hardware",
      "raspberry pi",
      "arduino",
      "microcontroller",
      "edge computing",
    ],
    priority: 2,
  },
  {
    name: "Education",
    keywords: [
      "education technology",
      "edtech",
      "e-learning",
      "online learning",
      "educational platform",
      "learning management",
      "student portal",
      "course platform",
      "tutorial platform",
      "skill development",
      "certification platform",
      "university tech",
      "academic platform",
      "digital classroom",
      "remote learning",
    ],
    priority: 1,
  },
];

export class TopicExtractor {
  private readonly configs: TopicConfig[];
  private readonly compiledPatterns: Array<{
    name: HackathonTopic;
    priority: number;
    pattern: RegExp;
  }>;
  private readonly maxTopics: number;

  constructor(configs: TopicConfig[] = TOPIC_CONFIGS, maxTopics: number = 5) {
    this.configs = configs.sort((a, b) => b.priority - a.priority);
    this.maxTopics = maxTopics;

    // Compile regex patterns for each config
    this.compiledPatterns = this.configs.map((config) => ({
      name: config.name,
      priority: config.priority,
      pattern: new RegExp(
        `\\b(${config.keywords.join("|").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`,
        "gi",
      ),
    }));
  }

  /**
   * Extract topics from hackathon text content (OPTIMIZED with pre-compiled regex)
   * @param name Hackathon name
   * @param description Optional description text
   * @param additionalText Any additional text to analyze
   * @returns Array of topic names
   */
  extractTopics(
    name: string,
    description?: string,
    additionalText?: string,
  ): HackathonTopic[] {
    const combinedText = [name, description, additionalText]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const foundTopics: {
      name: HackathonTopic;
      priority: number;
      matchCount: number;
    }[] = [];

    // Use pre-compiled regex patterns for performance
    for (const pattern of this.compiledPatterns) {
      const matches = combinedText.match(pattern.pattern);
      const matchCount = matches ? matches.length : 0;

      if (matchCount > 0) {
        foundTopics.push({
          name: pattern.name,
          priority: pattern.priority,
          matchCount,
        });
      }
    }

    // Sort by priority first, then by match count
    foundTopics.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.matchCount - a.matchCount;
    });

    // Return up to maxTopics unique topics
    return foundTopics.slice(0, this.maxTopics).map((topic) => topic.name);
  }

  /**
   * Get all available topic names
   */
  getAllTopics(): HackathonTopic[] {
    return this.configs.map((config) => config.name);
  }

  /**
   * Check if a topic exists in the configuration
   */
  isValidTopic(topicName: string): topicName is HackathonTopic {
    return this.configs.some((config) => config.name === topicName);
  }

  /**
   * Get topic configuration by name
   */
  getTopicConfig(topicName: string): TopicConfig | undefined {
    return this.configs.find((config) => config.name === topicName);
  }

  /**
   * Add or update a topic configuration
   */
  addTopicConfig(config: TopicConfig): void {
    const existingIndex = this.configs.findIndex((c) => c.name === config.name);
    if (existingIndex >= 0) {
      this.configs[existingIndex] = config;
    } else {
      this.configs.push(config);
    }
    // Re-sort by priority
    this.configs.sort((a, b) => b.priority - a.priority);
  }
}

// Default instance for easy usage
export const defaultTopicExtractor = new TopicExtractor();

/**
 * Convenience function for quick topic extraction
 */
export function extractTopics(
  name: string,
  description?: string,
  additionalText?: string,
): HackathonTopic[] {
  return defaultTopicExtractor.extractTopics(name, description, additionalText);
}
