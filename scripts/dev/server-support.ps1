$script:LandingProjectDirectory = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))

function Get-LandingContext {
    $landingPythonPath = Join-Path $script:LandingProjectDirectory '.venv\Scripts\python.exe'
    if (-not (Test-Path -LiteralPath $landingPythonPath)) {
        throw 'Crie o ambiente .venv e instale requirements/development.txt antes de iniciar.'
    }
    Push-Location -LiteralPath $script:LandingProjectDirectory
    try {
        $landingPortText = & $landingPythonPath -c "from app.config import load_config; print(load_config()['PORT'])"
        if ($LASTEXITCODE -ne 0) { throw 'Nao foi possivel ler a configuracao da aplicacao.' }
        $landingPortNumber = [int]($landingPortText | Select-Object -Last 1)
    } finally {
        Pop-Location
    }
    $landingRuntimeDirectory = Join-Path $script:LandingProjectDirectory 'runtime'
    [pscustomobject]@{
        Root = $script:LandingProjectDirectory
        Python = $landingPythonPath
        Port = $landingPortNumber
        Url = "http://127.0.0.1:$landingPortNumber/"
        Runtime = $landingRuntimeDirectory
        PidFile = Join-Path $landingRuntimeDirectory 'server.pid'
    }
}

function Test-LandingPage {
    param($Context)
    try {
        $landingHttpResponse = Invoke-WebRequest -Uri $Context.Url -UseBasicParsing -TimeoutSec 2
        return $landingHttpResponse.StatusCode -eq 200 -and
            $landingHttpResponse.Content -match 'data-design-system="ativos"' -and
            $landingHttpResponse.Content -match '<title>Ativos Tecnologia'
    } catch {
        return $false
    }
}

function Stop-LandingOwnedProcess {
    param($Context)
    if (-not (Test-Path -LiteralPath $Context.PidFile)) { return }
    $landingServerProcessId = [int](Get-Content -LiteralPath $Context.PidFile -Raw).Trim()
    $landingServerProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $landingServerProcessId"
    if ($landingServerProcess) {
        if ($landingServerProcess.ExecutablePath -ine $Context.Python -or
            $landingServerProcess.CommandLine -notmatch '\brun\.py(?:[\s"]|$)') {
            throw 'O PID registrado nao corresponde ao servidor deste projeto. Nenhum processo foi encerrado.'
        }
        $landingChildProcesses = @(Get-CimInstance Win32_Process -Filter "ParentProcessId = $landingServerProcessId")
        foreach ($landingChildProcess in $landingChildProcesses) {
            $landingTermination = Invoke-CimMethod -InputObject $landingChildProcess -MethodName Terminate
            if ($landingTermination.ReturnValue -ne 0) {
                throw "Nao foi possivel encerrar o processo filho $($landingChildProcess.ProcessId)."
            }
        }
        $landingServerProcess = Get-CimInstance Win32_Process -Filter "ProcessId = $landingServerProcessId"
        if ($landingServerProcess) {
            $landingTermination = Invoke-CimMethod -InputObject $landingServerProcess -MethodName Terminate
            if ($landingTermination.ReturnValue -ne 0) { throw 'Nao foi possivel encerrar o servidor.' }
        }
    }
    Remove-Item -LiteralPath $Context.PidFile -ErrorAction SilentlyContinue
}
