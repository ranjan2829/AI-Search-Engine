from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import requests
from bs4 import BeautifulSoup
from typing import List, Dict
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler
import torch
import torch.nn as nn
import re
from urllib.parse import urlparse
import asyncio
import aiohttp
from pytrends.request import TrendReq
from concurrent.futures import ThreadPoolExecutor

class SearchRequest(BaseModel):
    query: str

class RankingModel(nn.Module):
    def __init__(self, input_size):
        super(RankingModel, self).__init__()
        self.layers = nn.Sequential(
            nn.Linear(input_size, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )
    
    def forward(self, x):
        return self.layers(x)

class SearchEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.scaler = StandardScaler()
        self.model = RankingModel(input_size=6)  # 6 features
        self.executor = ThreadPoolExecutor(max_workers=5)
    
    async def fetch_page_content(self, session, url):
        try:
            async with session.get(url, timeout=5) as response:
                return await response.text()
        except:
            return ""

    def extract_features(self, query: str, result: Dict[str, str], content: str) -> np.ndarray:
        features = []
        
        # Feature 1: TF-IDF similarity
        try:
            tfidf_matrix = self.vectorizer.fit_transform([query, content])
            similarity = (tfidf_matrix * tfidf_matrix.T).toarray()[0][1]
        except:
            similarity = 0
        features.append(similarity)
        
        # Feature 2: Title relevance
        title = result.get('title', '')
        title_words = set(re.findall(r'\w+', title.lower()))
        query_words = set(re.findall(r'\w+', query.lower()))
        title_relevance = len(title_words & query_words) / len(query_words) if query_words else 0
        features.append(title_relevance)
        
        # Feature 3: URL quality score
        url = result.get('link', '')
        domain = urlparse(url).netloc
        tld = domain.split('.')[-1]
        url_score = 1 if tld in ['com', 'org', 'edu', 'gov'] else 0.5
        features.append(url_score)
        
        # Feature 4: Content length
        content_length = len(content)
        features.append(min(content_length / 10000, 1.0))  # Normalize
        
        # Feature 5: Keyword density
        if content:
            keyword_count = sum(1 for word in query_words if word.lower() in content.lower())
            keyword_density = keyword_count / (len(content.split()) + 1)
        else:
            keyword_density = 0
        features.append(keyword_density)
        
        # Feature 6: Page structure score
        soup = BeautifulSoup(content, 'html.parser')
        headers = len(soup.find_all(['h1', 'h2', 'h3']))
        paragraphs = len(soup.find_all('p'))
        structure_score = min((headers + paragraphs) / 50, 1.0)  # Normalize
        features.append(structure_score)
        
        return np.array(features)

    async def rank_results(self, query: str, results: List[Dict[str, str]]) -> List[Dict[str, str]]:
        if not results:
            return []
        
        async with aiohttp.ClientSession() as session:
            # Fetch content for all URLs concurrently
            contents = await asyncio.gather(
                *[self.fetch_page_content(session, result['link']) for result in results]
            )
            
            # Extract features for each result
            features_list = []
            for result, content in zip(results, contents):
                features = self.extract_features(query, result, content)
                features_list.append(features)
            
            # Convert features to tensor and get predictions
            features_tensor = torch.FloatTensor(features_list)
            with torch.no_grad():
                scores = self.model(features_tensor).numpy().flatten()
            
            # Add scores to results
            for result, score in zip(results, scores):
                result['relevance_score'] = float(score)
            
            # Sort results by score
            ranked_results = sorted(results, key=lambda x: x['relevance_score'], reverse=True)
            
            return ranked_results

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize search engine
search_engine = SearchEngine()

def get_search_results(query: str) -> List[Dict[str, str]]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    url = f"https://www.google.com/search?q={requests.utils.quote(query)}"
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        results = []
        
        for g in soup.find_all('div', class_='tF2Cxc'):
            try:
                title_elem = g.find('h3')
                link_elem = g.find('a')
                
                if title_elem and link_elem:
                    results.append({
                        'title': title_elem.text,
                        'link': link_elem['href']
                    })
            except Exception as e:
                print(f"Error parsing result: {e}")
                continue
                
        return results[:10]
        
    except requests.RequestException as e:
        print(f"Request error: {e}")
        return []
    except Exception as e:
        print(f"General error: {e}")
        return []

@app.post("/search")
async def search(request: SearchRequest):
    query = request.query
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    try:
        # Get initial search results
        results = get_search_results(query)
        
        # Apply ML ranking
        ranked_results = await search_engine.rank_results(query, results)
        
        print(f"Ranked results for '{query}': {ranked_results}")
        return {"results": ranked_results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# Backend: Add this helper function
def get_pytrends_client(max_retries=3):
    for attempt in range(max_retries):
        try:
            client = TrendReq(hl='en-US', tz=330)  # tz=330 for India timezone
            # Test the connection
            client.trending_searches()
            return client
        except Exception as e:
            if attempt == max_retries - 1:
                raise e
            time.sleep(1)


@app.get("/trending")
@app.get("/trending")
async def get_trending_searches():
    try:
        # Create pytrends without custom timeout/retries
        pytrends = TrendReq(hl='en-US', tz=360)
        
        # Add a small delay to prevent rate limiting
        await asyncio.sleep(1)
        
        # Get trending searches for India
        trending_searches_df = pytrends.trending_searches(pn='india')
        
        # Convert to list and get top 10
        if not trending_searches_df.empty:
            trending_list = trending_searches_df.head(15).values.tolist()
            # Flatten the list since values.tolist() might give nested lists
            trending_list = [item[0] if isinstance(item, list) else item for item in trending_list]
            return {"trending": trending_list}
        else:
            return {"trending": []}
            
    except Exception as e:
        print(f"Error fetching trending data: {e}")
        # Return empty list instead of throwing 500
        return {"trending": []}
if __name__ == "__main__":
    print("\nStarting FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
