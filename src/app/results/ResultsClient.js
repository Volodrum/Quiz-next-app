'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function ResultsClient({ initialResults }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState(false);

  const SECRET_CODE = "TCCzFcYCwsYw3s89XYeRC3dwh"; // Change this code as needed

  const handleAuth = (e) => {
    e.preventDefault();
    if (passcode === SECRET_CODE) {
      setIsAuthorized(true);
      setAuthError(false);
    } else {
      setAuthError(true);
      setPasscode('');
    }
  };

  const filteredResults = initialResults.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.academic_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadExcel = () => {
    const searchParam = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
    window.open(`/api/export${searchParam}`, '_blank');
  };

  /* ============================
     Auth Screen
     ============================ */
  if (!isAuthorized) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-header">
          <h1 className="onboarding-title">Вхід до бази</h1>
          <p className="onboarding-subtitle">Введіть секретний код для доступу до бази кандидатів.</p>
        </div>
        
        <div className="onboarding-card">
          <form onSubmit={handleAuth} className="auth-form">
            <div className="auth-form-body">
              <div className="auth-lock-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              
              <div className="form-group">
                <label className="form-label-center">Секретний код</label>
                <input 
                  type="password"
                  className={`input-field-passcode ${authError ? 'input-error' : ''}`}
                  placeholder="••••"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  autoFocus
                />
                {authError && <p className="error-text-center">Невірний код доступу</p>}
              </div>
            </div>
            
            <div className="auth-form-footer">
              <button type="submit" className="btn-primary-full">
                Підтвердити
              </button>
              
              <Link href="/" className="auth-back-link">
                Повернутися на головну
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ============================
     Main Admin Panel
     ============================ */
  return (
    <div className="admin-container-inner">
      <header className="admin-header">
        <div className="admin-header-top">
          <div>
            <h1 className="admin-title">База кандидатів</h1>
            <p className="admin-subtitle">
              {initialResults.length} анкет отримано
            </p>
          </div>
          <Link href="/" className="admin-back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
            На головну
          </Link>
        </div>
      </header>

      <main className="admin-content">
        <div className="admin-results-area">
          <div className="admin-search-row">
            <div className="admin-search-wrapper">
              <input 
                type="text"
                placeholder="Пошук за ім'ям, групою або роллю..."
                className="admin-search-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="admin-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={downloadExcel}
              className="admin-export-btn"
              title="Завантажити для Excel"
            >
              <svg className="admin-export-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
          </div>

          {filteredResults.length === 0 ? (
            <div className="admin-empty-state">
              {searchTerm ? "Нічого не знайдено за вашим запитом." : "Ще немає жодного результату."}
            </div>
          ) : (
            filteredResults.map((user) => (
              <div key={user.id} className="admin-result-card">
                <div className="admin-card-header">
                  <h2 className="admin-user-name">{user.full_name}</h2>
                  <span className="admin-user-group">{user.academic_group}</span>
                </div>
                
                <div className="admin-card-info">
                  <div className="admin-info-item">
                    <svg className="admin-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{user.phone}</span>
                  </div>
                  <div className="admin-info-item">
                    <svg className="admin-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(user.created_at).toLocaleDateString('uk-UA', {
                        day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="admin-role-badge">
                  {user.role_name}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
