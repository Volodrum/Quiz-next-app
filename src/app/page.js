'use client'

import { useState, useEffect, useRef } from 'react';
import { saveQuizResult } from './actions';

// Дані квізу
const QUESTIONS = [
  { id: 1, text: "Мені подобається розробляти детальні плани та бачити кінцеву мету проєкту.", role: "strategist" },
  { id: 2, text: "Я отримую задоволення від знайомства та спілкування з великою кількістю нових людей.", role: "networker" },
  { id: 3, text: "Мені важливо, щоб усі документи, завдання та дедлайни були чітро структуровані.", role: "organizer" },
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
  { label: "Згоден", value: 2 },
  { label: "Скоріше згоден", value: 1 },
  { label: "Нейтрально", value: 0 },
  { label: "Скоріше не згоден", value: -1 },
  { label: "Не згоден", value: -2 }
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
  const [step, setStep] = useState("welcome"); // welcome, onboarding, quiz, result
  const [userInfo, setUserInfo] = useState({ fullName: "", group: "", phone: "" });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({
    strategist: 0, networker: 0, organizer: 0, communicator: 0, negotiator: 0, motivator: 0, innovator: 0
  });
  const [finalRole, setFinalRole] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [hasSavedResult, setHasSavedResult] = useState(false);

  // Refs for physics simulation
  const rolesContainerRef = useRef(null);
  const pillRefs = useRef([]);
  const physicsCleanup = useRef(null);

  // Fixed preset pill data for the welcome heap
  const WELCOME_PILLS = [
    { text: "🎯 Стратег",       color: "peach", w: 150 },
    { text: "🤝 Нетворкер",     color: "red",   w: 165 },
    { text: "📋",               color: "peach", w: 58 },
    { text: "📣 Комунікатор",   color: "red",   w: 185 },
    { text: "⚖️ Переговорник",  color: "peach", w: 192 },
    { text: "🔥",               color: "red",   w: 58 },
    { text: "💡 Інноватор",     color: "peach", w: 162 },
  ];

  const PILL_H = 44;

  // On mount: check localStorage for saved results
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quiz_result');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role && ROLES_INFO[parsed.role]) {
          setHasSavedResult(true);
        }
      }
    } catch (e) {
      // localStorage not available
    }
  }, []);

  // Matter.js physics simulation for welcome pills
  useEffect(() => {
    if (step !== 'welcome') return;
    let cancelled = false;

    const initPhysics = async () => {
      const Matter = (await import('matter-js')).default;
      if (cancelled) return;

      const container = rolesContainerRef.current;
      if (!container) return;
      // Wait one frame so pills are fully laid out before measuring sizes.
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (cancelled) return;

      const { width: cW, height: cH } = container.getBoundingClientRect();

      const pillSizes = WELCOME_PILLS.map((pill, i) => {
        const el = pillRefs.current[i];
        if (!el) {
          return { width: pill.w, height: PILL_H };
        }
        const rect = el.getBoundingClientRect();
        return {
          width: Math.max(48, Math.round(rect.width)),
          height: Math.max(32, Math.round(rect.height)),
        };
      });

      const engine = Matter.Engine.create({ gravity: { x: 0, y: 1.55 } });
      // Increase solver iterations to reduce body interpenetration.
      engine.positionIterations = 10;
      engine.velocityIterations = 8;
      engine.constraintIterations = 4;

      // Walls: bottom, left, right (no top — pills fall in from above)
      const wallOpts = { isStatic: true, friction: 0.8, restitution: 0.1 };
      Matter.Composite.add(engine.world, [
        Matter.Bodies.rectangle(cW / 2, cH + 25, cW + 100, 50, wallOpts),
        Matter.Bodies.rectangle(-25, cH / 2, 50, cH * 3, wallOpts),
        Matter.Bodies.rectangle(cW + 25, cH / 2, 50, cH * 3, wallOpts),
      ]);

      // Create pill bodies — staggered start positions above the viewport
      const bodies = WELCOME_PILLS.map((pill, i) => {
        const { width, height } = pillSizes[i];
        const xPadding = Math.min(40, Math.max(16, width / 2 + 8));
        return Matter.Bodies.rectangle(
          xPadding + Math.random() * Math.max(1, cW - xPadding * 2),
          -(i * 65 + 60),
          width,
          height,
          {
            chamfer: { radius: height / 2 },
            restitution: 0.25,
            friction: 0.6,
            slop: 0.01,
            density: 0.003,
            angle: (Math.random() - 0.5) * 0.5,
          }
        );
      });
      Matter.Composite.add(engine.world, bodies);

      // Run the physics engine
      const runner = Matter.Runner.create();
      Matter.Runner.run(runner, engine);

      // Render loop — direct DOM updates for 60fps performance
      let animId;
      const update = () => {
        bodies.forEach((body, i) => {
          const el = pillRefs.current[i];
          if (el) {
            const x = body.position.x - pillSizes[i].width / 2;
            const y = body.position.y - pillSizes[i].height / 2;
            el.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
            el.style.opacity = '1';
          }
        });
        animId = requestAnimationFrame(update);
      };
      animId = requestAnimationFrame(update);

      // Store cleanup function
      physicsCleanup.current = () => {
        cancelAnimationFrame(animId);
        Matter.Runner.stop(runner);
        Matter.Engine.clear(engine);
      };
    };

    initPhysics();

    return () => {
      cancelled = true;
      if (physicsCleanup.current) {
        physicsCleanup.current();
        physicsCleanup.current = null;
      }
    };
  }, [step]);

  // Restore saved results and jump to result screen
  const viewSavedResults = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('quiz_result'));
      if (saved && saved.role && ROLES_INFO[saved.role]) {
        setFinalRole(saved.role);
        setUserInfo({
          fullName: saved.fullName || "",
          group: saved.group || "",
          phone: saved.phone || ""
        });
        setIsSaved(true);
        setStep("result");
      }
    } catch (e) {
      // fail silently
    }
  };

  const handleStart = (e) => {
    e.preventDefault();
    
    // Phone validation
    const phoneDigits = userInfo.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setPhoneError("Будь ласка, введіть коректний номер телефону (мінімум 10 цифр)");
      return;
    }
    setPhoneError("");
    setStep("quiz");
  };

  const handleAnswer = (value) => {
    setSelectedAnswer(value);
    
    setTimeout(() => {
      const currentRole = QUESTIONS[currentQuestionIndex].role;
      const newScores = { 
        ...scores, 
        [currentRole]: scores[currentRole] + value 
      };
      setScores(newScores);
      setSelectedAnswer(null);

      if (currentQuestionIndex < QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        calculateResult(newScores);
      }
    }, 400);
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

    // Save to localStorage so user can view results after reload
    try {
      localStorage.setItem('quiz_result', JSON.stringify({
        role: winningRole,
        fullName: userInfo.fullName,
        group: userInfo.group,
        phone: userInfo.phone,
        timestamp: Date.now()
      }));
      setHasSavedResult(true);
    } catch (e) {
      // localStorage not available
    }

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
    setStep("welcome");
    setUserInfo({ fullName: "", group: "", phone: "" });
    setIsSaved(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        
        {/* Step 1: Welcome Page */}
        {step === "welcome" && (
          <div className="welcome-container">
            <div className="welcome-top">
              <div className="welcome-card">
                <div>
                  <h1 className="welcome-title">
                    Ролі, що підходять<br />твоєму стилю
                  </h1>
                </div>
                
                <div className="welcome-roles-wrapper" ref={rolesContainerRef}>
                  {WELCOME_PILLS.map((pill, i) => (
                    <div 
                      key={i}
                      ref={el => pillRefs.current[i] = el}
                      className={`floating-pill physics-pill ${pill.color === 'peach' ? 'pill-peach' : 'pill-red'}`}
                    >
                      {pill.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="welcome-bottom">
              <div className="welcome-bottom-inner">
                <h2 className="welcome-subtitle">
                  Контент квізу, підібраний під твої інтереси
                </h2>
                <p className="welcome-description">
                  Дізнайся свою ідеальну роль у Студентському уряді. Ми підберемо позицію, яка найкраще відповідає твоїм навичкам та амбіціям.
                </p>

                {/* Saved results banner */}
                {hasSavedResult && (
                  <div className="saved-results-banner">
                    <div className="saved-results-info">
                      <span className="saved-results-title">Ваш результат збережено</span>
                    </div>
                    <button onClick={viewSavedResults} className="saved-results-btn">
                      Переглянути
                    </button>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setStep("onboarding")}
                className="btn-primary"
              >
                Далі
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Onboarding (Registration) */}
        {step === "onboarding" && (
          <div className="onboarding-container">
            <div className="onboarding-header">
              <h1 className="onboarding-title">Давай познайомимось</h1>
              <p className="onboarding-subtitle">Ці дані допоможуть нам зберегти твій результат.</p>
            </div>
            
            <div className="onboarding-card">
              <form onSubmit={handleStart} className="form-layout">
                <div className="form-fields">
                  <div className="form-group">
                    <label className="form-label">Прізвище та Ім&apos;я</label>
                    <input 
                      required
                      type="text" 
                      className="input-field"
                      placeholder="Іваненко Іван"
                      value={userInfo.fullName}
                      onChange={e => setUserInfo({...userInfo, fullName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Академічна група</label>
                    <input 
                      required
                      type="text" 
                      className="input-field"
                      placeholder="Наприклад: КН-31"
                      value={userInfo.group}
                      onChange={e => setUserInfo({...userInfo, group: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Номер телефону</label>
                    <input 
                      required
                      type="tel" 
                      className={`input-field ${phoneError ? 'input-error' : ''}`}
                      placeholder="+380..."
                      value={userInfo.phone}
                      onChange={e => {
                        setUserInfo({...userInfo, phone: e.target.value});
                        if (phoneError) setPhoneError("");
                      }}
                    />
                    {phoneError && <p className="error-text">{phoneError}</p>}
                  </div>
                </div>
                
                <div className="form-submit-area">
                  <button 
                    type="submit"
                    className="btn-primary-full"
                  >
                    Почати тест
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Quiz Questions */}
        {step === "quiz" && (
          <div className="quiz-container">
            <div className="quiz-header">
              <h1 className="quiz-title">
                Час випробувати себе!
              </h1>
              <div className="progress-container">
                <svg className="progress-ring">
                  <circle 
                    cx="32" cy="32" r="28" 
                    fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" 
                  />
                  <circle 
                    cx="32" cy="32" r="28" 
                    fill="none" stroke="#bef264" strokeWidth="4" 
                    strokeDasharray={175.9}
                    strokeDashoffset={175.9 - (175.9 * (currentQuestionIndex + 1) / QUESTIONS.length)}
                    className="progress-ring-fill"
                  />
                </svg>
                <span className="progress-text">
                  {currentQuestionIndex + 1}/{QUESTIONS.length}
                </span>
              </div>
            </div>

            <div className="quiz-card">
              <div className="quiz-card-stack"></div>
              
              <div>
                <span className="question-badge">
                  Питання {currentQuestionIndex + 1}
                </span>
                <h2 className="question-text">
                  {QUESTIONS[currentQuestionIndex].text}
                </h2>
              </div>

              <div className="answers-list">
                {LIKERT_SCALE.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option.value)}
                    className={`answer-btn ${selectedAnswer === option.value ? 'selected' : ''}`}
                  >
                    <span>{option.label}</span>
                    {selectedAnswer === option.value && (
                      <div className="selected-icon">
                        <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === "result" && finalRole && ROLES_INFO[finalRole] && (
          <div className="results-container">
            <div className="results-card">
              <h1 className="results-header-title">Результати</h1>
              
              <div className="results-role-section">
                <h2 className="results-role-title">
                  Ти – {ROLES_INFO[finalRole].title}!
                </h2>
                <p className="results-role-subtitle">
                  «{ROLES_INFO[finalRole].subtitle}»
                </p>
              </div>

              <div className="aspect-cards-list">
                <div className="aspect-card">
                  <div className="aspect-card-header">
                    <div className="aspect-icon-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <h3 className="aspect-title">Твій прояв у нашій команді</h3>
                  </div>
                  <p className="aspect-description">{ROLES_INFO[finalRole].manifestation}</p>
                </div>

                <div className="aspect-card">
                  <div className="aspect-card-header">
                    <div className="aspect-icon-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                      </svg>
                    </div>
                    <h3 className="aspect-title">Твої можливості</h3>
                  </div>
                  <p className="aspect-description">{ROLES_INFO[finalRole].opportunities}</p>
                </div>

                <div className="aspect-card">
                  <div className="aspect-card-header">
                    <div className="aspect-icon-circle">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                        <polyline points="16 7 22 7 22 13" />
                      </svg>
                    </div>
                    <h3 className="aspect-title">Точки росту</h3>
                  </div>
                  <p className="aspect-description">{ROLES_INFO[finalRole].growth}</p>
                </div>
              </div>

              <button 
                onClick={restartQuiz}
                className="btn-primary-full"
              >
                Пройти ще раз
              </button>
              
              {isSaving && !isSaved && (
                <p className="saving-text">Зберігаємо результати...</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
