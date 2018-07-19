Param([string]$version = "1.0.0.4")

#####################################
$moduleName = "weather"
$apiDir = "..\..\api\"
$uiDir = "..\..\ui\"
$buildDir = ".\$($moduleName)-build\"

#clean existing $buildDir
If((test-path $buildDir))
{
  Remove-Item $buildDir -Force -Recurse
}

$currDir = (Get-Item -Path ".\" -Verbose).FullName

#copy api files
$exclude = @('*node_modules*','*jspm_packages*','*tests*','*-lock.json','.gitignore')
$apiDirFullName = (Get-Item -Path $apiDir -Verbose).FullName
$targetApiDir = (Join-Path $buildDir "api")
Get-ChildItem -Path $apiDirFullName -Exclude $exclude | Copy-Item -Force -Recurse -Destination {Join-Path $targetApiDir $_.FullName.Substring($apiDirFullName.length)} -Verbose

#copy ui files
$uiDirFullName = (Get-Item -Path $uiDir -Verbose).FullName
$targetUiDir = (Join-Path $buildDir "ui")
Get-ChildItem -Path $uiDirFullName -Exclude $exclude | Copy-Item -Force -Recurse -Destination {Join-Path $targetUiDir $_.FullName.Substring($uiDirFullName.length)} -Verbose

#copy run files
cd $currDir
$targetRunDir = (Join-Path $buildDir "run")
Copy-Item -Path "..\run" -Recurse -Destination $targetRunDir -Force -Verbose

#generate docker file
cd $currDir
$dockerFiles=(Get-ChildItem -Path "..\docker\")
Copy-Item -Path $dockerFiles.fullname -Destination $buildDir -Force -Verbose

#docker build
cd $currDir
cd $buildDir
docker images "$($moduleName)-build" -q | % { docker rmi $_ -f }
docker container prune -f
docker build -f Dockerfile-run -t "$($moduleName)-build:$($version)" .

Write-Host "DONE Build - $($moduleName) - $($version) | $($compressAppFile)"
$endKey = $host.ui.RawUI.ReadKey("NoEcho,IncludeKeyDown")