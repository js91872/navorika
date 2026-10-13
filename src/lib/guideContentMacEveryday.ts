import type { GuideContent } from './guideContent';
export const macEverydayGuideContent: Record<string, GuideContent> = {
  "how-to-copy-and-paste-on-macbook": {
    "intro": "To copy and paste on a MacBook, highlight text or select a file, press **Command (⌘) + C**, click where you want the copy, and press **Command (⌘) + V**. The Command key sits beside the space bar. This works on MacBook Air, MacBook Pro, and most other Macs. If you have switched from Windows, remember that most Mac shortcuts use Command rather than Control.\n\nFor text, you can also use the menu bar: select text, choose **Edit > Copy**, click the destination, then choose **Edit > Paste**. For a file, select it in Finder and use the same keyboard shortcuts. Copying creates another instance; it does not remove the original.",
    "sections": [
      {
        "title": "Mac copy and paste keyboard shortcuts",
        "content": "| Task | Shortcut | What happens |\n| --- | --- | --- |\n| Copy | Command + C | Copies selected text, image or file |\n| Paste | Command + V | Inserts the clipboard contents |\n| Cut text | Command + X | Removes selected editable text and copies it |\n| Select all | Command + A | Selects all text or items in the current view |\n| Undo | Command + Z | Reverses the last supported action |\n| Move a copied Finder file | Option + Command + V | Moves the copied item instead of duplicating it |\n| Paste and match style | Option + Shift + Command + V | Pastes text using the destination style in many apps |\n\nShortcuts depend on the active app and its menus. If paste and match style does not work, open **Edit** and look for the command supported by that application. Some apps, including Microsoft Word, offer different paste options."
      },
      {
        "title": "How to copy and paste text using a trackpad or mouse",
        "content": "First drag across the words to highlight them. On a MacBook trackpad, you can click and drag with one finger while holding the click, or use the selection method you find comfortable. Next, secondary-click the selection using a two-finger click, if enabled, and choose **Copy**. Click in the destination and secondary-click again to choose **Paste**.\n\nIf the right-click menu does not appear, open **System Settings > Trackpad > Point & Click** and review **Secondary click**. A connected mouse may have its own secondary-click settings. You can always use the Edit menu instead. In web pages, some protected fields or websites may restrict selection; that is not a problem with the Mac keyboard."
      },
      {
        "title": "How to cut and paste on a Mac computer",
        "content": "When editing text, highlight the words and press **Command + X** to cut them. Move the insertion point and press **Command + V**. The text disappears from its old location and appears in the new one. This is the closest equivalent to Windows Ctrl+X and Ctrl+V.\n\nMoving a file in Finder is different. Finder does not use Command+X as the standard cut-file shortcut. Select the file and press **Command + C**. Open the destination folder, then press **Option + Command + V**. Finder moves the item to the new folder when permitted. Check the destination before emptying Trash or deleting backups. On a read-only disk or without sufficient permission, moving may fail."
      },
      {
        "title": "How to copy and paste pictures on a MacBook",
        "content": "To copy an image from a document or webpage, secondary-click it and select **Copy Image**, when available. Then paste into Notes, Pages, an email, or another app that accepts images. If you need the actual image file, use **Save Image As** or drag the image to Finder instead. Copying an image to the clipboard and downloading its file are not always the same thing.\n\nIn Photos, select the photo and use the Share or export options when you need a full-resolution file. Some apps paste a preview or a reduced-quality version. For a screenshot, press **Shift + Command + 4** to select an area and save it, or add **Control** to copy the capture to the clipboard instead of saving a file. Screenshots containing private information should be reviewed before sharing."
      },
      {
        "title": "Paste without formatting on Mac",
        "content": "If copied text arrives with an unwanted font, color or size, try **Option + Shift + Command + V**. Many Mac apps call this **Paste and Match Style**. This inserts the words using the formatting of the destination rather than preserving the source appearance. The exact command varies between apps, so check the Edit menu.\n\nFor example, copy a paragraph from a website, open Notes or a document, and use paste-and-match-style to avoid carrying over large headings and colored text. When the shortcut is unavailable, paste into a plain-text editor first and copy the clean text again. Be aware that this also removes intended bold, italic and link styling."
      },
      {
        "title": "Copy and paste between iPhone, iPad and Mac",
        "content": "Apple's Universal Clipboard can let you copy on one nearby Apple device and paste on another. Both devices generally need to be signed in to the same Apple Account, with Wi-Fi, Bluetooth and Handoff enabled. On Mac, check **System Settings > General > AirDrop & Handoff**. On iPhone or iPad, check the Handoff setting under General. Keep the devices nearby and unlocked as needed.\n\nCopy a short piece of text on your iPhone, switch promptly to your Mac, and press Command+V in a compatible app. Universal Clipboard is temporary; it is not a permanent history or a file-sync system. If it fails, verify account identity, connectivity, Handoff settings and software updates on both devices."
      },
      {
        "title": "Why copy and paste is not working on MacBook",
        "content": "Start by checking whether you selected anything and whether the destination accepts that type of content. Try copying a short sentence from Notes into another Notes note. If that works, the problem may be specific to a website or application. Quit and reopen the affected app, then try again. Restarting the Mac can also resolve a temporarily stuck clipboard service.\n\nIf the shortcut does nothing, test the Command key with another shortcut and inspect **System Settings > Keyboard > Keyboard Shortcuts** for conflicts. If the clipboard works in one user account but not another, review third-party clipboard utilities and login items. Avoid random Terminal commands that kill system processes unless you understand the consequences. For persistent issues, update macOS and consult Apple Support."
      },
      {
        "title": "Copy and paste in Word, Google Docs and browsers",
        "content": "In Microsoft Word on Mac, Command+C and Command+V work for ordinary text. Use Word's paste options when you want to keep source formatting, merge formatting or keep text only. In Google Docs, browser permissions can affect menu-based clipboard access, but keyboard shortcuts generally work. In Safari and Chrome, copy a page address by selecting the address bar, then pressing Command+C.\n\nFor spreadsheet cells, copying may include formulas and formatting. Use the application's Paste Special choices when you only want values. In password fields and secure apps, copying or pasting may be restricted for security. Do not assume that copying sensitive information into a third-party clipboard manager is private."
      },
      {
        "title": "Common mistakes and a simple practice exercise",
        "content": "A common beginner mistake is pressing Control+C instead of Command+C. Another is trying to cut a Finder file with Command+X, which is not the standard move workflow. A third is pasting into a window that has not been clicked or focused. Check the insertion cursor before using Command+V.\n\nPractice in Notes: type a sentence, double-click a word, press Command+C, press Return, and paste it. Next, select the original word, cut it with Command+X, and paste it elsewhere. Finally, open Finder and copy a harmless test file to another folder. These three exercises cover most daily MacBook copy-and-paste tasks."
      },
      {
        "title": "Related Navorika guides",
        "content": "For other everyday Mac tasks, read [how to show battery percentage on Mac](/guides/how-to-show-battery-percentage-on-mac), [how to clear RAM on a Mac](/guides/how-to-clear-ram-on-mac), and [how to speed up a MacBook](/guides/how-to-speed-up-macbook). If you need to turn an image into a document, see [how to convert an image to PDF on iPhone](/guides/how-to-convert-image-to-pdf-on-iphone)."
      }
    ],
    "faqs": [
      {
        "question": "What are the copy and paste keys on a MacBook?",
        "answer": "Press Command+C to copy and Command+V to paste. The Command key is next to the space bar."
      },
      {
        "question": "How do I copy and paste without a mouse?",
        "answer": "Use Shift with arrow keys to select text, Command+C to copy, and Command+V to paste."
      },
      {
        "question": "Why does Control+C not copy on a Mac?",
        "answer": "Most Mac apps use the Command key for copying. Control+C has a different purpose in Terminal."
      },
      {
        "question": "How do I move files instead of copying them?",
        "answer": "Copy a Finder file with Command+C, then press Option+Command+V in the destination folder."
      },
      {
        "question": "How do I paste without formatting?",
        "answer": "Try Option+Shift+Command+V or choose Paste and Match Style from the app's Edit menu."
      },
      {
        "question": "Does MacBook have clipboard history?",
        "answer": "macOS has a clipboard, but it does not provide a built-in full multi-item clipboard history like some third-party utilities."
      }
    ],
    "summary": "How to Copy and Paste on a MacBook: Keyboard, Trackpad, Files and Photos. Follow the safe steps above, use the relevant Mac shortcuts, and consult Apple Support when an issue persists.",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Copy and Paste on a MacBook: Keyboard, Trackpad, Files and Photos",
      "description": "Learn how to copy and paste on MacBook Air and Pro with Command-C and Command-V, move files in Finder, paste without formatting, and fix clipboard problems.",
      "author": {
        "@type": "Organization",
        "name": "Navorika"
      },
      "datePublished": "2026-10-13",
      "dateModified": "2026-10-13"
    }
  },
  "how-to-speed-up-macbook": {
    "intro": "If your MacBook suddenly feels slow, **restart it, check available storage, open Activity Monitor to find busy apps, and reduce unnecessary login items**. These steps are safer and more useful than installing an unknown cleaner. A MacBook can slow down because an app is using too much processor time, memory pressure is high, the startup disk is almost full, or a browser has too many active tabs.\n\nThe best fix depends on the symptom. Slow startup suggests login items or disk issues; a spinning beachball inside one app points toward that app; slow websites can indicate a browser or network problem rather than a slow computer. Follow the checks below in order and note whether each one helps.",
    "sections": [
      {
        "title": "1. Restart your MacBook before making changes",
        "content": "Open the Apple menu and choose **Restart**. Save your work first. Restarting closes stuck applications and resets temporary processes without deleting personal files. If the Mac has been awake for many days, this is a reasonable first step. After restarting, wait for background startup tasks to settle and test the same activity that was slow.\n\nIf the Mac freezes frequently, record the names of the apps involved. Do not repeatedly force the computer off unless it is unresponsive, because unsaved changes may be lost."
      },
      {
        "title": "2. Check CPU usage in Activity Monitor",
        "content": "Open **Applications > Utilities > Activity Monitor**, or search for Activity Monitor with Spotlight. Select the **CPU** tab and sort by **% CPU**. A process consistently consuming substantial CPU while the Mac is idle deserves investigation. Some temporary spikes are normal during software updates, photo indexing or video export.\n\nIf a familiar app is stuck, save your work and quit it normally. Use the Stop button in Activity Monitor only when needed and only for a process you recognize. Do not terminate unfamiliar macOS system processes merely because their names look technical. Reopen the app and check whether performance improves."
      },
      {
        "title": "3. Check memory pressure, not just free RAM",
        "content": "In Activity Monitor, open the **Memory** tab and examine the **Memory Pressure** graph. Green generally indicates manageable pressure; sustained yellow or red can mean the system is working hard to manage available memory. Look at which apps consume the most memory and close unneeded browser tabs or large projects.\n\nModern macOS intentionally uses available RAM for caching, so a low free-memory number alone does not mean something is wrong. Restarting can clear a temporary memory problem, but repeated high pressure during normal work may indicate that your workload exceeds the Mac's available memory. For a detailed explanation, read [how to clear RAM on a Mac](/guides/how-to-clear-ram-on-mac)."
      },
      {
        "title": "4. Free up storage on the startup disk",
        "content": "Open **System Settings > General > Storage** to see what uses disk space. Remove unneeded downloads, old installers and duplicate personal files only after confirming they are backed up. Empty Trash when you are sure you no longer need its contents. Move large video archives to an external drive if appropriate.\n\nA nearly full startup disk can leave too little room for temporary files and memory swap, worsening slowdowns. There is no universal magic percentage of free space that fixes every Mac. Instead, aim for comfortable working room for updates and your typical files. Never delete random folders from Library or System to chase a storage target."
      },
      {
        "title": "5. Disable unnecessary login items",
        "content": "Open **System Settings > General > Login Items & Extensions**. Review apps that open automatically when you sign in and disable those you do not need immediately. Also inspect background activity permissions carefully: security, backup and accessibility software may need to remain enabled.\n\nRestart and compare startup speed. Removing an app from login items does not uninstall it; you can still open it manually. If a background item has an unfamiliar name, identify its developer before changing it."
      },
      {
        "title": "6. Update macOS and your apps",
        "content": "Back up important files, then check **System Settings > General > Software Update**. Install a compatible macOS update when appropriate. Update slow apps through the App Store or their official update menus. Updates can fix performance bugs, security problems and compatibility issues.\n\nOn an older Intel Mac, check compatibility before upgrading to a major macOS version. Newer is not automatically faster on every device. Allow time after an upgrade for Spotlight indexing and other background tasks before judging performance."
      },
      {
        "title": "7. Close heavy browser tabs and extensions",
        "content": "Safari and Chrome can consume significant memory when dozens of pages, streaming videos or extensions are open. Close tabs you no longer need, then test the same website in a private window with extensions disabled where possible. Remove extensions you do not recognize or use.\n\nIf only one website is slow, the cause may be the website itself. If every site loads slowly but local apps work normally, test Wi-Fi and internet speed rather than assuming the MacBook needs cleaning."
      },
      {
        "title": "8. Make Safari faster on a MacBook",
        "content": "Update macOS and Safari, close unused tabs and disable problematic extensions under **Safari > Settings > Extensions**. If one site misbehaves, try a private window to see whether stored website data or an extension is involved. Clear site-specific data only if needed; doing so can sign you out of websites.\n\nDo not indiscriminately erase all browsing data as a first step. Check whether the slowdown happens on every network and whether another browser behaves similarly. If both are slow only online, investigate the connection."
      },
      {
        "title": "9. Reduce visual and background workload",
        "content": "Open **System Settings > Accessibility > Display** and consider **Reduce motion** or **Reduce transparency** if animations feel distracting or sluggish. These settings mainly change visual effects; they are not guaranteed to deliver a measurable CPU speed increase.\n\nPause unnecessary large downloads, cloud sync or media exports when you need maximum responsiveness for a meeting or a demanding task. Let important backups finish later rather than permanently disabling them."
      },
      {
        "title": "10. Check for overheating and blocked ventilation",
        "content": "A MacBook may reduce performance when it becomes too hot. Use it on a hard, stable surface and avoid blocking ventilation. If the laptop is unusually hot, close demanding apps and let it cool. Keep it away from direct sunlight and hot cars.\n\nSome MacBook Air models are fanless, while many MacBook Pro models use fans; their thermal behavior differs. Do not insert objects into vents or use liquid cleaning products. Persistent overheating, sudden shutdowns or a swollen battery require professional attention."
      },
      {
        "title": "11. Identify slow external drives and accessories",
        "content": "Disconnect nonessential USB hubs, external drives and accessories one at a time to check whether a device or driver is causing delays. If Finder freezes while opening a particular external drive, stop using it for important writes and check the drive's health after backing up accessible files.\n\nUse **Disk Utility > First Aid** for appropriate disk checks, following Apple's guidance and backing up first. First Aid checks file-system structures; it cannot repair every failing physical drive. If the Mac reports repeated disk errors, seek support rather than running destructive repair commands."
      },
      {
        "title": "12. Check whether Spotlight is indexing",
        "content": "After a macOS upgrade or a large file import, Spotlight may index content in the background. This can temporarily use CPU and disk resources. Leave the Mac connected to power for a while and check whether performance settles.\n\nDo not disable Spotlight or delete its database merely because indexing is visible in Activity Monitor. If indexing continues abnormally for a long time, consult Apple's troubleshooting guidance."
      },
      {
        "title": "13. Scan for unwanted software carefully",
        "content": "Unexpected pop-ups, unfamiliar browser extensions and redirects can indicate unwanted software. Remove suspicious extensions and apps through their normal uninstall methods. Keep macOS security protections enabled and install software only from trusted sources.\n\nAvoid advertisements claiming your Mac has thousands of urgent problems. A generic cleaner cannot reliably solve failing hardware, insufficient memory or a badly behaved application. Be skeptical of utilities that request broad disk access without explaining why."
      },
      {
        "title": "14. Understand Intel Mac versus Apple silicon performance",
        "content": "MacBooks with Apple silicon (M-series chips) generally handle memory and power differently from older Intel models. Some older Intel MacBooks with mechanical hard drives or limited RAM may benefit from supported hardware upgrades, but most recent MacBook models have non-upgradeable internal memory and storage.\n\nCheck **Apple menu > About This Mac** to identify your model and chip. Do not buy RAM or an SSD until you confirm that the exact model supports replacement. On a supported older machine, professional servicing may be more sensible than attempting a risky repair."
      },
      {
        "title": "15. Test in Safe Mode and seek help when needed",
        "content": "If the Mac remains slow after basic checks, Apple's Safe Mode can help identify issues related to software loaded at startup. The startup procedure differs for Apple silicon and Intel Macs, so follow the instructions for your specific model on Apple Support. Test whether the problem persists, then restart normally.\n\nIf the Mac is still slow, make a current backup and consider Apple Diagnostics or an authorized repair assessment. Warning signs include repeated crashes, storage errors, unusual noises on older hardware, and frequent shutdowns. A clean reinstall should be a last resort, not a routine speed tip."
      },
      {
        "title": "Which fix should you try first?",
        "content": "| Symptom | First check | Next step |\n| --- | --- | --- |\n| Slow after login | Login Items | Restart and compare |\n| Beachball in one app | Activity Monitor CPU | Update or reinstall that app |\n| Many tabs cause freezing | Memory Pressure | Close tabs and extensions |\n| Low storage warning | General > Storage | Remove backed-up unused files |\n| Slow Safari only | Extensions and website data | Compare another browser |\n| Hot and sluggish | Temperature and airflow | Reduce demanding tasks |\n| Slow after an update | Background indexing | Allow time, then retest |\n\nMake one change at a time. Otherwise, you may not know which step helped, and you could disable a useful background service unnecessarily."
      },
      {
        "title": "Related Navorika guides and tools",
        "content": "For a closer look at memory use, see [how to clear RAM on Mac](/guides/how-to-clear-ram-on-mac). Learn [how to show battery percentage on Mac](/guides/how-to-show-battery-percentage-on-mac) to keep an eye on power status, and [how to copy and paste on MacBook](/guides/how-to-copy-and-paste-on-macbook) for everyday shortcuts. If you work with large pictures, browse Navorika's [image compression guide](/guides/image-compression-guide) to understand file sizes before uploading."
      }
    ],
    "faqs": [
      {
        "question": "How can I speed up my MacBook for free?",
        "answer": "Restart it, close unnecessary apps, review Activity Monitor, free unneeded storage and reduce login items. These steps require no paid software."
      },
      {
        "question": "Why is my MacBook suddenly so slow?",
        "answer": "Common causes include a busy app, background indexing, high memory pressure, low free storage or a recent software change."
      },
      {
        "question": "Does clearing RAM speed up a Mac?",
        "answer": "Closing memory-heavy apps can help when memory pressure is high. Simply trying to maximize free RAM is not a useful goal."
      },
      {
        "question": "How do I speed up an old MacBook Pro?",
        "answer": "Identify its exact model, update compatible software, check storage and memory pressure, and investigate supported hardware repairs or upgrades."
      },
      {
        "question": "Will a factory reset make my Mac faster?",
        "answer": "It may remove problematic software, but it will not fix failing hardware or insufficient resources. Back up and troubleshoot before considering a reinstall."
      },
      {
        "question": "Should I install a Mac cleaner?",
        "answer": "Not as a first step. Built-in macOS tools can identify many common causes without third-party cleaners."
      }
    ],
    "summary": "How to Speed Up a MacBook: 15 Safe Fixes for a Slow Mac. Follow the safe steps above, use the relevant Mac shortcuts, and consult Apple Support when an issue persists.",
    "schema": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "How to Speed Up a MacBook: 15 Safe Fixes for a Slow Mac",
      "description": "MacBook running slow? Follow 15 safe ways to speed up MacBook Air or Pro, check Activity Monitor, free storage, reduce startup apps and troubleshoot slow Safari.",
      "author": {
        "@type": "Organization",
        "name": "Navorika"
      },
      "datePublished": "2026-10-13",
      "dateModified": "2026-10-13"
    }
  }
};
