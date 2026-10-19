param([string]$Destination)
$ErrorActionPreference='Stop'
$projectRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if(-not $Destination){$Destination=Join-Path $projectRoot 'explore-joyno-vercel-ready.zip'}
$Destination=[IO.Path]::GetFullPath($Destination)
if(Test-Path -LiteralPath $Destination){throw 'Choose a new ZIP name or remove the previous export explicitly.'}
$files=@()
foreach($folder in @('src','public','scripts','tests')){
 $files+=Get-ChildItem -LiteralPath (Join-Path $projectRoot $folder) -File -Recurse
}
foreach($name in @('index.html','package.json','package-lock.json','tsconfig.json','vite.config.ts','vercel.json','vercel-npm.mjs','.vercelignore','.gitignore','.env.example')){
 $files+=Get-Item -LiteralPath (Join-Path $projectRoot $name)
}
$files+=Get-ChildItem -LiteralPath $projectRoot -Filter '*.md' -File
$archive=[IO.Compression.ZipFile]::Open($Destination,[IO.Compression.ZipArchiveMode]::Create)
try{
 $manifest=@()
 foreach($file in ($files | Sort-Object FullName -Unique)){
  $relative=[IO.Path]::GetRelativePath($projectRoot,$file.FullName).Replace('\','/')
  [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive,$file.FullName,$relative,[IO.Compression.CompressionLevel]::Optimal) | Out-Null
  $manifest+=@{path=$relative;sha256=(Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()}
 }
 $entry=$archive.CreateEntry('SOURCE-MANIFEST.json')
 $writer=[IO.StreamWriter]::new($entry.Open())
 try{$writer.Write(($manifest | ConvertTo-Json -Depth 3))}finally{$writer.Dispose()}
}finally{$archive.Dispose()}
Get-Item -LiteralPath $Destination | Select-Object FullName,Length
Get-FileHash -LiteralPath $Destination -Algorithm SHA256
