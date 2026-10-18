param(
  [Parameter(Mandatory = $true)][string]$Since,
  [int]$WaitSeconds = 90,
  [string]$FromLike = "",
  [string]$SubjectLike = ""
)

$ErrorActionPreference = "Stop"
$sinceTime = [DateTimeOffset]::Parse($Since).LocalDateTime.AddSeconds(-15)

function Strip-Html([string]$html) {
  if ([string]::IsNullOrWhiteSpace($html)) { return "" }
  $text = [regex]::Replace($html, '(?is)<script.*?</script>', ' ')
  $text = [regex]::Replace($text, '(?is)<style.*?</style>', ' ')
  $text = [regex]::Replace($text, '(?s)<[^>]+>', ' ')
  return [System.Net.WebUtility]::HtmlDecode($text)
}

function Get-Code([string]$text) {
  if ([string]::IsNullOrWhiteSpace($text)) { return $null }
  $patterns = @(
    '(?i)verification code[^0-9]{0,40}(\d{4,8})',
    '(?i)one[- ]time(?: password| code)?[^0-9]{0,40}(\d{4,8})',
    '(?i)\bOTP[^0-9]{0,20}(\d{4,8})',
    '(?i)security code[^0-9]{0,40}(\d{4,8})',
    '(?i)passcode[^0-9]{0,20}(\d{4,8})',
    '(?i)your code[^0-9]{0,20}(\d{4,8})',
    '(?i)code is[^0-9]{0,20}(\d{4,8})'
  )
  foreach ($pattern in $patterns) {
    $match = [regex]::Match($text, $pattern)
    if ($match.Success) { return $match.Groups[1].Value }
  }
  return $null
}

function Test-Sender($item, [string]$needle) {
  if ([string]::IsNullOrWhiteSpace($needle)) { return $true }
  $smtp = ""
  try {
    $smtp = $item.PropertyAccessor.GetProperty("http://schemas.microsoft.com/mapi/proptag/0x5D01001E")
  } catch {
    $smtp = ""
  }
  $hay = @($item.SenderName, $item.SenderEmailAddress, $smtp) -join " "
  return $hay -like "*$needle*"
}

function Find-InFolder($folder) {
  $items = $folder.Items
  $items.Sort("[ReceivedTime]", $true)
  $limit = [Math]::Min(40, $items.Count)
  for ($index = 1; $index -le $limit; $index++) {
    $item = $items.Item($index)
    if ($item.Class -ne 43) { continue }
    if ($item.ReceivedTime -lt $sinceTime) { break }
    if (-not (Test-Sender $item $FromLike)) { continue }
    if (-not [string]::IsNullOrWhiteSpace($SubjectLike) -and $item.Subject -notlike "*$SubjectLike*") { continue }
    try {
      $text = "$($item.Subject) $(Strip-Html $item.HTMLBody) $($item.Body)"
    } catch {
      continue
    }
    $code = Get-Code $text
    if ($code) { return $code }
  }
  return $null
}

$outlook = New-Object -ComObject Outlook.Application
$namespace = $outlook.GetNamespace("MAPI")
$null = $namespace.Logon($null, $null, $false, $false)
$inbox = $namespace.GetDefaultFolder(6)
$junk = $namespace.GetDefaultFolder(23)
$deadline = (Get-Date).AddSeconds($WaitSeconds)

do {
  foreach ($folder in @($inbox, $junk)) {
    $code = Find-InFolder $folder
    if ($code) {
      Write-Output $code
      exit 0
    }
  }
  if ((Get-Date) -ge $deadline) { break }
  Start-Sleep -Seconds 3
} while ($true)

Write-Error "No verification email arrived in Outlook after the login click."
exit 2
