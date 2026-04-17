'use client'

import { useState } from 'react';
import { saveQuizResult } from './actions';
import Link from 'next/link';

// Дані квізу
const QUESTIONS = [
  { id: 1, text: "Мені подобається розробляти детальні плани та бачити кінцеву мету проєкту.", role: "strategist" },
  { id: 2, text: "Я отримую задоволення від знайомства та спілкування з великою кількістю нових людей.", role: "networker" },
  { id: 3, text: "Мені важливо, щоб усі документи, завдання та дедлайни були чітко структуровані.", role: "organizer" },
  { id: 4, text: "Я можу легко та переконливо виступати перед аудиторією або презентувати ідею.", role: "communicator" },
  { id: 5, text: "У складних ситуаціях я вмію знайти рішення, яке влаштує всі сторони конфлікту.", role: "negotiator" },
  { id: 6, text: "Я часто помічаю, коли моїм колегам не вистачає енергії, і намагаюся їх підбадьорити.", role: "motivator" },
  { id: 7, text: "Я постійно шукаю нові способи покращення звичних процесів або впровадження технологій.", role: "innovator" },
  { id: 8, text: "Перед початком справи я завжди аналізую ризики та можливі перешкоди.", role: "strategist" },
  { id: 9, text: "Робота з таск-менеджерами (Trello, Notion, Google Calendar) приносить мені спокій.", role: "organizer" },
  { id: 10, text: "Написання текстів, постів або офіційних листів дається мені легко та швидко.", role: "communicator" },
  { id: 11, text: "Я маю широке коло контактів у різних сферах і знаю, до кого звернутися за допомогою.", role: "networker" },
  { id: 12, text: "Я часто пропоную креативні рішення, які виходять за рамки стандартних інструкцій.", role: "innovator" },
  { id: 13, text: "Я впевнено почуваюся під час обговорення умов співпраці або бюджетів.", role: "negotiator" },
  { id: 14, text: "Для мене важливо створювати дружню та комфортну атмосферу в команді.", role: "motivator" },
  { id: 15, text: "Я вмію виділяти головне в потоці інформації та будувати логічні ланцюжки.", role: "strategist" },
  { id: 16, text: "Мені подобається контролювати виконання завдань іншими людьми та стежити за якістю.", role: "organizer" },
  { id: 17, text: "Я перший/перша, хто тестує нові додатки, сервіси або ШІ-інструменти.", role: "innovator" },
  { id: 18, text: "Я вмію «продати» ідею так, щоб люди захотіли стати частиною проєкту.", role: "communicator" },
  { id: 19, text: "Я вмію м'яко переконувати людей, навіть якщо спочатку вони були налаштовані скептично.", role: "negotiator" },
  { id: 20, text: "Я вважаю, що успіх команди залежить від стосунків між людьми, а не лише від цифр.", role: "motivator" }
];

const LIKERT_SCALE = [
  { label: "Згоден", value: 2, color: "bg-green-500 hover:bg-green-600" },
  { label: "Скоріше згоден", value: 1, color: "bg-green-400 hover:bg-green-500" },
  { label: "Нейтрально", value: 0, color: "bg-gray-400 hover:bg-gray-500" },
  { label: "Скоріше не згоден", value: -1, color: "bg-red-400 hover:bg-red-500" },
  { label: "Не згоден", value: -2, color: "bg-red-500 hover:bg-red-600" }
];

