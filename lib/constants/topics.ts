/**
 * Standardized topics for hackathons
 * This file provides a single source of truth for all topics used across the application
 */

export const HACKATHON_TOPICS = [
  "AI",
  "Crypto",
  "Web3",
  "Fintech",
  "Healthcare",
  "Sustainability",
  "Gaming",
  "Defense",
  "IoT",
  "Education",
] as const;

export type HackathonTopic = (typeof HACKATHON_TOPICS)[number];

// Topic display configurations for the frontend
export const TOPIC_DISPLAY_CONFIG: Record<
  HackathonTopic,
  {
    label: string;
    color: string;
    description: string;
  }
> = {
  AI: {
    label: "AI & ML",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    description: "Artificial Intelligence and Machine Learning",
  },
  Crypto: {
    label: "Crypto",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    description: "Cryptocurrency and Blockchain",
  },
  Web3: {
    label: "Web3",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    description: "Decentralized Web Technologies",
  },
  Fintech: {
    label: "Fintech",
    color: "bg-green-100 text-green-800 border-green-200",
    description: "Financial Technology",
  },
  Healthcare: {
    label: "Healthcare",
    color: "bg-red-100 text-red-800 border-red-200",
    description: "Medical and Health Technology",
  },
  Sustainability: {
    label: "Climate",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description: "Climate and Sustainability",
  },
  Gaming: {
    label: "Gaming",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    description: "Game Development and Metaverse",
  },
  Defense: {
    label: "Defense",
    color: "bg-slate-100 text-slate-800 border-slate-200",
    description: "Defense and Security",
  },
  IoT: {
    label: "IoT",
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    description: "Internet of Things and Hardware",
  },
  Education: {
    label: "Education",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    description: "Educational Technology",
  },
};

/**
 * Get display configuration for a topic
 */
export function getTopicDisplay(topic: string) {
  return (
    TOPIC_DISPLAY_CONFIG[topic as HackathonTopic] || {
      label: topic,
      color: "bg-gray-100 text-gray-800 border-gray-200",
      description: topic,
    }
  );
}

/**
 * Check if a topic is valid
 */
export function isValidTopic(topic: string): topic is HackathonTopic {
  return HACKATHON_TOPICS.includes(topic as HackathonTopic);
}
