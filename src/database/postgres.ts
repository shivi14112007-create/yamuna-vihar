import path from 'path';
import fs from 'fs';
import { PGlite } from '@electric-sql/pglite';
import pg from 'pg';
import { tryConnectMongo, isMongoActive } from './mongo.ts';

export interface QueryResult<T = any> {
  rows: T[];
  rowCount?: number;
}

export interface DatabaseClient {
  query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
  exec(sql: string): Promise<void>;
}

let dbInstance: DatabaseClient | null = null;
let dbType: 'remote_postgres' | 'remote_mongodb' | 'embedded_postgres' = 'embedded_postgres';

export async function getDatabaseClient(): Promise<DatabaseClient> {
  if (dbInstance) {
    return dbInstance;
  }

  const rawUrl = (process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL || '').trim();

  // 1. Check for MongoDB Atlas connection
  if (rawUrl.startsWith('mongodb://') || rawUrl.startsWith('mongodb+srv://')) {
    console.log('MongoDB Atlas URI detected in environment...');
    const connected = await tryConnectMongo(rawUrl);
    if (connected) {
      dbType = 'remote_mongodb';
      console.log('Successfully active on MongoDB Atlas.');
    } else {
      console.log('MongoDB Atlas: External cluster unreachable from current network or IP whitelist required (add 0.0.0.0/0 in MongoDB Atlas Network Access). Safely utilizing persistent storage.');
    }
  }

  // 2. Check for remote PostgreSQL / Supabase connection
  if (rawUrl.startsWith('postgres://') || rawUrl.startsWith('postgresql://')) {
    if (!rawUrl.includes('localhost:5432/yamuna_pledge')) {
      try {
        console.log('Connecting to external PostgreSQL / Supabase database...');
        const pool = new pg.Pool({
          connectionString: rawUrl,
          ssl: rawUrl.includes('localhost') ? false : { rejectUnauthorized: false },
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        });

        const testRes = await pool.query('SELECT 1 as connected');
        if (testRes.rows.length > 0) {
          console.log('Successfully connected to external PostgreSQL / Supabase cluster.');
          dbType = 'remote_postgres';
          dbInstance = {
            async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
              const res = await pool.query(sql, params);
              return {
                rows: res.rows,
                rowCount: res.rowCount ?? res.rows.length
              };
            },
            async exec(sql: string): Promise<void> {
              await pool.query(sql);
            }
          };
          return dbInstance;
        }
      } catch (err: any) {
        console.log('External PostgreSQL connection notice:', err?.message || err);
      }
    }
  }

  // 3. Persistent Embedded PostgreSQL (PGlite)
  const dataDir = path.resolve(process.cwd(), 'data/postgres_db');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`Persistent database active at ${dataDir}`);
  const pglite = new PGlite(dataDir);
  dbType = isMongoActive() ? 'remote_mongodb' : 'embedded_postgres';

  dbInstance = {
    async query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>> {
      const res = await pglite.query<T>(sql, params);
      const rowCount = (res as any).affectedRows ?? res.rows.length;
      return {
        rows: res.rows,
        rowCount
      };
    },
    async exec(sql: string): Promise<void> {
      await pglite.exec(sql);
    }
  };

  return dbInstance;
}

export function getDatabaseType(): string {
  return dbType;
}
