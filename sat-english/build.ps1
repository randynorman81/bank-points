# Rebuilds the single-file index.html from _template.html + questions.js
# Run:  powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = "Stop"
$dir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$utf8 = [System.Text.Encoding]::UTF8

$tmpl = [System.IO.File]::ReadAllText((Join-Path $dir "_template.html"), $utf8)
$q    = [System.IO.File]::ReadAllText((Join-Path $dir "questions.js"),  $utf8)

$needle = '<script src="questions.js"></script>'
if (-not $tmpl.Contains($needle)) { throw "Placeholder '$needle' not found in _template.html" }

$repl = "<script>`n/* ==== questions.js inlined by build.ps1 - edit questions.js, not this ==== */`n" + $q + "`n</script>"
$out  = $tmpl.Replace($needle, $repl)

$enc = New-Object System.Text.UTF8Encoding($true)   # BOM => reliable charset detection on file://
[System.IO.File]::WriteAllText((Join-Path $dir "index.html"), $out, $enc)

$n = ([regex]::Matches($q, 'id:"')).Count
Write-Output ("Built index.html  (" + [math]::Round(($out.Length/1024)) + " KB, ~" + $n + " questions)")