const ROLES_INFO = {
  strategist: {
    title: "Стратег (The Visionary)",
    subtitle: "Бачу ціль — не бачу перешкод, лише логічні кроки до неї.",
    manifestation: "Ти — «архітектор» сенсів. Поки інші сперечаються про колір банера, ти думаєш, як цей івент вплине на рейтинг факультету через рік. Ти допомагаєш команді не втрачати фокус.",
    opportunities: "Розробка стратегії розвитку, аналітика запитів студентів, планування великих проєктів (форуми, вибори, реформи).",
    growth: "Навчайся не лише планувати, а й комунікувати свої ідеї так, щоб вони не здавалися надто складними для інших. Спробуй інструменти стратегічного менеджменту (SWOT, OKR)."
  },
  communicator: {
    title: "Комунікатор (The Voice)",
    subtitle: "Слова — це сила, і я знаю, як нею користуватися.",
    manifestation: "Ти — головний місток між ідеєю та аудиторією. Ти знаєш, як написати пост, який збере сотні репостів, або як виступити на сцені так, щоб усі повірили в успіх.",
    opportunities: "Спікер на заходах, ведення соцмереж (SMM), написання звернень до адміністрації, презентація проєктів перед інвесторами.",
    growth: "Розвивай навички сторітелінгу та публічних виступів. Вчися працювати з критикою в коментарях та аргументовано відстоювати позицію."
  },
  organizer: {
    title: "Організатор проєктів (The Architect)",
    subtitle: "Хаос — це просто план, який ще не записали.",
    manifestation: "Ти — фундамент. Завдяки тобі дедлайни не «горять», а кожен знає свою зону відповідальності. Ти перетворюєш абстрактні мрії на чіткі чек-листи.",
    opportunities: "Логістика івентів, координація роботи відділів, контроль фінансів та ресурсів, менеджмент волонтерів.",
    growth: "Працюй над навичкою делегування (не намагайся зробити все власноруч). Опановуй професійні таск-менеджери та методики."
  },
  negotiator: {
    title: "Переговорник (The Diplomat)",
    subtitle: "Будь-яке «ні» — це просто початок цікавої розмови.",
    manifestation: "Ти незамінний там, де потрібні ресурси або компроміси. Ти вмієш «зайти в кабінет» і вийти звідти з підписаним документом або вигідним партнерством.",
    opportunities: "Фандрейзинг (пошук спонсорів), комунікація з деканатом, вирішення конфліктів між студентами, міжнародне партнерство.",
    growth: "Поглиблюй знання з психології впливу та медіації. Вчися тримати емоційну стійкість під час складних дебатів."
  },
  motivator: {
    title: "Мотиватор (The Soul)",
    subtitle: "Команда — це передусім люди, а не лише завдання.",
    manifestation: "Ти створюєш атмосферу, в яку хочеться повертатися. Ти відчуваєш, коли хтось втомився, і знаєш, як надихнути команду на «друге дихання».",
    opportunities: "HR-напрямок, організація тімбілдінгів, внутрішня культура, адаптація новачків (першокурсників).",
    growth: "Вивчай основи лідерства та емоційного інтелекту. Твоє завдання — навчитися балансувати між «бути другом» та «бути лідером»."
  },
  innovator: {
    title: "Інноватор (The Disruptor)",
    subtitle: "А що, як ми зробимо це зовсім інакше?",
    manifestation: "Ти — генератор змін. Ти приносиш у команду тренди, нейромережі та нестандартні формати, не даючи структурі «запліснявіти».",
    opportunities: "Креативні шторми, впровадження нових сервісів для студентів (боти, додатки), редизайн застарілих процесів.",
    growth: "Вчися доводити свої ідеї до реалізації, а не лише генерувати їх. Опановуй дизайн-мислення."
  },
  networker: {
    title: "Нетворкер (The Connector)",
    subtitle: "У мене є контакт людини, яка точно знає, як це вирішити.",
    manifestation: "Твоя сила — у зв'язках. Ти знаєш, де знайти найкращого фотографа, до якого випускника звернутися за порадою або як швидко поширити інформацію.",
    opportunities: "Робота з випускниками, пошук спікерів для лекцій, зовнішні зв'язки з іншими університетами та ГО.",
    growth: "Працюй над системністю. Велика кількість контактів потребує порядку. Вчися будувати «глибокі» стосунки, а не лише горизонтальні знайомства."
  }
};

