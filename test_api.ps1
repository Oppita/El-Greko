$key = Get-Content .env | Select-String "VITE_GEMINI_API_KEY" | ForEach-Object { $_.ToString().Split('=')[1].Trim() }
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=$key"

try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    Write-Host "AVAILABLE MODELS:"
    $response.models | ForEach-Object { Write-Host $_.name }
} catch {
    Write-Host "ERROR: Listing Models Failed."
    Write-Host $_.Exception.Message
}
