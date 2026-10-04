import React, { useState, useEffect } from 'react';
import {
  ImpactStats,
  AnalyticsData,
  Pledge
} from '../../types/index.ts';
import { INDIAN_STATES } from '../../lib/constants.ts';
import { CertificateView } from '../CertificateView.tsx';
import { downloadCertificatePdf, downloadCertificateImage } from '../../lib/certificateGenerator.ts';
import {
  Users,
  Award,
  Calendar,
  MapPin,
  Globe2,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  LogOut,
  RefreshCw,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  Clock,
  Shield,
  FileSpreadsheet
} from 'lucide-react';

interface AdminDashboardProps {
  token: string;
  adminName: string;
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  adminName,
  onLogout,
  onNavigateHome
}) => {
  // Stats & Analytics State
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Table & Filters State
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTable, setLoadingTable] = useState(true);

  // Filter params
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortField, setSortField] = useState<'createdAt' | 'fullName' | 'certificateId'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [activeRecord, setActiveRecord] = useState<Pledge | null>(null);
  const [viewCertificateRecord, setViewCertificateRecord] = useState<Pledge | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<Pledge | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'registrations' | 'analytics'>('registrations');

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      setStats(data.stats);
      setAnalytics(data.analytics);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchPledges = async (page = 1) => {
    try {
      setLoadingTable(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: '15',
        sortField,
        sortOrder
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedState && selectedState !== 'ALL') params.append('state', selectedState);
      if (selectedCity) params.append('city', selectedCity);
      if (selectedDate) params.append('date', selectedDate);

      const res = await fetch(`/api/admin/pledges?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401) {
        onLogout();
        return;
      }

      const data = await res.json();
      setPledges(data.pledges || []);
      setTotalRecords(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.page || 1);
    } catch (err) {
      console.error('Failed to load pledges:', err);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  useEffect(() => {
    fetchPledges(currentPage);
  }, [token, currentPage, sortField, sortOrder]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPledges(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedState('ALL');
    setSelectedCity('');
    setSelectedDate('');
    setCurrentPage(1);
    setTimeout(() => {
      fetchPledges(1);
    }, 50);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/pledges/${recordToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setActionNotice(`Record ${recordToDelete.certificateId} permanently removed.`);
        setRecordToDelete(null);
        fetchStats();
        fetchPledges(currentPage);
        setTimeout(() => setActionNotice(null), 4000);
      } else {
        alert('Failed to delete pledge.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = () => {
    window.open(`/api/admin/export-csv?token=${token}`, '_blank');
  };

  const handleDownloadPdf = async (p: Pledge) => {
    try {
      await downloadCertificatePdf('admin-modal-certificate-node', p.certificateId, p.fullName);
    } catch (err) {
      alert('Error generating PDF');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Top Admin Header */}
      <header className="bg-[#081c2c] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-3">
              <span className="bg-sky-500/20 text-sky-400 p-2 rounded-lg">
                <Shield className="w-5 h-5" />
              </span>
              <div>
                <h1 className="font-bold text-sm sm:text-base font-serif tracking-wide flex items-center gap-2">
                  Yamuna Pledge Admin Registry
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                    Live Database
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Authenticated session: <span className="text-slate-200">{adminName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onNavigateHome}
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded transition"
              >
                Public Site
              </button>
              <button
                onClick={() => {
                  fetchStats();
                  fetchPledges(currentPage);
                }}
                title="Refresh Database Data"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onLogout}
                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Action Notice Banner */}
        {actionNotice && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-sm flex items-center justify-between shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{actionNotice}</span>
            </div>
            <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top 5 Statistics Cards */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* Total Pledges */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Pledges</span>
                <Users className="w-4 h-4 text-sky-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#0c2f4d]">
                {loadingStats ? '...' : (stats?.totalPledges ?? 0)}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">All recorded citizens</p>
            </div>

            {/* Certificates Generated */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Certificates</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-700">
                {loadingStats ? '...' : (stats?.certificatesGenerated ?? 0)}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Issued e-certificates</p>
            </div>

            {/* Today's Pledges */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Today's Pledges</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-700">
                {loadingStats ? '...' : (stats?.todayPledges ?? 0)}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Recorded in last 24h</p>
            </div>

            {/* Unique Cities */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Unique Cities</span>
                <MapPin className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-purple-700">
                {loadingStats ? '...' : (stats?.uniqueCities ?? 0)}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Municipal areas</p>
            </div>

            {/* Unique States */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Unique States</span>
                <Globe2 className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-700">
                {loadingStats ? '...' : (stats?.uniqueStates ?? 0)}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">States & Union Territories</p>
            </div>

          </div>
        </section>

        {/* Tab Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('registrations')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'registrations'
                  ? 'bg-[#0c2f4d] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <Users className="w-4 h-4" />
              All Pledge Registrations
              <span className="text-xs font-mono ml-1 px-1.5 py-0.5 rounded bg-white/20">
                {totalRecords}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-[#0c2f4d] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics & Trends
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Tab 1: Registrations Management Table */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                
                {/* Search */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Search Records
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Name, ID, Email, Org..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0c2f4d]"
                    />
                  </div>
                </div>

                {/* State Filter */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    State / UT
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0c2f4d] bg-white"
                  >
                    <option value="ALL">All States / UTs</option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    placeholder="e.g. Delhi, Agra"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0c2f4d]"
                  />
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#0c2f4d]"
                  />
                </div>

                {/* Submit & Reset Buttons */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#0c2f4d] hover:bg-[#144272] text-white py-1.5 px-3 rounded-lg text-xs font-semibold transition"
                  >
                    Apply Filter
                  </button>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="border border-slate-300 text-slate-600 hover:bg-slate-50 py-1.5 px-2.5 rounded-lg text-xs font-medium transition"
                  >
                    Reset
                  </button>
                </div>

              </form>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              
              {loadingTable ? (
                <div className="p-12 text-center text-slate-500">
                  <span className="w-6 h-6 border-2 border-[#0c2f4d] border-t-transparent rounded-full animate-spin inline-block mb-2"></span>
                  <p className="text-xs">Loading pledge records...</p>
                </div>
              ) : pledges.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-700">No Registrations Found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {searchTerm || selectedState !== 'ALL' || selectedCity || selectedDate
                      ? 'No records match the current filter criteria. Try adjusting or resetting your search filters.'
                      : 'No citizens have taken the pledge yet. As citizens sign the pledge, records and certificates will appear here.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Certificate ID</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Organization</th>
                        <th className="py-3 px-4">Pledge Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {pledges.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition">
                          
                          {/* Certificate ID */}
                          <td className="py-3 px-4 font-mono font-bold text-[#0c2f4d]">
                            {p.certificateId}
                          </td>

                          {/* Name */}
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {p.fullName}
                          </td>

                          {/* Email */}
                          <td className="py-3 px-4 text-slate-500">
                            {p.email}
                          </td>

                          {/* Location */}
                          <td className="py-3 px-4 text-slate-600">
                            {p.city}, {p.state}
                          </td>

                          {/* Organization */}
                          <td className="py-3 px-4 text-slate-500 max-w-[140px] truncate">
                            {p.organization || '—'}
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {new Date(p.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                              {p.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setActiveRecord(p)}
                                title="View User Record Details"
                                className="p-1.5 text-slate-500 hover:text-[#0c2f4d] hover:bg-slate-100 rounded transition"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setViewCertificateRecord(p)}
                                title="View Certificate"
                                className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded transition"
                              >
                                <Award className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setRecordToDelete(p)}
                                title="Delete Record"
                                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Footer */}
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div>
                  Showing page <span className="font-bold">{currentPage}</span> of{' '}
                  <span className="font-bold">{totalPages}</span> ({totalRecords} total records)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="p-1.5 border border-slate-300 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-1.5 border border-slate-300 rounded hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Admin Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Pledges By State */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold font-serif text-[#0c2f4d] text-base flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-indigo-600" />
                    Pledges By State (Top 10)
                  </h3>
                  <span className="text-xs text-slate-400">Database Breakdown</span>
                </div>

                {analytics?.pledgesByState && analytics.pledgesByState.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.pledgesByState.map((item, idx) => {
                      const maxVal = analytics.pledgesByState[0].count || 1;
                      const percentage = Math.round((item.count / maxVal) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium text-slate-700">
                            <span>{item.state}</span>
                            <span className="font-mono font-bold text-[#0c2f4d]">{item.count}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No state distribution data available yet.
                  </div>
                )}
              </div>

              {/* Pledges By City */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold font-serif text-[#0c2f4d] text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Top Participating Cities
                  </h3>
                  <span className="text-xs text-slate-400">Database Breakdown</span>
                </div>

                {analytics?.pledgesByCity && analytics.pledgesByCity.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.pledgesByCity.map((item, idx) => {
                      const maxVal = analytics.pledgesByCity[0].count || 1;
                      const percentage = Math.round((item.count / maxVal) * 100);
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium text-slate-700">
                            <span>{item.city}</span>
                            <span className="font-mono font-bold text-emerald-700">{item.count}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No city distribution data available yet.
                  </div>
                )}
              </div>

            </div>

            {/* Pledges Over Time */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold font-serif text-[#0c2f4d] text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-600" />
                  Pledges Recorded Over Time
                </h3>
                <span className="text-xs text-slate-400">Timeline</span>
              </div>

              {analytics?.pledgesOverTime && analytics.pledgesOverTime.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-end gap-2 h-44 pt-6 pb-2 border-b border-slate-200">
                    {analytics.pledgesOverTime.map((d, i) => {
                      const maxVal = Math.max(...analytics.pledgesOverTime.map((x) => x.count), 1);
                      const heightPercent = Math.max(10, Math.round((d.count / maxVal) * 100));
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group">
                          <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition font-mono mb-1">
                            {d.count}
                          </span>
                          <div
                            className="w-full max-w-[28px] bg-[#0c2f4d] hover:bg-sky-600 rounded-t transition-all"
                            style={{ height: `${heightPercent}%` }}
                          ></div>
                          <span className="text-[9px] text-slate-400 mt-1 font-mono truncate w-full text-center">
                            {d.date.substring(5)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 pt-1">
                    <span>Daily Count</span>
                    <span>Recent Date Trend</span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No historical trend data available yet.
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* MODAL 1: View User Record Details */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fadeIn border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-[#0c2f4d] font-serif">
                Full Citizen Pledge Record
              </h3>
              <button
                onClick={() => setActiveRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Certificate ID:</span>
                <span className="col-span-2 font-mono font-bold text-[#0c2f4d]">
                  {activeRecord.certificateId}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Full Name:</span>
                <span className="col-span-2 font-bold text-slate-900">
                  {activeRecord.fullName}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Email Address:</span>
                <span className="col-span-2 font-mono text-slate-700">
                  {activeRecord.email}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Phone Number:</span>
                <span className="col-span-2 text-slate-700">
                  {activeRecord.phone || 'Not provided'}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Location:</span>
                <span className="col-span-2 text-slate-700">
                  {activeRecord.city}, {activeRecord.state}, {activeRecord.country}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Organization:</span>
                <span className="col-span-2 text-slate-700">
                  {activeRecord.organization || 'Individual Citizen'}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-500">Pledge Date:</span>
                <span className="col-span-2 text-slate-700 font-mono">
                  {new Date(activeRecord.pledgeAcceptedAt).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="grid grid-cols-3 py-1">
                <span className="font-semibold text-slate-500">Registry Status:</span>
                <span className="col-span-2 text-emerald-700 font-bold uppercase">
                  {activeRecord.status}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setViewCertificateRecord(activeRecord);
                  setActiveRecord(null);
                }}
                className="bg-[#0c2f4d] hover:bg-[#144272] text-white px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-amber-300" />
                View Certificate
              </button>
              <button
                onClick={() => setActiveRecord(null)}
                className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: View / Download Certificate */}
      {viewCertificateRecord && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative my-auto animate-fadeIn border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0c2f4d] font-serif">
                  E-Certificate: {viewCertificateRecord.certificateId}
                </h3>
                <p className="text-xs text-slate-500">{viewCertificateRecord.fullName}</p>
              </div>
              <button
                onClick={() => setViewCertificateRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto pb-4 max-h-[70vh]">
              <CertificateView
                certificateId={viewCertificateRecord.certificateId}
                fullName={viewCertificateRecord.fullName}
                city={viewCertificateRecord.city}
                state={viewCertificateRecord.state}
                country={viewCertificateRecord.country}
                pledgeAcceptedAt={viewCertificateRecord.pledgeAcceptedAt}
                organization={viewCertificateRecord.organization}
                id="admin-modal-certificate-node"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                High-Resolution Print-Ready Vector/Raster Certificate
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadPdf(viewCertificateRecord)}
                  className="bg-[#0c2f4d] hover:bg-[#144272] text-white px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
                <button
                  onClick={() =>
                    downloadCertificateImage(
                      'admin-modal-certificate-node',
                      viewCertificateRecord.certificateId,
                      viewCertificateRecord.fullName
                    )
                  }
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Image
                </button>
                <button
                  onClick={() => setViewCertificateRecord(null)}
                  className="border border-slate-300 text-slate-700 px-3.5 py-2 rounded-lg text-xs font-medium hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete Confirmation Dialog */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-200 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-slate-900 font-serif">
              Confirm Permanent Deletion
            </h3>

            <p className="mt-2 text-center text-sm text-slate-600 leading-relaxed">
              “Are you sure you want to permanently delete this pledge record and its certificate?”
            </p>

            <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
              <div>
                <span className="font-semibold">Citizen:</span> {recordToDelete.fullName}
              </div>
              <div>
                <span className="font-semibold">Certificate ID:</span> {recordToDelete.certificateId}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {recordToDelete.email}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition flex items-center gap-1 shadow"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
