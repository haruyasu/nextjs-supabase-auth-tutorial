'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Loading from '@/app/loading'
import * as z from 'zod'
import type { Database } from '@/lib/database.types'
type Schema = z.infer<typeof schema>

// 入力データの検証ルールを定義
const schema = z
  .object({
    password: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
    confirmation: z.string().min(6, { message: '6文字以上入力する必要があります。' }),
  })
  .refine((data) => data.password === data.confirmation, {
    message: '新しいパスワードと確認用パスワードが一致しません。',
    path: ['confirmation'], // エラーメッセージが適用されるフィールド
  })

// パスワード変更
const Password = () => {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    // 初期値
    defaultValues: { password: '', confirmation: '' },
    // 入力値の検証
    resolver: zodResolver(schema),
  })

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true)
    setMessage('')

    try {
      // パスワードの更新
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        setMessage('エラーが発生しました。' + error.message)
        return
      }

      reset()
      setMessage('パスワードは正常に更新されました。')
    } catch (error) {
      setMessage('エラーが発生しました。' + error)
      return
    } finally {
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div>
      <div className="text-center font-bold text-xl mb-10">パスワード変更</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 新しいパスワード */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">新しいパスワード</div>
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="新しいパスワード"
            id="password"
            {...register('password', { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">{errors.password?.message}</div>
        </div>

        {/* 確認用パスワード */}
        <div className="mb-5">
          <div className="text-sm mb-1 font-bold">確認用パスワード</div>
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="確認用パスワード"
            id="confirmation"
            {...register('confirmation', { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">
            {errors.confirmation?.message}
          </div>
        </div>

        {/* 変更ボタン */}
        <div className="mb-5">
          {loading ? (
            <Loading />
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
            >
              変更
            </button>
          )}
        </div>

        {/* メッセージ */}
        {message && <div className="text-center text-sm text-red-500">{message}</div>}
      </form>
    </div>
  )
}

export default Password
