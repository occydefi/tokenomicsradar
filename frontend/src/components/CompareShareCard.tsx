import { useState, useCallback } from 'react';

interface CompareShareCardProps {
  token1: { name: string; symbol: string; score: number };
  token2: { name: string; symbol: string; score: number };
  metrics: { label: string; val1: string; val2: string; winner: 1 | 2 | null }[];
  onClose: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 8) return '#39d353';
  if (score >= 5) return '#f59e0b';
  return '#ff4444';
}

// Draw comparison card using Canvas API
function drawCompareCard(
  ctx: CanvasRenderingContext2D,
  W: number, H: number,
  token1: CompareShareCardProps['token1'],
  token2: CompareShareCardProps['token2'],
  metrics: CompareShareCardProps['metrics'],
) {
  const color1 = getScoreColor(token1.score);
  const color2 = getScoreColor(token2.score);

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#060d06');
  bg.addColorStop(0.5, '#0a1a0f');
  bg.addColorStop(1, '#08101a');
  ctx.fillStyle = bg;
  ctx.roundRect(0, 0, W, H, 24);
  ctx.fill();

  // Grid lines
  ctx.strokeStyle = '#39d35312';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Border
  ctx.strokeStyle = '#39d35360';
  ctx.lineWidth = 2;
  ctx.roundRect(1, 1, W - 2, H - 2, 23);
  ctx.stroke();

  // Top glow
  const glow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, 200);
  glow.addColorStop(0, '#39d35330');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, 200);

  // Corner dots
  [[16, 16], [W - 16, 16], [16, H - 16], [W - 16, H - 16]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#39d35380';
    ctx.fill();
  });

  // Logo emoji
  ctx.font = '42px serif';
  ctx.textAlign = 'center';
  ctx.fillText('⚔️', W / 2, 78);

  // Logo text
  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.fillStyle = '#39d353';
  ctx.fillText('Token', W / 2 - 54, 108);
  ctx.fillStyle = '#a855f7';
  ctx.fillText('omics', W / 2 + 6, 108);
  ctx.fillStyle = '#39d353';
  ctx.fillText('Radar', W / 2 + 64, 108);

  // Subtitle
  ctx.font = '11px "Courier New", monospace';
  ctx.fillStyle = '#2a4a2a';
  ctx.letterSpacing = '3px';
  ctx.fillText('COMPARAÇÃO DE TOKENOMICS', W / 2, 126);
  ctx.letterSpacing = '0px';

  // Divider
  ctx.strokeStyle = '#39d35320';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 150);
  ctx.lineTo(W - 60, 150);
  ctx.stroke();

  // Token 1
  ctx.font = 'bold 32px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = color1;
  ctx.fillText(token1.symbol.toUpperCase(), 60, 200);

  ctx.font = '16px "Courier New", monospace';
  ctx.fillStyle = '#888';
  ctx.fillText(token1.name.length > 20 ? token1.name.slice(0, 17) + '...' : token1.name, 60, 225);

  // Token 1 score
  ctx.font = 'bold 48px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = color1;
  const scoreBox1X = 120;
  const scoreBox1Y = 270;
  ctx.roundRect(scoreBox1X - 60, scoreBox1Y - 40, 120, 80, 12);
  ctx.fillStyle = color1 + '15';
  ctx.fill();
  ctx.strokeStyle = color1 + '60';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = color1;
  ctx.fillText(token1.score.toFixed(1), scoreBox1X, scoreBox1Y + 15);
  ctx.font = '12px "Courier New", monospace';
  ctx.fillStyle = '#888';
  ctx.fillText('/10', scoreBox1X, scoreBox1Y + 32);

  // VS divider
  ctx.font = 'bold 28px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#888';
  ctx.fillText('VS', W / 2, 290);

  // Token 2
  ctx.font = 'bold 32px "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillStyle = color2;
  ctx.fillText(token2.symbol.toUpperCase(), W - 60, 200);

  ctx.font = '16px "Courier New", monospace';
  ctx.fillStyle = '#888';
  ctx.fillText(token2.name.length > 20 ? token2.name.slice(0, 17) + '...' : token2.name, W - 60, 225);

  // Token 2 score
  ctx.font = 'bold 48px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = color2;
  const scoreBox2X = W - 120;
  const scoreBox2Y = 270;
  ctx.roundRect(scoreBox2X - 60, scoreBox2Y - 40, 120, 80, 12);
  ctx.fillStyle = color2 + '15';
  ctx.fill();
  ctx.strokeStyle = color2 + '60';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = color2;
  ctx.fillText(token2.score.toFixed(1), scoreBox2X, scoreBox2Y + 15);
  ctx.font = '12px "Courier New", monospace';
  ctx.fillStyle = '#888';
  ctx.fillText('/10', scoreBox2X, scoreBox2Y + 32);

  // Divider before metrics
  ctx.strokeStyle = '#39d35320';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 360);
  ctx.lineTo(W - 60, 360);
  ctx.stroke();

  // Metrics (top 5)
  ctx.font = '14px "Courier New", monospace';
  let y = 400;
  const topMetrics = metrics.slice(0, 5);
  topMetrics.forEach((m, i) => {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666';
    ctx.fillText(m.label, W / 2, y);

    ctx.textAlign = 'left';
    ctx.fillStyle = m.winner === 1 ? color1 : '#888';
    ctx.fillText(m.val1, 80, y + 22);
    if (m.winner === 1) {
      ctx.fillStyle = color1;
      ctx.fillText('✓', 50, y + 22);
    }

    ctx.textAlign = 'right';
    ctx.fillStyle = m.winner === 2 ? color2 : '#888';
    ctx.fillText(m.val2, W - 80, y + 22);
    if (m.winner === 2) {
      ctx.fillStyle = color2;
      ctx.fillText('✓', W - 50, y + 22);
    }

    y += 50;
  });

  // Footer URL
  ctx.font = '13px "Courier New", monospace';
  ctx.fillStyle = '#2a4a2a';
  ctx.textAlign = 'center';
  ctx.fillText('tokenomicsradar.vercel.app', W / 2, H - 30);
}

