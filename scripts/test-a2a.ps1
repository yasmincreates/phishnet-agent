<#
Simple PowerShell helper to post the included `test-a2a-request.json` to the local A2A endpoint.
Usage: From repo root: .\scripts\test-a2a.ps1
#>

param(
  [string]$Url = 'http://localhost:4111/a2a/agent/phishnet'
)

$jsonPath = Join-Path -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition) -ChildPath '..\test-a2a-request.json'
$jsonPath = Resolve-Path $jsonPath

Write-Host "Posting $jsonPath to $Url`n"

$body = Get-Content -Raw -Path $jsonPath

try {
    $response = Invoke-RestMethod -Uri $Url -Method Post -ContentType 'application/json' -Body $body
    Write-Host "Response:`n"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Request failed:`n" $_.Exception.Message
}
