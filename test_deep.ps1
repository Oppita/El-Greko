$key = Get-Content .env | Select-String "VITE_GEMINI_API_KEY" | ForEach-Object { $_.ToString().Split('=')[1].Trim() }
$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$key"

# Mínimo schema para probar si explota
$schema = @{
    type = "object"
    properties = @{
        threatDiagnosis = @{ type = "string" }
        engineeringSolutionAudit = @{ type = "string" }
        technicalRigorScore = @{ type = "number" }
        alternativeSolutions = @{ 
            type = "array"
            items = @{ 
                type = "object"
                properties = @{
                    solutionName = @{ type = "string" }
                    description = @{ type = "string" }
                } 
            }
        }
    }
    required = @("threatDiagnosis", "engineeringSolutionAudit", "technicalRigorScore", "alternativeSolutions")
}

$body = @{
    contents = @(
        @{
            role = "user"
            parts = @(
                @{ text = "Analiza este riesgo: Inundación." }
            )
        }
    )
    generationConfig = @{
        responseMimeType = "application/json"
        responseSchema = $schema
    }
} | ConvertTo-Json -Depth 10

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -ContentType "application/json"
    Write-Host "SUCCESS: Gemini 2.5 Flash accepted the schema."
    Write-Host ($response.candidates[0].content.parts[0].text)
} catch {
    Write-Host "ERROR: Request Failed."
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader $_.Exception.Response.GetResponseStream()
        Write-Host $reader.ReadToEnd()
    }
}
