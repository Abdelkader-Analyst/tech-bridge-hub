'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Building, ExternalLink, MapPin } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  original_url: string;
  category: string;
  created_at: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  const categories = ['الكل', ...Array.from(new Set(jobs.map((job) => job.category)))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'الكل' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-12 px-4 shadow-md">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Tech Bridge Hub</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            بوابتك الأولى لاكتشاف أحدث الوظائف التقنية العالمية وعن بعد بكل سهولة واحترافية.
          </p>
        </div>
      </header>

      {/* Search & Filter Section */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full flex-1">
            <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="ابحث عن مسمى وظيفي أو شركة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto py-4 mt-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        {loading ? (
          <div className="text-center py-20 text-slate-500">جاري تحميل الوظائف...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-lg">لم يتم العثور على وظائف تطابق بحثك.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {job.category || 'تقنية'}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin size={14} /> عن بعد / عالمي
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">{job.title}</h2>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Building size={16} className="text-slate-400" />
                    <span className="font-medium">{job.company || 'شركة تقنية'}</span>
                  </div>
                  <p className="text-slate-600 text-sm line-clamp-2 mt-2">
                    {job.description}
                  </p>
                </div>
                <div className="w-full md:w-auto flex md:flex-col justify-end">
                  <a
                    href={job.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-sm text-sm"
                  >
                    <span>تقديم الآن</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
