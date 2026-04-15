/**
 * Excepções por contexto de chamada (`callSiteExceptions`) — issue #6 / contrato 1.6.x.
 */
import { RuleTester } from "eslint";
import { test } from "node:test";
import hardcodeDetect from "../dist/index.js";

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module" },
});

test("no-hardcoded-strings — callSiteExceptions", () => {
  ruleTester.run(
    "no-hardcoded-strings",
    hardcodeDetect.rules["no-hardcoded-strings"],
    {
      valid: [
        {
          code: 'console.log("ok");',
          options: [{ callSiteExceptions: ["console.log"] }],
        },
        {
          code: 'debug("xx");',
          options: [{ callSiteExceptions: ["debug"] }],
        },
        {
          code: 'this.logger.warn("hi");',
          options: [{ callSiteExceptions: ["this.logger.warn"] }],
        },
        {
          code: 'console?.log("optional");',
          options: [{ callSiteExceptions: ["console.log"] }],
        },
      ],
      invalid: [
        {
          code: 'console.log("ok");',
          errors: [{ messageId: "hardcoded" }],
        },
        {
          code: 'console.log("aa", "bb");',
          options: [{ callSiteExceptions: ["console.log"] }],
          errors: [{ messageId: "hardcoded" }],
        },
        {
          code: 'console.log(process.env.X ?? "fb");',
          options: [
            { callSiteExceptions: ["console.log"], remediationMode: "off" },
          ],
          errors: [{ messageId: "hardcoded" }],
        },
      ],
    },
  );
});
