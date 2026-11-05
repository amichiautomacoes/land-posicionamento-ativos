$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'server-support.ps1')
$landingContext = Get-LandingContext
Stop-LandingOwnedProcess -Context $landingContext
Write-Output 'O processo registrado da landing foi encerrado.'
