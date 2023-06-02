// Zustand Reactの状態管理ライブラリ
// https://github.com/pmndrs/zustand
import { create } from 'zustand'
import type { Database } from '@/lib/database.types'
type ProfileType = Database['public']['Tables']['profiles']['Row']

type StateType = {
  user: ProfileType
  setUser: (payload: ProfileType) => void
}

const useStore = create<StateType>((set) => ({
  // 初期値
  user: { id: '', email: '', name: '', introduce: '', avatar_url: '' },
  // アップデート
  setUser: (payload) => set({ user: payload }),
}))

export default useStore
