# 📱 Reminder - 100% Offline Task & Call Manager

A fast, battery-efficient, all-in-one task manager and reminder application built to work **strictly offline**. Create call reminders, take notes, and track birthdays without ever connecting to the internet—everything is stored in an encrypted private database on your device, never on external servers.

---

## 🌟 Key Features

### 1. 📞 Direct-Dial Call Reminders
- Schedule calls to specific contacts down to the exact second.
- On trigger time, wakes the phone screen with a **full-screen incoming-call style alarm interface** (`CallAlarmActivity`).
- **One-Tap / Direct Outbound Dialing:** Fires `Intent.ACTION_CALL` directly via `android.permission.CALL_PHONE` without requiring manual dialing.
- Quick presets: `+15 min`, `+1 hour`, `Tomorrow 9am`, and custom repeat frequencies (`Daily`, `Weekly`, `Monthly`, `Yearly`).

### 2. 🎂 Birthday & Milestone Tracker
- Enter birth date (e.g., `2001-11-28`).
- **Dynamic Age Calculator:** Automatically calculates current age, upcoming age milestone, and countdown days remaining.
- **Annual Morning Call Alarm:** Automatically schedules a yearly direct-call alarm on the contact's birthday morning (e.g. `08:00 AM`).

### 3. 📝 Private Notes Vault
- Fast offline note-taking and checklist capture.
- Color categorization tags and pin-to-top prioritization.
- Real-time local search filter.

### 4. 🔒 100% Offline & Private
- Zero cloud servers, zero analytics, zero user accounts.
- Private sandboxed local storage (Dexie / SQLite).

---

## 🏗️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 + TypeScript + Vite |
| **Styling & Aesthetics** | Mobile-First Vanilla CSS adhering to `design-taste-frontend` rules |
| **Native Android Container** | Capacitor 6 / 7 |
| **Native Android Engine** | `AlarmManager.setExactAndAllowWhileIdle()`, `BroadcastReceiver`, `WakeLock` |
| **Telephony Bridge** | `CallReminderPlugin` (`Intent.ACTION_CALL` + `android.permission.CALL_PHONE`) |
| **CI/CD APK Workflow** | GitHub Actions (`.github/workflows/build-apk.yml`) with JDK 17 & Android SDK |

---

## 🚀 How to Build the APK via GitHub Actions

The repository includes a pre-configured automated CI/CD pipeline: [.github/workflows/build-apk.yml](file:///.github/workflows/build-apk.yml).

### Step-by-Step Instructions:

1. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git
   git push -u origin main
   ```

2. **GitHub Actions Build Execution:**
   - As soon as you push to `main` (or run **Actions > Run workflow** manually in GitHub), the workflow triggers.
   - It sets up Ubuntu, Node.js 20, Java JDK 17, and Android SDK Platform 34.
   - It runs `npm run build`, syncs Capacitor, and executes `./gradlew assembleDebug`.

3. **Download Your APK:**
   - Go to your GitHub repository's **Actions** tab.
   - Click on the latest workflow run: **"Build Reminder Android APK"**.
   - Under **Artifacts**, download **`Reminder-App-Debug-APK`**.
   - Install the `.apk` directly onto any Android phone or tablet!

---

## 💻 Local Web Development & Testing

You can also run the web interface directly in your browser:

```bash
# Start local development server
npm run dev
```

Visit `http://localhost:3000` to interact with the mobile timeline, schedule call reminders, track birthdays, and simulate the incoming-call alarm interface.
