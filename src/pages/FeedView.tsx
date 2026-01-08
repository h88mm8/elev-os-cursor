import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { DailyActivity, CommunicationChannel, LinkedInAction } from '@/types'
import { openAIService, unipileService } from '@/services/api'
import { EditActivityModal } from '@/components/EditActivityModal'
import './FeedView.css'

export function FeedView() {
  const navigate = useNavigate()
  const { leads, dailyActivities, setDailyActivities, updateDailyActivity } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [editingActivity, setEditingActivity] = useState<DailyActivity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Carregar atividades diárias
    loadDailyActivities()
  }, [])

  const loadDailyActivities = async () => {
    try {
      const leadIds = leads.map((l) => l.id)
      const activities = await openAIService.generateDailyActivities(leadIds)
      setDailyActivities(activities)
    } catch (error) {
      console.error('Erro ao carregar atividades:', error)
    }
  }

  const currentActivity = dailyActivities[currentIndex]
  const currentLead = currentActivity
    ? leads.find((l) => l.id === currentActivity.leadId)
    : null

  const handleApprove = async () => {
    if (!currentActivity) return

    updateDailyActivity(currentActivity.id, { status: 'approved' })

    // Executar ação baseada no canal
    try {
      switch (currentActivity.channel) {
        case CommunicationChannel.EMAIL:
          await unipileService.sendEmail(
            currentActivity.leadId,
            'Assunto da Mensagem',
            currentActivity.message
          )
          break
        case CommunicationChannel.WHATSAPP:
          await unipileService.sendWhatsApp(
            currentActivity.leadId,
            currentActivity.message
          )
          break
        case CommunicationChannel.LINKEDIN:
          if (currentActivity.linkedinAction === LinkedInAction.CONNECT) {
            await unipileService.linkedinConnect(currentActivity.leadId)
          } else if (currentActivity.linkedinAction === LinkedInAction.CONNECT_WITH_MESSAGE) {
            await unipileService.linkedinConnect(
              currentActivity.leadId,
              currentActivity.message
            )
          } else if (currentActivity.linkedinAction === LinkedInAction.LIKE_POST && currentActivity.linkedinPostId) {
            await unipileService.linkedinLikePost(
              currentActivity.leadId,
              currentActivity.linkedinPostId
            )
          } else if (currentActivity.linkedinAction === LinkedInAction.COMMENT_POST && currentActivity.linkedinPostId) {
            await unipileService.linkedinCommentPost(
              currentActivity.leadId,
              currentActivity.linkedinPostId,
              currentActivity.message
            )
          }
          break
      }
    } catch (error) {
      console.error('Erro ao executar ação:', error)
    }

    nextActivity()
  }

  const handleEdit = () => {
    if (currentActivity) {
      setEditingActivity(currentActivity)
      setIsModalOpen(true)
    }
  }

  const handleSaveEdited = (editedActivity: DailyActivity) => {
    updateDailyActivity(editedActivity.id, editedActivity)
    setEditingActivity(null)
    setIsModalOpen(false)
  }

  const handleIgnore = () => {
    if (!currentActivity) return
    updateDailyActivity(currentActivity.id, { status: 'ignored' })
    nextActivity()
  }

  const nextActivity = () => {
    if (currentIndex < dailyActivities.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevActivity = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (!currentActivity || !currentLead) {
    return (
      <div className="feed-view empty">
        <div className="empty-state">
          <h2>Nenhuma atividade para hoje</h2>
          <p>Novas atividades serão geradas pela IA</p>
        </div>
      </div>
    )
  }

  return (
    <div className="feed-view">
      <div className="feed-header">
        <h2>Feed de Atividades Diárias</h2>
        <div className="feed-progress">
          {currentIndex + 1} / {dailyActivities.length}
        </div>
      </div>

      <div className="feed-card">
        <div className="card-header">
          <div className="lead-info">
            <img
              src={currentLead.profilePicture || '/placeholder-avatar.png'}
              alt={`${currentLead.firstName} ${currentLead.lastName}`}
              className="lead-avatar"
            />
            <div>
              <h3>
                {currentLead.firstName} {currentLead.lastName}
              </h3>
              <p className="lead-title">{currentLead.jobTitle}</p>
              <p className="lead-company">{currentLead.company.name}</p>
            </div>
          </div>
          <div className="lead-stage">
            <span className={`stage-badge stage-${currentLead.stage}`}>
              {currentLead.stage}
            </span>
          </div>
        </div>

        <div className="card-content">
          <div className="activity-channel">
            <span className={`channel-badge channel-${currentActivity.channel}`}>
              {currentActivity.channel}
            </span>
            {currentActivity.linkedinAction && (
              <span className="action-badge">
                {currentActivity.linkedinAction}
              </span>
            )}
          </div>

          <div className="activity-message">
            <p>{currentActivity.message}</p>
          </div>

          <div className="activity-actions">
            <button className="btn-secondary" onClick={handleIgnore}>
              Ignorar
            </button>
            <button className="btn-secondary" onClick={handleEdit}>
              Editar
            </button>
            <button className="btn-primary" onClick={handleApprove}>
              Aprovar & Enviar
            </button>
          </div>

          <div className="card-footer">
            <button className="btn-link" onClick={() => navigate(`/lead/${currentLead.id}`)}>
              Ver Detalhes do Lead
            </button>
            <button className="btn-link">Enviar Link da Agenda</button>
            <button className="btn-link">Enviar Convite de Reunião</button>
          </div>
        </div>
      </div>

      <div className="feed-navigation">
        <button
          className="nav-btn"
          onClick={prevActivity}
          disabled={currentIndex === 0}
        >
          ← Anterior
        </button>
        <button
          className="nav-btn"
          onClick={nextActivity}
          disabled={currentIndex === dailyActivities.length - 1}
        >
          Próximo →
        </button>
      </div>

      <EditActivityModal
        activity={editingActivity}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingActivity(null)
        }}
        onSave={handleSaveEdited}
      />
    </div>
  )
}

