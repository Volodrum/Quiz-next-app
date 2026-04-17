import { getQuizResults } from '../actions';
import Link from 'next/link';

// Це серверний компонент. Він завантажує дані до того, як віддати HTML користувачу.
export const revalidate = 0; // Запобігає кешуванню, щоб завжди показувати свіжі дані

export default async function ResultsPage() {
  const results = await getQuizResults();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">База кандидатів</h1>
          <Link href="/" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            ← Назад до квізу
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Студент</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Група</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Визначена Роль</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Ще немає жодного результату.
                  </td>
                </tr>
              ) : (
                results.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{user.full_name}</div>
                      <div className="text-sm text-gray-500 mt-1">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {user.academic_group}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide">
                        {user.role_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('uk-UA', {
                        day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}