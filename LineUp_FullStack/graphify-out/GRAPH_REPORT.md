# Graph Report - LineUp_FullStack  (2026-05-18)

## Corpus Check
- Corpus is ~30,794 words - fits in a single context window. You may not need a graph.

## Summary
- 512 nodes · 547 edges · 60 communities (46 shown, 14 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Map & Location Services|Map & Location Services]]
- [[_COMMUNITY_App Configuration & Theme|App Configuration & Theme]]
- [[_COMMUNITY_Windows Runner Components|Windows Runner Components]]
- [[_COMMUNITY_API Client & Configuration|API Client & Configuration]]
- [[_COMMUNITY_Flutter Plugin Registration|Flutter Plugin Registration]]
- [[_COMMUNITY_Owner Dashboard Screen|Owner Dashboard Screen]]
- [[_COMMUNITY_Node.js Package Dependencies|Node.js Package Dependencies]]
- [[_COMMUNITY_Notification & Queue Providers|Notification & Queue Providers]]
- [[_COMMUNITY_Shop Detail & Notifications|Shop Detail & Notifications]]
- [[_COMMUNITY_Queue UI Widgets|Queue UI Widgets]]
- [[_COMMUNITY_Queue Backend Routes|Queue Backend Routes]]
- [[_COMMUNITY_Windows Flutter Window|Windows Flutter Window]]
- [[_COMMUNITY_Auth Provider & Service|Auth Provider & Service]]
- [[_COMMUNITY_Customer My Queues Screen|Customer My Queues Screen]]
- [[_COMMUNITY_Web App Manifest|Web App Manifest]]
- [[_COMMUNITY_Shops Backend Routes|Shops Backend Routes]]
- [[_COMMUNITY_Objective-C Hook Build|Objective-C Hook Build]]
- [[_COMMUNITY_Splash Screen & Auth|Splash Screen & Auth]]
- [[_COMMUNITY_Core Domain Models|Core Domain Models]]
- [[_COMMUNITY_Auth Backend Routes|Auth Backend Routes]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_macOS Platform Components|macOS Platform Components]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Web Platform Assets|Web Platform Assets]]
- [[_COMMUNITY_Dart Tool Generated|Dart Tool Generated]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_iOS Platform Components|iOS Platform Components]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_macOS Platform Components|macOS Platform Components]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_iOS Platform Components|iOS Platform Components]]
- [[_COMMUNITY_iOS Platform Components|iOS Platform Components]]
- [[_COMMUNITY_macOS Platform Components|macOS Platform Components]]
- [[_COMMUNITY_iOS Platform Components|iOS Platform Components]]
- [[_COMMUNITY_Dart Tool Generated|Dart Tool Generated]]
- [[_COMMUNITY_iOS Platform Components|iOS Platform Components]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Test Files|Test Files]]
- [[_COMMUNITY_iOS Platform Components|iOS Platform Components]]
- [[_COMMUNITY_Android Platform Components|Android Platform Components]]
- [[_COMMUNITY_iOS Platform Components|iOS Platform Components]]
- [[_COMMUNITY_iOS Platform Components|iOS Platform Components]]
- [[_COMMUNITY_iOS Platform Components|iOS Platform Components]]
- [[_COMMUNITY_iOS Platform Components|iOS Platform Components]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Android Platform Components|Android Platform Components]]
- [[_COMMUNITY_iOS Platform Components|iOS Platform Components]]
- [[_COMMUNITY_App Icon Assets|App Icon Assets]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]

## God Nodes (most connected - your core abstractions)
1. `package:flutter/material.dart` - 18 edges
2. `../config/theme.dart` - 11 edges
3. `AppDelegate` - 8 edges
4. `WindowClassRegistrar` - 7 edges
5. `Create()` - 7 edges
6. `Destroy()` - 7 edges
7. `package:provider/provider.dart` - 6 edges
8. `../models/shop.dart` - 6 edges
9. `package:go_router/go_router.dart` - 6 edges
10. `../../providers/auth_provider.dart` - 5 edges

