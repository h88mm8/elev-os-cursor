import { useState, useEffect } from 'react'
import { settingsService } from '@/services/api'
import { useStore } from '@/store/useStore'
import { useToastStore } from '@/store/useToastStore'
import { initializeGTM } from '@/utils/tracking'
import './SettingsView.css'

export function SettingsView() {
  const { setClientCompany, clientCompany } = useStore()
  const { success, error: showError } = useToastStore()
  const [apiKeys, setApiKeys] = useState({
    apollo: '',
    unipile: '',
    openai: '',
    googleTagManager: '',
  })
  const [companyData, setCompanyData] = useState({
    name: '',
    domain: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Carregar configurações salvas
    const loadSettings = async () => {
      try {
        const settings = await settingsService.load()
        if (settings.apiKeys) {
          setApiKeys(settings.apiKeys)
        }
        if (settings.company) {
          setCompanyData(settings.company)
          if (clientCompany) {
            setClientCompany({
              ...clientCompany,
              ...settings.company,
            })
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    try {
      await settingsService.save({
        apiKeys,
        company: companyData,
      })

      // Atualizar empresa do cliente no store
      if (companyData.name) {
        setClientCompany({
          id: 'client-1',
          name: companyData.name,
          domain: companyData.domain,
          industry: '',
          size: '',
          revenue: '',
          location: '',
          description: companyData.description,
        })
      }

      // Inicializar GTM se configurado
      if (apiKeys.googleTagManager) {
        initializeGTM(apiKeys.googleTagManager)
      }

      setSaved(true)
      success('Configurações salvas com sucesso!')
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      showError('Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-view">
      <div className="settings-header">
        <h2>Configurações</h2>
        <p>Configure suas integrações e preferências</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h3>API Keys</h3>
          <div className="settings-form">
            <div className="form-group">
              <label>Apollo API Key</label>
              <input
                type="password"
                value={apiKeys.apollo}
                onChange={(e) =>
                  setApiKeys({ ...apiKeys, apollo: e.target.value })
                }
                placeholder="Digite sua chave da Apollo"
              />
            </div>

            <div className="form-group">
              <label>Unipile API Key</label>
              <input
                type="password"
                value={apiKeys.unipile}
                onChange={(e) =>
                  setApiKeys({ ...apiKeys, unipile: e.target.value })
                }
                placeholder="Digite sua chave da Unipile"
              />
            </div>

            <div className="form-group">
              <label>OpenAI API Key</label>
              <input
                type="password"
                value={apiKeys.openai}
                onChange={(e) =>
                  setApiKeys({ ...apiKeys, openai: e.target.value })
                }
                placeholder="Digite sua chave da OpenAI"
              />
            </div>

            <div className="form-group">
              <label>Google Tag Manager ID</label>
              <input
                type="text"
                value={apiKeys.googleTagManager}
                onChange={(e) =>
                  setApiKeys({
                    ...apiKeys,
                    googleTagManager: e.target.value,
                  })
                }
                placeholder="GTM-XXXXXXX"
              />
            </div>

            <button className="save-btn" onClick={handleSave}>
              Salvar Configurações
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>Empresa do Cliente</h3>
          <div className="settings-form">
            <div className="form-group">
              <label>Nome da Empresa</label>
              <input
                type="text"
                placeholder="Nome da sua empresa"
                value={companyData.name}
                onChange={(e) =>
                  setCompanyData({ ...companyData, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Domínio</label>
              <input
                type="text"
                placeholder="seusite.com"
                value={companyData.domain}
                onChange={(e) =>
                  setCompanyData({ ...companyData, domain: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                rows={4}
                placeholder="Descrição do seu produto/serviço"
                value={companyData.description}
                onChange={(e) =>
                  setCompanyData({ ...companyData, description: e.target.value })
                }
              ></textarea>
            </div>

            <button className="save-btn" onClick={handleSave} disabled={loading}>
              {loading ? 'Salvando...' : saved ? '✓ Salvo!' : 'Salvar Configurações'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

