def calculate_confidence_score(test_results: dict, sample_size: int = 6500) -> float:
    """
    Computes confidence score based on test weights and sample size penalties.
    Weights:
      - Temporal co-occurrence: 20%
      - Direction consistency: 25%
      - Magnitude proportionality: 20%
      - Counterfactual check: 20%
      - Evidence density: 15%
    """
    test_weights = {
        "temporal": 0.20,
        "direction": 0.25,
        "magnitude": 0.20,
        "counterfactual": 0.20,
        "evidence": 0.15
    }
    
    score = 0.0
    for test_key, weight in test_weights.items():
        res = test_results.get(test_key, {})
        passed = res.get("passed", False)
        weakened = res.get("weakened", False)
        
        if passed:
            score += weight * 1.0
        elif weakened:
            score += weight * 0.4
        else:
            score += weight * 0.0
            
    confidence = score * 100.0
    
    # Penalize for small sample size
    if sample_size and sample_size < 1000:
        penalty_factor = max(0.2, sample_size / 1000.0)
        confidence *= penalty_factor
        
    return round(min(99.0, max(15.0, confidence)), 1)