## Surprising Connections (you probably didn't know these)
- `API HTTP Client Service` --references--> `Project Dependencies Manifest`  [EXTRACTED]
  LineUp_FullStack/lib/services/api_service.dart → LineUp_FullStack/pubspec.yaml
- `Notification and Haptic Feedback Service` --references--> `Project Dependencies Manifest`  [EXTRACTED]
  LineUp_FullStack/lib/services/notification_service.dart → LineUp_FullStack/pubspec.yaml
- `QueueListTile Widget` --conceptually_related_to--> `QueueService`  [INFERRED]
  LineUp_FullStack/lib/widgets/queue_list_tile.dart → LineUp_FullStack/lib/services/queue_service.dart
- `Launch Image Assets` --conceptually_related_to--> `Launch Screen Assets README`  [EXTRACTED]
  LineUp_FullStack/ios/Runner/Assets.xcassets/LaunchImage.imageset/Contents.json → LineUp_FullStack/ios/Runner/Assets.xcassets/LaunchImage.imageset/README.md
- `main()` --calls--> `my_application_new()`  [INFERRED]
  linux/runner/main.cc → linux/runner/my_application.cc

## Hyperedges (group relationships)
- **Service Layer API Communication Pattern** — service_AuthService, service_QueueService, service_ShopService, service_ApiService [EXTRACTED 1.00]
- **Shop Domain Cluster** — model_Shop, service_ShopService, widget_ShopCard [EXTRACTED 1.00]
- **User Queue Management Flow** — model_User, service_QueueService, service_AuthService [INFERRED 0.70]
- **Queue Management Services** — queue_service_QueueService, shop_service_ShopService [INFERRED 0.80]
- **Queue UI Components** — position_badge_PositionBadge, queue_notification_overlay_QueueNotificationOverlay, queue_list_tile_QueueListTile [INFERRED 0.85]
- **Shop UI Components** — shop_card_ShopCard, category_filter_CategoryFilter [INFERRED 0.80]
- **Overlay Notification Widgets** — queue_notification_overlay_QueueNotificationOverlay, toast_overlay_ToastOverlay [INFERRED 0.75]
- **iOS App Lifecycle** — ios_AppDelegate, ios_SceneDelegate, ios_BridgingHeader [EXTRACTED 1.00]
- **iOS Plugin Registration** — ios_GeneratedPluginRegistrant, ios_BridgingHeader, ios_AppDelegate [EXTRACTED 1.00]
- **iOS Asset Catalog** — ios_launch_images, ios_app_icon, ios_launch_readme [EXTRACTED 1.00]

## Communities (60 total, 14 thin omitted)

### Community 0 - "Map & Location Services"
Cohesion: 0.05
Nodes (42): package:flutter_map/flutter_map.dart, package:geolocator/geolocator.dart, package:latlong2/latlong.dart, package:url_launcher/url_launcher.dart, AnimatedContainer, build, _buildSelectedShopBanner, Card (+34 more)

### Community 1 - "App Configuration & Theme"
Cohesion: 0.05
Nodes (35): app.dart, ../config/theme.dart, package:flutter/material.dart, AppTheme, main, build, CategoryFilter, GestureDetector (+27 more)

### Community 2 - "Windows Runner Components"
Cohesion: 0.12
Nodes (21): OnCreate(), Create(), Destroy(), EnableFullDpiSupportIfAvailable(), GetClientArea(), GetThisFromHandle(), GetWindowClass(), MessageHandler() (+13 more)

### Community 3 - "API Client & Configuration"
Cohesion: 0.08
Nodes (21): api_service.dart, ../config/api_config.dart, dart:convert, ../models/queue_entry.dart, ../models/shop_analytics.dart, ../models/shop.dart, package:http/http.dart, ../services/analytics_service.dart (+13 more)

