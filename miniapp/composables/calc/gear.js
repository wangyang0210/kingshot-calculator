import gear from '../../data/governor-gear.json'

export function keys() { return Object.keys(gear.steps) }
function sumRange(fromIdx, toIdx) {
  const ks = keys()
  let satin = 0, thread = 0, sketch = 0, score = 0
  for (let i = fromIdx + 1; i <= toIdx; i++) {
    const s = gear.steps[ks[i]] || {}
    satin += +s.satin || 0
    thread += +s.thread || 0
    sketch += +s.sketch || 0
    score += +s.score || 0
  }
  return { satin, thread, sketch, score }
}
export function calcGear({ fromIdx, toIdx }) {
  const from = Math.max(0, Number(fromIdx||0))
  const to = Math.max(from, Number(toIdx||from))
  if (to <= from) return { satin: 0, thread: 0, sketch: 0, score: 0 }
  return sumRange(from, to)
}
