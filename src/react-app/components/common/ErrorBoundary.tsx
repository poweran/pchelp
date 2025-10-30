import { Component, ErrorInfo, ReactNode, CSSProperties } from 'react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
}

function DefaultErrorFallback({ error }: ErrorFallbackProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div style={containerStyle}>
      <div style={errorCardStyle}>
        <div style={iconStyle}>⚠️</div>
        <h2 style={titleStyle}>Что-то пошло не так</h2>
        <p style={messageStyle}>
          Произошла неожиданная ошибка. Пожалуйста, попробуйте перезагрузить страницу.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details style={detailsStyle}>
            <summary style={summaryStyle}>Подробности ошибки</summary>
            <pre style={errorDetailsStyle}>
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}

        <Button onClick={handleReload} variant="primary">
          Перезагрузить страницу
        </Button>
      </div>
    </div>
  );
}

// Стили компонента
const containerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '50vh',
  padding: '2rem',
  backgroundColor: '#f8fafc',
};

const errorCardStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '0.75rem',
  padding: '2rem',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e2e8f0',
  maxWidth: '500px',
  width: '100%',
  textAlign: 'center',
};

const iconStyle: CSSProperties = {
  fontSize: '3rem',
  marginBottom: '1rem',
};

const titleStyle: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '0.75rem',
};

const messageStyle: CSSProperties = {
  color: '#64748b',
  marginBottom: '1.5rem',
  lineHeight: '1.6',
};

const detailsStyle: CSSProperties = {
  marginBottom: '1.5rem',
  textAlign: 'left',
};

const summaryStyle: CSSProperties = {
  cursor: 'pointer',
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '0.5rem',
};

const errorDetailsStyle: CSSProperties = {
  backgroundColor: '#f1f5f9',
  padding: '1rem',
  borderRadius: '0.375rem',
  fontSize: '0.75rem',
  color: '#991b1b',
  whiteSpace: 'pre-wrap',
  overflow: 'auto',
  maxHeight: '200px',
};