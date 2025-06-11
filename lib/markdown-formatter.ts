import prettier from "prettier";
import path from "path";

export class MarkdownFormatter {
  /**
   * Formatta contenuto Markdown ignorando .prettierignore
   */
  static async formatMarkdown(content: string): Promise<string> {
    try {
      // Risolve la configurazione dal progetto
      const configPath = path.join(process.cwd(), ".prettierrc");
      const prettierConfig = (await prettier.resolveConfig(configPath)) || {};

      const formatted = await prettier.format(content, {
        ...prettierConfig,
        parser: "markdown",
        // Configurazioni specifiche per il README
        printWidth: 120,
        proseWrap: "preserve",
        tabWidth: 2,
        useTabs: false,
        // Mantieni le tabelle intatte
        htmlWhitespaceSensitivity: "ignore",
      });

      return formatted;
    } catch (error) {
      console.warn("Prettier formatting failed:", error);
      return content;
    }
  }
}
