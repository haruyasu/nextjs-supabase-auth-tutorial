'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Navigation from './navigation'
import type { Database } from '@/lib/database.types'

// 認証状態の監視
const SupabaseListener = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // プロフィールの取得
  let profile = null

  if (session) {
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    profile = currentProfile

    // メールアドレスを変更した場合、プロフィールを更新
    if (currentProfile && currentProfile.email !== session.user.email) {
      // メールアドレスを更新
      const { data: updatedProfile } = await supabase
        .from('profiles')
        .update({ email: session.user.email })
        .match({ id: session.user.id })
        .select('*')
        .single()

      profile = updatedProfile
    }
  }

  return <Navigation session={session} profile={profile} />
}

export default SupabaseListener
