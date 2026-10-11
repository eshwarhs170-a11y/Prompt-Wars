import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { LAYERS } from './constants';

export default function PipelineStrip({ trace = [] }) {
  const byLayer = Object.fromEntries(trace.map((t) => [t.layer, t]));

  return (
    <div className="pipeline">
      <div className="pipeline-track">
        {LAYERS.map((layer, i) => {
          const step = byLayer[layer.id];
          const status = step?.status || 'idle';

          return (
            <div key={layer.id} className={`pipeline-node is-${status}`}>
              <div className="node-dot" style={{ animationDelay: `${i * 120}ms` }}>
                {status === 'pass' && <Check size={14} strokeWidth={3} />}
                {status === 'fail' && <X size={14} strokeWidth={3} />}
                {status === 'skip' && <Minus size={14} strokeWidth={3} />}
                {status === 'idle' && <span>{layer.id}</span>}
              </div>
              <div className="node-label">
                <span className="node-id">{layer.id}</span>
                <span className="node-name">{layer.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