### Community 4 - "Flutter Plugin Registration"
Cohesion: 0.11
Nodes (7): fl_register_plugins(), main(), my_application_activate(), my_application_new(), _MyApplication, dart_entrypoint_arguments, parent_instance

### Community 5 - "Owner Dashboard Screen"
Cohesion: 0.11
Nodes (17): build, _buildAnalyticsSection, _buildPeriodSection, Card, Center, Column, DashboardScreen, _DashboardScreenState (+9 more)

### Community 6 - "Node.js Package Dependencies"
Cohesion: 0.11
Nodes (17): author, dependencies, bcryptjs, better-sqlite3, cors, express, description, keywords (+9 more)

### Community 7 - "Notification & Queue Providers"
Cohesion: 0.12
Nodes (15): dart:async, package:audioplayers/audioplayers.dart, package:flutter/foundation.dart, package:vibration/vibration.dart, ../services/queue_service.dart, CalledNotification, clearMyEntries, dispose (+7 more)

### Community 8 - "Shop Detail & Notifications"
Cohesion: 0.12
Nodes (16): ../../services/notification_service.dart, build, dispose, ElevatedButton, _getCategoryEmoji, initState, Padding, QueueListTile (+8 more)

### Community 9 - "Queue UI Widgets"
Cohesion: 0.13
Nodes (15): CategoryFilter Widget, PositionBadge Widget, QueueListTile Widget, QueueNotificationOverlay, QueueService, callNext method, getQueue method, joinQueue method (+7 more)

### Community 10 - "Queue Backend Routes"
Cohesion: 0.14
Nodes (13): calledEntries, db, entries, entry, express, h, hourCounts, router (+5 more)

### Community 11 - "Windows Flutter Window"
Cohesion: 0.21
Nodes (5): FlutterWindow(), wWinMain(), CreateAndAttachConsole(), GetCommandLineArguments(), Utf8FromUtf16()

### Community 12 - "Auth Provider & Service"
Cohesion: 0.18
Nodes (9): ../models/user.dart, ../services/api_service.dart, ../services/auth_service.dart, AuthProvider, _clearUser, _persistUser, AuthService, Exception (+1 more)

### Community 13 - "Customer My Queues Screen"
Cohesion: 0.18
Nodes (10): ../../providers/shops_provider.dart, build, Card, _emoji, initState, MyQueuesScreen, _MyQueuesScreenState, Scaffold (+2 more)

### Community 14 - "Web App Manifest"
Cohesion: 0.18
Nodes (10): background_color, description, display, icons, name, orientation, prefer_related_applications, short_name (+2 more)

### Community 15 - "Shops Backend Routes"
Cohesion: 0.20
Nodes (8): db, express, params, result, router, row, rows, shop

### Community 16 - "Objective-C Hook Build"
Cohesion: 0.20
Nodes (9): assets, config, build_asset_types, linking_enabled, out_dir_shared, out_file, package_name, package_root (+1 more)

### Community 17 - "Splash Screen & Auth"
Cohesion: 0.20
Nodes (9): ../../providers/auth_provider.dart, build, GestureDetector, _ModeCard, Scaffold, SizedBox, SplashScreen, _SplashScreenState (+1 more)

### Community 18 - "Core Domain Models"
Cohesion: 0.27
Nodes (10): LineUpApp Entry Point, Shop Model, User Model, Project Dependencies Manifest, API HTTP Client Service, Authentication Service, Notification and Haptic Feedback Service, Queue Management Service (+2 more)

### Community 19 - "Auth Backend Routes"
Cohesion: 0.22
Nodes (8): bcrypt, db, express, hashedPassword, result, router, user, valid

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (8): package:go_router/go_router.dart, ../screens/customer/map_screen.dart, ../screens/customer/my_queues_screen.dart, ../screens/customer/shop_detail_screen.dart, ../screens/owner/dashboard_screen.dart, ../screens/splash_screen.dart, DashboardScreen, ShopDetailScreen

