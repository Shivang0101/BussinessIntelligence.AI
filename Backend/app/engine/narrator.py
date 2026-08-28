import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def generate_persona_narrative(investigation_tree: dict, persona_id: str = "coo") -> str:
    """
    Generates persona-adapted executive summary narrative using Gemini API (with fallback template).
    """
    target_month = investigation_tree.get("target_month", "")
    kpi_title = investigation_tree.get("title", "Revenue")
    status = investigation_tree.get("status", "NORMAL")
    mom_delta = investigation_tree.get("mom_delta_pct", 0)
    current_val = investigation_tree.get("current_value", 0)
    tree = investigation_tree.get("tree", {})
    
    # Check for Abstention
    if status == "ABSTAIN":
        return f"⛔ EXECUTIVE WARNING ({target_month}): {investigation_tree.get('message', 'Sample size insufficient.')}"

    # Extract top 2 driver branches from tree
    top_drivers = []
    if tree and "children" in tree:
        for child in tree["children"]:
            if child.get("node_type") == "DRIVER":
                top_drivers.append({
                    "title": child.get("title"),
                    "contrib": child.get("contribution_pct"),
                    "conf": child.get("confidence_score"),
                    "hypothesis": child.get("hypothesis")
                })
        top_drivers.sort(key=lambda x: x.get("contrib", 0), reverse=True)

    # 1. Fallback template generator
    def fallback_story():
        dir_word = "dropped" if mom_delta < 0 else "rose"
        p_name = "Chief Operating Officer" if persona_id == "coo" else "Chief Marketing Officer" if persona_id == "cmo" else "Executive Leader"
        
        story = f"**{p_name} Diagnostic Briefing — {target_month}**\n\n"
        story += f"{kpi_title} {dir_word} by **{abs(mom_delta):.1f}% MoM** to **{current_val:,.0f}**.\n\n"
        story += "### Key Causal Drivers:\n"
        
        for d in top_drivers[:3]:
            story += f"- **{d['title']}** (Contribution: {d['contrib']}%, Confidence: {d['conf']}%): {d['hypothesis']}\n"
            
        story += "\n*Generated via Deterministic Graph Analysis & Statistical Test Battery.*"
        return story

    if not GEMINI_API_KEY:
        return fallback_story()

    # 2. Gemini API Call
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        prompt = f"""
You are an expert BI Executive Narrator for a major e-commerce enterprise.
Synthesize the following deterministic diagnostic data into a crisp 3-paragraph executive summary tailored for the {persona_id.upper()} persona.

Data:
Target Month: {target_month}
KPI: {kpi_title} ({current_val}, MoM Shift: {mom_delta}%)
Persona: {persona_id.upper()}
Top Drivers: {top_drivers}

Instructions:
1. Paragraph 1: Headline anomaly summary with direction and exact figures.
2. Paragraph 2: Top ranked causes, citing evidence IDs and confidence levels.
3. Paragraph 3: Recommended tactical next steps for the {persona_id.upper()}.
Keep tone professional, analytical, and concise. Avoid fluff.
"""
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return fallback_story()
