import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Curtains, Plane } from 'curtainsjs';
import './FooterGlass.css';

interface FooterProps {
  className?: string;
}

const vertexShaderSource = `
#ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 dispImageMatrix;

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

void main() {
    vec3 vertexPosition = aVertexPosition;
    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

    vTextureCoord = (dispImageMatrix * vec4(aTextureCoord, 0., 1.)).xy;
    vVertexPosition = vertexPosition;
}
`;

const fragmentShaderSource = `
#ifdef GL_ES
precision mediump float;
#endif

#define PI2 6.28318530718
#define PI 3.14159265359
#define S(a,b,n) smoothstep(a,b,n)

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

uniform float uTime;
uniform vec2 uReso;
uniform vec2 uMouse;

uniform sampler2D dispImage;

float N12(vec2 p){
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);

  return fract(p.x * p.y);
}

vec3 Layer(vec2 uv0, float t){

  vec2 asp = vec2(2., 1.);

  vec2 uv1 = uv0 * 3. * asp;

  uv1.y += t * .25;

  vec2 gv = fract(uv1) - .5;
  vec2 id = floor(uv1);

  float n = N12(id);

  t+= n * PI2;

  float w = uv0.y * 10.;
  float x = (n - .5) * .8;
  x += (.4 - abs(x)) * sin(3. * w) * pow(sin(w), 6.) * .45;
  float y = -sin(t + sin(t + sin(t) * .5)) * (.5 - .06);
  y -= (gv.x - x) * (gv.x - x);

  vec2 dropPos = (gv - vec2(x, y)) / asp;
  float drop = S(.03, .02, length(dropPos));

  vec2 trailPos = (gv - vec2(x, t * .25)) / asp;
  trailPos.y = (fract(trailPos.y * 8.) - .5) / 8.;
  float trail = S(.02, .015, length(trailPos));

  float fogTrail = S(-.05, .05, dropPos.y);

  fogTrail *= S(.5, y, gv.y);
  trail *= fogTrail;
  fogTrail *= S(.03, .015, abs(dropPos.x));

  vec2 off = drop * dropPos + trail * trailPos;

  return vec3(off, fogTrail);
}

void main() {
      float dist = 5.;
      float blurSize = 5.;
      float t = mod(uTime * .03, 7200.);

      vec2 uv = vTextureCoord;

      vec3 drops = Layer(uv, t);
      drops += Layer(uv * 1.25 + 7.54, t);
      drops += Layer(uv * 1.35 + 1.54, t);
      drops += Layer(uv * 1.57 - 7.54, t);

      float blur = blurSize * 7. * (1. - drops.z);

      vec4 col = vec4(0.);
      int numSamples = 32;
      float a = N12(uv) * PI2;

      blur *= .0005;
      uv += drops.xy * dist;

      for(int n = 0; n < 32; n++){
        vec2 off = vec2(sin(a), cos(a)) * blur;
        float d = fract(sin((float(n) + 1.) * 546.) * 5424.);
        d = sqrt(d);
        off *= d;
        col += texture2D(dispImage, uv + off);
        a++;
      }

      col /= float(numSamples);

      gl_FragColor = col;
}
`;

const textureUrl = '/assets/images/footer-texture.jpg';

