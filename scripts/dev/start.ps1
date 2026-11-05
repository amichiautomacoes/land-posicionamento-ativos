param([switch]$NoBrowser)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'server-support.ps1')
$landingContext = Get-LandingContext

if (-not (Test-LandingPage -Context $landingContext)) {
    Stop-LandingOwnedProcess -Context $landingContext
    New-Item -ItemType Directory -Path $landingContext.Runtime -Force | Out-Null
    $landingLaunchOptions = @{
        FilePath = $landingContext.Python
        ArgumentList = 'run.py'
        WorkingDirectory = $landingContext.Root
        WindowStyle = 'Hidden'
        RedirectStandardOutput = Join-Path $landingContext.Runtime 'server.stdout.log'
        RedirectStandardError = Join-Path $landingContext.Runtime 'server.stderr.log'
        PassThru = $true
    }
    $landingServer = Start-Process @landingLaunchOptions
    Set-Content -LiteralPath $landingContext.PidFile -Value $landingServer.Id -Encoding ASCII
    $landingReady = $false
    for ($landingAttempt = 0; $landingAttempt -lt 20; $landingAttempt++) {
        if (Test-LandingPage -Context $landingContext) { $landingReady = $true; break }
        Start-Sleep -Milliseconds 300
    }
    if (-not $landingReady) {
        throw "O servidor nao iniciou. Consulte runtime/server.stderr.log. Endereco: $($landingContext.Url)"
    }
}

Write-Output "Landing disponivel em $($landingContext.Url)"
if (-not $NoBrowser) { Start-Process -FilePath $landingContext.Url }
