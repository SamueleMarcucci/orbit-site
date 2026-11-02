import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  { ignores: [".events-private/**", ".event-assets/**", ".generated/**", ".wrangler/**", "worker-configuration.d.ts"] },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
