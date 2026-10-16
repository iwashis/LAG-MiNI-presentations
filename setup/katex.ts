import { defineKatexSetup } from '@slidev/types'
import { texMacros } from '../lib/tex-macros'

export default defineKatexSetup(() => ({
  macros: { ...texMacros },
  strict: false,
}))
