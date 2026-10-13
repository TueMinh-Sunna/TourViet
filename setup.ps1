$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
function Run-Checked {
    param([string]$Exe, [string[]]$Arguments)
    & $Exe @Arguments
    if ($LASTEXITCODE -ne 0) { throw "$Exe failed. See the error above." }
}
$temp = Join-Path ([System.IO.Path]::GetTempPath()) ('TourViet-' + [guid]::NewGuid())
New-Item -ItemType Directory -Path $temp | Out-Null
try {
    Set-Location $temp
    Run-Checked -Exe 'npx.cmd' -Arguments @('create-expo-app@latest', 'TourViet', '--template', 'blank-typescript', '--yes')
    $template = Join-Path $temp 'TourViet'
    foreach ($file in @('package.json', 'package-lock.json', 'tsconfig.json')) {
        Copy-Item (Join-Path $template $file) $PSScriptRoot -Force
    }
    Set-Location $PSScriptRoot
    Run-Checked -Exe 'npm.cmd' -Arguments @('install')
    Run-Checked -Exe 'npx.cmd' -Arguments @('expo', 'install', 'react-native-safe-area-context', 'react-dom', 'react-native-web', '@expo/metro-runtime')
    Run-Checked -Exe 'npx.cmd' -Arguments @('expo', 'install', 'jest-expo', 'jest', '@types/jest', '--', '--dev')
    Run-Checked -Exe 'npx.cmd' -Arguments @('expo', 'install', '@testing-library/react-native', '--', '--dev')
    Run-Checked -Exe 'npm.cmd' -Arguments @('pkg', 'set', 'scripts.test=jest --runInBand', 'scripts.typecheck=tsc --noEmit')
    Write-Host 'Done. Edit api.ts and screens/HomeScreen.tsx, then run npx expo start.'
} finally {
    Set-Location $PSScriptRoot
}
