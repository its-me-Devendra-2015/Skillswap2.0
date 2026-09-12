# SkillSwap v6 — Multi-Page Edition

This build keeps **SkillSwap v5 as the visual base** and incorporates the structure/content approach from the companion SkillSwap ZIP without replacing the v5 design system.

## Visual rules preserved
- `css/style.css` is unchanged byte-for-byte from v5.
- v5 colors, typography, spacing, cards, buttons, navigation and responsive behavior remain the visual system.
- No new visual framework or React/Tailwind conversion was introduced.
- Home stays free of the `SkillSwap — Prototype-ready • Real user records only • Backend-ready data layer` footer text.

## Separate pages
- `index.html` — Home
- `dashboard.html` — Dashboard
- `skills.html` — Skill marketplace
- `add-skill.html` — Add skill
- `masterclasses.html` — Masterclass catalog
- `masterclass-detail.html?id=...` — Individual masterclass page
- `lesson.html?master=...&lesson=...` — Individual lesson page
- `certificate.html?master=...` — Completion page
- `tools.html` — Direct-use tools
- `matches.html` — Real-user skill matches
- `projects.html` — Community projects
- `upload-project.html` — Upload project
- `messages.html` — Global/direct messaging
- `community.html` — Real registered community
- `protest-zone.html` — Community zones
- `protest.html?id=...` — Individual zone
- `profile.html` / `profile.html?id=...` — Profiles
- `settings.html` — Profile settings
- `login.html` — Login
- `signup.html` — Signup

## Masterclasses
Masterclasses now use separate webpage navigation instead of a modal. Embedded videos remain embedded with no visible video hyperlinks, and there is no toast/notification when opening a Masterclass. Masterclass catalog, detail, and lesson pages include **Not sponsored** at the bottom.

## Data/functionality
The existing v5 localStorage functionality is preserved and the data key is migrated forward to `skillswap_multipage_v6`; existing v5 and v3 data are read as fallbacks so existing browser data is preserved. New pages use the same stored real-user records rather than adding fake community members.
