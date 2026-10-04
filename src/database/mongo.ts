import { MongoClient, Db } from 'mongodb';
import bcrypt from 'bcryptjs';
import { Pledge, AdminUser, PledgeFormData, ImpactStats, AnalyticsData } from '../types/index.ts';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let isMongoConnected = false;

export async function tryConnectMongo(uri: string): Promise<boolean> {
  if (isMongoConnected && mongoDb) return true;

  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });

    await client.connect();
    const db = client.db('yamuna_pledge');
    
    // Test simple ping
    await db.command({ ping: 1 });

    mongoClient = client;
    mongoDb = db;
    isMongoConnected = true;
    console.log('Successfully connected to MongoDB Atlas database.');

    // Ensure indexes
    const pledgesCol = db.collection('pledges');
    await pledgesCol.createIndex({ certificateId: 1 }, { unique: true });
    await pledgesCol.createIndex({ email: 1 });
    await pledgesCol.createIndex({ createdAt: -1 });

    const adminsCol = db.collection('admins');
    await adminsCol.createIndex({ email: 1 }, { unique: true });

    // Seed default admin
    const defaultPassword = process.env.ADMIN_PASSWORD || 'CleanYamuna2026!Secure';
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(defaultPassword, salt);
    const nowIso = new Date().toISOString();

    await adminsCol.updateOne(
      { email: 'admin@yamunapledge.gov.in' },
      {
        $setOnInsert: {
          id: 'admin_root_1',
          email: 'admin@yamunapledge.gov.in',
          name: 'Initiative Administrator',
          createdAt: nowIso
        },
        $set: { passwordHash }
      },
      { upsert: true }
    );

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.toLowerCase().trim() !== 'admin@yamunapledge.gov.in') {
      const envEmail = process.env.ADMIN_EMAIL.toLowerCase().trim();
      await adminsCol.updateOne(
        { email: envEmail },
        {
          $setOnInsert: {
            id: 'admin_env',
            email: envEmail,
            name: 'Environment Administrator',
            createdAt: nowIso
          },
          $set: { passwordHash }
        },
        { upsert: true }
      );
    }

    return true;
  } catch (err: any) {
    isMongoConnected = false;
    mongoClient = null;
    mongoDb = null;
    return false;
  }
}

export function isMongoActive(): boolean {
  return isMongoConnected && mongoDb !== null;
}