### Community 21 - "macOS Platform Components"
Cohesion: 0.22
Nodes (3): FlutterAppDelegate, FlutterImplicitEngineDelegate, AppDelegate

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (7): app, cors, db, dbPath, express, path, sqlite3

### Community 23 - "Web Platform Assets"
Cohesion: 0.25
Nodes (7): package:audioplayers_web/audioplayers_web.dart, package:device_info_plus/src/device_info_plus_web.dart, package:flutter_web_plugins/flutter_web_plugins.dart, package:geolocator_web/geolocator_web.dart, package:shared_preferences_web/shared_preferences_web.dart, package:url_launcher_web/url_launcher_web.dart, registerPlugins

### Community 24 - "Dart Tool Generated"
Cohesion: 0.25
Nodes (7): configVersion, flutterRoot, flutterVersion, generator, generatorVersion, packages, pubCache

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (7): package:provider/provider.dart, ../../providers/analytics_provider.dart, ../../providers/queue_provider.dart, routing/app_router.dart, build, LineUpApp, MultiProvider

### Community 26 - "Community 26"
Cohesion: 0.29
Nodes (6): app, authRoutes, cors, express, queueRoutes, shopRoutes

### Community 27 - "iOS Platform Components"
Cohesion: 0.40
Nodes (4): images, info, author, version

### Community 28 - "Community 28"
Cohesion: 0.33
Nodes (5): db, insertManyShops, insertManyUsers, insertShop, insertUser

### Community 29 - "macOS Platform Components"
Cohesion: 0.33
Nodes (3): RegisterGeneratedPlugins(), NSWindow, MainFlutterWindow

### Community 30 - "Community 30"
Cohesion: 0.40
Nodes (4): Database, db, dbPath, path

### Community 31 - "iOS Platform Components"
Cohesion: 0.40
Nodes (5): iOS AppDelegate, Runner Bridging Header, GeneratedPluginRegistrant, iOS RunnerTests, iOS SceneDelegate

### Community 32 - "iOS Platform Components"
Cohesion: 0.40
Nodes (4): images, info, author, version

### Community 34 - "iOS Platform Components"
Cohesion: 0.50
Nodes (3): assets_for_linking, status, timestamp

### Community 35 - "Dart Tool Generated"
Cohesion: 0.50
Nodes (3): configVersion, packages, roots

### Community 37 - "Community 37"
Cohesion: 0.50
Nodes (3): AnalyticsPeriod, _formatHour, ShopAnalytics

### Community 38 - "Test Files"
Cohesion: 0.50
Nodes (3): package:flutter_test/flutter_test.dart, package:lineup/app.dart, main

### Community 44 - "iOS Platform Components"
Cohesion: 0.67
Nodes (3): App Icon Assets, Launch Image Assets, Launch Screen Assets README

## Knowledge Gaps
- **321 isolated node(s):** `name`, `version`, `description`, `main`, `start` (+316 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `package:flutter/material.dart` connect `App Configuration & Theme` to `Map & Location Services`, `API Client & Configuration`, `Owner Dashboard Screen`, `Notification & Queue Providers`, `Shop Detail & Notifications`, `Auth Provider & Service`, `Customer My Queues Screen`, `Splash Screen & Auth`, `Community 25`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `../config/theme.dart` connect `App Configuration & Theme` to `Map & Location Services`, `Owner Dashboard Screen`, `Shop Detail & Notifications`, `Customer My Queues Screen`, `Splash Screen & Auth`, `Community 25`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `package:go_router/go_router.dart` connect `Community 20` to `Map & Location Services`, `Owner Dashboard Screen`, `Shop Detail & Notifications`, `Customer My Queues Screen`, `Splash Screen & Auth`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _322 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Map & Location Services` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `App Configuration & Theme` be split into smaller, more focused modules?**
  _Cohesion score 0.05094130675526024 - nodes in this community are weakly interconnected._
- **Should `Windows Runner Components` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._