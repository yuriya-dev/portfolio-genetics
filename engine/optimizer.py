import sys
import json
import numpy as np
import pandas as pd
import yfinance as yf
import math

# --- 1. KONFIGURASI & INPUT ---
# Kita mengambil input dari argumen command line
# Contoh call: python optimizer.py "BBCA.JK,ADRO.JK,ANTM.JK" 0.5
try:
    if len(sys.argv) < 3:
        raise ValueError("Argumen kurang. Format: python optimizer.py <TICKERS> <RISK_AVERSION>")
    
    TICKERS = sys.argv[1].split(',')
    RISK_AVERSION = float(sys.argv[2])
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

# Parameter GA (Bisa juga dibuat dinamis jika perlu)
START_DATE = '2022-01-01'
POP_SIZE = 100
GENERATIONS = 50  # Dikurangi sedikit agar respons web tidak terlalu lama (bisa disesuaikan)
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

# --- 2. FUNGSI DATA FETCHING ---
def get_data(tickers):
    try:
        raw_data = yf.download(tickers, start=START_DATE, progress=False)
        
        # Penanganan MultiIndex (seperti di notebook Anda)
        if isinstance(raw_data.columns, pd.MultiIndex):
            close_cols = [col for col in raw_data.columns if 'close' in str(col).lower()]
            if not close_cols:
                # Fallback jika nama kolom berbeda
                if 'Adj Close' in raw_data.columns:
                    data = raw_data['Adj Close']
                elif 'Close' in raw_data.columns:
                    data = raw_data['Close']
                else:
                    raise ValueError("Kolom harga tidak ditemukan.")
            else:
                data = raw_data.loc[:, close_cols]
                if isinstance(data.columns, pd.MultiIndex):
                    data.columns = [col[-1] for col in data.columns]
        else:
            if 'Adj Close' in raw_data.columns:
                data = raw_data['Adj Close']
            elif 'Close' in raw_data.columns:
                data = raw_data['Close']
            else:
                raise ValueError("Kolom harga tidak ditemukan.")

        data = data.dropna()
        returns_daily = data.pct_change().dropna()
        
        mean_returns = returns_daily.mean() * 252
        cov_matrix = returns_daily.cov() * 252
        
        return mean_returns, cov_matrix
    except Exception as e:
        raise ValueError(f"Gagal mengambil data saham: {str(e)}")

# --- 3. LOGIKA GENETIC ALGORITHM ---

def create_individual(n_assets):
    w = np.random.rand(n_assets)
    return w / np.sum(w)

def population_init(size, n_assets):
    return np.array([create_individual(n_assets) for _ in range(size)])

def portfolio_performance(weights, mean_returns, cov_matrix):
    ret = np.dot(weights, mean_returns.values)
    risk = math.sqrt(np.dot(weights.T, np.dot(cov_matrix.values, weights)))
    return ret, risk

def fitness_func(weights, mean_returns, cov_matrix, risk_aversion):
    ret, risk = portfolio_performance(weights, mean_returns, cov_matrix)
    return ret - risk_aversion * risk

def tournament_selection(pop, fits, k=3):
    idx = np.random.choice(len(pop), k, replace=False)
    best = idx[np.argmax(fits[idx])]
    return pop[best].copy()

def crossover(parent1, parent2, n_assets):
    alpha = np.random.rand(n_assets)
    child = alpha * parent1 + (1 - alpha) * parent2
    child = np.clip(child, 0, None) # pastikan tidak negatif
    if child.sum() == 0:
        child = create_individual(n_assets)
    else:
        child = child / child.sum()
    return child

def mutate(weights, n_assets, mutation_rate=0.1, mutation_strength=0.2):
    if np.random.rand() < mutation_rate:
        i = np.random.randint(0, n_assets)
        change = np.random.normal(0, mutation_strength)
        weights[i] = max(weights[i] + change, 0)
        if weights.sum() == 0:
            weights = create_individual(n_assets)
        else:
            weights = weights / weights.sum()
    return weights

# --- 4. MAIN PROCESS ---
def run_optimization():
    try:
        # 1. Get Data
        mean_returns, cov_matrix = get_data(TICKERS)
        n_assets = len(TICKERS)

        # 2. Init GA
        pop = population_init(POP_SIZE, n_assets)
        
        # Untuk menyimpan history (untuk grafik frontend)
        history_best_fitness = []
        history_avg_fitness = []

        # 3. Evolution Loop
        for gen in range(GENERATIONS):
            fits = np.array([fitness_func(ind, mean_returns, cov_matrix, RISK_AVERSION) for ind in pop])
            
            # Record history
            history_best_fitness.append(float(np.max(fits)))
            history_avg_fitness.append(float(np.mean(fits)))

            # Elitism
            new_pop = []
            elite_idx = np.argsort(fits)[-2:]
            new_pop.extend(pop[elite_idx].copy())

            while len(new_pop) < POP_SIZE:
                p1 = tournament_selection(pop, fits)
                p2 = tournament_selection(pop, fits)
                child = crossover(p1, p2, n_assets)
                child = mutate(child, n_assets)
                new_pop.append(child)
            
            pop = np.array(new_pop)

        # 4. Get Best Result
        fits = np.array([fitness_func(ind, mean_returns, cov_matrix, RISK_AVERSION) for ind in pop])
        best_idx = np.argmax(fits)
        best_weights = pop[best_idx]
        best_ret, best_risk = portfolio_performance(best_weights, mean_returns, cov_matrix)

        # 5. Generate Efficient Frontier Data (Sampling for Scatter Plot)
        # Kita generate sampel portofolio acak agar frontend bisa merender scatter plot
        # Tidak perlu sebanyak notebook (5000), cukup 200-300 agar JSON ringan
        n_samples = 300
        frontier_data = []
        for _ in range(n_samples):
            w = create_individual(n_assets)
            r, s = portfolio_performance(w, mean_returns, cov_matrix)
            frontier_data.append({
                "return": float(r), 
                "risk": float(s), 
                "sharpe": float((r - 0.02) / s) if s != 0 else 0 # Asumsi risk free 2%
            })
        
        # Masukkan juga titik terbaik ke frontier data
        frontier_data.append({
            "return": float(best_ret),
            "risk": float(best_risk),
            "sharpe": float((best_ret - 0.02) / best_risk) if best_risk != 0 else 0,
            "is_optimal": True # Flag untuk frontend menandai titik ini
        })

        # 6. Format JSON Output
        composition = []
        for i, ticker in enumerate(TICKERS):
            if best_weights[i] > 0.001: # Filter bobot yang sangat kecil
                composition.append({
                    "ticker": ticker,
                    "weight": float(round(best_weights[i], 4)),
                    "percentage": f"{round(best_weights[i]*100, 2)}%"
                })

        result = {
            "status": "success",
            "metrics": {
                "expected_return": float(best_ret),
                "risk": float(best_risk),
                "fitness": float(fits[best_idx])
            },
            "composition": composition,
            "history": {
                "generation": list(range(1, GENERATIONS + 1)),
                "best_fitness": history_best_fitness,
                "avg_fitness": history_avg_fitness
            },
            "efficient_frontier": frontier_data
        }

        print(json.dumps(result))

    except Exception as e:
        error_response = {
            "status": "error",
            "message": str(e)
        }
        print(json.dumps(error_response))

if __name__ == "__main__":
    run_optimization()