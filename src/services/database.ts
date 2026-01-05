import * as SQLite from 'expo-sqlite';

export interface MemeRow {
    id: number;
    uri: string;
    prompt: string;
    created_at: string;
}

class DatabaseService {
    private db: SQLite.SQLiteDatabase | null = null;

    async init() {
        if (this.db) return;

        this.db = await SQLite.openDatabaseAsync('memes.db');

        await this.db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS memes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uri TEXT NOT NULL,
        prompt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
    }

    async setSetting(key: string, value: string) {
        await this.init();
        await this.db!.runAsync(
            'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            key,
            value
        );
    }

    async getSetting(key: string): Promise<string | null> {
        await this.init();
        const row = await this.db!.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', key);
        return row ? row.value : null;
    }

    async saveMeme(uri: string, prompt: string): Promise<number> {
        await this.init();
        const result = await this.db!.runAsync(
            'INSERT INTO memes (uri, prompt) VALUES (?, ?)',
            uri,
            prompt
        );
        return result.lastInsertRowId;
    }

    async getMemes(): Promise<MemeRow[]> {
        await this.init();
        const rows = await this.db!.getAllAsync<MemeRow>('SELECT * FROM memes ORDER BY created_at DESC');
        return rows;
    }

    async deleteMeme(id: number) {
        await this.init();
        await this.db!.runAsync('DELETE FROM memes WHERE id = ?', id);
    }
}

export const dbService = new DatabaseService();