export const mongoService = {
  async getStats(): Promise<ImpactStats> {
    if (!mongoDb) throw new Error('MongoDB not connected');
    const pledgesCol = mongoDb.collection('pledges');

    const totalPledges = await pledgesCol.countDocuments({ status: 'valid' });

    const todayStr = new Date().toISOString().split('T')[0];
    const todayPledges = await pledgesCol.countDocuments({
      status: 'valid',
      createdAt: { $gte: `${todayStr}T00:00:00.000Z` }
    });

    const uniqueCities = (await pledgesCol.distinct('city', { status: 'valid' })).length;
    const uniqueStates = (await pledgesCol.distinct('state', { status: 'valid' })).length;

    return {
      totalPledges,
      certificatesGenerated: totalPledges,
      todayPledges,
      uniqueCities,
      uniqueStates
    };
  },

  async getAnalytics(): Promise<AnalyticsData> {
    if (!mongoDb) throw new Error('MongoDB not connected');
    const pledgesCol = mongoDb.collection('pledges');

    // Over time
    const pledges = await pledgesCol.find({ status: 'valid' }).toArray();
    const dateCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};

    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonthStr = todayStr.substring(0, 7);
    let dailyPledges = 0;
    let monthlyPledges = 0;

    for (const p of pledges) {
      const d = (p.createdAt || '').substring(0, 10);
      if (d) dateCounts[d] = (dateCounts[d] || 0) + 1;

      const st = (p.state || '').trim();
      if (st) stateCounts[st] = (stateCounts[st] || 0) + 1;

      const ct = (p.city || '').trim();
      if (ct) cityCounts[ct] = (cityCounts[ct] || 0) + 1;

      if (p.createdAt >= `${todayStr}T00:00:00.000Z`) dailyPledges++;
      if (p.createdAt >= `${currentMonthStr}-01T00:00:00.000Z`) monthlyPledges++;
    }

    const pledgesOverTime = Object.entries(dateCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);

    const pledgesByState = Object.entries(stateCounts)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const pledgesByCity = Object.entries(cityCounts)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      pledgesOverTime,
      pledgesByState,
      pledgesByCity,
      dailyPledges,
      monthlyPledges
    };
  },

  async getPledges(params?: {
    search?: string;
    state?: string;
    city?: string;
    date?: string;
    page?: number;
    limit?: number;
    sortField?: 'createdAt' | 'fullName' | 'certificateId';
    sortOrder?: 'asc' | 'desc';
  }) {
    if (!mongoDb) throw new Error('MongoDB not connected');
    const pledgesCol = mongoDb.collection('pledges');

    const filter: any = {};

    if (params?.search) {
      const q = new RegExp(params.search.trim(), 'i');
      filter.$or = [
        { fullName: q },
        { certificateId: q },
        { email: q },
        { organization: q }
      ];
    }

    if (params?.state && params.state !== 'ALL') {
      filter.state = new RegExp(`^${params.state.trim()}$`, 'i');
    }

    if (params?.city) {
      filter.city = new RegExp(params.city.trim(), 'i');
    }

    if (params?.date) {
      filter.createdAt = {
        $gte: `${params.date}T00:00:00.000Z`,
        $lte: `${params.date}T23:59:59.999Z`
      };
    }

    const total = await pledgesCol.countDocuments(filter);
    const page = Math.max(1, params?.page || 1);
    const limit = Math.max(1, Math.min(100, params?.limit || 15));
    const skip = (page - 1) * limit;

    const sortField = params?.sortField || 'createdAt';
    const sortOrder = params?.sortOrder === 'asc' ? 1 : -1;

    const docs = await pledgesCol
      .find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray();

    const pledges: Pledge[] = docs.map(d => ({
      id: d.id || d._id.toString(),
      certificateId: d.certificateId,
      fullName: d.fullName,
      email: d.email,
      phone: d.phone,
      city: d.city,
      state: d.state,
      country: d.country || 'India',
      organization: d.organization,
      pledgeAccepted: Boolean(d.pledgeAccepted),
      pledgeAcceptedAt: d.pledgeAcceptedAt,
      createdAt: d.createdAt,
      status: d.status || 'valid'
    }));

    return {
      pledges,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  async getPledgeById(id: string): Promise<Pledge | undefined> {
    if (!mongoDb) return undefined;
    const doc = await mongoDb.collection('pledges').findOne({ id });
    if (!doc) return undefined;
    return {
      id: doc.id,
      certificateId: doc.certificateId,
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      city: doc.city,
      state: doc.state,
      country: doc.country || 'India',
      organization: doc.organization,
      pledgeAccepted: Boolean(doc.pledgeAccepted),
      pledgeAcceptedAt: doc.pledgeAcceptedAt,
      createdAt: doc.createdAt,
      status: doc.status
    };
  },

  async getPledgeByCertificateId(certificateId: string): Promise<Pledge | undefined> {
    if (!mongoDb) return undefined;
    const doc = await mongoDb.collection('pledges').findOne({
      certificateId: { $regex: new RegExp(`^${certificateId.trim()}$`, 'i') }
    });
    if (!doc) return undefined;
    return {
      id: doc.id,
      certificateId: doc.certificateId,
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      city: doc.city,
      state: doc.state,
      country: doc.country || 'India',
      organization: doc.organization,
      pledgeAccepted: Boolean(doc.pledgeAccepted),
      pledgeAcceptedAt: doc.pledgeAcceptedAt,
      createdAt: doc.createdAt,
      status: doc.status
    };
  },

  async findExistingPledgeByEmail(email: string): Promise<Pledge | undefined> {
    if (!mongoDb) return undefined;
    const doc = await mongoDb.collection('pledges').findOne({
      email: { $regex: new RegExp(`^${email.trim()}$`, 'i') },
      status: 'valid'
    });
    if (!doc) return undefined;
    return {
      id: doc.id,
      certificateId: doc.certificateId,
      fullName: doc.fullName,
      email: doc.email,
      phone: doc.phone,
      city: doc.city,
      state: doc.state,
      country: doc.country,
      organization: doc.organization,
      pledgeAccepted: Boolean(doc.pledgeAccepted),
      pledgeAcceptedAt: doc.pledgeAcceptedAt,
      createdAt: doc.createdAt,
      status: doc.status
    };
  },

  async createPledge(data: PledgeFormData): Promise<Pledge> {
    if (!mongoDb) throw new Error('MongoDB not connected');
    const settingsCol = mongoDb.collection('settings');
    const pledgesCol = mongoDb.collection('pledges');

    // Atomic sequence increment
    const seqDoc = await settingsCol.findOneAndUpdate(
      { key: 'seq_counter' },
      { $inc: { value: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
    const newSeq = seqDoc?.value || 1;
    const year = new Date().getFullYear();
    const certificateId = `YAMUNA-${year}-${String(newSeq).padStart(6, '0')}`;
    const id = `plg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const nowIso = new Date().toISOString();

    const newPledge: Pledge = {
      id,
      certificateId,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      country: data.country?.trim() || 'India',
      organization: data.organization?.trim(),
      pledgeAccepted: true,
      pledgeAcceptedAt: nowIso,
      createdAt: nowIso,
      status: 'valid'
    };

    await pledgesCol.insertOne(newPledge);
    return newPledge;
  },

  async deletePledge(id: string): Promise<boolean> {
    if (!mongoDb) return false;
    const res = await mongoDb.collection('pledges').deleteOne({ id });
    return res.deletedCount > 0;
  },

  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    if (!mongoDb) return undefined;
    const doc = await mongoDb.collection('admins').findOne({
      email: { $regex: new RegExp(`^${email.trim()}$`, 'i') }
    });
    if (!doc) return undefined;
    return {
      id: doc.id,
      email: doc.email,
      passwordHash: doc.passwordHash,
      name: doc.name,
      createdAt: doc.createdAt
    };
  },

  async exportCsv(): Promise<string> {
    if (!mongoDb) return '';
    const pledges = await mongoDb.collection('pledges').find().sort({ createdAt: -1 }).toArray();

    const headers = [
      'Certificate ID',
      'Full Name',
      'Email',
      'Phone',
      'City',
      'State',
      'Country',
      'Organization',
      'Pledge Accepted At',
      'Status'
    ];

    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = pledges.map(p => [
      escapeCsv(p.certificateId),
      escapeCsv(p.fullName),
      escapeCsv(p.email),
      escapeCsv(p.phone || ''),
      escapeCsv(p.city),
      escapeCsv(p.state),
      escapeCsv(p.country || 'India'),
      escapeCsv(p.organization || ''),
      escapeCsv(p.pledgeAcceptedAt),
      escapeCsv(p.status || 'valid')
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }
};
