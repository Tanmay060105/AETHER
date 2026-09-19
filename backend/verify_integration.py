import httpx
import time
import json
import uuid
from datetime import datetime, timezone, timedelta
import os
import subprocess

BASE_URL = "http://localhost:8000/api/v1"
client = httpx.Client(base_url=BASE_URL, timeout=10.0)

def print_section(title):
    print(f"\n{'='*50}\n{title}\n{'='*50}")

def verify_database():
    print_section("1. DATABASE VERIFICATION")
    res = subprocess.run(["uv", "run", "alembic", "current"], capture_output=True, text=True)
    print("Alembic current:", res.stdout.strip())
    res = subprocess.run(["uv", "run", "alembic", "history"], capture_output=True, text=True)
    print("Alembic history:\n" + res.stdout.strip())

def verify_tests():
    print_section("2. BACKEND TEST SUITE")
    env = os.environ.copy()
    env["PYTHONPATH"] = "."
    res = subprocess.run(["uv", "run", "pytest", "tests/"], capture_output=True, text=True, env=env)
    print("Pytest output summary:")
    lines = res.stdout.split('\n')
    for line in lines[-5:]:
        print(line)

def create_user_and_org(email, password, name, org_name, project_name):
    # Register
    res = client.post("/auth/register", json={"email": email, "password": password, "name": name})
    assert res.status_code == 201 or res.status_code == 400, f"Register failed: {res.text}"
    
    # Login
    login_res = client.post("/auth/login", data={"username": email, "password": password})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Check /auth/me
    me_res = client.get("/auth/me", headers=headers)
    assert me_res.status_code == 200
    user_id = me_res.json()["id"]

    # Create Org
    org_res = client.post("/organizations/", json={"name": org_name}, headers=headers)
    assert org_res.status_code == 201, f"Org create failed: {org_res.text}"
    org_id = org_res.json()["id"]

    # Create Project
    proj_res = client.post(f"/organizations/{org_id}/projects/", json={"name": project_name, "environment": "production"}, headers=headers)
    assert proj_res.status_code == 201, f"Project create failed: {proj_res.text}"
    proj_id = proj_res.json()["id"]

    return {"token": token, "headers": headers, "user_id": user_id, "org_id": org_id, "proj_id": proj_id}

def verify_auth_and_isolation():
    print_section("3 & 4. AUTH & TENANT ISOLATION")
    suffix = str(uuid.uuid4())[:8]
    
    print("Creating Tenant A...")
    tenant_a = create_user_and_org(f"usera_{suffix}@test.com", "password", "User A", f"Org A {suffix}", f"Project A {suffix}")
    print("Creating Tenant B...")
    tenant_b = create_user_and_org(f"userb_{suffix}@test.com", "password", "User B", f"Org B {suffix}", f"Project B {suffix}")
    
    print("Testing isolation...")
    # User A accesses Project A
    res_a = client.get(f"/projects/{tenant_a['proj_id']}", headers=tenant_a['headers'])
    assert res_a.status_code == 200, f"User A could not access Project A: {res_a.text}"
    print("User A -> Project A: SUCCESS")

    # User A tries Project B
    res_a_b = client.get(f"/projects/{tenant_b['proj_id']}", headers=tenant_a['headers'])
    assert res_a_b.status_code == 403 or res_a_b.status_code == 404, f"User A accessed Project B: {res_a_b.status_code}"
    print("User A -> Project B: DENIED (Expected)")

    # User B tries Project A
    res_b_a = client.get(f"/projects/{tenant_a['proj_id']}", headers=tenant_b['headers'])
    assert res_b_a.status_code == 403 or res_b_a.status_code == 404, f"User B accessed Project A: {res_b_a.status_code}"
    print("User B -> Project A: DENIED (Expected)")
    
    print("Logout and protected endpoints...")
    # Test protected without auth
    res_no_auth = client.get("/auth/me")
    assert res_no_auth.status_code == 401
    print("Unauthenticated -> /auth/me: DENIED (Expected)")
    
    # Create an API key for Tenant A
    key_res = client.post(f"/projects/{tenant_a['proj_id']}/api-keys/", json={"name": "test-key"}, headers=tenant_a['headers'])
    assert key_res.status_code == 201
    api_key = key_res.json()["key"]
    print("Created API Key for Tenant A.")

    return tenant_a, api_key

def run():
    verify_database()
    verify_tests()
    try:
        tenant_a, api_key = verify_auth_and_isolation()
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    run()
