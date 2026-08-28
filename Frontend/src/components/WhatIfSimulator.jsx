import React, { useState } from 'react';
import { Sliders, ArrowRight, Sparkles } from 'lucide-react';

export default function WhatIfSimulator({ selectedKPI = 'revenue', onSimulate }) {
  const [driver, setDriver] = useState('avg_delivery_days');
  const [newValue, setNewValue] = useState(8.0);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const driverOptions = [
    { key: 'avg_delivery_days', title: 'Avg Delivery Days', min: 4, max: 25, step: 0.5, default: 8.0, unit: 'days' },
    { key: 'competitor_discount_pct', title: 'Competitor Discount %', min: 5, max: 40, step: 1, default: 15.0, unit: '%' },
    { key: 'ad_spend', title: 'Monthly Ad Spend (R$)', min: 100000, max: 600000, step: 25000, default: 350000, unit: 'BRL' },
    { key: 'product_availability_pct', title: 'Product Availability %', min: 30, max: 95, step: 2, default: 60.0, unit: '%' },
  ];

  const currentOption = driverOptions.find(o => o.key === driver) || driverOptions[0];

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await onSimulate(selectedKPI, driver, Number(newValue));
      setSimulationResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <Sliders size={20} color="var(--primary-accent)" />
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          What-If Scenario Simulator (OLS Regression)
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
            Select Driver Metric:
          </label>
          <select 
            value={driver} 
            onChange={(e) => {
              const selectedKey = e.target.value;
              setDriver(selectedKey);
              const opt = driverOptions.find(o => o.key === selectedKey);
              if (opt) setNewValue(opt.default);
            }}
            style={{ width: '100%', background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid var(--bg-card-border)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}
          >
            {driverOptions.map(o => (
              <option key={o.key} value={o.key} style={{ background: '#121826' }}>{o.title}</option>
            ))}
          </select>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span>Target Value: <strong>{newValue} {currentOption.unit}</strong></span>
          </div>

          <input 
            type="range"
            min={currentOption.min}
            max={currentOption.max}
            step={currentOption.step}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--primary-accent)', cursor: 'pointer' }}
          />

          <button 
            onClick={handleSimulate}
            disabled={loading}
            style={{ marginTop: '16px', background: 'var(--primary-accent)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={14} />
            {loading ? 'Calculating OLS...' : 'Run Simulation'}
          </button>
        </div>

        {/* Results display */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {simulationResult ? (
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Predicted Revenue Impact
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>R${simulationResult.current_kpi_value?.toLocaleString()}</div>
                </div>
                <ArrowRight size={16} color="var(--primary-accent)" />
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary-accent)' }}>Simulated</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: simulationResult.delta_kpi_pct >= 0 ? 'var(--status-green)' : 'var(--status-red)' }}>
                    R${simulationResult.simulated_kpi_value?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: simulationResult.delta_kpi_pct >= 0 ? 'var(--status-green)' : 'var(--status-red)' }}>
                {simulationResult.delta_kpi_pct >= 0 ? '+' : ''}{simulationResult.delta_kpi_pct}% (R${simulationResult.delta_kpi_abs?.toLocaleString()})
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Regression coefficient: {simulationResult.regression_coefficient} (R² = {simulationResult.r2_score})
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0' }}>
              Adjust slider and click "Run Simulation" to model revenue change.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
