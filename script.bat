@echo off
setlocal enabledelayedexpansion

:: Harbor Point Golf Club Monolithic Markdown Generator
:: Uses ma::ialize output file with metadata and home page
echo # Harbor Point Golf Club Website Archive > "%OutputPath%"
echo Generated: %date% %time% >> "%OutputPath%"
echo Total Pages: %totalUrls% >> "%OutputPath%"
echo API: https://md.dhr.wtf/ >> "%OutputPath%"
echo. >> "%OutputPath%"
echo --- >> "%OutputPath%"
echo. >> "%OutputPath%"
echo ## Page 1 of %totalUrls% : https://www.harborpointgolfclub.com/ ^(Home^) >> "%OutputPath%"
echo. >> "%OutputPath%"
type "%homeFile%" >> "%OutputPath%" https://md.dhr.wtf/
:: Rate limit: 5 req/min -> Sleep 15 seconds between requests

:: Set default parameters
set "OutputPath=harbor-point-golf-club-monolithic.md"
set "TimeoutSeconds=30"
set "DelaySeconds=15"
set "Verbose=false"

:: Parse command line arguments
:parse_args
if "%~1"=="" goto :start_processing
if /i "%~1"=="-o" (
    set "OutputPath=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="-t" (
    set "TimeoutSeconds=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="-d" (
    set "DelaySeconds=%~2"
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="-v" (
    set "Verbose=true"
    shift
    goto :parse_args
)
shift
goto :parse_args

:start_processing
:: Create URLs file
set "urlsFile=%temp%\harbor_point_urls.txt"
(
echo https://www.harborpointgolfclub.com/
echo https://www.harborpointgolfclub.com/membership/
echo https://www.harborpointgolfclub.com/membership-types/
echo https://www.harborpointgolfclub.com/social-members/
echo https://www.harborpointgolfclub.com/about-the-course/
echo https://www.harborpointgolfclub.com/clubhouse-dining/
echo https://www.harborpointgolfclub.com/menu-2/
echo https://www.harborpointgolfclub.com/summer-suppers/
echo https://www.harborpointgolfclub.com/private-events/
echo https://www.harborpointgolfclub.com/bridge-club/
echo https://www.harborpointgolfclub.com/about-the-course/string-tournament/
echo https://www.harborpointgolfclub.com/about-us/
echo https://www.harborpointgolfclub.com/about-us/pro-shop/
echo https://www.harborpointgolfclub.com/about-us/staff/
echo https://www.harborpointgolfclub.com/employment-opportunities/
echo https://www.harborpointgolfclub.com/about-us/location/
echo https://www.harborpointgolfclub.com/about-us/contact/
echo https://www.harborpointgolfclub.com/rates/
echo http://harborpointgc.vanguardproshop.com/harborpointgc_01/
) > "%urlsFile%"

:: Count total URLs
set /a totalUrls=0
for /f %%i in ('type "%urlsFile%" ^| find /c /v ""') do set totalUrls=%%i

:: Initialize counters
set /a successCount=0
set /a errorCount=0
set /a currentPage=0

echo Harbor Point Golf Club Markdown Generator
echo =========================================
echo Processing %totalUrls% URLs...
echo Output file: %OutputPath%
echo Delay between requests: %DelaySeconds% seconds
echo.

:: Check if output directory exists, create if not
for %%F in ("%OutputPath%") do set "outputDir=%%~dpF"
if not exist "%outputDir%" (
    mkdir "%outputDir%" 2>nul
    if exist "%outputDir%" echo Created output directory: %outputDir%
)

:: Create home page markdown content in temp file
set "homeFile=%temp%\home_content.txt"
echo Harbor Point Golf Club ^| Harbor Springs Michigan > "%homeFile%"
echo. >> "%homeFile%"
echo \=============== >> "%homeFile%"
echo. >> "%homeFile%"
echo [![Image 1: Harbor Point Golf Club]^(https://www.harborpointgolfclub.com/wp-content/themes/harborpointassociation/assets/harbor-point-golf-club-logo.png^)]^(https://www.harborpointgolfclub.com/^) >> "%homeFile%"
echo. >> "%homeFile%"
echo *   [Home]^(https://www.harborpointgolfclub.com/^) >> "%homeFile%"
echo *   [Contact]^(https://www.harborpointgolfclub.com/about-us/contact/^) >> "%homeFile%"
echo *   [![Image 2: Facebook]^(https://www.harborpointgolfclub.com/wp-content/themes/harborpointassociation/assets/facebook-icon-header.png^)]^(https://www.facebook.com/harborpointgolfclub/^) >> "%homeFile%"
echo *   [Membership]^(https://www.harborpointgolfclub.com/membership/^) >> "%homeFile%"
echo. >> "%homeFile%"
echo # Classic Resort Course >> "%homeFile%"
echo. >> "%homeFile%"
echo Enjoy Northern Michigan golf at it's classical best. In the finest traditions of resort courses, Harbor Point Golf Club offers a lasting and refined golf experience. >> "%homeFile%"
echo. >> "%homeFile%"
echo Harbor Point Golf Club is a semi-private facility, with tee-times for public play available in 2025 from opening day on May 8th, 2025 through June 8th and from September 2nd to closing October 12th. >> "%homeFile%"
echo. >> "%homeFile%"
echo Most well known for having superb greens, enjoyable routing and spectacular views of Lake Michigan, Harbor Point Golf Club has in the past played host of Michigan Amateur Qualifying, GAM Women's Atlas Cup Matches ^& 2019 GAM Women's Senior Championships. The club was also recognized as a great walker's course by Golf Digest Places to Play. Members and guests alike will enjoy a brisk three to three and a half hour round whether walking or riding, further ensuring a memorable experience. >> "%homeFile%"

:: Initialize output file with metadata and home page
(
echo # Harbor Point Golf Club Website Archive
echo Generated: %date% %time%
echo Total Pages: %totalUrls%
echo API: https://md.dhr.wtf/
echo.
echo ---
echo.
echo ## Page 1 of %totalUrls% : https://www.harborpointgolfclub.com/ ^(Home^)
echo.
type "%homeFile%"
) > "%OutputPath%"

set /a successCount=1
if /i "%Verbose%"=="true" echo [+] Added home page content

:: Process remaining URLs
set /a currentPage=1
for /f "tokens=*" %%U in ('type "%urlsFile%"') do (
    set /a currentPage+=1
    set "url=%%U"
    
    if !currentPage! gtr 1 (
        if /i "%Verbose%"=="true" echo [!currentPage!/%totalUrls%] Fetching: !url!
        
        :: Create temp file for curl output
        set "tempOutput=%temp%\curl_output_!currentPage!.txt"
        set "tempError=%temp%\curl_error_!currentPage!.txt"
        
        :: URL encode the URL parameter (basic encoding for common characters)
        set "encodedUrl=!url!"
        set "encodedUrl=!encodedUrl: =%%20!"
        set "encodedUrl=!encodedUrl:&=%%26!"
        
        :: Make API request using curl
        curl -s -m %TimeoutSeconds% -H "Accept: text/plain" -H "User-Agent: Batch/Harbor-Point-Generator" "https://md.dhr.wtf/?url=!encodedUrl!" > "!tempOutput!" 2>"!tempError!"
        
        :: Check if request was successful
        if !errorlevel! equ 0 (
            :: Check if output file has content
            for %%F in ("!tempOutput!") do set fileSize=%%~zF
            if !fileSize! gtr 0 (
                :: Append to output file
                echo. >> "%OutputPath%"
                echo. >> "%OutputPath%"
                echo ## Page !currentPage! of %totalUrls% : !url! >> "%OutputPath%"
                echo. >> "%OutputPath%"
                type "!tempOutput!" >> "%OutputPath%"
                
                set /a successCount+=1
                if /i "%Verbose%"=="true" echo     [+] Success ^(!fileSize! bytes^)
            ) else (
                set /a errorCount+=1
                echo     [-] Error: Empty response
                echo. >> "%OutputPath%"
                echo. >> "%OutputPath%"
                echo ## Page !currentPage! of %totalUrls% : !url! >> "%OutputPath%"
                echo **Error:** Empty response from API >> "%OutputPath%"
                echo *Timestamp: %date% %time%* >> "%OutputPath%"
            )
        ) else (
            set /a errorCount+=1
            echo     [-] Error: Request failed
            echo. >> "%OutputPath%"
            echo. >> "%OutputPath%"
            echo ## Page !currentPage! of %totalUrls% : !url! >> "%OutputPath%"
            echo **Error:** Could not fetch content - Request failed >> "%OutputPath%"
            echo *Timestamp: %date% %time%* >> "%OutputPath%"
        )
        
        :: Clean up temp files
        if exist "!tempOutput!" del "!tempOutput!" 2>nul
        if exist "!tempError!" del "!tempError!" 2>nul
        
        :: Rate limit delay (skip for last URL)
        if !currentPage! lss %totalUrls% (
            if /i "%Verbose%"=="true" echo     Waiting %DelaySeconds% seconds...
            timeout /t %DelaySeconds% /nobreak >nul
        )
    )
)

:: Calculate completion rate
set /a completionRate=successCount*100/totalUrls

:: Add summary to file
echo. >> "%OutputPath%"
echo --- >> "%OutputPath%"
echo. >> "%OutputPath%"
echo # Generation Summary >> "%OutputPath%"
echo - **Total URLs Processed:** %totalUrls% >> "%OutputPath%"
echo - **Successful:** %successCount% >> "%OutputPath%"
echo - **Errors:** %errorCount% >> "%OutputPath%"
echo - **Completion Rate:** %completionRate%%% >> "%OutputPath%"

:: Final status
echo.
echo ==================================================
echo GENERATION COMPLETE
echo ==================================================
echo Output file: %OutputPath%

:: Get file size
for %%F in ("%OutputPath%") do set fileSize=%%~zF
set /a fileSizeMB=fileSize/1048576
echo File size: %fileSizeMB% MB
echo URLs processed: %successCount%/%totalUrls% ^(%completionRate%%%^)

if %errorCount% gtr 0 (
    echo Errors encountered: %errorCount%
)

:: Clean up temp files
if exist "%urlsFile%" del "%urlsFile%" 2>nul
if exist "%homeFile%" del "%homeFile%" 2>nul

echo Script completed successfully.
pause
