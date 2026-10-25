'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Building, ExternalLink, MapPin, Briefcase } from 'lucide-react';

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

  // تنظيف النص من أوسام الـ HTML الظاهرة في الوصف
  const cleanDescription = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
  };

  const rawCategories = jobs.map((job) => job.category).filter(Boolean);
  const categories = ['الكل', ...Array.from(new Set(rawCategories))];

  const filteredJobs = jobs.filter((job) => {
    const titleMatch = job.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const companyMatch = job.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = titleMatch || companyMatch;
    const matchesCategory = selectedCategory === 'الكل' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dir-rtl pb-16">
      {/* الهيدر الرئيسي */}
      <header className="bg-slate-900 text-white py-16 px-4 shadow-lg border-b border-slate-800">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 mb-2">
            <Briefcase size={16} /> منصة الوظائف المباشرة
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Tech Bridge Hub</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            منصتك الذكية لاكتشاف أحدث فرَص العمل التقني والعن بعد من كبرى الشركات العالمية.
          </p>
        </div>
      </header>

      {/* قسم البحث والفلترة */}
      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center">
          <div className="relative w-full">
            <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="ابحث بمسمى الوظيفة أو اسم الشركة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-sm text-slate-800 transition-all"
            />
          </div>
        </div>

        {/* التصنيفات الأفقية */}
        <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* قائمة الوظائف */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium">جاري تحميل الفرص المتاحة...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-base">لا توجد نتائج تطابق بحثك حالياً.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-lg">
                      {job.category || 'تقنية'}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin size={14} /> عن بعد / عالمي
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    {job.title}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Building size={16} className="text-slate-400" />
                    <span className="font-medium">{job.company || 'شركة تقنية'}</span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 mt-2 leading-relaxed">
                    {cleanDescription(job.description)}
                  </p>
                </div>

                <div className="w-full md:w-auto flex justify-end">
                  <a
                    href={job.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-sm"
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
