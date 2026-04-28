/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FAQ_JSONLD,
  VIDEO_JSONLD,
  LOCAL_BUSINESS_JSONLD,
  SERVICE_JSONLD,
  BREADCRUMB_SAOLEOPOLDO_JSONLD,
  BREADCRUMB_TERAPIAONLINE_JSONLD,
} from './structured-data';

// Detect prerender (Puppeteer headless) so we skip viewport-gated animations
// and render content as fully visible — otherwise the static HTML captured
// by @prerenderer keeps every ScrollReveal at opacity:0.
const IS_PRERENDER = typeof navigator !== 'undefined' &&
  /HeadlessChrome|prerender/i.test(navigator.userAgent);
import { 
  Menu, 
  X, 
  MessageCircle, 
  ChevronRight, 
  Star, 
  Instagram,
  Mail,
  Phone,
  ChevronDown
} from 'lucide-react';

// --- Components ---

const ScrollReveal = ({ children, delay = 0, direction = 'up', intensity = 40, className = '' }: { children: React.ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right', intensity?: number, className?: string }) => {
  const directions = {
    up: { y: intensity },
    down: { y: -intensity },
    left: { x: intensity },
    right: { x: -intensity }
  };

  if (IS_PRERENDER) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
    >
      {children}
    </motion.div>
  );
};

const getAssetUrl = (name: string) => {
  const cleanName = name.startsWith('/') ? name.slice(1) : name;
  // Usa a base configurada no vite.config.ts automaticamente
  return `${import.meta.env.BASE_URL}${cleanName}`;
};

