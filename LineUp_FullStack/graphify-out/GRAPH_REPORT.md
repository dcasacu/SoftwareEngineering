# Graph Report - LineUp_FullStack  (2026-05-18)

## Corpus Check
- 78 files · ~26,497 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 374 nodes · 404 edges · 45 communities (32 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eff7b597`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]

## God Nodes (most connected - your core abstractions)
1. `package:flutter/material.dart` - 16 edges
2. `../config/theme.dart` - 10 edges
3. `AppDelegate` - 8 edges
4. `WindowClassRegistrar` - 7 edges
5. `Create()` - 7 edges
6. `Destroy()` - 7 edges
7. `package:provider/provider.dart` - 6 edges
8. `package:go_router/go_router.dart` - 6 edges
9. `../../providers/auth_provider.dart` - 5 edges
10. `../../providers/shops_provider.dart` - 5 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `my_application_new()`  [INFERRED]
  linux/runner/main.cc → linux/runner/my_application.cc
- `my_application_activate()` --calls--> `fl_register_plugins()`  [INFERRED]
  linux/runner/my_application.cc → linux/flutter/generated_plugin_registrant.cc
- `OnCreate()` --calls--> `GetClientArea()`  [INFERRED]
  windows/runner/flutter_window.cpp → windows/runner/win32_window.cpp
- `OnCreate()` --calls--> `SetChildContent()`  [INFERRED]
  windows/runner/flutter_window.cpp → windows/runner/win32_window.cpp
- `wWinMain()` --calls--> `CreateAndAttachConsole()`  [INFERRED]
  windows/runner/main.cpp → windows/runner/utils.cpp

## Communities (45 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (32): db, dbPath, path, sqlite3, customers, db, owners, shops (+24 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (30): api_service.dart, ../config/api_config.dart, dart:convert, ../models/queue_entry.dart, ../models/shop.dart, ../models/user.dart, package:http/http.dart, ../services/api_service.dart (+22 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (24): app.dart, ../config/theme.dart, package:flutter/material.dart, AppTheme, main, build, CategoryFilter, GestureDetector (+16 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (21): OnCreate(), Create(), Destroy(), EnableFullDpiSupportIfAvailable(), GetClientArea(), GetThisFromHandle(), GetWindowClass(), MessageHandler() (+13 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (18): build, Card, Center, Column, Container, _getCategoryEmoji, initState, ListView (+10 more)

### Community 5 - "Community 5"
Cohesion: 0.11
Nodes (7): fl_register_plugins(), main(), my_application_activate(), my_application_new(), _MyApplication, dart_entrypoint_arguments, parent_instance

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (17): author, dependencies, bcryptjs, cors, express, sqlite3, description, keywords (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (12): build, ElevatedButton, _getCategoryEmoji, initState, Padding, QueueListTile, Scaffold, ShopDetailScreen (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.21
Nodes (5): FlutterWindow(), wWinMain(), CreateAndAttachConsole(), GetCommandLineArguments(), Utf8FromUtf16()

### Community 9 - "Community 9"
Cohesion: 0.18
Nodes (10): build, DashboardScreen, _DashboardScreenState, Expanded, initState, Scaffold, SizedBox, _StatBox (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (9): build, Card, _emoji, initState, MyQueuesScreen, _MyQueuesScreenState, Scaffold, SizedBox (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (3): FlutterAppDelegate, FlutterImplicitEngineDelegate, AppDelegate

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (8): package:go_router/go_router.dart, ../screens/customer/map_screen.dart, ../screens/customer/my_queues_screen.dart, ../screens/customer/shop_detail_screen.dart, ../screens/owner/dashboard_screen.dart, ../screens/splash_screen.dart, DashboardScreen, ShopDetailScreen

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (8): ../../providers/auth_provider.dart, build, GestureDetector, _ModeCard, Scaffold, SizedBox, SplashScreen, Text

### Community 15 - "Community 15"
Cohesion: 0.25
Nodes (7): app, cors, db, dbPath, express, path, sqlite3

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (7): configVersion, flutterRoot, flutterVersion, generator, generatorVersion, packages, pubCache

### Community 17 - "Community 17"
Cohesion: 0.25
Nodes (7): package:provider/provider.dart, ../../providers/queue_provider.dart, ../../providers/shops_provider.dart, routing/app_router.dart, build, LineUpApp, MultiProvider

### Community 18 - "Community 18"
Cohesion: 0.40
Nodes (4): images, info, author, version

### Community 19 - "Community 19"
Cohesion: 0.33
Nodes (3): RegisterGeneratedPlugins(), NSWindow, MainFlutterWindow

### Community 20 - "Community 20"
Cohesion: 0.40
Nodes (4): images, info, author, version

### Community 22 - "Community 22"
Cohesion: 0.50
Nodes (3): configVersion, packages, roots

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (3): package:flutter_test/flutter_test.dart, package:lineup/app.dart, main

### Community 25 - "Community 25"
Cohesion: 0.50
Nodes (3): package:flutter_web_plugins/flutter_web_plugins.dart, package:shared_preferences_web/shared_preferences_web.dart, registerPlugins

## Knowledge Gaps
- **214 isolated node(s):** `name`, `version`, `description`, `main`, `start` (+209 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `package:flutter/material.dart` connect `Community 2` to `Community 1`, `Community 4`, `Community 7`, `Community 9`, `Community 11`, `Community 14`, `Community 17`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `package:go_router/go_router.dart` connect `Community 13` to `Community 4`, `Community 7`, `Community 9`, `Community 11`, `Community 14`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `../config/theme.dart` connect `Community 2` to `Community 4`, `Community 7`, `Community 9`, `Community 11`, `Community 14`, `Community 17`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _215 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05547652916073969 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07096774193548387 - nodes in this community are weakly interconnected._