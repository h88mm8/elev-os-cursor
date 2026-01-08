import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Lead, Communication, TrackingEvent } from '@/types'
import { apolloService, trackingService, communicationsService, openAIService } from '@/services/api'
import './LeadDetailView.css'

export function LeadDetailView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { leads, selectedLead, setSelectedLead, setLoading } = useStore()
  const [communications, setCommunications] = useState<Communication[]>([])
  const [trackingData, setTrackingData] = useState<TrackingEvent[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'communications' | 'tracking' | 'analysis'>('communications')
  const [loadingComms, setLoadingComms] = useState(false)
  const [loadingTracking, setLoadingTracking] = useState(false)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)

  useEffect(() => {
    if (id) {
      const lead = leads.find((l) => l.id === id)
      if (lead) {
        setSelectedLead(lead)
        loadLeadData(lead)
      }
    }
  }, [id, leads])

  const loadLeadData = async (lead: Lead) => {
    // Carregar comunicações
    setLoadingComms(true)
    try {
      const comms = await communicationsService.getByLead(lead.id)
      setCommunications(comms.map((c: any) => ({
        ...c,
        sentAt: new Date(c.sentAt),
      })))
    } catch (error) {
      console.error('Erro ao carregar comunicações:', error)
    } finally {
      setLoadingComms(false)
    }
    
    // Carregar tracking
    setLoadingTracking(true)
    try {
      const data = await trackingService.getTrackingData(lead.company.domain)
      setTrackingData(data.events || [])
    } catch (error) {
      console.error('Erro ao carregar tracking:', error)
    } finally {
      setLoadingTracking(false)
    }

    // Carregar análise IA
    setLoadingAnalysis(true)
    try {
      const aiAnalysis = await openAIService.analyzeLead(lead.id)
      setAnalysis(aiAnalysis)
    } catch (error) {
      console.error('Erro ao carregar análise IA:', error)
    } finally {
      setLoadingAnalysis(false)
    }
  }

  const handleEnrich = async () => {
    if (!selectedLead) return
    try {
      const enriched = await apolloService.enrichLead(selectedLead.id)
      setSelectedLead(enriched)
    } catch (error) {
      console.error('Erro ao enriquecer lead:', error)
    }
  }

  if (!selectedLead) {
    return (
      <div className="lead-detail-view">
        <div className="empty-state">Lead não encontrado</div>
      </div>
    )
  }

  return (
    <div className="lead-detail-view">
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handleEnrich}>
            Enriquecer Dados
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-sidebar">
          <div className="profile-card">
            <img
              src={selectedLead.profilePicture || '/placeholder-avatar.png'}
              alt={`${selectedLead.firstName} ${selectedLead.lastName}`}
              className="profile-avatar"
            />
            <h2>
              {selectedLead.firstName} {selectedLead.lastName}
            </h2>
            <p className="profile-title">{selectedLead.jobTitle}</p>
            <p className="profile-company">{selectedLead.company.name}</p>
            
            <div className="profile-info">
              {selectedLead.email && (
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{selectedLead.email}</span>
                </div>
              )}
              {selectedLead.phone && (
                <div className="info-item">
                  <span className="info-label">Telefone:</span>
                  <span className="info-value">{selectedLead.phone}</span>
                </div>
              )}
              {selectedLead.linkedinUrl && (
                <div className="info-item">
                  <span className="info-label">LinkedIn:</span>
                  <a href={selectedLead.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    Ver Perfil
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="company-card">
            <h3>Empresa</h3>
            <div className="company-info">
              <p><strong>Nome:</strong> {selectedLead.company.name}</p>
              <p><strong>Indústria:</strong> {selectedLead.company.industry}</p>
              <p><strong>Tamanho:</strong> {selectedLead.company.size}</p>
              <p><strong>Receita:</strong> {selectedLead.company.revenue}</p>
              <p><strong>Localização:</strong> {selectedLead.company.location}</p>
              {selectedLead.company.website && (
                <p>
                  <strong>Website:</strong>{' '}
                  <a href={selectedLead.company.website} target="_blank" rel="noopener noreferrer">
                    {selectedLead.company.website}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="detail-main">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'communications' ? 'active' : ''}`}
              onClick={() => setActiveTab('communications')}
            >
              Comunicações
            </button>
            <button
              className={`tab ${activeTab === 'tracking' ? 'active' : ''}`}
              onClick={() => setActiveTab('tracking')}
            >
              Tracking
            </button>
            <button
              className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysis')}
            >
              Análise IA
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'communications' && (
              <div className="communications-list">
                {loadingComms ? (
                  <div className="empty-state">Carregando comunicações...</div>
                ) : communications.length === 0 ? (
                  <div className="empty-state">
                    Nenhuma comunicação ainda
                  </div>
                ) : (
                  communications.map((comm) => (
                    <div key={comm.id} className="communication-item">
                      <div className="comm-header">
                        <span className={`comm-channel channel-${comm.channel}`}>
                          {comm.channel.toUpperCase()}
                        </span>
                        <div className="comm-meta">
                          {comm.subject && (
                            <span className="comm-subject">{comm.subject}</span>
                          )}
                          <span className="comm-date">
                            {new Date(comm.sentAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="comm-content">{comm.content}</div>
                      {(comm.opened || comm.clicked || comm.replied) && (
                        <div className="comm-status">
                          {comm.opened && <span className="status-badge opened">Aberto</span>}
                          {comm.clicked && <span className="status-badge clicked">Clicado</span>}
                          {comm.replied && <span className="status-badge replied">Respondido</span>}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'tracking' && (
              <div className="tracking-list">
                {loadingTracking ? (
                  <div className="empty-state">Carregando tracking...</div>
                ) : trackingData.length === 0 ? (
                  <div className="empty-state">
                    Nenhum dado de tracking ainda
                  </div>
                ) : (
                  trackingData.map((event) => (
                    <div key={event.id} className="tracking-item">
                      <span className={`tracking-type type-${event.type}`}>
                        {event.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="tracking-url">{event.url}</span>
                      <span className="tracking-date">
                        {new Date(event.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="analysis-content">
                {loadingAnalysis ? (
                  <div className="empty-state">Carregando análise...</div>
                ) : analysis ? (
                  <div className="analysis-details">
                    <div className="analysis-section">
                      <h4>Resumo Executivo</h4>
                      <p>{analysis.strategicAnalysis?.summary || 'Nenhum resumo disponível'}</p>
                    </div>

                    {analysis.strategicAnalysis?.painPoints && analysis.strategicAnalysis.painPoints.length > 0 && (
                      <div className="analysis-section">
                        <h4>Pontos de Dor</h4>
                        <ul className="analysis-list">
                          {analysis.strategicAnalysis.painPoints.map((point: string, index: number) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.strategicAnalysis?.opportunities && analysis.strategicAnalysis.opportunities.length > 0 && (
                      <div className="analysis-section">
                        <h4>Oportunidades</h4>
                        <ul className="analysis-list">
                          {analysis.strategicAnalysis.opportunities.map((opp: string, index: number) => (
                            <li key={index}>{opp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.strategicAnalysis?.recommendedApproach && (
                      <div className="analysis-section">
                        <h4>Abordagem Recomendada</h4>
                        <p>{analysis.strategicAnalysis.recommendedApproach}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="empty-state">
                    Nenhuma análise disponível. Clique em "Gerar Análise" para criar uma.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

