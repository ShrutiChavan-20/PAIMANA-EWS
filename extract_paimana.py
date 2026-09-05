import pdfplumber
import re
import json
import os
import pandas as pd
from datetime import datetime

PDF_PATH = "src/data/FlashReport_July_2026 (1).pdf"
OUTPUT_JSON = "src/data/paimana_projects.json"
OUTPUT_CSV = "src/data/paimana_projects.csv"
OUTPUT_JS = "src/data/paimanaData.js"

def parse_month_year(date_str):
    if not date_str or date_str.strip() in ['-', '(-)', '']:
        return None
    date_str = date_str.strip().replace('(', '').replace(')', '').strip()
    match = re.search(r'(\d{1,2})/(\d{4})', date_str)
    if match:
        m, y = int(match.group(1)), int(match.group(2))
        return y * 12 + m
    return None

def calc_month_diff(doc_orig, doc_rev):
    m_orig = parse_month_year(doc_orig)
    m_rev = parse_month_year(doc_rev)
    if m_orig and m_rev:
        return m_rev - m_orig
    return 0

def clean_num(val):
    if val is None:
        return 0.0
    val_str = str(val).replace(',', '').replace('(', '').replace(')', '').strip()
    try:
        return float(val_str)
    except:
        return 0.0

def parse_paimana_pdf(pdf_path):
    print(f"Opening {pdf_path}...")
    projects = []
    current_ministry = "Central Sector"
    current_sector = "Infrastructure"
    
    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        print(f"Total pages: {total_pages}. Processing Table 6 (pages 55 to 153)...")
        
        for p_idx in range(54, total_pages):
            page = pdf.pages[p_idx]
            tables = page.extract_tables()
            if not tables:
                continue
                
            for table in tables:
                for row in table:
                    if not row or len(row) < 5:
                        continue
                    
                    col0 = (row[0] or "").strip()
                    col1 = (row[1] or "").strip()
                    
                    # Skip table header row
                    if "Sl.No" in col0 or "Project Name" in col1:
                        continue
                        
                    # Check if ministry header row
                    if col0 == "" and col1.startswith("Ministry of ") or col1.startswith("Department of ") or col1.startswith("Department for "):
                        current_ministry = col1
                        continue
                    
                    # Check if sector header row
                    if col0 == "" and col1 and not col1.isdigit() and len(row) > 2 and row[2] is None:
                        current_sector = col1
                        continue
                        
                    # It's a project row if col0 is a digit or has project number
                    if col0.isdigit():
                        sl_no = int(col0)
                        raw_name_block = col1
                        state = (row[2] or "").replace('\n', ' ').strip()
                        raw_approval_start = row[3] or ""
                        raw_doc = row[4] or ""
                        raw_cost = row[5] or ""
                        raw_exp = row[6] or ""
                        raw_progress = row[7] if len(row) > 7 else "0"
                        
                        # Parse project name, agency, project code
                        lines = [l.strip() for l in raw_name_block.split('\n') if l.strip()]
                        name_parts = []
                        agency = ""
                        project_code = ""
                        
                        for line in lines:
                            if line.startswith("(") and line.endswith(")") and ("[" in line or "Ltd" in line or "Authority" in line or "Corp" in line or "Rail" in line or "NHAI" in line or "AAI" in line or "NTPC" in line or "IOCL" in line or "BPCL" in line or "ONGC" in line):
                                agency = line[1:-1]
                            elif re.match(r'^\(\d+\)$', line):
                                project_code = line[1:-1]
                            elif not line.startswith("(-)") and not re.match(r'^\(.*\)$', line):
                                name_parts.append(line)
                            elif line.startswith("(") and not agency and len(name_parts) > 0:
                                agency = line[1:-1]
                                
                        project_name = " ".join(name_parts) if name_parts else (lines[0] if lines else f"Project {sl_no}")
                        
                        # Parse dates
                        # Format: "03/2023\n(01/2024)"
                        appr_match = re.search(r'(\d{1,2}/\d{4})', raw_approval_start)
                        approval_date = appr_match.group(1) if appr_match else ""
                        
                        start_matches = re.findall(r'(\d{1,2}/\d{4})', raw_approval_start)
                        start_date = start_matches[1] if len(start_matches) > 1 else approval_date
                        
                        doc_matches = re.findall(r'(\d{1,2}/\d{4})', raw_doc)
                        orig_doc = doc_matches[0] if len(doc_matches) > 0 else ""
                        rev_doc = doc_matches[1] if len(doc_matches) > 1 else orig_doc
                        
                        # Parse costs: "265.91\n(265.91)"
                        cost_nums = re.findall(r'[\d,]+(?:\.\d+)?', raw_cost)
                        orig_cost = clean_num(cost_nums[0]) if len(cost_nums) > 0 else 0.0
                        rev_cost = clean_num(cost_nums[1]) if len(cost_nums) > 1 else orig_cost
                        
                        exp_nums = re.findall(r'[\d,]+(?:\.\d+)?', raw_exp)
                        cumulative_exp = clean_num(exp_nums[0]) if len(exp_nums) > 0 else 0.0
                        
                        prog_nums = re.findall(r'[\d,]+(?:\.\d+)?', str(raw_progress))
                        physical_progress = clean_num(prog_nums[0]) if len(prog_nums) > 0 else 0.0
                        
                        # Derived fields
                        cost_overrun_cr = round(rev_cost - orig_cost, 2)
                        cost_overrun_pct = round((cost_overrun_cr / orig_cost * 100), 2) if orig_cost > 0 else 0.0
                        time_overrun_months = max(0, calc_month_diff(orig_doc, rev_doc))
                        financial_progress_pct = round((cumulative_exp / rev_cost * 100), 2) if rev_cost > 0 else 0.0
                        divergence_gap = round(physical_progress - financial_progress_pct, 2)
                        
                        # Risk assessment
                        risk_score = 0
                        # Time delay penalty (up to 40 pts)
                        if time_overrun_months > 36:
                            risk_score += 40
                        elif time_overrun_months > 12:
                            risk_score += 25
                        elif time_overrun_months > 0:
                            risk_score += 10
                            
                        # Cost escalation penalty (up to 40 pts)
                        if cost_overrun_pct > 30:
                            risk_score += 40
                        elif cost_overrun_pct > 10:
                            risk_score += 25
                        elif cost_overrun_pct > 0:
                            risk_score += 10
                            
                        # Decoupling penalty (spend without progress) (up to 20 pts)
                        if divergence_gap < -25:
                            risk_score += 20
                        elif divergence_gap < -10:
                            risk_score += 10
                            
                        # Status categorization
                        if risk_score >= 50 or time_overrun_months > 24 or cost_overrun_pct > 25:
                            status = "critical"
                            status_label = "High Risk (Critical)"
                        elif risk_score >= 20 or time_overrun_months > 0 or cost_overrun_pct > 0:
                            status = "delayed"
                            status_label = "Watchlist (Amber)"
                        else:
                            status = "on-track"
                            status_label = "On Track (Green)"
                            
                        trust_score = max(10, min(99, 100 - risk_score))
                        
                        projects.append({
                            "id": sl_no,
                            "projectCode": project_code or f"PAI-{sl_no:04d}",
                            "title": project_name,
                            "agency": agency or "Central Agency",
                            "ministry": current_ministry,
                            "category": current_sector,
                            "state": state or "National",
                            "approvalDate": approval_date,
                            "startDate": start_date,
                            "targetDoC": orig_doc,
                            "revisedDoC": rev_doc,
                            "originalCostCr": orig_cost,
                            "revisedCostCr": rev_cost,
                            "spentCr": cumulative_exp,
                            "physicalProgress": physical_progress,
                            "financialProgress": financial_progress_pct,
                            "costOverrunCr": cost_overrun_cr,
                            "costOverrunPct": cost_overrun_pct,
                            "delayMonths": time_overrun_months,
                            "riskScore": risk_score,
                            "trustScore": trust_score,
                            "status": status,
                            "statusLabel": status_label,
                            "divergenceGap": divergence_gap
                        })
                        
    print(f"Extraction complete! Extracted {len(projects)} infrastructure projects.")
    return projects

