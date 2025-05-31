# AIMyMatrix

**AIMyMatrix** is an all-in-one, cross-platform AI launcher for desktop, inspired by [Stability Matrix](https://github.com/LykosAI/StabilityMatrix).  
It provides a beautiful, modern interface to organize and launch AI tools like InvokeAI, Automatic1111, ComfyUI, Forge, and others—each added and managed by the user.

---

## 🚩 Current Milestone: Platform Icon System

- **User-added tools**: Add, edit, or remove any AI tool you install, directly from the AIMyMatrix interface.
- **Custom icons**: When configuring a tool, pick any local image file. The app converts it to a portable base64 data URL, so your icons always show up—no more file path issues!
- **Modern UI**: All platform cards use a unified look with logo, app name, description, and quick action buttons.
- **Live card editing**: Instantly update platform information, icon, or launch script.
- **Dark and light modes**: UI adapts to your theme preference.
- **Robust error handling**: Electron’s security is respected, and icons always display.

---

## 📦 Features Implemented

- Tool platform cards (add, edit, delete, update, launch)
- Platform icons fully portable (base64 data URLs)
- Per-card config drawer/modal with file browsing
- Start/stop AI tools with one click
- Settings panel for new tool creation
- Responsive, polished design (Tailwind, modern UX)
- Electron-based: cross-platform desktop app (first focus: Windows 11)

---

## 🚧 Next Steps / Roadmap

1. **Descriptor Validation**: Ensure platform configs are always valid (no missing fields, valid commands).
2. **App Update Integration**: Implement update methods/scripts for managed tools.
3. **Log Streaming/Console**: Live log capture from tool processes, viewable per card.
4. **Settings and Preferences**: Save UI and platform state, remember window sizes and theme.
5. **User Profile/Workspaces**: Organize cards by user-defined categories or workspaces.
6. **Plugin System**: Support for user scripts, automation, or future AI platform integrations.
7. **Multi-OS Support**: Ensure seamless use on macOS and Linux.
8. **Auto-Detection of Installed Tools** (optional): Scan for common AI tools, offer to add.
9. **Installer and Distribution**: Build installer for easy end-user setup.
10. **Security & CSP Improvements**: Harden CSP and sandboxing before production.

---

## 🛠️ Running Locally

See [INSTALLATION.md](INSTALLATION.md) for detailed setup, or:

```powershell
pnpm install
pnpm run dev