export default function QuizApp() {
  const [step, setStep] = useState("onboarding");
  const [userInfo, setUserInfo] = useState({ fullName: "", group: "", phone: "" });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({
    strategist: 0, networker: 0, organizer: 0, communicator: 0, negotiator: 0, motivator: 0, innovator: 0
  });
  const [finalRole, setFinalRole] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleStart = (e) => {
    e.preventDefault();
    if (userInfo.fullName && userInfo.group && userInfo.phone) {
      setStep("quiz");
    }
  };

  const handleAnswer = (value) => {
    const currentRole = QUESTIONS[currentQuestionIndex].role;
    const newScores = { 
      ...scores, 
      [currentRole]: scores[currentRole] + value 
    };
    setScores(newScores);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateResult(newScores);
    }
  };

  const calculateResult = async (finalScores) => {
    setIsSaving(true);
    let maxScore = -Infinity;
    let winningRole = "strategist";

    for (const [role, score] of Object.entries(finalScores)) {
      if (score > maxScore) {
        maxScore = score;
        winningRole = role;
      }
    }
    
    setFinalRole(winningRole);
    setStep("result");

    // Відправка даних на наш Next.js бекенд -> Supabase
    try {
      await saveQuizResult({
        full_name: userInfo.fullName,
        academic_group: userInfo.group,
        phone: userInfo.phone,
        role_id: winningRole,
        role_name: ROLES_INFO[winningRole].title
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Не вдалося зберегти результати в БД", err);
    } finally {
      setIsSaving(false);
    }
  };

  const restartQuiz = () => {
    setScores({ strategist: 0, networker: 0, organizer: 0, communicator: 0, negotiator: 0, motivator: 0, innovator: 0 });
    setCurrentQuestionIndex(0);
    setStep("onboarding");
    setUserInfo({ fullName: "", group: "", phone: "" });
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Лінк на адмінку */}
      <div className="w-full max-w-2xl flex justify-end mb-4">
        <Link href="/results" className="text-sm text-blue-600 hover:underline">
          Дивитися всі результати →
        </Link>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Екран 1: Реєстрація */}
        {step === "onboarding" && (
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Твоя роль у команді</h1>
              <p className="text-gray-500">Пройди тест, щоб дізнатися свої сильні сторони та ідеальну позицію в Студентському уряді.</p>
            </div>
            
            <form onSubmit={handleStart} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Прізвище та Ім'я</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Іваненко Іван"
                  value={userInfo.fullName}
                  onChange={e => setUserInfo({...userInfo, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Академічна група</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Наприклад: КН-31"
                  value={userInfo.group}
                  onChange={e => setUserInfo({...userInfo, group: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Номер телефону</label>
                <input 
                  required
                  type="tel" 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="+380..."
                  value={userInfo.phone}
                  onChange={e => setUserInfo({...userInfo, phone: e.target.value})}
                />
              </div>
              
              <button 
                type="submit"
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                Почати тест
              </button>
            </form>
          </div>
        )}

        {/* Екран 2: Запитання квізу */}
        {step === "quiz" && (
          <div className="p-8">
            <div className="mb-6">
              <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                <span>Питання {currentQuestionIndex + 1} з {QUESTIONS.length}</span>
                <span>{Math.round(((currentQuestionIndex) / QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestionIndex) / QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8 min-h-[80px] flex items-center justify-center">
              {QUESTIONS[currentQuestionIndex].text}
            </h2>

            <div className="flex flex-col space-y-3">
              {LIKERT_SCALE.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-white font-medium py-3 px-6 rounded-xl transition duration-200 shadow-sm ${option.color}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Екран 3: Результати */}
        {step === "result" && finalRole && (
          <div className="p-8">
            <div className="text-center mb-6 border-b pb-6 border-gray-200">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold tracking-wide uppercase mb-3">
                Твій результат
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                {ROLES_INFO[finalRole].title}
              </h1>
              <p className="text-lg text-gray-600 italic">
                "{ROLES_INFO[finalRole].subtitle}"
              </p>
            </div>

            <div className="space-y-5">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                  🦸 Твій прояв у команді:
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{ROLES_INFO[finalRole].manifestation}</p>
              </div>

              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center">
                  🚀 Можливості в студентському уряді:
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">{ROLES_INFO[finalRole].opportunities}</p>
              </div>

              <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                <h3 className="font-bold text-orange-900 mb-2 flex items-center">
                  📈 Точки росту:
                </h3>
                <p className="text-orange-800 text-sm leading-relaxed">{ROLES_INFO[finalRole].growth}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                disabled={isSaving || isSaved}
                className={`flex-1 font-bold py-3 px-6 rounded-xl transition duration-200 text-center ${
                  isSaved 
                    ? "bg-green-100 text-green-800 cursor-default" 
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {isSaving ? "Збереження..." : isSaved ? "Заявка подана! ✅" : "Подати заявку в команду"}
              </button>
              <button 
                onClick={restartQuiz}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition duration-200 text-center"
              >
                Пройти ще раз
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}