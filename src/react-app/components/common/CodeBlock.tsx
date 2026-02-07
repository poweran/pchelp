import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeBlock.css';

interface CodeBlockProps {
    language?: string;
    value: string;
    inline?: boolean;
    className?: string;
}

export const CodeBlock = ({ language, value, inline, className }: CodeBlockProps) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering parent click handlers (like accordion)
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    if (inline) {
        return (
            <code
                className={`code-inline ${className || ''} ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title={copied ? t('common.copied', 'Copied!') : t('common.clickToCopy', 'Click to copy')}
            >
                {value}
            </code>
        );
    }

    return (
        <div
            className={`code-block-wrapper ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title={copied ? t('common.copied', 'Copied!') : t('common.clickToCopy', 'Click to copy')}
        >
            <SyntaxHighlighter
                language={language || 'text'}
                style={vscDarkPlus}
                customStyle={{ margin: 0, borderRadius: '8px', padding: '1rem' }}
                wrapLines={true}
            >
                {value}
            </SyntaxHighlighter>
            {copied && <div className="code-block-feedback">{t('common.copied', 'Copied!')}</div>}
        </div>
    );
};
