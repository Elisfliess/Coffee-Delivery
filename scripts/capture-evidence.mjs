/**
 * Gera evidências visuais da versão mobile (tema claro e escuro).
 * Requer o servidor de desenvolvimento rodando: npm run dev
 * Uso: npm run evidence
 */
import { chromium } from 'playwright-core'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:5173'
const outputDir = join(process.cwd(), 'docs', 'evidence')
const chromeCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean)

const executablePath = chromeCandidates.find((candidate) => existsSync(candidate))
const browser = await chromium.launch({ headless: true, executablePath })
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
})

mkdirSync(outputDir, { recursive: true })

async function capture(name) {
  await page.screenshot({ path: join(outputDir, name), fullPage: true })
  console.log(`Evidência salva: docs/evidence/${name}`)
}

await page.goto(baseUrl, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Adicionar Latte ao carrinho' }).click()
await page.getByRole('button', { name: 'Adicionar Cappuccino ao carrinho' }).click()
await capture('mobile-light.png')

await page.getByRole('button', { name: /Abrir carrinho com 2 itens/ }).click()
await capture('mobile-cart.png')
await page.getByRole('button', { name: 'Fechar', exact: true }).click()

await page.getByRole('button', { name: 'Ativar modo escuro' }).click()
await capture('mobile-dark.png')

await browser.close()
