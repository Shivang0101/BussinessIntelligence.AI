import json
import os

FEEDBACK_FILE = os.path.join(os.path.dirname(__file__), "feedback_store.json")

def save_feedback(hypothesis_id: str, feedback_type: str, user_comment: str, target_month: str, persona: str) -> dict:
    feedback_entry = {
        "hypothesis_id": hypothesis_id,
        "feedback_type": feedback_type,  # 'agree', 'disagree', 'edit'
        "user_comment": user_comment,
        "target_month": target_month,
        "persona": persona
    }
    
    existing = []
    if os.path.exists(FEEDBACK_FILE):
        try:
            with open(FEEDBACK_FILE, "r") as f:
                existing = json.load(f)
        except Exception:
            existing = []
            
    existing.append(feedback_entry)
    
    with open(FEEDBACK_FILE, "w") as f:
        json.dump(existing, f, indent=2)
        
    return {"status": "saved", "entry": feedback_entry, "total_feedback_count": len(existing)}

def get_feedback():
    if os.path.exists(FEEDBACK_FILE):
        try:
            with open(FEEDBACK_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return []
    return []