export default function CompareShareCard({ token1, token2, metrics, onClose }: CompareShareCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateImage = useCallback(() => {
    const canvas = document.createElement('canvas');
    const W = 800;
    const H = 700;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawCompareCard(ctx, W, H, token1, token2, metrics);

    canvas.toBlob(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      }
    }, 'image/png');
  }, [token1, token2, metrics]);

  const shareToX = () => {
    const text = `${token1.symbol} vs ${token2.symbol} — Análise de Tokenomics\n\n${token1.symbol}: ${token1.score}/10\n${token2.symbol}: ${token2.score}/10\n\nhttps://tokenomicsradar.vercel.app`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const text = `*${token1.symbol} vs ${token2.symbol}* — Análise de Tokenomics\n\n${token1.symbol}: ${token1.score}/10\n${token2.symbol}: ${token2.score}/10\n\nhttps://tokenomicsradar.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToTelegram = () => {
    const text = `${token1.symbol} vs ${token2.symbol} — Análise de Tokenomics\n\n${token1.symbol}: ${token1.score}/10\n${token2.symbol}: ${token2.score}/10\n\nhttps://tokenomicsradar.vercel.app`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://tokenomicsradar.vercel.app')}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText('https://tokenomicsradar.vercel.app');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `${token1.symbol}-vs-${token2.symbol}-tokenomics.png`;
    a.click();
  };

  const shareNative = async () => {
    if (!imageUrl) return;
    try {
      const blob = await fetch(imageUrl).then(r => r.blob());
      const file = new File([blob], `${token1.symbol}-vs-${token2.symbol}-tokenomics.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${token1.symbol} vs ${token2.symbol} — Tokenomics`,
          text: `Comparação de tokenomics: ${token1.symbol} (${token1.score}/10) vs ${token2.symbol} (${token2.score}/10)`,
        });
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-green-500/30 p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-green-400">📤 Compartilhar Comparação</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {!imageUrl && (
          <button onClick={generateImage} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-semibold mb-4 transition-colors">
            🎨 Gerar Imagem
          </button>
        )}

        {imageUrl && (
          <>
            <img src={imageUrl} alt="Share card" className="w-full rounded-xl mb-4 border border-green-500/20" />

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button onClick={shareToX} className="bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
                𝕏 Twitter
              </button>
              <button onClick={shareToWhatsApp} className="bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
                WhatsApp
              </button>
              <button onClick={shareToTelegram} className="bg-blue-500 hover:bg-blue-400 text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
                Telegram
              </button>
              <button onClick={shareNative} className="bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-lg font-medium text-sm transition-colors md:hidden">
                📱 Compartilhar
              </button>
              <button onClick={copyLink} className="bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-lg font-medium text-sm transition-colors hidden md:block">
                {copied ? '✓ Copiado!' : '🔗 Copiar Link'}
              </button>
            </div>

            <button onClick={downloadImage} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors">
              💾 Salvar Imagem
            </button>
          </>
        )}
      </div>
    </div>
  );
}
