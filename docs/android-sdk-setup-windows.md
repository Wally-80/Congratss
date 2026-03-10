# Congratss Android SDK Setup on Windows

Last updated: 2026-03-06

## Current state

- Android Studio is installed
- Capacitor Android project exists at `android/`
- Android SDK components are not installed yet

## What you need in Android Studio

Open Android Studio and install:

- Android SDK Platform 35 or the latest stable platform
- Android SDK Build-Tools
- Android SDK Platform-Tools
- Android Emulator
- one Pixel emulator image, or use a real Android phone with USB debugging

## SDK path

Recommended default SDK path on this machine:

`C:\Users\walte\AppData\Local\Android\Sdk`

## After the SDK is installed

Open a new terminal and set:

```powershell
$env:ANDROID_HOME="C:\Users\walte\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT="C:\Users\walte\AppData\Local\Android\Sdk"
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:Path="$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:Path"
```

## Validation commands

Run these after SDK install:

```powershell
& "C:\Program Files\Android\Android Studio\jbr\bin\java.exe" -version
adb version
cd C:\Users\walte\gratzz.com\android
.\gradlew.bat tasks
```

## Open the project

From the repo root:

```powershell
npm run cap:open:android
```

Or open this folder directly in Android Studio:

`C:\Users\walte\gratzz.com\android`

## First Android run checklist

- let Gradle sync finish
- confirm package name is `com.congratss.app`
- run on emulator or real device
- confirm launch screen appears
- confirm sign-in screen loads
- confirm settings page shows `Support` and `Delete Account`
- test a throwaway-account deletion flow
