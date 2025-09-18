/**
 * Utility per il processing in chunk e l'ottimizzazione della memoria
 * Riduce il picco di memoria utilizzato durante l'elaborazione di grandi dataset
 */

export class MemoryOptimizer {
  /**
   * Processa un array in chunk per evitare il sovraccarico di memoria
   * @param data Array di dati da processare
   * @param processor Funzione per processare ogni chunk
   * @param chunkSize Dimensione di ogni chunk (default: 50)
   * @returns Array di risultati
   */
  static async processInChunks<T, R>(
    data: T[],
    processor: (chunk: T[]) => Promise<R[]>,
    chunkSize: number = 50,
  ): Promise<R[]> {
    const results: R[] = [];

    console.log(`Processing ${data.length} items in chunks of ${chunkSize}...`);

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const chunkResults = await processor(chunk);
      results.push(...chunkResults);

      // Log progress
      const progress = Math.min(i + chunkSize, data.length);
      console.log(`Processed ${progress}/${data.length} items`);

      // Allow garbage collection every 200 items
      if (i % 200 === 0 && i > 0) {
        await this.allowGarbageCollection();
      }
    }

    console.log(`Chunk processing completed: ${results.length} results`);
    return results;
  }

  /**
   * Processa un array sequenzialmente con controllo della memoria
   * @param data Array di dati da processare
   * @param processor Funzione per processare ogni item
   * @param gcInterval Intervallo per permettere garbage collection (default: 100)
   * @returns Array di risultati
   */
  static async processSequentially<T, R>(
    data: T[],
    processor: (item: T, index: number) => Promise<R>,
    gcInterval: number = 100,
  ): Promise<R[]> {
    const results: R[] = [];

    console.log(`Processing ${data.length} items sequentially...`);

    for (let i = 0; i < data.length; i++) {
      const result = await processor(data[i], i);
      results.push(result);

      // Allow garbage collection at intervals
      if (i % gcInterval === 0 && i > 0) {
        console.log(`Processed ${i}/${data.length} items, allowing GC...`);
        await this.allowGarbageCollection();
      }
    }

    console.log(`Sequential processing completed: ${results.length} results`);
    return results;
  }

  /**
   * Permette al garbage collector di lavorare
   */
  static async allowGarbageCollection(): Promise<void> {
    return new Promise((resolve) => {
      setImmediate(() => {
        // Force garbage collection if available (Node.js with --expose-gc flag)
        if (global.gc) {
          global.gc();
        }
        resolve();
      });
    });
  }

  /**
   * Ottimizza l'uso della memoria per grandi oggetti JSON
   * @param obj Oggetto da serializzare
   * @returns Stringa JSON ottimizzata
   */
  static optimizeJSONStringify(obj: Record<string, unknown>): string {
    // Use streaming JSON stringify for large objects
    return JSON.stringify(obj, (key, value) => {
      // Remove undefined values to reduce size
      if (value === undefined) {
        return null;
      }
      return value;
    });
  }

  /**
   * Monitora l'uso della memoria
   * @returns Informazioni sull'uso della memoria
   */
  static getMemoryUsage(): {
    used: string;
    total: string;
    percentage: number;
  } {
    if (typeof process !== "undefined" && process.memoryUsage) {
      const usage = process.memoryUsage();
      const used = Math.round(usage.heapUsed / 1024 / 1024);
      const total = Math.round(usage.heapTotal / 1024 / 1024);
      const percentage = Math.round((usage.heapUsed / usage.heapTotal) * 100);

      return {
        used: `${used} MB`,
        total: `${total} MB`,
        percentage,
      };
    }

    return {
      used: "Unknown",
      total: "Unknown",
      percentage: 0,
    };
  }

  /**
   * Log dell'uso della memoria
   * @param label Etichetta per il log
   */
  static logMemoryUsage(label: string = "Memory Usage"): void {
    const usage = this.getMemoryUsage();
    console.log(
      `${label}: ${usage.used}/${usage.total} (${usage.percentage}%)`,
    );
  }
}
