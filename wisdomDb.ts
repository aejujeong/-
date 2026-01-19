
/**
 * [Wisdom Engine v7 - Multi-Table SQLite Architecture]
 * bible.db를 기반으로 buddha, sage 테이블을 동적으로 생성하고 데이터를 동기화합니다.
 */

export interface Verse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  content: string;
}

class WisdomDatabase {
  private db: any = null;
  private isInitialized = false;

  /**
   * SQLite WASM 엔진 초기화 및 테이블/데이터 동기화
   */
  async initialize() {
    if (this.isInitialized) return;
    try {
      // Access global initSqlJs loaded via script tag to avoid fs.readFileSync errors
      const initSqlJs = (window as any).initSqlJs;
      if (!initSqlJs) {
        throw new Error("sql.js WASM loader not found. Ensure script tag is present in index.html");
      }

      const SQL = await initSqlJs({
        locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
      });

      const response = await fetch('assets/bible.db');
      let dbData: Uint8Array;

      if (response.ok) {
        const buf = await response.arrayBuffer();
        dbData = new Uint8Array(buf);
      } else {
        // DB 파일이 없는 경우 빈 DB로 시작
        dbData = new Uint8Array();
      }
      
      this.db = new SQL.Database(dbData);
      
      // 1. 테이블 구조 생성 (bible, buddha, sage)
      this.ensureTablesExist();
      
      // 2. 외부 데이터 소스(JSON)로부터 데이터 동기화
      await this.syncFromLocalSource();

      this.isInitialized = true;
      console.log("Wisdom Engine: Multi-Table SQLite Ready.");
    } catch (e) {
      console.error("Wisdom Engine Initialization Failed:", e);
    }
  }

  private ensureTablesExist() {
    const schema = `
      CREATE TABLE IF NOT EXISTS bible (id INTEGER PRIMARY KEY, book TEXT, chapter INTEGER, verse INTEGER, content TEXT);
      CREATE TABLE IF NOT EXISTS buddha (id INTEGER PRIMARY KEY, book TEXT, chapter INTEGER, verse INTEGER, content TEXT);
      CREATE TABLE IF NOT EXISTS sage (id INTEGER PRIMARY KEY, book TEXT, chapter INTEGER, verse INTEGER, content TEXT);
    `;
    this.db.run(schema);
  }

  private async syncFromLocalSource() {
    try {
      const response = await fetch('assets/bible_buddha.json');
      const data = await response.json();
      
      this.db.run("BEGIN TRANSACTION;");
      
      // 각 카테고리별 데이터 주입
      const tables = ['bible', 'buddha', 'sage'];
      
      for (const table of tables) {
        const categoryData = data[table];
        if (!categoryData) continue;

        for (const [book, chapters] of Object.entries(categoryData)) {
          for (const [chapter, content] of Object.entries(chapters as any)) {
            const chNum = parseInt(chapter.replace(/[^0-9]/g, ''));
            // 이미 데이터가 있는지 확인 후 없으면 주입
            const check = this.db.prepare(`SELECT count(*) FROM ${table} WHERE book=? AND chapter=?`);
            check.bind([book, chNum]);
            check.step();
            if (check.get()[0] === 0) {
              this.db.run(`INSERT INTO ${table} (book, chapter, verse, content) VALUES (?, ?, ?, ?)`, [book, chNum, 1, content]);
            }
            check.free();
          }
        }
      }
      
      this.db.run("COMMIT;");
    } catch (e) {
      console.error("Sync Error:", e);
    }
  }

  /**
   * [동적 테이블 쿼리] 요청된 테이블에서 본문을 추출합니다.
   */
  getChapterContent(tableName: string, bookName: string, chapterName: string): string | null {
    if (!this.db) return null;

    try {
      const chapterNum = parseInt(chapterName.replace(/[^0-9]/g, ''));
      
      // 유효한 테이블 이름인지 검증 (SQL Injection 방지)
      const validTables = ['bible', 'buddha', 'sage'];
      const table = validTables.includes(tableName) ? tableName : 'bible';

      const stmt = this.db.prepare(`SELECT content FROM ${table} WHERE book=:book AND chapter=:chapter ORDER BY verse ASC`);
      stmt.bind({ ":book": bookName, ":chapter": chapterNum });
      
      let fullContent = "";
      while (stmt.step()) {
        const row = stmt.get();
        fullContent += row[0] + "\n";
      }
      stmt.free();

      return fullContent.trim() || null;
    } catch (e) {
      console.error("SQL Query Error:", e);
      return null;
    }
  }

  searchVerses(query: string): Verse[] {
    if (!this.db) return [];
    try {
      const results: Verse[] = [];
      // 모든 테이블에서 통합 검색
      const tables = ['bible', 'buddha', 'sage'];
      for (const table of tables) {
        const stmt = this.db.prepare(`SELECT id, book, chapter, verse, content FROM ${table} WHERE content LIKE :query LIMIT 20`);
        stmt.bind({ ":query": `%${query}%` });
        while (stmt.step()) {
          const [id, book, chapter, verse, content] = stmt.get();
          results.push({ id, book, chapter, verse, content });
        }
        stmt.free();
      }
      return results;
    } catch (e) {
      return [];
    }
  }
}

export const wisdomDb = new WisdomDatabase();
