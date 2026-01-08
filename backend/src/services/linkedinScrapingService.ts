// Puppeteer removido temporariamente para acelerar build
// Para reativar: npm install puppeteer@latest e descomentar código abaixo
// import puppeteer from 'puppeteer'
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
      
      // Puppeteer removido temporariamente para acelerar build
      // Para usar scraping com Puppeteer:
      // 1. Instale: npm install puppeteer@latest
      // 2. Descomente o código abaixo
      
      /*
      // Método 1: Usando Puppeteer (requer mais recursos)
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

        await page.waitForSelector('[data-test-id="activity-entry"]', {
          timeout: 10000,
        }).catch(() => {})

        const content = await page.content()
        const $ = cheerio.load(content)

        const posts: LinkedInPost[] = []

        $('[data-test-id="activity-entry"]').each((index, element) => {
          const $el = $(element)
          
          const postContent = $el.find('.feed-shared-text').text().trim()
          const postUrl = $el.find('a[href*="/activity-"]').attr('href') || ''
          
          const likesText = $el.find('[aria-label*="like"]').text()
          const likes = this.parseNumber(likesText) || 0
          
          const commentsText = $el.find('[aria-label*="comment"]').text()
          const comments = this.parseNumber(commentsText) || 0

          if (postContent) {
            posts.push({
              id: `post-${Date.now()}-${index}`,
              content: postContent,
              publishedDate: new Date(),
              likes,
              comments,
              url: postUrl.startsWith('http') ? postUrl : `https://linkedin.com${postUrl}`,
            })
          }
        })

        await browser.close()
        return posts.slice(0, 10)
      } catch (error) {
        await browser.close()
        throw error
      }
      */

      // Método alternativo: Usar Unipile API (recomendado para produção)
      // Ou retornar vazio temporariamente
      console.log('LinkedIn scraping via Puppeteer desabilitado. Use Unipile API para scraping.')
      return []
    } catch (error: any) {
      console.error('Erro ao fazer scraping do LinkedIn:', error.message)
      return []
    }
  }

  private parseNumber(text: string): number | null {
    if (!text) return null
    
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
