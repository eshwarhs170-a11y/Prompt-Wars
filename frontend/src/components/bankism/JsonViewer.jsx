import { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

const TOKEN_RE = /("(?:\\.|[^"\\])*")(\s*:)?|\b(?:true|false)\b|\bnull\b|-?\d+(?:\.\d+)?/g;

function highlight(json) {
  const nodes = [];
  let last = 0;
  let key = 0;
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(json)) !== null) {
    if (m.index > last) nodes.push(json.slice(last, m.index));
    const [token, str, colon] = m;
    if (str) {
      nodes.push(
        <span key={key++} className={colon ? 'json-key' : 'json-str'}>{str}</span>
      );
      if (colon) nodes.push(colon);
    } else if (token === 'null') {
      nodes.push(<span key={key++} className="json-null">{token}</span>);
    } else {
      nodes.push(<span key={key++} className="json-num">{token}</span>);
    }
    last = m.index + token.length;
  }
  if (last < json.length) nodes.push(json.slice(last));
  return nodes;
}

export default function JsonViewer({ data }) {
  const [copied, setCopied] = useState(false);
  const text = useMemo(() => JSON.stringify(data, null, 2), [data]);
  const highlightedNodes = useMemo(() => highlight(text), [text]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="json-block">
      <div className="json-head">
        <span className="json-title">Machine-readable output</span>
        <button type="button" className="btn-ghost sm" onClick={copy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="json-body">{highlightedNodes}</pre>
    </div>
  );
}
