from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import requests
import json
from supabase import create_client, Client
# Load our secret keys from .env file
load_dotenv()
# Connect to Supabase database
SUPABASE_URL = "https://uzgzetsuxbwwibcklpea.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Z3pldHN1eGJ3d2liY2tscGVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDAyMzU4OSwiZXhwIjoyMDk1NTk5NTg5fQ.XOqVUGBV1T9Mp6MsUsVqy8PpoMqldv3XQsFoES5aFEI"

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase connected!")
except Exception as e:
    supabase = None
    print(f"⚠️ Supabase error: {e}")
# Create our FastAPI app
app = FastAPI(
    title="Alumni Deep Search",
    description="Search alumni and find their profiles on LinkedIn, GitHub and Twitter",
    version="1.0.0"
)

# This allows Laxmi's frontend to talk to your Python server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── ROUTE 1 — Home ────────────────────────────
# This is just to test if your server is running
@app.get("/")
def home():
    return {
        "message": "Alumni Deep Search Service is running!",
        "status": "active",
        "version": "1.0.0"
    }

# ── ROUTE 2 — Health Check ────────────────────
# Laxmi's frontend uses this to check if your server is alive
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "deep-search"
    }
# ── ROUTE 3 — Deep Search ─────────────────────
# This is your MAIN feature
# When Laxmi's frontend sends alumni details,
# this function searches for their profiles
@app.get("/search")
def search_alumni(
    name: str,
    batch: str = "",
    college: str = "",
    branch: str = ""
):
    # Build smart search queries
    linkedin_query = f"{name} {college} {batch} LinkedIn"
    github_query   = f"{name} {college} GitHub"
    twitter_query  = f"{name} {college} Twitter"

    # For now we return the queries we built
    # Later we replace this with real SerpAPI calls
    return {
        "alumni_name": name,
        "batch": batch,
        "college": college,
        "branch": branch,
        "search_queries": {
            "linkedin": linkedin_query,
            "github":   github_query,
            "twitter":  twitter_query
        },
        "status": "queries_ready"
    }
# ── ROUTE 4 — Discover Alumni Profiles ───────
# This is the REAL deep search
# It takes alumni details and finds their
# actual LinkedIn, GitHub, Twitter profiles
@app.get("/discover")
def discover_alumni(
    name: str,
    batch: str = "",
    college: str = "",
    branch: str = ""
):
    # Get SerpAPI key from .env file
    api_key = os.getenv("SERP_API_KEY")

    # If no API key yet — tell the user clearly
    if not api_key or api_key == "your_key_will_go_here":
        return {
            "status": "api_key_missing",
            "message": "SerpAPI key not added yet. Add it to .env file.",
            "alumni_name": name
        }

    # ── Search LinkedIn ───────────────────────
    linkedin_result = search_google(
        query=f"{name} {college} {batch} site:linkedin.com/in",
        api_key=api_key
    )

    # ── Search GitHub ─────────────────────────
    github_result = search_google(
        query=f"{name} {college} site:github.com",
        api_key=api_key
    )

    # ── Search Twitter ────────────────────────
    twitter_result = search_google(
        query=f"{name} {college} site:twitter.com",
        api_key=api_key
    )

    # Return all found profiles
    return {
        "status": "success",
        "alumni_name": name,
        "batch": batch,
        "college": college,
        "profiles": {
            "linkedin": linkedin_result,
            "github":   github_result,
            "twitter":  twitter_result
        }
    }


# ── HELPER FUNCTION — Calls SerpAPI ──────────
# This function does the actual Google search
# It is used by discover_alumni above
def search_google(query: str, api_key: str):
    try:
        # Call SerpAPI with our query
        response = requests.get(
            "https://serpapi.com/search",
            params={
                "q":       query,
                "api_key": api_key,
                "num":     3
            }
        )

        data = response.json()

        # Extract the first result link
        results = data.get("organic_results", [])

        if results:
            first = results[0]
            return {
                "found": True,
                "title": first.get("title", ""),
                "link":  first.get("link",  ""),
                "snippet": first.get("snippet", "")
            }
        else:
            return {
                "found": False,
                "message": "No results found"
            }

    except Exception as e:
        return {
            "found": False,
            "message": f"Search error: {str(e)}"
        }
    # ── ROUTE 5 — Get All Alumni From Database ───
# This reads REAL alumni data from Laxmi's database
@app.get("/alumni")
def get_all_alumni():
    # Check if Supabase is connected
    if not supabase:
        return {
            "status": "error",
            "message": "Database not connected yet"
        }

    try:
        # Fetch all alumni from Supabase
        response = supabase.table("alumni").select("*").execute()

        return {
            "status": "success",
            "count": len(response.data),
            "alumni": response.data
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


# ── ROUTE 6 — Filter Alumni ──────────────────
# Deep search with filters
@app.get("/alumni/filter")
def filter_alumni(
    name: str = "",
    batch: str = "",
    branch: str = "",
    city: str = "",
    company: str = ""
):
    if not supabase:
        return {
            "status": "error",
            "message": "Database not connected yet"
        }

    try:
        # Start with all alumni
        query = supabase.table("alumni").select("*")

        # Apply filters one by one
        if batch:
            query = query.eq("batch", batch)
        if branch:
            query = query.ilike("branch", f"%{branch}%")
        if city:
            query = query.ilike("city", f"%{city}%")
        if company:
            query = query.ilike("company", f"%{company}%")
        if name:
            query = query.ilike("name", f"%{name}%")

        response = query.execute()

        return {
            "status": "success",
            "count": len(response.data),
            "alumni": response.data
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
    # ── ROUTE 7 — Get Single Alumni by ID ────────
@app.get("/alumni/{alumni_id}")
def get_alumni_by_id(alumni_id: int):
    if not supabase:
        return {"status": "error", "message": "Database not connected"}
    try:
        response = supabase.table("alumni")\
            .select("*")\
            .eq("id", alumni_id)\
            .execute()

        if response.data:
            return {
                "status": "success",
                "alumni": response.data[0]
            }
        else:
            return {
                "status": "not_found",
                "message": f"No alumni found with id {alumni_id}"
            }
    except Exception as e:
        return {"status": "error", "message": str(e)}