import pandas as pd

# Load the data
df = pd.read_csv('owid-covid-data.csv')

# Select the columns
df = df[['date', 'total_cases', 'people_vaccinated', 'people_fully_vaccinated', 'total_boosters']]

# Save the data
df.to_csv('owid-covid-data.csv', index=False)