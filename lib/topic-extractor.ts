/**
 * Unified topic extractor for hackathons
 * Provides consistent topic parsing across all data sources
 */

import type { HackathonTopic } from "@/lib/constants/topics";

export interface TopicConfig {
  name: HackathonTopic;
  keywords: string[];
  priority: number; // Higher priority topics will be preferred in case of conflicts
}

// Centralized topic configuration
export const TOPIC_CONFIGS: TopicConfig[] = [
  {
    name: "AI",
    keywords: [
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
      "cybersecurity",
      "cyber",
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
  private readonly maxTopics: number;

  constructor(configs: TopicConfig[] = TOPIC_CONFIGS, maxTopics: number = 5) {
    this.configs = configs.sort((a, b) => b.priority - a.priority);
    this.maxTopics = maxTopics;
  }

  /**
   * Extract topics from hackathon text content
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

    for (const config of this.configs) {
      const matches = config.keywords.filter((keyword) =>
        combinedText.includes(keyword),
      );

      if (matches.length > 0) {
        foundTopics.push({
          name: config.name,
          priority: config.priority,
          matchCount: matches.length,
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
