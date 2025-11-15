---

## Assignment 2 - Contract Modification Module

### Objective

Develop a system that tracks regulatory updates and **automatically modifies contracts** based on identified risks or missing clauses.

### Tasks

1. Integrate APIs or monitoring systems to track legal changes (e.g., GDPR, HIPAA).  

2. Automatically update contracts with:
   - Missing key clauses  
   - Clauses that reduce risks

3. Example Scenarios:

| Scenario | Action | Outcome |
|----------|--------|---------|
| HIPAA | Add missing clause "Data Privacy Protection Right" | Modified contract contains the new clause |
| GDPR | Add missing risk clause | Reduces contract compliance risk |



- The system allows **downloading the updated contract** with all necessary amendments applied.

---

## System Features

1. **Clause Extraction (Assignment 1):**  
   - Identify key clauses using LLMs  
   - Generate confidence scores  
   - Classify clause types  

2. **Risk Assessment (Assignment 1 & 2):**  
   - Assess risk level for each clause (low, medium, high)  
   - Justification for flagged clauses  
   - Highlight top contributing words  

3. **Contract Modification (Assignment 2):**  
   - Add missing clauses automatically  
   - Suggest updates based on regulatory changes  
   - Generate downloadable updated contracts  

4. **AI Monitoring System:**  
   - Tracks legal updates from multiple jurisdictions  
   - Provides real-time notifications  
   - Suggests amendments to keep contracts compliant

---

## Methodology

- **Agile Development:** Iterative development and frequent testing  
- **Data Sources:** Google Sheets, public websites, emails  
- **Data Quality Focus:** Ensure data cleanliness, accuracy, and proper linkage of contract parameters to regulations  

---

## Tools & Technologies

- **Frontend:** React, Recharts (for charts), Bootstrap  
- **Backend:** Flask / FastAPI (Python)  
- **AI Models:** OpenAI GPT, Meta LLaMA, other LLMs  
- **Data Storage:** Local JSON or Database (PostgreSQL / MongoDB optional)  
- **Version Control:** Git / GitHub  

