import { create } from 'zustand'
import { Lead, DailyActivity, LeadStage, Company } from '@/types'

interface AppState {
  // Leads
  leads: Lead[]
  selectedLead: Lead | null
  
  // Atividades diárias
  dailyActivities: DailyActivity[]
  
  // Empresa do cliente (centro do sistema solar)
  clientCompany: Company | null
  
  // Estado da UI
  isLoading: boolean
  error: string | null
  
  // Ações
  setLeads: (leads: Lead[]) => void
  addLead: (lead: Lead) => void
  updateLead: (leadId: string, updates: Partial<Lead>) => void
  setSelectedLead: (lead: Lead | null) => void
  setDailyActivities: (activities: DailyActivity[]) => void
  updateDailyActivity: (activityId: string, updates: Partial<DailyActivity>) => void
  setClientCompany: (company: Company) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useStore = create<AppState>((set) => ({
  leads: [],
  selectedLead: null,
  dailyActivities: [],
  clientCompany: null,
  isLoading: false,
  error: null,

  setLeads: (leads) => set({ leads }),
  addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
  updateLead: (leadId, updates) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === leadId ? { ...lead, ...updates } : lead
      ),
    })),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setDailyActivities: (activities) => set({ dailyActivities: activities }),
  updateDailyActivity: (activityId, updates) =>
    set((state) => ({
      dailyActivities: state.dailyActivities.map((activity) =>
        activity.id === activityId ? { ...activity, ...updates } : activity
      ),
    })),
  setClientCompany: (company) => set({ clientCompany: company }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))

