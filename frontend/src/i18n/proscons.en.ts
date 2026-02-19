/**
 * Translates dynamically-generated pros/cons from Portuguese to English.
 * Uses regex pattern matching since values contain dynamic numbers.
 */

type Replacement = string | ((match: RegExpMatchArray) => string);
type Pattern = [RegExp, Replacement];

const PATTERNS: Pattern[] = [
  // Supply
  [/Oferta máxima fixa — proteção contra inflação monetária/, 'Fixed maximum supply — protection against monetary inflation'],
  [/Sem limite de oferta máxima — risco de inflação contínua/, 'No maximum supply limit — risk of continuous inflation'],
  [/(\d+)% da oferta já em circulação — baixo risco de dumping futuro/, (m) => `${m[1]}% of supply already in circulation — low risk of future dumping`],
  [/Apenas (\d+)% em circulação — grande potencial de pressão vendedora futura/, (m) => `Only ${m[1]}% in circulation — large potential future selling pressure`],

  // Distribution
  [/⚠️ Controle centralizado: equipe \+ tesouraria sob a mesma entidade — risco real de decisões unilaterais/, '⚠️ Centralized control: team + treasury under same entity — real risk of unilateral decisions'],
  [/Distribuição equilibrada — baixa concentração em equipe e investidores/, 'Balanced distribution — low concentration among team and investors'],
  [/(\d+)% com equipe\/investidores — alta concentração de poder/, (m) => `${m[1]}% with team/investors — high power concentration`],
  [/(\d+)% da oferta sob controle efetivo de uma única entidade — descentralização é um mito/, (m) => `${m[1]}% of supply under effective control of a single entity — decentralization is a myth`],

  // Execution / Value accrual
  [/Gap de execução: o projeto prometeu muito mais do que entregou até agora/, 'Execution gap: the project promised far more than it has delivered so far'],
  [/Problema de captura de valor: o ecossistema cresce mas o token não acumula esse valor estruturalmente/, 'Value accrual problem: the ecosystem grows but the token does not structurally capture that value'],

  // FDV
  [/FDV ([\d.]+)x maior que Market Cap — grandes desbloqueios futuros = pressão vendedora estrutural/, (m) => `FDV ${m[1]}x larger than Market Cap — large future unlocks = structural selling pressure`],

  // VC
  [/Zero alocação para VCs — sem pressão vendedora de investidores institucionais/, 'Zero VC allocation — no institutional investor selling pressure'],

  // Utility
  [/Mecanismo de queima de fees — pressão deflacionária no token/, 'Fee burning mechanism — deflationary pressure on the token'],
  [/Staking disponível — incentiva holders de longo prazo/, 'Staking available — incentivizes long-term holders'],
  [/Poder de governança — token confere voz no protocolo/, 'Governance power — token gives voice in protocol decisions'],
  [/Reserva de valor digital — utilidade monetária comprovada como ativo de escassez programada/, 'Digital store of value — proven monetary utility as a programmatically scarce asset'],
  [/Meio de troca e colateral DeFi — espinha dorsal da liquidez em cripto/, 'Medium of exchange and DeFi collateral — backbone of crypto liquidity'],
  [/Token essencial para usar o protocolo — demanda orgânica garantida/, 'Token essential to use the protocol — guaranteed organic demand'],
  [/Sem mecanismo de queima — sem pressão deflacionária/, 'No burn mechanism — no deflationary pressure'],
  [/Token sem utilidade clara — risco de desvalorização estrutural/, 'Token with no clear utility — risk of structural devaluation'],

  // Vesting
  [/Vesting longo \(4\+ anos\) — equipe comprometida com o longo prazo/, 'Long vesting (4+ years) — team committed to the long term'],
  [/Vesting curto — risco de venda antecipada pela equipe\/investidores/, 'Short vesting — risk of early selling by team/investors'],

  // Treasury
  [/Tesouraria robusta com runway de 3\+ anos/, 'Robust treasury with 3+ year runway'],
  [/Tesouraria limitada — runway abaixo de 12 meses é preocupante/, 'Limited treasury — runway below 12 months is concerning'],

  // Development
  [/Alta atividade de desenvolvimento recente/, 'High recent development activity'],
  [/Sem commits recentes — possível estagnação técnica/, 'No recent commits — possible technical stagnation'],
];

function translateOne(item: string): string {
  for (const [pattern, replacement] of PATTERNS) {
    const match = item.match(pattern);
    if (match) {
      return typeof replacement === 'function' ? replacement(match) : replacement;
    }
  }
  // Fallback: return as-is (unknown string)
  return item;
}

/**
 * Translate an array of pros/cons strings.
 * If lang is 'pt', returns the original array unchanged.
 */
export function translateProsCons(items: string[], lang: 'pt' | 'en'): string[] {
  if (lang === 'pt') return items;
  return items.map(translateOne);
}
