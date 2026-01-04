import data from '../../data/governor-charm.json'

export function keys() { return Object.keys(data.steps) }
function sumUpgrade(fromIdx, toIdx) {
  const ks = keys()
  let manual = 0, blueprint = 0
  for (let i = fromIdx + 1; i <= toIdx; i++) {
    const s = data.steps[ks[i]] || {}
    manual += +s.manual || 0
    blueprint += +s.blueprint || 0
  }
  return { manual, blueprint }
}
export function calcCharm({ fromIdx, toIdx, cav=0, inf=0, arc=0 }) {
  const ks = keys()
  const from = Math.max(0, Number(fromIdx||0))
  const to = Math.max(from, Number(toIdx||from))
  const total = cav + inf + arc
  if (to <= from || total <= 0) return { manual: 0, blueprint: 0, attr: 0 }
  const cost = sumUpgrade(from, to)
  const attrTo = +((data.steps[ks[to]]||{}).attr || 0)
  const attrFrom = +((data.steps[ks[from]]||{}).attr || 0)
  const attrDelta = attrTo - attrFrom
  return {
    manual: cost.manual * total,
    blueprint: cost.blueprint * total,
    attr: attrDelta * total
  }
}
