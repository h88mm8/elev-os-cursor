import { useState, useEffect } from 'react'
import { DailyActivity, CommunicationChannel, LinkedInAction } from '@/types'
import { openAIService } from '@/services/api'
import './EditActivityModal.css'

interface EditActivityModalProps {
  activity: DailyActivity | null
  isOpen: boolean
  onClose: () => void
  onSave: (activity: DailyActivity) => void
}

export function EditActivityModal({
  activity,
  isOpen,
  onClose,
  onSave,
}: EditActivityModalProps) {
  const [editedActivity, setEditedActivity] = useState<DailyActivity | null>(null)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    if (activity) {
      setEditedActivity({ ...activity })
    }
  }, [activity])

  if (!isOpen || !activity || !editedActivity) return null

  const handleChannelChange = async (newChannel: CommunicationChannel) => {
    setEditedActivity({
      ...editedActivity,
      channel: newChannel,
      linkedinAction: newChannel === CommunicationChannel.LINKEDIN ? LinkedInAction.CONNECT : undefined,
    })

    // Regenerar mensagem quando o canal muda
    if (newChannel !== activity.channel) {
      setRegenerating(true)
      try {
        const newMessage = await openAIService.generateMessage(
          activity.leadId,
          newChannel,
          'Gere uma mensagem personalizada para este canal'
        )
        setEditedActivity({
          ...editedActivity,
          channel: newChannel,
          message: newMessage,
        })
      } catch (error) {
        console.error('Erro ao regenerar mensagem:', error)
      } finally {
        setRegenerating(false)
      }
    }
  }

  const handleRegenerateMessage = async () => {
    setRegenerating(true)
    try {
      const newMessage = await openAIService.generateMessage(
        editedActivity.leadId,
        editedActivity.channel,
        'Gere uma nova mensagem personalizada'
      )
      setEditedActivity({
        ...editedActivity,
        message: newMessage,
      })
    } catch (error) {
      console.error('Erro ao regenerar mensagem:', error)
    } finally {
      setRegenerating(false)
    }
  }

  const handleSave = () => {
    onSave({
      ...editedActivity,
      status: 'edited',
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Editar Atividade</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Canal de Comunicação</label>
            <select
              value={editedActivity.channel}
              onChange={(e) =>
                handleChannelChange(e.target.value as CommunicationChannel)
              }
            >
              <option value={CommunicationChannel.EMAIL}>Email</option>
              <option value={CommunicationChannel.WHATSAPP}>WhatsApp</option>
              <option value={CommunicationChannel.LINKEDIN}>LinkedIn</option>
            </select>
          </div>

          {editedActivity.channel === CommunicationChannel.LINKEDIN && (
            <div className="form-group">
              <label>Ação do LinkedIn</label>
              <select
                value={editedActivity.linkedinAction || ''}
                onChange={(e) =>
                  setEditedActivity({
                    ...editedActivity,
                    linkedinAction: e.target.value as LinkedInAction,
                  })
                }
              >
                <option value={LinkedInAction.CONNECT}>Conectar</option>
                <option value={LinkedInAction.CONNECT_WITH_MESSAGE}>
                  Conectar com Mensagem
                </option>
                <option value={LinkedInAction.LIKE_POST}>Curtir Post</option>
                <option value={LinkedInAction.COMMENT_POST}>Comentar Post</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <div className="message-header">
              <label>Mensagem</label>
              <button
                className="regenerate-btn"
                onClick={handleRegenerateMessage}
                disabled={regenerating}
              >
                {regenerating ? 'Gerando...' : '🔄 Regenerar'}
              </button>
            </div>
            <textarea
              value={editedActivity.message}
              onChange={(e) =>
                setEditedActivity({
                  ...editedActivity,
                  message: e.target.value,
                })
              }
              rows={8}
              placeholder="Digite a mensagem..."
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