if __name__ == "__main__":
    projects = parse_paimana_pdf(PDF_PATH)
    
    # Save CSV
    df = pd.DataFrame(projects)
    df.to_csv(OUTPUT_CSV, index=False)
    print(f"Saved CSV: {OUTPUT_CSV}")
    
    # Save JSON
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2)
    print(f"Saved JSON: {OUTPUT_JSON}")
    
    # Summary stats
    total_projects = len(projects)
    total_orig_cost = df['originalCostCr'].sum()
    total_rev_cost = df['revisedCostCr'].sum()
    total_spent = df['spentCr'].sum()
    total_escalation = total_rev_cost - total_orig_cost
    critical_count = len(df[df['status'] == 'critical'])
    delayed_count = len(df[df['status'] == 'delayed'])
    ontrack_count = len(df[df['status'] == 'on-track'])
    
    summary = {
        "reportMonth": "July 2026",
        "totalProjects": total_projects,
        "totalOriginalCostCr": round(total_orig_cost, 2),
        "totalRevisedCostCr": round(total_rev_cost, 2),
        "totalEscalationCr": round(total_escalation, 2),
        "totalSpentCr": round(total_spent, 2),
        "criticalProjects": critical_count,
        "delayedProjects": delayed_count,
        "onTrackProjects": ontrack_count,
        "topSectors": df['category'].value_counts().head(10).to_dict(),
        "topMinistries": df['ministry'].value_counts().head(10).to_dict(),
        "topStates": df['state'].value_counts().head(10).to_dict(),
    }
    
    print("\n--- NATIONAL PAIMANA SUMMARY ---")
    print(f"Total Projects Extracted: {total_projects}")
    print(f"Total Original Cost: ₹{total_orig_cost:,.2f} Cr")
    print(f"Total Revised Cost: ₹{total_rev_cost:,.2f} Cr")
    print(f"Total Cost Escalation: ₹{total_escalation:,.2f} Cr")
    print(f"Status Breakdown: {ontrack_count} On-Track | {delayed_count} Watchlist | {critical_count} Critical")
