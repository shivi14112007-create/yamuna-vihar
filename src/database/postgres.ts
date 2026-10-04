import path from 'path';
import fs from 'fs';
import dns from 'dns';
import pg from 'pg';

// Prioritize IPv4 resolution in Node.js to prevent IPv6 ENETUNREACH on platforms without IPv6 egress (e.g., Render)
try {
  if (dns && typeof (dns as any).setDefaultResultOrder === 'function') {
    (dns as any).setDefaultResultOrder('ipv4first');
  }
} catch {
  // Gracefully continue if not supported
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount?: number;
}

export interface DatabaseClient {
  query<T = any>(sql: string, params?: any[]): Promise<QueryResult<T>>;
  exec(sql: string): Promise<void>;
}

let dbInstance: DatabaseClient | null = null;
let dbType: 'remote_postgres' | 'embedded_postgres' = 'embedded_postgres';

export async function getDatabaseClient(): Promise<DatabaseClient> {
  if (dbInstance) {
    return dbInstance;
  }

  const isProd = process.env.NODE_ENV === 'production';
  const rawUrl = (process.env.DATABASE_URL || process.env.SUPABASE_DB_URL || process.env.POSTGRES_URL || '').trim();

  // =========================================================================
  // PRODUCTION ENVIRONMENT: Strictly external PostgreSQL / Supabase
  // =========================================================================
  if (isProd) {
    if (!rawUrl) {
      throw new Error(
        '[FATAL] Production database configuration error: DATABASE_URL or SUPABASE_DB_URL must be provided. ' +
        'Embedded PGlite is disabled in production to protect memory limits.'
      );
    }

    console.log('Production mode: Connecting to external PostgreSQL / Supabase cluster...');

    const pool = new pg.Pool({
      connectionString: rawUrl,
      ssl: rawUrl.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 3, // Reduced max pool connections to respect Render 512MB RAM constraints
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000, // 5s connection timeout
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err);
    });

    try {
      const testRes = await pool.query('SELECT 1 as connected');
      if (testRes.rows.length > 0) {
        console.log('✓ Successfully connected to production PostgreSQL / Supabase cluster (Pool size: 3, Timeout: 5000ms).');
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
      console.error('[FATAL] External PostgreSQL connection failed in production:', err);

      if (err?.code === 'ENETUNREACH' || err?.message?.includes('ENETUNREACH')) {
        console.error(
          '\n================================================================================\n' +
          '[SUPABASE IPV6 WARNING - ENETUNREACH]\n' +
          'Render and similar hosts lack IPv6 outbound networking. Direct Supabase endpoints\n' +
          '(db.[ref].supabase.co:5432) resolve to IPv6 only and will fail with ENETUNREACH.\n' +
          '\n' +
          'SOLUTION:\n' +
          '1. In Supabase Dashboard -> Project Settings -> Database -> Connection string\n' +
          '2. Select "Shared Pooler" (Supavisor) in Session Mode (Port 6543) or Transaction Mode (Port 5432)\n' +
          '3. Use the pooler endpoint: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres\n' +
          '   which resolves to IPv4 addresses supported by Render.\n' +
          '================================================================================\n'
        );
      }

      // Strictly fail startup in production; DO NOT fall back to PGlite!
      throw new Error(`Production database connection failed: ${err?.message || err}. Embedded PGlite fallback is disabled in production.`);
    }
  }

  // =========================================================================
  // LOCAL DEVELOPMENT ENVIRONMENT ONLY
  // =========================================================================
  if (rawUrl && (rawUrl.startsWith('postgres://') || rawUrl.startsWith('postgresql://')) && !rawUrl.includes('localhost:5432/yamuna_pledge')) {
    try {
      console.log('Development mode: Connecting to configured PostgreSQL database...');
      const pool = new pg.Pool({
        connectionString: rawUrl,
        ssl: rawUrl.includes('localhost') ? false : { rejectUnauthorized: false },
        max: 3,
        idleTimeoutMillis: 10000,
        connectionTimeoutMillis: 5000,
      });

      const testRes = await pool.query('SELECT 1 as connected');
      if (testRes.rows.length > 0) {
        console.log('✓ Successfully connected to development PostgreSQL cluster.');
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
      console.log('Development PostgreSQL connection notice:', err?.message || err);
      console.log('Falling back to local development PGlite database...');
    }
  }

  // Local development PGlite fallback (only reachable in development when no remote DB is available)
  const { PGlite } = await import('@electric-sql/pglite');
  const dataDir = path.resolve(process.cwd(), 'data/postgres_db');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`Local development embedded database active at ${dataDir}`);
  const pglite = new PGlite(dataDir);
  dbType = 'embedded_postgres';

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
