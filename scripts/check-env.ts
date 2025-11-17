import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env") });

console.log("Environment Variables Check:");
console.log("==========================");

// Check required environment variables
const requiredEnvVars = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "NEXT_PUBLIC_APP_URL"
];

let missingVars = [];

for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    console.log(`✓ ${envVar}: Set`);
  } else {
    console.log(`✗ ${envVar}: Missing`);
    missingVars.push(envVar);
  }
}

// Check optional environment variables
const optionalEnvVars = [
  "DISCORD_WEBHOOK_URL"
];

console.log("\nOptional Environment Variables:");
console.log("===============================");

for (const envVar of optionalEnvVars) {
  if (process.env[envVar]) {
    console.log(`✓ ${envVar}: Set`);
  } else {
    console.log(`○ ${envVar}: Not set (optional)`);
  }
}

console.log("\nSummary:");
console.log("========");
if (missingVars.length === 0) {
  console.log("✓ All required environment variables are set!");
} else {
  console.log(`✗ Missing ${missingVars.length} required environment variable(s):`);
  for (const missingVar of missingVars) {
    console.log(`  - ${missingVar}`);
  }
  process.exit(1);
}