# Editing and rebuilding

The app has no frontend dependency or bundler. Edit `index.html`, `style.css`,
`core.js`, and `app.js`, then run `python build.py` to regenerate `Daytone.html`.
Open the HTML to review changes. Never edit the generated header manually.

To compile the Windows launcher, install MinGW-w64 on your build machine and run:

```sh
python build.py --compiler x86_64-w64-mingw32-gcc
```

Optionally rebuild the icon resource first:

```sh
x86_64-w64-mingw32-windres app.rc -o resources.o
```

The Windows executable embeds the generated HTML in `embedded_ui.h`. It writes
only its application files to `%LOCALAPPDATA%\DaytoneDemo` and invokes Edge in
app mode with a dedicated profile. The stable path preserves localStorage across
UI revisions. Launcher errors are shown in a Windows message box.

If adding new state fields, migrate saved state instead of silently deleting it.
Keep the versioned backup format and use fake time for timer tests.

Calculation tests: `node ../tests/core.test.cjs`.
Browser tests: see the environment variables at the top of `../tests/ui.test.cjs`.
Playwright and Chromium are developer test tools only, not end-user dependencies.

Before release on mobile, follow PRODUCT-PLAN.md. This source does not yet include
Capacitor projects, native notifications, cloud sync, or store signing.
