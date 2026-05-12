import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'user_notice_choice';

const bannerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  background: 'rgba(30, 30, 30, 0.85)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  color: '#fff',
  padding: '1rem 2vw',
  zIndex: 1000,
  boxShadow: '0 -4px 24px rgba(0,0,0,0.18)',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  border: '1px solid rgba(255,255,255,0.08)',
};

const contentWrapper: React.CSSProperties = {
  width: '100%',
  maxWidth: 1100,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '1rem',
};

const textStyle: React.CSSProperties = {
  fontSize: '1.08rem',
  lineHeight: 1.6,
  color: '#fff',
  textAlign: 'center',
  fontWeight: 400,
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const buttonStyle: React.CSSProperties = {
  background: '#eab308',
  color: '#222',
  border: 'none',
  borderRadius: '999px',
  fontWeight: 600,
  fontSize: '1rem',
  padding: '0.7rem 2.2rem',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
  transition: 'background 0.2s, color 0.2s',
  outline: 'none',
  margin: 0,
  display: 'block',
};

const refuseButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: 'transparent',
  color: '#fff',
  border: '1.5px solid #fff',
};

const buttonHoverStyle: React.CSSProperties = {
  background: '#facc15',
  color: '#18181b',
};

const refuseButtonHoverStyle: React.CSSProperties = {
  ...refuseButtonStyle,
  background: '#fff',
  color: '#18181b',
};

export default function UserNoticeBanner() {
  const [visible, setVisible] = useState(false);
  const [acceptHover, setAcceptHover] = useState(false);
  const [refuseHover, setRefuseHover] = useState(false);

  useEffect(() => {
    const choice = localStorage.getItem(STORAGE_KEY);
    if (!choice) {
      setVisible(true);
    }
  }, []);

  // Responsive CSS
  const responsiveStyle = `
    @media (min-width: 700px) {
      #user-notice-content {
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 2rem !important;
      }
      #user-notice-text {
        text-align: left !important;
        font-size: 1.08rem !important;
      }
      #user-notice-btns {
        margin: 0 0 0 2rem !important;
      }
    }
    @media (max-width: 699px) {
      #user-notice-content {
        flex-direction: column !important;
        align-items: stretch !important;
        justify-content: center !important;
        gap: 1rem !important;
      }
      #user-notice-text {
        text-align: center !important;
        font-size: 1rem !important;
      }
      #user-notice-btns {
        margin: 0 auto !important;
        width: 100%;
      }
    }
  `;

  const handleChoice = (choice: 'accept' | 'refuse') => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      <style>{responsiveStyle}</style>
      <div style={bannerStyle} role="dialog" aria-live="polite" aria-label="Consentement cookies">
        <div id="user-notice-content" style={contentWrapper}>
          <div id="user-notice-text" style={textStyle}>
            Ce site utilise des cookies et technologies similaires à des fins de mesure d'audience et d'amélioration de l'expérience utilisateur. Vous pouvez accepter ou refuser leur utilisation.{' '}
            <a href="/politique-de-confidentialite" style={{ color: '#eab308', textDecoration: 'underline', fontWeight: 500 }}>
              En savoir plus
            </a>.
          </div>
          <div id="user-notice-btns" style={buttonGroupStyle}>
            <button
              style={acceptHover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
              onClick={() => handleChoice('accept')}
              onMouseEnter={() => setAcceptHover(true)}
              onMouseLeave={() => setAcceptHover(false)}
              autoFocus
              aria-label="Accepter l'utilisation des cookies"
            >
              Accepter
            </button>
            <button
              style={refuseHover ? { ...refuseButtonStyle, ...refuseButtonHoverStyle } : refuseButtonStyle}
              onClick={() => handleChoice('refuse')}
              onMouseEnter={() => setRefuseHover(true)}
              onMouseLeave={() => setRefuseHover(false)}
              aria-label="Refuser l'utilisation des cookies"
            >
              Refuser
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 