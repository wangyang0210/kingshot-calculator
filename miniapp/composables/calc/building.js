import raw from '../../data/buildings-calc.json'

function parseRes(v) {
  if (v == null) return 0
  const s = String(v).trim().toLowerCase().replace(/,/g, '')
  if (!s || s === '-' || s === '–') return 0
  const m = s.match(/^(-?\d+(?:\.\d+)?)([kmb])?$/i)
  if (m) {
    let n = parseFloat(m[1])
    const u = (m[2] || '').toLowerCase()
    if (u === 'k') n *= 1e3; else if (u === 'm') n *= 1e6; else if (u === 'b') n *= 1e9
    return n
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}
function parseTimeToSec(v) {
  if (v == null) return 0
  if (typeof v === 'number') return Math.max(0, Math.round(v * 60))
  let s = String(v).trim().toLowerCase()
  if (/^\d+(\.\d+)?$/.test(s)) return Math.max(0, Math.round(parseFloat(s) * 60))
  let d = 0, h = 0, m = 0, sec = 0
  s.replace(/(\d+)\s*d/g, (_, n) => { d = +n })
  s.replace(/(\d+)\s*h/g, (_, n) => { h = +n })
  s.replace(/(\d+)\s*m/g, (_, n) => { m = +n })
  s.replace(/(\d+)\s*s/g, (_, n) => { sec = +n })
  if (d + h + m + sec > 0) return d * 86400 + h * 3600 + m * 60 + sec
  const n = Number(s.replace(/,/g, ''))
  if (Number.isFinite(n)) return n >= 100000 ? Math.round(n) : Math.round(n * 60)
  return 0
}
function labelToLevelNumber(x) {
  if (typeof x === 'number') return x
  const s = String(x).trim().toUpperCase()
  if (/^\d+-\d+$/.test(s)) { const [a, b] = s.split('-').map(Number); return a + b }
  if (/^TG\d+$/.test(s)) { const n = +s.slice(2); return 30 + n * 5 }
  if (/^TG\d+-\d+$/.test(s)) { const [tg, sub] = s.split('-'); const n = +tg.slice(2); return 30 + n * 5 + (+sub) }
  const n = parseInt(s, 10)
  return Number.isFinite(n) ? n : 0
}

function tableToRows(table) {
  if (!Array.isArray(table) || !table.length) return []
  const header = table[0].map(String)
  const body = table.slice(1)
  const idx = {
    level: header.findIndex(h => String(h).includes('레벨')),
    meat: header.indexOf('빵'),
    wood: header.indexOf('나무'),
    coal: header.indexOf('석재'),
    iron: header.indexOf('철'),
    gold: (() => { let i = header.indexOf('순금'); if (i < 0) i = header.indexOf('크리스탈'); if (i < 0) i = header.indexOf('트루골드'); return i })(),
    time: (() => {
      let i = header.findIndex(h => String(h).includes('건설'))
      if (i < 0) i = header.findIndex(h => String(h) === '시간' || String(h).includes('시간'))
      if (i < 0) i = header.findIndex(h => String(h).includes('(분)'))
      return i
    })()
  }
  return body.map(row => {
    const get = (i) => (i >= 0 && i < row.length) ? row[i] : 0
    const level = labelToLevelNumber(get(idx.level))
    const meat = parseRes(get(idx.meat))
    const wood = parseRes(get(idx.wood))
    const coal = parseRes(get(idx.coal))
    const iron = parseRes(get(idx.iron))
    const crystals = parseRes(get(idx.gold))
    const time = parseTimeToSec(get(idx.time))
    return { level, meat, wood, coal, iron, crystals, time }
  }).filter(r => r.level > 0)
}

const all = {}
function buildIndex() {
  const list = Array.isArray(raw.buildings) ? raw.buildings : []
  for (const b of list) {
    const slug = String(b.slug || '').toLowerCase()
    if (!slug) continue
    if (Array.isArray(b.table) && b.table.length) all[slug] = tableToRows(b.table)
    if (Array.isArray(b.variants)) {
      for (const v of b.variants) {
        const key = `${slug}:${String(v.key || '').toLowerCase()}`
        if (Array.isArray(v.table) && v.table.length) all[key] = tableToRows(v.table)
      }
    }
  }
  if (all.command) all.commandcenter = all.command
  const campKey = Object.keys(all).find(k => k.startsWith('camp'))
  if (campKey) {
    const base = all[campKey]
    all['camp:common'] = base
    all.barracks = base
    all.stable = base
    all.range = base
    if (!all.infirmary) all.infirmary = base
  }
}
buildIndex()

function sumSegment(bKey, fromLevel, toLevel) {
  const rows = all[bKey] || []
  let meat = 0, wood = 0, coal = 0, iron = 0, crystals = 0, time = 0
  for (let lv = Math.max(1, fromLevel) + 1; lv <= toLevel; lv++) {
    const r = rows.find(x => x.level === lv)
    if (!r) continue
    meat += r.meat || 0
    wood += r.wood || 0
    coal += r.coal || 0
    iron += r.iron || 0
    crystals += r.crystals || 0
    time += r.time || 0
  }
  return { meat, wood, coal, iron, crystals, time }
}

function computeTimeFactor(buffs) {
  const speed =
    (Number(buffs.speedBonus) || 0) +
    (Number(buffs.wolfBonus) || 0) +
    (Number(buffs.positionBonus) || 0)
  const law = buffs.doubleTime ? 0.8 : 1.0
  return law / (1 + speed / 100)
}

function applySaul(res, saulPct) {
  const rate = Math.max(0, 1 - (Number(saulPct) || 0) / 100)
  return {
    meat: Math.round((res.meat || 0) * rate),
    wood: Math.round((res.wood || 0) * rate),
    coal: Math.round((res.coal || 0) * rate),
    iron: Math.round((res.iron || 0) * rate),
    crystals: Math.round(res.crystals || 0),
    timeSec: res.timeSec | 0
  }
}

export function calculate(opts) {
  const { buildingKey, startLevel, targetLevel, speedBonus=0, saulBonus=0, wolfBonus=0, positionBonus=0, doubleTime=false } = opts || {}
  const seg = sumSegment(buildingKey, Number(startLevel)||1, Number(targetLevel)||1)
  const tf = computeTimeFactor({ speedBonus, wolfBonus, positionBonus, doubleTime })
  const res = { ...seg, timeSec: Math.round(Math.max(0, seg.time * tf)) }
  return applySaul(res, saulBonus)
}
