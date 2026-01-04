import zhCN_common from '../i18n/zh-CN/common.json'
import zhTW_common from '../i18n/zh-TW/common.json'
import en_common from '../i18n/en/common.json'
import ko_common from '../i18n/ko/common.json'
import ja_common from '../i18n/ja/common.json'

import zhCN_buildings from '../i18n/zh-CN/buildings.json'
import zhTW_buildings from '../i18n/zh-TW/buildings.json'
import en_buildings from '../i18n/en/buildings.json'
import ko_buildings from '../i18n/ko/buildings.json'
import ja_buildings from '../i18n/ja/buildings.json'

import zhCN_heroes from '../i18n/zh-CN/heroes.json'
import zhTW_heroes from '../i18n/zh-TW/heroes.json'
import en_heroes from '../i18n/en/heroes.json'
import ko_heroes from '../i18n/ko/heroes.json'
import ja_heroes from '../i18n/ja/heroes.json'

import zhCN_waracademy from '../i18n/zh-CN/waracademy.json'
import zhTW_waracademy from '../i18n/zh-TW/waracademy.json'
import en_waracademy from '../i18n/en/waracademy.json'
import ko_waracademy from '../i18n/ko/waracademy.json'
import ja_waracademy from '../i18n/ja/waracademy.json'

import zhCN_calc from '../i18n/zh-CN/calc.json'
import zhTW_calc from '../i18n/zh-TW/calc.json'
import en_calc from '../i18n/en/calc.json'
import ko_calc from '../i18n/ko/calc.json'
import ja_calc from '../i18n/ja/calc.json'

import zhCN_calcGear from '../i18n/zh-CN/calcGear.json'
import zhTW_calcGear from '../i18n/zh-TW/calcGear.json'
import en_calcGear from '../i18n/en/calcGear.json'
import ko_calcGear from '../i18n/ko/calcGear.json'
import ja_calcGear from '../i18n/ja/calcGear.json'

import zhCN_trainCalc from '../i18n/zh-CN/trainCalc.json'
import zhTW_trainCalc from '../i18n/zh-TW/trainCalc.json'
import en_trainCalc from '../i18n/en/trainCalc.json'
import ko_trainCalc from '../i18n/ko/trainCalc.json'
import ja_trainCalc from '../i18n/ja/trainCalc.json'

import zhCN_calcCharm from '../i18n/zh-CN/calcCharm.json'
import zhTW_calcCharm from '../i18n/zh-TW/calcCharm.json'
import en_calcCharm from '../i18n/en/calcCharm.json'
import ko_calcCharm from '../i18n/ko/calcCharm.json'
import ja_calcCharm from '../i18n/ja/calcCharm.json'
import zhCN_guides from '../i18n/zh-CN/guides.json'
import zhTW_guides from '../i18n/zh-TW/guides.json'
import en_guides from '../i18n/en/guides.json'
import ko_guides from '../i18n/ko/guides.json'
import ja_guides from '../i18n/ja/guides.json'

import zhCN_db from '../i18n/zh-CN/db.json'
import zhTW_db from '../i18n/zh-TW/db.json'
import en_db from '../i18n/en/db.json'
import ko_db from '../i18n/ko/db.json'
import ja_db from '../i18n/ja/db.json'

const dict = {
  'zh-CN': { common: zhCN_common, buildings: zhCN_buildings, heroes: zhCN_heroes, waracademy: zhCN_waracademy, calc: zhCN_calc, calcGear: zhCN_calcGear, calcCharm: zhCN_calcCharm, guides: zhCN_guides, db: zhCN_db, trainCalc: zhCN_trainCalc },
  'zh-TW': { common: zhTW_common, buildings: zhTW_buildings, heroes: zhTW_heroes, waracademy: zhTW_waracademy, calc: zhTW_calc, calcGear: zhTW_calcGear, calcCharm: zhTW_calcCharm, trainCalc: zhTW_trainCalc, guides: zhTW_guides, db: zhTW_db },
  'en': { common: en_common, buildings: en_buildings, heroes: en_heroes, waracademy: en_waracademy, calc: en_calc, calcGear: en_calcGear, calcCharm: en_calcCharm, trainCalc: en_trainCalc, guides: en_guides, db: en_db },
  'ko': { common: ko_common, buildings: ko_buildings, heroes: ko_heroes, waracademy: ko_waracademy, calc: ko_calc, calcGear: ko_calcGear, calcCharm: ko_calcCharm, trainCalc: ko_trainCalc, guides: ko_guides, db: ko_db },
  'ja': { common: ja_common, buildings: ja_buildings, heroes: ja_heroes, waracademy: ja_waracademy, calc: ja_calc, calcGear: ja_calcGear, calcCharm: ja_calcCharm, trainCalc: ja_trainCalc, guides: ja_guides, db: ja_db }
}

let current = 'zh-CN'

export function setLang(lang) {
  const l = (lang || '').toLowerCase()
  if (l.startsWith('zh-tw')) current = 'zh-TW'
  else if (l.startsWith('zh-cn') || l.startsWith('zh') || l.includes('hans')) current = 'zh-CN'
  else if (dict[lang]) current = lang
  else if (['en','ko','ja','zh-CN','zh-TW'].includes(lang)) current = lang
  else current = 'zh-CN'
  try { uni.setStorageSync('lang', current) } catch(e){}
}

export function getLang() {
  try {
    const s = uni.getStorageSync('lang')
    if (s) return s
  } catch(e){}
  return current
}

function lookup(key) {
  const parts = String(key).split('.', 2)
  const ns = parts.length > 1 ? parts[0] : 'common'
  const k = parts.length > 1 ? parts[1] : key
  const bag = dict[current][ns] || {}
  return bag[k]
}

export function t(key, fallback) {
  const v = lookup(key)
  return typeof v === 'undefined' ? (fallback || key) : v
}
