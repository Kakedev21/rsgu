import * as React from 'react';

interface EmailTemplateProps {
  passwordLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  passwordLink,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif' }}>
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 24px',
        backgroundColor: '#dc2626',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e2e8f0',
        borderRadius: '0 0 8px 8px',
      }}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Batangas_State_Logo.png/200px-Batangas_State_Logo.png"
        width={48}
        height={48}
        alt="logo"
        style={{ display: 'block' }}
      />
      <div>
        <p style={{ margin: 0, color: '#f1f5f9', fontSize: '18px', fontWeight: 'bold' }}>
          Batangas State University
        </p>
        <span style={{ fontSize: '10px', color: '#f1f5f9' }}>
          Leading Innovations, Transforming Lives
        </span>
      </div>
    </header>
    <p style={{ color: '#111827' }}>
      Click the link to reset your password: <a href={passwordLink}>Link</a>
    </p>
  </div>
);
