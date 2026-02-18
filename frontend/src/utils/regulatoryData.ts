export interface RegulatoryEntry {
  status: 'lawsuit' | 'sanctioned' | 'investigation' | 'warning' | 'settled' | 'clear';
  severity: 'high' | 'medium' | 'low';
  summary: string; // 1-2 sentences in Portuguese
  source?: string; // e.g. "SEC", "OFAC", "DOJ"
  year?: number;
}

export const REGULATORY_DATA: Record<string, RegulatoryEntry> = {
  'ripple': {
    status: 'lawsuit',
    severity: 'high',
    summary: 'XRP foi alvo de processo da SEC (2020) alegando que é um título não registrado. Parcialmente resolvido em 2023 — XRP não é título para investidores comuns, mas o caso institucional continua.',
    source: 'SEC',
    year: 2020,
  },
  'tornado-cash': {
    status: 'sanctioned',
    severity: 'high',
    summary: 'Tornado Cash foi sancionado pelo OFAC em 2022 por facilitar lavagem de dinheiro. Desenvolvedores presos. Uso proibido para cidadãos americanos.',
    source: 'OFAC',
    year: 2022,
  },
  'binancecoin': {
    status: 'investigation',
    severity: 'high',
    summary: 'Binance e seu CEO CZ aceitaram acordo de $4.3 bilhões com o DOJ em 2023 por violações de compliance. CZ renunciou e foi condenado a 4 meses de prisão.',
    source: 'DOJ',
    year: 2023,
  },
  'tron': {
    status: 'lawsuit',
    severity: 'high',
    summary: 'Justin Sun e Tron Foundation processados pela SEC em 2023 por manipulação de mercado e venda de tokens não registrados.',
    source: 'SEC',
    year: 2023,
  },
  'terra-luna': {
    status: 'investigation',
    severity: 'high',
    summary: 'Do Kwon (fundador do Terra/LUNA) foi preso em 2023 e enfrenta processos de fraude nos EUA e Coreia do Sul após colapso de $60B em 2022.',
    source: 'DOJ/SEC',
    year: 2022,
  },
  'monero': {
    status: 'warning',
    severity: 'medium',
    summary: 'Monero é alvo de reguladores por privacidade extrema. Removido de diversas exchanges reguladas. Sem processo formal mas com risco regulatório elevado.',
    source: 'Regulatório geral',
    year: 2023,
  },
  'zcash': {
    status: 'warning',
    severity: 'low',
    summary: 'Zcash tem recursos de privacidade que geram atenção regulatória em alguns países. Sem processo formal nos EUA.',
    source: 'Regulatório geral',
  },
  'dash': {
    status: 'warning',
    severity: 'low',
    summary: 'Dash possui recursos de privacidade (PrivateSend) que levaram à remoção de algumas exchanges reguladas.',
    source: 'Regulatório geral',
  },
  'solana': {
    status: 'warning',
    severity: 'low',
    summary: 'SOL foi listado como possível título em processo da SEC contra Binance e Coinbase em 2023. Sem processo direto contra Solana Labs.',
    source: 'SEC',
    year: 2023,
  },
  'cardano': {
    status: 'warning',
    severity: 'low',
    summary: 'ADA foi listado como possível título em processo da SEC contra Coinbase em 2023. Sem processo direto contra IOHK/Cardano Foundation.',
    source: 'SEC',
    year: 2023,
  },
  'polygon': {
    status: 'warning',
    severity: 'low',
    summary: 'MATIC foi listado como possível título em processo da SEC contra Coinbase em 2023.',
    source: 'SEC',
    year: 2023,
  },
  'matic-network': {
    status: 'warning',
    severity: 'low',
    summary: 'MATIC/POL foi listado como possível título em processo da SEC contra Coinbase em 2023.',
    source: 'SEC',
    year: 2023,
  },
  'cosmos': {
    status: 'warning',
    severity: 'low',
    summary: 'ATOM foi mencionado em processos da SEC como possível título não registrado em 2023.',
    source: 'SEC',
    year: 2023,
  },
  'algorand': {
    status: 'settled',
    severity: 'low',
    summary: 'Algorand Inc. chegou a acordo com a SEC em 2023 em relação à classificação do ALGO como título. Acordo por montante não divulgado.',
    source: 'SEC',
    year: 2023,
  },
};
