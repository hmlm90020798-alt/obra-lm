// tipos.js — sistema de tipos de hotspot partilhado entre editor, técnico e cliente
// Importar: import { TIPOS, getTipo, pinSVG, pinSz } from './tipos.js';

// ── Definição dos tipos built-in ─────────────────────────────────────────────
export const TIPOS = [
  { id:'equipamento',  label:'Equipamento',     forma:'circle',  sim:'N',  cor:'#2dd898', grupo:'equip'  },
  { id:'agua_fria',    label:'Água Fria',        forma:'drop',    sim:'❄',  cor:'#38bdf8', grupo:'hidra'  },
  { id:'agua_quente',  label:'Água Quente',      forma:'drop',    sim:'♨',  cor:'#fb923c', grupo:'hidra'  },
  { id:'esgoto',       label:'Esgoto',           forma:'hex',     sim:'↓',  cor:'#6b7280', grupo:'hidra'  },
  { id:'tomada',       label:'Tomada',           forma:'square',  sim:'⚡', cor:'#e8a234', grupo:'elec'   },
  { id:'circuito',     label:'Circuito Ded.',    forma:'square',  sim:'◎',  cor:'#b45309', grupo:'elec'   },
  { id:'led',          label:'Fita LED',         forma:'square',  sim:'∿',  cor:'#fde047', grupo:'elec'   },
  { id:'gas',          label:'Gás',              forma:'diamond', sim:'◈',  cor:'#f59e0b', grupo:'outros' },
  { id:'nota_imp',     label:'Nota Importante',  forma:'square',  sim:'!',  cor:'#f05252', grupo:'notas'  },
  { id:'nota_info',    label:'Nota Consultiva',  forma:'square',  sim:'i',  cor:'#9d7dea', grupo:'notas'  },
  { id:'confirmado',   label:'Confirmado',       forma:'square',  sim:'✓',  cor:'#2dd898', grupo:'notas'  },
];

export const GRUPOS = {
  equip:  'Equipamento',
  hidra:  'Hidráulica',
  elec:   'Eléctrico',
  outros: 'Outros',
  notas:  'Notas',
};

// Escalas por tamanho de pin: percentagem da largura da imagem
export const PIN_SCALE = { s:.025, m:.038, l:.055, xl:.075 };
export const PIN_MIN   = { s:16,   m:24,   l:32,   xl:44  };
export const PIN_MAX   = { s:28,   m:40,   l:56,   xl:72  };

// ── Funções ──────────────────────────────────────────────────────────────────

/**
 * Retorna o objecto tipo pelo id.
 * Aceita um array de tipos custom como segundo argumento.
 * Se não encontrar, devolve o primeiro tipo built-in.
 */
export function getTipo(id, tiposCustom = []) {
  return TIPOS.find(t => t.id === id)
    || tiposCustom.find(t => t.id === id)
    || TIPOS[0];
}

/**
 * Gera o SVG de um pin.
 * @param {string} tipoId  - id do tipo
 * @param {string} label   - label a mostrar (para equipamento: número; outros: símbolo do tipo)
 * @param {number} sz      - tamanho em px
 * @param {Array}  tiposCustom - array de tipos personalizados da obra
 */
export function pinSVG(tipoId, label, sz, tiposCustom = []) {
  const t    = getTipo(tipoId, tiposCustom);
  const cor  = t.cor;
  const sim  = tipoId === 'equipamento' ? label : t.sim;
  const cx   = sz / 2, cy = sz / 2, r = sz / 2 - 2;
  const fill = 'rgba(8,10,14,.92)';

  let sh = '';
  switch (t.forma) {
    case 'circle':
      sh = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${cor}" stroke-width="2"/>`;
      break;
    case 'drop':
      sh = `<ellipse cx="${cx}" cy="${cy - 1}" rx="${r}" ry="${r + 2}" fill="${fill}" stroke="${cor}" stroke-width="2"/>`;
      break;
    case 'hex': {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (60 * i - 30) * Math.PI / 180;
        return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
      }).join(' ');
      sh = `<polygon points="${pts}" fill="${fill}" stroke="${cor}" stroke-width="2"/>`;
      break;
    }
    case 'square': {
      const rx = Math.round(sz * 0.15);
      sh = `<rect x="2" y="2" width="${sz - 4}" height="${sz - 4}" rx="${rx}" fill="${fill}" stroke="${cor}" stroke-width="2"/>`;
      break;
    }
    case 'diamond':
      sh = `<polygon points="${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}" fill="${fill}" stroke="${cor}" stroke-width="2"/>`;
      break;
  }

  const fs = sim && sim.length > 1 ? Math.round(sz * 0.32) : Math.round(sz * 0.38);
  const tx = `<text x="${cx}" y="${cy + 1}" text-anchor="middle" dominant-baseline="middle" fill="${cor}" font-size="${fs}" font-family="DM Mono,monospace" font-weight="600">${sim}</text>`;

  return `<svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}" xmlns="http://www.w3.org/2000/svg">${sh}${tx}</svg>`;
}

/**
 * Calcula o tamanho em px de um pin com base na largura da imagem renderizada.
 * @param {string} sizeKey - 's' | 'm' | 'l' | 'xl'
 * @param {number} imgWidth - largura da imagem em px (getBoundingClientRect().width)
 */
export function pinSz(sizeKey, imgWidth) {
  const k = sizeKey || 'm';
  const w = imgWidth || 600;
  return Math.min(PIN_MAX[k], Math.max(PIN_MIN[k], Math.round(w * PIN_SCALE[k])));
}
