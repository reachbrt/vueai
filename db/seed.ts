import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    console.log("Seeding database...");

    // Seed packages data
    const packagesData = [
      {
        name: "@vueai/chatbot",
        version: "1.0.0-beta",
        description: "AI-powered chat components for Vue.js",
        stars: 286,
        status: "beta"
      },
      {
        name: "@vueai/autosuggest",
        version: "1.0.0-beta",
        description: "AI-powered suggestion components for Vue.js",
        stars: 243,
        status: "beta"
      },
      {
        name: "@vueai/smartform",
        version: "1.0.0-beta",
        description: "AI-powered form validation for Vue.js",
        stars: 215,
        status: "beta"
      },
      {
        name: "@vueai/core",
        version: "1.0.0-beta",
        description: "Core AI functionality for Vue.js components",
        stars: 312,
        status: "beta"
      }
    ];

    // Check if packages already exist
    const existingPackages = await db.query.packages.findMany();
    if (existingPackages.length === 0) {
      console.log("Seeding packages data...");
      for (const pkg of packagesData) {
        await db.insert(schema.packages).values(pkg);
      }
    } else {
      console.log("Packages data already exists, skipping...");
    }

    // Seed providers data
    const providersData = [
      {
        name: "OpenAI",
        baseUrl: "https://api.openai.com/v1",
        models: ["gpt-4o", "gpt-3.5-turbo"],
        description: "OpenAI API provider for GPT models",
        active: true
      },
      {
        name: "Anthropic Claude",
        baseUrl: "https://api.anthropic.com/v1",
        models: ["claude-3-7-sonnet-20250219", "claude-3-haiku"],
        description: "Anthropic API provider for Claude models",
        active: true
      }
    ];

    // Check if providers already exist
    const existingProviders = await db.query.providers.findMany();
    if (existingProviders.length === 0) {
      console.log("Seeding providers data...");
      for (const provider of providersData) {
        await db.insert(schema.providers).values(provider);
      }
    } else {
      console.log("Providers data already exists, skipping...");
    }

    console.log("Seeding completed");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
