import { useEffect, useRef } from 'react';

interface BackgroundAnimadoProps {
  bgColorClass?: string;
  blobColor?: string;
  blobOpacity?: number;
}

export default function BackgroundAnimado({
  bgColorClass = "bg-white",
  blobColor = "#3b2a1f",
  blobOpacity = 0.3
}: BackgroundAnimadoProps) {
  const grupoBolhasRef = useRef<SVGGElement>(null);
  const animacaoRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  // Intersection Observer para pausar a animação quando fora da tela (Performance)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const grupoBolhas = grupoBolhasRef.current;
    if (!grupoBolhas) return;

    // Limpa o grupo caso o componente seja remontado
    grupoBolhas.innerHTML = '';

    const largura = 1200;
    const altura = 800;
    const quantidadeDeBolinhas = 45; // Levemente reduzido para garantir fluidez em múltiplas sessões
    const bolinhas: any[] = [];

    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function distancia(x1: number, y1: number, x2: number, y2: number) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function resolverColisao(particula: any, outraParticula: any) {
      const xDist = outraParticula.x - particula.x;
      const yDist = outraParticula.y - particula.y;
      const xVelocityDiff = particula.vx - outraParticula.vx;
      const yVelocityDiff = particula.vy - outraParticula.vy;

      if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angulo = -Math.atan2(outraParticula.y - particula.y, outraParticula.x - particula.x);
        const m1 = particula.massa;
        const m2 = outraParticula.massa;

        const u1 = {
          x: particula.vx * Math.cos(angulo) - particula.vy * Math.sin(angulo),
          y: particula.vx * Math.sin(angulo) + particula.vy * Math.cos(angulo)
        };
        const u2 = {
          x: outraParticula.vx * Math.cos(angulo) - outraParticula.vy * Math.sin(angulo),
          y: outraParticula.vx * Math.sin(angulo) + outraParticula.vy * Math.cos(angulo)
        };

        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y };

        const vFinal1 = {
          x: v1.x * Math.cos(-angulo) - v1.y * Math.sin(-angulo),
          y: v1.x * Math.sin(-angulo) + v1.y * Math.cos(-angulo)
        };
        const vFinal2 = {
          x: v2.x * Math.cos(-angulo) - v2.y * Math.sin(-angulo),
          y: v2.x * Math.sin(-angulo) + v2.y * Math.cos(-angulo)
        };

        particula.vx = vFinal1.x;
        particula.vy = vFinal1.y;
        outraParticula.vx = vFinal2.x;
        outraParticula.vy = vFinal2.y;
      }
    }

    for (let i = 0; i < quantidadeDeBolinhas; i++) {
      const raio = random(4, 45); 
      let x = random(raio, largura - raio);
      let y = random(raio, altura - raio);
      
      if (i !== 0) {
        for (let j = 0; j < bolinhas.length; j++) {
          if (distancia(x, y, bolinhas[j].x, bolinhas[j].y) - raio * 2 < 0) {
            x = random(raio, largura - raio);
            y = random(raio, altura - raio);
            j = -1;
          }
        }
      }

      const circulo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circulo.setAttribute('r', String(raio));
      circulo.setAttribute('cx', String(x));
      circulo.setAttribute('cy', String(y));
      grupoBolhas.appendChild(circulo);

      bolinhas.push({
        el: circulo,
        x: x,
        y: y,
        vx: random(-0.75, 0.75), 
        vy: random(-0.75, 0.75),
        raio: raio,
        massa: raio * raio 
      });
    }

    function animar() {
      // Só calcula a física e atualiza o DOM se a sessão estiver visível na tela
      if (isVisibleRef.current) {
        for (let i = 0; i < bolinhas.length; i++) {
          const b = bolinhas[i];
          b.x += b.vx;
          b.y += b.vy;

          if (b.x - b.raio <= 0) { b.x = b.raio; b.vx *= -1; }
          else if (b.x + b.raio >= largura) { b.x = largura - b.raio; b.vx *= -1; }
          if (b.y - b.raio <= 0) { b.y = b.raio; b.vy *= -1; }
          else if (b.y + b.raio >= altura) { b.y = altura - b.raio; b.vy *= -1; }

          for (let j = i + 1; j < bolinhas.length; j++) {
            const outraB = bolinhas[j];
            if (distancia(b.x, b.y, outraB.x, outraB.y) <= b.raio + outraB.raio) {
              resolverColisao(b, outraB);
            }
          }

          b.el.setAttribute('cx', String(b.x));
          b.el.setAttribute('cy', String(b.y));
        }
      }
      
      animacaoRef.current = requestAnimationFrame(animar);
    }

    animar();

    return () => {
      if (animacaoRef.current) {
        cancelAnimationFrame(animacaoRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 z-0 overflow-hidden ${bgColorClass}`}>
      <svg 
        viewBox="0 0 1200 800" 
        preserveAspectRatio="xMidYMid slice" 
        className="w-full h-full block"
        style={{ opacity: blobOpacity }}
      >
        <g ref={grupoBolhasRef} fill={blobColor}></g>
      </svg>
    </div>
  );
}