export default function Footer({ className = '' }: FooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);
  const [isEffectReady, setIsEffectReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const canvasElement = canvasRef.current;
    const planeElement = planeRef.current;

    if (!canvasElement || !planeElement) {
      return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    setIsEffectReady(false);

    let curtains: Curtains | null = null;
    let plane: Plane | null = null;
    let isCancelled = false;

    const handleMouseMove = (event: MouseEvent) => {
      if (plane?.uniforms?.mousepos) {
        plane.uniforms.mousepos.value = [event.clientX, event.clientY];
      }
    };

    const handleResize = () => {
      if (plane?.uniforms?.resolution) {
        plane.uniforms.resolution.value = [canvasElement.clientWidth, canvasElement.clientHeight];
      }
      curtains?.resize();
    };

    try {
      curtains = new Curtains({
        container: canvasElement,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
        watchScroll: false,
        autoRender: true,
        premultipliedAlpha: true,
      });

      const createdPlane = new Plane(curtains, planeElement, {
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        widthSegments: 40,
        heightSegments: 40,
        crossOrigin: 'anonymous',
        transparent: true,
        uniforms: {
          time: {
            name: 'uTime',
            type: '1f',
            value: 0,
          },
          mousepos: {
            name: 'uMouse',
            type: '2f',
            value: [0, 0],
          },
          resolution: {
            name: 'uReso',
            type: '2f',
            value: [canvasElement.clientWidth, canvasElement.clientHeight],
          },
        },
      });

      if (!createdPlane) {
        curtains.dispose();
        curtains = null;
        return;
      }

      plane = createdPlane;

      const updateTextureScale = (p: any) => {
        if (!p.textures || !p.textures[0]) return;
        const texture = p.textures[0];
        const planeRect = p.getBoundingRect();

        // Original image dimensions: 1216x262
        const imageWidth = 1216;
        const imageHeight = 262;

        const planeRatio = planeRect.width / planeRect.height;
        const imageRatio = imageWidth / imageHeight;

        if (planeRatio > imageRatio) {
          // Plane is wider than image
          texture.setScale(1, planeRatio / imageRatio);
        } else {
          // Plane is taller than image
          texture.setScale(imageRatio / planeRatio, 1);
        }
      };

      createdPlane.onRender(() => {
        createdPlane.uniforms.time.value += 1;
        createdPlane.uniforms.resolution.value = [canvasElement.clientWidth, canvasElement.clientHeight];
      });

      createdPlane.onReady(() => {
        if (!isCancelled) {
          updateTextureScale(createdPlane);
          setIsEffectReady(true);
        }
      });

      (createdPlane as any).onAfterResize(() => {
        updateTextureScale(createdPlane);
      });

      curtains.onError(() => {
        if (!isCancelled) {
          setIsEffectReady(false);
        }
      });

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('resize', handleResize);
    } catch (error) {
      console.error('Failed to initialize footer Curtains effect', error);
      if (!isCancelled) {
        setIsEffectReady(false);
      }
    }

    return () => {
      isCancelled = true;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (curtains && plane) {
        plane.remove();
        plane = null;
      }

      curtains?.dispose();
    };
  }, []);

  return (
    <footer className={`footer glass-footer ${className}`} style={footerStyle}>
      <div className={`footer-effects${isEffectReady ? ' is-ready' : ''}`}>
        <div className="footer-canvas" ref={canvasRef} />
        <div className="footer-plane" ref={planeRef}>
          <img data-sampler="dispImage" src={textureUrl} alt="" crossOrigin="anonymous" decoding="async" />
        </div>
      </div>

      <div className="footer-content">
        <div style={containerStyle}>
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <img src="/logo.svg" alt="PCHelp Armenia Logo" style={{ height: '32px', width: 'auto' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                <h3 style={{ ...headingStyle, marginBottom: 0 }}>PCHelp</h3>
                <span style={{
                  fontSize: '0.65rem',
                  color: '#ffffff',
                  opacity: 0.7,
                  fontWeight: 500,
                  letterSpacing: '0.1em'
                }}>Armenia</span>
              </div>
            </div>
            <p style={textStyle}>{t('footer.description')}</p>
          </div>

          <div style={sectionStyle}>
            <h4 style={subHeadingStyle}>{t('footer.contacts')}</h4>
            <p style={textStyle}>{t('footer.phoneMain')}: <a href="tel:+37495019753" style={linkStyle}>+374 (95) 01-97-53</a></p>
            <p style={textStyle}>{t('footer.email')}: <a href="mailto:info@pchelp.linkpc.net" style={linkStyle}>info@pchelp.linkpc.net</a></p>
          </div>

          <div style={sectionStyle}>
            <h4 style={subHeadingStyle}>{t('footer.hours')}</h4>
            <p style={textStyle}>{t('footer.weekdays')}: 9:00 - 20:00</p>
            <p style={textStyle}>{t('footer.saturday')}: 10:00 - 18:00</p>
          </div>
        </div>

        <div style={copyrightStyle}>
          <p style={textStyle}>
            © {currentYear} PCHelp Armenia. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}

const footerStyle: CSSProperties = {
  background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.65) 0%, rgba(30, 64, 175, 0.35) 40%, rgba(8, 145, 178, 0.35) 100%)',
  color: 'var(--color-text)',
  padding: '3rem 0 1rem',
  marginTop: 'auto',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(22px) saturate(170%)',
  WebkitBackdropFilter: 'blur(22px) saturate(170%)',
  borderTop: '1px solid rgba(148, 197, 255, 0.35)',
  boxShadow: '0 -30px 80px rgba(15, 23, 42, 0.35)',
  isolation: 'isolate',
};

const containerStyle: CSSProperties = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 1rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
  marginBottom: '2rem',
};

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const headingStyle: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#ffffff',
  marginBottom: '0.5rem',
};

const subHeadingStyle: CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: '600',
  color: '#ffffff',
  marginBottom: '0.5rem',
};

const textStyle: CSSProperties = {
  fontSize: '0.875rem',
  color: '#ffffff',
  margin: '0.25rem 0',
  lineHeight: '1.5',
};

const linkStyle: CSSProperties = {
  color: '#ffffff',
  textDecoration: 'none',
};

const copyrightStyle: CSSProperties = {
  borderTop: '1px solid var(--color-border)',
  paddingTop: '1rem',
  textAlign: 'center',
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '1rem',
};
