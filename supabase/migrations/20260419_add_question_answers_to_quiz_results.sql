alter table public.quiz_results
add column if not exists question_answers jsonb not null default '[]'::jsonb;
