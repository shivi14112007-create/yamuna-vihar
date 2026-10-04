import express from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dbService, initPostgresDatabase } from './src/database/db.ts';
import { generateAdminToken, requireAdminAuth, AuthenticatedRequest } from './src/server/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Initialize PostgreSQL database schema and tables at server boot
  try {
    await initPostgresDatabase();
    console.log('PostgreSQL database initialized and ready.');
  } catch (err: any) {
    if (isProd) {
      console.error('[FATAL] Production database initialization failed. Halting server startup.');
      console.error(err);
      process.exit(1);
    } else {
      console.error('Database initialization warning (development fallback active):', err);
    }
  }

  // API Routes

  // 1. Public Impact Statistics
  app.get('/api/stats', async (req, res) => {
    try {
      const stats = await dbService.getStats();
      res.json(stats);
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      res.status(500).json({ error: 'Failed to retrieve stats' });
    }
  });

  // 2. Submit Pledge
  app.post('/api/pledges', async (req, res) => {
    try {
      const { fullName, email, phone, city, state, country, organization, pledgeAccepted } = req.body;

      // Validation
      if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
        return res.status(400).json({ error: 'Please enter your full name (minimum 2 characters).' });
      }

      if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }

      if (!city || typeof city !== 'string' || city.trim().length < 2) {
        return res.status(400).json({ error: 'Please enter your city.' });
      }

      if (!state || typeof state !== 'string' || state.trim().length < 2) {
        return res.status(400).json({ error: 'Please select or enter your state.' });
      }

      if (pledgeAccepted !== true) {
        return res.status(400).json({ error: 'You must solemnly accept and check the pledge to continue.' });
      }

      // Check if email already pledged
      const existing = await dbService.findExistingPledgeByEmail(email);
      if (existing) {
        return res.status(409).json({
          error: `A pledge with email "${email}" has already been recorded with Certificate ID: ${existing.certificateId}.`,
          existingCertificateId: existing.certificateId,
          existingPledge: {
            certificateId: existing.certificateId,
            fullName: existing.fullName,
            pledgeAcceptedAt: existing.pledgeAcceptedAt
          }
        });
      }

      const pledge = await dbService.createPledge({
        fullName,
        email,
        phone,
        city,
        state,
        country: country || 'India',
        organization
      });

      res.status(201).json({
        success: true,
        message: 'Your sacred pledge to River Yamuna has been permanently recorded in the database.',
        pledge: {
          id: pledge.id,
          certificateId: pledge.certificateId,
          fullName: pledge.fullName,
          city: pledge.city,
          state: pledge.state,
          country: pledge.country,
          organization: pledge.organization,
          pledgeAcceptedAt: pledge.pledgeAcceptedAt,
          status: pledge.status
        }
      });
    } catch (err: any) {
      console.error('Error creating pledge:', err);
      res.status(500).json({ error: 'Server error while recording pledge. Please try again.' });
    }
  });

  // 3. Public Certificate Verification
  app.get('/api/verify/:certificateId', async (req, res) => {
    try {
      const { certificateId } = req.params;
      if (!certificateId) {
        return res.status(400).json({ found: false, error: 'Certificate ID is required' });
      }

      const pledge = await dbService.getPledgeByCertificateId(certificateId);
      if (!pledge) {
        return res.json({ found: false, error: 'Certificate Not Found' });
      }

      // Never expose email or phone on public verification endpoint
      res.json({
        found: true,
        certificateId: pledge.certificateId,
        fullName: pledge.fullName,
        city: pledge.city,
        state: pledge.state,
        country: pledge.country,
        organization: pledge.organization,
        pledgeAcceptedAt: pledge.pledgeAcceptedAt,
        status: pledge.status
      });
    } catch (err: any) {
      console.error('Error verifying certificate:', err);
      res.status(500).json({ found: false, error: 'Internal verification error' });
    }
  });

  // 4. Public Lookup for Certificate rendering
  app.get('/api/pledges/certificate/:certificateId', async (req, res) => {
    try {
      const { certificateId } = req.params;
      const pledge = await dbService.getPledgeByCertificateId(certificateId);
      if (!pledge) {
        return res.status(404).json({ error: 'Certificate not found' });
      }
      res.json({
        certificateId: pledge.certificateId,
        fullName: pledge.fullName,
        city: pledge.city,
        state: pledge.state,
        country: pledge.country,
        organization: pledge.organization,
        pledgeAcceptedAt: pledge.pledgeAcceptedAt,
        status: pledge.status
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve certificate data' });
    }
  });

  // 5. Admin Login
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const admin = await dbService.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      const isMatch = bcrypt.compareSync(password, admin.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      const token = generateAdminToken({
        id: admin.id,
        email: admin.email,
        name: admin.name
      });

      res.json({
        success: true,
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name
        }
      });
    } catch (err: any) {
      console.error('Admin login error:', err);
      res.status(500).json({ error: 'Server authentication failure' });
    }
  });

  // 6. Admin Token verification
  app.get('/api/admin/me', requireAdminAuth, (req: AuthenticatedRequest, res) => {
    res.json({ admin: req.admin });
  });

  // 7. Admin Dashboard Analytics & Stats
  app.get('/api/admin/stats', requireAdminAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const stats = await dbService.getStats();
      const analytics = await dbService.getAnalytics();
      res.json({ stats, analytics });
    } catch (err: any) {
      console.error('Error fetching admin analytics:', err);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // 8. Admin Pledges List (Searchable, filterable, paginated)
  app.get('/api/admin/pledges', requireAdminAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { search, state, city, date, page, limit, sortField, sortOrder } = req.query;
      const result = await dbService.getPledges({
        search: typeof search === 'string' ? search : undefined,
        state: typeof state === 'string' ? state : undefined,
        city: typeof city === 'string' ? city : undefined,
        date: typeof date === 'string' ? date : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 15,
        sortField: sortField as any,
        sortOrder: sortOrder as any
      });
      res.json(result);
    } catch (err: any) {
      console.error('Error listing pledges:', err);
      res.status(500).json({ error: 'Failed to retrieve registrations' });
    }
  });

  // 9. Admin Delete Pledge
  app.delete('/api/admin/pledges/:id', requireAdminAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const deleted = await dbService.deletePledge(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Pledge record not found' });
      }
      res.json({ success: true, message: 'Record and certificate permanently deleted.' });
    } catch (err: any) {
      console.error('Error deleting pledge:', err);
      res.status(500).json({ error: 'Failed to delete record' });
    }
  });

  // 10. Admin Export CSV
  app.get('/api/admin/export-csv', requireAdminAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const csv = await dbService.exportCsv();
      const timestamp = new Date().toISOString().split('T')[0];
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="yamuna_pledge_registrations_${timestamp}.csv"`);
      res.send(csv);
    } catch (err: any) {
      console.error('Error exporting CSV:', err);
      res.status(500).json({ error: 'Failed to export CSV' });
    }
  });

  // Mount Vite or Serve Static Build
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Yamuna Pledge Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
