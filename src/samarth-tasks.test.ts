import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('BP-702: vercel.json tests', () => {
  const vercelPath = path.resolve(process.cwd(), 'vercel.json')
  
  it('1. vercel.json should exist at the root directory', () => {
    expect(fs.existsSync(vercelPath)).toBe(true)
  })

  it('2. vercel.json should have valid JSON syntax', () => {
    expect(() => JSON.parse(fs.readFileSync(vercelPath, 'utf-8'))).not.toThrow()
  })

  it('3. vercel.json should contain a rewrites array', () => {
    const content = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'))
    expect(Array.isArray(content.rewrites)).toBe(true)
  })

  it('4. vercel.json should have a catch-all rewrite rule for SPA routing', () => {
    const content = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'))
    const rewrite = content.rewrites.find((r: any) => r.source === '/(.*)' && r.destination === '/index.html')
    expect(rewrite).toBeDefined()
  })

  it('5. vercel.json should have only one rewrite rule to prevent conflicts', () => {
    const content = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'))
    expect(content.rewrites.length).toBe(1)
  })
})

describe('BP-703: supabase.ts Guard tests', () => {
  const supabaseTsPath = path.resolve(process.cwd(), 'src/lib/supabase.ts')
  const content = fs.readFileSync(supabaseTsPath, 'utf-8')

  it('1. supabase.ts should exist in src/lib', () => {
    expect(fs.existsSync(supabaseTsPath)).toBe(true)
  })

  it('2. should explicitly check for missing env variables (!supabaseUrl || !supabaseAnonKey)', () => {
    expect(content).toContain('!supabaseUrl || !supabaseAnonKey')
  })

  it('3. should have a console.warn that alerts the user about missing variables', () => {
    expect(content).toContain('console.warn')
    expect(content).toContain('Missing env vars:')
  })

  it('4. should return a placeholder client instead of crashing if vars are missing', () => {
    expect(content).toContain('placeholder.supabase.co')
    expect(content).toContain('placeholder-anon-key')
  })

  it('5. should dynamically list which exact variables are missing', () => {
    expect(content).toContain('.filter(Boolean)')
  })
})

describe('BP-701 & BP-704: .env.example cleanup tests', () => {
  const envExamplePath = path.resolve(process.cwd(), '.env.example')
  const betaTestingPath = path.resolve(process.cwd(), 'BETA_TESTING.md')
  
  const envContent = fs.readFileSync(envExamplePath, 'utf-8')
  const betaTestingContent = fs.readFileSync(betaTestingPath, 'utf-8')

  it('1. .env.example should contain exactly 3 variables', () => {
    const lines = envContent.split('\n').filter(l => l.trim() !== '')
    expect(lines.length).toBe(3)
  })

  it('2. .env.example should NOT contain the stale VITE_DEV_SKIP_AUTH variable', () => {
    expect(envContent).not.toContain('VITE_DEV_SKIP_AUTH')
  })

  it('3. .env.example should contain the placeholder supabase URL', () => {
    expect(envContent).toContain('VITE_SUPABASE_URL=https://your-project.supabase.co')
  })

  it('4. .env.example should contain the placeholder anon key', () => {
    expect(envContent).toContain('VITE_SUPABASE_ANON_KEY=your-anon-key-here')
  })

  it('5. BETA_TESTING.md should NOT contain any references to VITE_DEV_SKIP_AUTH', () => {
    expect(betaTestingContent).not.toContain('VITE_DEV_SKIP_AUTH')
  })
})
