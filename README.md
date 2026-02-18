# 📡 TokenomicsRadar

> Plataforma de análise tokenômica completa para criptoativos — score 0-10 baseado em critérios objetivos

## ✨ Features

- 🔍 **Busca por ticker** (BTC, ETH, SOL, etc.)
- 📊 **Score 0-10** ponderado por critérios tokenômicos
- 📦 **Métricas de Oferta** — supply fixo vs inflacionário, % circulante
- 🥧 **Distribuição** — pie chart com equipe/VC/comunidade/tesouraria
- 🔐 **Vesting Schedule** — tokens bloqueados vs desbloqueados
- ⚡ **Score de Utilidade** — staking, governance, fee burning
- 🏦 **Tesouraria** — runway estimado em meses
- ✅⚠️ **Pros & Cons** — análise baseada em regras objetivas
- 🎯 **Radar Chart** — visão completa dos scores
- 🇧🇷 **Interface em Português (pt-BR)**

## 🌐 Live Demo

**https://tokenomicsradar.surge.sh**

## 🚀 Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Foccydefi%2Ftokenomicsradar&root-directory=frontend&framework=vite&build-command=npm+run+build&output-directory=dist)

Ou manualmente:
1. Vá em [vercel.com](https://vercel.com) → New Project
2. Importe `occydefi/tokenomicsradar` do GitHub
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy!

### GitHub Pages
Deploy automático via GitHub Actions (`.github/workflows/deploy.yml`) quando fizer push na branch `main`.

Para ativar: Settings → Pages → Source: GitHub Actions

## 🛠️ Desenvolvimento Local

```bash
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

## 📊 Dados

- **CoinGecko API** — sem API key necessária
- Rate limit: 30 req/min (free tier)
- Cobre 10.000+ tokens

## 🏗️ Stack

- React 18 + TypeScript
- Vite 7
- Tailwind CSS 4
- Recharts (PieChart + RadarChart)
- Axios

## 📈 Algoritmo de Score

| Critério | Peso |
|----------|------|
| Oferta & Inflação | 25% |
| Distribuição | 25% |
| Vesting | 20% |
| Utilidade Real | 20% |
| Tesouraria | 10% |

**Veredictos:**
- 🟢 8-10: **Excelente**
- 🟡 6.5-7.9: **Bom**
- 🟡 5-6.4: **Regular**
- 🔴 3.5-4.9: **Ruim**
- 🔴 0-3.4: **Evitar**

---

*Análise gerada automaticamente. Não constitui conselho financeiro. DYOR.*
