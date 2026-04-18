import { getQuizResults } from '../../actions';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  
  let results = await getQuizResults();
  
  // Apply search filter if provided
  if (search) {
    const term = search.toLowerCase();
    results = results.filter(user => 
      user.full_name.toLowerCase().includes(term) ||
      user.academic_group.toLowerCase().includes(term) ||
      user.role_name.toLowerCase().includes(term)
    );
  }
  
  const headers = ["Прізвище та Ім'я", "Група", "Телефон", "Роль", "Дата"];
  const rows = results.map(user => [
    user.full_name,
    user.academic_group,
    user.phone,
    user.role_name,
    new Date(user.created_at).toLocaleString('uk-UA').replace(',', '')
  ]);
  
  const csvContent = [
    headers.join(";"),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(";"))
  ].join("\r\n");
  
  const BOM = "\uFEFF";
  const fileName = `quiz_results_${new Date().toLocaleDateString('uk-UA').replace(/\./g, '-')}.csv`;
  
  return new Response(BOM + csvContent, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  });
}
