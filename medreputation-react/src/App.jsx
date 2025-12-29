import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatCard from './components/StatCard';
import ReviewRow from './components/ReviewRow';
import AddPracticeModal from './components/AddPracticeModal';
import AlertsPage from './components/AlertsPage';
import TemplatesPage from './components/TemplatesPage';
import ReportsPage from './components/ReportsPage';
import Login from './components/Login';
import { StatCardSkeleton, ReviewSkeleton, LoadingSpinner, EmptyState } from './components/LoadingSkeleton';
import { useClinics, useReviews, useClinicStats } from './hooks/useSupabase';
import { addClinicWithMockData } from './utils/mockData';
import { useAuth } from './hooks/useAuth';
import {
  Heart,
  ThumbsDown,
  Clock,
  Tag,
  Filter,
  Search,
  Inbox
} from 'lucide-react';

function App() {
  // 🔐 Authentication - DOIT ÊTRE EN PREMIER
  const { user, loading: authLoading } = useAuth();

  const [activePage, setActivePage] = useState('dashboard');
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('active');
  const [archivedReviewIds, setArchivedReviewIds] = useState(() => {
    const saved = localStorage.getItem('medreputation_archived');
    return saved ? JSON.parse(saved) : [];
  });

  // 🔥 Hooks Supabase - DOIVENT ÊTRE APPELÉS INCONDITIONNELLEMENT
  // Passer null si user n'existe pas pour éviter les appels inutiles
  const { clinics, loading: clinicsLoading, addClinic, deleteClinic } = useClinics();
  const { reviews, loading: reviewsLoading, refresh: refreshReviews } = useReviews(
    selectedPractice,
    { status: viewMode === 'active' ? undefined : 'archived' }
  );
  const stats = useClinicStats(selectedPractice);

  // Sélectionner automatiquement le premier cabinet
  useEffect(() => {
    if (clinics.length > 0 && !selectedPractice) {
      setSelectedPractice(clinics[0].id);
    }
  }, [clinics, selectedPractice]);

  // Save archived reviews to localStorage
  useEffect(() => {
    localStorage.setItem('medreputation_archived', JSON.stringify(archivedReviewIds));
  }, [archivedReviewIds]);

  const handleAddPractice = async (newPracticeData) => {
    const result = await addClinic(newPracticeData);
    if (!result.error && result.data) {
      setSelectedPractice(result.data.id);
      setIsModalOpen(false);
    }
    return result;
  };

  const handleDeletePractice = async (practiceId) => {
    await deleteClinic(practiceId);
    if (selectedPractice === practiceId && clinics.length > 1) {
      const remainingClinics = clinics.filter(c => c.id !== practiceId);
      setSelectedPractice(remainingClinics[0]?.id);
    }
  };

  // Fonction pour ajouter des données de test
  const handleAddMockData = async () => {
    const result = await addClinicWithMockData();
    if (result.success) {
      alert('✅ Données de test créées ! Rechargement...');
      window.location.reload();
    } else {
      alert('❌ Erreur: ' + result.error);
    }
  };

  const handleArchiveReview = (reviewId) => {
    setArchivedReviewIds([...archivedReviewIds, reviewId]);
  };

  const handleUnarchiveReview = (reviewId) => {
    setArchivedReviewIds(archivedReviewIds.filter(id => id !== reviewId));
  };

  const currentPractice = clinics.find(c => c.id === selectedPractice);

  // Filtrer les avis
  const activeReviews = reviews.filter(review => !archivedReviewIds.includes(review.id));
  const archivedReviews = reviews.filter(review => archivedReviewIds.includes(review.id));
  const displayedReviews = viewMode === 'active' ? activeReviews : archivedReviews;

  // Appliquer les filtres
  const filteredReviews = displayedReviews.filter(review => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesText = review.text.toLowerCase().includes(query);
      const matchesAuthor = review.author.toLowerCase().includes(query);
      if (!matchesText && !matchesAuthor) return false;
    }

    if (filterPriority === 'critical') return review.is_critical;
    if (filterPriority === 'urgent') return review.rating <= 2 && !review.is_critical;
    if (filterPriority === 'positive') return review.rating >= 4;
    return true;
  });

  // Trier par priorité
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (a.is_critical !== b.is_critical) {
      return a.is_critical ? -1 : 1;
    }
    return new Date(b.review_date) - new Date(a.review_date);
  });

  // ⚠️ VÉRIFICATIONS AUTH - Après tous les hooks

  // Afficher l'écran de chargement pendant la vérification auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner text="Vérification de votre session..." />
      </div>
    );
  }

  // Rediriger vers Login si non connecté
  if (!user) {
    return <Login />;
  }

  // ✅ Utilisateur connecté - Afficher le Dashboard
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        selectedPractice={selectedPractice}
        onPracticeChange={setSelectedPractice}
        practices={clinics}
        onAddPractice={() => setIsModalOpen(true)}
        onDeletePractice={handleDeletePractice}
      />

      <div className="flex-1 flex flex-col">
        <Header
          practiceName={currentPractice?.name || 'Cabinet'}
          reputationHealth="Bonne"
        />

        {activePage === 'alerts' ? (
          <AlertsPage selectedPractice={selectedPractice} />
        ) : activePage === 'templates' ? (
          <TemplatesPage selectedPractice={selectedPractice} />
        ) : activePage === 'reports' ? (
          <ReportsPage selectedPractice={selectedPractice} />
        ) : (
          <main className="flex-1 p-8">
            {/* Loading ou Empty State */}
            {clinicsLoading ? (
              <LoadingSpinner text="Chargement des cabinets..." />
            ) : clinics.length === 0 ? (
              <EmptyState
                icon={Inbox}
                title="Aucun cabinet configuré"
                description="Créez votre premier cabinet médical avec des données de test pour commencer."
                action={
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-2.5 bg-medical-600 text-white rounded-lg hover:bg-medical-700 transition-colors font-medium"
                    >
                      Ajouter un cabinet
                    </button>
                    <button
                      onClick={handleAddMockData}
                      className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                    >
                      🌱 Créer données de test
                    </button>
                  </div>
                }
              />
            ) : (
              <>
                {/* KPIs Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.loading ? (
                    <>
                      <StatCardSkeleton />
                      <StatCardSkeleton />
                      <StatCardSkeleton />
                      <StatCardSkeleton />
                    </>
                  ) : (
                    <>
                      <StatCard
                        title="Indice de Confiance Patient"
                        value={`${stats.trustIndex}/100`}
                        subtitle={stats.trustIndex >= 80 ? 'Excellent niveau' : stats.trustIndex >= 60 ? 'Bon niveau' : 'À améliorer'}
                        trend={stats.trustIndex >= 80 ? 'up' : undefined}
                        icon={Heart}
                      />

                      <StatCard
                        title="Taux de Sentiment Négatif"
                        value={`${stats.negativeRate.toFixed(1)}%`}
                        subtitle={stats.negativeRate > 15 ? 'Alerte: Seuil dépassé' : 'Dans la norme'}
                        alert={stats.negativeRate > 15}
                        icon={ThumbsDown}
                      />

                      <StatCard
                        title="Taux de Réponse"
                        value={`${stats.responseRate}%`}
                        subtitle={`${stats.totalReviews} avis au total`}
                        trend={stats.responseRate >= 50 ? 'up' : 'down'}
                        icon={Clock}
                      />

                      <StatCard
                        title="Mots-clés Critiques"
                        value={stats.topKeywords.length}
                        subtitle={stats.topKeywords.join(', ') || 'Aucun'}
                        icon={Tag}
                      />
                    </>
                  )}
                </div>

                {/* Filters & Search */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Rechercher dans les avis..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-slate-600" />
                      <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 text-sm font-medium"
                      >
                        <option value="all">Tous les avis</option>
                        <option value="critical">🔴 Critiques</option>
                        <option value="urgent">🟠 Urgents</option>
                        <option value="positive">🟢 Positifs</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tabs: Active / Archived */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
                  <div className="flex border-b border-slate-200">
                    <button
                      onClick={() => setViewMode('active')}
                      className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${viewMode === 'active'
                        ? 'text-medical-600 border-b-2 border-medical-600 bg-medical-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                    >
                      Avis Actifs ({activeReviews.length})
                    </button>
                    <button
                      onClick={() => setViewMode('archived')}
                      className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${viewMode === 'archived'
                        ? 'text-medical-600 border-b-2 border-medical-600 bg-medical-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                    >
                      Archives ({archivedReviews.length})
                    </button>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {viewMode === 'active' ? 'Analyseur d\'Avis' : 'Avis Archivés'} ({sortedReviews.length})
                    </h3>
                    <p className="text-sm text-slate-600">
                      {viewMode === 'active' ? 'Triés par priorité' : 'Avis traités'}
                    </p>
                  </div>

                  {reviewsLoading ? (
                    <>
                      <ReviewSkeleton />
                      <ReviewSkeleton />
                      <ReviewSkeleton />
                    </>
                  ) : sortedReviews.length === 0 ? (
                    <EmptyState
                      icon={Inbox}
                      title={viewMode === 'active' ? 'Aucun avis actif' : 'Aucun avis archivé'}
                      description={searchQuery ? 'Aucun résultat ne correspond à votre recherche.' : viewMode === 'active' ? 'Les nouveaux avis apparaîtront ici.' : 'Les avis archivés apparaîtront ici.'}
                    />
                  ) : (
                    sortedReviews.map((review) => (
                      <ReviewRow
                        key={review.id}
                        review={{
                          ...review,
                          hasSensitiveContent: review.has_sensitive_content,
                          sensitiveItems: review.detected_risks || [],
                          date: new Date(review.review_date).toLocaleDateString('fr-FR'),
                          practiceName: currentPractice?.name || 'Cabinet',
                          phone: currentPractice?.phone || ''
                        }}
                        onArchive={handleArchiveReview}
                        onUnarchive={handleUnarchiveReview}
                        isArchived={viewMode === 'archived'}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </main>
        )}
      </div>

      {/* Modal */}
      <AddPracticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPractice}
        onDelete={handleDeletePractice}
        practices={clinics}
      />
    </div>
  );
}

export default App;
