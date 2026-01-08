import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { useToastStore } from '@/store/useToastStore'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { SearchFilters } from '@/types'
import { apolloService, leadsService } from '@/services/api'
import './SearchView.css'

export function SearchView() {
  const { addLead, setLoading, setError, isLoading } = useStore()
  const { success, error: showError } = useToastStore()
  const [filters, setFilters] = useState<SearchFilters>({})
  const [results, setResults] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    try {
      const leads = await apolloService.searchLeads(filters)
      setResults(leads)
      
      // Adicionar ao store
      leads.forEach((lead) => addLead(lead))
      
      // Salvar no backend
      setSaving(true)
      let savedCount = 0
      for (const lead of leads) {
        try {
          await leadsService.create(lead)
          savedCount++
        } catch (error: any) {
          // Se já existe, atualizar
          if (error.response?.status === 409 || error.response?.status === 400) {
            try {
              await leadsService.update(lead.id, lead)
              savedCount++
            } catch (updateError) {
              console.error(`Erro ao atualizar lead ${lead.id}:`, updateError)
            }
          } else {
            console.error(`Erro ao salvar lead ${lead.id}:`, error)
          }
        }
      }
      setSaving(false)
      success(`${savedCount} lead(s) encontrado(s) e salvos com sucesso!`)
    } catch (error: any) {
      console.error('Erro na busca:', error)
      const errorMsg = error.message || 'Erro ao buscar leads'
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setLoading(false)
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="search-view">
        <LoadingSpinner fullScreen message="Buscando leads..." />
      </div>
    )
  }

  return (
    <div className="search-view">
      <div className="search-header">
        <h2>Buscar Leads B2B</h2>
        <p>Use os filtros para encontrar leads qualificados</p>
      </div>

      <div className="search-filters">
        <div className="filter-group">
          <label>Cargo</label>
          <input
            type="text"
            placeholder="Ex: CEO, CTO, Diretor de Vendas"
            onChange={(e) =>
              setFilters({
                ...filters,
                jobTitle: e.target.value.split(',').map((s) => s.trim()),
              })
            }
          />
        </div>

        <div className="filter-group">
          <label>Tamanho da Empresa</label>
          <select
            onChange={(e) =>
              setFilters({ ...filters, companySize: [e.target.value] })
            }
          >
            <option value="">Selecione...</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="501-1000">501-1000</option>
            <option value="1001-5000">1001-5000</option>
            <option value="5001-10000">5001-10000</option>
            <option value="10001+">10001+</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Indústria</label>
          <input
            type="text"
            placeholder="Ex: Tecnologia, Saúde, Financeiro"
            onChange={(e) =>
              setFilters({
                ...filters,
                industry: e.target.value.split(',').map((s) => s.trim()),
              })
            }
          />
        </div>

        <div className="filter-group">
          <label>Localização</label>
          <input
            type="text"
            placeholder="Ex: São Paulo, Brasil"
            onChange={(e) =>
              setFilters({ ...filters, location: [e.target.value] })
            }
          />
        </div>

        <div className="filter-group">
          <label>Palavras-chave</label>
          <input
            type="text"
            placeholder="Palavras-chave relacionadas"
            onChange={(e) =>
              setFilters({
                ...filters,
                keywords: e.target.value.split(',').map((s) => s.trim()),
              })
            }
          />
        </div>

        <button 
          className="search-btn" 
          onClick={handleSearch}
          disabled={saving || isLoading}
        >
          {saving ? 'Salvando...' : isLoading ? 'Buscando...' : 'Buscar Leads'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="search-results">
          <h3>Resultados ({results.length})</h3>
          <div className="results-list">
            {results.map((lead) => (
              <div key={lead.id} className="result-card">
                <h4>
                  {lead.firstName} {lead.lastName}
                </h4>
                <p>{lead.jobTitle} at {lead.company.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

