import type { GuideContent } from './guideContent';

export const macBatteryGuideContent: Record<string, GuideContent> = {
  "how-to-show-battery-percentage-on-mac": {
    "intro": "To show battery percentage on a Mac in 2026, including a MacBook Air or Pro, open **Apple menu > System Settings > Menu Bar > Battery > Battery Options**, then turn on **Show Percentage**. This is the current path in macOS 27 Golden Gate and macOS Tahoe 26. Older versions use a different settings menu, so use the steps for your macOS version below.",
    "sections": [
      {
        "title": "Show battery percentage on macOS 27 and macOS Tahoe 26",
        "content": "1. Click the **Apple menu ()** in the top-left corner.\n2. Choose **System Settings**.\n3. Click **Menu Bar** in the sidebar. Scroll down if needed.\n4. Select **Battery**, then click **Battery Options**.\n5. Turn on **Show Percentage**.\n\nThe percentage appears in the menu bar at the top of your screen. If you do not see a battery icon, turn on the Battery menu bar item on the same screen. Apple’s [Mac User Guide](https://support.apple.com/guide/mac-help/monitor-your-macs-battery-mchlp1115/mac) confirms this path. These steps apply to both macOS 27 Golden Gate and macOS Tahoe 26."
      },
      {
        "title": "Find the setting in macOS Sequoia, Sonoma, or Ventura",
        "content": "On these versions, open **Apple menu > System Settings > Control Center**. Scroll to the Battery section. Turn on **Show Percentage**. If the battery icon is missing, also set Battery to show in the menu bar.\n\nThe exact labels can vary slightly by macOS release. To check your version, open **Apple menu > About This Mac**. Apple explains how to [find the macOS version installed on your Mac](https://support.apple.com/en-in/109033)."
      },
      {
        "title": "Use the older setting in Monterey or Big Sur",
        "content": "Open **Apple menu > System Preferences > Dock & Menu Bar**. Select **Battery** in the sidebar, then check **Show Percentage**. If the battery icon is not visible, check **Show in Menu Bar** too.\n\nThese versions use System Preferences. If your screen says System Settings, follow the steps for a newer macOS version instead."
      },
      {
        "title": "MacBook Air and MacBook Pro steps are the same",
        "content": "The steps depend on the macOS version installed, not the MacBook model or chip. A MacBook Air with macOS 27 uses the same Menu Bar setting as a MacBook Pro with macOS 27. This also applies to Apple silicon and Intel models that support that macOS version.\n\nTo check which version you have, click **Apple menu > About This Mac**. The macOS name and version number appear in the window."
      },
      {
        "title": "Battery percentage is missing? Try these checks",
        "content": "**Make sure the battery item is visible.** In System Settings, open Menu Bar or Control Center and turn on the Battery menu bar item. Then turn on Show Percentage.\n\n**Check your macOS version.** The setting moved between releases. Use About This Mac to see whether you have macOS 27, Tahoe 26, Sequoia, Sonoma, Ventura, Monterey, or Big Sur.\n\n**Search Settings.** Use the search field in System Settings and search for **Battery** or **Show Percentage**.\n\n**Restart if the setting is already on.** Restart your Mac, then check the menu bar again. You do not need to install an app to turn on this built-in setting."
      },
      {
        "title": "Battery charge percentage is not battery health",
        "content": "The percentage tells you how much charge is left right now. Battery health describes the battery’s longer-term condition. A MacBook can show 100% charge even if its maximum capacity has reduced over time.\n\nTo check battery condition, open **System Settings > Battery** and look for **Battery Health**. Labels and details can differ by Mac model and macOS version."
      },
      {
        "title": "Can you show a battery percentage on an iMac or Mac mini?",
        "content": "An iMac or Mac mini does not have a built-in MacBook battery, so it cannot show an internal battery percentage in the menu bar. A connected keyboard, mouse, or other wireless accessory may show its own battery level in Bluetooth or in the menu bar."
      },
      {
        "title": "More Mac help",
        "content": "If your Mac is running slowly, see our guide to [safe ways to clear RAM on a Mac](https://navorika.com/guides/how-to-clear-ram-on-mac). For Apple’s current battery instructions, use the [Mac User Guide](https://support.apple.com/guide/mac-help/monitor-your-macs-battery-mchlp1115/mac)."
      }
    ],
    "faqs": [
      {
        "question": "How do I show battery percentage on my Mac?",
        "answer": "On macOS 27 and Tahoe 26, open Apple menu > System Settings > Menu Bar > Battery > Battery Options, then turn on Show Percentage. Older versions use Control Center or Dock & Menu Bar."
      },
      {
        "question": "How do I show battery percentage on a MacBook Air in 2026?",
        "answer": "Open the battery settings for your macOS version and turn on Show Percentage. The steps are the same on MacBook Air and MacBook Pro."
      },
      {
        "question": "How do I show battery percentage on a MacBook Pro?",
        "answer": "On macOS 27 or Tahoe 26, go to System Settings > Menu Bar > Battery > Battery Options and turn on Show Percentage."
      },
      {
        "question": "Where is Show Percentage on macOS 27?",
        "answer": "Go to System Settings > Menu Bar > Battery > Battery Options, then turn on Show Percentage."
      },
      {
        "question": "Where is Show Percentage on macOS Tahoe 26?",
        "answer": "Go to System Settings > Menu Bar > Battery > Battery Options, then turn on Show Percentage."
      },
      {
        "question": "Why is the battery percentage not showing on my Mac?",
        "answer": "Check that Battery is set to appear in the menu bar and that Show Percentage is on. Also make sure the instructions match your macOS version."
      },
      {
        "question": "Is battery percentage the same as battery health?",
        "answer": "No. Battery percentage shows the charge left now. Battery health describes the battery’s condition and capacity over time."
      },
      {
        "question": "Can an iMac show its battery percentage?",
        "answer": "An iMac has no built-in battery. A connected wireless accessory may show its own battery level."
      },
      {
        "question": "Where is the battery icon on a MacBook Pro?",
        "answer": "The battery icon appears in the menu bar at the top of the screen. If it is missing, open System Settings > Menu Bar > Battery and show Battery in the menu bar. Turn on Show Percentage under Battery Options."
      }
    ],
    "summary": "To show battery percentage on MacBook Air, MacBook Pro, or another Mac laptop in 2026, open System Settings > Menu Bar > Battery > Battery Options and turn on Show Percentage. This is the current path for macOS 27 and Tahoe 26. On Sequoia, Sonoma, or Ventura, look under Control Center. On Monterey or Big Sur, use System Preferences > Dock & Menu Bar.",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Show Battery Percentage on Mac (2026): MacBook Air & Pro",
      "description": "Show battery percentage on MacBook Air or Pro in macOS 27, Tahoe 26, and older versions. Follow the steps and fix a missing battery icon.",
      "author": {
        "@type": "Organization",
        "name": "Navorika Team"
      },
      "datePublished": "2026-10-08",
      "dateModified": "2026-10-19"
    }
  }
};
