import React, { useState } from 'react';
import { Sliders, ArrowRight, Sparkles, TrendingUp, TrendingDown } from 'lucide-react';

export default function WhatIfSimulator({ selectedKPI = 'revenue', onSimulate }) {
  const [driver, setDriver] = useState('avg_delivery_days');
  const [newValue, setNewValue] = useState(8.0);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const driverOptions = [
    { key: 'avg_delivery_days', title: 'Average Delivery Time', min: 4, max: 25, step: 0.5, default: 8.0, unit: 'days' },
    { key: 'competitor_discount_pct', title: 'Competitor Discount Rate', min: 5, max: 40, step: 1, default: 15.0, unit: '%' },
    { key: 'ad_spend', title: 'Monthly Marketing Ad Spend', min: 100000, max: 600000, step: 25000, default: 350000, unit: 'BRL' },
    { key: 'product_availability_pct', title: 'Product Availability', min: 30, max: 95, step: 2, default: 60.0, unit: '%' },
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

  const formatCurrencyOrNumber = (val) => {
    if (val === null || val === undefined) return 'N/A';
    if (selectedKPI === 'revenue' || selectedKPI === 'avg_order_value' || selectedKPI === 'avg_item_price' || selectedKPI === 'ad_spend') {
      return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    if (selectedKPI === 'website_conversion_rate' || selectedKPI === 'late_delivery_pct' || selectedKPI === 'product_availability_pct') {
      return `${val.toFixed(1)}%`;
    }
    return `${val.toLocaleString()}`;
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', pb: '12px' }}>
        <div style={{ background: 'var(--primary-gradient)', padding: '7px', borderRadius: '10px', display: 'flex', color: '#fff' }}>
          <Sliders size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            What-If Scenario Simulator
          </h3>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>OLS Linear Regression Sensitivity Model</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Adjust Driver Metric:
          </label>
          <select 
            value={driver} 
            onChange={(e) => {
              const selectedKey = e.target.value;
              setDriver(selectedKey);
              const opt = driverOptions.find(o => o.key === selectedKey);
              if (opt) setNewValue(opt.default);
            }}
            style={{ 
              width: '100%', 
              background: 'rgba(0,0,0,0.4)', 
              color: '#fff', 
              border: '1px solid var(--bg-card-border)', 
              padding: '10px 14px', 
              borderRadius: '10px', 
              fontSize: '0.85rem', 
              marginBottom: '16px',
              cursor: 'pointer' 
            }}
          >
            {driverOptions.map(o => (
              <option key={o.key} value={o.key} style={{ background: '#121826' }}>{o.title}</option>
            ))}
          </select>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            <span>Target Driver Setting:</span>
            <strong style={{ color: 'var(--primary-accent)' }}>{newValue} {currentOption.unit}</strong>
          </div>

          <input 
            type="range"
            min={currentOption.min}
            max={currentOption.max}
            step={currentOption.step}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--primary-accent)', cursor: 'pointer', height: '6px' }}
          />

          <button 
            onClick={handleSimulate}
            disabled={loading}
            style={{ 
              marginTop: '18px', 
              width: '100%',
              background: 'var(--primary-gradient)', 
              color: '#fff', 
              border: 'none', 
              padding: '10px 18px', 
              borderRadius: '10px', 
              fontWeight: 700, 
              fontSize: '0.88rem', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px var(--primary-glow)'
            }}
          >
            <Sparkles size={16} />
            {loading ? 'Calculating OLS Regression...' : 'Run Scenario Simulation'}
          </button>
        </div>

        {/* Results display */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {simulationResult ? (
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                Predicted {simulationResult.kpi_title} Impact
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current Baseline</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#94a3b8' }}>
                    {formatCurrencyOrNumber(simulationResult.current_kpi_value)}
                  </div>
                </div>

                <ArrowRight size={18} color="var(--primary-accent)" />

                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary-accent)' }}>Simulated Projection</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: simulationResult.delta_kpi_pct >= 0 ? 'var(--status-green)' : 'var(--status-red)' }}>
                    {formatCurrencyOrNumber(simulationResult.simulated_kpi_value)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: simulationResult.delta_kpi_pct >= 0 ? 'var(--status-green)' : 'var(--status-red)' }}>
                {simulationResult.delta_kpi_pct >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{simulationResult.delta_kpi_pct >= 0 ? '+' : ''}{simulationResult.delta_kpi_pct}% Projected Shift</span>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
                Regression coef: <code style={{ color: '#a5b4fc' }}>{simulationResult.regression_coefficient}</code> • R² model fit = <code style={{ color: '#a5b4fc' }}>{simulationResult.r2_score}</code>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '24px 0' }}>
              Adjust slider and click <strong>"Run Scenario Simulation"</strong> to model target KPI change.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
