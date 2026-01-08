import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'

interface LinkedInPost {
  id: string
  content: string
  publishedDate: Date
  likes: number
  comments: number
  url: string
}

class LinkedInScrapingService {
  async scrapePosts(leadId: string, linkedinUrl: string): Promise<LinkedInPost[]> {
    try {
      // NOTA: Scraping do LinkedIn pode violar os termos de serviço
      // Recomenda-se usar a API oficial do LinkedIn ou serviços como Unipile
      
      // Esta é uma implementação básica - em produção, use APIs oficiais
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })

      const page = await browser.newPage()
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      )

      try {
        await page.goto(linkedinUrl, {
          waitUntil: 'networkidle2',
          timeout: 30000,
        })

        // Aguardar carregamento dos posts
        await page.waitForSelector('[data-test-id="activity-entry"]', {
          timeout: 10000,
        }).catch(() => {
          // Se não encontrar, continuar mesmo assim
        })

        const content = await page.content()
        const $ = cheerio.load(content)

        const posts: LinkedInPost[] = []

        // Extrair posts (seletores podem variar)
        $('[data-test-id="activity-entry"]').each((index, element) => {
          const $el = $(element)
          
          const postContent = $el.find('.feed-shared-text').text().trim()
          const postUrl = $el.find('a[href*="/activity-"]').attr('href') || ''
          
          // Tentar extrair likes e comentários
          const likesText = $el.find('[aria-label*="like"]').text()
          const likes = this.parseNumber(likesText) || 0
          
          const commentsText = $el.find('[aria-label*="comment"]').text()
          const comments = this.parseNumber(commentsText) || 0

          if (postContent) {
            posts.push({
              id: `post-${Date.now()}-${index}`,
              content: postContent,
              publishedDate: new Date(), // Tentar extrair data real se possível
              likes,
              comments,
              url: postUrl.startsWith('http') ? postUrl : `https://linkedin.com${postUrl}`,
            })
          }
        })

        await browser.close()

        return posts.slice(0, 10) // Limitar a 10 posts mais recentes
      } catch (error) {
        await browser.close()
        throw error
      }
    } catch (error: any) {
      console.error('Erro ao fazer scraping do LinkedIn:', error.message)
      
      // Retornar array vazio em caso de erro (não quebrar o fluxo)
      // Em produção, você pode querer usar a API do LinkedIn ou Unipile
      return []
    }
  }

  private parseNumber(text: string): number | null {
    if (!text) return null
    
    // Remover espaços e caracteres não numéricos
    const cleaned = text.replace(/\D/g, '')
    const num = parseInt(cleaned, 10)
    
    return isNaN(num) ? null : num
  }

  // Método alternativo usando API (recomendado)
  async getPostsViaAPI(leadId: string, linkedinUrl: string): Promise<LinkedInPost[]> {
    // TODO: Implementar usando API oficial do LinkedIn ou Unipile
    // Por enquanto, retornar array vazio
    return []
  }
}

export const linkedinScrapingService = new LinkedInScrapingService()

