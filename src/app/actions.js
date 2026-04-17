'use server'

import { supabase } from '@/lib/supabase'

// Запис результату в БД
export async function saveQuizResult(data) {
  const { error } = await supabase
    .from('quiz_results')
    .insert([data])

  if (error) {
    console.error('Помилка збереження:', error)
    throw new Error('Не вдалося зберегти результат')
  }
  return { success: true }
}

// Отримання всіх результатів для дашборду
export async function getQuizResults() {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Помилка завантаження:', error)
    return []
  }
  return data
}