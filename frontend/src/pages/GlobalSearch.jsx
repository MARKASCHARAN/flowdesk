import React, { useState, useEffect } from 'react';
import { Search, Ticket, Building2, UserCircle, ArrowRight, Clock, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/search.service';

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const { data: response, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchService.globalSearch(debouncedQuery),
    enabled: debouncedQuery.length > 2
  });

  const searchResults = response?.data || { tickets: [], customers: [], companies: [] };

  const recentSearches = ['API limits', 'Acme Corp', 'Billing issue'];
  
  const hasQuery = query.length > 0;

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-4xl mx-auto space-y-8 flex flex-col min-h-full animate-in fade-in duration-700 font-sans">
      
      {/* Header & Main Search Input */}
      <div className="flex flex-col gap-6 animate-in slide-in-from-top-8 duration-500">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
              <Search size={24} />
            </div>
            Global Search
          </h1>
          <p className="text-[15px] text-gray-500 mt-2">Search across tickets, customers, companies, and settings.</p>
        </div>

        {/* Big Search Input */}
        <div className="relative group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" size={20} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search everything..." 
            className="w-full pl-14 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Results Container */}
      <div className="flex-1 animate-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
        {!hasQuery ? (
          /* Empty State / Recent Searches */
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Recent Searches</h3>
            <div className="flex flex-wrap gap-3">
              {recentSearches.map((term, i) => (
                <button 
                  key={i}
                  onClick={() => setQuery(term)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 text-[14px] font-medium hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Clock size={14} className="opacity-60" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Search Results (Mocked layout) */
          <div className="space-y-6">
            
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                <Loader2 size={32} className="animate-spin text-indigo-600 mb-4" />
                <p>Searching across platform...</p>
              </div>
            ) : (
              <>
                {/* Tickets Section */}
                {searchResults.tickets?.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                      <Ticket size={16} className="text-amber-500" />
                      <h3 className="font-bold text-slate-900 text-[14px]">Tickets</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {searchResults.tickets.map((t) => (
                        <div 
                          key={t.id} 
                          onClick={() => navigate(`/app/tickets/${t.id}`)}
                          className="p-4 flex items-center justify-between group cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                        >
                          <div>
                            <h4 className="font-bold text-[14px] text-slate-900 group-hover:text-indigo-600 transition-colors">{t.title}</h4>
                            <p className="text-xs text-gray-500 mt-1 font-mono">{t.id} • {t.status}</p>
                          </div>
                          <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customers Section */}
                {searchResults.customers?.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                      <UserCircle size={16} className="text-emerald-500" />
                      <h3 className="font-bold text-slate-900 text-[14px]">Customers</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {searchResults.customers.map((c) => (
                        <div 
                          key={c.id} 
                          onClick={() => navigate(`/app/crm/customers/${c.id}`)}
                          className="p-4 flex items-center justify-between group cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                        >
                          <div>
                            <h4 className="font-bold text-[14px] text-slate-900 group-hover:text-indigo-600 transition-colors">{c.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{c.company || 'No Company'}</p>
                          </div>
                          <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Companies Section */}
                {searchResults.companies?.length > 0 && (
                  <div className="bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                      <Building2 size={16} className="text-blue-500" />
                      <h3 className="font-bold text-slate-900 text-[14px]">Companies</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {searchResults.companies.map((c) => (
                        <div 
                          key={c.id} 
                          onClick={() => navigate(`/app/crm/companies`)}
                          className="p-4 flex items-center justify-between group cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                        >
                          <div>
                            <h4 className="font-bold text-[14px] text-slate-900 group-hover:text-indigo-600 transition-colors">{c.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{c.industry || 'Unknown Industry'}</p>
                          </div>
                          <ArrowRight size={16} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isLoading && debouncedQuery.length > 2 && 
                  searchResults.tickets?.length === 0 && 
                  searchResults.customers?.length === 0 && 
                  searchResults.companies?.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    No results found for "{debouncedQuery}".
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default GlobalSearch;
