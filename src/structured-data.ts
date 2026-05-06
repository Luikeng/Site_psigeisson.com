/**
 * Schema.org structured data (JSON-LD) por rota.
 * Inserido via react-helmet-async no <head> e capturado pelo prerender,
 * de forma que crawlers (Google, Bing) leem o JSON-LD direto no HTML.
 *
 * Referências:
 * - FAQPage:        https://schema.org/FAQPage  (rich result FAQ)
 * - LocalBusiness:  https://schema.org/LocalBusiness
 * - Service:        https://schema.org/Service
 * - VideoObject:    https://schema.org/VideoObject
 * - BreadcrumbList: https://schema.org/BreadcrumbList
 */

const SITE = "https://psigeisson.com";

const FAQS = [
  {
    q: "Quanto custa uma sessão?",
    a: "A sessão avulsa de 50 minutos custa R$ 220 (cartão, PIX ou transferência). Também ofereço o pacote de 4 sessões pagas antecipadamente por R$ 600 (equivalente a R$ 150 por sessão). Caso prefira outro meio de pagamento, estou à disposição.",
  },
  {
    q: "As sessões online são sigilosas?",
    a: "Sim, as sessões online são completamente sigilosas e seguem as diretrizes da Lei Geral de Proteção de Dados (LGPD), garantindo a privacidade e a segurança das informações compartilhadas. Normalmente, utilizo o Google Meet.",
  },
  {
    q: "Qual a abordagem teórica?",
    a: "Minha trajetória acadêmica e profissional teve diversas fases, mas hoje me concentro no estudo da Abordagem Sistêmica Familiar, com a qual me identifico.",
  },
  {
    q: "Os atendimentos são apenas particulares?",
    a: "Sim, os atendimentos são exclusivamente particulares. No entanto, muitos pacientes conseguem obter reembolso pelas sessões junto aos seus planos de saúde.",
  },
  {
    q: "Como funcionam os atendimentos?",
    a: "As sessões têm duração média de 50 minutos, ocorrem com frequência mínima semanal e são iniciadas pontualmente no horário agendado.",
  },
  {
    q: "Posso tirar outras dúvidas antes de agendar?",
    a: "Estou à disposição para esclarecer quaisquer dúvidas antes do agendamento. Faço questão de entrar em contato previamente para me apresentar.",
  },
];

export const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export const VIDEO_JSONLD = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Apresentação — Psicólogo Geisson Oleques",
  description:
    "Vídeo de apresentação do psicólogo Geisson Oleques (CRP 07/35759). Como funciona o atendimento, abordagem sistêmica familiar e comunicação ativa.",
  thumbnailUrl: "https://i.ytimg.com/vi/rXN8j0qpmpI/hqdefault.jpg",
  uploadDate: "2026-03-05",
  embedUrl: "https://www.youtube.com/embed/rXN8j0qpmpI",
  contentUrl: "https://www.youtube.com/watch?v=rXN8j0qpmpI",
  publisher: {
    "@type": "Person",
    name: "Geisson Oleques",
    identifier: "CRP 07/35759",
  },
};

export const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE}/terapiaonline#service`,
  name: "Sessão de Psicoterapia Online",
  serviceType: "Online psychotherapy",
  description:
    "Sessão individual de psicoterapia online de 50 minutos via Google Meet, com abordagem sistêmica familiar, atendendo todo o Brasil.",
  url: `${SITE}/terapiaonline`,
  provider: {
    "@type": "Person",
    name: "Geisson Oleques",
    jobTitle: "Psicólogo Clínico",
    identifier: "CRP 07/35759",
    image: `${SITE}/perfil.jpg`,
    sameAs: [
      "https://www.instagram.com/geissonoleques",
      "https://www.doctoralia.com.br/geisson-oleques/psicologo/sao-leopoldo",
    ],
  },
  areaServed: {
    "@type": "Country",
    name: "Brasil",
  },
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: `${SITE}/terapiaonline`,
    servicePhone: "+55-51-99274-9130",
    availableLanguage: "Portuguese",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Sessão avulsa",
      price: "220.00",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      description: "Sessão individual de 50 minutos via Google Meet",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "220.00",
        priceCurrency: "BRL",
        unitText: "sessão de 50 minutos",
      },
    },
    {
      "@type": "Offer",
      name: "Pacote 4 sessões",
      price: "600.00",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      description:
        "Pacote de 4 sessões individuais de 50 minutos via Google Meet, pago antecipadamente (R$ 150 por sessão).",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "600.00",
        priceCurrency: "BRL",
        unitText: "pacote de 4 sessões",
      },
    },
  ],
};

export const BREADCRUMB_TERAPIAONLINE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Início",
      item: `${SITE}/`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Terapia Online",
      item: `${SITE}/terapiaonline`,
    },
  ],
};
