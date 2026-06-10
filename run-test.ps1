$commands = @(
    "open http://localhost:5174",
    "wait --load networkidle",
    "snapshot -i",
    "click e27",
    "type e27 'Test heading'",
    "snapshot -i",
    "click e6",
    "snapshot -i",
    "click e19",
    "snapshot -i",
    "click e2",
    "snapshot -i",
    "screenshot test-result.png"
)

$cmd = $commands -join " && "
Write-Host "Running: $cmd"
Invoke-Expression "agent-browser $cmd"
