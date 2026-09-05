import pandas as pd

df = pd.read_csv('src/data/paimana_projects.csv')
orig = df['originalCostCr'].sum()
rev = df['revisedCostCr'].sum()
esc = df['costOverrunCr'].sum()
spent = df['spentCr'].sum()

print('=== NATIONAL DATASET OVERVIEW (JULY 2026) ===')
print(f'Total Projects Extracted: {len(df):,}')
print(f'Total Original Cost: Rs. {orig:,.2f} Cr ({orig/100000:.2f} Lakh Crore)')
print(f'Total Revised Cost:  Rs. {rev:,.2f} Cr ({rev/100000:.2f} Lakh Crore)')
print(f'Total Escalation:    Rs. {esc:,.2f} Cr')
print(f'Total Expenditure:   Rs. {spent:,.2f} Cr')

print('\n=== RISK TRIAGE ===')
for k, v in df['status'].value_counts().items():
    print(f'  {k.upper()}: {v} ({v/len(df)*100:.1f}%)')

print('\n=== TOP 5 MINISTRIES ===')
for k, v in df['ministry'].value_counts().head(5).items():
    print(f'  {k}: {v} projects')

print('\n=== TOP 5 SECTORS ===')
for k, v in df['category'].value_counts().head(5).items():
    print(f'  {k}: {v} projects')

delayed = df[df['delayMonths'] > 0]
print(f'\nDelayed Projects: {len(delayed)} ({len(delayed)/len(df)*100:.1f}%)')
print(f'Average Delay for Delayed Projects: {delayed["delayMonths"].mean():.1f} months')
print(f'Max Delay: {df["delayMonths"].max()} months')
