$jsonContent = Get-Content D:\MdEditor\test-batch.json -Raw
$process = Start-Process -FilePath "agent-browser" -ArgumentList "batch --json" -RedirectStandardInput ([System.IO.Pipe]::OpenStandardInput()) -PassThru -NoNewWindow
$process.StandardInput.Write($jsonContent)
$process.StandardInput.Close()
$process.WaitForExit()
