import * as fs from 'fs/promises'
import * as path from 'path'

export class DataStorage {
  private storageDir: string

  constructor(storageName: string) {
    // Criar diretório de armazenamento
    this.storageDir = path.join(process.cwd(), 'data', storageName)
    this.ensureDirExists()
  }

  private async ensureDirExists() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true })
    } catch (error) {
      // Diretório já existe
    }
  }

  private getFilePath(key: string): string {
    const safeKey = key.replace(/[^a-zA-Z0-9]/g, '_')
    return path.join(this.storageDir, `${safeKey}.json`)
  }

  async save(key: string, data: any): Promise<void> {
    try {
      await this.ensureDirExists()
      const filePath = this.getFilePath(key)
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error: any) {
      console.error(`Erro ao salvar dados para ${key}:`, error.message)
      throw error
    }
  }

  async get(key: string): Promise<any | null> {
    try {
      const filePath = this.getFilePath(key)
      const content = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(content)
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null
      }
      console.error(`Erro ao ler dados de ${key}:`, error.message)
      return null
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const filePath = this.getFilePath(key)
      await fs.unlink(filePath)
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        console.error(`Erro ao deletar dados de ${key}:`, error.message)
      }
    }
  }

  async list(): Promise<string[]> {
    try {
      await this.ensureDirExists()
      const files = await fs.readdir(this.storageDir)
      return files
        .filter((f) => f.endsWith('.json'))
        .map((f) => f.replace('.json', ''))
    } catch (error) {
      return []
    }
  }
}

