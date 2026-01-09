# Test Authentication API
# PowerShell script untuk testing Register dan Login API

$baseUrl = "http://localhost:3001/api/auth"

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Testing Authentication API" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Register
Write-Host "Test 1: Register New User" -ForegroundColor Yellow
$registerBody = @{
    email = "testuser@example.com"
    password = "password123"
    fullName = "Test User"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✓ Register Success!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    $registerResponse | ConvertTo-Json -Depth 5
    Write-Host ""
    $token = $registerResponse.data.token
} catch {
    Write-Host "✗ Register Failed" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
}

# Test 2: Register with same email (should fail)
Write-Host "Test 2: Register Duplicate Email (should fail)" -ForegroundColor Yellow
try {
    $duplicateResponse = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✗ Should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected duplicate email" -ForegroundColor Green
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Gray
    Write-Host ""
}

# Test 3: Register with short password (should fail)
Write-Host "Test 3: Register with Short Password (should fail)" -ForegroundColor Yellow
$shortPasswordBody = @{
    email = "short@example.com"
    password = "short"
    fullName = "Short Password User"
} | ConvertTo-Json

try {
    $shortResponse = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $shortPasswordBody -ContentType "application/json"
    Write-Host "✗ Should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected short password" -ForegroundColor Green
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Gray
    Write-Host ""
}

# Test 4: Login
Write-Host "Test 4: Login with Correct Credentials" -ForegroundColor Yellow
$loginBody = @{
    email = "testuser@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✓ Login Success!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    $loginResponse | ConvertTo-Json -Depth 5
    Write-Host ""
    $token = $loginResponse.data.token
    Write-Host "JWT Token saved for future requests" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Login Failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
}

# Test 5: Login with wrong password (should fail)
Write-Host "Test 5: Login with Wrong Password (should fail)" -ForegroundColor Yellow
$wrongPasswordBody = @{
    email = "testuser@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $wrongResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $wrongPasswordBody -ContentType "application/json"
    Write-Host "✗ Should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected wrong password" -ForegroundColor Green
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Gray
    Write-Host ""
}

# Test 6: Login with non-existent email (should fail)
Write-Host "Test 6: Login with Non-existent Email (should fail)" -ForegroundColor Yellow
$nonExistentBody = @{
    email = "nonexistent@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $nonExistentResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $nonExistentBody -ContentType "application/json"
    Write-Host "✗ Should have failed!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected non-existent user" -ForegroundColor Green
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "All Tests Completed!" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
