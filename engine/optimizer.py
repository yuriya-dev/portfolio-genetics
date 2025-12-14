import sys
import json
import numpy as np
import pandas as pd
import yfinance as yf
import math

# --- 1. KONFIGURASI & INPUT ---
try:
    if len(sys.argv) < 3:
        raise ValueError("Argumen kurang. Format: python optimizer.py <TICKERS> <RISK_AVERSION>")
    
    TICKERS = sys.argv[1].split(',')
    RISK_AVERSION = float(sys.argv[2])
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

# Parameter GA (DITINGKATKAN untuk hasil lebih baik)
START_DATE = '2020-01-01'
POP_SIZE = 150 
GENERATIONS = 300  # Increased untuk konvergensi lebih baik
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

# CONSTRAINT PARAMETERS
MIN_WEIGHT = 0.05  # Minimum 5% alokasi per saham
MAX_WEIGHT = 0.50  # Maximum 50% alokasi per saham
CONCENTRATION_PENALTY = 0.3  # Penalty untuk portfolio tidak terdiversifikasi

# --- 2. FUNGSI DATA FETCHING ---
def get_data(tickers):
    try:
        raw_data = yf.download(tickers, start=START_DATE, progress=False)
        
        # Penanganan MultiIndex
        if isinstance(raw_data.columns, pd.MultiIndex):
            close_cols = [col for col in raw_data.columns if 'close' in str(col).lower()]
            if not close_cols:
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

# --- 3. LOGIKA GENETIC ALGORITHM (IMPROVED) ---

def create_individual(n_assets):
    """Create individual dengan constraint min/max weight"""
    w = np.random.rand(n_assets)
    w = w / np.sum(w)
    
    # Apply min/max constraints
    w = np.clip(w, MIN_WEIGHT, MAX_WEIGHT)
    
    # Re-normalize after clipping
    w = w / np.sum(w)
    
    return w

def population_init(size, n_assets):
    return np.array([create_individual(n_assets) for _ in range(size)])

def portfolio_performance(weights, mean_returns, cov_matrix):
    ret = np.dot(weights, mean_returns.values)
    risk = math.sqrt(np.dot(weights.T, np.dot(cov_matrix.values, weights)))
    return ret, risk

def fitness_func(weights, mean_returns, cov_matrix, risk_aversion):
    """
    Fitness dengan penalty untuk konsentrasi
    Herfindahl Index: sum(w^2) - semakin besar = semakin terkonsentrasi
    """
    ret, risk = portfolio_performance(weights, mean_returns, cov_matrix)
    
    # Calculate concentration (Herfindahl-Hirschman Index)
    concentration = np.sum(weights ** 2)
    
    # Fitness = Return - (Risk Aversion * Risk) - (Concentration Penalty * Concentration)
    fitness = ret - (risk_aversion * risk) - (CONCENTRATION_PENALTY * concentration)
    
    return fitness

def tournament_selection(pop, fits, k=3):
    idx = np.random.choice(len(pop), k, replace=False)
    best = idx[np.argmax(fits[idx])]
    return pop[best].copy()

def crossover(parent1, parent2, n_assets):
    """Uniform crossover dengan constraint"""
    alpha = np.random.rand(n_assets)
    child = alpha * parent1 + (1 - alpha) * parent2
    
    # Apply constraints
    child = np.clip(child, MIN_WEIGHT, MAX_WEIGHT)
    child = np.clip(child, 0, None)  # Pastikan tidak negatif
    
    # Normalize
    if child.sum() == 0:
        child = create_individual(n_assets)
    else:
        child = child / child.sum()
    
    return child

def mutate(weights, n_assets, mutation_rate=0.3, mutation_strength=0.15):
    """
    Mutation dengan constraint - IMPROVED
    Mutation rate ditingkatkan untuk eksplorasi lebih baik
    """
    if np.random.rand() < mutation_rate:
        # Random swap mutation (swap bobot 2 saham)
        if np.random.rand() < 0.5 and n_assets > 1:
            i, j = np.random.choice(n_assets, 2, replace=False)
            weights[i], weights[j] = weights[j], weights[i]
        else:
            # Gaussian mutation
            i = np.random.randint(0, n_assets)
            change = np.random.normal(0, mutation_strength)
            weights[i] = max(weights[i] + change, MIN_WEIGHT)
        
        # Apply constraints
        weights = np.clip(weights, MIN_WEIGHT, MAX_WEIGHT)
        
        # Normalize
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
        
        # Untuk menyimpan history
        history_best_fitness = []
        history_avg_fitness = []

        # 3. Evolution Loop
        for gen in range(GENERATIONS):
            fits = np.array([fitness_func(ind, mean_returns, cov_matrix, RISK_AVERSION) for ind in pop])
            
            # Record history
            history_best_fitness.append(float(np.max(fits)))
            history_avg_fitness.append(float(np.mean(fits)))

            # Elitism - keep top 10% (IMPROVED)
            elite_count = max(2, int(POP_SIZE * 0.1))
            elite_idx = np.argsort(fits)[-elite_count:]
            new_pop = list(pop[elite_idx].copy())

            # Generate rest of population
            while len(new_pop) < POP_SIZE:
                p1 = tournament_selection(pop, fits, k=5)  # Tournament size increased
                p2 = tournament_selection(pop, fits, k=5)
                child = crossover(p1, p2, n_assets)
                child = mutate(child, n_assets)
                new_pop.append(child)
            
            pop = np.array(new_pop)

        # 4. Get Best Result
        fits = np.array([fitness_func(ind, mean_returns, cov_matrix, RISK_AVERSION) for ind in pop])
        best_idx = np.argmax(fits)
        best_weights = pop[best_idx]
        best_ret, best_risk = portfolio_performance(best_weights, mean_returns, cov_matrix)

        # DEBUG OUTPUT (ke stderr agar tidak interfere dengan JSON)
        print(f"DEBUG: Best weights: {best_weights}", file=sys.stderr)
        print(f"DEBUG: Min weight: {best_weights.min():.4f}, Max weight: {best_weights.max():.4f}", file=sys.stderr)
        print(f"DEBUG: Concentration (HHI): {np.sum(best_weights**2):.4f}", file=sys.stderr)

        # 5. Generate Efficient Frontier Data
        n_samples = 300
        frontier_data = []
        for _ in range(n_samples):
            w = create_individual(n_assets)
            r, s = portfolio_performance(w, mean_returns, cov_matrix)
            frontier_data.append({
                "return": float(r), 
                "risk": float(s),
                "is_optimal": False
            })
        
        # Add optimal point
        frontier_data.append({
            "return": float(best_ret),
            "risk": float(best_risk),
            "is_optimal": True
        })

        # 6. Format JSON Output
        composition = []
        for i, ticker in enumerate(TICKERS):
            composition.append({
                "ticker": ticker,
                "weight": float(round(best_weights[i], 4)),
                "percentage": f"{round(best_weights[i]*100, 2)}%"
            })
        
        # Sort by weight descending
        composition.sort(key=lambda x: x['weight'], reverse=True)

        result = {
            "status": "success",
            "metrics": {
                "expected_return": float(best_ret),
                "risk": float(best_risk),
                "fitness": float(fits[best_idx]),
                "concentration": float(np.sum(best_weights**2))  # Added for monitoring
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
        print(f"ERROR: {str(e)}", file=sys.stderr)

if __name__ == "__main__":
    run_optimization()