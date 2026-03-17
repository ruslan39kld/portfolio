import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Briefcase, Award, MessageSquare, Mail, 
  Download, Moon, Sun, Github, Linkedin, Send,
  ChevronDown, ChevronRight, X, Copy, Check, Menu,
  MapPin
} from 'lucide-react';
import { projects, certificates } from './data';

const Typewriter = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span>
      {displayedText}
      <span className="typewriter-cursor text-accent-primary">|</span>
    </span>
  );
};

const Counter = ({ end, duration = 1.5, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-semibold text-text-main section-title mb-2">
      <span className="text-accent-primary mr-2">//</span>
      {children}
    </h2>
  </div>
);

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);


export default function App() {
  const [activeTab, setActiveTab] = useState('about');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  // Projects state
  const [projectFilter, setProjectFilter] = useState('Все');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Certs state
  const [certFilter, setCertFilter] = useState('AI/ML');

  // Contacts state
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('success');
    setTimeout(() => setFormStatus('idle'), 5000);
  };

  const navItems = [
    { id: 'about', label: 'Обо мне', icon: Terminal },
    { id: 'projects', label: 'Проекты', icon: Briefcase },
    { id: 'certs', label: 'Сертификаты', icon: Award },
    { id: 'contacts', label: 'Контакты', icon: Mail },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <motion.div 
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Hero Section */}
            <section className="min-h-[80vh] flex flex-col justify-center pt-20 pb-0">
              <FadeIn>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider mb-4 glow-text uppercase">
                  Бельтюгов Руслан
                </h1>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="text-xl md:text-2xl text-accent-primary font-medium mb-6 h-8">
                  <Typewriter text="Vibe Coding + Frontier Deployment Engineer" delay={500} />
                </div>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg text-text-secondary max-w-2xl leading-relaxed mb-12">
                  Создаю AI-продукты от идеи до продакшена.<br/>
                  Без команды разработчиков. За дни — не месяцы.
                </p>
              </FadeIn>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                  { icon: "⚙️", value: 18, suffix: "+", label: "лет опыта" },
                  { icon: "🚀", value: 5, suffix: "", label: "AI MVP в продакшене" },
                  { icon: "📜", value: 19, suffix: "", label: "сертификатов" },
                  { icon: "🎯", value: 95, suffix: "%", label: "точность AI-систем" },
                ].map((stat, i) => (
                  <FadeIn key={i} delay={0.3 + i * 0.1}>
                    <div className="bg-bg-card border-t-2 border-accent-primary rounded-xl p-6 glow-box-hover text-center h-full">
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className="text-3xl font-orbitron font-bold text-text-main mb-1">
                        <Counter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-sm text-text-secondary">{stat.label}</div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>

            <div className="section-divider" style={{ margin: '20px 0' }}></div>

            {/* Who am I */}
            <section className="pt-0 pb-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Photo (40%) */}
                <FadeIn className="w-full md:w-[40%]">
                  <div style={{ height: '700px', borderRadius: '16px', overflow: 'hidden' }}>
                    <img
                      src="/photo.jpg"
                      alt="Руслан Бельтюгов"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                    />
                  </div>
                </FadeIn>

                {/* Text (60%) */}
                <FadeIn delay={0.1} className="w-full md:w-[60%] flex flex-col justify-center">
                  <SectionHeading>КТО Я</SectionHeading>
                  <div className="text-text-secondary leading-relaxed space-y-4">
                    <p>Я работаю на пересечении двух методологий:</p>
                    <p>
                      <strong className="text-text-main">VIBE CODING</strong> — стратегическое создание IT-продукта совместно с AI. 
                      Не просто "попросить написать код" — а продумать архитектуру, 
                      структуру данных, логику взаимодействия. Результат: сложные системы 
                      за дни вместо недель при качестве 95%.
                    </p>
                    <p>
                      <strong className="text-text-main">FRONTIER DEPLOYMENT ENGINEER</strong> — довожу созданный продукт до реального 
                      продакшена. Настраиваю инфраструктуру, деплой, интеграции, мониторинг.
                    </p>
                    <p>
                      Объединяю 18 лет управления проектами с современными AI-инструментами.
                    </p>
                  </div>
                </FadeIn>
              </div>
            </section>

            {/* Tech Stack */}
            <section className="py-10">
              <SectionHeading>ТЕХНОЛОГИИ</SectionHeading>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Все', 'AI/ML', 'Backend', 'Frontend', 'Analytics', 'Deploy'].map((filter) => (
                  <button 
                    key={filter}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filter === 'Все' ? 'bg-accent-primary text-white' : 'bg-bg-card text-text-secondary hover:text-text-main border border-border-accent'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { name: "Claude API", cat: "AI/ML" },
                  { name: "GigaChat API", cat: "AI/ML" },
                  { name: "FAISS", cat: "AI/ML" },
                  { name: "BM25", cat: "AI/ML" },
                  { name: "RAG", cat: "AI/ML" },
                  { name: "Python", cat: "Backend" },
                  { name: "FastAPI", cat: "Backend" },
                  { name: "React", cat: "Frontend" },
                  { name: "TypeScript", cat: "Frontend" },
                  { name: "Power BI", cat: "Analytics" },
                  { name: "Power Query", cat: "Analytics" },
                  { name: "Excel", cat: "Analytics" },
                  { name: "Amvera", cat: "Deploy" },
                  { name: "Telegram API", cat: "Deploy" },
                  { name: "Yandex API", cat: "Deploy" },
                  { name: "NLP", cat: "Deploy" },
                ].map((tech, i) => (
                  <FadeIn key={i} delay={i * 0.05}>
                    <div className="bg-bg-card border border-border-accent rounded-xl p-4 text-center glow-box-hover h-full flex flex-col justify-center items-center gap-2">
                      <div className="font-medium text-text-main text-sm">{tech.name}</div>
                      <div className="text-[10px] uppercase tracking-wider text-accent-secondary opacity-70">{tech.cat}</div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>

            {/* Methodology */}
            <section className="py-10 mb-20">
              <SectionHeading>МЕТОДОЛОГИЯ</SectionHeading>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: "💡",
                    title: "Vibe Coding",
                    desc: "Стратегическое создание AI-продуктов. Архитектура → Логика → Код → Тест. Цикл разработки: дни вместо недель."
                  },
                  {
                    icon: "🔧",
                    title: "Frontier Deployment",
                    desc: "От кода до продакшена. Инфраструктура, деплой, интеграция, мониторинг и сопровождение."
                  },
                  {
                    icon: "⚡",
                    title: "Vs No-Code",
                    desc: "Не ограничен шаблонами платформ. Полноценный код — нестандартные решения. RAG, AI-агенты, сложная бизнес-логика."
                  }
                ].map((method, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="bg-bg-card border border-border-accent rounded-xl p-8 glow-box-hover h-full hover:-translate-y-3 transition-transform duration-300">
                      <div className="text-4xl mb-4">{method.icon}</div>
                      <h3 className="text-xl font-orbitron font-semibold text-text-main mb-3">{method.title}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{method.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </section>
          </motion.div>
        );
      
      case 'projects':
        const filteredProjects = projectFilter === 'Все' 
          ? projects 
          : projects.filter(p => p.category.includes(projectFilter));

        return (
          <motion.div 
            key="projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-12"
          >
            <div className="mb-12">
              <h1 className="text-4xl font-orbitron font-bold text-text-main mb-2 uppercase">
                <span className="text-accent-primary mr-3">//</span>ПРОЕКТЫ
              </h1>
              <p className="text-text-secondary text-lg">5 реализованных AI MVP в продакшене</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
              {['Все', 'AI/ML', 'Analytics', 'Telegram', 'Web'].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setProjectFilter(filter)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    projectFilter === filter ? 'bg-accent-primary text-white' : 'bg-bg-card text-text-secondary hover:text-text-main border border-border-accent'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
              {filteredProjects.map((project, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-bg-card border border-border-accent border-l-4 border-l-accent-primary rounded-xl p-6 glow-box-hover h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-4xl">{project.icon}</span>
                      <span className="bg-accent-primary/10 text-accent-secondary text-xs px-3 py-1 rounded-full border border-accent-primary/30">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-orbitron font-semibold text-text-main mb-3">{project.title}</h3>
                    <p className="text-text-secondary text-sm mb-4 flex-grow">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((t, j) => (
                        <span key={j} className="tech-badge">{t}</span>
                      ))}
                    </div>
                    
                    <div className="text-emerald-400 text-sm font-medium mb-6">
                      {project.result}
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-border-accent">
                      <span className="text-xs text-text-secondary">{project.year}</span>
                      <button 
                        onClick={() => setSelectedProject(project)}
                        className="btn-ghost px-4 py-2 rounded-md text-sm flex items-center gap-2"
                      >
                        Подробнее <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </motion.div>
        );

      case 'certs':
        const certCategories = ['AI/ML', 'Управление проектами', 'Аналитика', 'Благодарности', 'Цифровые'];
        const filteredCerts = certificates.filter(c => c.category === certFilter);

        return (
          <motion.div 
            key="certs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-12"
          >
            <div className="mb-12">
              <h1 className="text-4xl font-orbitron font-bold text-text-main mb-2 uppercase">
                <span className="text-accent-primary mr-3">//</span>СЕРТИФИКАТЫ И ПРИЗНАНИЕ
              </h1>
              <p className="text-text-secondary text-lg">19 документов подтверждённой экспертизы</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {certCategories.map((filter) => {
                const count = certificates.filter(c => c.category === filter).length;
                return (
                  <button 
                    key={filter}
                    onClick={() => setCertFilter(filter)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                      certFilter === filter ? 'bg-accent-primary text-white' : 'bg-bg-card text-text-secondary hover:text-text-main border border-border-accent'
                    }`}
                  >
                    {filter === 'AI/ML' ? '🤖 ' : filter === 'Управление проектами' ? '📋 ' : filter === 'Аналитика' ? '📊 ' : filter === 'Благодарности' ? '⭐ ' : '💡 '}
                    {filter} ({count})
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-20">
              {filteredCerts.map((cert, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="bg-bg-card border border-border-accent rounded-xl p-5 flex items-center gap-4 glow-box-hover">
                    <div className="text-3xl opacity-80">
                      {cert.category === 'AI/ML' ? '🤖' : cert.category === 'Управление проектами' ? '📋' : cert.category === 'Аналитика' ? '📊' : cert.category === 'Благодарности' ? '⭐' : '💡'}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-sm text-text-main mb-1">{cert.title}</h4>
                      <div className="text-xs text-accent-secondary">{cert.org}</div>
                    </div>
                    <div className="bg-bg-main px-2 py-1 rounded text-xs text-text-secondary border border-border-accent whitespace-nowrap">
                      {cert.year}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </motion.div>
        );

      case 'contacts':
        return (
          <motion.div 
            key="contacts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-12"
          >
            <div className="mb-12">
              <h1 className="text-4xl font-orbitron font-bold text-text-main mb-2 uppercase">
                <span className="text-accent-primary mr-3">//</span>ДАВАЙТЕ РАБОТАТЬ ВМЕСТЕ
              </h1>
              <p className="text-text-secondary text-lg">Открыт для AI-проектов, консультаций и сотрудничества</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-20">
              {/* Left Column - Contacts */}
              <div className="grid sm:grid-cols-2 gap-4 h-fit">
                <FadeIn delay={0.1}>
                  <div className="bg-bg-card border border-border-accent rounded-xl p-6 glow-box-hover flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-2">
                      <MessageSquare size={24} />
                    </div>
                    <h3 className="font-medium text-text-main">Telegram</h3>
                    <p className="text-sm text-text-secondary mb-2">@ruslan_beltugov</p>
                    <button 
                      onClick={() => handleCopy('@ruslan_beltugov', 'tg')}
                      className="text-xs btn-ghost px-4 py-1.5 rounded-full flex items-center gap-2 mt-auto"
                    >
                      {copiedField === 'tg' ? <><Check size={14} /> Скопировано</> : <><Copy size={14} /> Копировать</>}
                    </button>
                  </div>
                </FadeIn>
                
                <FadeIn delay={0.2}>
                  <div className="bg-bg-card border border-border-accent rounded-xl p-6 glow-box-hover flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-2">
                      <Mail size={24} />
                    </div>
                    <h3 className="font-medium text-text-main">Email</h3>
                    <p className="text-sm text-text-secondary mb-2">ruslan@example.com</p>
                    <button 
                      onClick={() => handleCopy('ruslan@example.com', 'email')}
                      className="text-xs btn-ghost px-4 py-1.5 rounded-full flex items-center gap-2 mt-auto"
                    >
                      {copiedField === 'email' ? <><Check size={14} /> Скопировано</> : <><Copy size={14} /> Копировать</>}
                    </button>
                  </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <div className="bg-bg-card border border-border-accent rounded-xl p-6 glow-box-hover flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-2">
                      <Github size={24} />
                    </div>
                    <h3 className="font-medium text-text-main">GitHub / Behance</h3>
                    <p className="text-sm text-text-secondary mb-2">Портфолио и код</p>
                    <a href="#" className="text-xs text-accent-primary hover:underline mt-auto">Перейти в профиль →</a>
                  </div>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <div className="bg-bg-card border border-border-accent rounded-xl p-6 glow-box-hover flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary mb-2">
                      <MapPin size={24} />
                    </div>
                    <h3 className="font-medium text-text-main">Локация</h3>
                    <p className="text-sm text-text-secondary">Россия</p>
                    <p className="text-xs text-emerald-400 mt-auto">Удалённая работа</p>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column - Form */}
              <FadeIn delay={0.3}>
                <div className="bg-bg-card border border-border-accent rounded-xl p-8 glow-box">
                  <h3 className="text-2xl font-orbitron font-semibold text-text-main mb-6">Оставить заявку</h3>
                  
                  {formStatus === 'success' ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-lg flex items-start gap-3">
                      <Check className="shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Запрос отправлен!</p>
                        <p className="text-sm opacity-80 mt-1">Отвечу в течение 24 часов ✓</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm text-text-secondary mb-1.5">Ваше имя *</label>
                        <input required type="text" className="w-full bg-bg-main border border-border-accent rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" placeholder="Иван Иванов" />
                      </div>
                      <div>
                        <label className="block text-sm text-text-secondary mb-1.5">Email *</label>
                        <input required type="email" className="w-full bg-bg-main border border-border-accent rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all" placeholder="ivan@example.com" />
                      </div>
                      <div>
                        <label className="block text-sm text-text-secondary mb-1.5">Тип проекта</label>
                        <select className="w-full bg-bg-main border border-border-accent rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all appearance-none">
                          <option>AI-бот</option>
                          <option>Дашборд</option>
                          <option>Платформа</option>
                          <option>Деплой</option>
                          <option>Консультация</option>
                          <option>Другое</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-text-secondary mb-1.5">Опишите задачу</label>
                        <textarea rows={4} className="w-full bg-bg-main border border-border-accent rounded-lg px-4 py-3 text-text-main focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all resize-none" placeholder="Краткое описание проекта..."></textarea>
                      </div>
                      <button type="submit" className="btn-primary w-full py-3.5 rounded-lg font-medium flex justify-center items-center gap-2 mt-2">
                        <Send size={18} /> Отправить запрос
                      </button>
                    </form>
                  )}
                </div>
              </FadeIn>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-main text-text-main font-inter relative selection:bg-accent-primary/30">
      {/* Background Effects */}
      <div className="scan-line"></div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-bg-sidebar/90 backdrop-blur-md border-b border-border-accent z-40 flex items-center justify-between px-4">
        <div className="font-orbitron font-bold text-lg glow-text">RB_ENGINEER</div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-accent-primary p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className={`fixed md:sticky top-0 left-0 h-screen w-[280px] bg-bg-sidebar border-r border-accent-primary/30 z-50 flex flex-col ${isMobileMenuOpen ? 'shadow-2xl shadow-black' : ''}`}
          >
            {/* Mobile Close */}
            <button 
              className="md:hidden absolute top-4 right-4 text-text-secondary hover:text-text-main"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>

            {/* Profile Info */}
            <div className="p-8 flex flex-col items-center text-center border-b border-border-accent">
              <div className="relative mb-4">
                <div className="w-[110px] h-[110px] rounded-full border-2 border-accent-primary animate-pulse-glow overflow-hidden bg-bg-card flex items-center justify-center">
                  <span className="text-4xl">👨‍💻</span>
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-bg-sidebar animate-pulse"></div>
              </div>
              <h2 className="font-orbitron text-lg font-bold text-text-main mb-1">Бельтюгов Руслан</h2>
              <p className="text-sm text-accent-primary mb-3 leading-tight">Vibe Coding +<br/>Frontier Deployment Engineer</p>
              <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-bg-main px-3 py-1 rounded-full border border-border-accent">
                <MapPin size={12} /> Россия
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 768) setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30 glow-box' 
                        : 'text-text-secondary hover:bg-bg-card hover:text-text-main'
                    }`}
                  >
                    <item.icon size={18} className={isActive ? 'text-accent-primary' : ''} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-border-accent space-y-4">
              <button className="btn-primary w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <Download size={16} /> Скачать резюме
              </button>
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-3">
                  <a href="#" className="w-8 h-8 rounded-full bg-bg-card border border-border-accent flex items-center justify-center text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors">
                    <Send size={14} />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-bg-card border border-border-accent flex items-center justify-center text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors">
                    <Github size={14} />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-bg-card border border-border-accent flex items-center justify-center text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors">
                    <Linkedin size={14} />
                  </a>
                </div>
                <button 
                  onClick={() => setIsDarkTheme(!isDarkTheme)}
                  className="text-text-secondary hover:text-text-main transition-colors"
                >
                  {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-10 md:pl-0 pt-16 md:pt-0 h-screen overflow-y-auto overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </main>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-bg-sidebar border border-accent-primary/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(255,107,0,0.15)]"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-text-secondary hover:text-text-main bg-bg-card rounded-full p-2 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl">{selectedProject.icon}</span>
                  <div>
                    <span className="text-accent-primary text-xs font-bold uppercase tracking-wider mb-1 block">
                      {selectedProject.category}
                    </span>
                    <h2 className="text-2xl font-orbitron font-bold text-text-main">{selectedProject.title}</h2>
                  </div>
                </div>
                
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-8">
                  <div className="text-emerald-400 font-medium flex items-center gap-2">
                    <Check size={18} /> Результат: {selectedProject.result}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-text-main mb-3 border-b border-border-accent pb-2">Описание и этапы</h3>
                  <p className="text-text-secondary leading-relaxed text-sm">
                    {selectedProject.detail}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-text-main mb-3 border-b border-border-accent pb-2">Стек технологий</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t: string, i: number) => (
                      <span key={i} className="tech-badge px-3 py-1.5 text-sm">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
