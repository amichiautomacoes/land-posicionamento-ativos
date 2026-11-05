param(
    [string]$OutputDirectory = 'reports/qa/inspect',
    [string]$Widths = '1440,768,390',
    [string]$Url,
    [switch]$NoStart
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '../dev/server-support.ps1')
$landingRoot = $script:LandingProjectDirectory
$landingContextArguments = @((Join-Path $landingRoot 'scripts/lib/execution-context.mjs'), '--print-context', '--out', $OutputDirectory)
if ($Url) { $landingContextArguments += @('--url', $Url) }
$landingContextJson = & node @landingContextArguments
if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel resolver a URL e a saida da inspecao.' }
$landingContext = $landingContextJson | ConvertFrom-Json
if (-not $NoStart -and -not $Url -and -not $env:LANDING_BASE_URL) {
    & (Join-Path $landingRoot 'scripts/dev/start.ps1') -NoBrowser
}
Push-Location -LiteralPath $landingRoot
try {
    $landingInspectionArguments = @(
        '--import', './scripts/lib/browser.mjs',
        '.agents/skills/design-taste-frontend/scripts/inspect.mjs',
        $landingContext.url, '--out', $landingContext.output, '--widths', $Widths
    )
    & node @landingInspectionArguments
    $landingInspectionExit = $LASTEXITCODE
} finally {
    Pop-Location
}
exit $landingInspectionExit
