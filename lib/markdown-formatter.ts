import prettier from "prettier";

export class MarkdownFormatter {
  /**
   * Formatta contenuto Markdown ignorando .prettierignore
   */
  static async formatMarkdown(content: string): Promise<string> {
    try {
      const formatted = await prettier.format(content, {
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
