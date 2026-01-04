import DATA from '../../data/ks_training_promotion_per_troop.json'

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

export function getAvailableTiers() {
  const recsT = DATA.filter(r => String(r.mode) === 'training')
  const recsP = DATA.filter(r => String(r.mode) === 'promotion')
  const froms = new Set()
  const tosT = new Set()
  const tosP = new Set()
  for (const r of recsT) tosT.add(Number(r.toTier))
  for (const r of recsP) { froms.add(Number(r.fromTier)); tosP.add(Number(r.toTier)) }
  return {
    trainingTo: [...tosT].sort((a,b)=>a-b),
    promotionFrom: [...froms].sort((a,b)=>a-b),
    promotionTo: [...tosP].sort((a,b)=>a-b)
  }
}

function findRecord(mode, fromTier, toTier) {
  return DATA.find(r =>
    String(r.mode) === String(mode) &&
    String(r.fromTier ?? '') === String(fromTier ?? '') &&
    Number(r.toTier) === Number(toTier)
  )
}

export function calcByTime({ mode, fromTier, toTier, trainSpeedPct, days }) {
  const rec = findRecord(mode, fromTier, toTier)
  if (!rec || rec.time_sec_per_troop == null) return null
  const speedPct = clamp(Number(trainSpeedPct || 0), 0, 1000)
  const mult = 1 + (speedPct / 100)
  const t1 = Number(rec.time_sec_per_troop) / mult
  const totalSec = Math.max(0, Number(days || 0)) * 86400
  const n = Math.floor(totalSec / t1)
  const kvk1 = rec.kvk_points_per_troop ?? (rec.kvk_points_total && rec.amount ? rec.kvk_points_total / rec.amount : null)
  const hog1 = rec.hog_points_per_troop ?? (rec.hog_points_total && rec.amount ? rec.hog_points_total / rec.amount : null)
  const gov1 = rec.governor_points_per_troop ?? (rec.governor_points_total && rec.amount ? rec.governor_points_total / rec.amount : null)
  const pow1 = rec.power_per_troop ?? (rec.power_increase && rec.amount ? rec.power_increase / rec.amount : null)
  return {
    count: n,
    hogPer: hog1, hogTotal: hog1==null? null : hog1*n,
    kvkPer: kvk1, kvkTotal: kvk1==null? null : kvk1*n,
    govPer: gov1, govTotal: gov1==null? null : gov1*n,
    powPer: pow1, powTotal: pow1==null? null : pow1*n,
    timePerOne: t1,
    timeTotal: t1 * n
  }
}

export function calcByTroops({ mode, fromTier, toTier, trainSpeedPct, count }) {
  const rec = findRecord(mode, fromTier, toTier)
  if (!rec || rec.time_sec_per_troop == null) return null
  const speedPct = clamp(Number(trainSpeedPct || 0), 0, 1000)
  const mult = 1 + (speedPct / 100)
  const t1 = Number(rec.time_sec_per_troop) / mult
  const n = Math.max(1, Number(count || 1))
  const kvk1 = rec.kvk_points_per_troop ?? (rec.kvk_points_total && rec.amount ? rec.kvk_points_total / rec.amount : null)
  const hog1 = rec.hog_points_per_troop ?? (rec.hog_points_total && rec.amount ? rec.hog_points_total / rec.amount : null)
  const gov1 = rec.governor_points_per_troop ?? (rec.governor_points_total && rec.amount ? rec.governor_points_total / rec.amount : null)
  const pow1 = rec.power_per_troop ?? (rec.power_increase && rec.amount ? rec.power_increase / rec.amount : null)
  return {
    count: n,
    hogPer: hog1, hogTotal: hog1==null? null : hog1*n,
    kvkPer: kvk1, kvkTotal: kvk1==null? null : kvk1*n,
    govPer: gov1, govTotal: gov1==null? null : gov1*n,
    powPer: pow1, powTotal: pow1==null? null : pow1*n,
    timePerOne: t1,
    timeTotal: t1 * n
  }
}
