'use server'

import { supabase } from '@/lib/supabase'

// Запис результату в БД
export async function saveQuizResult(data) {
  const basePayload = {
    full_name: data.full_name,
    academic_group: data.academic_group,
    phone: data.phone,
    role_id: data.role_id,
    role_name: data.role_name,
  }

  const payloadWithAnswers = {
    ...basePayload,
    question_answers: data.question_answers ?? [],
  }

  const { error } = await supabase
    .from('quiz_results')
    .insert([payloadWithAnswers])

  if (error) {
    const missingQuestionAnswersColumn =
      (error.message || '').includes('question_answers') ||
      error.code === 'PGRST204'

    if (missingQuestionAnswersColumn) {
      console.warn('Колонка question_answers не знайдена. Зберігаємо без відповідей по питаннях.', error)

      const { error: fallbackError } = await supabase
        .from('quiz_results')
        .insert([basePayload])

      if (fallbackError) {
        console.error('Помилка fallback-збереження:', fallbackError)
        throw new Error('Не вдалося зберегти результат')
      }

      return {
        success: true,
        warning: 'Колонка question_answers ще не створена. Запустіть SQL-міграцію.',
      }
    }

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
