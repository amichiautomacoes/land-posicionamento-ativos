param(
    [string]$Url,
    [string]$OutputDirectory = 'reports/qa/browser-suite',
    [string[]]$Suite,
    [switch]$NoStart
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '../dev/server-support.ps1')
if (-not $NoStart -and -not $Url -and -not $env:LANDING_BASE_URL) {
    & (Join-Path $script:LandingProjectDirectory 'scripts/dev/start.ps1') -NoBrowser
}
$landingArguments = @((Join-Path $PSScriptRoot 'run-browser-tests.mjs'), '--out', $OutputDirectory)
if ($Url) { $landingArguments += @('--url', $Url) }
if ($Suite) { $landingArguments += @('--suite', ($Suite -join ',')) }
& node @landingArguments
exit $LASTEXITCODE