import BackgroundAnimado from './components/BackgroundAnimado';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/', type: 'route' },
    { name: 'São Leopoldo', href: '/saoleopoldo', type: 'route' },
    { name: 'Terapia Online', href: '/terapiaonline', type: 'route' },
    { name: 'Dúvidas', href: '#duvidas', type: 'anchor' },
    { name: 'Contato', href: '#contato', type: 'anchor' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (link.type === 'anchor') {
      if (location.pathname !== '/') {
        e.preventDefault();
        navigate('/' + link.href);
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-white md:bg-transparent py-4 md:py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center relative">
        
        {/* Mobile Toggle (Left on mobile) */}
        <button 
          className="md:hidden text-brand-secondary z-50" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo (Center on mobile, Left on desktop) */}
        <Link to="/" className="flex items-center absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 z-50">
          <img 
            src={getAssetUrl("logo-new.png")} 
            alt="Logo Psicólogo Online Geisson Oleques" 
            className="h-8 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav (Right) */}
        <div className="hidden md:flex space-x-8 w-full justify-end">
          {navLinks.map((link) => (
            link.type === 'route' ? (
               <Link 
                key={link.name} 
                to={link.href} 
                className={`text-base font-medium transition-colors ${location.pathname === link.href ? 'text-brand-primary' : 'text-brand-text hover:text-brand-primary'}`}
              >
                {link.name}
              </Link>
            ) : (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={(e) => handleNavClick(e, link)}
                className="text-base font-medium text-brand-text hover:text-brand-primary transition-colors"
              >
                {link.name}
              </a>
            )
          ))}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden w-7"></div> {/* Spacer to balance absolute centered logo */}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-brand-detail absolute top-full left-0 w-full shadow-lg"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                link.type === 'route' ? (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    className={`text-lg font-medium ${location.pathname === link.href ? 'text-brand-primary' : 'text-brand-text'}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="text-lg font-medium text-brand-text"
                    onClick={(e) => handleNavClick(e, link)}
                  >
                    {link.name}
                  </a>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-[85svh] md:min-h-[100svh] flex flex-col justify-start md:justify-center bg-brand-bg pt-[100px] md:pt-20 z-0 pb-12 md:pb-32">
      {/* Background Images */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <picture>
          <source media="(max-width: 767px)" srcSet={getAssetUrl("hero-mobile.jpg")} />
          <img
            src={getAssetUrl("hero-desktop.jpg")}
            alt="Geisson Oleques - Psicólogo Online"
            className="w-full h-full object-cover object-bottom md:object-center"
          />
        </picture>
        {/* Overlay para desktop (gradient lateral para legibilidade do texto à esquerda) */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-white/60 to-transparent w-1/3"></div>
        {/* Overlay sutil para mobile no topo para garantir leitura do texto */}
        <div className="md:hidden absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/80 via-white/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex-1 flex flex-col mt-0">
        <div className="max-w-2xl text-center md:text-left mx-auto md:mx-0 md:mt-32 lg:mt-40 md:pl-16 lg:pl-24">
          <ScrollReveal direction="up">
            <h1 className="text-[2.2rem] leading-[1.1] md:text-6xl lg:text-[4.5rem] mb-2 md:mb-4 text-brand-secondary font-display">
              Psicólogo Online<br />Geisson Oleques
            </h1>
            <span className="text-brand-text font-medium text-[13px] md:text-base mb-5 md:mb-8 block">
              Terapia Online com Comunicação Ativa e Descontraída
            </span>
            
            <div className="flex justify-center md:justify-start mb-5 md:mb-6">
              <a 
                href="https://api.whatsapp.com/send?phone=5551992749130&text=Ol%C3%A1,%20gostaria%20de%20agendar%20uma%20consulta!" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#5A4B46] text-white px-8 py-2.5 rounded-full font-bold text-sm shadow-lg hover:bg-[#4A3B36] transition-all inline-block"
              >
                Fale comigo
              </a>
            </div>

            <p className="hidden md:block text-[13px] md:text-lg text-brand-text/90 max-w-[280px] md:max-w-lg leading-relaxed font-medium mx-auto md:mx-0">
              Olá! Sou Geisson Oleques. Apresento aqui meu trabalho para que você decida, com calma, se deseja iniciar sua terapia online.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const Presentation = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const waveOffset = useTransform(scrollYProgress, [0, 1], ["-50vw", "50vw"]);
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const videoElement = (
    <div className="relative aspect-[9/16] max-w-sm mx-auto rounded-[2rem] overflow-hidden shadow-2xl border-8 border-brand-bg">
      <iframe
        className="w-full h-full"
        src="https://www.youtube.com/embed/rXN8j0qpmpI"
        title="Apresentação Geisson Oleques"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );

  return (
    <motion.section 
      ref={ref}
      style={{ '--wave-offset': waveOffset } as any}
      id="apresentacao" 
      className="pb-24 md:pb-32 pt-[calc(6rem+50px)] md:pt-[calc(8rem+100px)] relative z-10 wave-mask wave-shape-1 -mt-[50px] md:-mt-[100px] overflow-hidden"
    >
      {/* Fundo Animado com React */}
      <BackgroundAnimado bgColorClass="bg-white" blobColor="#3b2a1f" blobOpacity={0.3} />

      {/* Máscara de Blur (Glassmorphism) */}
      <div className="absolute inset-0 z-0 bg-white/60 backdrop-blur-2xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          
          {/* Desktop Video Container */}
          <div className="hidden md:block">
            <ScrollReveal direction="left">
              {videoElement}
            </ScrollReveal>
          </div>

          {/* Text Content */}
          <ScrollReveal direction="right" delay={0.2}>
            <div>
              <h2 className="text-4xl md:text-5xl mb-6 md:mb-8 text-brand-secondary">Apresentação</h2>
              <p className="text-lg text-brand-text/90 mb-8 md:mb-6 leading-relaxed">
                Acredito que escolher um psicólogo online ou presencial é, acima de tudo, uma questão de afinidade e confiança. Por isso, gravei este vídeo para me apresentar e contar um pouco sobre como funciona o meu trabalho na clínica.
              </p>

              {/* Mobile Video Container */}
              {isMobile && (
                <div className="mb-8">
                  {videoElement}
                </div>
              )}

              <p className="text-lg text-brand-text/90 mb-8 leading-relaxed">
                Sou psicólogo clínico (CRP 07/35759) e atuo com a Abordagem Sistêmica. Diferente do silêncio tradicional que muitos imaginam na terapia, meu formato de atendimento é ativo, dinâmico e focado em trocas reais. Meu objetivo é te ajudar a compreender suas emoções, lidar com a ansiedade e melhorar seus relacionamentos, seja através da psicoterapia online para todo o Brasil ou presencial em São Leopoldo.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-brand-secondary font-medium">
                  <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                  <span>Psicólogo Clínico (CRP 07/35759)</span>
                </div>
                <div className="flex items-center gap-3 text-brand-secondary font-medium">
                  <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                  <span>Especialista em Abordagem Sistêmica</span>
                </div>
                <div className="flex items-center gap-3 text-brand-secondary font-medium">
                  <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                  <span>Atendimento Online e Presencial (São Leopoldo/RS)</span>
                </div>
              </div>
              <a 
                href="https://api.whatsapp.com/send?phone=5551992749130&text=Ol%C3%A1,%20gostaria%20de%20agendar%20uma%20consulta!" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:gap-4 transition-all shadow-md"
              >
                Agendar Horário <ChevronRight size={20} />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </motion.section>
  );
};

const Terapia = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const waveOffset = useTransform(scrollYProgress, [0, 1], ["50vw", "-50vw"]);

  const items = [
    {
      title: 'Terapia online',
      description: 'Através de uma conversa descontraída, olhamos para suas questões e necessidades pessoais de forma ampla e dinâmica. Aqui teu terapeuta não é muito fã do silêncio nas sessões.',
      icon: getAssetUrl("veto.svg")
    },
    {
      title: 'Ansiedade, Depressão...',
      description: 'Um diagnóstico é importante, mas ele não define você. Aqui, vamos descobrir juntos como compreender, lidar e seguir em frente após um diagnóstico em saúde mental.',
      icon: getAssetUrl("mao-a-massa.svg")
    },
    {
      title: 'Acompanhamento',
      description: 'Nem toda terapia se baseia em resolver problemas ou buscar um diagnóstico. Às vezes, o que se procura é apenas um acompanhamento, por motivos e em momentos que só você pode decidir.',
      icon: getAssetUrl("muie.svg")
    }
  ];

  return (
    <motion.section 
      ref={ref}
      style={{ '--wave-offset': waveOffset } as any}
      id="terapia" 
      className="pb-24 md:pb-32 pt-[calc(6rem+50px)] md:pt-[calc(8rem+100px)] relative z-20 wave-mask wave-shape-2 -mt-[50px] md:-mt-[100px] overflow-hidden"
    >
      {/* Fundo Animado */}
      <BackgroundAnimado bgColorClass="bg-brand-bg" blobColor="#5d4037" blobOpacity={0.3} />

      {/* Máscara de Blur (Glassmorphism) */}
      <div className="absolute inset-0 z-0 bg-white/60 backdrop-blur-2xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal direction="up">
          <h2 className="text-4xl md:text-5xl text-center mb-16 text-brand-secondary">Terapia online ou presencial</h2>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div key={index} className="h-full">
              <ScrollReveal delay={index * 0.2} direction="up" className="h-full">
                <div className="flex flex-col items-center text-center bg-white rounded-3xl p-8 shadow-sm border border-brand-primary/10 h-full hover:shadow-md transition-shadow duration-300">
                  <div className="mb-6 h-32 flex items-center justify-center">
                    <img 
                      src={item.icon} 
                      alt={item.title} 
                      className="w-32 h-32 object-contain" 
                    />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-4 text-brand-secondary">{item.title}</h3>
                  <p className="text-brand-text/70 text-sm leading-relaxed">{item.description}</p>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const waveOffset = useTransform(scrollYProgress, [0, 1], ["-70vw", "70vw"]);

  const faqs = [
    { q: 'Quanto custa uma sessão?', a: 'O valor de cada sessão é 220 R$. O pagamento pode ser por cartão ou transferência bancária. Caso prefira utilizar outro meio de pagamento, estou à disposição para alinhar a melhor opção.' },
    { q: 'As sessões online são sigilosas?', a: 'Sim, as sessões online são completamente sigilosas e seguem as diretrizes da Lei Geral de Proteção de Dados (LGPD), garantindo a privacidade e a segurança das informações compartilhadas. Normalmente, utilizo o Google Meet.' },
    { q: 'Qual a abordagem teórica?', a: 'Minha trajetória acadêmica e profissional teve diversas fases, mas hoje me concentro no estudo da Abordagem Sistêmica Familiar, com a qual me identifico.' },
    { q: 'Os atendimentos são apenas particulares?', a: 'Sim, os atendimentos são exclusivamente particulares. No entanto, muitos pacientes conseguem obter reembolso pelas sessões junto aos seus planos de saúde.' },
    { q: 'Como funcionam os atendimentos?', a: 'As sessões têm duração média de 50 minutos, ocorrem com frequência mínima semanal e são iniciadas pontualmente no horário agendado.' },
    { q: 'Posso tirar outras dúvidas antes de agendar?', a: 'Estou à disposição para esclarecer quaisquer dúvidas antes do agendamento. Faço questão de entrar em contato previamente para me apresentar.' },
  ];

  return (
    <motion.section 
      ref={ref}
      style={{ '--wave-offset': waveOffset } as any}
      id="duvidas" 
      className="pb-24 md:pb-32 pt-[calc(6rem+50px)] md:pt-[calc(8rem+100px)] relative text-white z-30 wave-mask wave-shape-3 -mt-[50px] md:-mt-[100px] overflow-hidden"
    >
      {/* Fundo Animado */}
      <BackgroundAnimado bgColorClass="bg-brand-secondary" blobColor="#e7d8c9" blobOpacity={0.4} />

      {/* Overlay de cor (sem blur caro) */}
      <div className="absolute inset-0 z-0 bg-brand-secondary/30 backdrop-blur-xl"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <ScrollReveal direction="up">
          <h2 className="text-4xl md:text-5xl text-center mb-16 text-white">Dúvidas comuns</h2>
        </ScrollReveal>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index}>
              <ScrollReveal delay={index * 0.1} direction="up">
                <button 
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full text-left bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 flex justify-between items-center group transition-all hover:bg-white/20"
                >
                  <span className="text-lg font-medium">{faq.q}</span>
                  <ChevronDown className={`transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 text-white/80 leading-relaxed bg-white/5 rounded-b-2xl -mt-2 border-x border-b border-white/10">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const Testimonials = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const waveOffset = useTransform(scrollYProgress, [0, 1], ["70vw", "-70vw"]);

  return (
    <motion.section 
      ref={ref}
      style={{ '--wave-offset': waveOffset } as any}
      id="avaliacoes" 
      className="pb-24 md:pb-32 pt-[calc(6rem+50px)] md:pt-[calc(8rem+100px)] relative z-40 wave-mask wave-shape-4 -mt-[50px] md:-mt-[100px] overflow-hidden"
    >
      {/* Fundo Animado */}
      <BackgroundAnimado bgColorClass="bg-brand-bg" blobColor="#8d6e63" blobOpacity={0.4} />

      {/* Máscara de Blur (Glassmorphism Creme) */}
      <div className="absolute inset-0 z-0 bg-[#fdfaf7]/60 backdrop-blur-2xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal direction="up">
          <h2 className="text-4xl md:text-5xl text-center mb-6 text-brand-secondary">Avaliações dos Pacientes</h2>
          <p className="text-center text-brand-red font-medium mb-16 max-w-2xl mx-auto">
            Qualquer pessoa pode fazer um site e publicar uma opinião. Por isso, uso a Doctoralia para receber avaliações autênticas.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              text: "Busquei a ajuda do Geisson, inicialmente para ansiedade e timidez, mas estou aprendendo tudo sobre mim, ele é super calmo, atencioso, ouvinte, e nos faz se sentir bem, a vontade nas consultas.",
              author: "Paciente via Doctoralia"
            },
            {
              text: "Me senti com um amigo de longa data e que estava o atualizando dos acontecimentos. Minha primeira experiência com um terapeuta e eu amei!",
              author: "Paciente via Doctoralia"
            }
          ].map((item, index) => (
            <div key={index}>
              <ScrollReveal delay={index * 0.2} direction={index === 0 ? 'left' : 'right'}>
                <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-brand-detail/30 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex text-yellow-500 mb-6">
                      {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                    </div>
                    <p className="text-lg italic text-brand-text/90 leading-relaxed mb-8">
                      "{item.text}"
                    </p>
                  </div>
                  <p className="font-bold text-brand-secondary">— {item.author}</p>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a 
            href="https://www.doctoralia.com.br/geisson-oleques/psicologo/sao-leopoldo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand-primary font-bold hover:underline flex items-center justify-center gap-2"
          >
            Ver todas as avaliações na Doctoralia <ChevronRight size={18} />
          </a>
        </div>
      </div>
    </motion.section>
  );
};

const InstagramSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const waveOffset = useTransform(scrollYProgress, [0, 1], ["-40vw", "40vw"]);

  const posts = [
    { id: 1, img: "tdah.jpg", title: "TDAH", url: "https://www.instagram.com/geissonoleques/p/DJR0YA8ReLA/" },
    { id: 2, img: "conviver.jpg", title: "Conviver", url: "https://www.instagram.com/geissonoleques/p/ClhjzL3LzaO/" },
    { id: 3, img: "remedio.jpg", title: "Medicação", url: "https://www.instagram.com/geissonoleques/p/CdoQ7rfsY6L/" },
    { id: 4, img: "dependencia.jpg", title: "Dependência", url: "https://www.instagram.com/geissonoleques/p/CZsOIhZPH5L/" },
  ];

  return (
    <motion.section 
      ref={ref}
      style={{ '--wave-offset': waveOffset } as any}
      id="instagram" 
      className="pb-24 md:pb-32 pt-[calc(6rem+50px)] md:pt-[calc(8rem+100px)] relative z-50 wave-mask wave-shape-5 -mt-[50px] md:-mt-[100px] overflow-hidden"
    >
      {/* Fundo Animado */}
      <BackgroundAnimado bgColorClass="bg-white" blobColor="#5d4037" blobOpacity={0.3} />

      {/* Máscara de Blur (Glassmorphism) */}
      <div className="absolute inset-0 z-0 bg-white/60 backdrop-blur-2xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal direction="up">
          <h2 className="text-4xl md:text-5xl text-center mb-4 text-brand-secondary">Publicações recentes</h2>
          <p className="text-center text-brand-text/60 mb-16">
            Meu instagram possui algumas informações que você pode julgar útil para conhecer meu trabalho.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {posts.map((post, index) => (
            <div key={post.id}>
              <ScrollReveal delay={index * 0.1} direction="up">
                <a 
                  href={post.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block aspect-square rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-500"
                >
                  <img src={getAssetUrl(post.img)} alt={post.title} className="w-full h-full object-cover" />
                </a>
              </ScrollReveal>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="https://instagram.com/geissonoleques" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-primary font-bold hover:underline"
          >
            Siga @geissonoleques <Instagram size={20} />
          </a>
        </div>
      </div>
    </motion.section>
  );
};

const Footer = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const waveOffset = useTransform(scrollYProgress, [0, 1], ["40vw", "-40vw"]);

  return (
    <motion.footer 
      ref={ref}
      style={{ '--wave-offset': waveOffset } as any}
      id="contato" 
      className="pb-16 md:pb-24 pt-[calc(6rem+50px)] md:pt-[calc(8rem+100px)] bg-brand-secondary text-white relative z-60 wave-mask wave-shape-6 -mt-[50px] md:-mt-[100px] overflow-hidden"
    >
      {/* Fundo Animado */}
      <BackgroundAnimado bgColorClass="bg-brand-secondary" blobColor="#ffffff" blobOpacity={0.15} />
      
      {/* Máscara de Blur para suavizar */}
      <div className="absolute inset-0 z-0 bg-brand-secondary/60 backdrop-blur-xl"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16 text-center md:text-left">
          {/* Coluna 1: Logo e CRP */}
          <div className="flex flex-col items-center md:items-start">
            <img src={getAssetUrl("logo-new.png")} alt="Arte Mental Logo" className="h-16 mb-6 brightness-0 invert" />
            <p className="text-white/80 text-base max-w-sm mb-6 leading-relaxed">
              Psicólogo Geisson Oleques (CRP 07/35759). <br />
              Terapia ativa e dinâmica para quem busca transformações reais e compromisso com sua história.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/geissonoleques" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-all duration-300"
                title="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="mailto:geisson.oleques@gmail.com" 
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-all duration-300"
                title="Email"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="flex flex-col items-center md:items-center">
            <div className="text-center md:text-left">
              <h4 className="text-base font-bold uppercase tracking-[0.2em] mb-6 text-brand-detail text-center md:text-left">Navegação</h4>
              <ul className="space-y-3 text-white/80 text-base text-center md:text-left">
                <li><Link to="/" className="hover:text-white transition-colors">Início</Link></li>
                <li><Link to="/saoleopoldo" className="hover:text-white transition-colors">São Leopoldo</Link></li>
                <li><Link to="/terapiaonline" className="hover:text-white transition-colors">Terapia Online</Link></li>
              </ul>
            </div>
          </div>

          {/* Coluna 3: Contato */}
          <div className="flex flex-col items-center md:items-end">
            <div className="text-center md:text-right">
              <h4 className="text-base font-bold uppercase tracking-[0.2em] mb-6 text-brand-detail text-center md:text-right">Agendamento</h4>
              <p className="text-white/80 text-base mb-6 max-w-[200px] mx-auto md:mx-0 md:ml-auto">Disponível para sessões online e presenciais.</p>
              <a 
                href="https://wa.me/5551992749130" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-primary/20 transition-all duration-300 group"
              >
                <Phone size={20} className="group-hover:rotate-12 transition-transform" /> 
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
          <p className="text-center md:text-left">© {new Date().getFullYear()} Arte Mental. Todos os direitos reservados.</p>
          <div className="flex gap-8">
            <p className="text-center md:text-right">Geisson Oleques • CRP 07/35759</p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const handleScroll = () => {
      // On mobile, hide if scroll is less than 100px
      if (window.innerWidth < 768) {
        setIsVisible(window.scrollY > 100);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.a
      href="https://api.whatsapp.com/send?phone=5551992749130&text=Ol%C3%A1,%20gostaria%20de%20agendar%20uma%20consulta!"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isVisible ? 1 : 0, 
        opacity: isVisible ? 1 : 0 
      }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
    >
      <MessageCircle size={32} />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 whitespace-nowrap font-bold">
        Agendar Sessão
      </span>
    </motion.a>
  );
};

// --- Page Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const HomePage = () => (
  <>
    <Helmet>
      <title>Psicólogo Online | Terapia Online com Geisson Oleques</title>
      <meta name="description" content="Busca por terapia online? Sou Geisson Oleques, psicólogo online (CRP 07/35759). Terapia ativa e dinâmica para ansiedade, depressão e relacionamentos." />
      <link rel="canonical" href="https://psigeisson.com/" />
      <meta property="og:url" content="https://psigeisson.com/" />
      <meta property="og:title" content="Psicólogo Online | Terapia Online com Geisson Oleques" />
      <meta property="og:description" content="Agende sua sessão de terapia online. Um espaço de troca real e compromisso com sua história." />
      <script type="application/ld+json">{JSON.stringify(FAQ_JSONLD)}</script>
      <script type="application/ld+json">{JSON.stringify(VIDEO_JSONLD)}</script>
    </Helmet>
    <Hero />
    <Presentation />
    <Terapia />
    <FAQ />
    <Testimonials />
    <InstagramSection />
  </>
);

const SaoLeopoldoPage = () => (
  <>
    <Helmet>
      <title>Psicólogo em São Leopoldo · Atendimento Presencial — Geisson Oleques</title>
      <meta name="description" content="Atendimento psicológico presencial em São Leopoldo (CRP 07/35759). Espaço acolhedor no centro da cidade, abordagem sistêmica, sessões de 50 minutos." />
      <link rel="canonical" href="https://psigeisson.com/saoleopoldo" />
      <meta property="og:url" content="https://psigeisson.com/saoleopoldo" />
      <meta property="og:title" content="Psicólogo em São Leopoldo · Atendimento Presencial" />
      <meta property="og:description" content="Atendimento presencial no centro de São Leopoldo com Geisson Oleques (CRP 07/35759)." />
      <script type="application/ld+json">{JSON.stringify(LOCAL_BUSINESS_JSONLD)}</script>
      <script type="application/ld+json">{JSON.stringify(VIDEO_JSONLD)}</script>
      <script type="application/ld+json">{JSON.stringify(BREADCRUMB_SAOLEOPOLDO_JSONLD)}</script>
    </Helmet>
    <Hero />
    <div className="py-20 bg-brand-primary/5">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl text-brand-secondary mb-6">Atendimento Presencial em São Leopoldo</h2>
        <p className="text-lg text-brand-text/80 max-w-2xl mx-auto">
          Ofereço um espaço acolhedor e seguro para nossos encontros presenciais, focado no seu bem-estar e desenvolvimento pessoal.
        </p>
      </div>
    </div>
    <Presentation />
    <Terapia />
    <Footer />
  </>
);

const TerapiaOnlinePage = () => (
  <>
    <Helmet>
      <title>Terapia Online — Psicólogo Geisson Oleques · CRP 07/35759</title>
      <meta name="description" content="Terapia online via Google Meet, em todo o Brasil. Abordagem sistêmica, comunicação ativa e descontraída. Sessões de 50 min, R$220, sigilo LGPD." />
      <link rel="canonical" href="https://psigeisson.com/terapiaonline" />
      <meta property="og:url" content="https://psigeisson.com/terapiaonline" />
      <meta property="og:title" content="Terapia Online com Geisson Oleques" />
      <meta property="og:description" content="Sessões de terapia online via Google Meet. Abordagem sistêmica, comunicação ativa." />
      <script type="application/ld+json">{JSON.stringify(SERVICE_JSONLD)}</script>
      <script type="application/ld+json">{JSON.stringify(FAQ_JSONLD)}</script>
      <script type="application/ld+json">{JSON.stringify(BREADCRUMB_TERAPIAONLINE_JSONLD)}</script>
    </Helmet>
    <Hero />
    <div className="py-20 bg-brand-primary/5">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl text-brand-secondary mb-6">Terapia Online</h2>
        <p className="text-lg text-brand-text/80 max-w-2xl mx-auto">
          A flexibilidade do atendimento online permite que você cuide da sua saúde mental de onde estiver, com o mesmo sigilo e profundidade do presencial.
        </p>
      </div>
    </div>
    <Terapia />
    <FAQ />
    <Footer />
  </>
);

const PrerenderSignal = () => {
  useEffect(() => {
    // Wait one tick for child effects + Helmet to flush, then signal the
    // prerenderer that this route is ready to be captured.
    const t = setTimeout(() => {
      document.dispatchEvent(new Event('app-rendered'));
    }, 300);
    return () => clearTimeout(t);
  }, []);
  return null;
};

export default function App() {
  return (
    <Router basename="/">
      <ScrollToTop />
      <PrerenderSignal />
      <div className="min-h-screen selection:bg-brand-primary/30 font-body">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/saoleopoldo" element={<SaoLeopoldoPage />} />
          <Route path="/terapiaonline" element={<TerapiaOnlinePage />} />
          {/* Fallback to Home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
        
        {/* Footer is usually shared, but some pages might have specific footers */}
        <Routes>
          <Route path="/" element={<Footer />} />
          <Route path="/saoleopoldo" element={null} /> {/* Already included in the page component above for now */}
          <Route path="/terapiaonline" element={null} />
        </Routes>
        
        <FloatingWhatsApp />
      </div>
    </Router>
  );
}
